import { db } from "../firebase";
import {
    collection,
    getDocs
} from "firebase/firestore";

const vendasRef = collection(db, "vendas");
const produtosRef = collection(db, "produtos");

const numero = (valor, padrao = 0) => {
    const resultado = Number(valor);

    return Number.isFinite(resultado)
        ? resultado
        : padrao;
};

function formatarData(data) {
    if (!data) return "";

    if (typeof data === "string") {
        // Mantém datas armazenadas como YYYY-MM-DD.
        if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
            return data;
        }

        const convertida = new Date(data);

        if (!Number.isNaN(convertida.getTime())) {
            return dataISO(convertida);
        }

        return "";
    }

    if (data instanceof Date) {
        return dataISO(data);
    }

    if (typeof data.toDate === "function") {
        return dataISO(data.toDate());
    }

    return "";
}

function dataISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function formatarVenda(documento) {
    const dados = documento.data();

    const itens = Array.isArray(dados.itens)
        ? dados.itens.map((item) => ({
            id: String(item.id ?? item.produtoId ?? ""),
            nome: item.nome || "Produto sem nome",
            quantidade: Math.max(
                0,
                numero(item.quantidade)
            ),
            preco: Math.max(
                0,
                numero(item.preco)
            )
        }))
        : [];

    const subtotalCalculado = itens.reduce(
        (total, item) =>
            total + item.quantidade * item.preco,
        0
    );

    const descontoPercentual = Math.min(
        100,
        Math.max(0, numero(dados.desconto))
    );

    const valorDesconto =
        dados.valorDesconto !== undefined
            ? Math.max(0, numero(dados.valorDesconto))
            : subtotalCalculado * descontoPercentual / 100;

    const totalCalculado = Math.max(
        0,
        subtotalCalculado - valorDesconto
    );

    return {
        id: dados.numeroVenda ?? documento.id,
        data: formatarData(dados.data),
        cliente: dados.cliente || "Cliente não identificado",
        itens,
        pagamento: dados.pagamento || "Não informado",
        status: dados.status || "Concluída",
        total: Math.max(
            0,
            numero(dados.total, totalCalculado)
        )
    };
}

function formatarProduto(documento) {
    const dados = documento.data();

    return {
        id: documento.id,
        nome: dados.nome || "Produto sem nome",
        categoria: dados.categoria || "Outros",
        estoque: Math.max(
            0,
            numero(dados.estoque ?? dados.quantidade)
        ),
        estoqueMinimo: Math.max(
            0,
            numero(dados.estoqueMinimo ?? dados.minimo, 5)
        ),
        preco: Math.max(0, numero(dados.preco)),
        custo: Math.max(0, numero(dados.custo)),
        status: dados.status || "Ativo",
        vendidos: 0,
        receita: 0
    };
}

export async function listarDadosRelatorios() {
    const [snapshotVendas, snapshotProdutos] = await Promise.all([
        getDocs(vendasRef),
        getDocs(produtosRef)
    ]);

    const vendas = snapshotVendas.docs
        .map(formatarVenda)
        .sort((a, b) => b.data.localeCompare(a.data));

    const produtos = snapshotProdutos.docs
        .map(formatarProduto);


    const desempenho = new Map();

    for (const venda of vendas) {
        if (venda.status !== "Concluída") continue;

        for (const item of venda.itens) {
            const id = String(item.id);

            if (!desempenho.has(id)) {
                desempenho.set(id, {
                    vendidos: 0,
                    receita: 0
                });
            }

            const dados = desempenho.get(id);

            dados.vendidos += item.quantidade;
            dados.receita += item.quantidade * item.preco;
        }
    }

    const produtosComDesempenho = produtos.map((produto) => {
        const dados = desempenho.get(String(produto.id));

        return {
            ...produto,
            vendidos: dados?.vendidos ?? 0,
            receita: dados?.receita ?? 0
        };
    });

    return {
        vendas,
        produtos: produtosComDesempenho
    };
}

export async function listarVendasRelatorio() {
    const snapshot = await getDocs(vendasRef);

    return snapshot.docs
        .map(formatarVenda)
        .sort((a, b) => b.data.localeCompare(a.data));
}

export async function listarProdutosRelatorio() {
    const { produtos } = await listarDadosRelatorios();

    return produtos;
}
