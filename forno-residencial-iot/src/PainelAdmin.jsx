import { useState, useRef } from "react";
import API_URL from "./api";
import QRCode from "react-qr-code";

function PainelAdmin() {

    const [nomeForno, setNomeForno] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
    const [erroSerial, setErroSerial] = useState("");
    const [erroNome, setErroNome] = useState("");
    const [dados, setDados] = useState(null);
    const qrCodeRef = useRef(null);
    

    async function handleCriarForno(e) {
        e.preventDefault();
        setMensagem({texto: "", tipo: ""});
        setDados(null);

        const nomeValido = nomeForno.trim() !== "";
        setErroNome(nomeValido ? null : "é necessário digitar um nome");

        const serialValido = serialNumber.trim() !== "";
        setErroSerial(serialValido ? "" : "É necessário digitar um nome");

        if (!serialValido){
            return;
        }

        setCarregando(true);
        const token = localStorage.getItem("token");

        
        try {
            const nomeFinal = nomeValido ? nomeForno : null;
            const resposta = await fetch(`${API_URL}/v1/fornos/pre-registrar`, {method: "POST", headers: {"Content-Type": "application/json", "Authorization": "Bearer " + token }, body: JSON.stringify({nome: nomeFinal, serialNumber: serialNumber})});
            
            if (resposta.ok) {
                const dadosForno = await resposta.json();
                const objetoQrCode = { 
                    
                    serialNumber: serialNumber,
                    pinSeguranca: dadosForno.pinSeguranca,
                };

                setDados(objetoQrCode);

                setMensagem({ 
                    texto: `Forno Serial: ${serialNumber} fabricado com sucesso!`, 
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

    function baixarQrCodePng(){
        const svgElement = qrCodeRef.current.querySelector("svg");
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl = URL.createObjectURL(svgBlob);
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const escala = 4; // aumenta a resolução final pra não ficar borrado
            canvas.width = img.width * escala;
            canvas.height = img.height * escala;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const pngUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = pngUrl;
            link.download = `qrcode-forno-${dados?.serialNumber || "forno"}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(svgUrl)

            console.log("Imagem carregada: ", img.width, img.height);
        };

        img.src = svgUrl;

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
                        <label htmlFor="nome-forno">Nome de Fabricação</label>
                        <input type="text" value={nomeForno} id="nome-forno" onChange={(e) => setNomeForno(e.target.value)} required/>
                        <span id="erro-nome-forno" role="alert">{erroNome}</span>
                    </div>

                    <div>
                        <label htmlFor="serial-forno">Serial do Forno</label>
                        <input type="text" value={serialNumber} id="serial-forno" onChange={(e) => setSerialNumber(e.target.value)} required/>
                        <span id="erro-serial-forno" role="alert">{erroSerial}</span>
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

                    <button onClick={baixarQrCodePng}>Baixar QR code</button>

                </section>
            )}


        </div>
    )

}

export default PainelAdmin