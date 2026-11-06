import { useState } from "react";
import API_URL, { fetchAutenticado } from "./api";

function ModalEmail({ModalEmailAberto, setModalEmail, setModalConfirmarAberto, sair}){

    const [carregando, setCarregando] = useState(false);
    const [novoEmail, setNovoEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erroSenha, setErroSenha] = useState("");
    const [erroNovoEmail, setErroNovoEmail] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false); 

    async function handleSubmitChangeEmail(e) {
        e.preventDefault();
        let valido = true;
        let padraoNovoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (novoEmail === ""){
            valido = false;
            setErroNovoEmail("Digite um E-mail");
        } else if (!padraoNovoEmail.test(novoEmail)){
            valido = false;
            setErroNovoEmail("Digite um E-mail verdadeiro");
        } else {
            setErroNovoEmail("");
        }

        if (password === "") {
            valido = false;
            setErroSenha("Digite sua senha");
        } else {
            setErroSenha("");
        }

        if (valido === true) {

            try{
                setCarregando(true);
                const resposta = await fetchAutenticado(`${API_URL}/auth/enviar-codigo-redefinir-email`,{ method: "POST", body: JSON.stringify({ novoEmail: novoEmail, senhaAtual: password }) },sair);
            
                if(resposta.ok) {
                    setModalEmail(false);
                    setModalConfirmarAberto(true);
                } else {
                    setCarregando(false);
                    setErroNovoEmail("O E-mail já está cadastrado como principal ou a senha está incorreta");
                }
            
            } catch (erro) {
                console.log("Erro: " + erro.message);
            } finally {
                setCarregando(false);
            }
            
        }

    }

    if (!ModalEmailAberto) return null;

    return(
        <div id="sub-modal-trocar-email">
            <div className="conteudo-sub-modal">

        <button className="botao-fechar-perfil" onClick={() => setModalEmail(false)}>
            <i className="bi bi-x-lg"></i>
        </button>

        <h2 id="Titulo-trocar-email">Trocar E-mail</h2>

        <form onSubmit={handleSubmitChangeEmail} noValidate>

        <div id="campo-trocar-email">
            <label htmlFor="change-email">Novo E-mail</label>
            <input onChange={(e) => setNovoEmail(e.target.value)} value={novoEmail} type="email" name="email" id="change-email" placeholder="Digite o novo E-mail" required/>
            <span id="erro-trocar-email" role="alert">{erroNovoEmail}</span>
        </div>

        <div id="campo-colocar-senha">
            <label htmlFor="password-required">Senha Atual</label>
            <input type={mostrarPassword ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} value={password} name="password" id="password-required" placeholder="Digite sua senha" required/>
            <i
            className={mostrarPassword ? "bi bi-eye-slash" : "bi bi-eye"}
            id="olhoCadastro"
            onClick={() => setMostrarPassword(!mostrarPassword)}>
            </i>
            <span id="erro-senha-trcar-email" role="alert" >{erroSenha}</span>
        </div>

        <button type="submit" disabled={carregando}>{carregando ? "Carregando..." : "Trocar"}</button>

        </form>
        </div>
        </div>
    );


}

export default ModalEmail
