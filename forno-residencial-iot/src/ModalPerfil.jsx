import { useState, useEffect } from "react";
import DadosPerfil from "./DadosPerfil";
import ModalEmail from "./ModalEmail";
import ModalSenha from "./ModalSenha";

function ModalPerfil({ModalPerfilAberto, Logado, setModalPerfil}) {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [carregandoPerfil, setCarregandoPerfil] = useState(true);

    const [ModalEmailAberto, setModalEmail] = useState(false);
    const [ModalSenhaAberto, setModalSenha] = useState(false);
    const [DadosPerfilAberto, setDadosPerfil] = useState(true)

    useEffect(() => {
        if (!ModalPerfilAberto) return;
    }, [ModalPerfilAberto]);

    if (!ModalPerfilAberto) return null; 

    return (
               
        <div>

            <DadosPerfil 
            setModalEmailAberto= {setModalEmail}
            setModalSenhaAberto= {setModalSenha}
            setModalPerfilAberto= {setModalPerfil}
            />

            <ModalEmail 
            ModalEmailAberto= {ModalEmailAberto} 
            setModalEmail= {setModalEmail} 
            />

            <ModalSenha 
            ModalSenhaAberto= {ModalSenhaAberto} 
            setModalSenha= {setModalSenha} 
            />

        </div>
    );

}

export default ModalPerfil