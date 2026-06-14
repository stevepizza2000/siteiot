import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function MainContent({Logado, setLogado, ModalLogin}) {


    const [quentura, setQuentura] = useState([]);
    const [tempo, setTempo] = useState([]);
    const [sessoes, setSessoes] = useState([]);
    const [eventos, setEventos] = useState([]);

    useEffect(() => {

        const intervalo = setInterval(async () => {
            try {
            const token = localStorage.getItem("token");
            const dadoTemperatura = await fetch("http://localhost:8080/v1/temperaturas", {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token} });
            const dadoTemporizador = await fetch("http://localhost:8080/v1/temporizadores/meus", {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token} });
            const dadoSessoes = await fetch("http://localhost:8080/v1/sessoes", {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token} });
            const dadoEventos = await fetch("http://localhost:8080/v1/eventos", {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token} });

            if (dadoTemperatura.ok){
                 setQuentura(await dadoTemperatura.json());
            }
            if (dadoTemporizador.ok){
                setTempo(await dadoTemporizador.json());
            }
            if (dadoSessoes.ok){
                setSessoes(await dadoSessoes.json());
            } 
            if (dadoEventos.ok){
                setEventos(await dadoEventos.json());
            }

            if (dadoTemperatura.status === 401) {
                localStorage.removeItem("id");
                localStorage.removeItem("token");
                setLogado(false);
                ModalLogin(true);
            }

        } catch(erro){
            console.log("algum erro deu aí, não pergunta para mim");
        }

        }, 1000);

         return () => clearInterval(intervalo);

        }, []);


    if (!Logado) return null;
    

    return(
        <main>
            
        <div id="aviso-auth" hidden>
            <p>Faça login ou crie uma conta para continuar.</p>
            <button id="aviso-btn-login">Entrar</button>
            <button id="aviso-btn-cadastro">Criar Conta</button>
        </div>

        <div id="secoes-protegidas">

            <section id="dashboard" aria-labelledby="titulo-dashboard">
                <h2 id="titulo-dashboard">Dashboard</h2>
                <p>status do sistema</p>
            </section>

            <section id="temperatura" aria-labelledby="titulo-temperatura">
                <h2 id="titulo-temperatura">Temperatura</h2>
                <p>{quentura.length > 0 && quentura[quentura.length - 1].temperaturaAtual}</p>
            </section>

            <section id="temporizador" aria-labelledby="titulo-temporizador">
                <h2 id="titulo-temporizador">Temporizador</h2>
                <p>{tempo.length > 0 && tempo[tempo.length - 1].horarioFim}</p>
            </section>

            <section id="alertas" aria-labelledby="titulo-alertas">
                <h2 id="titulo-alertas">Alertas</h2>
                <p>{eventos.length > 0 && eventos[eventos.length - 1].tipo}</p>
            </section>

            <section id="graficos" aria-labelledby="titulo-graficos">
                <h2 id="titulo-graficos">Gráficos</h2>
                <p>Gráficos</p>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart width={500} height={300} data={quentura}>
                <XAxis dataKey="registradoEm" />
                <YAxis />
                <Tooltip />
                <Line dataKey="temperaturaAtual" stroke="var(--cor-destaque)"/>
                </LineChart>
            </ResponsiveContainer>

            </section>

            <section id="Registros" aria-labelledby="titulo-registros">
                <h2 id="titulo-registros">Registros</h2>
                <p>{sessoes.length > 0 && sessoes[sessoes.length - 1].estadoSistema}</p>
            </section>
        </div>

    </main>
    )

}

export default MainContent