import { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import API_URL from "./api";

function MainContent({
    Logado,
    setLogado,
    setModalLoginAberto,
    fornoSelecionado,
    setFornoSelecionado,
    admin
}) {
    const [temperaturas, setTemperaturas] = useState([]);
    const [temporizadores, setTemporizadores] = useState([]);
    const [sessoes, setSessoes] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [dashboard, setDashboard] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!fornoSelecionado?.id) return undefined;

        const fornoId = fornoSelecionado.id;
        const controller = new AbortController();
        let timerId;
        let desmontado = false;

        setTemperaturas([]);
        setTemporizadores([]);
        setSessoes([]);
        setEventos([]);
        setDashboard(null);
        setCarregando(true);
        setErro("");

        const headers = () => ({
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        });

        const buscarJson = async (url) => {
            const resposta = await fetch(url, {
                method: "GET",
                headers: headers(),
                signal: controller.signal
            });

            if (resposta.status === 401) {
                throw new Error("Não autorizado");
            }
            if (!resposta.ok) {
                throw new Error(`Falha ao consultar ${url.replace(API_URL, "")}`);
            }
            return resposta.json();
        };

        const buscarDados = async () => {
            try {
                // O dashboard é a fonte do estado e da temperatura atuais.
                const dashboardData = await buscarJson(
                    `${API_URL}/telemetrias/forno/${fornoId}/dashboard`
                );

                // Essas rotas retornam dados independentes; uma falha em uma delas
                // não deve impedir a atualização do estado atual do forno.
                const [temporizadorResult, sessoesResult, eventosResult] = await Promise.allSettled([
                    buscarJson(`${API_URL}/temporizadores/fornos/${fornoId}`),
                    buscarJson(`${API_URL}/sessoes/fornos/${fornoId}`),
                    buscarJson(`${API_URL}/eventos/fornos/${fornoId}`)
                ]);

                const temporizadoresData = temporizadorResult.status === "fulfilled"
                    ? temporizadorResult.value
                    : [];
                const sessoesData = sessoesResult.status === "fulfilled"
                    ? sessoesResult.value
                    : [];
                const eventosData = eventosResult.status === "fulfilled"
                    ? eventosResult.value
                    : [];

                const sessoesOrdenadas = (Array.isArray(sessoesData) ? sessoesData : [])
                    .slice()
                    .sort((a, b) => new Date(b.inicioSessao) - new Date(a.inicioSessao));

                // A rota de sessões retorna resumos: não contém temperaturas/eventos.
                // Buscamos as temperaturas pela rota específica da sessão aberta.
                const sessaoAtual = sessoesOrdenadas.find(
                    (sessao) => sessao.fimSessao == null
                ) ?? null;

                let temperaturasData = [];
                if (sessaoAtual?.id) {
                    try {
                        const dados = await buscarJson(
                            `${API_URL}/temperaturas/sessoes/${sessaoAtual.id}/temperaturas`
                        );
                        temperaturasData = Array.isArray(dados) ? dados : [];
                    } catch (temperaturaErro) {
                        if (temperaturaErro.name === "AbortError") throw temperaturaErro;
                        console.error("Erro ao carregar temperaturas da sessão:", temperaturaErro.message);
                    }
                }

                const temperaturasOrdenadas = temperaturasData
                    .slice()
                    .sort((a, b) => new Date(a.registradoEm) - new Date(b.registradoEm));

                const temporizadoresOrdenados = (Array.isArray(temporizadoresData) ? temporizadoresData : [])
                    .slice()
                    .sort((a, b) => new Date(b.horarioFim ?? b.horarioInicio) - new Date(a.horarioFim ?? a.horarioInicio));

                const eventosOrdenados = (Array.isArray(eventosData) ? eventosData : [])
                    .slice()
                    .sort((a, b) => new Date(a.registradoEm) - new Date(b.registradoEm));

                if (desmontado) return;
                setDashboard(dashboardData);
                setTemperaturas(temperaturasOrdenadas);
                setTemporizadores(temporizadoresOrdenados);
                setSessoes(sessoesOrdenadas);
                setEventos(eventosOrdenados);
                setErro("");

                const falhas = [temporizadorResult, sessoesResult, eventosResult]
                    .filter((resultado) => resultado.status === "rejected");
                if (falhas.length > 0) {
                    console.warn("Algumas informações auxiliares não puderam ser carregadas.");
                }
            } catch (e) {
                if (e.name !== "AbortError") {
                    console.error("Erro ao carregar dashboard:", e.message);
                    if (e.message === "Não autorizado") {
                        localStorage.removeItem("id");
                        localStorage.removeItem("token");
                        setLogado(false);
                        setModalLoginAberto(true);
                        return;
                    }
                    if (!desmontado) setErro("Não foi possível atualizar os dados. Tentando novamente...");
                }
            } finally {
                if (!desmontado) {
                    setCarregando(false);
                    timerId = setTimeout(buscarDados, 3000);
                }
            }
        };

        buscarDados();

        return () => {
            desmontado = true;
            clearTimeout(timerId);
            controller.abort();
        };
    }, [fornoSelecionado, setLogado, setModalLoginAberto]);

    if (!Logado || !fornoSelecionado || admin) return null;

    const estadoForno = dashboard?.estadoForno ?? "";
    const estadoSistema = dashboard?.estadoSistema ?? "";
    const fornoLigado = Boolean(estadoForno && estadoForno !== "FORNO_DESLIGADO");
    const temperaturaAtual = dashboard?.temperaturaAtual;
    const agora = Date.now();
    const ultimoTemporizador = temporizadores.find((temporizador) => {
        const fim = temporizador.horarioFim ? new Date(temporizador.horarioFim).getTime() : NaN;
        return temporizador.executado !== true && Number.isFinite(fim) && fim > agora;
    }) ?? null;
    const ultimoEvento = eventos[eventos.length - 1] ?? null;
    const sessaoAtual = sessoes.find((sessao) => sessao.fimSessao == null) ?? null;

    const formatarEstadoForno = (estado) => {
        const estados = {
            FORNO_DESLIGADO: "Forno desligado",
            FORNO_AQUECENDO: "Forno aquecendo",
            FORNO_ATIVO: "Forno ativo",
            FORNO_ESFRIANDO: "Forno esfriando"
        };
        return estados[estado] ?? estado ?? "Status indisponível";
    };

    const formatarAlerta = (tipo) => {
        if (!tipo || tipo === "NENHUM") return "-";
        const mensagensEventos = {
            ALERTA_ENTRADA: "O sistema entrou em estado de alerta",
            ALERTA_SAIDA: "O estado alerta durou X segundos",
            CRITICO_ENTRADA: "O sistema entrou em estado crítico",
            CRITICO_SAIDA: "O estado crítico durou X segundos",
            ERRO_SENSOR_ENTRADA: "Entrada no estado de erro de sensor",
            ERRO_SENSOR_SAIDA: "Saída do estado de erro de sensor"
        };
        return mensagensEventos[tipo] ?? "-";
    };

    const formatarData = (valor) => {
        if (!valor) return "Sem dados atualmente";
        const data = new Date(valor);
        return Number.isNaN(data.getTime()) ? String(valor) : data.toLocaleString("pt-BR");
    };

    const temperaturaFormatada = fornoLigado && temperaturaAtual !== null && temperaturaAtual !== undefined && Number.isFinite(Number(temperaturaAtual))
        ? `${Number(temperaturaAtual).toFixed(1)} °C`
        : "-";

    const temporizadorFormatado = !fornoLigado
        ? "-"
        : ultimoTemporizador
            ? `${formatarData(ultimoTemporizador.horarioInicio)} — ${formatarData(ultimoTemporizador.horarioFim)}`
            : "-";

    return (
        <main>
            <div id="secoes-protegidas">
                <i
                    className="bi bi-arrow-left-right"
                    id="trocar-forno"
                    role="button"
                    tabIndex={0}
                    aria-label="Trocar forno"
                    onClick={() => setFornoSelecionado(null)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setFornoSelecionado(null);
                    }}
                />

                <section id="dashboard" aria-labelledby="titulo-dashboard">
                    <h2 id="titulo-dashboard">Dashboard - {fornoSelecionado.nome}</h2>
                    <p>{carregando ? "Carregando status..." : formatarEstadoForno(estadoForno)}</p>
                    {erro && <p role="status">{erro}</p>}
                    <small>Atualizado em: {fornoLigado && dashboard?.atualizadoEm ? formatarData(dashboard.atualizadoEm) : "-"}</small>
                </section>

                <section id="temperatura" aria-labelledby="titulo-temperatura">
                    <h2 id="titulo-temperatura">Temperatura</h2>
                    <p>{carregando ? "Carregando..." : temperaturaFormatada}</p>
                </section>

                {(!fornoLigado || ultimoTemporizador) && (
                    <section id="temporizador" aria-labelledby="titulo-temporizador">
                        <h2 id="titulo-temporizador">Temporizador</h2>
                        <p>{carregando ? "Carregando..." : temporizadorFormatado}</p>
                    </section>
                )}

                <section id="alertas" aria-labelledby="titulo-alertas">
                    <h2 id="titulo-alertas">Alertas</h2>
                    <p>{carregando ? "Carregando..." : fornoLigado ? formatarAlerta(ultimoEvento?.tipo ?? dashboard?.ultimoEvento) : "-"}</p>
                </section>

                <section id="estado" aria-labelledby="titulo-estado">
                    <h2 id="titulo-estado">Estado</h2>
                    <p>{carregando ? "Carregando..." : fornoLigado ? (estadoSistema || "-") : "-"}</p>
                </section>

                <section id="graficos" aria-labelledby="titulo-graficos">
                    <h2 id="titulo-graficos">Gráficos</h2>
                    {carregando ? (
                        <p>Carregando gráfico...</p>
                    ) : !fornoLigado ? (
                        <p>-</p>
                    ) : temperaturas.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={temperaturas}>
                                <XAxis
                                    dataKey="registradoEm"
                                    tickFormatter={(valor) => valor
                                        ? new Date(valor).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                                        : ""}
                                />
                                <YAxis />
                                <Tooltip
                                    formatter={(valor) => [`${Number(valor).toFixed(1)} °C`, "Temperatura"]}
                                    labelFormatter={(label) => formatarData(label)}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="temperaturaAtual"
                                    stroke="var(--cor-destaque)"
                                    isAnimationActive={false}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p>{fornoLigado
                            ? "Ainda não há leituras salvas para esta sessão."
                            : "Não há dados de temperatura salvos para exibir."}</p>
                    )}
                </section>
            </div>
        </main>
    );
}

export default MainContent;
