import { db } from "../firebase";

import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";

const produtosRef = collection(db, "produtos");

function formatarProduto(documento) {
    const dados = documento.data();

    return {
        id: documento.id,
        codigo: dados.codigo || `PRD-${documento.id.slice(0, 6).toUpperCase()}`,
        codigoBarras: dados.codigoBarras || "",
        nome: dados.nome || "",
        categoria: dados.categoria || "Outros",
        preco: Number(dados.preco ?? 0),
        custo: Number(dados.custo ?? 0),
        estoque: Number(dados.estoque ?? 0),
        estoqueMinimo: Number(dados.estoqueMinimo ?? 5),
        status: dados.status || "Ativo"
    };
}

export function gerarCodigoBarras(id) {
    const identificador = String(id)
        .replace(/\D/g, "")
        .slice(-9)
        .padStart(9, "0");

    return `200${identificador}`;
}

export async function listarProdutos() {
    const snapshot = await getDocs(produtosRef);

    return snapshot.docs.map(formatarProduto);
}

export async function buscarProduto(id) {
    const referencia = doc(db, "produtos", String(id));
    const snapshot = await getDoc(referencia);

    if (!snapshot.exists()) {
        return null;
    }

    return formatarProduto(snapshot);
}

export async function cadastrarProduto(dadosProduto) {
    const dados = {
        nome: dadosProduto.nome.trim(),
        categoria: dadosProduto.categoria,
        preco: Number(dadosProduto.preco),
        custo: Number(dadosProduto.custo),
        estoque: Number(dadosProduto.estoque),
        estoqueMinimo: Number(dadosProduto.estoqueMinimo),
        status: dadosProduto.status,
        codigoBarras: String(dadosProduto.codigoBarras || "").trim(),
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp()
    };

    const referencia = await addDoc(produtosRef, dados);

    const codigo = `PRD-${referencia.id.slice(0, 6).toUpperCase()}`;

    await updateDoc(referencia, { codigo });

    const snapshot = await getDoc(referencia);

    return formatarProduto(snapshot);
}

export async function atualizarProduto(id, dadosProduto) {
    const referencia = doc(db, "produtos", String(id));
    const snapshot = await getDoc(referencia);

    if (!snapshot.exists()) {
        throw new Error("O produto não foi encontrado no Firestore.");
    }

    const dados = {
        nome: dadosProduto.nome.trim(),
        categoria: dadosProduto.categoria,
        preco: Number(dadosProduto.preco),
        custo: Number(dadosProduto.custo),
        estoque: Number(dadosProduto.estoque),
        estoqueMinimo: Number(dadosProduto.estoqueMinimo),
        status: dadosProduto.status,
        codigoBarras: String(dadosProduto.codigoBarras || "").trim(),
        atualizadoEm: serverTimestamp()
    };

    await updateDoc(referencia, dados);

    const produtoAtualizado = await getDoc(referencia);

    return formatarProduto(produtoAtualizado);
}

export async function excluirProduto(id) {
    const referencia = doc(db, "produtos", String(id));
    const snapshot = await getDoc(referencia);

    if (!snapshot.exists()) {
        throw new Error("O produto não foi encontrado no Firestore.");
    }

    await deleteDoc(referencia);

    return true;
}