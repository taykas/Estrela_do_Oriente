
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
    ArrowDownToLine,
    ArrowUpFromLine,
    SlidersHorizontal,
    AlertTriangle,
    Boxes,
    TrendingUp,
    TrendingDown,
    X,
    ChevronDown,
    History,
    RotateCcw
} from "lucide-react";

import estrela from "../assets/icon estrela.png";

const menuItems = [
    { nome: "Início", icone: Home },
    { nome: "Produtos", icone: Package },
    { nome: "Estoque", icone: Warehouse, ativo: true },
    { nome: "Vendas", icone: ShoppingCart },
    { nome: "Pedidos", icone: ClipboardList },
    { nome: "Fornecedores", icone: Truck },
    { nome: "Relatórios", icone: ChartNoAxesCombined },
    { nome: "Configurações", icone: Settings }
];

const estoqueInicial = [
    {
        id: 1,
        codigo: "PRD-001",
        nome: "Incenso Natural",
        categoria: "Incensos",
        quantidade: 3,
        minimo: 10,
        custo: 6.5,
        status: "Ativo"
    },
    {
        id: 2,
        codigo: "PRD-002",
        nome: "Vela de 7 Dias",
        categoria: "Velas",
        quantidade: 25,
        minimo: 10,
        custo: 9.5,
        status: "Ativo"
    },
    {
        id: 3,
        codigo: "PRD-003",
        nome: "Patua",
        categoria: "Acessórios",
        quantidade: 2,
        minimo: 5,
        custo: 12,
        status: "Ativo"
    },
    {
        id: 4,
        codigo: "PRD-004",
        nome: "Erva de Proteção",
        categoria: "Ervas",
        quantidade: 4,
        minimo: 10,
        custo: 4.5,
        status: "Ativo"
    },
    {
        id: 5,
        codigo: "PRD-005",
        nome: "Óleo de Unção",
        categoria: "Óleos",
        quantidade: 2,
        minimo: 5,
        custo: 16,
        status: "Ativo"
    },
    {
        id: 6,
        codigo: "PRD-006",
        nome: "Vela Aromática",
        categoria: "Velas",
        quantidade: 18,
        minimo: 5,
        custo: 11,
        status: "Ativo"
    },
    {
        id: 7,
        codigo: "PRD-007",
        nome: "Incenso de Mirra",
        categoria: "Incensos",
        quantidade: 0,
        minimo: 8,
        custo: 7,
        status: "Ativo"
    },
    {
        id: 8,
        codigo: "PRD-008",
        nome: "Colar de Proteção",
        categoria: "Acessórios",
        quantidade: 12,
        minimo: 4,
        custo: 18,
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

const dataAtual = () => {
    return new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const formularioVazio = {
    produtoId: "",
    tipo: "Entrada",
    quantidade: "",
    motivo: "Reposição",
    observacao: ""
};

export const EstoquePage = () => {
    const [produtos, setProdutos] = useState(estoqueInicial);
    const [movimentacoes, setMovimentacoes] = useState([
        {
            id: 1,
            codigo: "PRD-002",
            produto: "Vela de 7 Dias",
            tipo: "Entrada",
            quantidade: 10,
            anterior: 15,
            atual: 25,
            motivo: "Reposição",
            data: "13/10/2026, 14:20",
            observacao: "Reposição de mercadoria"
        },
        {
            id: 2,
            codigo: "PRD-006",
            produto: "Vela Aromática",
            tipo: "Saída",
            quantidade: 2,
            anterior: 20,
            atual: 18,
            motivo: "Venda",
            data: "13/10/2026, 13:45",
            observacao: "Saída para venda"
        },
        {
            id: 3,
            codigo: "PRD-003",
            produto: "Patua",
            tipo: "Saída",
            quantidade: 3,
            anterior: 5,
            atual: 2,
            motivo: "Venda",
            data: "12/10/2026, 16:10",
            observacao: "Saída para venda"
        }
    ]);

    const [busca, setBusca] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
    const [filtroEstoque, setFiltroEstoque] = useState("Todos");
    const [aba, setAba] = useState("estoque");
    const [modalAberto, setModalAberto] = useState(false);
    const [formulario, setFormulario] = useState(formularioVazio);
    const [menuAberto, setMenuAberto] = useState(false);

    const totalUnidades = produtos.reduce(
        (total, produto) => total + produto.quantidade,
        0
    );

    const valorTotal = produtos.reduce(
        (total, produto) =>
            total + produto.quantidade * produto.custo,
        0
    );

    const produtosBaixos = produtos.filter(
        (produto) =>
            produto.status === "Ativo" &&
            produto.quantidade > 0 &&
            produto.quantidade <= produto.minimo
    ).length;

    const produtosZerados = produtos.filter(
        (produto) =>
            produto.status === "Ativo" &&
            produto.quantidade === 0
    ).length;

    const entradasHoje = movimentacoes
        .filter((item) => item.tipo === "Entrada")
        .reduce((total, item) => total + item.quantidade, 0);

    const saidasHoje = movimentacoes
        .filter((item) => item.tipo === "Saída")
        .reduce((total, item) => total + item.quantidade, 0);

    const produtosFiltrados = produtos.filter((produto) => {
        const termo = busca.toLowerCase();

        const correspondeBusca =
            produto.nome.toLowerCase().includes(termo) ||
            produto.codigo.toLowerCase().includes(termo) ||
            produto.categoria.toLowerCase().includes(termo);

        const correspondeCategoria =
            categoriaFiltro === "Todas" ||
            produto.categoria === categoriaFiltro;

        let correspondeEstoque = true;

        if (filtroEstoque === "Baixo") {
            correspondeEstoque =
                produto.quantidade > 0 &&
                produto.quantidade <= produto.minimo;
        } else if (filtroEstoque === "Zerado") {
            correspondeEstoque = produto.quantidade === 0;
        } else if (filtroEstoque === "Normal") {
            correspondeEstoque =
                produto.quantidade > produto.minimo;
        }

        return (
            correspondeBusca &&
            correspondeCategoria &&
            correspondeEstoque
        );
    });

    const movimentacoesFiltradas = movimentacoes.filter((item) => {
        const termo = busca.toLowerCase();

        return (
            item.produto.toLowerCase().includes(termo) ||
            item.codigo.toLowerCase().includes(termo) ||
            item.motivo.toLowerCase().includes(termo)
        );
    });

    const navegar = (destino) => {
        // Integre com o React Router quando as páginas existirem.
        console.log("Navegar para:", destino);
        setMenuAberto(false);
    };

    const abrirMovimentacao = (tipo = "Entrada") => {
        setFormulario({
            ...formularioVazio,
            tipo
        });
        setModalAberto(true);
    };

    const atualizarCampo = (campo, valor) => {
        setFormulario((anterior) => ({
            ...anterior,
            [campo]: valor
        }));
    };

    const registrarMovimentacao = (evento) => {
        evento.preventDefault();

        const produto = produtos.find(
            (item) => item.id === Number(formulario.produtoId)
        );

        const quantidade = Number(formulario.quantidade);

        if (
            !produto ||
            !Number.isInteger(quantidade) ||
            quantidade <= 0
        ) {
            alert("Selecione um produto e informe uma quantidade inteira maior que zero.");
            return;
        }

        if (produto.status !== "Ativo") {
            alert("Não é possível movimentar um produto inativo.");
            return;
        }

        const anterior = produto.quantidade;
        let atual = anterior;

        if (formulario.tipo === "Entrada") {
            atual = anterior + quantidade;
        } else if (formulario.tipo === "Saída") {
            if (quantidade > anterior) {
                alert(
                    `Estoque insuficiente. Quantidade disponível: ${anterior} unidade(s).`
                );
                return;
            }

            atual = anterior - quantidade;
        } else {
            atual = quantidade;
        }

        const produtoAtualizado = {
            ...produto,
            quantidade: atual
        };

        const novaMovimentacao = {
            id: Date.now(),
            codigo: produto.codigo,
            produto: produto.nome,
            tipo: formulario.tipo,
            quantidade:
                formulario.tipo === "Ajuste"
                    ? Math.abs(atual - anterior)
                    : quantidade,
            anterior,
            atual,
            motivo:
                formulario.tipo === "Ajuste"
                    ? "Inventário"
                    : formulario.motivo,
            data: dataAtual(),
            observacao: formulario.observacao.trim()
        };

        setProdutos((anteriores) =>
            anteriores.map((item) =>
                item.id === produto.id
                    ? produtoAtualizado
                    : item
            )
        );

        setMovimentacoes((anteriores) => [
            novaMovimentacao,
            ...anteriores
        ]);

        setModalAberto(false);
        setFormulario(formularioVazio);
    };

    const classeCampo =
        "mt-2 w-full rounded-md border border-[#f1b519]/25 bg-black px-3 py-3 text-sm text-gray-200 outline-none transition focus:border-[#f1b519]";

    const statusEstoque = (produto) => {
        if (produto.quantidade === 0) {
            return {
                texto: "Sem estoque",
                classe: "bg-red-500/10 text-red-400"
            };
        }

        if (produto.quantidade <= produto.minimo) {
            return {
                texto: "Estoque baixo",
                classe: "bg-[#f1b519]/10 text-[#f1b519]"
            };
        }

        return {
            texto: "Normal",
            classe: "bg-emerald-500/10 text-emerald-400"
        };
    };

    return (
        <div className="min-h-screen bg-black text-white">

            {/* Menu lateral */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-60 flex-col border-r border-[#f1b519]/30 bg-black transition-transform duration-300 ${
                    menuAberto
                        ? "translate-x-0"
                        : "-translate-x-full"
                } lg:translate-x-0`}
            >
                <div className="flex h-24 shrink-0 items-center gap-3 border-b border-[#f1b519]/60 px-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                        <img
                            src={estrela}
                            alt="Estrela do Oriente"
                            className="h-12 w-12 object-contain"
                        />
                    </div>

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

                        return (
                            <button
                                key={item.nome}
                                onClick={() => navegar(item.nome)}
                                className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm transition-colors ${
                                    item.ativo
                                        ? "bg-[#f1b519]/20 text-[#f1b519]"
                                        : "text-gray-300 hover:bg-[#f1b519]/10 hover:text-[#f1b519]"
                                }`}
                            >
                                <Icone size={19} strokeWidth={1.8} />
                                <span>{item.nome}</span>

                                {item.ativo && (
                                    <span className="ml-auto h-2 w-2 rounded-full bg-[#f1b519]" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="border-t border-[#f1b519]/20 p-4">
                    <p className="text-xs text-gray-500">
                        Controle administrativo
                    </p>
                    <p className="mt-1 text-xs text-[#f1b519]">
                        Estrela do Oriente
                    </p>
                </div>
            </aside>

            {/* Fundo do menu mobile */}
            {menuAberto && (
                <button
                    aria-label="Fechar menu"
                    onClick={() => setMenuAberto(false)}
                    className="fixed inset-0 z-40 bg-black/70 lg:hidden"
                />
            )}

            {/* Conteúdo principal */}
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
                                Controle de Estoque
                            </h2>
                            <p className="hidden text-xs text-gray-400 sm:block">
                                Entradas, saídas e inventário
                            </p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-2 rounded-md border border-[#f1b519]/25 px-3 py-2 sm:flex">
                        <Warehouse size={16} className="text-[#f1b519]" />
                        <span className="text-xs text-gray-400">
                            Área administrativa
                        </span>
                    </div>
                </header>

                <main className="space-y-6 p-4 sm:p-6 lg:p-8">

                    {/* Título e ações */}
                    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl text-[#f1b519]">
                                Visão geral do estoque
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Acompanhe quantidades, valores e movimentações.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                                onClick={() => abrirMovimentacao("Saída")}
                                className="flex items-center justify-center gap-2 rounded-md border border-[#f1b519]/40 px-4 py-3 text-sm text-[#f1b519] transition hover:bg-[#f1b519]/10"
                            >
                                <ArrowUpFromLine size={17} />
                                Registrar saída
                            </button>

                            <button
                                onClick={() => abrirMovimentacao("Entrada")}
                                className="flex items-center justify-center gap-2 rounded-md bg-[#f1b519] px-4 py-3 text-sm font-medium text-black transition hover:bg-[#d9a30f]"
                            >
                                <Plus size={18} />
                                Registrar entrada
                            </button>
                        </div>
                    </section>

                    {/* Indicadores */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <div className="rounded-lg border border-[#f1b519]/40 bg-[#080808] p-5 transition-colors hover:border-[#f1b519]">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-300">
                                    Unidades em estoque
                                </p>
                                <Boxes size={22} className="text-[#f1b519]" />
                            </div>

                            <p className="mt-5 text-3xl text-[#f1b519]">
                                {totalUnidades}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Quantidade total de unidades
                            </p>
                        </div>

                        <div className="rounded-lg border border-[#f1b519]/40 bg-[#080808] p-5 transition-colors hover:border-[#f1b519]">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-300">
                                    Valor do estoque
                                </p>
                                <Warehouse size={22} className="text-[#f1b519]" />
                            </div>

                            <p className="mt-5 break-words text-2xl text-[#f1b519]">
                                {moeda(valorTotal)}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Avaliado pelo preço de custo
                            </p>
                        </div>

                        <div className="rounded-lg border border-[#f1b519]/40 bg-[#080808] p-5 transition-colors hover:border-[#f1b519]">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-300">
                                    Estoque baixo
                                </p>
                                <AlertTriangle size={22} className="text-[#f1b519]" />
                            </div>

                            <p className="mt-5 text-3xl text-[#f1b519]">
                                {produtosBaixos}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Produtos que precisam de reposição
                            </p>
                        </div>

                        <div className="rounded-lg border border-red-500/30 bg-[#080808] p-5 transition-colors hover:border-red-400/60">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-300">
                                    Produtos zerados
                                </p>
                                <AlertTriangle size={22} className="text-red-400" />
                            </div>

                            <p className="mt-5 text-3xl text-red-400">
                                {produtosZerados}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Produtos ativos sem unidades
                            </p>
                        </div>
                    </section>

                    {/* Movimentações resumidas */}
                    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <div className="flex items-center justify-between rounded-lg border border-[#f1b519]/30 bg-[#050505] p-5">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Entradas registradas
                                </p>
                                <p className="mt-2 text-2xl text-emerald-400">
                                    +{entradasHoje} un.
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Total de unidades nas entradas registradas
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10">
                                <TrendingUp size={23} className="text-emerald-400" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-[#f1b519]/30 bg-[#050505] p-5">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Saídas registradas
                                </p>
                                <p className="mt-2 text-2xl text-[#f1b519]">
                                    -{saidasHoje} un.
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Total de unidades nas saídas registradas
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[#f1b519]/20 bg-[#f1b519]/10">
                                <TrendingDown size={23} className="text-[#f1b519]" />
                            </div>
                        </div>
                    </section>

                    {/* Alerta de reposição */}
                    {(produtosBaixos > 0 || produtosZerados > 0) && (
                        <section className="rounded-lg border border-[#f1b519]/40 bg-[#f1b519]/[0.05] p-5">
                            <div className="flex items-start gap-3">
                                <AlertTriangle
                                    size={22}
                                    className="mt-0.5 shrink-0 text-[#f1b519]"
                                />

                                <div className="flex-1">
                                    <h3 className="text-sm text-[#f1b519]">
                                        Atenção à reposição
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-gray-400">
                                        {produtosZerados > 0 &&
                                            `${produtosZerados} produto(s) estão sem estoque. `}
                                        {produtosBaixos > 0 &&
                                            `${produtosBaixos} produto(s) estão no nível mínimo ou abaixo dele.`}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setAba("estoque");
                                        setFiltroEstoque("Baixo");
                                    }}
                                    className="shrink-0 text-xs text-[#f1b519] hover:underline"
                                >
                                    Ver itens
                                </button>
                            </div>
                        </section>
                    )}

                    {/* Painel de gerenciamento */}
                    <section className="overflow-hidden rounded-lg border border-[#f1b519]/40 bg-[#050505]">

                        {/* Abas */}
                        <div className="flex flex-col justify-between gap-4 border-b border-[#f1b519]/25 p-5 sm:flex-row sm:items-center">
                            <div className="flex gap-5">
                                <button
                                    onClick={() => setAba("estoque")}
                                    className={`border-b-2 pb-2 text-sm transition ${
                                        aba === "estoque"
                                            ? "border-[#f1b519] text-[#f1b519]"
                                            : "border-transparent text-gray-500 hover:text-gray-300"
                                    }`}
                                >
                                    Posição de estoque
                                </button>

                                <button
                                    onClick={() => setAba("movimentacoes")}
                                    className={`flex items-center gap-2 border-b-2 pb-2 text-sm transition ${
                                        aba === "movimentacoes"
                                            ? "border-[#f1b519] text-[#f1b519]"
                                            : "border-transparent text-gray-500 hover:text-gray-300"
                                    }`}
                                >
                                    <History size={16} />
                                    Histórico
                                </button>
                            </div>

                            <div className="relative">
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
                                    placeholder={
                                        aba === "estoque"
                                            ? "Buscar produto..."
                                            : "Buscar movimentação..."
                                    }
                                    className="w-full rounded-md border border-[#f1b519]/25 bg-black py-2.5 pl-9 pr-3 text-sm text-gray-200 outline-none focus:border-[#f1b519] sm:w-64"
                                />
                            </div>
                        </div>

                        {aba === "estoque" && (
                            <>
                                {/* Filtros de estoque */}
                                <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <SlidersHorizontal size={15} />
                                        Filtros
                                    </div>

                                    <div className="relative">
                                        <select
                                            value={categoriaFiltro}
                                            onChange={(evento) =>
                                                setCategoriaFiltro(evento.target.value)
                                            }
                                            className="w-full appearance-none rounded-md border border-[#f1b519]/20 bg-black py-2 pl-3 pr-8 text-xs text-gray-300 outline-none focus:border-[#f1b519] sm:w-44"
                                        >
                                            <option value="Todas">
                                                Todas as categorias
                                            </option>
                                            {categorias.map((categoria) => (
                                                <option key={categoria} value={categoria}>
                                                    {categoria}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown
                                            size={14}
                                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#f1b519]"
                                        />
                                    </div>

                                    <div className="relative">
                                        <select
                                            value={filtroEstoque}
                                            onChange={(evento) =>
                                                setFiltroEstoque(evento.target.value)
                                            }
                                            className="w-full appearance-none rounded-md border border-[#f1b519]/20 bg-black py-2 pl-3 pr-8 text-xs text-gray-300 outline-none focus:border-[#f1b519] sm:w-44"
                                        >
                                            <option value="Todos">Todos os níveis</option>
                                            <option value="Normal">Estoque normal</option>
                                            <option value="Baixo">Estoque baixo</option>
                                            <option value="Zerado">Sem estoque</option>
                                        </select>
                                        <ChevronDown
                                            size={14}
                                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#f1b519]"
                                        />
                                    </div>

                                    {(busca ||
                                        categoriaFiltro !== "Todas" ||
                                        filtroEstoque !== "Todos") && (
                                        <button
                                            onClick={() => {
                                                setBusca("");
                                                setCategoriaFiltro("Todas");
                                                setFiltroEstoque("Todos");
                                            }}
                                            className="flex items-center gap-1 text-xs text-[#f1b519] hover:underline sm:ml-auto"
                                        >
                                            <RotateCcw size={13} />
                                            Limpar filtros
                                        </button>
                                    )}
                                </div>

                                {/* Tabela de estoque */}
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[850px] text-left text-sm">
                                        <thead>
                                            <tr className="bg-[#f1b519]/[0.07] text-xs text-[#c5a64a]">
                                                <th className="px-5 py-4 font-medium">
                                                    Produto
                                                </th>
                                                <th className="px-4 py-4 font-medium">
                                                    Categoria
                                                </th>
                                                <th className="px-4 py-4 font-medium">
                                                    Quantidade
                                                </th>
                                                <th className="px-4 py-4 font-medium">
                                                    Estoque mínimo
                                                </th>
                                                <th className="px-4 py-4 font-medium">
                                                    Valor em estoque
                                                </th>
                                                <th className="px-5 py-4 font-medium">
                                                    Situação
                                                </th>
                                                <th className="px-5 py-4 text-right font-medium">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {produtosFiltrados.map((produto) => {
                                                const status = statusEstoque(produto);

                                                return (
                                                    <tr
                                                        key={produto.id}
                                                        className="border-t border-white/10 text-gray-300 transition hover:bg-white/[0.025]"
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

                                                        <td className="px-4 py-4">
                                                            <span
                                                                className={
                                                                    produto.quantidade === 0
                                                                        ? "font-medium text-red-400"
                                                                        : produto.quantidade <= produto.minimo
                                                                        ? "font-medium text-[#f1b519]"
                                                                        : "text-gray-200"
                                                                }
                                                            >
                                                                {produto.quantidade} un.
                                                            </span>
                                                        </td>

                                                        <td className="px-4 py-4 text-gray-400">
                                                            {produto.minimo} un.
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-4 text-gray-200">
                                                            {moeda(
                                                                produto.quantidade * produto.custo
                                                            )}
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span
                                                                className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs ${status.classe}`}
                                                            >
                                                                {status.texto}
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    disabled={produto.status !== "Ativo"}
                                                                    onClick={() => {
                                                                        setFormulario({
                                                                            ...formularioVazio,
                                                                            produtoId: String(produto.id),
                                                                            tipo: "Entrada"
                                                                        });
                                                                        setModalAberto(true);
                                                                    }}
                                                                    title="Registrar entrada"
                                                                    aria-label={`Registrar entrada de ${produto.nome}`}
                                                                    className="rounded-md border border-emerald-500/25 p-2 text-emerald-400 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                                                                >
                                                                    <ArrowDownToLine size={16} />
                                                                </button>

                                                                <button
                                                                    disabled={
                                                                        produto.status !== "Ativo" ||
                                                                        produto.quantidade === 0
                                                                    }
                                                                    onClick={() => {
                                                                        setFormulario({
                                                                            ...formularioVazio,
                                                                            produtoId: String(produto.id),
                                                                            tipo: "Saída",
                                                                            motivo: "Venda"
                                                                        });
                                                                        setModalAberto(true);
                                                                    }}
                                                                    title="Registrar saída"
                                                                    aria-label={`Registrar saída de ${produto.nome}`}
                                                                    className="rounded-md border border-[#f1b519]/25 p-2 text-[#f1b519] transition hover:bg-[#f1b519]/10 disabled:cursor-not-allowed disabled:opacity-30"
                                                                >
                                                                    <ArrowUpFromLine size={16} />
                                                                </button>

                                                                <button
                                                                    disabled={produto.status !== "Ativo"}
                                                                    onClick={() => {
                                                                        setFormulario({
                                                                            ...formularioVazio,
                                                                            produtoId: String(produto.id),
                                                                            tipo: "Ajuste",
                                                                            quantidade: String(produto.quantidade)
                                                                        });
                                                                        setModalAberto(true);
                                                                    }}
                                                                    title="Ajustar inventário"
                                                                    aria-label={`Ajustar estoque de ${produto.nome}`}
                                                                    className="rounded-md border border-white/15 p-2 text-gray-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                                                >
                                                                    <SlidersHorizontal size={16} />
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
                                            <Warehouse
                                                size={34}
                                                className="mx-auto text-[#f1b519]/50"
                                            />
                                            <p className="mt-3 text-sm text-gray-300">
                                                Nenhum produto encontrado.
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Altere a busca ou os filtros selecionados.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-[#f1b519]/20 px-5 py-4">
                                    <p className="text-xs text-gray-500">
                                        Exibindo {produtosFiltrados.length} de {produtos.length} produtos.
                                    </p>
                                </div>
                            </>
                        )}

                        {aba === "movimentacoes" && (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[850px] text-left text-sm">
                                        <thead>
                                            <tr className="bg-[#f1b519]/[0.07] text-xs text-[#c5a64a]">
                                                <th className="px-5 py-4 font-medium">
                                                    Data
                                                </th>
                                                <th className="px-4 py-4 font-medium">
                                                    Produto
                                                </th>
                                                <th className="px-4 py-4 font-medium">
                                                    Tipo
                                                </th>
                                                <th className="px-4 py-4 font-medium">
                                                    Quantidade
                                                </th>
                                                <th className="px-4 py-4 font-medium">
                                                    Saldo anterior
                                                </th>
                                                <th className="px-4 py-4 font-medium">
                                                    Saldo atual
                                                </th>
                                                <th className="px-5 py-4 font-medium">
                                                    Motivo
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {movimentacoesFiltradas.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-t border-white/10 text-gray-300 transition hover:bg-white/[0.025]"
                                                >
                                                    <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-400">
                                                        {item.data}
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <p className="text-gray-200">
                                                            {item.produto}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {item.codigo}
                                                        </p>
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${
                                                                item.tipo === "Entrada"
                                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                                    : item.tipo === "Saída"
                                                                    ? "bg-[#f1b519]/10 text-[#f1b519]"
                                                                    : "bg-sky-500/10 text-sky-400"
                                                            }`}
                                                        >
                                                            {item.tipo === "Entrada" ? (
                                                                <ArrowDownToLine size={13} />
                                                            ) : item.tipo === "Saída" ? (
                                                                <ArrowUpFromLine size={13} />
                                                            ) : (
                                                                <SlidersHorizontal size={13} />
                                                            )}
                                                            {item.tipo}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        {item.tipo === "Entrada"
                                                            ? "+"
                                                            : item.tipo === "Saída"
                                                            ? "-"
                                                            : ""}
                                                        {item.quantidade} un.
                                                    </td>

                                                    <td className="px-4 py-4 text-gray-400">
                                                        {item.anterior} un.
                                                    </td>

                                                    <td className="px-4 py-4 text-gray-200">
                                                        {item.atual} un.
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <p>{item.motivo}</p>
                                                        {item.observacao && (
                                                            <p className="mt-1 max-w-48 truncate text-xs text-gray-500">
                                                                {item.observacao}
                                                            </p>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {movimentacoesFiltradas.length === 0 && (
                                        <div className="px-5 py-14 text-center">
                                            <History
                                                size={34}
                                                className="mx-auto text-[#f1b519]/50"
                                            />
                                            <p className="mt-3 text-sm text-gray-300">
                                                Nenhuma movimentação encontrada.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-[#f1b519]/20 px-5 py-4">
                                    <p className="text-xs text-gray-500">
                                        {movimentacoesFiltradas.length} movimentação(ões) encontrada(s).
                                    </p>
                                </div>
                            </>
                        )}
                    </section>
                </main>
            </div>

            {/* Modal de movimentação */}
            {modalAberto && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
                    onMouseDown={(evento) => {
                        if (evento.target === evento.currentTarget) {
                            setModalAberto(false);
                        }
                    }}
                >
                    <div className="my-auto w-full max-w-xl overflow-hidden rounded-lg border border-[#f1b519]/40 bg-[#080808] shadow-2xl">

                        <div className="flex items-center justify-between border-b border-[#f1b519]/25 p-5">
                            <div>
                                <h2 className="text-lg text-[#f1b519]">
                                    Registrar movimentação
                                </h2>
                                <p className="mt-1 text-xs text-gray-500">
                                    Atualize a quantidade e registre o motivo.
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

                        <form onSubmit={registrarMovimentacao}>
                            <div className="space-y-5 p-5">

                                <div>
                                    <label className="text-sm text-gray-300">
                                        Tipo de movimentação *
                                    </label>

                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                        {[
                                            {
                                                nome: "Entrada",
                                                icone: ArrowDownToLine
                                            },
                                            {
                                                nome: "Saída",
                                                icone: ArrowUpFromLine
                                            },
                                            {
                                                nome: "Ajuste",
                                                icone: SlidersHorizontal
                                            }
                                        ].map((tipo) => {
                                            const Icone = tipo.icone;

                                            return (
                                                <button
                                                    key={tipo.nome}
                                                    type="button"
                                                    onClick={() => {
                                                        atualizarCampo("tipo", tipo.nome);

                                                        if (tipo.nome === "Ajuste") {
                                                            atualizarCampo("motivo", "Inventário");
                                                        } else if (tipo.nome === "Saída") {
                                                            atualizarCampo("motivo", "Venda");
                                                        } else {
                                                            atualizarCampo("motivo", "Reposição");
                                                        }
                                                    }}
                                                    className={`flex flex-col items-center gap-2 rounded-md border px-2 py-3 text-xs transition ${
                                                        formulario.tipo === tipo.nome
                                                            ? "border-[#f1b519] bg-[#f1b519]/10 text-[#f1b519]"
                                                            : "border-white/10 text-gray-400 hover:border-[#f1b519]/40"
                                                    }`}
                                                >
                                                    <Icone size={20} />
                                                    {tipo.nome}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <label className="block text-sm text-gray-300">
                                    Produto *
                                    <select
                                        required
                                        value={formulario.produtoId}
                                        onChange={(evento) => {
                                            const id = evento.target.value;
                                            const produto = produtos.find(
                                                (item) => item.id === Number(id)
                                            );

                                            setFormulario((anterior) => ({
                                                ...anterior,
                                                produtoId: id,
                                                quantidade:
                                                    anterior.tipo === "Ajuste" && produto
                                                        ? String(produto.quantidade)
                                                        : ""
                                            }));
                                        }}
                                        className={classeCampo}
                                    >
                                        <option value="">
                                            Selecione um produto
                                        </option>
                                        {produtos
                                            .filter((produto) => produto.status === "Ativo")
                                            .map((produto) => (
                                                <option
                                                    key={produto.id}
                                                    value={produto.id}
                                                >
                                                    {produto.codigo} — {produto.nome} ({produto.quantidade} un.)
                                                </option>
                                            ))}
                                    </select>
                                </label>

                                {formulario.produtoId && (
                                    <div className="rounded-md border border-[#f1b519]/20 bg-[#f1b519]/[0.04] p-3">
                                        <p className="text-xs text-gray-400">
                                            Saldo atual
                                        </p>
                                        <p className="mt-1 text-lg text-[#f1b519]">
                                            {produtos.find(
                                                (item) =>
                                                    item.id === Number(formulario.produtoId)
                                            )?.quantidade ?? 0}{" "}
                                            unidades
                                        </p>
                                    </div>
                                )}

                                <label className="block text-sm text-gray-300">
                                    {formulario.tipo === "Ajuste"
                                        ? "Nova quantidade física no estoque *"
                                        : "Quantidade a movimentar *"}

                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={formulario.quantidade}
                                        onChange={(evento) =>
                                            atualizarCampo(
                                                "quantidade",
                                                evento.target.value
                                            )
                                        }
                                        placeholder="Informe a quantidade"
                                        className={classeCampo}
                                    />

                                    {formulario.tipo === "Ajuste" && (
                                        <span className="mt-2 block text-xs text-gray-500">
                                            Informe o saldo real contado. O sistema calculará a diferença.
                                        </span>
                                    )}
                                </label>

                                {formulario.tipo !== "Ajuste" && (
                                    <label className="block text-sm text-gray-300">
                                        Motivo *
                                        <select
                                            required
                                            value={formulario.motivo}
                                            onChange={(evento) =>
                                                atualizarCampo("motivo", evento.target.value)
                                            }
                                            className={classeCampo}
                                        >
                                            {(
                                                formulario.tipo === "Entrada"
                                                    ? [
                                                        "Reposição",
                                                        "Devolução",
                                                        "Compra",
                                                        "Outros"
                                                    ]
                                                    : [
                                                        "Venda",
                                                        "Devolução ao fornecedor",
                                                        "Perda ou avaria",
                                                        "Uso interno",
                                                        "Outros"
                                                    ]
                                            ).map((motivo) => (
                                                <option key={motivo} value={motivo}>
                                                    {motivo}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                )}

                                <label className="block text-sm text-gray-300">
                                    Observação
                                    <textarea
                                        rows={3}
                                        maxLength={300}
                                        value={formulario.observacao}
                                        onChange={(evento) =>
                                            atualizarCampo(
                                                "observacao",
                                                evento.target.value
                                            )
                                        }
                                        placeholder="Detalhes adicionais (opcional)"
                                        className={`${classeCampo} resize-y`}
                                    />
                                </label>

                                <div className="flex items-start gap-2 rounded-md border border-[#f1b519]/20 bg-[#f1b519]/[0.04] p-3">
                                    <AlertTriangle
                                        size={16}
                                        className="mt-0.5 shrink-0 text-[#f1b519]"
                                    />
                                    <p className="text-xs leading-5 text-gray-400">
                                        Ao confirmar, o saldo do produto será atualizado e a movimentação será adicionada ao histórico.
                                    </p>
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
                                    {formulario.tipo === "Entrada" ? (
                                        <ArrowDownToLine size={17} />
                                    ) : formulario.tipo === "Saída" ? (
                                        <ArrowUpFromLine size={17} />
                                    ) : (
                                        <SlidersHorizontal size={17} />
                                    )}

                                    Confirmar movimentação
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EstoquePage;
