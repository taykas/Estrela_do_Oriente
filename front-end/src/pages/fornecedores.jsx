import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
    Menu,
    Search,
    Bell,
    Plus,
    X,
    Eye,
    Pencil,
    Trash2,
    Truck,
    Users,
    Package,
    CircleCheck,
    CircleAlert,
    Mail,
    Phone,
    MapPin,
    Building2,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Filter,
    Save,
    RotateCcw,
} from "lucide-react";

const fornecedoresIniciais = [
    {
        id: 1,
        nome: "Distribuidora Luz do Oriente",
        documento: "12.345.678/0001-90",
        contato: "Mariana Oliveira",
        email: "contato@luzdooriente.com.br",
        telefone: "(11) 98765-4321",
        cidade: "São Paulo",
        estado: "SP",
        status: "Ativo",
        dataCadastro: "2026-02-10",
        observacoes: "Fornecedor principal de incensos naturais.",
    },
    {
        id: 2,
        nome: "Velas Estrela Dourada",
        documento: "23.456.789/0001-01",
        contato: "Roberto Santos",
        email: "vendas@estreladourada.com.br",
        telefone: "(11) 97654-3210",
        cidade: "Guarulhos",
        estado: "SP",
        status: "Ativo",
        dataCadastro: "2026-03-15",
        observacoes: "Fornece velas tradicionais e aromáticas.",
    },
    {
        id: 3,
        nome: "Ervas e Raízes Naturais",
        documento: "34.567.890/0001-12",
        contato: "Camila Ferreira",
        email: "comercial@ervaserraizes.com.br",
        telefone: "(19) 96543-2109",
        cidade: "Campinas",
        estado: "SP",
        status: "Ativo",
        dataCadastro: "2026-04-02",
        observacoes: "Especializada em ervas e produtos naturais.",
    },
    {
        id: 4,
        nome: "Cristais da Terra",
        documento: "45.678.901/0001-23",
        contato: "Felipe Almeida",
        email: "contato@cristaisdaterra.com.br",
        telefone: "(21) 95432-1098",
        cidade: "Rio de Janeiro",
        estado: "RJ",
        status: "Inativo",
        dataCadastro: "2026-01-20",
        observacoes: "Fornecedor de cristais e pedras naturais.",
    },
    {
        id: 5,
        nome: "Essência Sagrada",
        documento: "56.789.012/0001-34",
        contato: "Juliana Costa",
        email: "pedidos@essenciasagrada.com.br",
        telefone: "(31) 94321-0987",
        cidade: "Belo Horizonte",
        estado: "MG",
        status: "Ativo",
        dataCadastro: "2026-05-11",
        observacoes: "Fornece óleos, essências e produtos aromáticos.",
    },
    {
        id: 6,
        nome: "Artigos Místicos Brasil",
        documento: "67.890.123/0001-45",
        contato: "André Martins",
        email: "vendas@artigosmisticos.com.br",
        telefone: "(41) 93210-9876",
        cidade: "Curitiba",
        estado: "PR",
        status: "Ativo",
        dataCadastro: "2026-06-08",
        observacoes: "Distribuição de patuás e acessórios.",
    },
    {
        id: 7,
        nome: "Mundo dos Incensos",
        documento: "78.901.234/0001-56",
        contato: "Patrícia Lima",
        email: "contato@mundodosincensos.com.br",
        telefone: "(11) 92109-8765",
        cidade: "Osasco",
        estado: "SP",
        status: "Inativo",
        dataCadastro: "2026-07-01",
        observacoes: "",
    },
];

const fornecedorVazio = {
    nome: "",
    documento: "",
    contato: "",
    email: "",
    telefone: "",
    cidade: "",
    estado: "",
    categoria: "",
    status: "Ativo",
    observacoes: "",
};

const categorias = [
    "Incensos",
    "Velas",
    "Ervas",
    "Cristais",
    "Óleos",
    "Acessórios",
    "Insumos",
    "Outros",
];

const formatarData = (data) => {
    if (!data) return "—";

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
};

const dataAtual = () => {
    const data = new Date();

    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(data.getDate()).padStart(2, "0")}`;
};

const BadgeStatus = ({ status }) => (
    <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            status === "Ativo"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-[#f1eee6] text-[#817b6c]"
        }`}
    >
        <span
            className={`h-1.5 w-1.5 rounded-full ${
                status === "Ativo" ? "bg-emerald-500" : "bg-[#aaa394]"
            }`}
        />
        {status}
    </span>
);

const Campo = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
}) => (
    <div className="space-y-1.5">
        <label className="block text-xs font-medium text-[#77746b]">
            {label}
            {required && <span className="ml-1 text-[#98700a]">*</span>}
        </label>

        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full rounded-lg border border-[#e6dfcd] bg-[#fcfbf7] px-3.5 py-2.5 text-sm text-[#35342f] outline-none transition placeholder:text-[#aaa69b] focus:border-[#c6a64b] focus:ring-2 focus:ring-[#c6a64b]/10"
        />
    </div>
);

export const Fornecedores = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const [fornecedores, setFornecedores] = useState(fornecedoresIniciais);

    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("Todos");
    const [filtroCategoria, setFiltroCategoria] = useState("Todas");
    const [pagina, setPagina] = useState(1);

    const [modalAberto, setModalAberto] = useState(false);
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
    const [modoModal, setModoModal] = useState("cadastro");
    const [formulario, setFormulario] = useState(fornecedorVazio);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");

    const itensPorPagina = 6;

    const fornecedoresFiltrados = useMemo(() => {
        const termo = busca.toLowerCase().trim();

        return fornecedores.filter((fornecedor) => {
            const correspondeBusca =
                !termo ||
                fornecedor.nome.toLowerCase().includes(termo) ||
                fornecedor.documento.toLowerCase().includes(termo) ||
                fornecedor.contato.toLowerCase().includes(termo) ||
                fornecedor.email.toLowerCase().includes(termo) ||
                fornecedor.cidade.toLowerCase().includes(termo);

            const correspondeStatus =
                filtroStatus === "Todos" ||
                fornecedor.status === filtroStatus;

            const correspondeCategoria =
                filtroCategoria === "Todas" ||
                fornecedor.categoria === filtroCategoria;

            return (
                correspondeBusca &&
                correspondeStatus &&
                correspondeCategoria
            );
        });
    }, [fornecedores, busca, filtroStatus, filtroCategoria]);

    const totalPaginas = Math.max(
        1,
        Math.ceil(fornecedoresFiltrados.length / itensPorPagina)
    );

    const fornecedoresPaginados = fornecedoresFiltrados.slice(
        (pagina - 1) * itensPorPagina,
        pagina * itensPorPagina
    );

    const totalAtivos = fornecedores.filter(
        (fornecedor) => fornecedor.status === "Ativo"
    ).length;

    const totalInativos = fornecedores.filter(
        (fornecedor) => fornecedor.status === "Inativo"
    ).length;

    const totalCategorias = new Set(
        fornecedores
            .filter((fornecedor) => fornecedor.status === "Ativo")
            .map((fornecedor) => fornecedor.categoria)
            .filter(Boolean)
    ).size;

    const exibirMensagem = (texto, tipo = "sucesso") => {
        setMensagem(texto);
        setTipoMensagem(tipo);

        setTimeout(() => {
            setMensagem("");
        }, 3500);
    };

    const atualizarCampo = (campo, valor) => {
        setFormulario((anterior) => ({
            ...anterior,
            [campo]: valor,
        }));
    };

    const abrirCadastro = () => {
        setFornecedorSelecionado(null);
        setFormulario({ ...fornecedorVazio });
        setModoModal("cadastro");
        setModalAberto(true);
    };

    const abrirEdicao = (fornecedor) => {
        setFornecedorSelecionado(fornecedor);
        setFormulario({
            ...fornecedor,
        });
        setModoModal("edicao");
        setModalAberto(true);
    };

    const abrirDetalhes = (fornecedor) => {
        setFornecedorSelecionado(fornecedor);
        setModoModal("detalhes");
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setFornecedorSelecionado(null);
        setFormulario({ ...fornecedorVazio });
    };

    const salvarFornecedor = (evento) => {
        evento.preventDefault();

        const nomeDuplicado = fornecedores.some(
            (fornecedor) =>
                fornecedor.nome.trim().toLowerCase() ===
                    formulario.nome.trim().toLowerCase() &&
                fornecedor.id !== fornecedorSelecionado?.id
        );

        if (nomeDuplicado) {
            exibirMensagem(
                "Já existe um fornecedor com esse nome.",
                "erro"
            );
            return;
        }

        if (modoModal === "edicao" && fornecedorSelecionado) {
            setFornecedores((anteriores) =>
                anteriores.map((fornecedor) =>
                    fornecedor.id === fornecedorSelecionado.id
                        ? {
                              ...fornecedor,
                              ...formulario,
                              nome: formulario.nome.trim(),
                          }
                        : fornecedor
                )
            );

            exibirMensagem("Fornecedor atualizado com sucesso.");
        } else {
            const novoFornecedor = {
                ...formulario,
                id:
                    fornecedores.length > 0
                        ? Math.max(
                              ...fornecedores.map((fornecedor) => fornecedor.id)
                          ) + 1
                        : 1,
                nome: formulario.nome.trim(),
                dataCadastro: dataAtual(),
            };

            setFornecedores((anteriores) => [
                novoFornecedor,
                ...anteriores,
            ]);

            setPagina(1);
            exibirMensagem("Fornecedor cadastrado com sucesso.");
        }

        fecharModal();
    };

    const alterarStatus = (fornecedor) => {
        const novoStatus =
            fornecedor.status === "Ativo" ? "Inativo" : "Ativo";

        setFornecedores((anteriores) =>
            anteriores.map((item) =>
                item.id === fornecedor.id
                    ? { ...item, status: novoStatus }
                    : item
            )
        );

        if (fornecedorSelecionado?.id === fornecedor.id) {
            setFornecedorSelecionado({
                ...fornecedor,
                status: novoStatus,
            });
        }

        exibirMensagem(
            `Fornecedor ${novoStatus === "Ativo" ? "ativado" : "inativado"} com sucesso.`
        );
    };

    const excluirFornecedor = (fornecedor) => {
        const confirmar = window.confirm(
            `Deseja realmente excluir o fornecedor "${fornecedor.nome}"?`
        );

        if (!confirmar) return;

        setFornecedores((anteriores) =>
            anteriores.filter((item) => item.id !== fornecedor.id)
        );

        fecharModal();
        setPagina(1);
        exibirMensagem("Fornecedor excluído com sucesso.");
    };

    const limparFiltros = () => {
        setBusca("");
        setFiltroStatus("Todos");
        setFiltroCategoria("Todas");
        setPagina(1);
    };

    const mudouBusca = (valor) => {
        setBusca(valor);
        setPagina(1);
    };

    const mudouStatus = (valor) => {
        setFiltroStatus(valor);
        setPagina(1);
    };

    const mudouCategoria = (valor) => {
        setFiltroCategoria(valor);
        setPagina(1);
    };

    return (
        <div className="min-h-screen bg-[#f3f1eb] text-[#35342f]">
            <Sidebar />

            <div className="min-h-screen lg:ml-60">
                {/* Cabeçalho */}
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
                                Fornecedores
                            </h1>

                            <p className="hidden text-xs text-[#89867d] sm:block">
                                Gerenciamento de fornecedores da loja
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
                    {/* Mensagem */}
                    {mensagem && (
                        <div
                            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
                                tipoMensagem === "erro"
                                    ? "border-rose-200 bg-rose-50 text-rose-700"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                            }`}
                        >
                            {tipoMensagem === "erro" ? (
                                <CircleAlert size={18} />
                            ) : (
                                <CircleCheck size={18} />
                            )}
                            {mensagem}
                        </div>
                    )}

                    {/* Título da página */}
                    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-lg font-medium text-[#78601e]">
                                Visão geral
                            </h2>
                            <p className="mt-1 text-sm text-[#89867d]">
                                Consulte e gerencie os parceiros da sua loja.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={abrirCadastro}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#98700a] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#806009]"
                        >
                            <Plus size={18} />
                            Novo fornecedor
                        </button>
                    </section>

                    {/* Indicadores */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-xl border border-[#e6dfcd] bg-[#fffefa] p-5 shadow-sm transition-all hover:border-[#d4b65e] hover:shadow-md">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-[#77746b]">
                                        Total de fornecedores
                                    </p>
                                    <h3 className="mt-3 text-2xl font-semibold text-[#8b690e]">
                                        {fornecedores.length}
                                    </h3>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5edda] text-[#98700a]">
                                    <Truck size={21} />
                                </div>
                            </div>

                            <div className="mt-4 border-t border-[#eee7d7] pt-3">
                                <p className="text-xs text-[#969187]">
                                    Todos os fornecedores cadastrados
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#e6dfcd] bg-[#fffefa] p-5 shadow-sm transition-all hover:border-[#d4b65e] hover:shadow-md">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-[#77746b]">
                                        Fornecedores ativos
                                    </p>
                                    <h3 className="mt-3 text-2xl font-semibold text-[#8b690e]">
                                        {totalAtivos}
                                    </h3>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf3e8] text-[#4e8052]">
                                    <CircleCheck size={21} />
                                </div>
                            </div>

                            <div className="mt-4 border-t border-[#eee7d7] pt-3">
                                <p className="text-xs text-[#969187]">
                                    Disponíveis para fornecimento
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#e6dfcd] bg-[#fffefa] p-5 shadow-sm transition-all hover:border-[#d4b65e] hover:shadow-md">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-[#77746b]">
                                        Fornecedores inativos
                                    </p>
                                    <h3 className="mt-3 text-2xl font-semibold text-[#8b690e]">
                                        {totalInativos}
                                    </h3>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1eee6] text-[#817b6c]">
                                    <CircleAlert size={21} />
                                </div>
                            </div>

                            <div className="mt-4 border-t border-[#eee7d7] pt-3">
                                <p className="text-xs text-[#969187]">
                                    Fornecedores desativados
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Lista de fornecedores */}
                    <section className="overflow-hidden rounded-xl border border-[#e6dfcd] bg-[#fffefa] shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-[#eee7d7] p-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-base font-medium text-[#78601e]">
                                    Lista de fornecedores
                                </h2>
                                <p className="mt-1 text-xs text-[#89867d]">
                                    {fornecedoresFiltrados.length} fornecedor(es) encontrado(s)
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative">
                                    <Search
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a29b8b]"
                                    />

                                    <input
                                        type="text"
                                        value={busca}
                                        onChange={(evento) =>
                                            mudouBusca(evento.target.value)
                                        }
                                        placeholder="Buscar fornecedor..."
                                        className="w-full rounded-lg border border-[#e6dfcd] bg-[#fcfbf7] py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-[#aaa69b] focus:border-[#c6a64b] sm:w-64"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Filter
                                        size={17}
                                        className="shrink-0 text-[#a29b8b]"
                                    />

                                    <select
                                        value={filtroStatus}
                                        onChange={(evento) =>
                                            mudouStatus(evento.target.value)
                                        }
                                        className="min-w-0 rounded-lg border border-[#e6dfcd] bg-[#fcfbf7] px-3 py-2.5 text-sm text-[#555248] outline-none focus:border-[#c6a64b]"
                                    >
                                        <option value="Todos">Todos os status</option>
                                        <option value="Ativo">Ativos</option>
                                        <option value="Inativo">Inativos</option>
                                    </select>

                                    <select
                                        value={filtroCategoria}
                                        onChange={(evento) =>
                                            mudouCategoria(evento.target.value)
                                        }
                                        className="min-w-0 rounded-lg border border-[#e6dfcd] bg-[#fcfbf7] px-3 py-2.5 text-sm text-[#555248] outline-none focus:border-[#c6a64b]"
                                    >
                                        <option value="Todas">Todas as categorias</option>
                                        {categorias.map((categoria) => (
                                            <option
                                                key={categoria}
                                                value={categoria}
                                            >
                                                {categoria}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {(busca ||
                            filtroStatus !== "Todos" ||
                            filtroCategoria !== "Todas") && (
                            <div className="flex items-center justify-between border-b border-[#eeeae0] bg-[#fcfbf7] px-5 py-2.5">
                                <p className="text-xs text-[#89867d]">
                                    Filtros aplicados
                                </p>

                                <button
                                    type="button"
                                    onClick={limparFiltros}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#98700a] hover:text-[#78601e]"
                                >
                                    <RotateCcw size={13} />
                                    Limpar filtros
                                </button>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] border-collapse text-left">
                                <thead>
                                    <tr className="bg-[#f5f1e7] text-xs text-[#81734e]">
                                        <th className="px-5 py-3.5 font-medium">
                                            Fornecedor
                                        </th>
                                        <th className="px-5 py-3.5 font-medium">
                                            Contato
                                        </th>
                                        <th className="px-5 py-3.5 font-medium">
                                            Cidade
                                        </th>
                                        <th className="px-5 py-3.5 font-medium">
                                            Cadastro
                                        </th>
                                        <th className="px-5 py-3.5 font-medium">
                                            Status
                                        </th>
                                        <th className="px-5 py-3.5 text-center font-medium">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {fornecedoresPaginados.map(
                                        (fornecedor, indice) => (
                                            <tr
                                                key={fornecedor.id}
                                                className={`border-t border-[#eeeae0] transition hover:bg-[#f8f5ed] ${
                                                    indice % 2 === 0
                                                        ? "bg-[#fffefa]"
                                                        : "bg-[#fcfbf7]"
                                                }`}
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f5edda] text-[#98700a]">
                                                            <Building2 size={19} />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="max-w-[230px] truncate text-sm font-medium text-[#35342f]">
                                                                {fornecedor.nome}
                                                            </p>
                                                            <p className="mt-1 text-xs text-[#969187]">
                                                                {fornecedor.documento ||
                                                                    "Documento não informado"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-sm text-[#555248]">
                                                        {fornecedor.contato ||
                                                            "Não informado"}
                                                    </p>
                                                    <p className="mt-1 text-xs text-[#969187]">
                                                        {fornecedor.telefone ||
                                                            "Sem telefone"}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-sm text-[#555248]">
                                                        {fornecedor.cidade || "—"}
                                                    </p>
                                                    <p className="mt-1 text-xs text-[#969187]">
                                                        {fornecedor.estado || ""}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4 text-sm text-[#77746b]">
                                                    {formatarData(
                                                        fornecedor.dataCadastro
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <BadgeStatus
                                                        status={fornecedor.status}
                                                    />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                abrirDetalhes(
                                                                    fornecedor
                                                                )
                                                            }
                                                            title="Ver detalhes"
                                                            className="rounded-lg p-2 text-[#89867d] transition hover:bg-[#f1e8d1] hover:text-[#98700a]"
                                                        >
                                                            <Eye size={17} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                abrirEdicao(
                                                                    fornecedor
                                                                )
                                                            }
                                                            title="Editar fornecedor"
                                                            className="rounded-lg p-2 text-[#89867d] transition hover:bg-[#f1e8d1] hover:text-[#98700a]"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                excluirFornecedor(
                                                                    fornecedor
                                                                )
                                                            }
                                                            title="Excluir fornecedor"
                                                            className="rounded-lg p-2 text-[#aaa69b] transition hover:bg-rose-50 hover:text-rose-600"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}

                                    {fornecedoresPaginados.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-5 py-14 text-center"
                                            >
                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5edda] text-[#98700a]">
                                                    <Users size={23} />
                                                </div>

                                                <p className="mt-3 text-sm font-medium text-[#555248]">
                                                    Nenhum fornecedor encontrado
                                                </p>

                                                <p className="mt-1 text-xs text-[#969187]">
                                                    Tente alterar os filtros ou cadastre um novo fornecedor.
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={limparFiltros}
                                                    className="mt-4 text-sm font-medium text-[#98700a] hover:text-[#78601e]"
                                                >
                                                    Limpar filtros
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginação */}
                        <div className="flex flex-col gap-3 border-t border-[#eee7d7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-[#89867d]">
                                {fornecedoresFiltrados.length === 0
                                    ? "Nenhum registro"
                                    : `Mostrando ${
                                          (pagina - 1) * itensPorPagina + 1
                                      }–${Math.min(
                                          pagina * itensPorPagina,
                                          fornecedoresFiltrados.length
                                      )} de ${fornecedoresFiltrados.length} fornecedores`}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={pagina === 1}
                                    onClick={() =>
                                        setPagina((anterior) =>
                                            Math.max(1, anterior - 1)
                                        )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfcd] text-[#77746b] transition hover:bg-[#f5f1e7] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft size={17} />
                                </button>

                                <span className="min-w-[90px] text-center text-xs text-[#77746b]">
                                    Página {pagina} de {totalPaginas}
                                </span>

                                <button
                                    type="button"
                                    disabled={pagina >= totalPaginas}
                                    onClick={() =>
                                        setPagina((anterior) =>
                                            Math.min(totalPaginas, anterior + 1)
                                        )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfcd] text-[#77746b] transition hover:bg-[#f5f1e7] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronRight size={17} />
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Modal de cadastro e edição */}
            {modalAberto && modoModal !== "detalhes" && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#28251e]/40 p-4 backdrop-blur-[2px]"
                    onMouseDown={(evento) => {
                        if (evento.target === evento.currentTarget) {
                            fecharModal();
                        }
                    }}
                >
                    <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#e6dfcd] bg-[#fffefa] shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#eee7d7] px-5 py-4 sm:px-6">
                            <div>
                                <h2 className="text-lg font-medium text-[#78601e]">
                                    {modoModal === "edicao"
                                        ? "Editar fornecedor"
                                        : "Novo fornecedor"}
                                </h2>

                                <p className="mt-1 text-xs text-[#89867d]">
                                    Preencha os dados do fornecedor.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fecharModal}
                                className="rounded-lg p-2 text-[#89867d] transition hover:bg-[#f1e8d1] hover:text-[#78601e]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={salvarFornecedor}
                            className="overflow-y-auto"
                        >
                            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
                                <div className="sm:col-span-2">
                                    <Campo
                                        label="Nome do fornecedor"
                                        value={formulario.nome}
                                        onChange={(evento) =>
                                            atualizarCampo(
                                                "nome",
                                                evento.target.value
                                            )
                                        }
                                        placeholder="Ex.: Distribuidora Luz do Oriente"
                                        required
                                    />
                                </div>

                                <Campo
                                    label="CNPJ / CPF"
                                    value={formulario.documento}
                                    onChange={(evento) =>
                                        atualizarCampo(
                                            "documento",
                                            evento.target.value
                                        )
                                    }
                                    placeholder="00.000.000/0000-00"
                                />

                                <Campo
                                    label="Pessoa de contato"
                                    value={formulario.contato}
                                    onChange={(evento) =>
                                        atualizarCampo(
                                            "contato",
                                            evento.target.value
                                        )
                                    }
                                    placeholder="Nome do responsável"
                                />

                                <Campo
                                    label="E-mail"
                                    type="email"
                                    value={formulario.email}
                                    onChange={(evento) =>
                                        atualizarCampo(
                                            "email",
                                            evento.target.value
                                        )
                                    }
                                    placeholder="contato@empresa.com.br"
                                />

                                <Campo
                                    label="Telefone"
                                    value={formulario.telefone}
                                    onChange={(evento) =>
                                        atualizarCampo(
                                            "telefone",
                                            evento.target.value
                                        )
                                    }
                                    placeholder="(00) 00000-0000"
                                />

                                <Campo
                                    label="Cidade"
                                    value={formulario.cidade}
                                    onChange={(evento) =>
                                        atualizarCampo(
                                            "cidade",
                                            evento.target.value
                                        )
                                    }
                                    placeholder="Cidade"
                                />

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-[#77746b]">
                                        Estado
                                    </label>

                                    <input
                                        type="text"
                                        maxLength={2}
                                        value={formulario.estado}
                                        onChange={(evento) =>
                                            atualizarCampo(
                                                "estado",
                                                evento.target.value.toUpperCase()
                                            )
                                        }
                                        placeholder="SP"
                                        className="w-full rounded-lg border border-[#e6dfcd] bg-[#fcfbf7] px-3.5 py-2.5 text-sm uppercase text-[#35342f] outline-none transition placeholder:text-[#aaa69b] focus:border-[#c6a64b] focus:ring-2 focus:ring-[#c6a64b]/10"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-[#77746b]">
                                        Categoria
                                    </label>

                                    <select
                                        value={formulario.categoria}
                                        onChange={(evento) =>
                                            atualizarCampo(
                                                "categoria",
                                                evento.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#e6dfcd] bg-[#fcfbf7] px-3.5 py-2.5 text-sm text-[#35342f] outline-none transition focus:border-[#c6a64b]"
                                    >
                                        <option value="">
                                            Selecione uma categoria
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
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-[#77746b]">
                                        Status
                                    </label>

                                    <select
                                        value={formulario.status}
                                        onChange={(evento) =>
                                            atualizarCampo(
                                                "status",
                                                evento.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-[#e6dfcd] bg-[#fcfbf7] px-3.5 py-2.5 text-sm text-[#35342f] outline-none transition focus:border-[#c6a64b]"
                                    >
                                        <option value="Ativo">Ativo</option>
                                        <option value="Inativo">Inativo</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="block text-xs font-medium text-[#77746b]">
                                        Observações
                                    </label>

                                    <textarea
                                        rows={3}
                                        value={formulario.observacoes}
                                        onChange={(evento) =>
                                            atualizarCampo(
                                                "observacoes",
                                                evento.target.value
                                            )
                                        }
                                        placeholder="Informações adicionais sobre o fornecedor..."
                                        className="w-full resize-y rounded-lg border border-[#e6dfcd] bg-[#fcfbf7] px-3.5 py-2.5 text-sm text-[#35342f] outline-none transition placeholder:text-[#aaa69b] focus:border-[#c6a64b] focus:ring-2 focus:ring-[#c6a64b]/10"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-2 border-t border-[#eee7d7] bg-[#fcfbf7] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                                <button
                                    type="button"
                                    onClick={fecharModal}
                                    className="rounded-lg border border-[#e6dfcd] px-4 py-2.5 text-sm font-medium text-[#77746b] transition hover:bg-[#f1eee6]"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#98700a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#806009]"
                                >
                                    <Save size={17} />
                                    {modoModal === "edicao"
                                        ? "Salvar alterações"
                                        : "Cadastrar fornecedor"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de detalhes */}
            {modalAberto &&
                modoModal === "detalhes" &&
                fornecedorSelecionado && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#28251e]/40 p-4 backdrop-blur-[2px]"
                        onMouseDown={(evento) => {
                            if (evento.target === evento.currentTarget) {
                                fecharModal();
                            }
                        }}
                    >
                        <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-[#e6dfcd] bg-[#fffefa] shadow-xl">
                            <div className="flex items-start justify-between border-b border-[#eee7d7] p-5 sm:p-6">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f5edda] text-[#98700a]">
                                        <Building2 size={24} />
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="break-words text-lg font-medium text-[#78601e]">
                                            {fornecedorSelecionado.nome}
                                        </h2>

                                        <div className="mt-1.5">
                                            <BadgeStatus
                                                status={
                                                    fornecedorSelecionado.status
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={fecharModal}
                                    className="ml-3 rounded-lg p-2 text-[#89867d] transition hover:bg-[#f1e8d1] hover:text-[#78601e]"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-5 overflow-y-auto p-5 sm:p-6">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="rounded-lg border border-[#eee7d7] bg-[#fcfbf7] p-4">
                                        <div className="flex items-center gap-2 text-[#98700a]">
                                            <Building2 size={16} />
                                            <span className="text-xs font-medium">
                                                Documento
                                            </span>
                                        </div>

                                        <p className="mt-2 break-words text-sm text-[#35342f]">
                                            {fornecedorSelecionado.documento ||
                                                "Não informado"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-[#78601e]">
                                        Informações de contato
                                    </h3>

                                    <div className="flex items-start gap-3">
                                        <Users
                                            size={18}
                                            className="mt-0.5 shrink-0 text-[#98700a]"
                                        />
                                        <div>
                                            <p className="text-xs text-[#89867d]">
                                                Responsável
                                            </p>
                                            <p className="mt-1 text-sm text-[#35342f]">
                                                {fornecedorSelecionado.contato ||
                                                    "Não informado"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Mail
                                            size={18}
                                            className="mt-0.5 shrink-0 text-[#98700a]"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-xs text-[#89867d]">
                                                E-mail
                                            </p>
                                            <p className="mt-1 break-all text-sm text-[#35342f]">
                                                {fornecedorSelecionado.email ||
                                                    "Não informado"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone
                                            size={18}
                                            className="mt-0.5 shrink-0 text-[#98700a]"
                                        />
                                        <div>
                                            <p className="text-xs text-[#89867d]">
                                                Telefone
                                            </p>
                                            <p className="mt-1 text-sm text-[#35342f]">
                                                {fornecedorSelecionado.telefone ||
                                                    "Não informado"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin
                                            size={18}
                                            className="mt-0.5 shrink-0 text-[#98700a]"
                                        />
                                        <div>
                                            <p className="text-xs text-[#89867d]">
                                                Cidade / Estado
                                            </p>
                                            <p className="mt-1 text-sm text-[#35342f]">
                                                {[
                                                    fornecedorSelecionado.cidade,
                                                    fornecedorSelecionado.estado,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" / ") || "Não informado"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CalendarDays
                                            size={18}
                                            className="mt-0.5 shrink-0 text-[#98700a]"
                                        />
                                        <div>
                                            <p className="text-xs text-[#89867d]">
                                                Data de cadastro
                                            </p>
                                            <p className="mt-1 text-sm text-[#35342f]">
                                                {formatarData(
                                                    fornecedorSelecionado.dataCadastro
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {fornecedorSelecionado.observacoes && (
                                    <div className="rounded-lg border border-[#eee7d7] bg-[#fcfbf7] p-4">
                                        <p className="text-xs font-medium text-[#78601e]">
                                            Observações
                                        </p>
                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#77746b]">
                                            {fornecedorSelecionado.observacoes}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col-reverse gap-2 border-t border-[#eee7d7] bg-[#fcfbf7] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <button
                                    type="button"
                                    onClick={() =>
                                        alterarStatus(fornecedorSelecionado)
                                    }
                                    className="rounded-lg border border-[#e6dfcd] px-3.5 py-2.5 text-sm font-medium text-[#77746b] transition hover:bg-[#f1eee6]"
                                >
                                    {fornecedorSelecionado.status === "Ativo"
                                        ? "Inativar fornecedor"
                                        : "Ativar fornecedor"}
                                </button>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={fecharModal}
                                        className="rounded-lg border border-[#e6dfcd] px-4 py-2.5 text-sm font-medium text-[#77746b] transition hover:bg-[#f1eee6]"
                                    >
                                        Fechar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            abrirEdicao(fornecedorSelecionado)
                                        }
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#98700a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#806009]"
                                    >
                                        <Pencil size={16} />
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default Fornecedores;