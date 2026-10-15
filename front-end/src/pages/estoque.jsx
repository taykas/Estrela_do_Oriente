import { useState } from "react";
import Sidebar from "../components/Sidebar";
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

    const campoClasse =
        "w-full rounded-md border border-[#e3dcc9] bg-[#faf9f5] px-3 py-3 text-sm text-[#45433d] outline-none transition placeholder:text-[#918d83] focus:border-[#b18a20]";

    const botaoSecundario =
        "rounded-md border border-[#e3dcc9] px-4 py-2 text-sm text-[#68645b] transition hover:bg-[#f5f1e7]";

    return (
        <div className="min-h-screen bg-[#f3f1eb] text-[#35342f]">
            <Sidebar />

            <div className="min-h-screen lg:ml-60">
                <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-[#e6dfcd] bg-[#faf9f5]/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            className="text-[#98700a] lg:hidden"
                            aria-label="Menu"
                        >
                            <Menu size={25} />
                        </button>

                        <div>
                            <h2
                                className="text-xl text-[#89670d] sm:text-2xl"
                                style={{ fontFamily: "Corvel" }}
                            >
                                Estoque
                            </h2>
                            <p className="text-xs text-[#77746b]">
                                Controle de produtos e inventário
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="hidden items-center gap-2 rounded-md border border-[#e3dcc9] bg-[#fffefa] px-3 py-2 sm:flex">
                            <Search size={17} className="text-[#918d83]" />
                            <input
                                value={busca}
                                onChange={(e) => {
                                    setBusca(e.target.value);
                                    setPagina(1);
                                }}
                                placeholder="Buscar produto..."
                                className="w-36 bg-transparent text-sm text-[#45433d] outline-none placeholder:text-[#918d83] lg:w-48"
                            />
                        </div>

                        <button
                            aria-label="Notificações"
                            className="text-[#98700a] transition hover:text-[#6e5208]"
                        >
                            <Bell size={21} />
                        </button>

                        <div className="hidden border-l border-[#e3dcc9] pl-4 sm:block">
                            <p className="text-sm text-[#89670d]">
                                Estrela do Oriente
                            </p>
                            <p className="text-xs text-[#918d83]">
                                {new Date().toLocaleDateString("pt-BR")}
                            </p>
                        </div>
                    </div>
                </header>

                <main className="space-y-6 p-4 sm:p-6 lg:p-8">
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <button
                            onClick={() => abrirMovimentacao("entrada")}
                            className="flex items-center gap-4 rounded-lg bg-[#98700a] p-5 text-left text-white transition hover:bg-[#806009]"
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
                            className="flex items-center gap-4 rounded-lg border border-[#e6c8c3] bg-[#fff9f7] p-5 text-left transition hover:bg-[#fdf0ed]"
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
                            {indicadores.map((item) => {
                                const Icone = item.icone;

                                return (
                                    <div
                                        key={item.titulo}
                                        className="rounded-lg border border-[#e6dfcd] bg-[#fffefa] p-5 transition-colors hover:border-[#c8b77e]"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm text-[#68645b]">
                                                {item.titulo}
                                            </p>
                                            <Icone
                                                size={23}
                                                className="shrink-0 text-[#98700a]"
                                                strokeWidth={1.7}
                                            />
                                        </div>
                                        <p className="mt-5 break-words text-2xl font-semibold text-[#89670d]">
                                            {item.valor}
                                        </p>
                                        <p className="mt-1 text-xs text-[#918d83]">
                                            {item.descricao}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-4">
                        <div className="overflow-hidden rounded-lg border border-[#e6dfcd] bg-[#fffefa] 2xl:col-span-3">
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
                                <div className="flex items-center gap-2 rounded-md border border-[#e3dcc9] bg-[#faf9f5] px-3 py-2 md:col-span-1">
                                    <Search size={17} className="shrink-0 text-[#918d83]" />
                                    <input
                                        value={busca}
                                        onChange={(e) => {
                                            setBusca(e.target.value);
                                            setPagina(1);
                                        }}
                                        placeholder="Buscar por nome ou categoria..."
                                        className="w-full bg-transparent text-sm text-[#45433d] outline-none placeholder:text-[#918d83]"
                                    />
                                </div>

                                <select
                                    value={categoriaSelecionada}
                                    onChange={(e) => {
                                        setCategoriaSelecionada(e.target.value);
                                        setPagina(1);
                                    }}
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
                                    onChange={(e) => {
                                        setStatusSelecionado(e.target.value);
                                        setPagina(1);
                                    }}
                                    className="rounded-md border border-[#e3dcc9] bg-[#faf9f5] px-3 py-2 text-sm text-[#68645b] outline-none focus:border-[#b18a20]"
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
                                        {produtosPagina.map((produto) => {
                                            const status = obterStatus(produto);

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

                                                    <td className="px-3 py-4">{produto.categoria}</td>

                                                    <td
                                                        className={`px-3 py-4 font-medium ${
                                                            produto.quantidade === 0
                                                                ? "text-[#b34b40]"
                                                                : produto.quantidade <= produto.minimo
                                                                    ? "text-[#98700a]"
                                                                    : "text-[#45433d]"
                                                        }`}
                                                    >
                                                        {produto.quantidade}
                                                    </td>

                                                    <td className="px-3 py-4">{produto.minimo}</td>

                                                    <td className="px-3 py-4">
                                                        <span
                                                            className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs ${
                                                                status === "Normal"
                                                                    ? "border-[#b9d9c5] bg-[#edf7f0] text-[#32734a]"
                                                                    : status === "Sem estoque"
                                                                        ? "border-[#e6c8c3] bg-[#fdf0ed] text-[#b34b40]"
                                                                        : "border-[#e6d5a5] bg-[#fbf4df] text-[#89670d]"
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
                                                                className="text-[#918d83] transition hover:text-[#98700a]"
                                                            >
                                                                <Eye size={17} />
                                                            </button>

                                                            <button
                                                                title="Registrar entrada"
                                                                onClick={() => abrirMovimentacao("entrada", produto)}
                                                                className="text-[#918d83] transition hover:text-[#32734a]"
                                                            >
                                                                <ArrowDownToLine size={17} />
                                                            </button>

                                                            <button
                                                                title="Registrar saída"
                                                                onClick={() => abrirMovimentacao("saida", produto)}
                                                                className="text-[#918d83] transition hover:text-[#b34b40]"
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
                                                <td colSpan={6} className="px-4 py-12 text-center text-[#918d83]">
                                                    Nenhum produto encontrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6dfcd] p-4">
                                <p className="text-xs text-[#918d83]">
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
                                        className="rounded-md border border-[#e3dcc9] p-2 text-[#68645b] transition hover:border-[#b18a20] disabled:opacity-30"
                                    >
                                        <ChevronLeft size={17} />
                                    </button>

                                    <span className="rounded-md bg-[#98700a] px-3 py-2 text-sm font-semibold text-white">
                                        {pagina}
                                    </span>

                                    <button
                                        disabled={pagina >= totalPaginas}
                                        onClick={() => setPagina((p) => p + 1)}
                                        className="rounded-md border border-[#e3dcc9] p-2 text-[#68645b] transition hover:border-[#b18a20] disabled:opacity-30"
                                    >
                                        <ChevronRight size={17} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="rounded-lg border border-[#e6dfcd] bg-[#fffefa]">
                                <div className="flex items-center gap-2 border-b border-[#e6dfcd] p-4">
                                    <AlertTriangle size={20} className="text-[#98700a]" />
                                    <h2 className="text-base text-[#89670d]">Alerta de Estoque</h2>
                                </div>

                                <div className="divide-y divide-[#eee8dc] px-4">
                                    {produtos
                                        .filter((produto) => obterStatus(produto) !== "Normal")
                                        .slice(0, 5)
                                        .map((produto) => (
                                            <div key={produto.id} className="flex items-center justify-between gap-3 py-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm text-[#45433d]">{produto.nome}</p>
                                                    <p className="mt-1 text-xs text-[#918d83]">
                                                        {produto.quantidade === 0
                                                            ? "Sem estoque"
                                                            : `${produto.quantidade} unidades`}
                                                    </p>
                                                </div>

                                                <span className={produto.quantidade === 0 ? "text-[#b34b40]" : "text-[#98700a]"}>
                                                    <AlertTriangle size={17} />
                                                </span>
                                            </div>
                                        ))}

                                    {produtosBaixos + produtosSemEstoque === 0 && (
                                        <p className="py-5 text-sm text-[#918d83]">
                                            Nenhum alerta no momento.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-[#e6dfcd] bg-[#fffefa]">
                                <div className="flex items-center gap-2 border-b border-[#e6dfcd] p-4">
                                    <ClipboardList size={20} className="text-[#98700a]" />
                                    <h2 className="text-base text-[#89670d]">Categorias</h2>
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
                                            className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition hover:bg-[#f5f1e7] ${
                                                categoriaSelecionada === categoria
                                                    ? "bg-[#f1e8d1] text-[#89670d]"
                                                    : "text-[#68645b]"
                                            }`}
                                        >
                                            <span>{categoria}</span>
                                            <span className="rounded-full bg-[#f1e8d1] px-2.5 py-1 text-xs text-[#89670d]">
                                                {quantidadePorCategoria(categoria)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-lg border border-[#e6dfcd] bg-[#fffefa] p-4">
                                <div className="mb-4 flex items-center gap-2">
                                    <Plus size={20} className="text-[#98700a]" />
                                    <h2 className="text-base text-[#89670d]">Ações Rápidas</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => navegar("/produtos")}
                                        className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border border-[#e3dcc9] p-3 text-center text-xs text-[#68645b] transition hover:bg-[#f5f1e7] hover:text-[#89670d]"
                                    >
                                        <Package size={23} className="text-[#98700a]" />
                                        Cadastrar Produto
                                    </button>

                                    <button
                                        onClick={() => abrirMovimentacao("entrada")}
                                        className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border border-[#e3dcc9] p-3 text-center text-xs text-[#68645b] transition hover:bg-[#f5f1e7] hover:text-[#89670d]"
                                    >
                                        <ArrowDownToLine size={23} className="text-[#98700a]" />
                                        Entrada de Estoque
                                    </button>

                                    <button
                                        onClick={() => abrirMovimentacao("saida")}
                                        className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border border-[#e6c8c3] p-3 text-center text-xs text-[#68645b] transition hover:bg-[#fdf0ed] hover:text-[#b34b40]"
                                    >
                                        <ArrowUpFromLine size={23} className="text-[#b34b40]" />
                                        Saída de Estoque
                                    </button>

                                    <button
                                        onClick={() => navegar("/relatorios")}
                                        className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border border-[#e3dcc9] p-3 text-center text-xs text-[#68645b] transition hover:bg-[#f5f1e7] hover:text-[#89670d]"
                                    >
                                        <ChartNoAxesCombined size={23} className="text-[#98700a]" />
                                        Ver Relatórios
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {produtoSelecionado && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#35342f]/40 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) fecharModal();
                    }}
                >
                    <div className="my-auto w-full max-w-md rounded-lg border border-[#e3dcc9] bg-[#fffefa] p-6 shadow-2xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg text-[#89670d]">
                                {produtoSelecionado.tipo === "detalhes"
                                    ? "Detalhes do Produto"
                                    : produtoSelecionado.tipo === "entrada"
                                        ? "Entrada de Estoque"
                                        : "Saída de Estoque"}
                            </h2>

                            <button
                                onClick={fecharModal}
                                aria-label="Fechar modal"
                                className="text-[#918d83] transition hover:text-[#45433d]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {produtoSelecionado.id === null ? (
                            <div className="mb-5">
                                <label className="mb-2 block text-sm text-[#68645b]">
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
                                    className={campoClasse}
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
                            <div className="mb-5 rounded-md border border-[#e6dfcd] bg-[#faf9f5] p-4">
                                <p className="text-base font-medium text-[#45433d]">
                                    {produtoSelecionado.nome}
                                </p>
                                <p className="mt-1 text-sm text-[#918d83]">
                                    {produtoSelecionado.categoria}
                                </p>
                                <p className="mt-3 text-sm text-[#68645b]">
                                    Quantidade atual:{" "}
                                    <span className="font-medium text-[#89670d]">
                                        {produtoSelecionado.quantidade} unidades
                                    </span>
                                </p>
                                <p className="mt-1 text-sm text-[#68645b]">
                                    Estoque mínimo: {produtoSelecionado.minimo} unidades
                                </p>
                                <p className="mt-1 text-sm text-[#68645b]">
                                    Valor unitário: {moeda(produtoSelecionado.preco)}
                                </p>
                            </div>
                        )}

                        {produtoSelecionado.tipo !== "detalhes" &&
                            produtoSelecionado.id !== null && (
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm text-[#68645b]">
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
                                        className={campoClasse}
                                    />
                                </div>
                            )}

                        {mensagem && (
                            <p
                                className={`mb-4 text-sm ${
                                    mensagem.includes("sucesso")
                                        ? "text-[#32734a]"
                                        : "text-[#b34b40]"
                                }`}
                            >
                                {mensagem}
                            </p>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={fecharModal}
                                className={botaoSecundario}
                            >
                                Fechar
                            </button>

                            {produtoSelecionado.tipo !== "detalhes" &&
                                produtoSelecionado.id !== null && (
                                    <button
                                        onClick={() =>
                                            registrarMovimentacao(produtoSelecionado.tipo)
                                        }
                                        className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
                                            produtoSelecionado.tipo === "entrada"
                                                ? "bg-[#98700a] hover:bg-[#806009]"
                                                : "bg-[#b34b40] hover:bg-[#963b32]"
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