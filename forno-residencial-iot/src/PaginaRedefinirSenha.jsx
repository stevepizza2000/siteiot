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
    const [erroGeral, setErroGeral] = useState("");

    async function handleSubmitResetPassword(e){
            e.preventDefault();
            if (!token) {
                setErroGeral("Link inválido ou sem token. Solicite um novo link.");
            return;
        }
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
                setErroNovaSenha("A senha deve conter ao menos 1 numero");
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

            if (valido === true) {
                
                setErroGeral("");

                    try {
                        setCarregando(true);
                        const resposta = await fetch(`${API_URL}/auth/redefinir-senha`, {method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: token, novaSenha: novaSenha })});

                        if (resposta.ok) {
                            navigate("/");
                        } else {
                            setErroGeral("Não foi possível redefinir a senha. O link pode ter expirado. Peça um novo link.");
                        }

                    } catch (erro) {
                        setErroGeral("Erro de conexão. Tente novamente.");
                        console.log("Mensagem de erro: ", erro.message);
                    } finally {
                        setCarregando(false);
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

                <span id="erro-redefinir-senha-geral" role="alert">{erroGeral}</span>

                <button type="submit" disabled={carregando}>{carregando ? "Mudando Senha..." : "Mudar a Senha"}</button>

                <p>Lembrou a senha? <button type="button" id="voltar-login" onClick={() => navigate("/")}>Voltar</button></p>

            </form>

        </div>
    )

}


export default PaginaRedefinirSenha;