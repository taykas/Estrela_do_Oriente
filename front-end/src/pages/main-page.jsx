import {
    Home,
    Package,
    Warehouse,
    ShoppingCart,
    ClipboardList,
    Truck,
    ChartNoAxesCombined,
    Settings,
    UserRound,
    Menu,
    Search,
    Bell,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Eye,
    AlertTriangle,
    CalendarDays,
    Zap,
    LogOut
} from "lucide-react";

import estrela from '../assets/icon estrela.png'

const menuItems = [
    { nome: "Início", icone: Home, ativo: true },
    { nome: "Produtos", icone: Package },
    { nome: "Estoque", icone: Warehouse },
    { nome: "Vendas", icone: ShoppingCart },
    { nome: "Pedidos", icone: ClipboardList },
    { nome: "Fornecedores", icone: Truck },
    { nome: "Relatórios", icone: ChartNoAxesCombined },
    { nome: "Configurações", icone: Settings }
];

const vendasRecentes = [
    { id: "#0048", data: "13/10/2026", cliente: "Cliente 045", total: "R$ 189,90", status: "Concluída" },
    { id: "#0047", data: "13/10/2026", cliente: "Cliente 032", total: "R$ 254,70", status: "Concluída" },
    { id: "#0046", data: "12/10/2026", cliente: "Cliente 017", total: "R$ 129,90", status: "Concluída" },
    { id: "#0045", data: "12/10/2026", cliente: "Cliente 061", total: "R$ 379,80", status: "Pendente" },
    { id: "#0044", data: "11/10/2026", cliente: "Cliente 023", total: "R$ 89,90", status: "Concluída" }
];

const estoqueBaixo = [
    { nome: "Incenso Natural", categoria: "Incensos", quantidade: 3 },
    { nome: "Vela de 7 Dias", categoria: "Velas", quantidade: 5 },
    { nome: "Patua", categoria: "Acessórios", quantidade: 2 },
    { nome: "Erva de Proteção", categoria: "Ervas", quantidade: 4 },
    { nome: "Óleo de Unção", categoria: "Óleos", quantidade: 2 }
];

const indicadores = [
    {
        titulo: "Total de Produtos",
        valor: "248",
        descricao: "Produtos cadastrados",
        icone: Package,
        variacao: "+12 este mês",
        positivo: true
    },
    {
        titulo: "Vendas do Mês",
        valor: "R$ 4.892,30",
        descricao: "Faturamento mensal",
        icone: ShoppingCart,
        variacao: "+8,5% este mês",
        positivo: true
    },
    {
        titulo: "Pedidos em Aberto",
        valor: "7",
        descricao: "Aguardando conclusão",
        icone: ClipboardList,
        variacao: "3 prioritários",
        positivo: false
    },
    {
        titulo: "Fornecedores Ativos",
        valor: "12",
        descricao: "Cadastrados no sistema",
        icone: Truck,
        variacao: "Todos cadastrados",
        positivo: true
    }
];

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
        titulo: "Gerar Pedido",
        descricao: "Criar pedido de compra",
        icone: ClipboardList,
        destino: "Pedidos"
    },
    {
        titulo: "Ver Relatórios",
        descricao: "Consultar resultados",
        icone: ChartNoAxesCombined,
        destino: "Relatórios"
    }
];

const formatarData = () => {
    return new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
};

export const MainPage = () => {
    const navegar = (destino) => {
        // Substitua pela navegação do React Router quando as páginas existirem.
        console.log("Navegar para:", destino);
    };

    return (
        <div className="min-h-screen bg-black text-white">

            {/* Menu lateral */}
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-[#f1b519]/30 bg-black lg:flex">

                <div className="flex h-24 items-center gap-3 border-b border-[#f1b519]/60 px-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center text-4xl text-[#f1b519]">
                        <img src={estrela} alt="" />
                    </div>

                    <div className="min-w-0">
                        <h1
                            className="text-lg leading-tight text-[#f1b519]"
                            style={{ fontFamily: "Corvel" }}
                        >
                            ESTRELA DO ORIENTE
                        </h1>
                    </div>
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
            </aside>

            {/* Área principal */}
            <div className="min-h-screen lg:ml-60">

                {/* Cabeçalho */}
                <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-[#f1b519]/50 bg-black px-4 sm:px-6 lg:px-8">

                    <div className="flex items-center gap-3">
                        <button
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
                                Painel de Controle
                            </h2>
                            <p className="hidden text-xs text-gray-400 sm:block">
                                Gerenciamento da loja
                            </p>
                        </div>
                    </div>

                </header>

                <main className="space-y-6 p-4 sm:p-6 lg:p-8">

                    {/* Indicadores */}
                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg text-[#f1b519]">
                                Resumo da loja
                            </h2>

                            <span className="text-xs text-gray-500">
                                Dados demonstrativos
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {indicadores.map((item) => {
                                const Icone = item.icone;

                                return (
                                    <div
                                        key={item.titulo}
                                        className="rounded-lg border border-[#f1b519]/40 bg-[#080808] p-5 transition-colors hover:border-[#f1b519]"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-300">
                                                {item.titulo}
                                            </p>

                                            <Icone
                                                size={22}
                                                className="text-[#f1b519]"
                                                strokeWidth={1.7}
                                            />
                                        </div>

                                        <p className="mt-5 break-words text-2xl text-[#f1b519]">
                                            {item.valor}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {item.descricao}
                                        </p>

                                        <div className="mt-4 flex items-center gap-1 border-t border-[#f1b519]/15 pt-3 text-xs">
                                            {item.positivo ? (
                                                <ArrowUpRight
                                                    size={15}
                                                    className="text-[#f1b519]"
                                                />
                                            ) : (
                                                <AlertTriangle
                                                    size={14}
                                                    className="text-[#f1b519]"
                                                />
                                            )}

                                            <span className="text-gray-300">
                                                {item.variacao}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Vendas e estoque */}
                    <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">

                        {/* Vendas recentes */}
                        <div className="overflow-hidden rounded-lg border border-[#f1b519]/40 bg-[#050505] xl:col-span-3">

                            <div className="flex items-center justify-between border-b border-[#f1b519]/25 p-5">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart
                                        size={20}
                                        className="text-[#f1b519]"
                                    />
                                    <h2 className="text-lg text-[#f1b519]">
                                        Vendas Recentes
                                    </h2>
                                </div>

                                <button
                                    onClick={() => navegar("Vendas")}
                                    className="flex items-center gap-1 text-xs text-[#f1b519] hover:underline"
                                >
                                    Ver todas
                                    <ArrowUpRight size={14} />
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[580px] text-left text-sm">
                                    <thead>
                                        <tr className="bg-[#f1b519]/[0.07] text-xs text-[#c5a64a]">
                                            <th className="px-4 py-3 font-medium">Pedido</th>
                                            <th className="px-4 py-3 font-medium">Data</th>
                                            <th className="px-4 py-3 font-medium">Cliente</th>
                                            <th className="px-4 py-3 font-medium">Total</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {vendasRecentes.map((venda) => (
                                            <tr
                                                key={venda.id}
                                                className="border-t border-white/10 text-gray-300 transition-colors hover:bg-white/[0.03]"
                                            >
                                                <td className="whitespace-nowrap px-4 py-4 text-[#f1b519]">
                                                    {venda.id}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4">
                                                    {venda.data}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4">
                                                    {venda.cliente}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-4">
                                                    {venda.total}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs ${
                                                            venda.status === "Concluída"
                                                                ? "bg-emerald-500/10 text-emerald-400"
                                                                : "bg-[#f1b519]/10 text-[#f1b519]"
                                                        }`}
                                                    >
                                                        {venda.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="border-t border-[#f1b519]/20 p-4">
                                <button
                                    onClick={() => navegar("Vendas")}
                                    className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#f1b519]"
                                >
                                    <Eye size={16} />
                                    Consultar movimentações
                                </button>
                            </div>
                        </div>

                        {/* Estoque baixo */}
                        <div className="overflow-hidden rounded-lg border border-[#f1b519]/40 bg-[#050505] xl:col-span-2">

                            <div className="flex items-center justify-between border-b border-[#f1b519]/25 p-5">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle
                                        size={20}
                                        className="text-[#f1b519]"
                                    />
                                    <h2 className="text-lg text-[#f1b519]">
                                        Estoque Baixo
                                    </h2>
                                </div>

                                <button
                                    onClick={() => navegar("Estoque")}
                                    className="text-xs text-[#f1b519] hover:underline"
                                >
                                    Ver estoque
                                </button>
                            </div>

                            <div className="divide-y divide-white/10 px-4">
                                {estoqueBaixo.map((produto) => (
                                    <div
                                        key={produto.nome}
                                        className="flex items-center justify-between gap-3 py-4"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#f1b519]/25 bg-[#f1b519]/[0.06]">
                                                <Package
                                                    size={19}
                                                    className="text-[#f1b519]"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm text-gray-200">
                                                    {produto.nome}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {produto.categoria}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-right">
                                            <p className="text-sm text-[#f1b519]">
                                                {produto.quantidade} un.
                                            </p>
                                            <p className="mt-1 text-[10px] text-gray-500">
                                                Em estoque
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[#f1b519]/20 p-4">
                                <p className="text-xs text-gray-500">
                                    Produtos que precisam de reposição.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Acesso rápido */}
                    <section className="rounded-lg border border-[#f1b519]/40 bg-[#050505] p-5 sm:p-6">

                        <div className="mb-5 flex items-center gap-2">
                            <Zap size={21} className="text-[#f1b519]" />
                            <h2 className="text-lg text-[#f1b519]">
                                Acesso Rápido
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            {atalhos.map((atalho) => {
                                const Icone = atalho.icone;

                                return (
                                    <button
                                        key={atalho.titulo}
                                        onClick={() => navegar(atalho.destino)}
                                        className="group flex items-center gap-4 rounded-md border border-[#f1b519]/30 p-4 text-left transition-colors hover:border-[#f1b519] hover:bg-[#f1b519]/[0.06]"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#f1b519]/10 text-[#f1b519] transition-colors group-hover:bg-[#f1b519] group-hover:text-black">
                                            <Icone size={22} strokeWidth={1.7} />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm text-gray-200 group-hover:text-[#f1b519]">
                                                {atalho.titulo}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {atalho.descricao}
                                            </p>
                                        </div>

                                        <Plus
                                            size={17}
                                            className="ml-auto shrink-0 text-[#f1b519]/60"
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
