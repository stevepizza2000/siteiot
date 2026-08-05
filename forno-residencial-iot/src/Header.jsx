import { useState, useEffect } from "react";
import API_URL from "./api";

function Header({Logado, setLogado, setModalLoginAberto, setAdmin, setFornoSelecionado, admin, setModalPerfil}){

    let[menuAberto, setMenuAberto] = useState(false);
    const [nome, setNome] =  useState(null);

    useEffect(() => { 
    async function fetchData() {
        try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        const dadoNome = await fetch(`${API_URL}/usuario/meu-perfil?id=${id}`, {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token} });
        

        if(dadoNome.ok){
            setNome(await dadoNome.json());
        }
    }
        catch(erro) {
            console.log("Mensagem de erro: ", erro.message);
            
        }
    }
  fetchData();


    }, [Logado]);
    
    return (
        <>
        <header>

        <button id="menu-hamburguer" onClick={() => setMenuAberto(!menuAberto)}>
        <i className="bi bi-list"></i>
        </button>
            
             {!admin && (
            <nav id="menu" className={menuAberto ? "ativo" : ""}>
                <ul>
                    <li><a onClick={() => setMenuAberto(false)} href="#" id="logo">Monitor</a></li>
                    <li><a onClick={() => setMenuAberto(false)} href="#dashboard">Dashboard</a></li>
                    <li><a onClick={() => setMenuAberto(false)} href="#temperatura">Temperatura</a></li>
                    <li><a onClick={() => setMenuAberto(false)} href="#temporizador">Temporizador</a></li>
                    <li><a onClick={() => setMenuAberto(false)} href="#alertas">Alertas</a></li>
                    <li><a onClick={() => setMenuAberto(false)} href="#graficos">Gráfico</a></li>
                    <li><a onClick={() => setMenuAberto(false)} href="#Registros">Registros</a></li>
                </ul>
            </nav>
        )}

            {Logado && (
            <div id="acoes-logado">
                <button   id="nome-usuario" onClick={() => {setModalPerfil(true)}}>{nome && nome.nome}</button>
                <button id="botao-sair" onClick={() => {setLogado(false); setAdmin(false); setFornoSelecionado(null); setModalLoginAberto(true); localStorage.removeItem("id"); localStorage.removeItem("token")}}>Sair</button>
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