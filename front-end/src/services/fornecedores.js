import { db } from "../firebase";
import {
    collection,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

const fornecedoresRef = collection(db, "fornecedores");

const dataAtual = () => {
    const data = new Date();

    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(data.getDate()).padStart(2, "0")}`;
};

export async function listarFornecedores() {
    const snapshot = await getDocs(fornecedoresRef);

    return snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
    }));
}

export async function cadastrarFornecedor(dados) {
    const novoFornecedor = {
        nome: dados.nome.trim(),
        documento: dados.documento || "",
        contato: dados.contato || "",
        email: dados.email || "",
        telefone: dados.telefone || "",
        cidade: dados.cidade || "",
        estado: (dados.estado || "").toUpperCase(),
        categoria: dados.categoria || "",
        status: dados.status || "Ativo",
        observacoes: dados.observacoes || "",
        dataCadastro: dataAtual(),
    };

    const referencia = await addDoc(fornecedoresRef, novoFornecedor);

    return {
        id: referencia.id,
        ...novoFornecedor,
    };
}

export async function atualizarFornecedor(id, dados) {
    const fornecedorAtualizado = {
        nome: dados.nome.trim(),
        documento: dados.documento || "",
        contato: dados.contato || "",
        email: dados.email || "",
        telefone: dados.telefone || "",
        cidade: dados.cidade || "",
        estado: (dados.estado || "").toUpperCase(),
        categoria: dados.categoria || "",
        status: dados.status || "Ativo",
        observacoes: dados.observacoes || "",
    };

    await updateDoc(doc(db, "fornecedores", id), fornecedorAtualizado);

    return {
        id,
        ...dados,
        ...fornecedorAtualizado,
    };
}

export async function alterarStatusFornecedor(id, status) {
    await updateDoc(doc(db, "fornecedores", id), { status });
}

export async function excluirFornecedor(id) {
    await deleteDoc(doc(db, "fornecedores", id));
}
