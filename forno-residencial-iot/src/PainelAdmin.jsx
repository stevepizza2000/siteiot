import { useState } from "react";
import API_URL from "./api";
import QRCode from "react-qr-code";

function PainelAdmin() {

    const [nomeForno, setNomeForno] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState({texto: "", tipo: ""});
    const [erroNome, setErroNome] = useState("");
    const [dados, setDados] = useState(null);

    async function handleCriarForno(e) {
        e.preventDefault();
        setCarregando(true);
        let valido = true;
        setMensagem({texto: "", tipo: ""});
        const token = localStorage.getItem("token");

        if (nomeForno === "") {
            setErroNome("Digite algo");
            valido = false;
            setCarregando(false);
        } else {
            setErroNome("");
        }


        if (valido === true){
        try {

            const resposta = await fetch(`${API_URL}/v1/fornos/fabricar`, {method: "POST", headers: {"Content-Type": "application/json", "Authorization": "Bearer " + token }, body: JSON.stringify({nome: nomeForno})});
            
            
            if (resposta.ok) {
                const dadosForno = await resposta.json();
                const objetoQrCode = {serialNumber: dadosForno.serialNumber, pinSeguranca: dadosForno.pinSeguranca};


                setDados(objetoQrCode);

                setCarregando(false);
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
                        <label htmlFor="nome-forno">Nome do Forno</label>
                        <input type="text" value={nomeForno} id="nome-forno" onChange={(e) => setNomeForno(e.target.value)} required/>
                        <span id="erro-nome-forno" role="alert">{erroNome}</span>
                    </div>

                    <button type="submit" disabled={carregando}>{carregando ? "Fabricando..." : "Fabricar Forno"}</button>

                </form>
                
            </section>

            {dados && (
                <QRCode
                    value={JSON.stringify(dados)}
                />
            )}


        </div>
    )

}

export default PainelAdmin