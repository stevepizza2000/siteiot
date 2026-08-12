import { useState, useEffect } from "react";
import API_URL from "./api";

function DadosPerfil({setModalEmailAberto, setModalSenhaAberto, setModalPerfilAberto}){

    const [nascimento, setNascimento] = useState("");
    const [email, setEmail] = useState("");
    const [nome, setNome] = useState("");

    useEffect (() => {

        const buscar = async () => {
            
            const token = localStorage.getItem("token");
            const resposta = await fetch(`${API_URL}/usuario/meu-perfil`, {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token} });

            if (!resposta.ok) return;

            const dados = await resposta.json();

            const dataFormatada = new Date(dados.nascimento).toLocaleDateString("pt-BR");

            setEmail(dados.email);
            setNome(dados.nome);
            setNascimento(dataFormatada);

        };

        buscar();

    }, []);


    return(
        
        <div id="modal-perfil" role="dialog" aria-modal="true">
            <div>
                <p>{nome}</p>
                <p>{email}</p>
                <p>{nascimento}</p>

                <button onClick={() => setModalEmailAberto(true)}>Alterar E-mail</button>
                <button onClick={() => setModalSenhaAberto(true)}>Alterar Senha</button>
                <button onClick={() => setModalPerfilAberto(false)}>Fechar</button>
            </div>  
        </div>
    );

}

export default DadosPerfil