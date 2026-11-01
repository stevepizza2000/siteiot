import { useState, useEffect } from "react";
import API_URL, { fetchAutenticado } from "./api";
import DadosPerfil from "./DadosPerfil";
import ModalEmail from "./ModalEmail";
import ModalSenha from "./ModalSenha";
import ModalConfirmar from "./ModalConfirmar"

function ModalPerfil({ModalPerfilAberto, Logado, setModalPerfil, sair, setMensagemSucesso}) {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [cpf, setCpf] = useState("");
    const [carregandoPerfil, setCarregandoPerfil] = useState(true);

    const [ModalConfirmarAberto, setModalConfirmarAberto] = useState(false);
    const [ModalEmailAberto, setModalEmail] = useState(false);
    const [ModalSenhaAberto, setModalSenha] = useState(false);
    const [DadosPerfilAberto, setDadosPerfil] = useState(true)


    async function buscar() {
        try {
            const resposta = await fetchAutenticado(`${API_URL}/usuario/meu-perfil`, { method: "GET" }, sair);
            if (resposta.ok) {
                const dados = await resposta.json();
                setEmail(dados.email);
                setNome(dados.nome);

                if (dados.nascimento) {
                    const [ano, mes, dia] = dados.nascimento.split("-");
                    setNascimento(`${dia}/${mes}/${ano}`);
                } else {
                    setNascimento("");
                }
            }
        } catch (erro) {
            console.log("Erro ao buscar perfil: ", erro.message);
        }

        try {
            const respostaFoto = await fetchAutenticado(`${API_URL}/usuario/foto-perfil/visualizar-img`, { method: "GET" }, sair);
            if (respostaFoto.ok) {
                const foto = await respostaFoto.json();
                setFotoBase64(foto.fotoBase64 ?? "");
            } else {
                setFotoBase64("");
            }
        } catch (erro) {
            console.log("Erro ao buscar foto: ", erro.message);
        }
    }

    useEffect(() => {
        if (!ModalPerfilAberto) return;
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
            fotoBase64= {fotoBase64}
            />

            <ModalEmail 
            ModalEmailAberto= {ModalEmailAberto} 
            setModalEmail= {setModalEmail} 
            setModalConfirmarAberto= {setModalConfirmarAberto}
            sair= {sair}
            />

            <ModalConfirmar
            ModalConfirmarAberto= {ModalConfirmarAberto}
            setModalConfirmarAberto= {setModalConfirmarAberto}
            sair= {sair}
            setMensagemSucesso= {setMensagemSucesso}
            />

            <ModalSenha 
            ModalSenhaAberto= {ModalSenhaAberto} 
            setModalSenha= {setModalSenha} 
            sair= {sair}
            setMensagemSucesso= {setMensagemSucesso}
            />

        </div>
    );

}

export default ModalPerfil