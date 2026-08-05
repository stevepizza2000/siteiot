import { useState } from "react";

function ModalPerfil({ModalPerfil, Logado}) {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [carregandoPerfil, setCarregandoPerfil] = useState(true);

    const [modalEmailAberto, setModalEmailAberto] = useState(false);
    const [modalSenhaAberto, setModalSenhaAberto] = useState(false);

    // ---- Busca os dados assim que o modal abre ----
    useEffect(() => {
        if (!ModalPerfil) return;
        // busca GET /usuario/meu-perfil aqui
    }, [ModalPerfil]);

    if (!ModalPerfil) return null; 

    return (
               <div id="modal-perfil" role="dialog" aria-modal="true">
            <div>
                {/* Dados somente leitura */}
                <p>{nome}</p>
                <p>{email}</p>
                <p>{nascimento}</p>

                <button onClick={() => setModalEmailAberto(true)}>Alterar E-mail</button>
                <button onClick={() => setModalSenhaAberto(true)}>Alterar Senha</button>

                <button onClick={() => setModalPerfil(false)}>Fechar</button>
            </div>

            <ModalAlterarEmail aberto={ModalEmailAberto} setModalAlterarEmail={setModalEmailAberto} />
            <ModalAlterarSenha aberto={ModalSenhaAberto} setModalAlterarSenha={setModalSenhaAberto} />
        </div>
    );

}

export default ModalPerfil