import { useState } from "react";

function ModalEmail({ModalEmailAberto, setModalEmail}){

    const [carregando, setCarregando] = useState(false);
    const [novoEmail, setNovoEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmitChangeEmail(e) {
        e.preventDefault();
        let valido = true;

        if (novoEmail === ""){
            valido = false
        } 

    }

    if (!ModalEmailAberto) return null;

    return(
        <div id="sub-modal-trocar-email">
            
        <h2 id="Trocar E-mail">Trocar E-mail</h2>

        <form action="form-trocar-email" noValidate>

        <div id="campo-trocar-email">
            <label htmlFor="change-email">Novo E-mail</label>
            <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="change-email" placeholder="Digite o novo E-mail" required/>
            <span id="erro-trocar-email"></span>
        </div>

        <div id="campo-colocar-senha">
            <label htmlFor="password-required">Senha Atual</label>
            <input type="password" name="password" id="password-required" placeholder="Digite sua senha" required/>
        </div>

        <button type="submit" disabled={carregando}>{carregando ? "Carregando..." : "Entrar"}</button>

        </form>

        </div>
    );


}

export default ModalEmail
