
import { db } from "../firebase";
import {
    collection,
    doc,
    getDocs,
    query,
    orderBy,
    runTransaction,
    serverTimestamp
} from "firebase/firestore";

const produtosRef = collection(db, "produtos");
const movimentacoesRef = collection(db, "movimentacoes");

function formatarProdutoEstoque(documento) {
    const dados = documento.data();

    return {
        id: documento.id,
        codigo: dados.codigo || `PRD-${documento.id.slice(0, 6).toUpperCase()}`,
        nome: dados.nome || "",
        categoria: dados.categoria || "Outros",
        quantidade: Number(dados.estoque ?? dados.quantidade ?? 0),
        minimo: Number(dados.estoqueMinimo ?? dados.minimo ?? 5),
        preco: Number(dados.preco ?? 0),
        custo: Number(dados.custo ?? 0),
        status: dados.status || "Ativo"
    };
}

function validarQuantidade(valor, nomeProduto) {
    const quantidade = Number(valor);

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        throw new Error(
            `Informe uma quantidade inteira positiva para ${nomeProduto}.`
        );
    }

    return quantidade;
}

export async function listarProdutosEstoque() {
    const snapshot = await getDocs(produtosRef);

    return snapshot.docs
        .map(formatarProdutoEstoque)
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export async function buscarProdutoEstoque(id) {
    const referencia = doc(db, "produtos", String(id));

    const snapshot = await runTransaction(db, async (transaction) => {
        return await transaction.get(referencia);
    });

    if (!snapshot.exists()) {
        throw new Error("Produto não encontrado.");
    }

    return formatarProdutoEstoque(snapshot);
}

export async function registrarMovimentacaoEstoque({
    tipo,
    itens
}) {
    if (!["entrada", "saida"].includes(tipo)) {
        throw new Error("Tipo de movimentação inválido.");
    }

    if (!Array.isArray(itens) || itens.length === 0) {
        throw new Error("Adicione pelo menos um produto à movimentação.");
    }

    const itensValidados = itens.map((item) => ({
        id: String(item.id),
        quantidade: validarQuantidade(
            item.quantidadeMovimentacao,
            item.nome || "produto"
        )
    }));

    const ids = itensValidados.map((item) => item.id);

    if (new Set(ids).size !== ids.length) {
        throw new Error(
            "Existe um produto duplicado na lista de movimentação."
        );
    }

    const referencias = itensValidados.map((item) => ({
        ...item,
        referencia: doc(db, "produtos", item.id)
    }));

    const movimentacaoRef = doc(movimentacoesRef);

    return await runTransaction(db, async (transaction) => {
        const snapshots = [];

        for (const item of referencias) {
            const snapshot = await transaction.get(item.referencia);

            if (!snapshot.exists()) {
                throw new Error(
                    `O produto de código ${item.id} não foi encontrado.`
                );
            }

            snapshots.push({
                ...item,
                snapshot
            });
        }

        const produtosAtualizados = snapshots.map((item) => {
            const dados = item.snapshot.data();
            const quantidadeAtual = Number(
                dados.estoque ?? dados.quantidade ?? 0
            );

            if (
                !Number.isInteger(quantidadeAtual) ||
                quantidadeAtual < 0
            ) {
                throw new Error(
                    `O estoque cadastrado de ${dados.nome || item.id} é inválido.`
                );
            }

            if (
                tipo === "saida" &&
                item.quantidade > quantidadeAtual
            ) {
                throw new Error(
                    `Estoque insuficiente para ${dados.nome || item.id}. Disponível: ${quantidadeAtual} unidade(s).`
                );
            }

            const novaQuantidade =
                tipo === "entrada"
                    ? quantidadeAtual + item.quantidade
                    : quantidadeAtual - item.quantidade;

            return {
                id: item.id,
                referencia: item.referencia,
                nome: dados.nome || "",
                categoria: dados.categoria || "Outros",
                quantidadeAnterior: quantidadeAtual,
                quantidadeMovimentada: item.quantidade,
                quantidadeAtualizada: novaQuantidade,
                preco: Number(dados.preco ?? 0),
                custo: Number(dados.custo ?? 0)
            };
        });

        const valorTotal = produtosAtualizados.reduce(
            (total, produto) =>
                total +
                produto.preco * produto.quantidadeMovimentada,
            0
        );

        for (const produto of produtosAtualizados) {
            transaction.update(produto.referencia, {
                estoque: produto.quantidadeAtualizada,
                atualizadoEm: serverTimestamp()
            });
        }

        transaction.set(movimentacaoRef, {
            tipo,
            itens: produtosAtualizados.map((produto) => ({
                produtoId: produto.id,
                nome: produto.nome,
                categoria: produto.categoria,
                quantidadeAnterior: produto.quantidadeAnterior,
                quantidadeMovimentada: produto.quantidadeMovimentada,
                quantidadeAtualizada: produto.quantidadeAtualizada,
                precoUnitario: produto.preco,
                valorTotal:
                    produto.preco * produto.quantidadeMovimentada
            })),
            quantidadeTotal: produtosAtualizados.reduce(
                (total, produto) =>
                    total + produto.quantidadeMovimentada,
                0
            ),
            valorTotal,
            data: serverTimestamp()
        });

        return {
            id: movimentacaoRef.id,
            tipo,
            quantidadeTotal: produtosAtualizados.reduce(
                (total, produto) =>
                    total + produto.quantidadeMovimentada,
                0
            ),
            valorTotal,
            itens: produtosAtualizados.map((produto) => ({
                ...produto,
                quantidade: produto.quantidadeAtualizada
            }))
        };
    });
}

export async function listarMovimentacoesEstoque() {
    const consulta = query(
        movimentacoesRef,
        orderBy("data", "desc")
    );

    const snapshot = await getDocs(consulta);

    return snapshot.docs.map((documento) => {
        const dados = documento.data();

        return {
            id: documento.id,
            tipo: dados.tipo || "",
            itens: dados.itens || [],
            quantidadeTotal: Number(dados.quantidadeTotal ?? 0),
            valorTotal: Number(dados.valorTotal ?? 0),
            data: dados.data?.toDate?.() ?? null
        };
    });
}
