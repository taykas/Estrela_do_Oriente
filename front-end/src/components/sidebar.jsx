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
    { nome: "Pedidos", icone: ClipboardList, rota: "/pedidos" },
    { nome: "Fornecedores", icone: Truck, rota: "/fornecedores" },
    { nome: "Relatórios", icone: ChartNoAxesCombined, rota: "/relatorios" },
    { nome: "Configurações", icone: Settings, rota: "/configuracoes" }
]

export default function Sidebar() {
    const navegar = useNavigate();
    const location = useLocation();

    return (
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-[#f1b519]/30 bg-black lg:flex">

            {/* Logo */}
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

            {/* Navegação */}
            <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
                {menuItems.map((item) => {
                    const Icone = item.icone;
                    const ativo = location.pathname === item.rota;

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
    );
}