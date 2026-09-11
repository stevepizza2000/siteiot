import { useState } from "react";
import API_URL from "./api";

function ModalConfirmar({ModalConfirmarAberto, setModalConfirmarAberto, buscar}){

    const [codigo, setCodigo] = useState("");
    const [erroCodigo, setErroCodigo] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    async function confirmCode(e) {
        e.preventDefault();
        let valido = true;
        let padraoCodigo = /^\d{6}$/;
        const token = localStorage.getItem("token");

        if (codigo === "") {
            valido = false;
            setErroCodigo("Digite um codigo");
        } else if (!padraoCodigo.test(codigo)) {
            valido = false;
            setErroCodigo("O codigo tem 6 digitos");
        } else {
            setErroCodigo("");
        }

        if (valido === true) {
            try{
                setCarregando(true);
                const resposta = await fetch(`${API_URL}/auth/verificar-codigo-redefinir-email`, {method:"POST", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token}, body: JSON.stringify({codigo: codigo})});

                if (resposta.ok) {
                    buscar();
                    setSucesso(true);

                    setTimeout(() => {
                        setModalConfirmarAberto(false);
                        setSucesso(false); // Reseta o estado para a próxima vez que abrir
                        setCodigo(""); // Limpa o input
                    }, 3000);

                } else {
                    setErroCodigo("Codigo incorreto");
                }

            } catch (error) {
                console.log("deu erro meu chapa: " + error.message);
            } finally {
                setCarregando(false);
            }

        }

    }

    if (!ModalConfirmarAberto) return null;

    return(
        
        <div id="container-codigo-email">
            <div className="conteudo-sub-modal">

            {sucesso ? (
                <div id="mensagem-sucesso-email">
                    <i className="bi bi-check-circle-fill"></i>
                    <h3>E-mail alterado com sucesso!</h3>
                </div>
            ) : null}

            <button className="botao-fechar-perfil" onClick={() => setModalConfirmarAberto(false)}>
            <i className="bi bi-x-lg"></i>
            </button>

            <h2 id="Titulo-confirmar-email">Confirmar E-mail</h2>

            <form onSubmit={confirmCode} noValidate>
                
                <div id="campo-codigo">
                    <label htmlFor="codigo-verificacao">Codigo</label>
                    <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)}  name="codigo" id="codigo-verificacao" required/>
                    <span id="erro-codigo" role="alert">{erroCodigo}</span>
                </div>

                <button type="submit" disabled={carregando}>{carregando ? "Carregando..." : "Confirmar"}</button>

            </form>

            </div>
        </div>
        
    );

}

export default ModalConfirmar
