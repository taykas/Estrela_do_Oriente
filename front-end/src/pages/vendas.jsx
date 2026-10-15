import { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
    Package,
    ShoppingCart,
    Menu,
    Search,
    Bell,
    Plus,
    X,
    Minus,
    Trash2,
    Eye,
    ReceiptText,
    DollarSign,
    TrendingUp,
    ShoppingBag,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    CircleAlert,
    ChartNoAxesCombined
} from "lucide-react";

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

const vendasIniciais = [
    {
        id: 1001,
        cliente: "Maria Oliveira",
        data: "2026-10-15",
        itens: [
            { id: 7, nome: "Defumador", quantidade: 2, preco: 22.90 },
            { id: 11, nome: "Vela Aromática", quantidade: 1, preco: 16.90 }
        ],
        pagamento: "Pix",
        desconto: 0,
        status: "Concluída"
    },
    {
        id: 1002,
        cliente: "João Santos",
        data: "2026-10-15",
        itens: [
            { id: 9, nome: "Quartzo Rosa", quantidade: 1, preco: 29.90 },
            { id: 3, nome: "Patuá", quantidade: 1, preco: 24.90 }
        ],
        pagamento: "Dinheiro",
        desconto: 0,
        status: "Concluída"
    },
    {
        id: 1003,
        cliente: "Ana Costa",
        data: "2026-10-14",
        itens: [
            { id: 2, nome: "Vela de 7 Dias", quantidade: 2, preco: 18.90 }
        ],
        pagamento: "Cartão de débito",
        desconto: 0,
        status: "Concluída"
    },
    {
        id: 1004,
        cliente: "Carlos Mendes",
        data: "2026-10-14",
        itens: [
            { id: 12, nome: "Incenso de Mirra", quantidade: 3, preco: 11.90 }
        ],
        pagamento: "Pix",
        desconto: 0,
        status: "Cancelada"
    },
    {
        id: 1005,
        cliente: "Fernanda Lima",
        data: "2026-10-13",
        itens: [
            { id: 4, nome: "Erva de Proteção", quantidade: 2, preco: 9.90 },
            { id: 5, nome: "Óleo de Unção", quantidade: 1, preco: 15.90 }
        ],
        pagamento: "Cartão de crédito",
        desconto: 0,
        status: "Concluída"
    }
];

const moeda = (valor) =>
    valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

const dataAtual = () => {
    const data = new Date();

    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
};

const formatarData = (data) => {
    if (!data) return "—";

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
};

const subtotalVenda = (venda) =>
    venda.itens.reduce(
        (total, item) => total + item.quantidade * item.preco,
        0
    );

const totalVenda = (venda) =>
    subtotalVenda(venda) * (1 - (venda.desconto || 0) / 100);

const campoClasse =
    "w-full rounded-lg border border-[#e6dfcd] bg-[#faf9f5] px-3 py-2.5 text-sm text-[#45433d] outline-none transition placeholder:text-[#918d83] focus:border-[#b18a20]";

const cardClasse =
    "rounded-xl border border-[#e6dfcd] bg-[#fffefa] shadow-sm";

export const Vendas = () => {
    const [produtos, setProdutos] = useState(produtosIniciais);
    const [vendas, setVendas] = useState(vendasIniciais);

    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("Todas");
    const [filtroPagamento, setFiltroPagamento] = useState("Todos");
    const [pagina, setPagina] = useState(1);

    const [modalAberto, setModalAberto] = useState(false);
    const [vendaSelecionada, setVendaSelecionada] = useState(null);

    const [buscaProduto, setBuscaProduto] = useState("");
    const [carrinho, setCarrinho] = useState([]);
    const [cliente, setCliente] = useState("");
    const [pagamento, setPagamento] = useState("Pix");
    const [desconto, setDesconto] = useState("0");

    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("erro");

    const porPagina = 8;

    const vendasFiltradas = vendas.filter((venda) => {
        const termo = busca.toLowerCase();

        const correspondeBusca =
            String(venda.id).includes(termo) ||
            venda.cliente.toLowerCase().includes(termo) ||
            venda.itens.some((item) =>
                item.nome.toLowerCase().includes(termo)
            );

        const correspondeStatus =
            filtroStatus === "Todas" || venda.status === filtroStatus;

        const correspondePagamento =
            filtroPagamento === "Todos" ||
            venda.pagamento === filtroPagamento;

        return correspondeBusca && correspondeStatus && correspondePagamento;
    });

    const totalPaginas = Math.max(
        1,
        Math.ceil(vendasFiltradas.length / porPagina)
    );

    const vendasPagina = vendasFiltradas.slice(
        (pagina - 1) * porPagina,
        pagina * porPagina
    );

    const vendasConcluidas = vendas.filter(
        (venda) => venda.status === "Concluída"
    );

    const vendasHoje = vendasConcluidas.filter(
        (venda) => venda.data === dataAtual()
    );

    const faturamentoHoje = vendasHoje.reduce(
        (total, venda) => total + totalVenda(venda),
        0
    );

    const faturamentoTotal = vendasConcluidas.reduce(
        (total, venda) => total + totalVenda(venda),
        0
    );

    const quantidadeVendida = vendasConcluidas.reduce(
        (total, venda) =>
            total +
            venda.itens.reduce(
                (subtotal, item) => subtotal + item.quantidade,
                0
            ),
        0
    );

    const ticketMedio =
        vendasConcluidas.length > 0
            ? faturamentoTotal / vendasConcluidas.length
            : 0;

    const subtotal = carrinho.reduce(
        (total, item) => total + item.quantidade * item.preco,
        0
    );

    const descontoNumerico = Math.min(
        100,
        Math.max(0, Number(desconto) || 0)
    );

    const valorDesconto = subtotal * (descontoNumerico / 100);
    const totalCarrinho = Math.max(0, subtotal - valorDesconto);

    const produtosDisponiveis = produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(buscaProduto.toLowerCase()) ||
        produto.categoria.toLowerCase().includes(buscaProduto.toLowerCase())
    );

    const mostrarMensagem = (texto, tipo = "erro") => {
        setMensagem(texto);
        setTipoMensagem(tipo);
    };

    const abrirNovaVenda = () => {
        setCarrinho([]);
        setCliente("");
        setPagamento("Pix");
        setDesconto("0");
        setBuscaProduto("");
        setMensagem("");
        setVendaSelecionada(null);
        setModalAberto(true);
    };

    const abrirDetalhes = (venda) => {
        setVendaSelecionada(venda);
        setMensagem("");
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setVendaSelecionada(null);
        setMensagem("");
    };

    const adicionarProduto = (produto) => {
        if (produto.quantidade <= 0) {
            mostrarMensagem("Esse produto está sem estoque disponível.");
            return;
        }

        const itemExistente = carrinho.find(
            (item) => item.id === produto.id
        );

        const quantidadeNoCarrinho = itemExistente?.quantidade || 0;

        if (quantidadeNoCarrinho >= produto.quantidade) {
            mostrarMensagem(
                "A quantidade selecionada ultrapassa o estoque disponível."
            );
            return;
        }

        if (itemExistente) {
            setCarrinho((atuais) =>
                atuais.map((item) =>
                    item.id === produto.id
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                )
            );
        } else {
            setCarrinho((atuais) => [
                ...atuais,
                {
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    quantidade: 1,
                    estoqueDisponivel: produto.quantidade
                }
            ]);
        }

        setMensagem("");
    };

    const alterarQuantidade = (id, variacao) => {
        const itemAtual = carrinho.find((item) => item.id === id);

        if (!itemAtual) return;

        const novaQuantidade = itemAtual.quantidade + variacao;

        if (novaQuantidade > itemAtual.estoqueDisponivel) {
            mostrarMensagem(
                "Não há estoque suficiente para essa quantidade."
            );
            return;
        }

        setCarrinho((atuais) =>
            atuais
                .map((item) =>
                    item.id === id
                        ? { ...item, quantidade: novaQuantidade }
                        : item
                )
                .filter((item) => item.quantidade > 0)
        );

        setMensagem("");
    };

    const removerProduto = (id) => {
        setCarrinho((atuais) =>
            atuais.filter((item) => item.id !== id)
        );

        setMensagem("");
    };

    const registrarVenda = () => {
        if (carrinho.length === 0) {
            mostrarMensagem("Adicione pelo menos um produto à venda.");
            return;
        }

        const estoqueInsuficiente = carrinho.find((item) => {
            const produtoAtual = produtos.find(
                (produto) => produto.id === item.id
            );

            return (
                !produtoAtual ||
                item.quantidade > produtoAtual.quantidade
            );
        });

        if (estoqueInsuficiente) {
            mostrarMensagem(
                `Estoque insuficiente para ${estoqueInsuficiente.nome}.`
            );
            return;
        }

        const novaVenda = {
            id: vendas.length
                ? Math.max(...vendas.map((venda) => venda.id)) + 1
                : 1001,
            cliente: cliente.trim() || "Cliente não identificado",
            data: dataAtual(),
            itens: carrinho.map(({ id, nome, preco, quantidade }) => ({
                id,
                nome,
                preco,
                quantidade
            })),
            pagamento,
            desconto: descontoNumerico,
            status: "Concluída"
        };

        setProdutos((atuais) =>
            atuais.map((produto) => {
                const itemVendido = carrinho.find(
                    (item) => item.id === produto.id
                );

                return itemVendido
                    ? {
                        ...produto,
                        quantidade:
                            produto.quantidade - itemVendido.quantidade
                    }
                    : produto;
            })
        );

        setVendas((atuais) => [novaVenda, ...atuais]);
        setPagina(1);

        setCarrinho([]);
        setCliente("");
        setDesconto("0");

        mostrarMensagem("Venda registrada com sucesso!", "sucesso");

        setTimeout(() => {
            setModalAberto(false);
            setMensagem("");
        }, 900);
    };

    const indicadores = [
        {
            titulo: "Faturamento de Hoje",
            valor: moeda(faturamentoHoje),
            descricao: `${vendasHoje.length} venda(s) concluída(s) hoje`,
            icone: DollarSign
        },
        {
            titulo: "Vendas Concluídas",
            valor: vendasConcluidas.length,
            descricao: "Vendas registradas no sistema",
            icone: ShoppingBag
        },
        {
            titulo: "Produtos Vendidos",
            valor: quantidadeVendida,
            descricao: "Unidades em vendas concluídas",
            icone: TrendingUp
        },
        {
            titulo: "Ticket Médio",
            valor: moeda(ticketMedio),
            descricao: "Valor médio por venda",
            icone: ReceiptText
        }
    ];

    return (
        <div className="min-h-screen bg-[#f3f1eb] text-[#35342f]">
            <Sidebar />

            <div className="min-h-screen lg:ml-60">
                {/* Cabeçalho */}
                <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-[#e3dcc9] bg-[#faf9f5]/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
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
                                Vendas
                            </h2>

                            <p className="hidden text-xs text-[#89867d] sm:block">
                                Gerenciamento da loja
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="hidden items-center gap-2 rounded-lg border border-[#e6dfcd] bg-[#fffefa] px-3 py-2 sm:flex">
                            <Search size={17} className="text-[#918d83]" />
                            <input
                                value={busca}
                                onChange={(e) => {
                                    setBusca(e.target.value);
                                    setPagina(1);
                                }}
                                placeholder="Buscar venda..."
                                className="w-36 bg-transparent text-sm text-[#45433d] outline-none placeholder:text-[#918d83] lg:w-48"
                            />
                        </div>

                        <button
                            aria-label="Notificações"
                            className="text-[#98700a] transition hover:text-[#6f5200]"
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
                    {/* Título e ação */}
                    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-lg font-medium text-[#78601e]">
                                Resumo das vendas
                            </h1>
                            <p className="mt-1 text-sm text-[#77746b]">
                                Acompanhe os resultados e registre novas vendas.
                            </p>
                        </div>

                        <button
                            onClick={abrirNovaVenda}
                            className="flex items-center justify-center gap-2 rounded-lg bg-[#98700a] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#806009]"
                        >
                            <Plus size={18} />
                            Nova venda
                        </button>
                    </section>

                    {/* Indicadores */}
                    <section>
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-lg font-medium text-[#78601e]">
                                Indicadores
                            </h2>

                            <span className="text-xs text-[#918d83]">
                                Dados demonstrativos
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {indicadores.map((item) => {
                                const Icone = item.icone;

                                return (
                                    <div
                                        key={item.titulo}
                                        className="rounded-xl border border-[#e6dfcd] bg-[#fffefa] p-5 shadow-sm transition-all hover:border-[#d4b65e] hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm text-[#77746b]">
                                                {item.titulo}
                                            </p>

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f5edda]">
                                                <Icone
                                                    size={21}
                                                    className="text-[#a77b08]"
                                                    strokeWidth={1.7}
                                                />
                                            </div>
                                        </div>

                                        <p className="mt-5 break-words text-2xl font-semibold text-[#8b690e]">
                                            {item.valor}
                                        </p>

                                        <div className="mt-4 border-t border-[#eee7d7] pt-3">
                                            <p className="text-xs text-[#77746b]">
                                                {item.descricao}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Resumo financeiro e vendas recentes */}
                    <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                        <div className={`${cardClasse} overflow-hidden xl:col-span-3`}>
                            <div className="flex items-center justify-between border-b border-[#eee7d7] p-5">
                                <div className="flex items-center gap-2">
                                    <ChartNoAxesCombined
                                        size={20}
                                        className="text-[#a77b08]"
                                    />
                                    <h2 className="text-lg font-medium text-[#78601e]">
                                        Resumo financeiro
                                    </h2>
                                </div>
                            </div>

                            <div className="p-5">
                                <p className="text-sm text-[#77746b]">
                                    Faturamento acumulado
                                </p>

                                <p className="mt-2 text-3xl font-semibold text-[#8b690e]">
                                    {moeda(faturamentoTotal)}
                                </p>

                                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="rounded-lg border border-[#e6dfcd] bg-[#faf9f5] p-4">
                                        <p className="text-xs text-[#918d83]">
                                            Faturamento de hoje
                                        </p>
                                        <p className="mt-2 font-semibold text-[#8b690e]">
                                            {moeda(faturamentoHoje)}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-[#e6dfcd] bg-[#faf9f5] p-4">
                                        <p className="text-xs text-[#918d83]">
                                            Vendas hoje
                                        </p>
                                        <p className="mt-2 font-semibold text-[#45433d]">
                                            {vendasHoje.length}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-[#e6dfcd] bg-[#faf9f5] p-4">
                                        <p className="text-xs text-[#918d83]">
                                            Unidades vendidas
                                        </p>
                                        <p className="mt-2 font-semibold text-[#45433d]">
                                            {quantidadeVendida}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`${cardClasse} overflow-hidden xl:col-span-2`}>
                            <div className="flex items-center justify-between border-b border-[#eee7d7] p-5">
                                <div className="flex items-center gap-2">
                                    <CalendarDays
                                        size={20}
                                        className="text-[#a77b08]"
                                    />
                                    <h2 className="text-lg font-medium text-[#78601e]">
                                        Vendas recentes
                                    </h2>
                                </div>
                            </div>

                            <div className="divide-y divide-[#eeeae0] px-4">
                                {vendas.slice(0, 4).map((venda) => (
                                    <div
                                        key={venda.id}
                                        className="flex items-center justify-between gap-3 py-4"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e9dfc4] bg-[#f6f0e1]">
                                                <ShoppingCart
                                                    size={18}
                                                    className="text-[#a77b08]"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-[#45433d]">
                                                    {venda.cliente}
                                                </p>
                                                <p className="mt-1 text-xs text-[#918d83]">
                                                    Venda #{venda.id} · {formatarData(venda.data)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-semibold text-[#8b690e]">
                                                {moeda(totalVenda(venda))}
                                            </p>
                                            <p
                                                className={`mt-1 text-[10px] ${
                                                    venda.status === "Concluída"
                                                        ? "text-emerald-700"
                                                        : "text-amber-700"
                                                }`}
                                            >
                                                {venda.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {vendas.length === 0 && (
                                    <p className="py-8 text-center text-sm text-[#918d83]">
                                        Nenhuma venda registrada.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Histórico */}
                    <section className={`${cardClasse} overflow-hidden`}>
                        <div className="flex items-center justify-between border-b border-[#eee7d7] p-5">
                            <div className="flex items-center gap-2">
                                <ReceiptText
                                    size={20}
                                    className="text-[#a77b08]"
                                />

                                <div>
                                    <h2 className="text-lg font-medium text-[#78601e]">
                                        Histórico de vendas
                                    </h2>
                                    <p className="mt-1 text-xs text-[#918d83]">
                                        Consulte as vendas e seus respectivos pagamentos.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Filtros */}
                        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
                            <div className="flex items-center gap-2 rounded-lg border border-[#e6dfcd] bg-[#faf9f5] px-3 py-2.5">
                                <Search
                                    size={17}
                                    className="shrink-0 text-[#918d83]"
                                />
                                <input
                                    value={busca}
                                    onChange={(e) => {
                                        setBusca(e.target.value);
                                        setPagina(1);
                                    }}
                                    placeholder="Buscar cliente, produto ou código..."
                                    className="w-full bg-transparent text-sm text-[#45433d] outline-none placeholder:text-[#918d83]"
                                />
                            </div>

                            <select
                                value={filtroStatus}
                                onChange={(e) => {
                                    setFiltroStatus(e.target.value);
                                    setPagina(1);
                                }}
                                className={campoClasse}
                            >
                                <option value="Todas">Todos os status</option>
                                <option value="Concluída">Concluídas</option>
                                <option value="Cancelada">Canceladas</option>
                            </select>

                            <select
                                value={filtroPagamento}
                                onChange={(e) => {
                                    setFiltroPagamento(e.target.value);
                                    setPagina(1);
                                }}
                                className={campoClasse}
                            >
                                <option value="Todos">Todas as formas de pagamento</option>
                                <option value="Pix">Pix</option>
                                <option value="Dinheiro">Dinheiro</option>
                                <option value="Cartão de débito">Cartão de débito</option>
                                <option value="Cartão de crédito">Cartão de crédito</option>
                            </select>
                        </div>

                        {/* Tabela */}
                        <div className="overflow-x-auto px-4">
                            <table className="w-full min-w-[850px] text-left text-sm">
                                <thead>
                                    <tr className="bg-[#f5f1e7] text-xs text-[#81734e]">
                                        <th className="px-4 py-3 font-medium">Venda</th>
                                        <th className="px-4 py-3 font-medium">Cliente</th>
                                        <th className="px-4 py-3 font-medium">Data</th>
                                        <th className="px-4 py-3 font-medium">Itens</th>
                                        <th className="px-4 py-3 font-medium">Pagamento</th>
                                        <th className="px-4 py-3 font-medium">Total</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 text-center font-medium">Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {vendasPagina.map((venda, index) => (
                                        <tr
                                            key={venda.id}
                                            className={`border-t border-[#eeeae0] text-[#5f5c54] transition-colors hover:bg-[#f8f5ed] ${
                                                index % 2 === 1 ? "bg-[#fcfbf7]" : ""
                                            }`}
                                        >
                                            <td className="whitespace-nowrap px-4 py-4 font-medium text-[#98700a]">
                                                #{venda.id}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-[#45433d]">
                                                {venda.cliente}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4">
                                                {formatarData(venda.data)}
                                            </td>

                                            <td className="px-4 py-4">
                                                {venda.itens.reduce(
                                                    (total, item) => total + item.quantidade,
                                                    0
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4">
                                                {venda.pagamento}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 font-medium text-[#45433d]">
                                                {moeda(totalVenda(venda))}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        venda.status === "Concluída"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-amber-100 text-amber-800"
                                                    }`}
                                                >
                                                    {venda.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        title="Ver detalhes"
                                                        onClick={() => abrirDetalhes(venda)}
                                                        className="rounded-md p-2 text-[#918d83] transition hover:bg-[#f1e8d1] hover:text-[#98700a]"
                                                    >
                                                        <Eye size={17} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {vendasPagina.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="px-4 py-12 text-center text-[#918d83]"
                                            >
                                                Nenhuma venda encontrada.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginação */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eee7d7] p-4">
                            <p className="text-xs text-[#918d83]">
                                Mostrando{" "}
                                {vendasFiltradas.length === 0
                                    ? 0
                                    : (pagina - 1) * porPagina + 1}{" "}
                                a {Math.min(pagina * porPagina, vendasFiltradas.length)} de{" "}
                                {vendasFiltradas.length} vendas
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    disabled={pagina === 1}
                                    onClick={() => setPagina((atual) => atual - 1)}
                                    className="rounded-lg border border-[#e6dfcd] p-2 text-[#68645b] transition hover:border-[#cfb15a] hover:bg-[#f8f3e6] disabled:cursor-not-allowed disabled:opacity-30"
                                    aria-label="Página anterior"
                                >
                                    <ChevronLeft size={17} />
                                </button>

                                <span className="rounded-lg bg-[#98700a] px-3 py-2 text-sm font-medium text-white">
                                    {pagina}
                                </span>

                                <button
                                    disabled={pagina >= totalPaginas}
                                    onClick={() => setPagina((atual) => atual + 1)}
                                    className="rounded-lg border border-[#e6dfcd] p-2 text-[#68645b] transition hover:border-[#cfb15a] hover:bg-[#f8f3e6] disabled:cursor-not-allowed disabled:opacity-30"
                                    aria-label="Próxima página"
                                >
                                    <ChevronRight size={17} />
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Modal */}
            {modalAberto && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#35342f]/40 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) fecharModal();
                    }}
                >
                    <div className="my-auto max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-[#e6dfcd] bg-[#fffefa] shadow-2xl">
                        {/* Cabeçalho do modal */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eee7d7] bg-[#fffefa] p-5">
                            <div>
                                <h2 className="text-xl font-medium text-[#78601e]">
                                    {vendaSelecionada
                                        ? `Detalhes da venda #${vendaSelecionada.id}`
                                        : "Registrar nova venda"}
                                </h2>

                                <p className="mt-1 text-sm text-[#918d83]">
                                    {vendaSelecionada
                                        ? "Confira os produtos e os valores desta venda."
                                        : "Adicione os produtos e informe os dados da venda."}
                                </p>
                            </div>

                            <button
                                onClick={fecharModal}
                                aria-label="Fechar modal"
                                className="rounded-lg p-2 text-[#918d83] transition hover:bg-[#f5f1e7] hover:text-[#45433d]"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        {/* Detalhes de uma venda existente */}
                        {vendaSelecionada ? (
                            <div className="space-y-5 p-5">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="rounded-lg border border-[#e6dfcd] bg-[#faf9f5] p-4">
                                        <p className="text-xs text-[#918d83]">Cliente</p>
                                        <p className="mt-2 font-medium text-[#45433d]">
                                            {vendaSelecionada.cliente}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-[#e6dfcd] bg-[#faf9f5] p-4">
                                        <p className="text-xs text-[#918d83]">Data da venda</p>
                                        <p className="mt-2 font-medium text-[#45433d]">
                                            {formatarData(vendaSelecionada.data)}
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-[#e6dfcd] bg-[#faf9f5] p-4">
                                        <p className="text-xs text-[#918d83]">Pagamento</p>
                                        <p className="mt-2 font-medium text-[#45433d]">
                                            {vendaSelecionada.pagamento}
                                        </p>
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-lg border border-[#e6dfcd]">
                                    <table className="w-full min-w-[500px] text-left text-sm">
                                        <thead>
                                            <tr className="bg-[#f5f1e7] text-xs text-[#81734e]">
                                                <th className="px-4 py-3 font-medium">Produto</th>
                                                <th className="px-4 py-3 font-medium">Quantidade</th>
                                                <th className="px-4 py-3 font-medium">Preço unitário</th>
                                                <th className="px-4 py-3 text-right font-medium">Subtotal</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {vendaSelecionada.itens.map((item, index) => (
                                                <tr
                                                    key={`${item.id}-${index}`}
                                                    className="border-t border-[#eeeae0] text-[#5f5c54]"
                                                >
                                                    <td className="px-4 py-3 text-[#45433d]">
                                                        {item.nome}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {item.quantidade}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {moeda(item.preco)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium text-[#45433d]">
                                                        {moeda(item.quantidade * item.preco)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex flex-col items-end gap-2 border-t border-[#eee7d7] pt-4">
                                    <p className="text-sm text-[#77746b]">
                                        Subtotal: {moeda(subtotalVenda(vendaSelecionada))}
                                    </p>

                                    {(vendaSelecionada.desconto || 0) > 0 && (
                                        <p className="text-sm text-[#77746b]">
                                            Desconto ({vendaSelecionada.desconto}%):{" "}
                                            -{moeda(
                                                subtotalVenda(vendaSelecionada) *
                                                vendaSelecionada.desconto / 100
                                            )}
                                        </p>
                                    )}

                                    <p className="text-sm text-[#77746b]">
                                        Status: {vendaSelecionada.status}
                                    </p>

                                    <p className="text-2xl font-semibold text-[#8b690e]">
                                        Total: {moeda(totalVenda(vendaSelecionada))}
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={fecharModal}
                                        className="rounded-lg border border-[#e6dfcd] px-4 py-2.5 text-sm text-[#68645b] transition hover:bg-[#f5f1e7]"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Formulário de nova venda */
                            <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-5">
                                <div className="space-y-4 lg:col-span-3">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-[#68645b]">
                                            Nome do cliente
                                        </label>

                                        <input
                                            value={cliente}
                                            onChange={(e) => setCliente(e.target.value)}
                                            placeholder="Digite o nome do cliente (opcional)"
                                            className={campoClasse}
                                        />
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <label className="block text-sm font-medium text-[#68645b]">
                                                Produtos disponíveis
                                            </label>

                                            <span className="text-xs text-[#918d83]">
                                                {produtosDisponiveis.length} produto(s)
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 rounded-lg border border-[#e6dfcd] bg-[#faf9f5] px-3 py-2.5">
                                            <Search size={17} className="text-[#918d83]" />

                                            <input
                                                value={buscaProduto}
                                                onChange={(e) => setBuscaProduto(e.target.value)}
                                                placeholder="Buscar produto por nome ou categoria..."
                                                className="w-full bg-transparent text-sm text-[#45433d] outline-none placeholder:text-[#918d83]"
                                            />
                                        </div>
                                    </div>

                                    <div className="max-h-[380px] space-y-2 overflow-y-auto pr-1">
                                        {produtosDisponiveis.map((produto) => {
                                            const noCarrinho = carrinho.find(
                                                (item) => item.id === produto.id
                                            );

                                            const semEstoque = produto.quantidade === 0;
                                            const limiteAtingido =
                                                noCarrinho &&
                                                noCarrinho.quantidade >= produto.quantidade;

                                            return (
                                                <div
                                                    key={produto.id}
                                                    className="flex items-center justify-between gap-3 rounded-xl border border-[#e6dfcd] bg-[#fffefa] p-3 transition hover:border-[#d4b65e] hover:bg-[#fcfbf7]"
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#e9dfc4] bg-[#f6f0e1]">
                                                            <Package
                                                                size={19}
                                                                className="text-[#a77b08]"
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium text-[#45433d]">
                                                                {produto.nome}
                                                            </p>

                                                            <p className="mt-1 text-xs text-[#918d83]">
                                                                {produto.categoria} · Estoque: {produto.quantidade}
                                                            </p>

                                                            <p className="mt-1 text-sm font-semibold text-[#8b690e]">
                                                                {moeda(produto.preco)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => adicionarProduto(produto)}
                                                        disabled={semEstoque || Boolean(limiteAtingido)}
                                                        title={
                                                            semEstoque
                                                                ? "Produto sem estoque"
                                                                : limiteAtingido
                                                                    ? "Limite do estoque atingido"
                                                                    : "Adicionar produto"
                                                        }
                                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f1e8d1] text-[#89670d] transition hover:bg-[#e9d7a4] disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                            );
                                        })}

                                        {produtosDisponiveis.length === 0 && (
                                            <p className="py-8 text-center text-sm text-[#918d83]">
                                                Nenhum produto encontrado.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Carrinho */}
                                <div className="lg:col-span-2">
                                    <div className="rounded-xl border border-[#e6dfcd] bg-[#faf9f5] p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1e8d1]">
                                                    <ShoppingCart
                                                        size={19}
                                                        className="text-[#98700a]"
                                                    />
                                                </div>

                                                <h3 className="font-medium text-[#78601e]">
                                                    Carrinho
                                                </h3>
                                            </div>

                                            <span className="rounded-full bg-[#f1e8d1] px-2.5 py-1 text-xs font-medium text-[#89670d]">
                                                {carrinho.reduce(
                                                    (total, item) => total + item.quantidade,
                                                    0
                                                )}{" "}
                                                item(ns)
                                            </span>
                                        </div>

                                        <div className="max-h-[250px] space-y-3 overflow-y-auto">
                                            {carrinho.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="rounded-lg border border-[#e6dfcd] bg-[#fffefa] p-3"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm font-medium text-[#45433d]">
                                                            {item.nome}
                                                        </p>

                                                        <button
                                                            onClick={() => removerProduto(item.id)}
                                                            aria-label={`Remover ${item.nome}`}
                                                            className="rounded p-1 text-[#b34b40] transition hover:bg-red-50 hover:text-[#963b32]"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>

                                                    <div className="mt-3 flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => alterarQuantidade(item.id, -1)}
                                                                aria-label="Diminuir quantidade"
                                                                className="flex h-7 w-7 items-center justify-center rounded-md border border-[#e6dfcd] text-[#68645b] transition hover:bg-[#f5f1e7]"
                                                            >
                                                                <Minus size={13} />
                                                            </button>

                                                            <span className="min-w-5 text-center text-sm text-[#45433d]">
                                                                {item.quantidade}
                                                            </span>

                                                            <button
                                                                onClick={() => alterarQuantidade(item.id, 1)}
                                                                disabled={item.quantidade >= item.estoqueDisponivel}
                                                                aria-label="Aumentar quantidade"
                                                                className="flex h-7 w-7 items-center justify-center rounded-md border border-[#e6dfcd] text-[#68645b] transition hover:bg-[#f5f1e7] disabled:cursor-not-allowed disabled:opacity-30"
                                                            >
                                                                <Plus size={13} />
                                                            </button>
                                                        </div>

                                                        <p className="text-sm font-semibold text-[#8b690e]">
                                                            {moeda(item.quantidade * item.preco)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}

                                            {carrinho.length === 0 && (
                                                <div className="rounded-lg border border-dashed border-[#d8cfba] py-10 text-center">
                                                    <ShoppingCart
                                                        size={28}
                                                        className="mx-auto text-[#c4b99e]"
                                                    />

                                                    <p className="mt-3 text-sm text-[#77746b]">
                                                        Seu carrinho está vazio.
                                                    </p>

                                                    <p className="mt-1 text-xs text-[#918d83]">
                                                        Adicione produtos para continuar.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 border-t border-[#e6dfcd] pt-4">
                                            <label className="mb-2 block text-sm font-medium text-[#68645b]">
                                                Forma de pagamento
                                            </label>

                                            <select
                                                value={pagamento}
                                                onChange={(e) => setPagamento(e.target.value)}
                                                className={campoClasse}
                                            >
                                                <option value="Pix">Pix</option>
                                                <option value="Dinheiro">Dinheiro</option>
                                                <option value="Cartão de débito">Cartão de débito</option>
                                                <option value="Cartão de crédito">Cartão de crédito</option>
                                            </select>

                                            <label className="mb-2 mt-4 block text-sm font-medium text-[#68645b]">
                                                Desconto (%)
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="1"
                                                value={desconto}
                                                onChange={(e) => setDesconto(e.target.value)}
                                                className={campoClasse}
                                            />

                                            <div className="mt-4 space-y-3">
                                                <div className="flex justify-between text-sm text-[#77746b]">
                                                    <span>Subtotal</span>
                                                    <span>{moeda(subtotal)}</span>
                                                </div>

                                                <div className="flex justify-between text-sm text-[#77746b]">
                                                    <span>Desconto</span>
                                                    <span>- {moeda(valorDesconto)}</span>
                                                </div>

                                                <div className="flex items-center justify-between border-t border-[#e6dfcd] pt-3">
                                                    <span className="font-medium text-[#45433d]">
                                                        Total
                                                    </span>

                                                    <span className="text-xl font-semibold text-[#8b690e]">
                                                        {moeda(totalCarrinho)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mensagens */}
                                    {mensagem && (
                                        <div
                                            className={`mt-4 flex items-start gap-2 rounded-lg border p-3 text-sm ${
                                                tipoMensagem === "sucesso"
                                                    ? "border-[#b9d9c5] bg-[#edf7f0] text-[#32734a]"
                                                    : "border-[#e6c8c3] bg-[#fdf0ed] text-[#b34b40]"
                                            }`}
                                        >
                                            {tipoMensagem === "sucesso" ? (
                                                <CheckCircle2
                                                    size={18}
                                                    className="mt-0.5 shrink-0"
                                                />
                                            ) : (
                                                <CircleAlert
                                                    size={18}
                                                    className="mt-0.5 shrink-0"
                                                />
                                            )}

                                            <p>{mensagem}</p>
                                        </div>
                                    )}

                                    {/* Ações */}
                                    <div className="mt-4 flex flex-col-reverse justify-end gap-2 sm:flex-row">
                                        <button
                                            onClick={fecharModal}
                                            className="rounded-lg border border-[#e6dfcd] px-4 py-2.5 text-sm text-[#68645b] transition hover:bg-[#f5f1e7]"
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            onClick={registrarVenda}
                                            disabled={carrinho.length === 0}
                                            className="flex items-center justify-center gap-2 rounded-lg bg-[#98700a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#806009] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <CheckCircle2 size={17} />
                                            Finalizar venda
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vendas;