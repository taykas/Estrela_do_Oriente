import { db } from "../firebase";
import {
    collection,
    doc,
    getDocs,
    updateDoc,
    deleteDoc,
    setDoc
} from "firebase/firestore";

const produtosRef = collection(db, "produtos");

export async function listarProdutos() {
    const snapshot = await getDocs(produtosRef);

    return snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    }));
}

export async function cadastrarProduto(dados) {
    const nome = dados.nome?.trim();

    if (!nome) {
        throw new Error("Informe o nome do produto.");
    }

    const produtoRef = doc(produtosRef);

    const novoProduto = {
        nome,
        codigo: `PRD-${produtoRef.id.slice(0, 6).toUpperCase()}`,
        categoria: dados.categoria,
        preco: Number(dados.preco),
        custo: Number(dados.custo),
        estoque: Number(dados.estoque),
        estoqueMinimo: Number(dados.estoqueMinimo),
        status: dados.status || "Ativo"
    };

    await setDoc(produtoRef, novoProduto);

    return produtoRef.id;
}

export async function atualizarProduto(id, dados) {
    if (!id) {
        throw new Error("Produto não identificado.");
    }

    const dadosAtualizados = {
        ...dados,
        nome: dados.nome?.trim(),
        preco: Number(dados.preco),
        custo: Number(dados.custo),
        estoque: Number(dados.estoque),
        estoqueMinimo: Number(dados.estoqueMinimo)
    };

    await updateDoc(doc(db, "produtos", id), dadosAtualizados);
}

export async function excluirProduto(id) {
    if (!id) {
        throw new Error("Produto não identificado.");
    }

    await deleteDoc(doc(db, "produtos", id));
}
