import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "./api";

function Header({ Logado, setModalLoginAberto, setFornoSelecionado, admin, setModalPerfil, fornoSelecionado, sair }) {
    let [menuAberto, setMenuAberto] = useState(false);
    const [nome, setNome] = useState(null);
    const navigate = useNavigate();

    useEffect(() => { 
        if (!Logado) {
            setNome(null);
            return;
        }

        async function fetchData() {
            try {
                const token = localStorage.getItem("token");
                const dadoNome = await fetch(`${API_URL}/usuario/meu-perfil`, {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json", 
                        "Authorization": `Bearer ${token}`
                    } 
                });

                if (dadoNome.ok) {
                    setNome(await dadoNome.json());
                }
            } catch (erro) {
                console.log("Mensagem de erro: ", erro.message);
            }
        }
        fetchData();
    }, [Logado]);
    
    return (
        <>
        <header>
            {!admin && fornoSelecionado && (
            <>
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
                        <li><a onClick={() => setMenuAberto(false)} href="#Registros">Registros</a></li>
                    </ul>
                </nav>
            </>
        )}

            {Logado && (
            <div id="acoes-logado">
                <button id="nome-usuario" onClick={() => { setModalPerfil(true) }}>{nome?.nome}</button>
                
                {/* Lógica de logout delegada para a prop sair() */}
                <button id="botao-sair" onClick={() => {
                    sair();
                    setMenuAberto(false);
                    navigate("/");
                }}>Sair</button>
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