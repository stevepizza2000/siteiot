import { useState, useRef } from "react";
import API_URL from "./api";
import QRCode from "react-qr-code";

function PainelAdmin() {

    const [nomeForno, setNomeForno] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
    const [erroNome, setErroNome] = useState("");
    const [dados, setDados] = useState(null);
    const qrCodeRef = useRef(null);

    async function handleCriarForno(e) {
        e.preventDefault();
        setMensagem({texto: "", tipo: ""});
        setDados(null);

        const nomeValido = nomeForno.trim() !== "";
        setErroNome(nomeValido ? "" : "É necessário digitar um nome");

        if (!nomeValido){
            return;
        }

        setCarregando(true);
        const token = localStorage.getItem("token");

        
        try {

            const resposta = await fetch(`${API_URL}/v1/fornos/fabricar`, {method: "POST", headers: {"Content-Type": "application/json", "Authorization": "Bearer " + token }, body: JSON.stringify({nome: nomeForno})});
            
            if (resposta.ok) {
                const dadosForno = await resposta.json();
                const objetoQrCode = {
                    serialNumber: dadosForno.serialNumber, 
                    pinSeguranca: dadosForno.pinSeguranca,
                };

                setDados(objetoQrCode);

                setMensagem({ 
                    texto: `Forno ${dadosForno.nome} (Serial: ${dadosForno.serialNumber}) fabricado com sucesso!`, 
                    tipo: "sucesso", 
                });

            } 

        } catch (erro) {
                setMensagem({
                    texto: erroBody?.mensagem || "Erro ao criar forno. Verifique os dados.",
                    tipo: "erro",
                });
            } finally {
                setCarregando(false);
            }


    }

    function aparecer(){
        console.log(qrCodeRef.current);
    }

    return (
        <div id="painel-admin-container">
           
            <h1>Painel do Administrador</h1>

            <section id="secao-fabricar-forno">
                <h2>Fabricar Novo Forno</h2>
                {mensagem.texto !== "" && (
                    <p className={mensagem.tipo === "erro" ? "mensagem-erro" : "mensagem-sucesso"}>
                        {mensagem.texto}
                    </p>
                )}

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
                <section>
                    <div ref={qrCodeRef}>
                    <QRCode
                        value={JSON.stringify(dados)}
                    />
                    </div>

                    <button onClick={aparecer}>Baixar QR code</button>

                </section>
            )}


        </div>
    )

}

export default PainelAdmin