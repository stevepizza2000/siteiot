import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API_URL from "./api";

function PaginaRedefinirSenha(){

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erroNovaSenha, setErroNovaSenha] = useState("");
    const [erroConfirmarSenha, setErroConfirmarSenha] = useState("");
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(false);

    async function handleSubmitResetPassword(e){
            e.preventDefault();
            let valido = true;
            let padraoSenhaCaracteres     = /.{8,}/;
            let padraoSenhaLetraMaiuscula = /[A-Z]/;
            let padraoSenhaNumeros        = /\d/;


            if(novaSenha === ""){
                setErroNovaSenha("Digite algo no campo");
                valido = false;
            } else if (!padraoSenhaCaracteres.test(novaSenha)){
                setErroNovaSenha("A senha deve conter ao menos 8 caracteres");
                valido = false;
            } else if (!padraoSenhaLetraMaiuscula.test(novaSenha)) {
                setErroNovaSenha("A senha deve conter ao menos 1 letra maiuscula");
                valido = false;
            } else if (!padraoSenhaNumeros.test(novaSenha)){
                setErroNovaSenha("A sennha deve conter ao menos 1 numero");
                valido = false;
            } else {
                setErroNovaSenha("");
            }

            if (confirmarSenha === ""){
                setErroConfirmarSenha("Digite algo no campo");
                valido = false;
            } else if (confirmarSenha !== novaSenha){
                setErroConfirmarSenha("As senhas não coincidem");
                valido = false;
            } else {
                setErroConfirmarSenha("");
            }

            if (valido === true){
                
                try {
                    setCarregando(true);
                    const resposta = await fetch(`${API_URL}/v1/auth/redefinir-senha`, {method:"POST", headers:{"Content-Type": "application/json"}, body: JSON.stringify({token: token, novasenha: novaSenha})} )

                    if(resposta.ok) {
                        setCarregando(false);
                        console.log("formulário valido")
                        navigate("/");
                    }

                } catch (error) {
                    setCarregando(false);
                    console.log("Mensagem de erro: ", erro.message);
                }

            }

    }


    return (
        <div id="redefinir-senha" aria-labelledby="titulo-redefinir-senha">

            <div><h2 id="titulo-redefinir-senha">Redefinir Senha</h2></div>

            <form id="form-redefinir-senha" noValidate onSubmit={handleSubmitResetPassword}>

                <div>
                    <label htmlFor="nova-senha-primeiro">Nova Senha</label>
                    <input value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} type="password" id="nova-senha-primeiro" name="nova-senha-primeiro" placeholder="Digite sua nova senha" required/>
                    <span id="erro-redefinir-senha-primeiro" role="alert">{erroNovaSenha}</span>
                </div>

                <div>
                    <label htmlFor="nova-senha-segundo">Confirme A Nova Senha</label>
                    <input value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} type="password" id="nova-senha-segundo" name="nova-senha-segundo" placeholder="Confirme sua nova senha" required/>
                    <span id="erro-redefinir-senha-segundo" role="alert">{erroConfirmarSenha}</span>
                </div>

                <button type="submit">{carregando ? "Mudando Senha..." : "Mudar a Senha"}</button>

                <p>Lembrou a senha? <button type="button" id="voltar-login" onClick={() => navigate("/")}>Voltar</button></p>

            </form>

        </div>
    )

}


export default PaginaRedefinirSenha;