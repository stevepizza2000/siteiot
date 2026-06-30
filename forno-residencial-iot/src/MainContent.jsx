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

        let estaAtivo = true;
        let timerId;

        const buscarDados = async () => {
            
            if(!estaAtivo) return;

            try {
                const token = localStorage.getItem("token");
                
                if (fornoSelecionado === null) return;

                const fornoId = fornoSelecionado.id;

            const resposta = await fetch(`${API_URL}/v1/telemetrias/forno/${fornoId}/dashboard`,{method: "GET",headers: {"Content-Type": "application/json","Authorization": "Bearer " + token}});
            if (!resposta.ok) return;
            const dashboard = await resposta.json();
            setDashboard(dashboard);

            const [dadoTemperatura, dadoTemporizador, dadoSessoes, dadoEventos] = await Promise.all([
                fetch(`${API_URL}/v1/temperaturas/fornos/${fornoId}`, {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token} }),
                fetch(`${API_URL}/v1/temporizadores/fornos/${fornoId}`, {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token} }),
                fetch(`${API_URL}/v1/sessoes/fornos/${fornoId}`, {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token} }),
                fetch(`${API_URL}/v1/eventos/fornos/${fornoId}`, {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token} })
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
            console.log("Mensagem de erro: ", erro.message);

            if (estaAtivo) {
                timerId = setTimeout(buscarDados, 5000)
            }
        }

        };

        buscarDados();

         return () => {estaAtivo = false; clearTimeout(timerId)}

        }, [fornoSelecionado]);


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
                <p>{tempo.length > 0 ? tempo[tempo.length - 1].horarioFim : "Sem dados atualmente"}</p>
            </section>

            <section id="alertas" aria-labelledby="titulo-alertas">
                <h2 id="titulo-alertas">Alertas</h2>
                <p>{eventos.length > 0 ? eventos[eventos.length - 1].tipo : "Sem dados atualmente"}</p>
            </section>

            <section id="graficos" aria-labelledby="titulo-graficos">
                <h2 id="titulo-graficos">Gráficos</h2>
                <p>Gráficos</p>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart width={500} height={300} data={quentura}>
                <XAxis dataKey="registradoEm" tickFormatter={(valor) => new Date(valor).toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit"})} />
                <YAxis />
                <Tooltip />
                <Line dataKey="temperaturaAtual" stroke="var(--cor-destaque)"/>
                </LineChart>
            </ResponsiveContainer>

            </section>

            <section id="Registros" aria-labelledby="titulo-registros">
                <h2 id="titulo-registros">Registros</h2>
                <p>{sessoes.length > 0 ? sessoes[sessoes.length - 1].estadoSistema : "Sem dados atualmente"}</p>
            </section>
        </div>

    </main>
    )

}

export default MainContent