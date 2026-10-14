import { useState } from "react";
import {
    Home,
    Package,
    Warehouse,
    ShoppingCart,
    ClipboardList,
    Truck,
    ChartNoAxesCombined,
    Settings,
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

import estrela from "../assets/icon estrela.png";
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
        (total, produto) =>
            total + produto.estoque * produto.custo,
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

    const navegar = (destino) => {
        // Integre com o React Router quando as páginas existirem.
        console.log("Navegar para:", destino);
        setMenuAberto(false);
    };

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
            alert("Preencha os campos corretamente. Estoque e estoque mínimo devem ser números inteiros não negativos.");
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

    const campoClasse =
        "mt-2 w-full rounded-md border border-[#f1b519]/25 bg-black px-3 py-3 text-sm text-gray-200 outline-none transition focus:border-[#f1b519]";

    return (
        <div className="min-h-screen bg-black text-white">

            <Sidebar />

            {/* Fundo do menu mobile */}
            {menuAberto && (
                <button
                    aria-label="Fechar menu"
                    onClick={() => setMenuAberto(false)}
                    className="fixed inset-0 z-40 bg-black/70 lg:hidden"
                />
            )}

            {/* Conteúdo */}
            <div className="min-h-screen lg:ml-60">

                {/* Cabeçalho */}
                <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-[#f1b519]/50 bg-black px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMenuAberto(true)}
                            className="text-[#f1b519] lg:hidden"
                            aria-label="Abrir menu"
                        >
                            <Menu size={25} />
                        </button>

                        <div>
                            <h2
                                className="text-lg text-[#f1b519] sm:text-xl"
                                style={{ fontFamily: "Corvel" }}
                            >
                                Gerenciamento de Produtos
                            </h2>
                        </div>
                    </div>
                </header>

                <main className="space-y-6 p-4 sm:p-6 lg:p-8">

                    {/* Título e ação */}
                    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl text-[#f1b519]">
                                Produtos
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Gerencie o catálogo de produtos da loja.
                            </p>
                        </div>

                        <button
                            onClick={abrirCadastro}
                            className="flex items-center justify-center gap-2 rounded-md bg-[#f1b519] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#d9a30f]"
                        >
                            <Plus size={19} />
                            Cadastrar produto
                        </button>
                    </section>

                    {/* Indicadores */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <div className="rounded-lg border border-[#f1b519]/40 bg-[#080808] p-5 transition-colors hover:border-[#f1b519]">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-300">
                                    Produtos cadastrados
                                </p>
                                <Package size={22} className="text-[#f1b519]" />
                            </div>

                            <p className="mt-5 text-3xl text-[#f1b519]">
                                {produtos.length}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Total de registros
                            </p>
                        </div>

                        <div className="rounded-lg border border-[#f1b519]/40 bg-[#080808] p-5 transition-colors hover:border-[#f1b519]">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-300">
                                    Produtos ativos
                                </p>
                                <Tags size={22} className="text-[#f1b519]" />
                            </div>

                            <p className="mt-5 text-3xl text-[#f1b519]">
                                {produtosAtivos}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Disponíveis no catálogo
                            </p>
                        </div>

                        <div className="rounded-lg border border-[#f1b519]/40 bg-[#080808] p-5 transition-colors hover:border-[#f1b519]">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-300">
                                    Unidades em estoque
                                </p>
                                <Boxes size={22} className="text-[#f1b519]" />
                            </div>

                            <p className="mt-5 text-3xl text-[#f1b519]">
                                {totalEstoque}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Soma das quantidades
                            </p>
                        </div>

                        <div className="rounded-lg border border-[#f1b519]/40 bg-[#080808] p-5 transition-colors hover:border-[#f1b519]">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-300">
                                    Valor de custo do estoque
                                </p>
                                <DollarSign size={22} className="text-[#f1b519]" />
                            </div>

                            <p className="mt-5 break-words text-2xl text-[#f1b519]">
                                {moeda(valorEstoque)}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Custo das unidades disponíveis
                            </p>
                        </div>
                    </section>

                    {/* Alerta de estoque */}
                    {produtosEstoqueBaixo > 0 && (
                        <section className="flex items-start gap-3 rounded-lg border border-[#f1b519]/40 bg-[#f1b519]/[0.06] p-4">
                            <AlertTriangle
                                size={21}
                                className="mt-0.5 shrink-0 text-[#f1b519]"
                            />

                            <div>
                                <p className="text-sm text-[#f1b519]">
                                    Atenção ao estoque
                                </p>
                                <p className="mt-1 text-sm text-gray-400">
                                    {produtosEstoqueBaixo}{" "}
                                    {produtosEstoqueBaixo === 1
                                        ? "produto está"
                                        : "produtos estão"}{" "}
                                    com estoque igual ou abaixo do mínimo configurado.
                                </p>
                            </div>
                        </section>
                    )}

                    {/* Tabela de produtos */}
                    <section className="overflow-hidden rounded-lg border border-[#f1b519]/40 bg-[#050505]">

                        <div className="border-b border-[#f1b519]/25 p-5">
                            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                                <div>
                                    <h2 className="text-lg text-[#f1b519]">
                                        Catálogo de produtos
                                    </h2>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Consulte e gerencie os itens cadastrados.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <div className="relative min-w-0 sm:w-64">
                                        <Search
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        />
                                        <input
                                            type="text"
                                            value={busca}
                                            onChange={(evento) =>
                                                setBusca(evento.target.value)
                                            }
                                            placeholder="Buscar produto ou código..."
                                            className="w-full rounded-md border border-[#f1b519]/25 bg-black py-2.5 pl-9 pr-3 text-sm text-gray-200 outline-none transition focus:border-[#f1b519]"
                                        />
                                    </div>

                                    <div className="relative">
                                        <select
                                            value={categoriaFiltro}
                                            onChange={(evento) =>
                                                setCategoriaFiltro(evento.target.value)
                                            }
                                            className="w-full appearance-none rounded-md border border-[#f1b519]/25 bg-black py-2.5 pl-3 pr-9 text-sm text-gray-300 outline-none focus:border-[#f1b519] sm:w-40"
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
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#f1b519]"
                                        />
                                    </div>

                                    <div className="relative">
                                        <select
                                            value={statusFiltro}
                                            onChange={(evento) =>
                                                setStatusFiltro(evento.target.value)
                                            }
                                            className="w-full appearance-none rounded-md border border-[#f1b519]/25 bg-black py-2.5 pl-3 pr-9 text-sm text-gray-300 outline-none focus:border-[#f1b519] sm:w-36"
                                        >
                                            <option value="Todos">Todos os status</option>
                                            <option value="Ativo">Ativos</option>
                                            <option value="Inativo">Inativos</option>
                                        </select>
                                        <ChevronDown
                                            size={15}
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#f1b519]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left text-sm">
                                <thead>
                                    <tr className="bg-[#f1b519]/[0.07] text-xs text-[#c5a64a]">
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
                                    {produtosFiltrados.map((produto) => {
                                        const estoqueBaixo =
                                            produto.estoque <= produto.estoqueMinimo;

                                        return (
                                            <tr
                                                key={produto.id}
                                                className="border-t border-white/10 text-gray-300 transition-colors hover:bg-white/[0.025]"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#f1b519]/25 bg-[#f1b519]/[0.06]">
                                                            <Package
                                                                size={19}
                                                                className="text-[#f1b519]"
                                                            />
                                                        </div>

                                                        <div>
                                                            <p className="font-medium text-gray-200">
                                                                {produto.nome}
                                                            </p>
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {produto.codigo}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4">
                                                    {produto.categoria}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-gray-200">
                                                    {moeda(produto.preco)}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={
                                                                estoqueBaixo
                                                                    ? "text-[#f1b519]"
                                                                    : "text-gray-200"
                                                            }
                                                        >
                                                            {produto.estoque} un.
                                                        </span>

                                                        {estoqueBaixo && (
                                                            <span
                                                                title="Estoque baixo"
                                                                className="flex items-center gap-1 text-[#f1b519]"
                                                            >
                                                                <AlertTriangle size={14} />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 text-[11px] text-gray-500">
                                                        Mínimo: {produto.estoqueMinimo}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs ${
                                                            produto.status === "Ativo"
                                                                ? "bg-emerald-500/10 text-emerald-400"
                                                                : "bg-gray-500/15 text-gray-400"
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
                                                            className="rounded-md border border-[#f1b519]/25 p-2 text-[#f1b519] transition hover:bg-[#f1b519]/10"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>

                                                        <button
                                                            onClick={() => excluirProduto(produto)}
                                                            title="Excluir produto"
                                                            aria-label={`Excluir ${produto.nome}`}
                                                            className="rounded-md border border-red-500/25 p-2 text-red-400 transition hover:bg-red-500/10"
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
                                    <Package
                                        size={34}
                                        className="mx-auto text-[#f1b519]/50"
                                    />
                                    <p className="mt-3 text-sm text-gray-300">
                                        Nenhum produto encontrado.
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Tente alterar a pesquisa ou os filtros.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 border-t border-[#f1b519]/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-gray-500">
                                Exibindo {produtosFiltrados.length} de {produtos.length} produtos
                            </p>
                            <p className="text-xs text-gray-500">
                                Dados demonstrativos
                            </p>
                        </div>
                    </section>
                </main>
            </div>

            {/* Modal de cadastro e edição */}
            {modalAberto && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
                    onMouseDown={(evento) => {
                        if (evento.target === evento.currentTarget) {
                            setModalAberto(false);
                        }
                    }}
                >
                    <div className="my-auto w-full max-w-2xl overflow-hidden rounded-lg border border-[#f1b519]/40 bg-[#080808] shadow-2xl shadow-black/60">

                        <div className="flex items-center justify-between border-b border-[#f1b519]/25 p-5">
                            <div>
                                <h2 className="text-lg text-[#f1b519]">
                                    {produtoEditando
                                        ? "Editar produto"
                                        : "Cadastrar produto"}
                                </h2>
                                <p className="mt-1 text-xs text-gray-500">
                                    Preencha as informações do catálogo.
                                </p>
                            </div>

                            <button
                                onClick={() => setModalAberto(false)}
                                aria-label="Fechar modal"
                                className="rounded-md p-2 text-gray-400 transition hover:bg-white/5 hover:text-[#f1b519]"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <form onSubmit={salvarProduto}>
                            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">

                                <label className="text-sm text-gray-300 sm:col-span-2">
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

                                <label className="text-sm text-gray-300">
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

                                <label className="text-sm text-gray-300">
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

                                <label className="text-sm text-gray-300">
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

                                <label className="text-sm text-gray-300">
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

                                <label className="text-sm text-gray-300">
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

                                <label className="text-sm text-gray-300">
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

                                <div className="rounded-md border border-[#f1b519]/20 bg-[#f1b519]/[0.04] p-3 sm:col-span-2">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle
                                            size={17}
                                            className="mt-0.5 shrink-0 text-[#f1b519]"
                                        />
                                        <p className="text-xs leading-5 text-gray-400">
                                            O sistema sinalizará o produto quando a quantidade em estoque for igual ou inferior ao estoque mínimo.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-[#f1b519]/20 p-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setModalAberto(false)}
                                    className="rounded-md border border-[#f1b519]/30 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/5"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 rounded-md bg-[#f1b519] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#d9a30f]"
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
