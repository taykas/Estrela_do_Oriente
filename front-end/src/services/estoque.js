
import { db } from "../firebase";
import {
    collection,
    doc,
    runTransaction,
    serverTimestamp,
    getDocs,
    query,
    orderBy
} from "firebase/firestore";

export async function registrarMovimentacao({
    produtoId,
    tipo,
    quantidade
}) {
    if (!produtoId) {
        throw new Error("Selecione um produto.");
    }

    if (!["entrada", "saida"].includes(tipo)) {
        throw new Error("Tipo de movimentação inválido.");
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        throw new Error("A quantidade deve ser um inteiro maior que zero.");
    }

    const produtoRef = doc(db, "produtos", produtoId);
    const movimentacaoRef = doc(collection(db, "movimentacoesEstoque"));

    await runTransaction(db, async (transacao) => {
        const snapshot = await transacao.get(produtoRef);

        if (!snapshot.exists()) {
            throw new Error("Produto não encontrado.");
        }

        const produto = snapshot.data();
        const estoqueAnterior = Number(produto.estoque);

        if (!Number.isInteger(estoqueAnterior) || estoqueAnterior < 0) {
            throw new Error("O estoque atual do produto é inválido.");
        }

        if (tipo === "saida" && quantidade > estoqueAnterior) {
            throw new Error("A quantidade de saída excede o estoque disponível.");
        }

        const estoqueAtual =
            tipo === "entrada"
                ? estoqueAnterior + quantidade
                : estoqueAnterior - quantidade;

        transacao.update(produtoRef, {
            estoque: estoqueAtual
        });

        transacao.set(movimentacaoRef, {
            produtoId,
            produtoNome: produto.nome,
            tipo,
            quantidade,
            estoqueAnterior,
            estoqueAtual,
            data: serverTimestamp()
        });
    });

    return movimentacaoRef.id;
}

export async function listarMovimentacoes() {
    const movimentacoesRef = collection(db, "movimentacoesEstoque");

    const consulta = query(
        movimentacoesRef,
        orderBy("data", "desc")
    );

    const snapshot = await getDocs(consulta);

    return snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    }));
}
