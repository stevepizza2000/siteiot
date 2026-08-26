import { useState } from "react";
import API_URL from "./api";

function ModalCadastro({aberto, ModalLogin, ModalCadastro}) {

    const [Nome, setNome] = useState("");
    const [Email, setEmail] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [Password, setPassword] = useState("");
    const [erroNome, setErroNome] = useState("");
    const [erroEmail, setErroEmail] = useState("");
    const [erroData, setErroData] = useState("");
    const [erroPassword, setErroPassword] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false); 
    const [carregando, setCarregando] = useState(false);

async function handleSubmitRegister(e){
    e.preventDefault();
    let valido = true;
    let padraoEmail               = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let padraoSenhaCaracteres     = /.{8,}/;
    let padraoSenhaLetraMaiuscula = /[A-Z]/;
    let padraoSenhaNumeros        = /\d/;

    if (Nome === "") {
        setErroNome("Digite algo no campo");
        valido = false;
    } else {
        setErroNome("");
    }

    if (Email === "") {
        setErroEmail("Digite algo no campo");
        valido = false;
    } else if (!padraoEmail.test(Email)){
        setErroEmail("Digite um E-mail verdadeiro");
        valido = false;
    } else {
        setErroEmail("");
    }

    if (dataNascimento === "") {
        setErroData("Digite algo no campo");
        valido = false;
    } else {
        setErroData("");
    }

    if (Password === "") {
        setErroPassword("Digite algo no campo");
        valido = false;
    } else if (!padraoSenhaCaracteres.test(Password)){
        setErroPassword("A senha deve conter ao menos 8 caracteres");
        valido = false;
    } else if (!padraoSenhaLetraMaiuscula.test(Password)){
        setErroPassword("A senha deve conter ao menos 1 letra maiuscula");
        valido = false;
    } else if (!padraoSenhaNumeros.test(Password)){
        setErroPassword("A sennha deve conter ao menos 1 numero");
        valido = false;
    } else {
        setErroPassword("");
    }

    if (valido === true){

        try{
            setCarregando(true);
            const resposta = await fetch(`${API_URL}/usuario`, {method:"POST", headers:{"Content-Type": "application/json"}, body: JSON.stringify({nome: Nome, email: Email, nascimento: dataNascimento, senha: Password})});
    
            if (resposta.ok){
                console.log("formulário está valido");
                setCarregando(false);
                ModalCadastro(false);
                ModalLogin(true);
            } else {
                setCarregando(false);
                setErroEmail("o email já foi cadastrado");
            }
    
        } catch (erro){
            setCarregando(false);
            console.log("Mensagem de erro: ", erro.message);

        }
        
    }

}   

    if (!aberto) return null;

    return (
        <div id="modal-cadastro" role="dialog" aria-modal="true" aria-labelledby="titulo-cadastro">
        <div>

            <div id="titulo-cadastro"><h2>Criar conta</h2></div>

            <form id="form-cadastro" onSubmit={handleSubmitRegister} noValidate>

                <div>
                    <label htmlFor="nome">Nome Completo</label>
                    <input 
                    value={Nome}
                    onChange={(e) => setNome(e.target.value)}
                    type="text" id="cadastro-nome"
                    placeholder="Digite Seu Nome Completo"
                    autoComplete="name" 
                    required/>
                    <span id="erro-cadastro-nome" role="alert">{erroNome}</span>
                </div>

                <div>
                    <label htmlFor="cadastro-email">E-mail</label>
                    <input 
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email" 
                    id="cadastro-email" 
                    name="email" autoComplete="email" 
                    placeholder="Digite Seu E-mail" 
                    required/>
                    <span id="erro-cadastro-email" role="alert">{erroEmail}</span>
                </div>

                <div>
                    <label htmlFor="cadastro-data">Data De Nascimento</label>
                    <input 
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    type="date" 
                    id="cadastro-data" 
                    name="data" 
                    autoComplete="data" 
                    placeholder="Digite Sua Data De Nascimento" 
                    required/>
                    <span id="erro-cadastro-data" role="alert">{erroData}</span>
                </div>

                <div>
                    <label htmlFor="cadastro-senha">Senha</label>
                    <input 
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={mostrarPassword ? "text" : "password"} 
                    id="cadastro-senha" 
                    name="senha" 
                    autoComplete="new-password" 
                    placeholder="Digite Sua Senha" 
                    required/>
                    <i
                    className={mostrarPassword ? "bi bi-eye-slash" : "bi bi-eye"}
                    id="olhoCadastro"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    ></i>
                    <span id="erro-cadastro-senha" role="alert">{erroPassword}</span>
                </div>

                <button type="submit" disabled={carregando}>{carregando ? "Carregando..." : "Criar Conta"}</button>

                <p>Já possui uma conta? <button type="button" id="ir-para-login" 
                onClick={() => {setErroPassword("");setErroNome("");setErroEmail("");setErroData("");ModalLogin(true); ModalCadastro(false)}}
                >Entrar</button></p>

            </form>

        </div>
    </div>
    )
}

export default ModalCadastro