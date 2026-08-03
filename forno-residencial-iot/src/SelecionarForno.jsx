import { useEffect, useState } from "react";
import API_URL from "./api";

function SelecionarForno({setFornoSelecionado, fornoSelecionado, Logado, admin}){

    const [fornos, setFornos] = useState([]);

    useEffect (() => {

        const buscar = async () => {

        const token = localStorage.getItem("token");
        const resposta = await fetch(`${API_URL}/fornos/meus`, {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token}});

        if (!resposta.ok) return;

        const dados = await resposta.json();
        setFornos(dados);

        };

        buscar();

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