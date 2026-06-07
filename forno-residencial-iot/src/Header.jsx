function Header(){

    return (
        <header>

            <nav>
                <ul>
                    <li><a href="#" id="logo">Monitor</a></li>
                    <li><a href="#dashboard">Dashboard</a></li>
                    <li><a href="#temperatura">Temperatura</a></li>
                    <li><a href="#temporizador">Temporizador</a></li>
                    <li><a href="#alertas">Alertas</a></li>
                    <li><a href="#graficos">Gráfico</a></li>
                    <li><a href="#configuracoes">Configurações</a></li>
                </ul>
            </nav>
            
            <div id="acoes-logado" hidden>
                <span   id="nome-usuario"></span>
                <button id="botao-sair">Sair</button>
            </div>

    </header>

    )
}

export default Header;