import { useState } from "react";
import API_URL from "./api";

function ModalLogin ({aberto, setModalLogin, ModalCadastro, setLogado, ModalEsqueciSenha, mensagemSucesso}) {

    let [Email, setEmail] = useState("");
    let [Password, setPassword] = useState("");
    let [erroEmail, setErroEmail] = useState("");
    let [erroPassword, setErroPassword] = useState("");
    let [mostrarPassword, setMostrarPassword] = useState(false);
    const [carregando, setCarregando] = useState(false);

    async function handleSubmitLogin (e){
        e.preventDefault();
        let valido = true;

        if (Email === "") {
            setErroEmail("E-mail ou senha incorretos");
            valido = false;
        } else {
            setErroEmail("");
        }

        if (Password === "") {
            setErroPassword("E-mail ou senha incorretos");
            valido = false;
        } else {
            setErroPassword("");
        }


        if(valido === true){
            
            try{
            setCarregando(true);    
            const resposta = await fetch(`${API_URL}/v1/auth/login`, {method:"POST", headers:{"Content-Type": "application/json"}, body: JSON.stringify({email: Email, senha: Password})});

                if (resposta.ok) {
                const dados = await resposta.json();
                localStorage.setItem("token", dados.token);
                localStorage.setItem("id", dados.id);
                setCarregando(false);
                setLogado(true);
                ModalCadastro(false);
                setModalLogin(false);
                } else {
                    setCarregando(false);
                    setErroEmail("E-mail não cadastrado");
                    setErroPassword("E-mail não cadastrado");
                }
            } catch (erro) {
                setCarregando(false);
                console.log("Mensagem de erro: ", erro.message);
            }

        }
    }


    if (!aberto) return null; 


    return (
        <div id="modal-login" role="dialog" aria-modal="true" aria-labelledby="titulo-login">
        <div>

            <h2 id="titulo-login">Entrar</h2>

            {mensagemSucesso != "" ? <p>{mensagemSucesso}</p> : null}
            
            <form id="form-login" onSubmit={handleSubmitLogin} noValidate>

                <div>
                    <label htmlFor="login-email">E-mail</label>
                    <input
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)} 
                    type="email" 
                    id="login-email" 
                    name="email" 
                    placeholder="Digite Seu E-mail" 
                    autoComplete="email" 
                    required/>
                    <span id="erro-login-email" role="alert">{erroEmail}</span>
                </div>

                <div>
                    <label htmlFor="login-senha">Senha</label>
                    <input 
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={mostrarPassword ? "text" : "password"} 
                    id="login-senha" 
                    name="senha" 
                    placeholder="Digite sua senha" 
                    autoComplete="current-password" 
                    required/>
                    <i 
                    className={mostrarPassword ? "bi bi-eye-slash" : "bi bi-eye"}
                    id="olho"
                    onClick={() => setMostrarPassword(!mostrarPassword)}></i>
                    <span id="erro-login-senha" role="alert">{erroPassword}</span>
                </div>

                <button type="submit" disabled={carregando}>{carregando ? "Carregando..." : "Entrar"}</button>

                <p>Não tem uma conta?<button type="button" id="ir-para-cadastro"
                onClick={() => {setErroEmail("");setErroPassword("");setModalLogin(false); ModalCadastro(true);}}
                >Criar Conta</button></p>
                <p>Esqueceu sua senha?<button type="button" id="ir-para-esqueci-senha" onClick={() => {setModalLogin(false); ModalEsqueciSenha(true)}}>Esqueci Minha Senha</button></p>

            </form>
        </div>
    </div>
    )

}

export default ModalLogin