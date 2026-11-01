import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API_URL, { lerErroApi } from "./api";

function PaginaReverterEmail() {

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [erro, setErro] = useState("");

    async function handleReverter() {
        if (!token) {
            setErro("Link inválido ou sem token.");
            return;
        }

        setErro("");
        setCarregando(true);

        try {
            const resposta = await fetch(`${API_URL}/auth/reverter-email`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token })
            });

            if (resposta.ok) {
                setSucesso(true);
            } else if (resposta.status === 401 || resposta.status === 403) {
                setErro("Link inválido ou expirado.");
            } else {
                const { texto } = await lerErroApi(resposta, "Não foi possível reverter o e-mail.");
                setErro(texto);
            }
        } catch (e) {
            setErro("Erro de conexão. Tente novamente.");
            console.log("Erro ao reverter e-mail: ", e.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div id="redefinir-senha" aria-labelledby="titulo-reverter-email">

            <div><h2 id="titulo-reverter-email">Reverter E-mail</h2></div>

            {sucesso ? (
                <>
                    <p className="mensagem-sucesso">
                        E-mail revertido com sucesso. Recomendamos trocar sua senha após entrar.
                    </p>
                    <button type="button" onClick={() => navigate("/")}>Ir para o login</button>
                </>
            ) : (
                <>
                    <p>Se você não pediu a troca de e-mail da sua conta, clique abaixo para desfazê-la.</p>

                    <span id="erro-reverter-email" role="alert">{erro}</span>

                    <button type="button" onClick={handleReverter} disabled={carregando || !token}>
                        {carregando ? "Revertendo..." : "Reverter E-mail"}
                    </button>
                </>
            )}

        </div>
    );
}

export default PaginaReverterEmail;