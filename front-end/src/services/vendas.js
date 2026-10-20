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

const vendasRef = collection(db, "vendas");
const produtosRef = collection(db, "produtos");

const formatarData = (timestamp) => {
    if (!timestamp) return "";

    const data = timestamp.toDate();

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
};

export async function listarVendas() {
    const consulta = query(vendasRef, orderBy("data", "desc"));
    const snapshot = await getDocs(consulta);

    return snapshot.docs.map((documento) => {
        const dados = documento.data();

        return {
            id: documento.id,
            cliente: dados.cliente,
            data: formatarData(dados.data),
            itens: dados.itens || [],
            pagamento: dados.pagamento,
            desconto: dados.desconto || 0,
            subtotal: dados.subtotal ?? 0,
            total: dados.total ?? 0,
            status: dados.status || "Concluída"
        };
    });
}

export async function registrarVenda({
    cliente,
    itens,
    pagamento,
    desconto = 0
}) {
    if (!Array.isArray(itens) || itens.length === 0) {
        throw new Error("Adicione pelo menos um produto à venda.");
    }

    const descontoNumerico = Number(desconto);

    if (
        !Number.isFinite(descontoNumerico) ||
        descontoNumerico < 0 ||
        descontoNumerico > 100
    ) {
        throw new Error("O desconto deve estar entre 0 e 100%.");
    }

    if (!pagamento) {
        throw new Error("Informe a forma de pagamento.");
    }

    const quantidades = new Map();

    for (const item of itens) {
        if (
            !item.id ||
            !Number.isInteger(item.quantidade) ||
            item.quantidade <= 0
        ) {
            throw new Error("Existe um item inválido na venda.");
        }

        quantidades.set(
            item.id,
            (quantidades.get(item.id) || 0) + item.quantidade
        );
    }

    const itensAgrupados = [...quantidades.entries()].map(
        ([id, quantidade]) => ({
            id,
            quantidade,
            referencia: doc(produtosRef, id)
        })
    );

    const vendaRef = doc(vendasRef);

    await runTransaction(db, async (transacao) => {
        const documentos = await Promise.all(
            itensAgrupados.map(({ referencia }) =>
                transacao.get(referencia)
            )
        );

        const itensVenda = [];
        let subtotal = 0;

        documentos.forEach((documento, index) => {
            const item = itensAgrupados[index];

            if (!documento.exists()) {
                throw new Error("Um dos produtos não foi encontrado.");
            }

            const produto = documento.data();
            const estoqueAtual = produto.estoque;

            if (
                !Number.isInteger(estoqueAtual) ||
                estoqueAtual < item.quantidade
            ) {
                throw new Error(
                    `Estoque insuficiente para ${produto.nome}. Disponível: ${estoqueAtual ?? 0}.`
                );
            }

            const preco = Number(produto.preco);

            if (!Number.isFinite(preco) || preco < 0) {
                throw new Error(
                    `Preço inválido para ${produto.nome}.`
                );
            }

            itensVenda.push({
                id: item.id,
                nome: produto.nome,
                preco,
                quantidade: item.quantidade
            });

            subtotal += preco * item.quantidade;
        });

        const total = Number(
            (subtotal * (1 - descontoNumerico / 100)).toFixed(2)
        );

        itensAgrupados.forEach((item, index) => {
            const produto = documentos[index].data();

            transacao.update(item.referencia, {
                estoque: produto.estoque - item.quantidade
            });
        });

        transacao.set(vendaRef, {
            cliente: cliente?.trim() || "Cliente não identificado",
            data: serverTimestamp(),
            itens: itensVenda,
            pagamento,
            desconto: descontoNumerico,
            subtotal: Number(subtotal.toFixed(2)),
            total,
            status: "Concluída"
        });
    });

    return vendaRef.id;
}