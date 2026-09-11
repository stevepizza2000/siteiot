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
    const [quentura, setQuentura] = useState([]);
    const [tempo, setTempo] = useState([]);
    const [sessoes, setSessoes] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [dashboard, setDashboard] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        if (!fornoSelecionado) return;

        const fornoId = fornoSelecionado.id;
        const controller = new AbortController();
        let timerId;

        setQuentura([]);
        setTempo([]);
        setSessoes([]);
        setEventos([]);
        setDashboard(null);
        setCarregando(true);

        const buscarDados = async () => {
            try {
                const token = localStorage.getItem("token");

                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                };

                // Dashboard
                const respostaDashboard = await fetch(
                    `${API_URL}/telemetrias/forno/${fornoId}/dashboard`,
                    {
                        method: "GET",
                        headers,
                        signal: controller.signal
                    }
                );

                if (respostaDashboard.status === 401) {
                    localStorage.removeItem("id");
                    localStorage.removeItem("token");
                    setLogado(false);
                    setModalLoginAberto(true);
                    return;
                }

                if (!respostaDashboard.ok) {
                    throw new Error("Falha ao carregar o dashboard.");
                }

                const dashboardData = await respostaDashboard.json();

                // Buscar somente:
                // - temporizadores
                // - sessões
                //
                // Temperaturas e eventos serão retirados da sessão atual.
                const [dadoTemporizador, dadoSessoes] = await Promise.all([
                    fetch(`${API_URL}/temporizadores/fornos/${fornoId}`, {
                        method: "GET",
                        headers,
                        signal: controller.signal
                    }),

                    fetch(`${API_URL}/sessoes/fornos/${fornoId}`, {
                        method: "GET",
                        headers,
                        signal: controller.signal
                    })
                ]);

                if (dadoTemporizador.status === 401 || dadoSessoes.status === 401) {
                    localStorage.removeItem("id");
                    localStorage.removeItem("token");
                    setLogado(false);
                    setModalLoginAberto(true);
                    return;
                }

                if (!dadoTemporizador.ok || !dadoSessoes.ok) {
                    throw new Error(
                        "Uma ou mais rotas falharam ao retornar os dados."
                    );
                }

                const [temporizadorJson, sessoesJson] = await Promise.all([
                    dadoTemporizador.json(),
                    dadoSessoes.json()
                ]);

                /*
                 * A API retorna cada sessão com:
                 * - id
                 * - inicioSessao
                 * - fimSessao
                 * - temperaturas
                 * - eventos
                 *
                 * Então pegamos a sessão que ainda está aberta.
                 */
                const sessaoAtual =
                    sessoesJson
                        .filter((sessao) => sessao.fimSessao === null)
                        .sort(
                            (a, b) =>
                                new Date(b.inicioSessao) -
                                new Date(a.inicioSessao)
                        )[0] ?? null;

                const temperaturasSessaoAtual =
                    sessaoAtual?.temperaturas ?? [];

                const eventosSessaoAtual =
                    sessaoAtual?.eventos ?? [];

                setDashboard(dashboardData);

                setQuentura(temperaturasSessaoAtual);
                setTempo(temporizadorJson);
                setSessoes(sessoesJson);
                setEventos(eventosSessaoAtual);

            } catch (erro) {
                if (erro.name !== "AbortError") {
                    console.error(
                        "Erro ao carregar dashboard:",
                        erro.message
                    );
                }
            } finally {
                setCarregando(false);

                if (!controller.signal.aborted) {
                    timerId = setTimeout(buscarDados, 5000);
                }
            }
        };

        buscarDados();

        return () => {
            clearTimeout(timerId);
            controller.abort();
        };
    }, [
        fornoSelecionado,
        setLogado,
        setModalLoginAberto
    ]);

    if (!Logado || fornoSelecionado === null || admin) {
        return null;
    }

    // Última temperatura da sessão atual
    const ultimaTemp = quentura.at(-1)?.temperaturaAtual;

    // Último horário do temporizador
    const ultimoTempo = tempo.at(-1)?.horarioFim;

    // Último evento da sessão atual
    const ultimoEvento = eventos.at(-1)?.tipo;

    // Última sessão
    const ultimaSessao = sessoes.at(-1);

    /*
     * Formata o nome dos alertas para não mostrar
     * diretamente o enum vindo da API.
     */
    const formatarAlerta = (tipo) => {
        if (!tipo) {
            return "Sem alertas no momento";
        }

        const alertas = {
            ALERTA_ENTRADA: "Alerta de entrada",
            ALERTA_TEMPERATURA: "Alerta de temperatura",
            ALERTA_SISTEMA: "Alerta do sistema"
        };

        return alertas[tipo] ?? tipo;
    };

    /*
     * Temperatura sem casas decimais.
     *
     * Exemplo:
     * 180.73 -> 181
     * 180.21 -> 180
     */
    const temperaturaFormatada =
        ultimaTemp !== undefined
            ? `${Math.round(Number(ultimaTemp))} °C`
            : "Sem dados atualmente";

    return (
        <main>
            <div id="secoes-protegidas">

                <i
                    className="bi bi-arrow-left-right"
                    id="trocar-forno"
                    onClick={() => setFornoSelecionado(null)}
                ></i>

                {/* DASHBOARD */}
                <section
                    id="dashboard"
                    aria-labelledby="titulo-dashboard"
                >
                    <h2 id="titulo-dashboard">
                        Dashboard - {fornoSelecionado.nome}
                    </h2>

                    <p>
                        {carregando
                            ? "Carregando status..."
                            : dashboard?.status ?? "Status indisponível"}
                    </p>
                </section>

                {/* TEMPERATURA */}
                <section
                    id="temperatura"
                    aria-labelledby="titulo-temperatura"
                >
                    <h2 id="titulo-temperatura">
                        Temperatura
                    </h2>

                    <p>
                        {carregando
                            ? "Carregando..."
                            : temperaturaFormatada}
                    </p>
                </section>

                {/* TEMPORIZADOR */}
                <section
                    id="temporizador"
                    aria-labelledby="titulo-temporizador"
                >
                    <h2 id="titulo-temporizador">
                        Temporizador
                    </h2>

                    <p>
                        {carregando
                            ? "Carregando..."
                            : ultimoTempo ?? "Sem dados atualmente"}
                    </p>
                </section>

                {/* ALERTAS */}
                <section
                    id="alertas"
                    aria-labelledby="titulo-alertas"
                >
                    <h2 id="titulo-alertas">
                        Alertas
                    </h2>

                    <p>
                        {carregando
                            ? "Carregando..."
                            : formatarAlerta(ultimoEvento)}
                    </p>
                </section>

                {/* REGISTROS */}
                <section
                    id="Registros"
                    aria-labelledby="titulo-registros"
                >
                    <h2 id="titulo-registros">
                        Registros
                    </h2>

                    <p>
                        {carregando
                            ? "Carregando..."
                            : ultimaSessao?.estadoSistemaAtual ??
                              ultimaSessao?.estadoSistemaFinal ??
                              "Sem dados atualmente"}
                    </p>
                </section>

                {/* GRÁFICO */}
                <section
                    id="graficos"
                    aria-labelledby="titulo-graficos"
                >
                    <h2 id="titulo-graficos">
                        Gráficos
                    </h2>

                    {carregando ? (
                        <p>
                            Carregando gráfico...
                        </p>
                    ) : quentura.length > 0 ? (

                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <LineChart data={quentura}>

                                <XAxis
                                    dataKey="registradoEm"
                                    tickFormatter={(valor) =>
                                        valor
                                            ? new Date(
                                                  valor
                                              ).toLocaleTimeString(
                                                  "pt-BR",
                                                  {
                                                      hour: "2-digit",
                                                      minute: "2-digit"
                                                  }
                                              )
                                            : ""
                                    }
                                />

                                <YAxis />

                                <Tooltip
                                    formatter={(valor) => [
                                        `${Math.round(
                                            Number(valor)
                                        )} °C`,
                                        "Temperatura"
                                    ]}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="temperaturaAtual"
                                    stroke="var(--cor-destaque)"
                                />

                            </LineChart>
                        </ResponsiveContainer>

                    ) : (
                        <p>
                            Nenhum dado de temperatura disponível
                            para o gráfico.
                        </p>
                    )}
                </section>

            </div>
        </main>
    );
}

export default MainContent;