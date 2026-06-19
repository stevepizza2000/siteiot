import { useState } from "react";

function ModalEsqueciSenha({setModalLoginAberto, ModalEsqueciSenhaAberto, ModalEsqueciSenhaSet}) {

    const [Email, setEmail] = useState("");
    const [erroEmail, setErroEmail] = useState("");

    async function handleSubmitPassword(e) {
        e.preventDefault();
        let valido = true;
        let padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (Email === ""){
            setErroEmail("Digite algo no campo");
            valido = false;
        } else if (!padraoEmail.test(Email)){
            setErroEmail("Digite um E-mail verdadeiro");
            valido = false;
        } else {
            setErroEmail("");
        }

        if (valido === true) {
            try{
                const resposta = await fetch("http://localhost:8080/v1/auth/esqueci-minha-senha", {method:"POST", headers:{"Content-Type": "application/json"}, body: JSON.stringify({ email: Email})});
                
                if (resposta.ok){
                    console.log("Formulário está valido");
                    ModalEsqueciSenhaSet(false);
                    //abrir o link que o rafao te mandou pq sim(outro modal);
                } else {
                    setErroEmail("O E-mail não é válido")
                }
            
            } catch (erro) {
                console.log("isso aí é um erro");
            }
        }
    }

    if (!ModalEsqueciSenhaAberto) return null;

    return(

            <div id="modal-esqueci-senha" role="dialog" aria-modal="true" aria-labelledby="titulo-esqueci-senha">
            <div>

                <h2 id="titulo-esqueci-senha">Esqueci a Senha</h2>

                <form id="form-esqueci-senha" onSubmit={handleSubmitPassword} noValidate>

                    <div>
                        <label htmlFor="esqueci-senha-email">E-mail</label>
                        <input onChange={(e) => setEmail(e.target.value)} type="email" id="esqueci-senha-email" name="email" placeholder="Digite seu E-mail" autoComplete="email" required/>
                        <span id="erro-esqueci-senha-email" role="alert">{erroEmail}</span>
                    </div>

                    <button type="submit">Mandar</button>

                    <p>Lembrou sua senha?<button type="button" id="ir-para-login" onClick={() => {setModalLoginAberto(true); ModalEsqueciSenhaSet(false)}}>Login</button></p>

                </form>

            </div>    

            </div>

    )

}

export default ModalEsqueciSenha