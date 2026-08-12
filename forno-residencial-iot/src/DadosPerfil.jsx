import { useState, useEffect } from "react";

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
            setEmail(await dados.Email);
            setNome(await dados.nome);
            setNascimento(await dados.nascimento);
        };

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