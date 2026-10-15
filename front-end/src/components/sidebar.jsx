import {
    Home,
    Package,
    Warehouse,
    ShoppingCart,
    ClipboardList,
    Truck,
    ChartNoAxesCombined,
    Settings
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import estrela from "../assets/icon estrela.png";

const menuItems = [
    { nome: "Início", icone: Home, rota: "/" },
    { nome: "Produtos", icone: Package, rota: "/produtos" },
    { nome: "Estoque", icone: Warehouse, rota: "/estoque" },
    { nome: "Vendas", icone: ShoppingCart, rota: "/vendas" },
    { nome: "Fornecedores", icone: Truck, rota: "/fornecedores" },
    { nome: "Relatórios", icone: ChartNoAxesCombined, rota: "/relatorios" },
    { nome: "Configurações", icone: Settings, rota: "/configuracoes" }
];

export default function Sidebar() {
    const navegar = useNavigate();
    const location = useLocation();

    return (
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-[#e3dcc9] bg-[#faf9f5] lg:flex">

            {/* Logo */}
            <div className="flex h-24 items-center gap-3 border-b border-[#e8e0cd] px-5">
                <img
                    src={estrela}
                    alt="Estrela do Oriente"
                    className="h-12 w-12 shrink-0 object-contain"
                />

                <h1
                    className="text-lg leading-tight text-[#98700a]"
                    style={{ fontFamily: "Corvel" }}
                >
                    ESTRELA DO ORIENTE
                </h1>
            </div>

            {/* Navegação */}
            <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
                {menuItems.map((item) => {
                    const Icone = item.icone;

                    const ativo =
                        item.rota === "/"
                            ? location.pathname === "/"
                            : location.pathname === item.rota ||
                              location.pathname.startsWith(`${item.rota}/`);

                    return (
                        <button
                            key={item.nome}
                            onClick={() => navegar(item.rota)}
                            className={`group relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-all duration-200 ${
                                ativo
                                    ? "border border-[#e9d9a9] bg-[#f1e8d1] font-medium text-[#89670d]"
                                    : "border border-transparent text-[#77746b] hover:border-[#eee5d0] hover:bg-[#f5f1e7] hover:text-[#89670d]"
                            }`}
                        >
                            <Icone
                                size={19}
                                strokeWidth={1.8}
                                className={`shrink-0 transition-colors ${
                                    ativo
                                        ? "text-[#98700a]"
                                        : "text-[#91866b] group-hover:text-[#98700a]"
                                }`}
                            />

                            <span>{item.nome}</span>

                            {ativo && (
                                <span className="ml-auto h-2 w-2 rounded-full bg-[#b18a20]" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Rodapé */}
            <div className="border-t border-[#e8e0cd] p-4">
                <div className="rounded-lg border border-[#e9e1cf] bg-[#f5f1e7] px-3 py-3">
                    <p className="text-xs font-medium text-[#78601e]">
                        Estrela do Oriente
                    </p>

                    <p className="mt-1 text-[11px] text-[#918d83]">
                        Sistema de gerenciamento
                    </p>
                </div>
            </div>

        </aside>
    );
}