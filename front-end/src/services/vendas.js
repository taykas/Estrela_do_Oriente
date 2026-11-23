import { db } from "../firebase";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    runTransaction,
    serverTimestamp
} from "firebase/firestore";

const produtosRef = collection(db, "produtos");
const vendasRef = collection(db, "vendas");

const numero = (valor, padrao = 0) => {
    const convertido = Number(valor);
    return Number.isFinite(convertido) ? convertido : padrao;
};

const dataLocal = () => {
    const agora = new Date();

    return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")}`;
};

function formatarProduto(documento) {
    const dados = documento.data();

    return {
        id: documento.id,
        nome: dados.nome || "Produto sem nome",
        categoria: dados.categoria || "Outros",
        quantidade: Math.max(
            0,
            numero(dados.estoque ?? dados.quantidade, 0)
        ),
        minimo: Math.max(
            0,
            numero(dados.estoqueMinimo ?? dados.minimo, 5)
        ),
        preco: Math.max(0, numero(dados.preco, 0)),
        status: dados.status || "Ativo"
    };
}

function formatarVenda(documento) {
    const dados = documento.data();
    let data = dados.data;

    if (data?.toDate) {
        const d = data.toDate();

        data = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }

    if (data instanceof Date) {
        data = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
    }

    return {
        id: dados.numeroVenda ?? documento.id,
        cliente: dados.cliente || "Cliente não identificado",

        data:
            typeof data === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(data)
                ? data
                : dataLocal(),

        itens: Array.isArray(dados.itens)
            ? dados.itens.map((item) => ({
                id: String(item.id ?? item.produtoId ?? ""),
                nome: item.nome || "Produto",
                quantidade: Math.max(
                    0,
                    numero(item.quantidade, 0)
                ),
                preco: Math.max(
                    0,
                    numero(item.preco, 0)
                )
            }))
            : [],

        pagamento: dados.pagamento || "Pix",

        crediario:
            dados.crediario === true ||
            dados.pagamento === "Crediário",

        desconto: Math.min(
            100,
            Math.max(0, numero(dados.desconto, 0))
        ),

        status: dados.status || "Concluída",

        criadoEm: dados.criadoEm?.toDate?.() ?? null
    };
}

export async function listarProdutosVenda() {
    const snapshot = await getDocs(produtosRef);

    return snapshot.docs
        .map(formatarProduto)
        .filter((produto) => produto.status !== "Inativo")
        .sort((a, b) =>
            a.nome.localeCompare(b.nome, "pt-BR")
        );
}

export async function listarVendas() {
    const snapshot = await getDocs(vendasRef);

    return snapshot.docs
        .map(formatarVenda)
        .sort((a, b) => {
            const dataA =
                a.criadoEm?.getTime?.() ??
                new Date(`${a.data}T00:00:00`).getTime();

            const dataB =
                b.criadoEm?.getTime?.() ??
                new Date(`${b.data}T00:00:00`).getTime();

            return (
                dataB - dataA ||
                String(b.id).localeCompare(
                    String(a.id),
                    "pt-BR",
                    { numeric: true }
                )
            );
        });
}

/**
 * Registra a venda e atualiza o estoque em uma única transação.
 * Os preços e nomes dos produtos são consultados no Firestore.
 */
export async function registrarVenda({
    cliente,
    data,
    itens,
    pagamento,
    crediario,
    desconto
}) {
    if (!Array.isArray(itens) || itens.length === 0) {
        throw new Error(
            "Adicione pelo menos um produto à venda."
        );
    }

    const descontoValidado = Math.min(
        100,
        Math.max(0, numero(desconto, 0))
    );

    if (!pagamento) {
        throw new Error(
            "Selecione uma forma de pagamento."
        );
    }

    const itensValidados = itens.map((item) => {
        const id = String(item.id ?? "").trim();
        const quantidade = Number(item.quantidade);

        if (!id) {
            throw new Error(
                "Um dos produtos selecionados não possui identificador válido."
            );
        }

        if (
            !Number.isInteger(quantidade) ||
            quantidade <= 0
        ) {
            throw new Error(
                "A quantidade de cada produto deve ser um número inteiro positivo."
            );
        }

        return {
            id,
            quantidade
        };
    });

    const ids = itensValidados.map((item) => item.id);

    if (new Set(ids).size !== ids.length) {
        throw new Error(
            "Há produtos duplicados no carrinho. Remova e adicione novamente o produto."
        );
    }

    const refs = itensValidados.map((item) => ({
        ...item,
        ref: doc(db, "produtos", item.id)
    }));

    const vendaRef = doc(vendasRef);

    return runTransaction(db, async (transaction) => {
        // Primeiro, todas as leituras são realizadas.
        const lidos = [];

        for (const item of refs) {
            const snapshot = await transaction.get(item.ref);

            if (!snapshot.exists()) {
                throw new Error(
                    `Um produto do carrinho não foi encontrado (código ${item.id}). Atualize a página e tente novamente.`
                );
            }

            lidos.push({
                ...item,
                snapshot
            });
        }

        // Valida os produtos e calcula o novo estoque.
        const itensVenda = lidos.map((item) => {
            const dados = item.snapshot.data();

            const estoqueAtual = numero(
                dados.estoque ?? dados.quantidade,
                0
            );

            const preco = numero(dados.preco, 0);

            if (
                !Number.isInteger(estoqueAtual) ||
                estoqueAtual < 0
            ) {
                throw new Error(
                    `O estoque de ${dados.nome || item.id} está inválido.`
                );
            }

            if (dados.status === "Inativo") {
                throw new Error(
                    `${dados.nome || "Este produto"} está inativo e não pode ser vendido.`
                );
            }

            if (item.quantidade > estoqueAtual) {
                throw new Error(
                    `Estoque insuficiente para ${dados.nome || item.id}. Disponível: ${estoqueAtual} unidade(s).`
                );
            }

            if (preco < 0) {
                throw new Error(
                    `O preço de ${dados.nome || item.id} é inválido.`
                );
            }

            return {
                id: item.id,
                nome: dados.nome || "Produto sem nome",
                quantidade: item.quantidade,
                preco,
                estoqueAnterior: estoqueAtual,
                estoqueAtualizado:
                    estoqueAtual - item.quantidade
            };
        });

        const subtotal = itensVenda.reduce(
            (soma, item) =>
                soma + item.quantidade * item.preco,
            0
        );

        const valorDesconto =
            subtotal * descontoValidado / 100;

        const total = Math.max(
            0,
            subtotal - valorDesconto
        );

        const dadosVenda = {
            cliente:
                String(
                    cliente || "Cliente não identificado"
                ).trim() || "Cliente não identificado",

            data:
                typeof data === "string" &&
                /^\d{4}-\d{2}-\d{2}$/.test(data)
                    ? data
                    : dataLocal(),

            itens: itensVenda.map(
                ({ id, nome, quantidade, preco }) => ({
                    id,
                    nome,
                    quantidade,
                    preco
                })
            ),

            pagamento:
                crediario ? "Crediário" : pagamento,

            crediario: Boolean(
                crediario || pagamento === "Crediário"
            ),

            desconto: descontoValidado,
            subtotal,
            valorDesconto,
            total,
            status: crediario || pagamento === "Crediário"
                ? "Pendente"
                : "Concluída",
            criadoEm: serverTimestamp()
        };

        // Atualiza o estoque de cada produto.
        for (const item of lidos) {
            const atualizado = itensVenda.find(
                (vendaItem) => vendaItem.id === item.id
            );

            transaction.update(item.ref, {
                estoque: atualizado.estoqueAtualizado,
                atualizadoEm: serverTimestamp()
            });
        }

        // Salva a venda no Firestore.
        transaction.set(vendaRef, dadosVenda);

        return {
            id: vendaRef.id,
            ...dadosVenda,
            criadoEm: new Date()
        };
    });
}

export async function concluirVenda(id) {
    if (!id) {
        throw new Error("Identificador da venda inválido.");
    }

    const vendaRef = doc(db, "vendas", id);

    const vendaSnapshot = await getDoc(vendaRef);

    if (!vendaSnapshot.exists()) {
        throw new Error("Venda não encontrada.");
    }

    const venda = vendaSnapshot.data();

    if (venda.status !== "Pendente") {
        throw new Error("Esta venda não está pendente.");
    }

    await updateDoc(vendaRef, {
        status: "Concluída",
        atualizadoEm: serverTimestamp()
    });

    return {
        id,
        ...venda,
        status: "Concluída"
    };
}