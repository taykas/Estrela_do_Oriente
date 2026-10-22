import {
    Package,
    ShoppingCart,
    ClipboardList,
    ChartNoAxesCombined,
    Menu,
    ArrowUpRight,
    Plus,
    AlertTriangle,
    Zap
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import { listarProdutos } from "../services/products";
import { listarVendas } from "../services/vendas";

const atalhos = [
    {
        titulo: "Cadastrar Produto",
        descricao: "Adicionar ao catálogo",
        icone: Package,
        destino: "Produtos"
    },
    {
        titulo: "Registrar Venda",
        descricao: "Lançar nova venda",
        icone: ShoppingCart,
        destino: "Vendas"
    },
    {
        titulo: "Ver Relatórios",
        descricao: "Consultar resultados",
        icone: ChartNoAxesCombined,
        destino: "Relatórios"
    }
];

const formatarMoeda = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

const formatarData = (data) => {
    if (!data) return "—";

    if (data instanceof Date) {
        return data.toLocaleDateString("pt-BR");
    }

    if (typeof data === "string") {
        const correspondencia = data.match(/^(\d{4})-(\d{2})-(\d{2})$/);

        if (correspondencia) {
            return `${correspondencia[3]}/${correspondencia[2]}/${correspondencia[1]}`;
        }

        const dataConvertida = new Date(data);

        if (!Number.isNaN(dataConvertida.getTime())) {
            return dataConvertida.toLocaleDateString("pt-BR");
        }
    }

    if (typeof data?.toDate === "function") {
        return data.toDate().toLocaleDateString("pt-BR");
    }

    return "—";
};

const obterDataVenda = (venda) => {
    if (venda.criadoEm instanceof Date) {
        return venda.criadoEm;
    }

    if (venda.criadoEm?.toDate) {
        return venda.criadoEm.toDate();
    }

    if (typeof venda.data === "string") {
        const correspondencia = venda.data.match(
            /^(\d{4})-(\d{2})-(\d{2})$/
        );

        if (correspondencia) {
            return new Date(
                Number(correspondencia[1]),
                Number(correspondencia[2]) - 1,
                Number(correspondencia[3])
            );
        }

        const dataConvertida = new Date(venda.data);

        if (!Number.isNaN(dataConvertida.getTime())) {
            return dataConvertida;
        }
    }

    return null;
};

const obterTotalVenda = (venda) => {
    if (Number.isFinite(Number(venda.total))) {
        return Math.max(0, Number(venda.total));
    }

    const subtotal = (venda.itens || []).reduce(
        (soma, item) =>
            soma +
            Number(item.preco || 0) *
                Number(item.quantidade || 0),
        0
    );

    const desconto = Number(venda.desconto || 0);

    return Math.max(0, subtotal - subtotal * desconto / 100);
};

const MainPage = () => {
    const navegar = useNavigate();
    const { pathname } = useLocation();

    const [produtos, setProdutos] = useState([]);
    const [vendas, setVendas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const carregarDados = useCallback(async () => {
        setCarregando(true);
        setErro("");

        try {
            const [dadosProdutos, dadosVendas] = await Promise.all([
                listarProdutos(),
                listarVendas()
            ]);

            setProdutos(Array.isArray(dadosProdutos) ? dadosProdutos : []);
            setVendas(Array.isArray(dadosVendas) ? dadosVendas : []);
        } catch (error) {
            console.error("Erro ao carregar o painel:", error);
            setErro("Não foi possível carregar os dados do painel.");
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();

    const vendasDoMes = vendas.filter((venda) => {
        const dataVenda = obterDataVenda(venda);

        return (
            dataVenda &&
            dataVenda.getMonth() === mesAtual &&
            dataVenda.getFullYear() === anoAtual
        );
    });

    const vendasConcluidas = vendas.filter(
        (venda) =>
            String(venda.status || "Concluída").toLowerCase() ===
            "concluída".toLowerCase()
    );

    const vendasDoMesConcluidas = vendasDoMes.filter(
        (venda) =>
            String(venda.status || "Concluída").toLowerCase() ===
            "concluída".toLowerCase()
    );

    const faturamentoMensal = vendasDoMesConcluidas.reduce(
        (total, venda) => total + obterTotalVenda(venda),
        0
    );

    const pedidosEmAberto = vendas.filter((venda) => {
        const status = String(venda.status || "Concluída")
            .trim()
            .toLowerCase();

        return ![
            "concluída",
            "concluida",
            "cancelada",
            "cancelado"
        ].includes(status);
    });

    const estoqueBaixo = produtos.filter((produto) => {
        const estoque = Number(
            produto.estoque ?? produto.quantidade ?? 0
        );

        const estoqueMinimo = Number(
            produto.estoqueMinimo ?? produto.minimo ?? 5
        );

        return (
            produto.status !== "Inativo" &&
            estoque <= estoqueMinimo
        );
    });

    const vendasRecentes = [...vendas]
        .sort((a, b) => {
            const dataA = obterDataVenda(a)?.getTime() || 0;
            const dataB = obterDataVenda(b)?.getTime() || 0;

            return dataB - dataA;
        })
        .slice(0, 5);

    const indicadores = [
        {
            titulo: "Total de Produtos",
            valor: produtos.length,
            descricao: "Produtos cadastrados",
            icone: Package
        },
        {
            titulo: "Vendas do Mês",
            valor: formatarMoeda(faturamentoMensal),
            descricao: "Faturamento mensal",
            icone: ShoppingCart
        },
        {
            titulo: "Pedidos em Aberto",
            valor: pedidosEmAberto.length,
            descricao: "Aguardando conclusão",
            icone: ClipboardList
        }
    ];

    return (
        <div className="min-h-screen bg-[#f3f1eb] text-[#35342f]">
            <Sidebar />

            <div className="min-h-screen lg:ml-60">
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
                                Painel de Controle
                            </h2>

                            <p className="hidden text-xs text-[#89867d] sm:block">
                                Gerenciamento da loja
                            </p>
                        </div>
                    </div>

                    <div className="hidden border-l border-[#e3dcc9] pl-4 sm:block">
                        <p className="text-sm text-[#89670d]">
                            Estrela do Oriente
                        </p>

                        <p className="text-xs text-[#918d83]">
                            {agora.toLocaleDateString("pt-BR")}
                        </p>
                    </div>
                </header>

                <main className="space-y-6 p-4 sm:p-6 lg:p-8">
                    {erro && (
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            <span>{erro}</span>

                            <button
                                onClick={carregarDados}
                                className="shrink-0 font-medium underline"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    <section>
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-lg font-medium text-[#78601e]">
                                Resumo da loja
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                                            {carregando ? "..." : item.valor}
                                        </p>

                                        <p className="mt-1 text-xs text-[#969187]">
                                            {item.descricao}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
                        <div className="overflow-hidden rounded-xl border border-[#e6dfcd] bg-[#fffefa] shadow-sm xl:col-span-3">
                            <div className="flex items-center justify-between border-b border-[#eee7d7] p-5">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart
                                        size={20}
                                        className="text-[#a77b08]"
                                    />

                                    <h2 className="text-lg font-medium text-[#78601e]">
                                        Vendas Recentes
                                    </h2>
                                </div>

                                <button
                                    onClick={() => navegar("/Vendas")}
                                    className="flex items-center gap-1 text-xs text-[#98700a] transition hover:text-[#6f5200] hover:underline"
                                >
                                    Ver todas
                                    <ArrowUpRight size={14} />
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[580px] text-left text-sm">
                                    <thead>
                                        <tr className="bg-[#f5f1e7] text-xs text-[#81734e]">
                                            <th className="px-4 py-3 font-medium">
                                                Pedido
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Data
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Cliente
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Total
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {carregando ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-4 py-8 text-center text-sm text-[#918d83]"
                                                >
                                                    Carregando vendas...
                                                </td>
                                            </tr>
                                        ) : vendasRecentes.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-4 py-8 text-center text-sm text-[#918d83]"
                                                >
                                                    Nenhuma venda cadastrada.
                                                </td>
                                            </tr>
                                        ) : (
                                            vendasRecentes.map((venda, index) => {
                                                const status =
                                                    venda.status || "Concluída";

                                                return (
                                                    <tr
                                                        key={String(venda.id)}
                                                        className={`border-t border-[#eeeae0] text-[#5f5c54] transition-colors hover:bg-[#f8f5ed] ${
                                                            index % 2 === 1
                                                                ? "bg-[#fcfbf7]"
                                                                : ""
                                                        }`}
                                                    >
                                                        <td className="whitespace-nowrap px-4 py-4 font-medium text-[#98700a]">
                                                            #{String(venda.id).slice(0, 8)}
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-4">
                                                            {formatarData(
                                                                obterDataVenda(venda)
                                                            )}
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-4">
                                                            {venda.cliente ||
                                                                "Cliente não identificado"}
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-4 font-medium text-[#45433d]">
                                                            {formatarMoeda(
                                                                obterTotalVenda(venda)
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            <span
                                                                className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                                                                    status.toLowerCase() ===
                                                                        "concluída" ||
                                                                    status.toLowerCase() ===
                                                                        "concluida"
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : status.toLowerCase() ===
                                                                            "cancelada" ||
                                                                          status.toLowerCase() ===
                                                                            "cancelado"
                                                                        ? "bg-red-100 text-red-700"
                                                                        : "bg-amber-100 text-amber-800"
                                                                }`}
                                                            >
                                                                {status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-[#e6dfcd] bg-[#fffefa] shadow-sm xl:col-span-2">
                            <div className="flex items-center justify-between border-b border-[#eee7d7] p-5">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle
                                        size={20}
                                        className="text-[#a77b08]"
                                    />

                                    <h2 className="text-lg font-medium text-[#78601e]">
                                        Estoque Baixo
                                    </h2>
                                </div>

                                <button
                                    onClick={() => navegar("/Estoque")}
                                    className="text-xs text-[#98700a] transition hover:text-[#6f5200] hover:underline"
                                >
                                    Ver estoque
                                </button>
                            </div>

                            <div className="divide-y divide-[#eeeae0] px-4">
                                {carregando ? (
                                    <p className="py-8 text-center text-sm text-[#918d83]">
                                        Carregando estoque...
                                    </p>
                                ) : estoqueBaixo.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-[#918d83]">
                                        Nenhum produto com estoque baixo.
                                    </p>
                                ) : (
                                    estoqueBaixo.slice(0, 5).map((produto) => (
                                        <div
                                            key={produto.id}
                                            className="flex items-center justify-between gap-3 py-4"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e9dfc4] bg-[#f6f0e1]">
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
                                                        {produto.categoria ||
                                                            "Sem categoria"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className="text-sm font-semibold text-[#98700a]">
                                                    {Number(
                                                        produto.estoque ??
                                                            produto.quantidade ??
                                                            0
                                                    )}{" "}
                                                    un.
                                                </p>

                                                <p className="mt-1 text-[10px] text-[#969187]">
                                                    Em estoque
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-[#e6dfcd] bg-[#faf9f5] p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1e8d1]">
                                <Zap
                                    size={20}
                                    className="text-[#98700a]"
                                />
                            </div>

                            <h2 className="text-lg font-medium text-[#78601e]">
                                Acesso Rápido
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {atalhos.map((atalho) => {
                                const Icone = atalho.icone;

                                return (
                                    <button
                                        key={atalho.titulo}
                                        onClick={() => {
                                            if (
                                                atalho.titulo ===
                                                "Cadastrar Produto"
                                            ) {
                                                navegar("/produtos", {
                                                    state: {
                                                        abrirCadastro: true
                                                    }
                                                });
                                            } else {
                                                navegar(
                                                    `/${atalho.destino.toLowerCase()}`
                                                );
                                            }
                                        }}
                                        className="group flex items-center gap-4 rounded-lg border border-[#e6dfcd] bg-[#fffefa] p-4 text-left transition-all hover:border-[#cfb15a] hover:bg-[#f8f3e6] hover:shadow-sm"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f3ead3] text-[#98700a] transition-colors group-hover:bg-[#e9d7a4]">
                                            <Icone
                                                size={22}
                                                strokeWidth={1.7}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-[#45433d] transition-colors group-hover:text-[#98700a]">
                                                {atalho.titulo}
                                            </p>

                                            <p className="mt-1 text-xs text-[#918d83]">
                                                {atalho.descricao}
                                            </p>
                                        </div>

                                        <Plus
                                            size={17}
                                            className="ml-auto shrink-0 text-[#b49a51] transition-transform group-hover:rotate-90"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export { MainPage };
export default MainPage;