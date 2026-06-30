import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import API_URL from "./api";

function MainContent({Logado, setLogado, setModalLoginAberto, fornoSelecionado, setFornoSelecionado, admin}) {


    const [quentura, setQuentura] = useState([]);
    const [tempo, setTempo] = useState([]);
    const [sessoes, setSessoes] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {

          if (!fornoSelecionado) return;

         const fornoId = fornoSelecionado.id;

         const controller = new AbortController();
        const signal = controller.signal;

           setQuentura([]);
            setTempo([]);
            setSessoes([]);
            setEventos([]);
            setDashboard(null);

        let estaAtivo = true;
        let timerId;

        const buscarDados = async () => {
            
            if(!estaAtivo) return;

            try {
                const token = localStorage.getItem("token");
                

            const resposta = await fetch(`${API_URL}/v1/telemetrias/forno/${fornoId}/dashboard`,{method: "GET",headers: {"Content-Type": "application/json","Authorization": "Bearer " + token}, signal});
            if (!resposta.ok) return;
            const dashboard = await resposta.json();
            if (!estaAtivo) return;
            setDashboard(dashboard);

            const [dadoTemperatura, dadoTemporizador, dadoSessoes, dadoEventos] = await Promise.all([
                fetch(`${API_URL}/v1/temperaturas/fornos/${fornoId}`, {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token}, signal}),
                fetch(`${API_URL}/v1/temporizadores/fornos/${fornoId}`, {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token}, signal}),
                fetch(`${API_URL}/v1/sessoes/fornos/${fornoId}`, {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token}, signal}),
                fetch(`${API_URL}/v1/eventos/fornos/${fornoId}`, {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token}, signal })
            ]);
            

            if (dadoTemperatura.status === 401) {

                localStorage.removeItem("id");
                localStorage.removeItem("token");

                setLogado(false);
                setModalLoginAberto(true);

                clearTimeout(timerId);
                return;
            }

            if (!dadoTemperatura.ok || !dadoTemporizador.ok || !dadoSessoes.ok || !dadoEventos.ok) {
   
            throw new Error("Uma ou mais rotas falharam ao retornar os dados.");
            }

            const [temperaturaJson, temporizadorJson, sessoesJson, eventosJson] = await Promise.all([
                dadoTemperatura.json(),
                dadoTemporizador.json(),
                dadoSessoes.json(),
                dadoEventos.json()
            ]);

            if (estaAtivo){
                setQuentura(temperaturaJson);
                setTempo(temporizadorJson);
                setSessoes(sessoesJson);
                setEventos(eventosJson);
            }

            if (estaAtivo) {
                timerId = setTimeout(buscarDados,5000);
            }

        } catch(erro) {
            if (erro.name === "AbortError") {
                return;
            }

            console.log("Mensagem de erro:", erro.message);

            if (estaAtivo) {
                timerId = setTimeout(buscarDados, 5000);
             }
        }

        };

        buscarDados();

        return () => {estaAtivo = false; clearTimeout(timerId); controller.abort(); }

        }, [fornoSelecionado]);

        const formatarTemporizador = (dataIso) => {
            if (!dataIso || !dataIso.includes("T")) {
                return dataIso;
            }

            try {
                const dataFimObj = new Date(dataIso);
                const agora = new Date();

                const opcoesHora = { hour: "2-digit", minute: "2-digit" };
                const opcoesData = { day: "2-digit", month: "2-digit", year: "numeric" };

                const horaInicio = agora.toLocaleTimeString("pt-BR", opcoesHora);
                const horaFim = dataFimObj.toLocaleTimeString("pt-BR", opcoesHora);
                const diaFim = dataFimObj.toLocaleDateString("pt-BR", opcoesData);

                return `${horaInicio} às ${horaFim} - ${diaFim}`;
            } catch (e) {
                console.error("Erro ao formatar data: ", e);
                return dataIso;
            }
        };


    if (!Logado || fornoSelecionado === null || admin) return null;
    

    return(
        <main>
            
        <div id="aviso-auth" hidden>
            <p>Faça login ou crie uma conta para continuar.</p>
            <button id="aviso-btn-login">Entrar</button>
            <button id="aviso-btn-cadastro">Criar Conta</button>
        </div>

        <div id="secoes-protegidas">

            <i className="bi bi-arrow-left-right" id="trocar-forno"  onClick={() => setFornoSelecionado(null)}></i>

            <section id="dashboard" aria-labelledby="titulo-dashboard">    
                <h2 id="titulo-dashboard">Dashboard - {fornoSelecionado.nome}</h2>
                <p>status do sistema</p>
            </section>

            <section id="temperatura" aria-labelledby="titulo-temperatura">
                <h2 id="titulo-temperatura">Temperatura</h2>
                <p>{quentura.length > 0 ? quentura[quentura.length - 1].temperaturaAtual : "Sem dados atualmente"}</p>
            </section>

            <section id="temporizador" aria-labelledby="titulo-temporizador">
                <h2 id="titulo-temporizador">Temporizador</h2>
                <p>{tempo.length > 0 ? formatarTemporizador(tempo[tempo.length - 1].horarioFim) : "Sem dados atualmente"}</p>
            </section>

            <section id="alertas" aria-labelledby="titulo-alertas">
                <h2 id="titulo-alertas">Alertas</h2>
                <p>{eventos.length > 0 ? eventos[eventos.length - 1].tipo : "Sem dados atualmente"}</p>
            </section>

            <section id="Registros" aria-labelledby="titulo-registros">
                <h2 id="titulo-registros">Registros</h2>
                <p>{sessoes.length > 0 ? sessoes[sessoes.length - 1].estadoSistema : "Sem dados atualmente"}</p>
            </section>

            <section id="graficos" aria-labelledby="titulo-graficos">
                <h2 id="titulo-graficos">Gráficos</h2>
                <p>Gráficos</p>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart width={500} height={300} data={quentura}>
                <XAxis dataKey="registradoEm" tickFormatter={(valor) => new Date(valor).toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit"})} />
                <YAxis />
                <Tooltip 
                        labelFormatter={(valor) => new Date(valor).toLocaleString("pt-BR", {
                        day: "2-digit", month: "2-digit", year: "numeric", 
                        hour: "2-digit", minute: "2-digit"
                    })}
                />
                <Line dataKey="temperaturaAtual" stroke="var(--cor-destaque)"/>
                </LineChart>
            </ResponsiveContainer>

            </section>

        </div>

    </main>
    )

}

export default MainContent