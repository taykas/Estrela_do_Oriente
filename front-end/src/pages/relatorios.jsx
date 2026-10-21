import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
    Menu,
    Bell,
    CalendarDays,
    TrendingUp,
    ShoppingCart,
    Package,
    Users,
    Download,
    ChartNoAxesCombined,
    ArrowUpRight,
    ArrowDownRight,
    CircleDollarSign,
    Wallet,
    Filter,
    FileText,
    ChevronDown,
} from "lucide-react";

const vendasExemplo = [
    { id: 1001, data: "2026-10-15", cliente: "Maria Oliveira", total: 62.70, pagamento: "Pix", status: "Concluída" },
    { id: 1002, data: "2026-10-15", cliente: "João Santos", total: 54.80, pagamento: "Dinheiro", status: "Concluída" },
    { id: 1003, data: "2026-10-14", cliente: "Ana Costa", total: 37.80, pagamento: "Cartão de débito", status: "Concluída" },
    { id: 1004, data: "2026-10-14", cliente: "Carlos Mendes", total: 35.70, pagamento: "Pix", status: "Cancelada" },
    { id: 1005, data: "2026-10-13", cliente: "Fernanda Lima", total: 35.70, pagamento: "Cartão de crédito", status: "Concluída" },
    { id: 1006, data: "2026-10-12", cliente: "Paula Souza", total: 89.90, pagamento: "Pix", status: "Concluída" },
    { id: 1007, data: "2026-10-11", cliente: "Lucas Mendes", total: 45.80, pagamento: "Dinheiro", status: "Concluída" },
    { id: 1008, data: "2026-10-10", cliente: "Beatriz Lima", total: 120.50, pagamento: "Cartão de crédito", status: "Concluída" },
    { id: 1009, data: "2026-10-09", cliente: "Rafael Costa", total: 28.90, pagamento: "Pix", status: "Concluída" },
    { id: 1010, data: "2026-10-08", cliente: "Camila Alves", total: 76.40, pagamento: "Cartão de débito", status: "Concluída" },
    { id: 1011, data: "2026-10-05", cliente: "Marcos Silva", total: 48.90, pagamento: "Pix", status: "Concluída" },
    { id: 1012, data: "2026-10-02", cliente: "Juliana Rocha", total: 94.70, pagamento: "Dinheiro", status: "Concluída" },
    { id: 1013, data: "2026-09-28", cliente: "Amanda Reis", total: 67.80, pagamento: "Pix", status: "Concluída" },
    { id: 1014, data: "2026-09-24", cliente: "Pedro Lima", total: 112.90, pagamento: "Cartão de crédito", status: "Concluída" },
    { id: 1015, data: "2026-09-20", cliente: "Carolina Melo", total: 39.90, pagamento: "Dinheiro", status: "Concluída" },
    { id: 1016, data: "2026-09-15", cliente: "Gabriel Souza", total: 85.90, pagamento: "Pix", status: "Concluída" },
    { id: 1017, data: "2026-09-10", cliente: "Larissa Dias", total: 56.90, pagamento: "Cartão de débito", status: "Concluída" },
    { id: 1018, data: "2026-09-05", cliente: "Thiago Alves", total: 73.90, pagamento: "Pix", status: "Concluída" },
];

const produtosExemplo = [
    { id: 1, nome: "Defumador", categoria: "Incensos", vendidos: 48, receita: 1055.20, estoque: 20 },
    { id: 2, nome: "Vela Aromática", categoria: "Velas", vendidos: 42, receita: 709.80, estoque: 32 },
    { id: 3, nome: "Quartzo Rosa", categoria: "Cristais", vendidos: 26, receita: 777.40, estoque: 8 },
    { id: 4, nome: "Incenso Natural", categoria: "Incensos", vendidos: 35, receita: 451.50, estoque: 3 },
    { id: 5, nome: "Patuá", categoria: "Acessórios", vendidos: 21, receita: 522.90, estoque: 2 },
    { id: 6, nome: "Vela de 7 Dias", categoria: "Velas", vendidos: 31, receita: 585.90, estoque: 5 },
    { id: 7, nome: "Erva de Proteção", categoria: "Ervas", vendidos: 19, receita: 188.10, estoque: 4 },
    { id: 8, nome: "Sal Grosso", categoria: "Insumos", vendidos: 16, receita: 94.40, estoque: 15 },
];

const moeda = (valor) =>
    valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

const formatarData = (data) => {
    if (!data) return "—";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
};

const obterInicioMes = (data) =>
    `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-01`;

const obterHoje = () => {
    const data = new Date();
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
};

const CardIndicador = ({
    titulo,
    valor,
    descricao,
    icone: Icone,
    variacao,
    positivo = true,
}) => (
    <div className="rounded-xl border border-[#e6dfcd] bg-[#fffefa] p-5 shadow-sm transition-all hover:border-[#d4b65e] hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-sm text-[#77746b]">{titulo}</p>
                <h3 className="mt-3 text-2xl font-semibold text-[#8b690e]">
                    {valor}
                </h3>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f5edda] text-[#98700a]">
                <Icone size={21} />
            </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-[#eee7d7] pt-3">
            {variacao && (
                <span
                    className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                        positivo ? "text-emerald-700" : "text-rose-600"
                    }`}
                >
                    {positivo ? (
                        <ArrowUpRight size={14} />
                    ) : (
                        <ArrowDownRight size={14} />
                    )}
                    {variacao}
                </span>
            )}

            <p className="text-xs text-[#969187]">{descricao}</p>
        </div>
    </div>
);

const BarraHorizontal = ({ titulo, valor, total, legenda }) => {
    const percentual = total > 0 ? (valor / total) * 100 : 0;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[#555248]">{titulo}</span>
                <span className="text-sm font-medium text-[#78601e]">
                    {legenda ?? valor}
                </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#eee9dc]">
                <div
                    className="h-full rounded-full bg-[#b99a42] transition-all duration-500"
                    style={{ width: `${Math.min(percentual, 100)}%` }}
                />
            </div>
        </div>
    );
};

export const Relatorios = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    
    const hoje = obterHoje();

    const [periodo, setPeriodo] = useState("mes");
    const [dataInicio, setDataInicio] = useState(obterInicioMes(new Date()));
    const [dataFim, setDataFim] = useState(hoje);
    const [tipoRelatorio, setTipoRelatorio] = useState("vendas");
    const [categoria, setCategoria] = useState("Todas");

    const vendasFiltradas = useMemo(() => {
        let inicio = dataInicio;
        let fim = dataFim;

        if (periodo === "hoje") {
            inicio = hoje;
            fim = hoje;
        } else if (periodo === "7dias") {
            const data = new Date();
            data.setDate(data.getDate() - 6);
            inicio = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
            fim = hoje;
        } else if (periodo === "mes") {
            inicio = obterInicioMes(new Date());
            fim = hoje;
        }

        return vendasExemplo.filter(
            (venda) =>
                venda.data >= inicio &&
                venda.data <= fim &&
                venda.status === "Concluída"
        );
    }, [periodo, dataInicio, dataFim, hoje]);

    const produtosFiltrados = useMemo(() => {
        if (categoria === "Todas") return produtosExemplo;

        return produtosExemplo.filter(
            (produto) => produto.categoria === categoria
        );
    }, [categoria]);

    const faturamento = vendasFiltradas.reduce(
        (total, venda) => total + venda.total,
        0
    );

    const quantidadeVendas = vendasFiltradas.length;

    const quantidadeTotalVendas = vendasExemplo.filter((venda) => {
        let inicio = dataInicio;
        let fim = dataFim;

        if (periodo === "hoje") {
            inicio = hoje;
            fim = hoje;
        } else if (periodo === "7dias") {
            const data = new Date();
            data.setDate(data.getDate() - 6);
            inicio = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
            fim = hoje;
        } else if (periodo === "mes") {
            inicio = obterInicioMes(new Date());
            fim = hoje;
        }

        return venda.data >= inicio && venda.data <= fim;
    }).length;

    const produtosVendidos = produtosFiltrados.reduce(
        (total, produto) => total + produto.vendidos,
        0
    );

    const vendasPorPagamento = useMemo(() => {
        const pagamentos = ["Pix", "Dinheiro", "Cartão de débito", "Cartão de crédito"];

        return pagamentos.map((pagamento) => {
            const vendas = vendasFiltradas.filter(
                (venda) => venda.pagamento === pagamento
            );

            return {
                nome: pagamento,
                quantidade: vendas.length,
                valor: vendas.reduce((total, venda) => total + venda.total, 0),
            };
        });
    }, [vendasFiltradas]);

    const maiorPagamento = Math.max(
        1,
        ...vendasPorPagamento.map((item) => item.valor)
    );

    const totalVendasPorDia = useMemo(() => {
        const agrupadas = {};

        vendasFiltradas.forEach((venda) => {
            agrupadas[venda.data] =
                (agrupadas[venda.data] || 0) + venda.total;
        });

        return Object.entries(agrupadas)
            .sort(([dataA], [dataB]) => dataA.localeCompare(dataB))
            .slice(-7)
            .map(([data, valor]) => ({ data, valor }));
    }, [vendasFiltradas]);

    const maiorFaturamentoDiario = Math.max(
        1,
        ...totalVendasPorDia.map((item) => item.valor)
    );

    const faturamentoPorCategoria = useMemo(() => {
        const agrupadas = {};

        produtosFiltrados.forEach((produto) => {
            agrupadas[produto.categoria] =
                (agrupadas[produto.categoria] || 0) + produto.receita;
        });

        return Object.entries(agrupadas)
            .map(([nome, valor]) => ({ nome, valor }))
            .sort((a, b) => b.valor - a.valor);
    }, [produtosFiltrados]);

    const totalReceitaProdutos = faturamentoPorCategoria.reduce(
        (total, item) => total + item.valor,
        0
    );

    const produtosComEstoqueBaixo = produtosFiltrados.filter(
        (produto) => produto.estoque <= 5
    );

    const exportarCSV = () => {
        const linhas = [
            ["Relatório de vendas"],
            ["Período", dataInicio, dataFim],
            [],
            ["Código", "Data", "Cliente", "Pagamento", "Status", "Total"],
            ...vendasFiltradas.map((venda) => [
                venda.id,
                formatarData(venda.data),
                venda.cliente,
                venda.pagamento,
                venda.status,
                venda.total.toFixed(2).replace(".", ","),
            ]),
            [],
            ["Faturamento total", faturamento.toFixed(2).replace(".", ",")],
        ];

        const csv = linhas
            .map((linha) =>
                linha
                    .map((valor) => {
                        const texto = String(valor ?? "");
                        return `"${texto.replace(/"/g, '""')}"`;
                    })
                    .join(";")
            )
            .join("\n");

        const arquivo = new Blob(["\uFEFF" + csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(arquivo);
        const link = document.createElement("a");

        link.href = url;
        link.download = "relatorio-vendas.csv";
        link.click();

        URL.revokeObjectURL(url);
    };

    const alterarPeriodo = (valor) => {
        setPeriodo(valor);

        if (valor === "personalizado") {
            setDataInicio(obterInicioMes(new Date()));
            setDataFim(hoje);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f1eb] text-[#35342f]">
            <Sidebar />

            <div className="min-h-screen lg:ml-60">
                <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-[#e3dcc9] bg-[#faf9f5]/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="rounded-lg p-2 text-[#78601e] transition hover:bg-[#f1e8d1] lg:hidden"
                            aria-label="Abrir menu"
                        >
                            <Menu size={21} />
                        </button>

                        <div>
                            <h1
                                className="text-lg text-[#98700a] sm:text-xl"
                                style={{ fontFamily: "Corvel" }}
                            >
                                Relatórios
                            </h1>
                            <p className="hidden text-xs text-[#89867d] sm:block">
                                Acompanhe os resultados da sua loja
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
                    {/* Título */}
                    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-lg font-medium text-[#78601e]">
                                Visão geral dos resultados
                            </h2>
                            <p className="mt-1 text-sm text-[#89867d]">
                                Consulte o faturamento, as vendas e o desempenho dos produtos.
                            </p>
                        </div>
                    </section>

                    {/* Filtros */}
                    <section className="rounded-xl border border-[#e6dfcd] bg-[#fffefa] p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <Filter size={18} className="text-[#98700a]" />
                            <h2 className="text-base font-medium text-[#78601e]">
                                Filtros do relatório
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-[#77746b]">
                                    Tipo de relatório
                                </label>
                                <div className="relative">
                                    <select
                                        value={tipoRelatorio}
                                        onChange={(evento) =>
                                            setTipoRelatorio(evento.target.value)
                                        }
                                        className="w-full appearance-none rounded-lg border border-[#e6dfcd] bg-[#fcfbf7] px-3.5 py-2.5 pr-9 text-sm outline-none focus:border-[#c6a64b]"
                                    >
                                        <option value="vendas">Vendas e faturamento</option>
                                        <option value="produtos">Produtos</option>
                                        <option value="estoque">Estoque baixo</option>
                                    </select>
                                    <ChevronDown
                                        size={16}
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#89867d]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-[#77746b]">
                                    Período
                                </label>
                                <div className="relative">
                                    <select
                                        value={periodo}
                                        onChange={(evento) =>
                                            alterarPeriodo(evento.target.value)
                                        }
                                        className="w-full appearance-none rounded-lg border border-[#e6dfcd] bg-[#fcfbf7] px-3.5 py-2.5 pr-9 text-sm outline-none focus:border-[#c6a64b]"
                                    >
                                        <option value="hoje">Hoje</option>
                                        <option value="7dias">Últimos 7 dias</option>
                                        <option value="mes">Este mês</option>
                                        <option value="personalizado">Personalizado</option>
                                    </select>
                                    <ChevronDown
                                        size={16}
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#89867d]"
                                    />
                                </div>
                            </div>

                            {periodo === "personalizado" ? (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-[#77746b]">
                                            Data inicial
                                        </label>
                                        <input
                                            type="date"
                                            value={dataInicio}
                                            max={dataFim}
                                            onChange={(evento) =>
                                                setDataInicio(evento.target.value)
                                            }
                                            className="w-full rounded-lg border border-[#e6dfcd] bg-[#fcfbf7] px-3 py-2.5 text-sm outline-none focus:border-[#c6a64b]"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-[#77746b]">
                                            Data final
                                        </label>
                                        <input
                                            type="date"
                                            value={dataFim}
                                            min={dataInicio}
                                            max={hoje}
                                            onChange={(evento) =>
                                                setDataFim(evento.target.value)
                                            }
                                            className="w-full rounded-lg border border-[#e6dfcd] bg-[#fcfbf7] px-3 py-2.5 text-sm outline-none focus:border-[#c6a64b]"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-end sm:col-span-2">
                                    <div className="flex w-full items-center gap-3 rounded-lg border border-[#eee7d7] bg-[#fcfbf7] px-3.5 py-3">
                                        <CalendarDays
                                            size={18}
                                            className="text-[#98700a]"
                                        />
                                        <div>
                                            <p className="text-xs text-[#89867d]">
                                                Período selecionado
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-[#555248]">
                                                {periodo === "hoje"
                                                    ? formatarData(hoje)
                                                    : periodo === "7dias"
                                                      ? "Últimos 7 dias"
                                                      : `${formatarData(obterInicioMes(new Date()))} até ${formatarData(hoje)}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {tipoRelatorio === "produtos" && (
                            <div className="mt-4 max-w-xs space-y-1.5">
                                <label className="text-xs font-medium text-[#77746b]">
                                    Categoria de produtos
                                </label>
                                <select
                                    value={categoria}
                                    onChange={(evento) =>
                                        setCategoria(evento.target.value)
                                    }
                                    className="w-full rounded-lg border border-[#e6dfcd] bg-[#fcfbf7] px-3.5 py-2.5 text-sm outline-none focus:border-[#c6a64b]"
                                >
                                    <option value="Todas">Todas as categorias</option>
                                    <option value="Incensos">Incensos</option>
                                    <option value="Velas">Velas</option>
                                    <option value="Cristais">Cristais</option>
                                    <option value="Acessórios">Acessórios</option>
                                    <option value="Ervas">Ervas</option>
                                    <option value="Insumos">Insumos</option>
                                </select>
                            </div>
                        )}
                    </section>

                    {/* Indicadores de vendas */}
                    {tipoRelatorio === "vendas" && (
                        <>
                            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <CardIndicador
                                    titulo="Faturamento"
                                    valor={moeda(faturamento)}
                                    descricao="No período selecionado"
                                    icone={CircleDollarSign}
                                />

                                <CardIndicador
                                    titulo="Vendas concluídas"
                                    valor={quantidadeVendas}
                                    descricao="Vendas válidas no período"
                                    icone={ShoppingCart}
                                />

                                <CardIndicador
                                    titulo="Total de vendas"
                                    valor={quantidadeTotalVendas}
                                    descricao="Inclui vendas concluídas"
                                    icone={ShoppingCart}
                                />

                                <CardIndicador
                                    titulo="Produtos vendidos"
                                    valor={produtosVendidos}
                                    descricao="Unidades no catálogo de exemplo"
                                    icone={Package}
                                />
                            </section>

                            {/* Gráficos */}
                            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                                <div className="rounded-xl border border-[#e6dfcd] bg-[#fffefa] p-5 shadow-sm">
                                    <div className="mb-5">
                                        <h2 className="text-base font-medium text-[#78601e]">
                                            Faturamento por dia
                                        </h2>
                                        <p className="mt-1 text-xs text-[#89867d]">
                                            Evolução das vendas no período selecionado
                                        </p>
                                    </div>

                                    {totalVendasPorDia.length > 0 ? (
                                        <div className="space-y-4">
                                            {totalVendasPorDia.map((item) => (
                                                <BarraHorizontal
                                                    key={item.data}
                                                    titulo={formatarData(item.data)}
                                                    valor={item.valor}
                                                    total={maiorFaturamentoDiario}
                                                    legenda={moeda(item.valor)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="py-10 text-center text-sm text-[#89867d]">
                                            Não há vendas concluídas nesse período.
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-xl border border-[#e6dfcd] bg-[#fffefa] p-5 shadow-sm">
                                    <div className="mb-5">
                                        <h2 className="text-base font-medium text-[#78601e]">
                                            Vendas por forma de pagamento
                                        </h2>
                                        <p className="mt-1 text-xs text-[#89867d]">
                                            Distribuição do faturamento por pagamento
                                        </p>
                                    </div>

                                    <div className="space-y-5">
                                        {vendasPorPagamento.map((item) => (
                                            <div key={item.nome}>
                                                <BarraHorizontal
                                                    titulo={item.nome}
                                                    valor={item.valor}
                                                    total={maiorPagamento}
                                                    legenda={moeda(item.valor)}
                                                />
                                                <p className="mt-1 text-xs text-[#969187]">
                                                    {item.quantidade} venda(s)
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Tabela de vendas */}
                            <section className="overflow-hidden rounded-xl border border-[#e6dfcd] bg-[#fffefa] shadow-sm">
                                <div className="flex flex-col gap-2 border-b border-[#eee7d7] p-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-base font-medium text-[#78601e]">
                                            Vendas do período
                                        </h2>
                                        <p className="mt-1 text-xs text-[#89867d]">
                                            Detalhamento das vendas concluídas
                                        </p>
                                    </div>

                                    <span className="text-xs text-[#89867d]">
                                        {vendasFiltradas.length} registro(s)
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[650px] text-left">
                                        <thead>
                                            <tr className="bg-[#f5f1e7] text-xs text-[#81734e]">
                                                <th className="px-5 py-3.5 font-medium">Venda</th>
                                                <th className="px-5 py-3.5 font-medium">Data</th>
                                                <th className="px-5 py-3.5 font-medium">Cliente</th>
                                                <th className="px-5 py-3.5 font-medium">Pagamento</th>
                                                <th className="px-5 py-3.5 text-right font-medium">Total</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {vendasFiltradas.map((venda, indice) => (
                                                <tr
                                                    key={venda.id}
                                                    className={`border-t border-[#eeeae0] transition hover:bg-[#f8f5ed] ${
                                                        indice % 2 === 0
                                                            ? "bg-[#fffefa]"
                                                            : "bg-[#fcfbf7]"
                                                    }`}
                                                >
                                                    <td className="px-5 py-3.5 text-sm font-medium text-[#78601e]">
                                                        #{venda.id}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-sm text-[#77746b]">
                                                        {formatarData(venda.data)}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-sm text-[#555248]">
                                                        {venda.cliente}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-sm text-[#77746b]">
                                                        {venda.pagamento}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right text-sm font-medium text-[#8b690e]">
                                                        {moeda(venda.total)}
                                                    </td>
                                                </tr>
                                            ))}

                                            {vendasFiltradas.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="px-5 py-12 text-center text-sm text-[#89867d]"
                                                    >
                                                        Nenhuma venda encontrada nesse período.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                        {vendasFiltradas.length > 0 && (
                                            <tfoot>
                                                <tr className="border-t border-[#e6dfcd] bg-[#f8f5ed]">
                                                    <td
                                                        colSpan={4}
                                                        className="px-5 py-4 text-sm font-medium text-[#78601e]"
                                                    >
                                                        Total do período
                                                    </td>
                                                    <td className="px-5 py-4 text-right text-sm font-semibold text-[#8b690e]">
                                                        {moeda(faturamento)}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        )}
                                    </table>
                                </div>
                            </section>
                        </>
                    )}

                    {/* Relatório de produtos */}
                    {tipoRelatorio === "produtos" && (
                        <>
                            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                <CardIndicador
                                    titulo="Produtos cadastrados"
                                    valor={produtosFiltrados.length}
                                    descricao="Na categoria selecionada"
                                    icone={Package}
                                />

                                <CardIndicador
                                    titulo="Unidades vendidas"
                                    valor={produtosVendidos}
                                    descricao="Quantidade de produtos vendidos"
                                    icone={ShoppingCart}
                                />

                                <CardIndicador
                                    titulo="Receita dos produtos"
                                    valor={moeda(totalReceitaProdutos)}
                                    descricao="Receita estimada do catálogo"
                                    icone={TrendingUp}
                                />
                            </section>

                            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                                <div className="rounded-xl border border-[#e6dfcd] bg-[#fffefa] p-5 shadow-sm">
                                    <h2 className="text-base font-medium text-[#78601e]">
                                        Receita por categoria
                                    </h2>
                                    <p className="mb-5 mt-1 text-xs text-[#89867d]">
                                        Categorias com maior receita estimada
                                    </p>

                                    <div className="space-y-5">
                                        {faturamentoPorCategoria.map((item) => (
                                            <BarraHorizontal
                                                key={item.nome}
                                                titulo={item.nome}
                                                valor={item.valor}
                                                total={Math.max(
                                                    1,
                                                    ...faturamentoPorCategoria.map(
                                                        (categoriaItem) => categoriaItem.valor
                                                    )
                                                )}
                                                legenda={moeda(item.valor)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-xl border border-[#e6dfcd] bg-[#fffefa] shadow-sm">
                                    <div className="border-b border-[#eee7d7] p-5">
                                        <h2 className="text-base font-medium text-[#78601e]">
                                            Desempenho dos produtos
                                        </h2>
                                        <p className="mt-1 text-xs text-[#89867d]">
                                            Quantidade vendida e receita por produto
                                        </p>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[450px] text-left">
                                            <thead>
                                                <tr className="bg-[#f5f1e7] text-xs text-[#81734e]">
                                                    <th className="px-5 py-3 font-medium">Produto</th>
                                                    <th className="px-5 py-3 text-right font-medium">Vendidos</th>
                                                    <th className="px-5 py-3 text-right font-medium">Receita</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {produtosFiltrados
                                                    .slice()
                                                    .sort((a, b) => b.vendidos - a.vendidos)
                                                    .map((produto, indice) => (
                                                        <tr
                                                            key={produto.id}
                                                            className={`border-t border-[#eeeae0] hover:bg-[#f8f5ed] ${
                                                                indice % 2 === 0
                                                                    ? "bg-[#fffefa]"
                                                                    : "bg-[#fcfbf7]"
                                                            }`}
                                                        >
                                                            <td className="px-5 py-3.5">
                                                                <p className="text-sm font-medium text-[#35342f]">
                                                                    {produto.nome}
                                                                </p>
                                                                <p className="mt-1 text-xs text-[#969187]">
                                                                    {produto.categoria}
                                                                </p>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-right text-sm text-[#555248]">
                                                                {produto.vendidos}
                                                            </td>
                                                            <td className="px-5 py-3.5 text-right text-sm font-medium text-[#8b690e]">
                                                                {moeda(produto.receita)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    {/* Relatório de estoque */}
                    {tipoRelatorio === "estoque" && (
                        <>
                            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                <CardIndicador
                                    titulo="Produtos monitorados"
                                    valor={produtosExemplo.length}
                                    descricao="Produtos no catálogo de exemplo"
                                    icone={Package}
                                />

                                <CardIndicador
                                    titulo="Estoque baixo"
                                    valor={produtosComEstoqueBaixo.length}
                                    descricao="Produtos com até 5 unidades"
                                    icone={FileText}
                                    positivo={false}
                                />

                                <CardIndicador
                                    titulo="Unidades vendidas"
                                    valor={produtosVendidos}
                                    descricao="Quantidade no relatório de produtos"
                                    icone={ShoppingCart}
                                />
                            </section>

                            <section className="overflow-hidden rounded-xl border border-[#e6dfcd] bg-[#fffefa] shadow-sm">
                                <div className="border-b border-[#eee7d7] p-5">
                                    <h2 className="text-base font-medium text-[#78601e]">
                                        Situação do estoque
                                    </h2>
                                    <p className="mt-1 text-xs text-[#89867d]">
                                        Produtos que precisam de atenção
                                    </p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[600px] text-left">
                                        <thead>
                                            <tr className="bg-[#f5f1e7] text-xs text-[#81734e]">
                                                <th className="px-5 py-3.5 font-medium">Produto</th>
                                                <th className="px-5 py-3.5 font-medium">Categoria</th>
                                                <th className="px-5 py-3.5 text-right font-medium">Estoque atual</th>
                                                <th className="px-5 py-3.5 text-right font-medium">Situação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {produtosExemplo
                                                .slice()
                                                .sort((a, b) => a.estoque - b.estoque)
                                                .map((produto, indice) => (
                                                    <tr
                                                        key={produto.id}
                                                        className={`border-t border-[#eeeae0] hover:bg-[#f8f5ed] ${
                                                            indice % 2 === 0
                                                                ? "bg-[#fffefa]"
                                                                : "bg-[#fcfbf7]"
                                                        }`}
                                                    >
                                                        <td className="px-5 py-4 text-sm font-medium text-[#35342f]">
                                                            {produto.nome}
                                                        </td>
                                                        <td className="px-5 py-4 text-sm text-[#77746b]">
                                                            {produto.categoria}
                                                        </td>
                                                        <td className="px-5 py-4 text-right text-sm text-[#555248]">
                                                            {produto.estoque} un.
                                                        </td>
                                                        <td className="px-5 py-4 text-right">
                                                            {produto.estoque <= 5 ? (
                                                                <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                                                                    Estoque baixo
                                                                </span>
                                                            ) : produto.estoque <= 10 ? (
                                                                <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                                                                    Atenção
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                                    Disponível
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Relatorios;