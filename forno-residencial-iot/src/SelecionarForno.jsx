import { useEffect, useState } from "react";
import API_URL, { fetchAutenticado } from "./api";

function SelecionarForno({setFornoSelecionado, fornoSelecionado, Logado, admin, sair}){

    const [fornos, setFornos] = useState([]);

    useEffect(() => {
        if (!Logado) {
            setFornos([]);
            return;
        }

        const controller = new AbortController();

        const buscar = async () => {
            try {
                const resposta = await fetchAutenticado(
                    `${API_URL}/fornos/meus`,
                    { method: "GET", signal: controller.signal },
                    sair
                );

                if (!resposta.ok) {
                    setFornos([]);
                    return;
                }

                setFornos(await resposta.json());
            } catch (erro) {
                if (erro.name !== "AbortError") setFornos([]);
            }
        };

        buscar();

        return () => controller.abort();
}, [Logado]);

    if (!Logado || fornoSelecionado !== null || admin) return null;


    return(
         <div id="selecao-forno">
            
            <h2>Selecione O Forno Que Deseja Ver</h2>

            <div className="grid-fornos">
                {fornos.map((forno) => (
                    <button key={forno.id} className="forno-card" onClick={() => setFornoSelecionado(forno)}>
                        <i className="bi bi-fire"></i>
                        <span>{forno.nome}</span>
                    </button>
                ))}
            </div>
            
        </div>
    )
}

export default SelecionarForno