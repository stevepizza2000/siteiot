import { useState, useEffect, useRef } from "react";
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer} from "recharts";
import API_URL, { fetchAutenticado } from "./api"

const LIMITE_DADO_VELHO_MS = 60 * 1000;
const INTERVALO_RAPIDO_MS = 3000;
const INTERVALO_LENTO_MS = 30000;

const ESTADOS_FORNO = {
    FORNO_DESLIGADO: "Forno desligado",
    FORNO_AQUECENDO: "Forno aquecendo",
    FORNO_ATIVO: "Forno ativo",
    FORNO_ESFRIANDO: "Forno esfriando"
};

const ALERTAS_SISTEMA = {
    NENHUM: "Sem alertas no momento",
    ALERTA_ENTRADA: "O sistema entrou em alerta",
    ALERTA_SAIDA: "Sistema normalizado (Alerta)",
    CRITICO_ENTRADA: "Alerta Crítico: Verifique a temperatura",
    CRITICO_SAIDA: "Sistema normalizado (Crítico)",
    ERRO_SENSOR_ENTRADA: "Erro no sensor de temperatura",
    ERRO_SENSOR_SAIDA: "Sensor normalizado"
};

const formatarEstadoForno = (estado) => {
    return ESTADOS_FORNO[estado] ?? estado ?? "Status indisponível";
};

const formatarAlerta = (tipo) => {
    if (!tipo) return "Sem alertas no momento";
    return ALERTAS_SISTEMA[tipo] ?? "Evento registrado";
};

const formatarData = (valor) => {
    if (!valor) return "Sem dados atualmente";
    const data = new Date(valor);
    return Number.isNaN(data.getTime()) ? String(valor) : data.toLocaleString("pt-BR");
};

function MainContent({Logado, setLogado, setModalLoginAberto, fornoSelecionado, setFornoSelecionado, admin, sair}) {
    const [temperaturas, setTemperaturas] = useState([]);
    const [temporizadores, setTemporizadores] = useState([]);
    const [sessoes, setSessoes] = useState([]);
    const [dashboard, setDashboard] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");


    const sessaoAtualIdRef = useRef(null);

    useEffect(() => {
        if (!fornoSelecionado?.id) return undefined;

        const fornoId = fornoSelecionado.id;
        const controller = new AbortController();
        let desmontado = false;

        sessaoAtualIdRef.current = null;
        setTemperaturas([]);
        setTemporizadores([]);
        setSessoes([]);
        setDashboard(null);
        setCarregando(true);
        setErro("");

        const buscarJson = async (url) => {
            const resposta = await fetchAutenticado(url, {
                method: "GET",
                signal: controller.signal
            }, sair);

            if (resposta.status === 401) {
                throw new Error("Não autorizado");
            }
            if (!resposta.ok) {
                const erro = new Error(`Falha ao consultar ${url.replace(API_URL, "")}`);
                erro.status = resposta.status;
                throw erro;
            }
            return resposta.json();
        };

        const agendar = (fn, intervalo) => {
            let timer;
            const ciclo = async () => {
                if (!document.hidden) await fn();
                if (!desmontado) timer = setTimeout(ciclo, intervalo);
            };
            ciclo();
            return () => clearTimeout(timer);
        };

        const buscarRapidos = async () => {
            try {
                const dashboardData = await buscarJson(`${API_URL}/telemetrias/forno/${fornoId}/dashboard`);

                let temperaturasData = [];
                const sessaoId = sessaoAtualIdRef.current;
                if (sessaoId) {
                    try {
                        const dados = await buscarJson(`${API_URL}/temperaturas/sessoes/${sessaoId}/temperaturas`);
                        temperaturasData = Array.isArray(dados) ? dados : [];
                    } catch (temperaturaErro) {
                        if (temperaturaErro.name === "AbortError") throw temperaturaErro;
                        console.error("Erro ao carregar temperaturas da sessão:", temperaturaErro.message);
                    }
                }

                const temperaturasOrdenadas = temperaturasData
                    .slice()
                    .sort((a, b) => new Date(a.registradoEm) - new Date(b.registradoEm));

                if (desmontado) return;
                setDashboard(dashboardData);
                setTemperaturas(temperaturasOrdenadas);
                setErro("");
            } catch (e) {
                if (e.name === "AbortError") return;
                console.error("Erro ao carregar dashboard:", e.message);
                if (e.message === "Não autorizado") {
                    desmontado = true;
                    sair();
                    return;
                }
                if (!desmontado) setErro("Não foi possível atualizar os dados. Tentando novamente...");
            } finally {
                if (!desmontado) setCarregando(false);
            }
        };

        const buscarLentos = async () => {
            const [temporizadorResult, sessoesResult] = await Promise.allSettled([
                buscarJson(`${API_URL}/temporizadores/fornos/${fornoId}`),
                buscarJson(`${API_URL}/sessoes/fornos/${fornoId}`)
            ]);

            if (desmontado) return;

            if (temporizadorResult.status === "fulfilled") {
                const lista = Array.isArray(temporizadorResult.value) ? temporizadorResult.value : [];
                setTemporizadores(
                    lista.slice().sort((a, b) =>
                        new Date(b.horarioFim ?? b.horarioInicio) - new Date(a.horarioFim ?? a.horarioInicio))
                );
            }

            if (sessoesResult.status === "fulfilled") {
                const lista = Array.isArray(sessoesResult.value) ? sessoesResult.value : [];
                const ordenadas = lista
                    .slice()
                    .sort((a, b) => new Date(b.inicioSessao) - new Date(a.inicioSessao));

                sessaoAtualIdRef.current = ordenadas.find((s) => s.fimSessao == null)?.id ?? null;
                setSessoes(ordenadas);
            }
        };

        const pararLento = agendar(buscarLentos, INTERVALO_LENTO_MS);
        const pararRapido = agendar(buscarRapidos, INTERVALO_RAPIDO_MS);

        return () => {
            desmontado = true;
            pararRapido();
            pararLento();
            controller.abort();
        };
    }, [fornoSelecionado]);

    if (!Logado || !fornoSelecionado || admin) return null;

    const agora = Date.now();
    const estadoForno = dashboard?.estadoForno ?? "";
    const estadoSistema = dashboard?.estadoSistema ?? "";
    const temperaturaAtual = dashboard?.temperaturaAtual;
    const estadoLigado = Boolean(estadoForno && estadoForno !== "FORNO_DESLIGADO");
    const atualizadoEmMs = dashboard?.atualizadoEm
        ? new Date(dashboard.atualizadoEm).getTime()
        : NaN;
    const dadoAtualizado =
        Number.isFinite(atualizadoEmMs) &&
        (agora - atualizadoEmMs) <= LIMITE_DADO_VELHO_MS;

    const fornoLigado = estadoLigado && dadoAtualizado;
    const semSinal = estadoLigado && !dadoAtualizado && !carregando;

    const ultimoTemporizador = temporizadores.find((temporizador) => {
        const fim = temporizador.horarioFim ? new Date(temporizador.horarioFim).getTime() : NaN;
        return temporizador.executado !== true && Number.isFinite(fim) && fim > agora;
    }) ?? null;

    const sessaoAtual = sessoes.find((sessao) => sessao.fimSessao == null) ?? null;

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
                    <p>{carregando ? "Carregando status..." : semSinal ? "Forno sem comunicação" : formatarEstadoForno(estadoForno)}</p>
                    {erro && <p role="status">{erro}</p>}
                    <small>Atualizado em: {(fornoLigado || semSinal) && dashboard?.atualizadoEm ? formatarData(dashboard.atualizadoEm) : "-"}</small>
                </section>

                <section id="temperatura" aria-labelledby="titulo-temperatura">
                    <h2 id="titulo-temperatura">Temperatura</h2>
                    <p>{carregando ? "Carregando..." : temperaturaFormatada}</p>
                </section>

                <section id="temporizador" aria-labelledby="titulo-temporizador">
                    <h2 id="titulo-temporizador">Temporizador</h2>
                    <p>{carregando ? "Carregando..." : temporizadorFormatado}</p>
                </section>

                <section id="alertas" aria-labelledby="titulo-alertas">
                    <h2 id="titulo-alertas">Alertas</h2>
                    <p>{carregando ? "Carregando..." : fornoLigado ? formatarAlerta(dashboard?.ultimoEvento) : "-"}</p>
                </section>

                <section id="Registros" aria-labelledby="titulo-registros">
                    <h2 id="titulo-registros">Registros</h2>
                    <p>{carregando ? "Carregando..." : fornoLigado ? (estadoSistema || "-") : "-"}</p>
                    <p>Sessão de uso: {carregando ? "Carregando..." : fornoLigado ? (sessaoAtual ? "Em andamento" : "Nenhuma sessão ativa") : "-"}</p>
                </section>

                <section id="graficos" aria-labelledby="titulo-graficos">
                    <h2 id="titulo-graficos">Gráficos</h2>
                    {carregando ? (<p>Carregando gráfico...</p>) : !fornoLigado ? (<p>-</p>) : temperaturas.length > 0 ? (
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