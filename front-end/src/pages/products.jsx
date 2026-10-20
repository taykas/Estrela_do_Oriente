import { useEffect, useState } from "react";
import {
    Package,
    Menu,
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
    Tags,
    Boxes,
    DollarSign,
    AlertTriangle
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import {
    listarProdutos,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
} from "../services/products.js";

const categorias = [
    "Incensos",
    "Velas",
    "Acessórios",
    "Ervas",
    "Óleos",
    "Cristais",
    "Insumos",
    "Outros"
];

const produtoVazio = {
    nome: "",
    categoria: "Incensos",
    preco: "",
    custo: "",
    estoque: "",
    estoqueMinimo: "5",
    status: "Ativo"
};

const moeda = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

const campoClasse =
    "mt-2 w-full rounded-lg border border-[#e3dcc9] bg-[#faf9f5] px-3 py-3 text-sm text-[#45433d] outline-none transition focus:border-[#b99a43] focus:ring-2 focus:ring-[#b99a43]/10";

const indicadorClasse =
    "rounded-xl border border-[#e6dfcd] bg-[#fffefa] p-5 shadow-sm transition-all hover:border-[#d4bd7c]";

export const ProdutosPage = () => {
    const [produtos, setProdutos] = useState([]);
    const [busca, setBusca] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
    const [statusFiltro, setStatusFiltro] = useState("Todos");
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState(null);
    const [formulario, setFormulario] = useState(produtoVazio);
    const [menuAberto, setMenuAberto] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
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
            console.error("Erro ao carregar produtos:", error);
            setErro("Não foi possível carregar os produtos.");
        } finally {
            setCarregando(false);
        }
    }

    const produtosAtivos = produtos.filter(
        (produto) => produto.status === "Ativo"
    ).length;

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

    const produtosEstoqueBaixo = produtos.filter(
        (produto) =>
            produto.status === "Ativo" &&
            Number(produto.estoque || 0) <=
            Number(produto.estoqueMinimo || 0)
    ).length;

    const produtosFiltrados = produtos.filter((produto) => {
        const termo = busca.toLowerCase();

        const correspondeBusca =
            (produto.nome || "").toLowerCase().includes(termo) ||
            (produto.codigo || "").toLowerCase().includes(termo) ||
            (produto.categoria || "").toLowerCase().includes(termo);

        const correspondeCategoria =
            categoriaFiltro === "Todas" ||
            produto.categoria === categoriaFiltro;

        const correspondeStatus =
            statusFiltro === "Todos" ||
            produto.status === statusFiltro;

        return (
            correspondeBusca &&
            correspondeCategoria &&
            correspondeStatus
        );
    });


    function abrirCadastro() {
        setProdutoEditando(null);
        setFormulario({ ...produtoVazio });
        setErro("");
        setModalAberto(true);
    }


    function abrirEdicao(produto) {
        setProdutoEditando(produto);
        setFormulario({
            nome: produto.nome || "",
            categoria: produto.categoria || "Outros",
            preco: String(produto.preco ?? ""),
            custo: String(produto.custo ?? ""),
            estoque: String(produto.estoque ?? 0),
            estoqueMinimo: String(produto.estoqueMinimo ?? 0),
            status: produto.status || "Ativo"
        });
        setErro("");
        setModalAberto(true);
    }

    function atualizarCampo(campo, valor) {
        setFormulario((anterior) => ({
            ...anterior,
            [campo]: valor
        }));
    }

    async function salvarProduto(evento) {
        evento.preventDefault();
        setErro("");

        const nome = formulario.nome.trim();
        const preco = Number(formulario.preco);
        const custo = Number(formulario.custo);
        const estoque = Number(formulario.estoque);
        const estoqueMinimo = Number(formulario.estoqueMinimo);

        if (
            !nome ||
            formulario.preco === "" ||
            formulario.custo === "" ||
            formulario.estoque === "" ||
            formulario.estoqueMinimo === "" ||
            !Number.isFinite(preco) ||
            !Number.isFinite(custo) ||
            !Number.isFinite(estoque) ||
            !Number.isFinite(estoqueMinimo) ||
            preco < 0 ||
            custo < 0 ||
            estoque < 0 ||
            estoqueMinimo < 0 ||
            !Number.isInteger(estoque) ||
            !Number.isInteger(estoqueMinimo)
        ) {
            setErro(
                "Preencha os campos corretamente. Estoque e estoque mínimo devem ser números inteiros não negativos."
            );
            return;
        }

        const dadosProduto = {
            nome,
            categoria: formulario.categoria,
            preco,
            custo,
            estoque,
            estoqueMinimo,
            status: formulario.status
        };

        setSalvando(true);

        try {
            if (produtoEditando) {
                await atualizarProduto(
                    produtoEditando.id,
                    dadosProduto
                );
            } else {
                await cadastrarProduto(dadosProduto);
            }

            await carregarProdutos();
            setModalAberto(false);
            setProdutoEditando(null);
            setFormulario({ ...produtoVazio });
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            setErro(error.message || "Não foi possível salvar o produto.");
        } finally {
            setSalvando(false);
        }
    }

    async function removerProduto(produto) {
        const confirmar = window.confirm(
            `Deseja realmente excluir o produto "${produto.nome}"?`
        );

        if (!confirmar) return;

        setErro("");

        try {
            await excluirProduto(produto.id);
            setProdutos((anteriores) =>
                anteriores.filter((item) => item.id !== produto.id)
            );
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
            setErro(error.message || "Não foi possível excluir o produto.");
        }
    }

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
                <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-[#e3dcc9] bg-[#faf9f5]/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMenuAberto(true)}
                            className="text-[#98700a] lg:hidden"
                            aria-label="Abrir menu"
                        >
                            <Menu size={25} />
                        </button>

                        <div>
                            <h2
                                className="text-lg text-[#98700a] sm:text-xl"
                                style={{ fontFamily: "Corvel" }}
                            >
                                Gerenciamento de Produtos
                            </h2>
                            <p className="hidden text-xs text-[#89867d] sm:block">
                                Gerencie o catálogo da loja
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
                    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl font-medium text-[#78601e]">
                                Produtos
                            </h2>
                            <p className="mt-1 text-sm text-[#89867d]">
                                Gerencie o catálogo de produtos da loja.
                            </p>
                        </div>

                        <button
                            onClick={abrirCadastro}
                            className="flex items-center justify-center gap-2 rounded-lg bg-[#b18a20] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#98700a]"
                        >
                            <Plus size={19} />
                            Cadastrar produto
                        </button>
                    </section>

                    {erro && (
                        <div className="flex items-start gap-2 rounded-lg border border-[#e6c8c3] bg-[#fdf0ed] p-4 text-sm text-[#a94338]">
                            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                            <span>{erro}</span>
                        </div>
                    )}

                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            {
                                titulo: "Produtos cadastrados",
                                valor: produtos.length,
                                descricao: "Total de registros",
                                Icone: Package
                            },
                            {
                                titulo: "Produtos ativos",
                                valor: produtosAtivos,
                                descricao: "Disponíveis no catálogo",
                                Icone: Tags
                            },
                            {
                                titulo: "Unidades em estoque",
                                valor: totalEstoque,
                                descricao: "Soma das quantidades",
                                Icone: Boxes
                            },
                            {
                                titulo: "Valor de custo do estoque",
                                valor: moeda(valorEstoque),
                                descricao: "Custo das unidades disponíveis",
                                Icone: DollarSign
                            }
                        ].map(({ titulo, valor, descricao, Icone }) => (
                            <div key={titulo} className={indicadorClasse}>
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm text-[#77746b]">
                                        {titulo}
                                    </p>
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f5edda]">
                                        <Icone size={21} className="text-[#98700a]" />
                                    </div>
                                </div>
                                <p className="mt-5 break-words text-2xl font-semibold text-[#8b690e]">
                                    {valor}
                                </p>
                                <p className="mt-1 text-xs text-[#969187]">
                                    {descricao}
                                </p>
                            </div>
                        ))}
                    </section>

                    {produtosEstoqueBaixo > 0 && (
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
                                    {produtosEstoqueBaixo}{" "}
                                    {produtosEstoqueBaixo === 1
                                        ? "produto está"
                                        : "produtos estão"}{" "}
                                    com estoque igual ou abaixo do mínimo configurado.
                                </p>
                            </div>
                        </section>
                    )}

                    <section className="overflow-hidden rounded-xl border border-[#e6dfcd] bg-[#fffefa] shadow-sm">
                        <div className="border-b border-[#eee7d7] p-5">
                            <h2 className="text-lg font-medium text-[#78601e]">
                                Catálogo de produtos
                            </h2>
                            <p className="mt-1 text-xs text-[#918d83]">
                                Consulte e gerencie os itens cadastrados.
                            </p>
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
                                value={categoriaFiltro}
                                onChange={(evento) => setCategoriaFiltro(evento.target.value)}
                                className="rounded-md border border-[#e3dcc9] bg-[#faf9f5] px-3 py-2 text-sm outline-none"
                            >
                                <option value="Todas">Todas as categorias</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria} value={categoria}>
                                        {categoria}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={statusFiltro}
                                onChange={(evento) => setStatusFiltro(evento.target.value)}
                                className="rounded-md border border-[#e3dcc9] bg-[#faf9f5] px-3 py-2 text-sm outline-none"
                            >
                                <option value="Todos">Todos os status</option>
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto px-4 pb-4">
                            <table className="w-full min-w-[850px] text-left text-sm">
                                <thead>
                                    <tr className="bg-[#f5f1e7] text-xs text-[#89670d]">
                                        <th className="px-3 py-4 font-medium">Produto</th>
                                        <th className="px-3 py-4 font-medium">Código</th>
                                        <th className="px-3 py-4 font-medium">Categoria</th>
                                        <th className="px-3 py-4 font-medium">Preço</th>
                                        <th className="px-3 py-4 font-medium">Estoque</th>
                                        <th className="px-3 py-4 font-medium">Status</th>
                                        <th className="px-3 py-4 text-center font-medium">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {carregando ? (
                                        <tr>
                                            <td colSpan="7" className="px-3 py-10 text-center text-[#918d83]">
                                                Carregando produtos...
                                            </td>
                                        </tr>
                                    ) : produtosFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-3 py-10 text-center text-[#918d83]">
                                                Nenhum produto encontrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        produtosFiltrados.map((produto) => (
                                            <tr
                                                key={produto.id}
                                                className="border-t border-[#eee8dc] text-[#68645b] hover:bg-[#faf8f2]"
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
                                                <td className="px-3 py-4">{produto.codigo || "—"}</td>
                                                <td className="px-3 py-4">{produto.categoria || "—"}</td>
                                                <td className="whitespace-nowrap px-3 py-4">
                                                    {moeda(produto.preco)}
                                                </td>
                                                <td className="px-3 py-4">
                                                    {Number(produto.estoque || 0)}
                                                </td>
                                                <td className="px-3 py-4">
                                                    <span
                                                        className={`rounded-full border px-2.5 py-1 text-xs ${produto.status === "Ativo"
                                                            ? "border-[#b9d9c5] bg-[#edf7f0] text-[#32734a]"
                                                            : "border-[#e3dcc9] bg-[#f5f1e7] text-[#68645b]"
                                                            }`}
                                                    >
                                                        {produto.status || "Inativo"}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => abrirEdicao(produto)}
                                                            title="Editar produto"
                                                            className="rounded-md p-2 text-[#98700a] transition hover:bg-[#f5edda]"
                                                        >
                                                            <Pencil size={17} />
                                                        </button>
                                                        <button
                                                            onClick={() => removerProduto(produto)}
                                                            title="Excluir produto"
                                                            className="rounded-md p-2 text-[#b34b40] transition hover:bg-[#fdf0ed]"
                                                        >
                                                            <Trash2 size={17} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>

            {modalAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#35342f]/50 p-4">
                    <section className="my-8 w-full max-w-2xl rounded-xl border border-[#e6dfcd] bg-[#fffefa] shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#eee7d7] p-5">
                            <div>
                                <h2 className="text-lg font-medium text-[#78601e]">
                                    {produtoEditando ? "Editar produto" : "Cadastrar produto"}
                                </h2>
                                <p className="mt-1 text-xs text-[#918d83]">
                                    Preencha os dados do produto.
                                </p>
                            </div>
                            <button
                                onClick={() => setModalAberto(false)}
                                className="rounded-md p-2 text-[#77746b] hover:bg-[#f5f1e7]"
                                aria-label="Fechar"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={salvarProduto} className="space-y-4 p-5">
                            {erro && (
                                <p className="rounded-md bg-[#fdf0ed] p-3 text-sm text-[#a94338]">
                                    {erro}
                                </p>
                            )}

                            <div>
                                <label className="text-sm text-[#68645b]">Nome do produto</label>
                                <input
                                    required
                                    value={formulario.nome}
                                    onChange={(evento) => atualizarCampo("nome", evento.target.value)}
                                    className={campoClasse}
                                    placeholder="Ex.: Incenso natural"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-sm text-[#68645b]">Categoria</label>
                                    <select
                                        value={formulario.categoria}
                                        onChange={(evento) => atualizarCampo("categoria", evento.target.value)}
                                        className={campoClasse}
                                    >
                                        {categorias.map((categoria) => (
                                            <option key={categoria} value={categoria}>
                                                {categoria}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-[#68645b]">Status</label>
                                    <select
                                        value={formulario.status}
                                        onChange={(evento) => atualizarCampo("status", evento.target.value)}
                                        className={campoClasse}
                                    >
                                        <option value="Ativo">Ativo</option>
                                        <option value="Inativo">Inativo</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-[#68645b]">Preço de venda (R$)</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formulario.preco}
                                        onChange={(evento) => atualizarCampo("preco", evento.target.value)}
                                        className={campoClasse}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-[#68645b]">Custo unitário (R$)</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formulario.custo}
                                        onChange={(evento) => atualizarCampo("custo", evento.target.value)}
                                        className={campoClasse}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-[#68645b]">Quantidade em estoque</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={formulario.estoque}
                                        onChange={(evento) => atualizarCampo("estoque", evento.target.value)}
                                        className={campoClasse}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-[#68645b]">Estoque mínimo</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={formulario.estoqueMinimo}
                                        onChange={(evento) => atualizarCampo("estoqueMinimo", evento.target.value)}
                                        className={campoClasse}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#eee7d7] pt-4 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setModalAberto(false)}
                                    className="rounded-lg border border-[#e3dcc9] px-4 py-3 text-sm text-[#68645b] hover:bg-[#f5f1e7]"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="rounded-lg bg-[#b18a20] px-5 py-3 text-sm font-medium text-white hover:bg-[#98700a] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {salvando ? "Salvando..." : "Salvar produto"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
};

export default ProdutosPage;
