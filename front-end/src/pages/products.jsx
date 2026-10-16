import { useState } from "react";
import {
    Package,
    Menu,
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
    AlertTriangle,
    Boxes,
    DollarSign,
    Tags,
    ChevronDown
} from "lucide-react";

import Sidebar from "../components/Sidebar";

const produtosIniciais = [
    {
        id: 1,
        codigo: "PRD-001",
        nome: "Incenso Natural",
        categoria: "Incensos",
        preco: 12.9,
        custo: 6.5,
        estoque: 3,
        estoqueMinimo: 10,
        status: "Ativo"
    },
    {
        id: 2,
        codigo: "PRD-002",
        nome: "Vela de 7 Dias",
        categoria: "Velas",
        preco: 18.9,
        custo: 9.5,
        estoque: 25,
        estoqueMinimo: 10,
        status: "Ativo"
    },
    {
        id: 3,
        codigo: "PRD-003",
        nome: "Patua",
        categoria: "Acessórios",
        preco: 24.9,
        custo: 12,
        estoque: 2,
        estoqueMinimo: 5,
        status: "Ativo"
    },
    {
        id: 4,
        codigo: "PRD-004",
        nome: "Erva de Proteção",
        categoria: "Ervas",
        preco: 9.9,
        custo: 4.5,
        estoque: 4,
        estoqueMinimo: 10,
        status: "Ativo"
    },
    {
        id: 5,
        codigo: "PRD-005",
        nome: "Óleo de Unção",
        categoria: "Óleos",
        preco: 32.9,
        custo: 16,
        estoque: 2,
        estoqueMinimo: 5,
        status: "Ativo"
    },
    {
        id: 6,
        codigo: "PRD-006",
        nome: "Vela Aromática",
        categoria: "Velas",
        preco: 22.5,
        custo: 11,
        estoque: 18,
        estoqueMinimo: 5,
        status: "Ativo"
    },
    {
        id: 7,
        codigo: "PRD-007",
        nome: "Incenso de Mirra",
        categoria: "Incensos",
        preco: 15.9,
        custo: 7,
        estoque: 0,
        estoqueMinimo: 8,
        status: "Ativo"
    },
    {
        id: 8,
        codigo: "PRD-008",
        nome: "Colar de Proteção",
        categoria: "Acessórios",
        preco: 39.9,
        custo: 18,
        estoque: 12,
        estoqueMinimo: 4,
        status: "Inativo"
    }
];

const categorias = [
    "Incensos",
    "Velas",
    "Acessórios",
    "Ervas",
    "Óleos",
    "Outros"
];

const moeda = (valor) =>
    valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

const produtoVazio = {
    nome: "",
    categoria: "Incensos",
    preco: "",
    custo: "",
    estoque: "",
    estoqueMinimo: "5",
    status: "Ativo"
};

const campoClasse =
    "mt-2 w-full rounded-lg border border-[#e3dcc9] bg-[#faf9f5] px-3 py-3 text-sm text-[#45433d] outline-none transition placeholder:text-[#aaa59a] focus:border-[#b99a43] focus:ring-2 focus:ring-[#b99a43]/10";

export const ProdutosPage = () => {
    const [produtos, setProdutos] = useState(produtosIniciais);
    const [busca, setBusca] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
    const [statusFiltro, setStatusFiltro] = useState("Todos");
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState(null);
    const [formulario, setFormulario] = useState(produtoVazio);
    const [menuAberto, setMenuAberto] = useState(false);

    const totalEstoque = produtos.reduce(
        (total, produto) => total + produto.estoque,
        0
    );

    const produtosAtivos = produtos.filter(
        (produto) => produto.status === "Ativo"
    ).length;

    const produtosEstoqueBaixo = produtos.filter(
        (produto) =>
            produto.status === "Ativo" &&
            produto.estoque <= produto.estoqueMinimo
    ).length;

    const valorEstoque = produtos.reduce(
        (total, produto) => total + produto.estoque * produto.custo,
        0
    );

    const produtosFiltrados = produtos.filter((produto) => {
        const termo = busca.toLowerCase();

        const correspondeBusca =
            produto.nome.toLowerCase().includes(termo) ||
            produto.codigo.toLowerCase().includes(termo) ||
            produto.categoria.toLowerCase().includes(termo);

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

    const abrirCadastro = () => {
        setProdutoEditando(null);
        setFormulario(produtoVazio);
        setModalAberto(true);
    };

    const abrirEdicao = (produto) => {
        setProdutoEditando(produto);

        setFormulario({
            nome: produto.nome,
            categoria: produto.categoria,
            preco: String(produto.preco),
            custo: String(produto.custo),
            estoque: String(produto.estoque),
            estoqueMinimo: String(produto.estoqueMinimo),
            status: produto.status
        });

        setModalAberto(true);
    };

    const atualizarCampo = (campo, valor) => {
        setFormulario((anterior) => ({
            ...anterior,
            [campo]: valor
        }));
    };

    const salvarProduto = (evento) => {
        evento.preventDefault();

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
            alert(
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

        if (produtoEditando) {
            setProdutos((anteriores) =>
                anteriores.map((produto) =>
                    produto.id === produtoEditando.id
                        ? { ...produto, ...dadosProduto }
                        : produto
                )
            );
        } else {
            const proximoId =
                produtos.reduce(
                    (maior, produto) => Math.max(maior, produto.id),
                    0
                ) + 1;

            const novoProduto = {
                id: proximoId,
                codigo: `PRD-${String(proximoId).padStart(3, "0")}`,
                ...dadosProduto
            };

            setProdutos((anteriores) => [
                novoProduto,
                ...anteriores
            ]);
        }

        setModalAberto(false);
    };

    const excluirProduto = (produto) => {
        const confirmar = window.confirm(
            `Deseja realmente excluir o produto "${produto.nome}"?`
        );

        if (!confirmar) return;

        setProdutos((anteriores) =>
            anteriores.filter((item) => item.id !== produto.id)
        );
    };

    const indicadorClasse =
        "rounded-xl border border-[#e6dfcd] bg-[#fffefa] p-5 shadow-sm transition-all hover:border-[#d4bd7c] hover:shadow-md";

    return (
        <div className="min-h-screen bg-[#f3f1eb] text-[#35342f]">

            <Sidebar />

            {/* Fundo do menu mobile */}
            {menuAberto && (
                <button
                    aria-label="Fechar menu"
                    onClick={() => setMenuAberto(false)}
                    className="fixed inset-0 z-40 bg-[#35342f]/40 backdrop-blur-sm lg:hidden"
                />
            )}

            {/* Conteúdo */}
            <div className="min-h-screen lg:ml-60">

                {/* Cabeçalho */}
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
                    <div className="hidden border-l border-[#e3dcc9] pl-4 sm:block">
                        <p className="text-sm text-[#89670d]">
                            Estrela do Oriente
                        </p>
                        <p className="text-xs text-[#918d83]">
                            {new Date().toLocaleDateString("pt-BR")}
                        </p>
                    </div>
                </header>

                <main className="space-y-6 p-4 sm:p-6 lg:p-8">

                    {/* Título e ação */}
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

                    {/* Indicadores */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <div className={indicadorClasse}>
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm text-[#77746b]">
                                    Produtos cadastrados
                                </p>

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f5edda]">
                                    <Package size={21} className="text-[#98700a]" />
                                </div>
                            </div>

                            <p className="mt-5 text-3xl font-semibold text-[#8b690e]">
                                {produtos.length}
                            </p>

                            <p className="mt-1 text-xs text-[#969187]">
                                Total de registros
                            </p>
                        </div>

                        <div className={indicadorClasse}>
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm text-[#77746b]">
                                    Produtos ativos
                                </p>

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f5edda]">
                                    <Tags size={21} className="text-[#98700a]" />
                                </div>
                            </div>

                            <p className="mt-5 text-3xl font-semibold text-[#8b690e]">
                                {produtosAtivos}
                            </p>

                            <p className="mt-1 text-xs text-[#969187]">
                                Disponíveis no catálogo
                            </p>
                        </div>

                        <div className={indicadorClasse}>
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm text-[#77746b]">
                                    Unidades em estoque
                                </p>

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f5edda]">
                                    <Boxes size={21} className="text-[#98700a]" />
                                </div>
                            </div>

                            <p className="mt-5 text-3xl font-semibold text-[#8b690e]">
                                {totalEstoque}
                            </p>

                            <p className="mt-1 text-xs text-[#969187]">
                                Soma das quantidades
                            </p>
                        </div>

                        <div className={indicadorClasse}>
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm text-[#77746b]">
                                    Valor de custo do estoque
                                </p>

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f5edda]">
                                    <DollarSign size={21} className="text-[#98700a]" />
                                </div>
                            </div>

                            <p className="mt-5 break-words text-2xl font-semibold text-[#8b690e]">
                                {moeda(valorEstoque)}
                            </p>

                            <p className="mt-1 text-xs text-[#969187]">
                                Custo das unidades disponíveis
                            </p>
                        </div>
                    </section>

                    {/* Alerta de estoque */}
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

                    {/* Catálogo de produtos */}
                    <section className="overflow-hidden rounded-xl border border-[#e6dfcd] bg-[#fffefa] shadow-sm">

                        <div className="border-b border-[#eee7d7] p-5">
                            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                                <div>
                                    <h2 className="text-lg font-medium text-[#78601e]">
                                        Catálogo de produtos
                                    </h2>

                                    <p className="mt-1 text-xs text-[#918d83]">
                                        Consulte e gerencie os itens cadastrados.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">

                                    {/* Busca */}
                                    <div className="relative min-w-0 sm:w-64">
                                        <Search
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a49b85]"
                                        />

                                        <input
                                            type="text"
                                            value={busca}
                                            onChange={(evento) =>
                                                setBusca(evento.target.value)
                                            }
                                            placeholder="Buscar produto ou código..."
                                            className="w-full rounded-lg border border-[#e3dcc9] bg-[#faf9f5] py-2.5 pl-9 pr-3 text-sm text-[#45433d] outline-none transition placeholder:text-[#aaa59a] focus:border-[#b99a43] focus:ring-2 focus:ring-[#b99a43]/10"
                                        />
                                    </div>

                                    {/* Filtro de categoria */}
                                    <div className="relative">
                                        <select
                                            value={categoriaFiltro}
                                            onChange={(evento) =>
                                                setCategoriaFiltro(evento.target.value)
                                            }
                                            className="w-full appearance-none rounded-lg border border-[#e3dcc9] bg-[#faf9f5] py-2.5 pl-3 pr-9 text-sm text-[#5f5c54] outline-none focus:border-[#b99a43] sm:w-44"
                                        >
                                            <option value="Todas">
                                                Todas as categorias
                                            </option>

                                            {categorias.map((categoria) => (
                                                <option
                                                    key={categoria}
                                                    value={categoria}
                                                >
                                                    {categoria}
                                                </option>
                                            ))}
                                        </select>

                                        <ChevronDown
                                            size={15}
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98700a]"
                                        />
                                    </div>

                                    {/* Filtro de status */}
                                    <div className="relative">
                                        <select
                                            value={statusFiltro}
                                            onChange={(evento) =>
                                                setStatusFiltro(evento.target.value)
                                            }
                                            className="w-full appearance-none rounded-lg border border-[#e3dcc9] bg-[#faf9f5] py-2.5 pl-3 pr-9 text-sm text-[#5f5c54] outline-none focus:border-[#b99a43] sm:w-36"
                                        >
                                            <option value="Todos">
                                                Todos os status
                                            </option>
                                            <option value="Ativo">Ativos</option>
                                            <option value="Inativo">Inativos</option>
                                        </select>

                                        <ChevronDown
                                            size={15}
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98700a]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabela */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left text-sm">
                                <thead>
                                    <tr className="bg-[#f5f1e7] text-xs text-[#81734e]">
                                        <th className="px-5 py-4 font-medium">
                                            Produto
                                        </th>
                                        <th className="px-4 py-4 font-medium">
                                            Categoria
                                        </th>
                                        <th className="px-4 py-4 font-medium">
                                            Preço de venda
                                        </th>
                                        <th className="px-4 py-4 font-medium">
                                            Estoque
                                        </th>
                                        <th className="px-4 py-4 font-medium">
                                            Status
                                        </th>
                                        <th className="px-5 py-4 text-right font-medium">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {produtosFiltrados.map((produto, index) => {
                                        const estoqueBaixo =
                                            produto.estoque <= produto.estoqueMinimo;

                                        return (
                                            <tr
                                                key={produto.id}
                                                className={`border-t border-[#eeeae0] text-[#5f5c54] transition-colors hover:bg-[#f8f5ed] ${
                                                    index % 2 === 1
                                                        ? "bg-[#fcfbf7]"
                                                        : ""
                                                }`}
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e9dfc4] bg-[#f5edda]">
                                                            <Package
                                                                size={19}
                                                                className="text-[#98700a]"
                                                            />
                                                        </div>

                                                        <div>
                                                            <p className="font-medium text-[#45433d]">
                                                                {produto.nome}
                                                            </p>

                                                            <p className="mt-1 text-xs text-[#969187]">
                                                                {produto.codigo}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4">
                                                    {produto.categoria}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 font-medium text-[#45433d]">
                                                    {moeda(produto.preco)}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={
                                                                estoqueBaixo
                                                                    ? "font-medium text-amber-700"
                                                                    : "text-[#5f5c54]"
                                                            }
                                                        >
                                                            {produto.estoque} un.
                                                        </span>

                                                        {estoqueBaixo && (
                                                            <AlertTriangle
                                                                size={14}
                                                                className="text-amber-600"
                                                                title="Estoque baixo"
                                                            />
                                                        )}
                                                    </div>

                                                    <p className="mt-1 text-[11px] text-[#969187]">
                                                        Mínimo: {produto.estoqueMinimo}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                            produto.status === "Ativo"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-[#eeece6] text-[#77746b]"
                                                        }`}
                                                    >
                                                        {produto.status}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => abrirEdicao(produto)}
                                                            title="Editar produto"
                                                            aria-label={`Editar ${produto.nome}`}
                                                            className="rounded-lg border border-[#e6dfcd] p-2 text-[#8b690e] transition hover:border-[#d4bd7c] hover:bg-[#f5edda]"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>

                                                        <button
                                                            onClick={() => excluirProduto(produto)}
                                                            title="Excluir produto"
                                                            aria-label={`Excluir ${produto.nome}`}
                                                            className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {produtosFiltrados.length === 0 && (
                                <div className="px-5 py-14 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#f5f1e7]">
                                        <Package
                                            size={28}
                                            className="text-[#b49a51]"
                                        />
                                    </div>

                                    <p className="mt-3 text-sm font-medium text-[#45433d]">
                                        Nenhum produto encontrado.
                                    </p>

                                    <p className="mt-1 text-xs text-[#918d83]">
                                        Tente alterar a pesquisa ou os filtros.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 border-t border-[#eee7d7] bg-[#faf9f5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-[#918d83]">
                                Exibindo {produtosFiltrados.length} de {produtos.length} produtos
                            </p>
                        </div>
                    </section>
                </main>
            </div>

            {/* Modal de cadastro e edição */}
            {modalAberto && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#35342f]/45 p-4 backdrop-blur-sm"
                    onMouseDown={(evento) => {
                        if (evento.target === evento.currentTarget) {
                            setModalAberto(false);
                        }
                    }}
                >
                    <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#e3dcc9] bg-[#fffefa] shadow-2xl">

                        <div className="flex items-center justify-between border-b border-[#eee7d7] bg-[#faf9f5] p-5">
                            <div>
                                <h2 className="text-lg font-medium text-[#78601e]">
                                    {produtoEditando
                                        ? "Editar produto"
                                        : "Cadastrar produto"}
                                </h2>

                                <p className="mt-1 text-xs text-[#918d83]">
                                    Preencha as informações do catálogo.
                                </p>
                            </div>

                            <button
                                onClick={() => setModalAberto(false)}
                                aria-label="Fechar modal"
                                className="rounded-lg p-2 text-[#89867d] transition hover:bg-[#f0ece2] hover:text-[#78601e]"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <form onSubmit={salvarProduto}>
                            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">

                                <label className="text-sm font-medium text-[#5f5c54] sm:col-span-2">
                                    Nome do produto *
                                    <input
                                        required
                                        autoFocus
                                        type="text"
                                        maxLength={100}
                                        value={formulario.nome}
                                        onChange={(evento) =>
                                            atualizarCampo("nome", evento.target.value)
                                        }
                                        placeholder="Ex.: Incenso Natural"
                                        className={campoClasse}
                                    />
                                </label>

                                <label className="text-sm font-medium text-[#5f5c54]">
                                    Categoria *
                                    <select
                                        required
                                        value={formulario.categoria}
                                        onChange={(evento) =>
                                            atualizarCampo("categoria", evento.target.value)
                                        }
                                        className={campoClasse}
                                    >
                                        {categorias.map((categoria) => (
                                            <option key={categoria} value={categoria}>
                                                {categoria}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="text-sm font-medium text-[#5f5c54]">
                                    Status *
                                    <select
                                        required
                                        value={formulario.status}
                                        onChange={(evento) =>
                                            atualizarCampo("status", evento.target.value)
                                        }
                                        className={campoClasse}
                                    >
                                        <option value="Ativo">Ativo</option>
                                        <option value="Inativo">Inativo</option>
                                    </select>
                                </label>

                                <label className="text-sm font-medium text-[#5f5c54]">
                                    Preço de venda (R$) *
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formulario.preco}
                                        onChange={(evento) =>
                                            atualizarCampo("preco", evento.target.value)
                                        }
                                        placeholder="0,00"
                                        className={campoClasse}
                                    />
                                </label>

                                <label className="text-sm font-medium text-[#5f5c54]">
                                    Preço de custo (R$) *
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formulario.custo}
                                        onChange={(evento) =>
                                            atualizarCampo("custo", evento.target.value)
                                        }
                                        placeholder="0,00"
                                        className={campoClasse}
                                    />
                                </label>

                                <label className="text-sm font-medium text-[#5f5c54]">
                                    Quantidade em estoque *
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={formulario.estoque}
                                        onChange={(evento) =>
                                            atualizarCampo("estoque", evento.target.value)
                                        }
                                        placeholder="0"
                                        className={campoClasse}
                                    />
                                </label>

                                <label className="text-sm font-medium text-[#5f5c54]">
                                    Estoque mínimo *
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={formulario.estoqueMinimo}
                                        onChange={(evento) =>
                                            atualizarCampo("estoqueMinimo", evento.target.value)
                                        }
                                        placeholder="5"
                                        className={campoClasse}
                                    />
                                </label>

                                <div className="rounded-lg border border-[#e9dfc4] bg-[#f8f3e6] p-3 sm:col-span-2">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle
                                            size={17}
                                            className="mt-0.5 shrink-0 text-[#98700a]"
                                        />

                                        <p className="text-xs leading-5 text-[#81734e]">
                                            O sistema sinalizará o produto quando a quantidade em estoque for igual ou inferior ao estoque mínimo.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-[#eee7d7] bg-[#faf9f5] p-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setModalAberto(false)}
                                    className="rounded-lg border border-[#e3dcc9] px-5 py-3 text-sm font-medium text-[#68645b] transition hover:bg-[#f0ece2]"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 rounded-lg bg-[#b18a20] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#98700a]"
                                >
                                    <Plus size={17} />

                                    {produtoEditando
                                        ? "Salvar alterações"
                                        : "Cadastrar produto"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProdutosPage;