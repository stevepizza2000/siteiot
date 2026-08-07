import { useState, useEffect } from "react";
import DadosPerfil from "./DadosPerfil";
import ModalEmail from "./ModalEmail";
import ModalSenha from "./ModalSenha";

function ModalPerfil({ModalPerfil, Logado}) {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [carregandoPerfil, setCarregandoPerfil] = useState(true);

    const [ModalEmail, setModalEmail] = useState(true);
    const [ModalSenha, setModalSenha] = useState(true);
    const [DadosPerfil, setDadosPerfil] = useState(true)

    useEffect(() => {
        if (!ModalPerfil) return;
    }, [ModalPerfil]);

    if (!ModalPerfil) return null; 

    return (
               
        <div>

            <DadosPerfil
            DadosPerfil= {DadosPerfil}
            setDadosPErfil= {setDadosPerfil}
            />

            <ModalEmail 
            ModalEmail= {ModalEmail} 
            setModalEmail= {setModalEmail} 
            />

            <ModalSenha 
            ModalSenha= {ModalSenha} 
            setModalSenha= {setModalSenha} 
            />

        </div>
    );

}

export default ModalPerfil