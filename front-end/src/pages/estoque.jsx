import { useEffect, useState } from "react";
import {
    Package,
    Menu,
    Search,
    Plus,
    X,
    Boxes,
    DollarSign,
    AlertTriangle,
    CircleAlert,
    ArrowDownToLine,
    ArrowUpFromLine
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { listarProdutos } from "../services/products.js";
import { registrarMovimentacao } from "../services/estoque.js";

const moeda = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

const obterStatus = (produto) => {
    const quantidade = Number(produto.estoque || 0);
    const minimo = Number(produto.estoqueMinimo || 0);

    if (quantidade === 0) return "Sem estoque";
    if (quantidade <= minimo) return "Estoque baixo";

    return "Normal";
};

const campoClasse =
    "mt-2 w-full rounded-md border border-[#e3dcc9] bg-[#faf9f5] px-3 py-3 text-sm text-[#45433d] outline-none transition focus:border-[#b18a20]";

export const Estoque = () => {
    const navegar = useNavigate();

    const [produtos, setProdutos] = useState([]);
    const [busca, setBusca] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
    const [statusSelecionado, setStatusSelecionado] = useState("Todos");

    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [tipoMovimentacao, setTipoMovimentacao] = useState("entrada");
    const [quantidade, setQuantidade] = useState("");

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarProdutos();
    }, []);

    async function carregarProdutos() {
        setCarregando(true);
        setErro("");

        try {
            const dados = await listarProdutos();
            setProdutos(dados);
        } catch (error) {
            console.error("Erro ao carregar estoque:", error);
            setErro("Não foi possível carregar os produtos do estoque.");
        } finally {
            setCarregando(false);
        }
    }

    const totalProdutos = produtos.length;

    const totalEstoque = produtos.reduce(
        (total, produto) => total + Number(produto.estoque || 0),
        0
    );

    const valorEstoque = produtos.reduce(
        (total, produto) =>
            total +
            Number(produto.estoque || 0) *
                Number(produto.custo || 0),
        0
    );

    const produtosBaixos = produtos.filter(
        (produto) =>
            Number(produto.estoque || 0) > 0 &&
            Number(produto.estoque || 0) <=
                Number(produto.estoqueMinimo || 0)
    ).length;

    const produtosSemEstoque = produtos.filter(
        (produto) => Number(produto.estoque || 0) === 0
    ).length;

    const categorias = [
        ...new Set(
            produtos
                .map((produto) => produto.categoria)
                .filter(Boolean)
        )
    ].sort((a, b) => a.localeCompare(b, "pt-BR"));

    const produtosFiltrados = produtos.filter((produto) => {
        const termo = busca.toLowerCase();

        const correspondeBusca =
            (produto.nome || "").toLowerCase().includes(termo) ||
            (produto.categoria || "").toLowerCase().includes(termo) ||
            (produto.codigo || "").toLowerCase().includes(termo);

        const correspondeCategoria =
            categoriaSelecionada === "Todas" ||
            produto.categoria === categoriaSelecionada;

        const status = obterStatus(produto);

        const correspondeStatus =
            statusSelecionado === "Todos" ||
            status === statusSelecionado;

        return (
            correspondeBusca &&
            correspondeCategoria &&
            correspondeStatus
        );
    });

    function abrirMovimentacao(tipo, produto = null) {
        setTipoMovimentacao(tipo);
        setProdutoSelecionado(produto);
        setQuantidade("");
        setMensagem("");
        setErro("");
    }

    function fecharModal() {
        if (salvando) return;

        setProdutoSelecionado(null);
        setQuantidade("");
        setMensagem("");
        setErro("");
    }

    async function salvarMovimentacao(evento) {
        evento.preventDefault();
        setMensagem("");
        setErro("");

        const quantidadeNumerica = Number(quantidade);

        if (!produtoSelecionado) {
            setErro("Selecione um produto.");
            return;
        }

        if (
            quantidade === "" ||
            !Number.isInteger(quantidadeNumerica) ||
            quantidadeNumerica <= 0
        ) {
            setErro("Informe uma quantidade inteira maior que zero.");
            return;
        }

        if (
            tipoMovimentacao === "saida" &&
            quantidadeNumerica > Number(produtoSelecionado.estoque || 0)
        ) {
            setErro("A quantidade de saída excede o estoque disponível.");
            return;
        }

        setSalvando(true);

        try {
            await registrarMovimentacao({
                produtoId: produtoSelecionado.id,
                tipo: tipoMovimentacao,
                quantidade: quantidadeNumerica
            });

            setMensagem(
                `${tipoMovimentacao === "entrada" ? "Entrada" : "Saída"} de ${quantidadeNumerica} unidade(s) registrada com sucesso.`
            );

            await carregarProdutos();

            setProdutoSelecionado(null);
            setQuantidade("");
        } catch (error) {
            console.error("Erro ao registrar movimentação:", error);
            setErro(
                error.message || "Não foi possível registrar a movimentação."
            );
        } finally {
            setSalvando(false);
        }
    }

    const indicadores = [
        {
            titulo: "Total de Produtos",
            valor: totalProdutos,
            descricao: "Produtos cadastrados",
            Icone: Boxes
        },
        {
            titulo: "Unidades em Estoque",
            valor: totalEstoque,
            descricao: "Soma das quantidades",
            Icone: Package
        },
        {
            titulo: "Valor de Custo do Estoque",
            valor: moeda(valorEstoque),
            descricao: "Custo das unidades disponíveis",
            Icone: DollarSign
        },
        {
            titulo: "Produtos em Falta",
            valor: produtosSemEstoque,
            descricao: `${produtosBaixos} com estoque baixo`,
            Icone: CircleAlert
        }
    ];

    return (
        <div className="min-h-screen bg-[#f3f1eb] text-[#35342f]">
            <Sidebar />

            {menuAberto && (
                <button
                    aria-label="Fechar menu"
                    onClick={() => setMenuAberto(false)}
                    className="fixed inset-0 z-40 bg-[#35342f]/40 backdrop-blur-sm lg:hidden"
                />
            )}

            <div className="min-h-screen lg:ml-60">
                <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-[#e6dfcd] bg-[#faf9f5]/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMenuAberto(true)}
                            className="text-[#98700a] lg:hidden"
                            aria-label="Abrir menu"
                        >
                            <Menu size={25} />
                        </button>

                        {/* <div>
                            <h2
                                className="text-xl text-[#89670d] sm:text-2xl"
                                style={{ fontFamily: "Corvel" }}
                            >
                                Estoque
                            </h2>
                            <p className="text-xs text-[#77746b]">
                                Controle de produtos e inventário
                            </p>
                        </div> */}

                        <div>
                            <h2
                                className="text-lg text-[#98700a] sm:text-xl"
                                style={{ fontFamily: "Corvel" }}
                            >
                                Esto<span style={{ marginRight: "0.1px" }}></span>que
                            </h2>
                            <p className="hidden text-xs text-[#89867d] sm:block">
                                Controle de produtos e inventário
                            </p>
                        </div>
                    </div>

                    {/* <div className="hidden items-center gap-2 rounded-md border border-[#e3dcc9] bg-[#fffefa] px-3 py-2 sm:flex">
                        <Search size={17} className="text-[#918d83]" />
                        <input
                            value={busca}
                            onChange={(evento) => setBusca(evento.target.value)}
                            placeholder="Buscar produto..."
                            className="w-36 bg-transparent text-sm outline-none placeholder:text-[#918d83] lg:w-48"
                        />
                    </div> */}
                </header>

                <main className="space-y-6 p-4 sm:p-6 lg:p-8">
                    {mensagem && (
                        <div className="rounded-lg border border-[#b9d9c5] bg-[#edf7f0] p-4 text-sm text-[#32734a]">
                            {mensagem}
                        </div>
                    )}

                    {erro && !produtoSelecionado && (
                        <div className="flex items-start gap-2 rounded-lg border border-[#e6c8c3] bg-[#fdf0ed] p-4 text-sm text-[#a94338]">
                            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                            {erro}
                        </div>
                    )}

                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <button
                            onClick={() => abrirMovimentacao("entrada")}
                            disabled={produtos.length === 0}
                            className="flex items-center gap-4 rounded-lg bg-[#98700a] p-5 text-left text-white transition hover:bg-[#806009] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-white/15">
                                <ArrowDownToLine size={26} />
                            </div>
                            <div>
                                <p className="text-base font-semibold">
                                    Entrada de estoque
                                </p>
                                <p className="mt-1 text-sm text-white/80">
                                    Adicionar unidades aos produtos
                                </p>
                            </div>
                            <Plus size={20} className="ml-auto shrink-0" />
                        </button>

                        <button
                            onClick={() => abrirMovimentacao("saida")}
                            disabled={produtos.length === 0}
                            className="flex items-center gap-4 rounded-lg border border-[#e6c8c3] bg-[#fff9f7] p-5 text-left transition hover:bg-[#fdf0ed] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#f8e7e3] text-[#b34b40]">
                                <ArrowUpFromLine size={26} />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-[#a94338]">
                                    Saída de estoque
                                </p>
                                <p className="mt-1 text-sm text-[#77746b]">
                                    Registrar retirada de produtos
                                </p>
                            </div>
                            <Plus size={20} className="ml-auto shrink-0 text-[#b34b40]" />
                        </button>
                    </section>

                    <section>
                        <h2 className="mb-4 text-lg text-[#89670d]">
                            Resumo do Estoque
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {indicadores.map(({ titulo, valor, descricao, Icone }) => (
                                <div
                                    key={titulo}
                                    className="rounded-lg border border-[#e6dfcd] bg-[#fffefa] p-5 transition-colors hover:border-[#c8b77e]"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm text-[#68645b]">
                                            {titulo}
                                        </p>
                                        <Icone
                                            size={23}
                                            className="shrink-0 text-[#98700a]"
                                            strokeWidth={1.7}
                                        />
                                    </div>
                                    <p className="mt-5 break-words text-2xl font-semibold text-[#89670d]">
                                        {valor}
                                    </p>
                                    <p className="mt-1 text-xs text-[#918d83]">
                                        {descricao}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {produtosBaixos > 0 && (
                        <section className="flex items-start gap-3 rounded-xl border border-[#e8d9b4] bg-[#f8f1df] p-4">
                            <AlertTriangle
                                size={21}
                                className="mt-0.5 shrink-0 text-[#98700a]"
                            />
                            <div>
                                <p className="text-sm font-medium text-[#78601e]">
                                    Atenção ao estoque
                                </p>
                                <p className="mt-1 text-sm text-[#81734e]">
                                    {produtosBaixos}{" "}
                                    {produtosBaixos === 1
                                        ? "produto está"
                                        : "produtos estão"}{" "}
                                    com estoque baixo.
                                </p>
                            </div>
                        </section>
                    )}

                    <section className="overflow-hidden rounded-lg border border-[#e6dfcd] bg-[#fffefa]">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6dfcd] p-5">
                            <div className="flex items-center gap-2">
                                <Package size={21} className="text-[#98700a]" />
                                <h2 className="text-lg text-[#89670d]">
                                    Produtos em Estoque
                                </h2>
                            </div>

                            <button
                                onClick={() => navegar("/produtos")}
                                className="flex items-center gap-2 rounded-md border border-[#c8b77e] px-3 py-2 text-sm text-[#89670d] transition hover:bg-[#f1e8d1]"
                            >
                                <Plus size={17} />
                                Cadastrar Produto
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
                            <div className="flex items-center gap-2 rounded-md border border-[#e3dcc9] bg-[#faf9f5] px-3 py-2">
                                <Search size={17} className="shrink-0 text-[#918d83]" />
                                <input
                                    value={busca}
                                    onChange={(evento) => setBusca(evento.target.value)}
                                    placeholder="Buscar por nome ou código..."
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#918d83]"
                                />
                            </div>

                            <select
                                value={categoriaSelecionada}
                                onChange={(evento) => setCategoriaSelecionada(evento.target.value)}
                                className="rounded-md border border-[#e3dcc9] bg-[#faf9f5] px-3 py-2 text-sm text-[#68645b] outline-none focus:border-[#b18a20]"
                            >
                                <option value="Todas">Todas as categorias</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria} value={categoria}>
                                        {categoria}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={statusSelecionado}
                                onChange={(evento) => setStatusSelecionado(evento.target.value)}
                                className="rounded-md border border-[#e3dcc9] bg-[#faf9f5] px-3 py-2 text-sm text-[#68645b] outline-none focus:border-[#b18a20]"
                            >
                                <option value="Todos">Todos os status</option>
                                <option value="Normal">Normal</option>
                                <option value="Estoque baixo">Estoque baixo</option>
                                <option value="Sem estoque">Sem estoque</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto px-4 pb-4">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead>
                                    <tr className="bg-[#f5f1e7] text-xs text-[#89670d]">
                                        <th className="px-3 py-4 font-medium">Produto</th>
                                        <th className="px-3 py-4 font-medium">Categoria</th>
                                        <th className="px-3 py-4 font-medium">Estoque Atual</th>
                                        <th className="px-3 py-4 font-medium">Estoque Mínimo</th>
                                        <th className="px-3 py-4 font-medium">Status</th>
                                        <th className="px-3 py-4 text-center font-medium">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {carregando ? (
                                        <tr>
                                            <td colSpan="6" className="px-3 py-10 text-center text-[#918d83]">
                                                Carregando estoque...
                                            </td>
                                        </tr>
                                    ) : produtosFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-3 py-10 text-center text-[#918d83]">
                                                Nenhum produto encontrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        produtosFiltrados.map((produto) => {
                                            const status = obterStatus(produto);
                                            const estoqueAtual = Number(produto.estoque || 0);
                                            const estoqueMinimo = Number(produto.estoqueMinimo || 0);

                                            return (
                                                <tr
                                                    key={produto.id}
                                                    className="border-t border-[#eee8dc] text-[#68645b] transition-colors hover:bg-[#faf8f2]"
                                                >
                                                    <td className="whitespace-nowrap px-3 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#e6dfcd] bg-[#f5f1e7]">
                                                                <Package size={18} className="text-[#98700a]" />
                                                            </div>
                                                            <span className="font-medium text-[#45433d]">
                                                                {produto.nome}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-4">
                                                        {produto.categoria || "—"}
                                                    </td>
                                                    <td
                                                        className={`px-3 py-4 font-medium ${
                                                            estoqueAtual === 0
                                                                ? "text-[#b34b40]"
                                                                : estoqueAtual <= estoqueMinimo
                                                                    ? "text-[#98700a]"
                                                                    : "text-[#45433d]"
                                                        }`}
                                                    >
                                                        {estoqueAtual}
                                                    </td>
                                                    <td className="px-3 py-4">
                                                        {estoqueMinimo}
                                                    </td>
                                                    <td className="px-3 py-4">
                                                        <span
                                                            className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs ${
                                                                status === "Normal"
                                                                    ? "border-[#b9d9c5] bg-[#edf7f0] text-[#32734a]"
                                                                    : status === "Sem estoque"
                                                                        ? "border-[#e6c8c3] bg-[#fdf0ed] text-[#b34b40]"
                                                                        : "border-[#e8d9b4] bg-[#f8f1df] text-[#98700a]"
                                                            }`}
                                                        >
                                                            {status}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-4">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => abrirMovimentacao("entrada", produto)}
                                                                title="Registrar entrada"
                                                                className="rounded-md p-2 text-[#32734a] hover:bg-[#edf7f0]"
                                                            >
                                                                <ArrowDownToLine size={17} />
                                                            </button>
                                                            <button
                                                                onClick={() => abrirMovimentacao("saida", produto)}
                                                                title="Registrar saída"
                                                                disabled={estoqueAtual === 0}
                                                                className="rounded-md p-2 text-[#b34b40] hover:bg-[#fdf0ed] disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                <ArrowUpFromLine size={17} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>

            {produtoSelecionado !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#35342f]/50 p-4">
                    <section className="my-8 w-full max-w-lg rounded-xl border border-[#e6dfcd] bg-[#fffefa] shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#eee7d7] p-5">
                            <div>
                                <h2 className="text-lg font-medium text-[#78601e]">
                                    {tipoMovimentacao === "entrada"
                                        ? "Entrada de estoque"
                                        : "Saída de estoque"}
                                </h2>
                                <p className="mt-1 text-xs text-[#918d83]">
                                    Registre a movimentação do produto.
                                </p>
                            </div>
                            <button
                                onClick={fecharModal}
                                disabled={salvando}
                                className="rounded-md p-2 text-[#77746b] hover:bg-[#f5f1e7]"
                                aria-label="Fechar"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={salvarMovimentacao} className="space-y-4 p-5">
                            {erro && (
                                <p className="rounded-md border border-[#e6c8c3] bg-[#fdf0ed] p-3 text-sm text-[#a94338]">
                                    {erro}
                                </p>
                            )}

                            <div>
                                <label className="text-sm text-[#68645b]">
                                    Produto
                                </label>
                                <select
                                    required
                                    value={produtoSelecionado.id}
                                    onChange={(evento) => {
                                        const produto = produtos.find(
                                            (item) => item.id === evento.target.value
                                        );
                                        setProdutoSelecionado(produto || null);
                                        setErro("");
                                    }}
                                    className={campoClasse}
                                >
                                    {produtos.map((produto) => (
                                        <option key={produto.id} value={produto.id}>
                                            {produto.nome} — estoque: {Number(produto.estoque || 0)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-[#68645b]">
                                    Tipo de movimentação
                                </label>
                                <select
                                    value={tipoMovimentacao}
                                    onChange={(evento) => setTipoMovimentacao(evento.target.value)}
                                    className={campoClasse}
                                >
                                    <option value="entrada">Entrada</option>
                                    <option value="saida">Saída</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-[#68645b]">
                                    Quantidade
                                </label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={quantidade}
                                    onChange={(evento) => setQuantidade(evento.target.value)}
                                    className={campoClasse}
                                    placeholder="Informe a quantidade"
                                />
                                <p className="mt-2 text-xs text-[#918d83]">
                                    Estoque atual: {Number(produtoSelecionado.estoque || 0)} unidade(s)
                                </p>
                            </div>

                            <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#eee7d7] pt-4 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={fecharModal}
                                    disabled={salvando}
                                    className="rounded-lg border border-[#e3dcc9] px-4 py-3 text-sm text-[#68645b] hover:bg-[#f5f1e7]"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="rounded-lg bg-[#98700a] px-5 py-3 text-sm font-medium text-white hover:bg-[#806009] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {salvando ? "Registrando..." : "Registrar movimentação"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
};

export default Estoque;
