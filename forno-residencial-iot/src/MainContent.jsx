function MainContent() {

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
                <p>72C°</p>
            </section>

            <section id="temporizador" aria-labelledby="titulo-temporizador">
                <h2 id="titulo-temporizador">Temporizador</h2>
                <p>minutos</p>
            </section>

            <section id="alertas" aria-labelledby="titulo-alertas">
                <h2 id="titulo-alertas">Alertas</h2>
                <p>Nenhum Alerta No Momento</p>
            </section>

            <section id="graficos" aria-labelledby="titulo-graficos">
                <h2 id="titulo-graficos">Gráficos</h2>
                <p>Gráficos</p>
            </section>

            <section id="Registros" aria-labelledby="titulo-registros">
                <h2 id="titulo-registros">Registros</h2>
                <p>Registros do de tudo</p>
            </section>
        </div>

    </main>
    )

}

export default MainContent