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
    Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

const obterStatus = (produto) => {
    if (produto.quantidade === 0) return "Sem estoque";
    if (produto.quantidade <= produto.minimo) return "Estoque baixo";
    return "Normal";
};

const classeStatus = (status) => {
    if (status === "Normal") {
        return "border-[#b9d9c5] bg-[#edf7f0] text-[#32734a]";
    }

    if (status === "Sem estoque") {
        return "border-[#e6c8c3] bg-[#fdf0ed] text-[#b34b40]";
    }

    return "border-[#e6d5a5] bg-[#fbf4df] text-[#89670d]";
};

const campoClasse =
    "w-full rounded-md border border-[#e3dcc9] bg-[#faf9f5] px-3 py-3 text-sm text-[#45433d] outline-none transition placeholder:text-[#918d83] focus:border-[#b18a20]";

const botaoSecundario =
    "rounded-md border border-[#e3dcc9] px-4 py-2 text-sm text-[#68645b] transition hover:bg-[#f5f1e7]";

export const Estoque = () => {
    const navegar = useNavigate();

    const [produtos, setProdutos] = useState(produtosIniciais);
    const [busca, setBusca] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
    const [statusSelecionado, setStatusSelecionado] = useState("Todos");
    const [pagina, setPagina] = useState(1);

    const [movimentacao, setMovimentacao] = useState(null);
    const [buscaCatalogo, setBuscaCatalogo] = useState("");
    const [categoriaCatalogo, setCategoriaCatalogo] = useState("Todas");
    const [itensMovimentacao, setItensMovimentacao] = useState([]);
    const [mensagem, setMensagem] = useState("");

    const [produtoDetalhes, setProdutoDetalhes] = useState(null);

    const porPagina = 10;

    const produtosFiltrados = produtos.filter((produto) => {
        const termo = busca.toLowerCase().trim();

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

        return (
            correspondeBusca &&
            correspondeCategoria &&
            correspondeStatus
        );
    });

    const totalPaginas = Math.max(
        1,
        Math.ceil(produtosFiltrados.length / porPagina)
    );

    const paginaAtual = Math.min(pagina, totalPaginas);

    const produtosPagina = produtosFiltrados.slice(
        (paginaAtual - 1) * porPagina,
        paginaAtual * porPagina
    );

    const totalProdutos = produtos.length;

    const valorEstoque = produtos.reduce(
        (total, produto) =>
            total + produto.quantidade * produto.preco,
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
            .reduce(
                (total, produto) => total + produto.quantidade,
                0
            );

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

    // Abre o catálogo para entrada ou saída.
    const abrirMovimentacao = (tipo, produto = null) => {
        setMensagem("");
        setBuscaCatalogo("");
        setCategoriaCatalogo("Todas");

        setItensMovimentacao(
            produto
                ? [{
                    ...produto,
                    quantidadeMovimentacao: 1
                }]
                : []
        );

        setMovimentacao({ tipo });
    };

    const fecharMovimentacao = () => {
        setMovimentacao(null);
        setItensMovimentacao([]);
        setMensagem("");
        setBuscaCatalogo("");
        setCategoriaCatalogo("Todas");
    };

    // Adiciona vários produtos à mesma movimentação.
    const adicionarItem = (produto) => {
        if (
            movimentacao?.tipo === "saida" &&
            produto.quantidade === 0
        ) {
            setMensagem(
                `${produto.nome} não possui estoque disponível.`
            );
            return;
        }

        setMensagem("");

        setItensMovimentacao((atuais) => {
            const existente = atuais.find(
                (item) => item.id === produto.id
            );

            if (existente) {
                return atuais.map((item) => {
                    if (item.id !== produto.id) return item;

                    const novaQuantidade =
                        Number(item.quantidadeMovimentacao) + 1;

                    return {
                        ...item,
                        quantidadeMovimentacao:
                            movimentacao?.tipo === "saida"
                                ? Math.min(
                                    novaQuantidade,
                                    produto.quantidade
                                )
                                : novaQuantidade
                    };
                });
            }

            return [
                ...atuais,
                {
                    ...produto,
                    quantidadeMovimentacao: 1
                }
            ];
        });
    };

    const alterarQuantidadeItem = (id, valor) => {
        setMensagem("");

        setItensMovimentacao((atuais) =>
            atuais.map((item) => {
                if (item.id !== id) return item;

                if (valor === "") {
                    return {
                        ...item,
                        quantidadeMovimentacao: ""
                    };
                }

                const numero = Number(valor);

                return {
                    ...item,
                    quantidadeMovimentacao:
                        movimentacao?.tipo === "saida"
                            ? Math.min(numero, item.quantidade)
                            : numero
                };
            })
        );
    };

    const removerItem = (id) => {
        setItensMovimentacao((atuais) =>
            atuais.filter((item) => item.id !== id)
        );

        setMensagem("");
    };

    const produtosCatalogo = produtos.filter((produto) => {
        const termo = buscaCatalogo.toLowerCase().trim();

        const correspondeBusca =
            produto.nome.toLowerCase().includes(termo) ||
            produto.categoria.toLowerCase().includes(termo) ||
            String(produto.id).includes(termo);

        const correspondeCategoria =
            categoriaCatalogo === "Todas" ||
            produto.categoria === categoriaCatalogo;

        const jaAdicionado = itensMovimentacao.some(
            (item) => item.id === produto.id
        );

        const disponivelParaSaida =
            movimentacao?.tipo !== "saida" ||
            produto.quantidade > 0;

        return (
            correspondeBusca &&
            correspondeCategoria &&
            !jaAdicionado &&
            disponivelParaSaida
        );
    });

    const quantidadeTotalMovimentacao =
        itensMovimentacao.reduce(
            (total, item) =>
                total +
                (Number(item.quantidadeMovimentacao) || 0),
            0
        );

    const valorTotalMovimentacao =
        itensMovimentacao.reduce(
            (total, item) =>
                total +
                item.preco *
                    (Number(item.quantidadeMovimentacao) || 0),
            0
        );

    // Valida todos os itens antes de alterar qualquer estoque.
    const registrarMovimentacao = () => {
        if (itensMovimentacao.length === 0) {
            setMensagem(
                "Adicione pelo menos um produto à movimentação."
            );
            return;
        }

        for (const item of itensMovimentacao) {
            const quantidade = Number(
                item.quantidadeMovimentacao
            );

            if (
                !Number.isInteger(quantidade) ||
                quantidade <= 0
            ) {
                setMensagem(
                    `Informe uma quantidade inteira válida para ${item.nome}.`
                );
                return;
            }

            const produtoAtual = produtos.find(
                (produto) => produto.id === item.id
            );

            if (!produtoAtual) {
                setMensagem(
                    `O produto ${item.nome} não foi encontrado.`
                );
                return;
            }

            if (
                movimentacao.tipo === "saida" &&
                quantidade > produtoAtual.quantidade
            ) {
                setMensagem(
                    `Estoque insuficiente para ${item.nome}. Disponível: ${produtoAtual.quantidade} unidade(s).`
                );
                return;
            }
        }

        setProdutos((atuais) =>
            atuais.map((produto) => {
                const item = itensMovimentacao.find(
                    (selecionado) =>
                        selecionado.id === produto.id
                );

                if (!item) return produto;

                const quantidade = Number(
                    item.quantidadeMovimentacao
                );

                return {
                    ...produto,
                    quantidade:
                        produto.quantidade +
                        (movimentacao.tipo === "entrada"
                            ? quantidade
                            : -quantidade)
                };
            })
        );

        fecharMovimentacao();
    };
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
                        <div className="flex flex-col justify-center gap-1">
                            <h2
                                className="m-0 text-xl text-[#89670d] sm:text-2xl"
                                style={{
                                    fontFamily: "Corvel",
                                    fontWeight: "normal",
                                    fontSize: "26px",
                                    lineHeight: "1.6",
                                    letterSpacing: "1px",
                                    wordSpacing: "2px",
                                    padding: "4px 2px 6px",
                                    display: "block"
                                }}
                            >
                                Estoque
                            </h2>

                            <p className="m-0 text-xs leading-5 text-[#77746b]">
                                Controle de produtos e inventário
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="hidden items-center gap-2 rounded-md border border-[#e3dcc9] bg-[#fffefa] px-3 py-2 sm:flex">
                            <Search
                                size={17}
                                className="text-[#918d83]"
                            />
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
                    {/* Ações de entrada e saída */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <button
                            onClick={() =>
                                abrirMovimentacao("entrada")
                            }
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
                                    Adicionar vários produtos
                                </p>
                            </div>

                            <Plus
                                size={20}
                                className="ml-auto shrink-0"
                            />
                        </button>

                        <button
                            onClick={() =>
                                abrirMovimentacao("saida")
                            }
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

                            <Plus
                                size={20}
                                className="ml-auto shrink-0 text-[#b34b40]"
                            />
                        </button>
                    </section>

                    {/* Indicadores */}
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

                    {/* Tabela e painéis laterais */}
                    <section className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-4">
                        <div className="overflow-hidden rounded-lg border border-[#e6dfcd] bg-[#fffefa] 2xl:col-span-3">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6dfcd] p-5">
                                <div className="flex items-center gap-2">
                                    <Package
                                        size={21}
                                        className="text-[#98700a]"
                                    />
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

                            {/* Pesquisa e filtros da tabela */}
                            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
                                <div className="flex items-center gap-2 rounded-md border border-[#e3dcc9] bg-[#faf9f5] px-3 py-2">
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
                                        placeholder="Buscar produto..."
                                        className="w-full bg-transparent text-sm text-[#45433d] outline-none placeholder:text-[#918d83]"
                                    />
                                </div>

                                <select
                                    value={categoriaSelecionada}
                                    onChange={(e) => {
                                        setCategoriaSelecionada(
                                            e.target.value
                                        );
                                        setPagina(1);
                                    }}
                                    className="rounded-md border border-[#e3dcc9] bg-[#faf9f5] px-3 py-2 text-sm text-[#68645b] outline-none focus:border-[#b18a20]"
                                >
                                    <option value="Todas">
                                        Todas as categorias
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

                                <select
                                    value={statusSelecionado}
                                    onChange={(e) => {
                                        setStatusSelecionado(
                                            e.target.value
                                        );
                                        setPagina(1);
                                    }}
                                    className="rounded-md border border-[#e3dcc9] bg-[#faf9f5] px-3 py-2 text-sm text-[#68645b] outline-none focus:border-[#b18a20]"
                                >
                                    <option value="Todos">
                                        Todos os status
                                    </option>
                                    <option value="Normal">
                                        Normal
                                    </option>
                                    <option value="Estoque baixo">
                                        Estoque baixo
                                    </option>
                                    <option value="Sem estoque">
                                        Sem estoque
                                    </option>
                                </select>
                            </div>

                            <div className="overflow-x-auto px-4">
                                <table className="w-full min-w-[760px] text-left text-sm">
                                    <thead>
                                        <tr className="bg-[#f5f1e7] text-xs text-[#89670d]">
                                            <th className="px-3 py-4 font-medium">
                                                Produto
                                            </th>
                                            <th className="px-3 py-4 font-medium">
                                                Categoria
                                            </th>
                                            <th className="px-3 py-4 font-medium">
                                                Estoque Atual
                                            </th>
                                            <th className="px-3 py-4 font-medium">
                                                Estoque Mínimo
                                            </th>
                                            <th className="px-3 py-4 font-medium">
                                                Status
                                            </th>
                                            <th className="px-3 py-4 text-center font-medium">
                                                Ações
                                            </th>
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
                                                                <Package
                                                                    size={18}
                                                                    className="text-[#98700a]"
                                                                />
                                                            </div>
                                                            <span className="font-medium text-[#45433d]">
                                                                {produto.nome}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-3 py-4">
                                                        {produto.categoria}
                                                    </td>

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

                                                    <td className="px-3 py-4">
                                                        {produto.minimo}
                                                    </td>

                                                    <td className="px-3 py-4">
                                                        <span
                                                            className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs ${classeStatus(status)}`}
                                                        >
                                                            {status}
                                                        </span>
                                                    </td>

                                                    <td className="px-3 py-4">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button
                                                                title="Ver detalhes"
                                                                onClick={() =>
                                                                    setProdutoDetalhes(
                                                                        produto
                                                                    )
                                                                }
                                                                className="text-[#918d83] transition hover:text-[#98700a]"
                                                            >
                                                                <Eye size={17} />
                                                            </button>

                                                            <button
                                                                title="Registrar entrada"
                                                                onClick={() =>
                                                                    abrirMovimentacao(
                                                                        "entrada",
                                                                        produto
                                                                    )
                                                                }
                                                                className="text-[#918d83] transition hover:text-[#32734a]"
                                                            >
                                                                <ArrowDownToLine size={17} />
                                                            </button>

                                                            <button
                                                                title="Registrar saída"
                                                                onClick={() =>
                                                                    abrirMovimentacao(
                                                                        "saida",
                                                                        produto
                                                                    )
                                                                }
                                                                disabled={
                                                                    produto.quantidade === 0
                                                                }
                                                                className="text-[#918d83] transition hover:text-[#b34b40] disabled:cursor-not-allowed disabled:opacity-30"
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
                                                <td
                                                    colSpan={6}
                                                    className="px-4 py-12 text-center text-[#918d83]"
                                                >
                                                    Nenhum produto encontrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginação */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6dfcd] p-4">
                                <p className="text-xs text-[#918d83]">
                                    Mostrando{" "}
                                    {produtosFiltrados.length === 0
                                        ? 0
                                        : (paginaAtual - 1) * porPagina + 1}{" "}
                                    a{" "}
                                    {Math.min(
                                        paginaAtual * porPagina,
                                        produtosFiltrados.length
                                    )}{" "}
                                    de {produtosFiltrados.length} produtos
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={paginaAtual === 1}
                                        onClick={() =>
                                            setPagina((p) => Math.max(1, p - 1))
                                        }
                                        className="rounded-md border border-[#e3dcc9] p-2 text-[#68645b] transition hover:border-[#b18a20] disabled:opacity-30"
                                    >
                                        <ChevronLeft size={17} />
                                    </button>

                                    <span className="rounded-md bg-[#98700a] px-3 py-2 text-sm font-semibold text-white">
                                        {paginaAtual}
                                    </span>

                                    <button
                                        disabled={paginaAtual >= totalPaginas}
                                        onClick={() =>
                                            setPagina((p) =>
                                                Math.min(totalPaginas, p + 1)
                                            )
                                        }
                                        className="rounded-md border border-[#e3dcc9] p-2 text-[#68645b] transition hover:border-[#b18a20] disabled:opacity-30"
                                    >
                                        <ChevronRight size={17} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Painéis laterais */}
                        <div className="space-y-5">
                            <div className="rounded-lg border border-[#e6dfcd] bg-[#fffefa]">
                                <div className="flex items-center gap-2 border-b border-[#e6dfcd] p-4">
                                    <AlertTriangle
                                        size={20}
                                        className="text-[#98700a]"
                                    />
                                    <h2 className="text-base text-[#89670d]">
                                        Alerta de Estoque
                                    </h2>
                                </div>

                                <div className="divide-y divide-[#eee8dc] px-4">
                                    {produtos
                                        .filter(
                                            (produto) =>
                                                obterStatus(produto) !== "Normal"
                                        )
                                        .slice(0, 5)
                                        .map((produto) => (
                                            <div
                                                key={produto.id}
                                                className="flex items-center justify-between gap-3 py-3"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm text-[#45433d]">
                                                        {produto.nome}
                                                    </p>
                                                    <p className="mt-1 text-xs text-[#918d83]">
                                                        {produto.quantidade === 0
                                                            ? "Sem estoque"
                                                            : `${produto.quantidade} unidades`}
                                                    </p>
                                                </div>

                                                <AlertTriangle
                                                    size={17}
                                                    className={
                                                        produto.quantidade === 0
                                                            ? "shrink-0 text-[#b34b40]"
                                                            : "shrink-0 text-[#98700a]"
                                                    }
                                                />
                                            </div>
                                        ))}

                                    {produtosBaixos + produtosSemEstoque === 0 && (
                                        <p className="py-5 text-sm text-[#918d83]">
                                            Nenhum alerta no momento.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-[#e6dfcd] bg-[#fffefa] p-4">
                                <div className="mb-4 flex items-center gap-2">
                                    <Plus
                                        size={20}
                                        className="text-[#98700a]"
                                    />
                                    <h2 className="text-base text-[#89670d]">
                                        Ações Rápidas
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => navegar("/produtos")}
                                        className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border border-[#e3dcc9] p-3 text-center text-xs text-[#68645b] transition hover:bg-[#f5f1e7] hover:text-[#89670d]"
                                    >
                                        <Package
                                            size={23}
                                            className="text-[#98700a]"
                                        />
                                        Cadastrar Produto
                                    </button>

                                    <button
                                        onClick={() => navegar("/relatorios")}
                                        className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border border-[#e3dcc9] p-3 text-center text-xs text-[#68645b] transition hover:bg-[#f5f1e7] hover:text-[#89670d]"
                                    >
                                        <ChartNoAxesCombined
                                            size={23}
                                            className="text-[#98700a]"
                                        />
                                        Ver Relatórios
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
                        {/* Modal do catálogo de entrada e saída */}
            {movimentacao && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-[#35342f]/50 p-3 backdrop-blur-sm sm:p-6"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            fecharMovimentacao();
                        }
                    }}
                >
                    <div className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-[#e6dfcd] bg-[#faf9f5] shadow-2xl">
                        {/* Cabeçalho */}
                        <div className="flex items-center justify-between border-b border-[#e6dfcd] bg-[#fffefa] px-5 py-4 sm:px-7">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                                        movimentacao.tipo === "entrada"
                                            ? "bg-[#f1e8d1] text-[#98700a]"
                                            : "bg-[#f8e7e3] text-[#b34b40]"
                                    }`}
                                >
                                    {movimentacao.tipo === "entrada" ? (
                                        <ArrowDownToLine size={23} />
                                    ) : (
                                        <ArrowUpFromLine size={23} />
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-[#89670d] sm:text-xl">
                                        {movimentacao.tipo === "entrada"
                                            ? "Entrada de Estoque"
                                            : "Saída de Estoque"}
                                    </h2>
                                    <p className="mt-1 text-xs text-[#918d83]">
                                        Selecione os produtos e defina as quantidades.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={fecharMovimentacao}
                                aria-label="Fechar catálogo"
                                className="rounded-md p-2 text-[#918d83] transition hover:bg-[#f5f1e7] hover:text-[#45433d]"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[1fr_340px] lg:overflow-hidden">
                            {/* Catálogo */}
                            <div className="min-w-0 p-4 sm:p-6 lg:overflow-y-auto">
                                <div className="mb-5">
                                    <h3 className="text-base font-semibold text-[#45433d]">
                                        Catálogo de produtos
                                    </h3>
                                    <p className="mt-1 text-sm text-[#918d83]">
                                        Escolha um ou vários produtos para movimentar.
                                    </p>
                                </div>

                                {/* Barra de pesquisa */}
                                <div className="mb-4 flex items-center gap-3 rounded-lg border border-[#e3dcc9] bg-[#fffefa] px-4 py-3 transition focus-within:border-[#b18a20] focus-within:ring-2 focus-within:ring-[#b18a20]/10">
                                    <Search
                                        size={20}
                                        className="shrink-0 text-[#98700a]"
                                    />

                                    <input
                                        autoFocus
                                        value={buscaCatalogo}
                                        onChange={(e) =>
                                            setBuscaCatalogo(e.target.value)
                                        }
                                        placeholder="Buscar por nome, categoria ou código..."
                                        className="w-full bg-transparent text-sm text-[#45433d] outline-none placeholder:text-[#aaa496]"
                                    />

                                    {buscaCatalogo && (
                                        <button
                                            onClick={() => setBuscaCatalogo("")}
                                            aria-label="Limpar pesquisa"
                                            className="text-[#918d83] hover:text-[#45433d]"
                                        >
                                            <X size={17} />
                                        </button>
                                    )}
                                </div>

                                {/* Filtros de categoria */}
                                <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
                                    {["Todas", ...categorias].map((categoria) => (
                                        <button
                                            key={categoria}
                                            onClick={() =>
                                                setCategoriaCatalogo(categoria)
                                            }
                                            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition ${
                                                categoriaCatalogo === categoria
                                                    ? "border-[#98700a] bg-[#98700a] text-white"
                                                    : "border-[#e3dcc9] bg-[#fffefa] text-[#68645b] hover:border-[#c8b77e] hover:bg-[#f5f1e7]"
                                            }`}
                                        >
                                            {categoria}
                                        </button>
                                    ))}
                                </div>

                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-xs text-[#918d83]">
                                        {produtosCatalogo.length} produto(s) disponível(is)
                                    </p>
                                    <p className="text-xs text-[#918d83]">
                                        {itensMovimentacao.length} selecionado(s)
                                    </p>
                                </div>

                                {/* Cards do catálogo */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {produtosCatalogo.map((produto) => {
                                        const status = obterStatus(produto);

                                        return (
                                            <div
                                                key={produto.id}
                                                className="group flex flex-col rounded-lg border border-[#e6dfcd] bg-[#fffefa] p-4 transition hover:border-[#c8b77e] hover:shadow-md"
                                            >
                                                <div className="mb-3 flex items-start justify-between gap-2">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#e6dfcd] bg-[#f5f1e7]">
                                                        <Package
                                                            size={22}
                                                            className="text-[#98700a]"
                                                        />
                                                    </div>

                                                    <span
                                                        className={`rounded-full border px-2 py-1 text-[10px] ${classeStatus(status)}`}
                                                    >
                                                        {status}
                                                    </span>
                                                </div>

                                                <p className="text-[11px] text-[#98700a]">
                                                    {produto.categoria}
                                                </p>

                                                <h4 className="mt-1 min-h-10 text-sm font-semibold text-[#45433d]">
                                                    {produto.nome}
                                                </h4>

                                                <p className="mt-2 text-lg font-semibold text-[#89670d]">
                                                    {moeda(produto.preco)}
                                                </p>

                                                <div className="mt-3 flex items-center justify-between border-t border-[#eee8dc] pt-3">
                                                    <div>
                                                        <p className="text-[11px] text-[#918d83]">
                                                            Disponível
                                                        </p>
                                                        <p
                                                            className={`mt-1 text-sm font-medium ${
                                                                produto.quantidade === 0
                                                                    ? "text-[#b34b40]"
                                                                    : "text-[#45433d]"
                                                            }`}
                                                        >
                                                            {produto.quantidade} un.
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            adicionarItem(produto)
                                                        }
                                                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-white transition ${
                                                            movimentacao.tipo === "entrada"
                                                                ? "bg-[#98700a] hover:bg-[#806009]"
                                                                : "bg-[#b34b40] hover:bg-[#963b32]"
                                                        }`}
                                                    >
                                                        <Plus size={15} />
                                                        Adicionar
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {produtosCatalogo.length === 0 && (
                                    <div className="rounded-lg border border-dashed border-[#d9d0bc] bg-[#fffefa] px-4 py-12 text-center">
                                        <Package
                                            size={34}
                                            className="mx-auto text-[#c8b77e]"
                                        />
                                        <p className="mt-3 text-sm font-medium text-[#68645b]">
                                            Nenhum produto encontrado
                                        </p>
                                        <p className="mt-1 text-xs text-[#918d83]">
                                            Tente outra pesquisa ou selecione outra categoria.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setBuscaCatalogo("");
                                                setCategoriaCatalogo("Todas");
                                            }}
                                            className="mt-4 text-xs font-semibold text-[#89670d] hover:underline"
                                        >
                                            Limpar filtros
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Resumo da movimentação */}
                            <aside className="flex min-h-0 flex-col border-t border-[#e6dfcd] bg-[#fffefa] lg:border-l lg:border-t-0">
                                <div className="border-b border-[#e6dfcd] p-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-[#45433d]">
                                            Resumo da movimentação
                                        </h3>

                                        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#f1e8d1] px-2 text-xs font-semibold text-[#89670d]">
                                            {itensMovimentacao.length}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-xs text-[#918d83]">
                                        Produtos adicionados à lista
                                    </p>
                                </div>

                                <div className="max-h-[340px] flex-1 divide-y divide-[#eee8dc] overflow-y-auto px-4 lg:max-h-none">
                                    {itensMovimentacao.map((item) => (
                                        <div key={item.id} className="py-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-[#45433d]">
                                                        {item.nome}
                                                    </p>
                                                    <p className="mt-1 text-xs text-[#918d83]">
                                                        {moeda(item.preco)} por unidade
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        removerItem(item.id)
                                                    }
                                                    aria-label={`Remover ${item.nome}`}
                                                    className="shrink-0 rounded-md p-1 text-[#b34b40] transition hover:bg-[#fdf0ed]"
                                                >
                                                    <X size={17} />
                                                </button>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                <div className="flex items-center rounded-md border border-[#e3dcc9]">
                                                    <button
                                                        onClick={() =>
                                                            alterarQuantidadeItem(
                                                                item.id,
                                                                Math.max(
                                                                    1,
                                                                    (Number(item.quantidadeMovimentacao) || 1) - 1
                                                                )
                                                            )
                                                        }
                                                        className="px-3 py-2 text-[#68645b] transition hover:bg-[#f5f1e7]"
                                                    >
                                                        −
                                                    </button>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        step="1"
                                                        max={
                                                            movimentacao.tipo === "saida"
                                                                ? item.quantidade
                                                                : undefined
                                                        }
                                                        value={item.quantidadeMovimentacao}
                                                        onChange={(e) =>
                                                            alterarQuantidadeItem(
                                                                item.id,
                                                                e.target.value === ""
                                                                    ? ""
                                                                    : Math.max(
                                                                        1,
                                                                        Number(e.target.value)
                                                                    )
                                                            )
                                                        }
                                                        className="w-12 border-x border-[#e3dcc9] bg-transparent py-2 text-center text-sm text-[#45433d] outline-none"
                                                    />

                                                    <button
                                                        disabled={
                                                            movimentacao.tipo === "saida" &&
                                                            Number(item.quantidadeMovimentacao) >= item.quantidade
                                                        }
                                                        onClick={() =>
                                                            alterarQuantidadeItem(
                                                                item.id,
                                                                (Number(item.quantidadeMovimentacao) || 0) + 1
                                                            )
                                                        }
                                                        className="px-3 py-2 text-[#68645b] transition hover:bg-[#f5f1e7] disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <p className="text-sm font-semibold text-[#89670d]">
                                                    {moeda(
                                                        item.preco *
                                                        (Number(item.quantidadeMovimentacao) || 0)
                                                    )}
                                                </p>
                                            </div>

                                            {movimentacao.tipo === "saida" && (
                                                <p className="mt-2 text-[11px] text-[#918d83]">
                                                    Disponível: {item.quantidade} unidade(s)
                                                </p>
                                            )}
                                        </div>
                                    ))}

                                    {itensMovimentacao.length === 0 && (
                                        <div className="flex min-h-44 flex-col items-center justify-center px-4 text-center">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f1e7]">
                                                <ShoppingCart
                                                    size={25}
                                                    className="text-[#b8aa85]"
                                                />
                                            </div>

                                            <p className="mt-3 text-sm font-medium text-[#68645b]">
                                                Sua lista está vazia
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-[#918d83]">
                                                Adicione produtos do catálogo para começar.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Totais e confirmação */}
                                <div className="border-t border-[#e6dfcd] bg-[#faf9f5] p-5">
                                    <div className="mb-2 flex justify-between text-xs text-[#68645b]">
                                        <span>Total de unidades</span>
                                        <span>
                                            {quantidadeTotalMovimentacao} un.
                                        </span>
                                    </div>

                                    <div className="mb-4 flex items-center justify-between gap-2">
                                        <span className="text-sm font-medium text-[#45433d]">
                                            Valor dos produtos
                                        </span>
                                        <span className="text-lg font-semibold text-[#89670d]">
                                            {moeda(valorTotalMovimentacao)}
                                        </span>
                                    </div>

                                    {mensagem && (
                                        <p className="mb-3 rounded-md border border-[#e6c8c3] bg-[#fdf0ed] p-3 text-xs leading-5 text-[#b34b40]">
                                            {mensagem}
                                        </p>
                                    )}

                                    <button
                                        onClick={registrarMovimentacao}
                                        disabled={itensMovimentacao.length === 0}
                                        className={`w-full rounded-md px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                            movimentacao.tipo === "entrada"
                                                ? "bg-[#98700a] hover:bg-[#806009]"
                                                : "bg-[#b34b40] hover:bg-[#963b32]"
                                        }`}
                                    >
                                        {movimentacao.tipo === "entrada"
                                            ? "Confirmar entrada"
                                            : "Confirmar saída"}
                                    </button>

                                    <button
                                        onClick={fecharMovimentacao}
                                        className="mt-2 w-full rounded-md border border-[#e3dcc9] px-4 py-2.5 text-sm text-[#68645b] transition hover:bg-[#f5f1e7]"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de detalhes do produto */}
            {produtoDetalhes && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#35342f]/40 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setProdutoDetalhes(null);
                        }
                    }}
                >
                    <div className="w-full max-w-md rounded-lg border border-[#e3dcc9] bg-[#fffefa] p-6 shadow-2xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg text-[#89670d]">
                                Detalhes do Produto
                            </h2>

                            <button
                                onClick={() => setProdutoDetalhes(null)}
                                aria-label="Fechar detalhes"
                                className="text-[#918d83] transition hover:text-[#45433d]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-5 flex items-center gap-4 rounded-md border border-[#e6dfcd] bg-[#faf9f5] p-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-[#e6dfcd] bg-[#f5f1e7]">
                                <Package
                                    size={28}
                                    className="text-[#98700a]"
                                />
                            </div>

                            <div>
                                <p className="font-semibold text-[#45433d]">
                                    {produtoDetalhes.nome}
                                </p>
                                <p className="mt-1 text-sm text-[#918d83]">
                                    {produtoDetalhes.categoria}
                                </p>
                                <span
                                    className={`mt-2 inline-block rounded-full border px-2.5 py-1 text-xs ${classeStatus(obterStatus(produtoDetalhes))}`}
                                >
                                    {obterStatus(produtoDetalhes)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#68645b]">
                                    Código
                                </span>
                                <span className="font-medium text-[#45433d]">
                                    #{produtoDetalhes.id}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-[#68645b]">
                                    Estoque atual
                                </span>
                                <span className="font-medium text-[#45433d]">
                                    {produtoDetalhes.quantidade} unidades
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-[#68645b]">
                                    Estoque mínimo
                                </span>
                                <span className="font-medium text-[#45433d]">
                                    {produtoDetalhes.minimo} unidades
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-[#68645b]">
                                    Valor unitário
                                </span>
                                <span className="font-semibold text-[#89670d]">
                                    {moeda(produtoDetalhes.preco)}
                                </span>
                            </div>

                            <div className="flex justify-between border-t border-[#e6dfcd] pt-3 text-sm">
                                <span className="text-[#68645b]">
                                    Valor total em estoque
                                </span>
                                <span className="font-semibold text-[#89670d]">
                                    {moeda(
                                        produtoDetalhes.quantidade *
                                        produtoDetalhes.preco
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                            <button
                                onClick={() => setProdutoDetalhes(null)}
                                className={botaoSecundario}
                            >
                                Fechar
                            </button>

                            <button
                                onClick={() => {
                                    const produto = produtos.find(
                                        (p) => p.id === produtoDetalhes.id
                                    );

                                    setProdutoDetalhes(null);
                                    abrirMovimentacao("entrada", produto);
                                }}
                                className="flex items-center gap-2 rounded-md bg-[#98700a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#806009]"
                            >
                                <ArrowDownToLine size={16} />
                                Registrar entrada
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Estoque;