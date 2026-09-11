import { useState } from "react";

function ModalSenha({ModalSenhaAberto, setModalSenha}){

    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [erroSenhaAtual, setErroSenhaAtual] = useState("");
    const [erroNovaSenha, setErroNovaSenha] = useState("");
    const [erroConfirmarSenha, setErroConfirmarSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    
    const [mostrarSenha, setMostrarSenha] = useState(false);


    async function handleSubmitChangeSenha(e) {
        e.preventDefault();
        let valido = true;
        let padraoSenhaCaracteres     = /.{8,}/;
        let padraoSenhaLetraMaiuscula = /[A-Z]/;
        let padraoSenhaNumeros        = /\d/;

        if (senhaAtual === "") {
            setErroSenhaAtual("A senha atual é obrigatória");
            valido = false;
        } else {
            setErroSenhaAtual("");
        }

        if (novaSenha === "") {
            setErroNovaSenha("A nova senha é obrigatória");
            valido = false;
        } else if (!padraoSenhaCaracteres.test(novaSenha)){
            setErroNovaSenha("A senha deve conter ao menos 8 caracteres");
            valido = false;
        } else if (!padraoSenhaLetraMaiuscula.test(novaSenha)){
            setErroNovaSenha("A senha deve conter ao menos 1 letra maiuscula");
            valido = false;
        } else if (!padraoSenhaNumeros.test(novaSenha)){
            setErroNovaSenha("A senha deve conter ao menos 1 número");
            valido = false;
        } else {
            setErroNovaSenha("");
        }

        if (confirmarSenha === "") {
            setErroConfirmarSenha("A confirmação de senha é obrigatória");
            valido = false;
        } else if (confirmarSenha !== novaSenha) {
            setErroConfirmarSenha("As senhas não coincidem");
            valido = false;
        } else {
            setErroConfirmarSenha("");
        }


        if (valido === true) {
            
            try {
            setCarregando(true);
            const token = localStorage.getItem("token");
            
            const resposta = await fetch(`${API_URL}/usuario/alterar-minha-senha`, {method: "PUT", headers: {"Content-Type": "application/json", "Authorization": "Bearer " + token}, body: JSON.stringify({senhaAtualizada: novaSenha, senhaAtual: senhaAtual})});

            if (resposta.ok) {
                setSucesso(true);
                
                setTimeout(() => {
                    setModalSenha(false);
                    setSucesso(false);
                    setSenhaAtual("");
                    setNovaSenha("");
                    setConfirmarSenha("");
                }, 3000);

            } else {
                setErroSenhaAtual("A senha atual está incorreta.");
            }

        } catch (error) {
            console.log("Erro ao trocar senha: ", error.message);
        } finally {
            setCarregando(false);
        }


    }

}

    if (!ModalSenhaAberto) return null;

    return(
        <div id="sub-modal-trocar-senha">
            <div className="conteudo-sub-modal">

            {sucesso ? (
                <div id="mensagem-sucesso-senha">
                    <i className="bi bi-shield-check"></i>
                    <h3>Senha alterada com sucesso!</h3>
                </div>
            ) : null}
            
            <button className="botao-fechar-perfil" onClick={() => setModalSenha(false)}>
            <i className="bi bi-x-lg"></i>
            </button>

            <h2 id="Titulo-trocar-senha">Trocar Senha</h2>

            <form onSubmit={handleSubmitChangeSenha} noValidate>
                
                <div id="campo-senha-atual">
                    <label htmlFor="senha-atual">Senha Atual</label>
                    <input type={mostrarSenha ? "text" : "password"} value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} name="senha-atual" id="senha-atual" required/>
                    <i
                    className={mostrarSenha ? "bi bi-eye-slash" : "bi bi-eye"}
                    id="olhoCadastro"
                    onClick={() => setMostrarSenha(!mostrarSenha)}>
                    </i>
                    <span id="erro-trocar-senha" role="alert">{erroSenhaAtual}</span>
                </div>

                <div id="campo-nova-senha">
                    <label htmlFor="nova-senha">Nova Senha</label>
                    <input type={mostrarSenha ? "text" : "password"} value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} name="nova-senha" id="nova-senha" required/>
                    <i
                    className={mostrarSenha ? "bi bi-eye-slash" : "bi bi-eye"}
                    id="olhoCadastro"
                    onClick={() => setMostrarSenha(!mostrarSenha)}>
                    </i>
                    <span id="erro-trocar-senha" role="alert">{erroNovaSenha}</span>
                </div>

                <div id="campo-confirmar-senha">
                    <label htmlFor="confirmar-senha">Confirmar Nova Senha</label>
                    <input type={mostrarSenha ? "text" : "password"} value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} name="confirmar-senha" id="confirmar-senha" required/>
                    <i
                    className={mostrarSenha ? "bi bi-eye-slash" : "bi bi-eye"}
                    id="olhoCadastro"
                    onClick={() => setMostrarSenha(!mostrarSenha)}>
                    </i>
                    <span id="erro-trocar-senha" role="alert">{erroConfirmarSenha}</span>
                </div>   

                <button type="submit" disabled={carregando}>{carregando ? "Carregando..." : "Trocar"}</button>
            
            </form>

            </div>
        </div>
    );


}

export default ModalSenha
