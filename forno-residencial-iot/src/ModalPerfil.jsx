import { useState, useEffect } from "react";
import API_URL from "./api";
import DadosPerfil from "./DadosPerfil";
import ModalEmail from "./ModalEmail";
import ModalSenha from "./ModalSenha";
import ModalConfirmar from "./ModalConfirmar"

function ModalPerfil({ModalPerfilAberto, Logado, setModalPerfil}) {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [cpf, setCpf] = useState("");
    const [carregandoPerfil, setCarregandoPerfil] = useState(true);

    const [ModalConfirmarAberto, setModalConfirmarAberto] = useState(false);
    const [ModalEmailAberto, setModalEmail] = useState(false);
    const [ModalSenhaAberto, setModalSenha] = useState(false);
    const [DadosPerfilAberto, setDadosPerfil] = useState(true)


    async function buscar(){
        const token = localStorage.getItem("token");
                const resposta = await fetch(`${API_URL}/usuario/meu-perfil`, {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token} });

                if (!resposta.ok) return;

                const dados = await resposta.json();

                const dataFormatada = new Date(dados.nascimento).toLocaleDateString("pt-BR");

                setEmail(dados.email);
                setNome(dados.nome);
                setNascimento(dataFormatada);
    };

    useEffect (() => {

        buscar();
        
    }, [ModalPerfilAberto]);



    if (!ModalPerfilAberto) return null; 

    return (
               
        <div>

            <DadosPerfil 
            setModalEmailAberto= {setModalEmail}
            setModalSenhaAberto= {setModalSenha}
            setModalPerfilAberto= {setModalPerfil}
            nome= {nome}
            email= {email}
            nascimento= {nascimento}
            cpf= {cpf}
            />

            <ModalEmail 
            ModalEmailAberto= {ModalEmailAberto} 
            setModalEmail= {setModalEmail} 
            setModalConfirmarAberto= {setModalConfirmarAberto}
            />

            <ModalConfirmar
            ModalConfirmarAberto= {ModalConfirmarAberto}
            setModalConfirmarAberto= {setModalConfirmarAberto}
            buscar= {buscar}
            />

            <ModalSenha 
            ModalSenhaAberto= {ModalSenhaAberto} 
            setModalSenha= {setModalSenha} 
            />

        </div>
    );

}

export default ModalPerfil