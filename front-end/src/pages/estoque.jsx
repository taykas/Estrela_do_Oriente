
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
    Bell,
    AlertTriangle,
    Plus,
    Eye,
    Boxes,
    DollarSign,
    CircleAlert,
    X,
    ArrowDownToLine,
    ArrowUpFromLine,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import estrela from "../assets/icon estrela.png";

const menuItems = [
    { nome: "Início", icone: Home, rota: "/" },
    { nome: "Produtos", icone: Package, rota: "/produtos" },
    { nome: "Estoque", icone: Warehouse, rota: "/estoque" },
    { nome: "Vendas", icone: ShoppingCart, rota: "/vendas" },
    { nome: "Pedidos", icone: ClipboardList, rota: "/pedidos" },
    { nome: "Fornecedores", icone: Truck, rota: "/fornecedores" },
    { nome: "Relatórios", icone: ChartNoAxesCombined, rota: "/relatorios" },
    { nome: "Configurações", icone: Settings, rota: "/configuracoes" }
];

const produtosIniciais = [
    { id: 1, nome: "Incenso Natural", categoria: "Incensos", quantidade: 3, minimo: 10, preco: 12.90 },
    { id: 2, nome: "Vela de 7 Dias", categoria: "Velas", quantidade: 5, minimo: 10, preco: 18.90 },
    { id: 3, nome: "Patuá", categoria: "Acessórios", quantidade: 2, minimo: 5, preco: 24.90 },
    { id: 4, nome: "Erva de Proteção", categoria: "Ervas", quantidade: 4, minimo: 10, preco: 9.90 },
    { id: 5, nome: "Óleo de Unção", categoria: "Óleos", quantidade: 2, minimo: 5, preco: 15.90 },
    { id: 6, nome: "Sal Grosso", categoria: "Insumos", quantidade: 15, minimo: 10, preco: 5.90 },
    { id: 7, nome: "Defumador", categoria: "Incensos", quantidade: 20, minimo: 10, preco: 22.90 },
    { id: 8, nome: "Pau Santo", categoria: "Ervas", quantidade: 12, minimo: 10, preco: 14.90 },
    { id: 9, nome: "Quartzo Rosa", categoria: "Cristais", quantidade: 8, minimo: 10, preco: 29.90 },
    { id: 10, nome: "Xarope de Guiné", categoria: "Ervas", quantidade: 0, minimo: 5, preco: 19.90 },
    { id: 11, nome: "Vela Aromática", categoria: "Velas", quantidade: 32, minimo: 10, preco: 16.90 },
    { id: 12, nome: "Incenso de Mirra", categoria: "Incensos", quantidade: 28, minimo: 10, preco: 11.90 }
];

const categorias = [
    "Incensos",
    "Velas",
    "Acessórios",
    "Ervas",
    "Óleos",
    "Cristais",
    "Insumos"
];

const moeda = (valor) =>
    valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

const obterStatus = (produto) => {
    if (produto.quantidade === 0) return "Sem estoque";
    if (produto.quantidade <= produto.minimo) return "Estoque baixo";
    return "Normal";
};

export const Estoque = () => {
    const navegar = useNavigate();

    const [produtos, setProdutos] = useState(produtosIniciais);
    const [busca, setBusca] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
    const [statusSelecionado, setStatusSelecionado] = useState("Todos");
    const [pagina, setPagina] = useState(1);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [quantidadeEntrada, setQuantidadeEntrada] = useState("");
    const [quantidadeSaida, setQuantidadeSaida] = useState("");
    const [mensagem, setMensagem] = useState("");

    const porPagina = 10;

    const produtosFiltrados = produtos.filter((produto) => {
        const termo = busca.toLowerCase();

        const correspondeBusca =
            produto.nome.toLowerCase().includes(termo) ||
            produto.categoria.toLowerCase().includes(termo) ||
            String(produto.id).includes(termo);

        const correspondeCategoria =
            categoriaSelecionada === "Todas" ||
            produto.categoria === categoriaSelecionada;

        const correspondeStatus =
            statusSelecionado === "Todos" ||
            obterStatus(produto) === statusSelecionado;

        return correspondeBusca && correspondeCategoria && correspondeStatus;
    });

    const totalPaginas = Math.max(
        1,
        Math.ceil(produtosFiltrados.length / porPagina)
    );

    const produtosPagina = produtosFiltrados.slice(
        (pagina - 1) * porPagina,
        pagina * porPagina
    );

    const totalProdutos = produtos.length;

    const valorEstoque = produtos.reduce(
        (total, produto) => total + produto.quantidade * produto.preco,
        0
    );

    const produtosBaixos = produtos.filter(
        (produto) =>
            produto.quantidade > 0 &&
            produto.quantidade <= produto.minimo
    ).length;

    const produtosSemEstoque = produtos.filter(
        (produto) => produto.quantidade === 0
    ).length;

    const quantidadePorCategoria = (categoria) =>
        produtos
            .filter((produto) => produto.categoria === categoria)
            .reduce((total, produto) => total + produto.quantidade, 0);

    const abrirMovimentacao = (tipo, produto = null) => {
        setMensagem("");
        setQuantidadeEntrada("");
        setQuantidadeSaida("");

        setProdutoSelecionado(
            produto
                ? { ...produto, tipo }
                : { id: null, tipo }
        );
    };

    const fecharModal = () => {
        setProdutoSelecionado(null);
        setMensagem("");
        setQuantidadeEntrada("");
        setQuantidadeSaida("");
    };

    const registrarMovimentacao = (tipo) => {
        const quantidade = Number(
            tipo === "entrada" ? quantidadeEntrada : quantidadeSaida
        );

        if (
            !produtoSelecionado ||
            produtoSelecionado.id === null ||
            !Number.isInteger(quantidade) ||
            quantidade <= 0
        ) {
            setMensagem("Informe uma quantidade inteira maior que zero.");
            return;
        }

        const produtoAtual = produtos.find(
            (produto) => produto.id === produtoSelecionado.id
        );

        if (!produtoAtual) {
            setMensagem("Produto não encontrado.");
            return;
        }

        if (tipo === "saida" && quantidade > produtoAtual.quantidade) {
            setMensagem("A quantidade de saída é maior que o estoque disponível.");
            return;
        }

        setProdutos((atuais) =>
            atuais.map((produto) =>
                produto.id === produtoAtual.id
                    ? {
                        ...produto,
                        quantidade:
                            produto.quantidade +
                            (tipo === "entrada" ? quantidade : -quantidade)
                    }
                    : produto
            )
        );

        setMensagem(
            `${tipo === "entrada" ? "Entrada" : "Saída"} de ${quantidade} unidade(s) registrada com sucesso.`
        );

        setProdutoSelecionado(null);
        setQuantidadeEntrada("");
        setQuantidadeSaida("");
    };

    const indicadores = [
        {
            titulo: "Total de Produtos",
            valor: totalProdutos,
            descricao: "Produtos cadastrados",
            icone: Boxes
        },
        {
            titulo: "Valor em Estoque",
            valor: moeda(valorEstoque),
            descricao: "Valor total dos produtos",
            icone: DollarSign
        },
        {
            titulo: "Produtos em Estoque Baixo",
            valor: produtosBaixos,
            descricao: "Precisam de reposição",
            icone: AlertTriangle
        },
        {
            titulo: "Produtos em Falta",
            valor: produtosSemEstoque,
            descricao: "Sem estoque disponível",
            icone: CircleAlert
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Menu lateral */}
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-[#f1b519]/30 bg-black lg:flex">
                <div className="flex h-24 items-center gap-3 border-b border-[#f1b519]/60 px-5">
                    <img
                        src={estrela}
                        alt="Estrela do Oriente"
                        className="h-12 w-12 shrink-0 object-contain"
                    />
                    <h1
                        className="text-lg leading-tight text-[#f1b519]"
                        style={{ fontFamily: "Corvel" }}
                    >
                        ESTRELA DO ORIENTE
                    </h1>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
                    {menuItems.map((item) => {
                        const Icone = item.icone;
                        const ativo = item.nome === "Estoque";

                        return (
                            <button
                                key={item.nome}
                                onClick={() => navegar(item.rota)}
                                className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm transition-colors ${
                                    ativo
                                        ? "bg-[#f1b519]/20 text-[#f1b519]"
                                        : "text-gray-300 hover:bg-[#f1b519]/10 hover:text-[#f1b519]"
                                }`}
                            >
                                <Icone size={19} strokeWidth={1.8} />
                                <span>{item.nome}</span>
                                {ativo && (
                                    <span className="ml-auto h-2 w-2 rounded-full bg-[#f1b519]" />
                                )}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Conteúdo */}
            <div className="min-h-screen lg:ml-60">
                <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-[#f1b519]/50 bg-black px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            className="text-[#f1b519] lg:hidden"
                            aria-label="Menu"
                        >
                            <Menu size={25} />
                        </button>

                        <div>
                            <h2
                                className="text-xl text-[#f1b519] sm:text-2xl"
                                style={{ fontFamily: "Corvel" }}
                            >
                                Estoque
                            </h2>
                            <p className="text-xs text-gray-400">
                                Controle de produtos e inventário
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden items-center gap-2 rounded-md border border-white/15 px-3 py-2 sm:flex">
                            <Search size={17} className="text-gray-400" />
                            <input
                                value={busca}
                                onChange={(e) => {
                                    setBusca(e.target.value);
                                    setPagina(1);
                                }}
                                placeholder="Buscar produto..."
                                className="w-36 bg-transparent text-sm outline-none placeholder:text-gray-500 lg:w-48"
                            />
                        </div>

                        <Bell size={21} className="text-[#f1b519]" />

                        <div className="hidden border-l border-[#f1b519]/30 pl-4 sm:block">
                            <p className="text-sm text-[#f1b519]">
                                Estrela do Oriente
                            </p>
                            <p className="text-xs text-gray-500">
                                {new Date().toLocaleDateString("pt-BR")}
                            </p>
                        </div>
                    </div>
                </header>

                <main className="space-y-6 p-4 sm:p-6 lg:p-8">
                    {/* Ações principais */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <button
                            onClick={() => abrirMovimentacao("entrada")}
                            className="flex items-center gap-4 rounded-lg bg-[#f1b519] p-5 text-left text-black transition hover:bg-[#d9a30f]"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-black/10">
                                <ArrowDownToLine size={26} />
                            </div>
                            <div>
                                <p className="text-base font-semibold">
                                    Entrada de estoque
                                </p>
                                <p className="mt-1 text-sm text-black/70">
                                    Adicionar unidades aos produtos
                                </p>
                            </div>
                            <Plus size={20} className="ml-auto shrink-0" />
                        </button>

                        <button
                            onClick={() => abrirMovimentacao("saida")}
                            className="flex items-center gap-4 rounded-lg border border-red-500/40 bg-red-500/[0.06] p-5 text-left transition hover:bg-red-500/10"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-red-500/10 text-red-400">
                                <ArrowUpFromLine size={26} />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-red-300">
                                    Saída de estoque
                                </p>
                                <p className="mt-1 text-sm text-gray-400">
                                    Registrar retirada de produtos
                                </p>
                            </div>
                            <Plus size={20} className="ml-auto shrink-0 text-red-400" />
                        </button>
                    </section>

                    {/* Indicadores */}
                    <section>
                        <h2 className="mb-4 text-lg text-[#f1b519]">
                            Resumo do Estoque
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {indicadores.map((item) => {
                                const Icone = item.icone;

                                return (
                                    <div
                                        key={item.titulo}
                                        className="rounded-lg border border-[#f1b519]/40 bg-[#080808] p-5 transition-colors hover:border-[#f1b519]"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm text-gray-300">
                                                {item.titulo}
                                            </p>
                                            <Icone
                                                size={23}
                                                className="shrink-0 text-[#f1b519]"
                                                strokeWidth={1.7}
                                            />
                                        </div>
                                        <p className="mt-5 break-words text-2xl font-semibold text-[#f1b519]">
                                            {item.valor}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {item.descricao}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Tabela e painel lateral */}
                    <section className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-4">
                        {/* Produtos */}
                        <div className="overflow-hidden rounded-lg border border-[#f1b519]/40 bg-[#050505] 2xl:col-span-3">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f1b519]/25 p-5">
                                <div className="flex items-center gap-2">
                                    <Package size={21} className="text-[#f1b519]" />
                                    <h2 className="text-lg text-[#f1b519]">
                                        Produtos em Estoque
                                    </h2>
                                </div>

                                <button
                                    onClick={() => navegar("/produtos")}
                                    className="flex items-center gap-2 rounded-md border border-[#f1b519]/60 px-3 py-2 text-sm text-[#f1b519] transition hover:bg-[#f1b519] hover:text-black"
                                >
                                    <Plus size={17} />
                                    Cadastrar Produto
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
                                <div className="flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 md:col-span-1">
                                    <Search size={17} className="shrink-0 text-gray-400" />
                                    <input
                                        value={busca}
                                        onChange={(e) => {
                                            setBusca(e.target.value);
                                            setPagina(1);
                                        }}
                                        placeholder="Buscar por nome ou categoria..."
                                        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
                                    />
                                </div>

                                <select
                                    value={categoriaSelecionada}
                                    onChange={(e) => {
                                        setCategoriaSelecionada(e.target.value);
                                        setPagina(1);
                                    }}
                                    className="rounded-md border border-white/20 bg-black px-3 py-2 text-sm text-gray-300 outline-none focus:border-[#f1b519]"
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
                                    onChange={(e) => {
                                        setStatusSelecionado(e.target.value);
                                        setPagina(1);
                                    }}
                                    className="rounded-md border border-white/20 bg-black px-3 py-2 text-sm text-gray-300 outline-none focus:border-[#f1b519]"
                                >
                                    <option value="Todos">Todos os status</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Estoque baixo">Estoque baixo</option>
                                    <option value="Sem estoque">Sem estoque</option>
                                </select>
                            </div>

                            <div className="overflow-x-auto px-4">
                                <table className="w-full min-w-[760px] text-left text-sm">
                                    <thead>
                                        <tr className="bg-[#f1b519]/[0.07] text-xs text-[#c5a64a]">
                                            <th className="px-3 py-4 font-medium">Produto</th>
                                            <th className="px-3 py-4 font-medium">Categoria</th>
                                            <th className="px-3 py-4 font-medium">Estoque Atual</th>
                                            <th className="px-3 py-4 font-medium">Estoque Mínimo</th>
                                            <th className="px-3 py-4 font-medium">Status</th>
                                            <th className="px-3 py-4 text-center font-medium">Ações</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {produtosPagina.map((produto) => {
                                            const status = obterStatus(produto);

                                            return (
                                                <tr
                                                    key={produto.id}
                                                    className="border-t border-white/10 text-gray-300 transition-colors hover:bg-white/[0.03]"
                                                >
                                                    <td className="whitespace-nowrap px-3 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#f1b519]/25 bg-[#f1b519]/[0.06]">
                                                                <Package size={18} className="text-[#f1b519]" />
                                                            </div>
                                                            <span>{produto.nome}</span>
                                                        </div>
                                                    </td>

                                                    <td className="px-3 py-4">{produto.categoria}</td>

                                                    <td
                                                        className={`px-3 py-4 ${
                                                            produto.quantidade === 0
                                                                ? "text-red-400"
                                                                : produto.quantidade <= produto.minimo
                                                                    ? "text-[#f1b519]"
                                                                    : ""
                                                        }`}
                                                    >
                                                        {produto.quantidade}
                                                    </td>

                                                    <td className="px-3 py-4">{produto.minimo}</td>

                                                    <td className="px-3 py-4">
                                                        <span
                                                            className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs ${
                                                                status === "Normal"
                                                                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                                                                    : status === "Sem estoque"
                                                                        ? "border-red-500/40 bg-red-500/10 text-red-400"
                                                                        : "border-[#f1b519]/40 bg-[#f1b519]/10 text-[#f1b519]"
                                                            }`}
                                                        >
                                                            {status}
                                                        </span>
                                                    </td>

                                                    <td className="px-3 py-4">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button
                                                                title="Ver detalhes"
                                                                onClick={() =>
                                                                    setProdutoSelecionado({
                                                                        ...produto,
                                                                        tipo: "detalhes"
                                                                    })
                                                                }
                                                                className="text-gray-400 hover:text-[#f1b519]"
                                                            >
                                                                <Eye size={17} />
                                                            </button>

                                                            <button
                                                                title="Registrar entrada"
                                                                onClick={() => abrirMovimentacao("entrada", produto)}
                                                                className="text-gray-400 hover:text-emerald-400"
                                                            >
                                                                <ArrowDownToLine size={17} />
                                                            </button>

                                                            <button
                                                                title="Registrar saída"
                                                                onClick={() => abrirMovimentacao("saida", produto)}
                                                                className="text-gray-400 hover:text-red-400"
                                                            >
                                                                <ArrowUpFromLine size={17} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        {produtosPagina.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                                    Nenhum produto encontrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f1b519]/20 p-4">
                                <p className="text-xs text-gray-500">
                                    Mostrando{" "}
                                    {produtosFiltrados.length === 0
                                        ? 0
                                        : (pagina - 1) * porPagina + 1}{" "}
                                    a {Math.min(pagina * porPagina, produtosFiltrados.length)} de{" "}
                                    {produtosFiltrados.length} produtos
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={pagina === 1}
                                        onClick={() => setPagina((p) => p - 1)}
                                        className="rounded-md border border-white/20 p-2 text-gray-300 hover:border-[#f1b519] disabled:opacity-30"
                                    >
                                        <ChevronLeft size={17} />
                                    </button>

                                    <span className="rounded-md bg-[#f1b519] px-3 py-2 text-sm font-semibold text-black">
                                        {pagina}
                                    </span>

                                    <button
                                        disabled={pagina >= totalPaginas}
                                        onClick={() => setPagina((p) => p + 1)}
                                        className="rounded-md border border-white/20 p-2 text-gray-300 hover:border-[#f1b519] disabled:opacity-30"
                                    >
                                        <ChevronRight size={17} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Painel lateral */}
                        <div className="space-y-5">
                            {/* Alertas */}
                            <div className="rounded-lg border border-[#f1b519]/40 bg-[#050505]">
                                <div className="flex items-center gap-2 border-b border-[#f1b519]/25 p-4">
                                    <AlertTriangle size={20} className="text-[#f1b519]" />
                                    <h2 className="text-base text-[#f1b519]">Alerta de Estoque</h2>
                                </div>

                                <div className="divide-y divide-white/10 px-4">
                                    {produtos
                                        .filter((produto) => obterStatus(produto) !== "Normal")
                                        .slice(0, 5)
                                        .map((produto) => (
                                            <div key={produto.id} className="flex items-center justify-between gap-3 py-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm text-gray-200">{produto.nome}</p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {produto.quantidade === 0
                                                            ? "Sem estoque"
                                                            : `${produto.quantidade} unidades`}
                                                    </p>
                                                </div>

                                                <span className={produto.quantidade === 0 ? "text-red-400" : "text-[#f1b519]"}>
                                                    <AlertTriangle size={17} />
                                                </span>
                                            </div>
                                        ))}

                                    {produtosBaixos + produtosSemEstoque === 0 && (
                                        <p className="py-5 text-sm text-gray-500">
                                            Nenhum alerta no momento.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Categorias */}
                            <div className="rounded-lg border border-[#f1b519]/40 bg-[#050505]">
                                <div className="flex items-center gap-2 border-b border-[#f1b519]/25 p-4">
                                    <ClipboardList size={20} className="text-[#f1b519]" />
                                    <h2 className="text-base text-[#f1b519]">Categorias</h2>
                                </div>

                                <div className="space-y-1 p-3">
                                    {categorias.map((categoria) => (
                                        <button
                                            key={categoria}
                                            onClick={() => {
                                                setCategoriaSelecionada(
                                                    categoriaSelecionada === categoria
                                                        ? "Todas"
                                                        : categoria
                                                );
                                                setPagina(1);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition hover:bg-[#f1b519]/10 ${
                                                categoriaSelecionada === categoria
                                                    ? "text-[#f1b519]"
                                                    : "text-gray-300"
                                            }`}
                                        >
                                            <span>{categoria}</span>
                                            <span className="rounded-full bg-[#f1b519]/10 px-2.5 py-1 text-xs text-[#f1b519]">
                                                {quantidadePorCategoria(categoria)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Ações rápidas */}
                            <div className="rounded-lg border border-[#f1b519]/40 bg-[#050505] p-4">
                                <div className="mb-4 flex items-center gap-2">
                                    <Plus size={20} className="text-[#f1b519]" />
                                    <h2 className="text-base text-[#f1b519]">Ações Rápidas</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => navegar("/produtos")}
                                        className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border border-[#f1b519]/40 p-3 text-center text-xs text-gray-300 transition hover:bg-[#f1b519]/10 hover:text-[#f1b519]"
                                    >
                                        <Package size={23} className="text-[#f1b519]" />
                                        Cadastrar Produto
                                    </button>

                                    <button
                                        onClick={() => abrirMovimentacao("entrada")}
                                        className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border border-[#f1b519]/40 p-3 text-center text-xs text-gray-300 transition hover:bg-[#f1b519]/10 hover:text-[#f1b519]"
                                    >
                                        <ArrowDownToLine size={23} className="text-[#f1b519]" />
                                        Entrada de Estoque
                                    </button>

                                    <button
                                        onClick={() => abrirMovimentacao("saida")}
                                        className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border border-red-500/30 p-3 text-center text-xs text-gray-300 transition hover:bg-red-500/10 hover:text-red-400"
                                    >
                                        <ArrowUpFromLine size={23} className="text-red-400" />
                                        Saída de Estoque
                                    </button>

                                    <button
                                        onClick={() => navegar("/relatorios")}
                                        className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border border-[#f1b519]/40 p-3 text-center text-xs text-gray-300 transition hover:bg-[#f1b519]/10 hover:text-[#f1b519]"
                                    >
                                        <ChartNoAxesCombined size={23} className="text-[#f1b519]" />
                                        Ver Relatórios
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Modal de detalhes e movimentação */}
            {produtoSelecionado && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) fecharModal();
                    }}
                >
                    <div className="my-auto w-full max-w-md rounded-lg border border-[#f1b519]/50 bg-[#080808] p-6 shadow-2xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg text-[#f1b519]">
                                {produtoSelecionado.tipo === "detalhes"
                                    ? "Detalhes do Produto"
                                    : produtoSelecionado.tipo === "entrada"
                                        ? "Entrada de Estoque"
                                        : "Saída de Estoque"}
                            </h2>

                            <button
                                onClick={fecharModal}
                                aria-label="Fechar modal"
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Seleção de produto para os botões rápidos */}
                        {produtoSelecionado.id === null ? (
                            <div className="mb-5">
                                <label className="mb-2 block text-sm text-gray-300">
                                    Selecione o produto
                                </label>

                                <select
                                    value=""
                                    onChange={(e) => {
                                        const produto = produtos.find(
                                            (p) => p.id === Number(e.target.value)
                                        );

                                        if (produto) {
                                            setProdutoSelecionado({
                                                ...produto,
                                                tipo: produtoSelecionado.tipo
                                            });
                                            setMensagem("");
                                        }
                                    }}
                                    className="w-full rounded-md border border-white/20 bg-black px-3 py-3 text-sm text-white outline-none focus:border-[#f1b519]"
                                >
                                    <option value="">Escolher produto</option>
                                    {produtos.map((produto) => (
                                        <option key={produto.id} value={produto.id}>
                                            {produto.nome} — {produto.quantidade} un.
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="mb-5 rounded-md border border-white/10 p-4">
                                <p className="text-base text-gray-100">
                                    {produtoSelecionado.nome}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    {produtoSelecionado.categoria}
                                </p>
                                <p className="mt-3 text-sm text-gray-300">
                                    Quantidade atual:{" "}
                                    <span className="text-[#f1b519]">
                                        {produtoSelecionado.quantidade} unidades
                                    </span>
                                </p>
                                <p className="mt-1 text-sm text-gray-300">
                                    Estoque mínimo: {produtoSelecionado.minimo} unidades
                                </p>
                                <p className="mt-1 text-sm text-gray-300">
                                    Valor unitário: {moeda(produtoSelecionado.preco)}
                                </p>
                            </div>
                        )}

                        {/* Quantidade aparece após selecionar um produto */}
                        {produtoSelecionado.tipo !== "detalhes" &&
                            produtoSelecionado.id !== null && (
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm text-gray-300">
                                        Quantidade de unidades
                                    </label>

                                    <input
                                        autoFocus
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={
                                            produtoSelecionado.tipo === "entrada"
                                                ? quantidadeEntrada
                                                : quantidadeSaida
                                        }
                                        onChange={(e) => {
                                            if (produtoSelecionado.tipo === "entrada") {
                                                setQuantidadeEntrada(e.target.value);
                                            } else {
                                                setQuantidadeSaida(e.target.value);
                                            }
                                            setMensagem("");
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                registrarMovimentacao(produtoSelecionado.tipo);
                                            }
                                        }}
                                        placeholder="Digite a quantidade"
                                        className="w-full rounded-md border border-white/20 bg-black px-3 py-3 text-sm text-white outline-none focus:border-[#f1b519]"
                                    />
                                </div>
                            )}

                        {mensagem && (
                            <p
                                className={`mb-4 text-sm ${
                                    mensagem.includes("sucesso")
                                        ? "text-emerald-400"
                                        : "text-red-400"
                                }`}
                            >
                                {mensagem}
                            </p>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={fecharModal}
                                className="rounded-md border border-white/20 px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                            >
                                Fechar
                            </button>

                            {produtoSelecionado.tipo !== "detalhes" &&
                                produtoSelecionado.id !== null && (
                                    <button
                                        onClick={() =>
                                            registrarMovimentacao(produtoSelecionado.tipo)
                                        }
                                        className={`rounded-md px-4 py-2 text-sm font-semibold text-black transition ${
                                            produtoSelecionado.tipo === "entrada"
                                                ? "bg-[#f1b519] hover:bg-[#d9a30f]"
                                                : "bg-red-400 hover:bg-red-300"
                                        }`}
                                    >
                                        Confirmar{" "}
                                        {produtoSelecionado.tipo === "entrada"
                                            ? "entrada"
                                            : "saída"}
                                    </button>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Estoque;
