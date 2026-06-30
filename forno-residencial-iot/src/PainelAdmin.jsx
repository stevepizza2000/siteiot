import { useState } from "react";
import API_URL from "./api";

function PainelAdmin() {

    const [serialNumber, setSerialNumber] = useState("");
    const [nomeForno, setNomeForno] = useState("");
    const [pinSeguranca, setPinSeguranca] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState({texto: "", tipo: ""});
    const [erroPin, setErroPin] = useState("");
    const [erroNome, setErroNome] = useState("");
    const [erroSerial, setErroSerial] = useState("");

    async function handleCriarForno(e) {
        e.preventDefault();
        setCarregando(true);
        let valido = true;
        setMensagem({texto: "", tipo: ""});
        let padraoPinCaracteres     = /.{20,}/;
        const token = localStorage.getItem("token");

        if (pinSeguranca === "") {
            setErroPin("Digite algo");
            valido = false;
            setCarregando(false);
        } else if (!padraoPinCaracteres.test(pinSeguranca)){
            setErroPin("o pin deve conter ao menos 20 caracteres");
            valido = false;
            setCarregando(false);
        } else {
            setErroPin("");
        }

        if (nomeForno === "") {
            setErroNome("Digite algo");
            valido = false;
            setCarregando(false);
        } else {
            setErroNome("");
        }

        if (serialNumber === "") {
            setErroSerial("Digite algo");
            valido = false;
            setCarregando(false);
        } else {
            setErroSerial("");
        }

        if (valido === true){
        try {
            const resposta = await fetch(`${API_URL}/v1/fornos/fabricar`, {method: "POST", headers: {"Content-Type": "application/json", "Authorization": "Bearer " + token }, body: JSON.stringify({serialNumber: serialNumber, nome: nomeForno, pinSeguranca: pinSeguranca})});
             
            if (resposta.ok) {
                const dadosForno = await resposta.json();
                
                setMensagem({ texto: `Forno ${dadosForno.nome} (Serial: ${dadosForno.serialNumber}) fabricado com sucesso!`, tipo: "sucesso" });


            } else {
                console.log("Erro ao criar forno. Verifique os dados.");
            }

        } catch (erro) {
            console.log("deu erro ai");
            setCarregando(false);
        }
    } else {
        console.log("seu formulário não é válido");
    }

    }

    return (
        <div id="painel-admin-container">
           
            <h1>Painel do Administrador</h1>

            <section id="secao-fabricar-forno">
                <h2>Fabricar Novo Forno</h2>
                {mensagem.texto !== "" ? <p className="mensagem-sucesso">{mensagem.texto}</p> : null}

                <form id="form-admin" onSubmit={handleCriarForno} noValidate>
                    
                    <div>
                        <label htmlFor="serial-number">Serial Number</label>
                        <input type="text" value={serialNumber} id="serial-number" onChange={(e) => setSerialNumber(e.target.value)} required/>
                        <span id="erro-serial" role="alert">{erroSerial}</span>
                    </div>

                    <div>
                        <label htmlFor="nome-forno">Nome do Forno</label>
                        <input type="text" value={nomeForno} id="nome-forno" onChange={(e) => setNomeForno(e.target.value)} required/>
                        <span id="erro-nome-forno" role="alert">{erroNome}</span>
                    </div>

                    <div>
                        <label htmlFor="pin">Pin de Segurança</label>
                        <input type="text" value={pinSeguranca} id="pin" onChange={(e) => setPinSeguranca(e.target.value)} required/>
                        <span id="erro-pin" role="alert">{erroPin}</span>
                    </div>

                    <button type="submit" disabled={carregando}>{carregando ? "Fabricando..." : "Fabricar Forno"}</button>

                </form>
            </section>

        </div>
    )

}

export default PainelAdmin