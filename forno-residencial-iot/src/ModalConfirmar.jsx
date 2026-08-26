import { useState } from "react";
import API_URL from "./api";

function ModalConfirmar({ModalConfirmarAberto, setModalConfirmarAberto}) {

    const [codigo, setCodigo] = useState("");
    const [erroCodigo, setErroCodigo] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function confirmCode(e) {
        e.preventDefault();
        let valido = true;
        let padraoCodigo = /^\d{6}$/;

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
                const resposta = await fetch(`${API_URL}/verificar-codigo-redefinir-email`, {method:"POST", headers:{"Content-type": "application/json", "Authorization": "Bearer " + token}, body: JSON.stringify({codigo: codigo})});

            } catch (error) {
                console.log("deu erro meu chapa");
            }
        }

    }

    if (!ModalConfirmar) return null;

    return(
        
        <div id="container-codigo-email">
            <form onSubmit={confirmCode} noValidate>
                
                <div id="campo-codigo">
                    <label htmlFor="codigo-verificacao">Codigo</label>
                    <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)}  name="codigo" id="codigo-vericacao" required/>
                    <span id="erro-codigo" role="alert"></span>
                </div>

            </form>


        </div>
        
    );

}

export default ModalConfirmar