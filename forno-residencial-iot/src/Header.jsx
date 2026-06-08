import { useState } from "react";

function Header({Logado, setLogado, setModalLoginAberto}){

    let[menuAberto, setMenuAberto] = useState(false);

    return (
        <>
        <header>

        <button id="menu-hamburguer" onClick={() => setMenuAberto(!menuAberto)}>
        <i className="bi bi-list"></i>
        </button>

            <nav id="menu" className={menuAberto ? "ativo" : ""}>
                <ul>
                    <li><a onClick={() => setMenuAberto(false)} href="#" id="logo">Monitor</a></li>
                    <li><a onClick={() => setMenuAberto(false)} href="#dashboard">Dashboard</a></li>
                    <li><a onClick={() => setMenuAberto(false)} href="#temperatura">Temperatura</a></li>
                    <li><a onClick={() => setMenuAberto(false)} href="#temporizador">Temporizador</a></li>
                    <li><a onClick={() => setMenuAberto(false)} href="#alertas">Alertas</a></li>
                    <li><a onClick={() => setMenuAberto(false)} href="#graficos">Gráfico</a></li>
                    <li><a onClick={() => setMenuAberto(false)} href="#configuracoes">Configurações</a></li>
                </ul>
            </nav>
            

            {Logado && (
            <div id="acoes-logado">
                <span   id="nome-usuario"></span>
                <button id="botao-sair" onClick={() => {setLogado(false); setModalLoginAberto(true);}}>Sair</button>
            </div>
            )}

    </header>

        <div id="overlay" 
        className={menuAberto ? "ativo" : ""}
        onClick={() => setMenuAberto(false)}></div>

    </>
    )
}

export default Header;