import { useEffect, useState } from "react";
import API_URL from "./api";

function SelecionarForno({setFornoSelecionado, fornoSelecionado, Logado}){

    const [fornos, setFornos] = useState([]);

    useEffect (() => {

        const buscar = async () => {

        const token = localStorage.getItem("token");
        const resposta = await fetch(`${API_URL}/v1/fornos/meus`, {method:"GET", headers:{"Content-Type": "application/json", "Authorization": "Bearer " + token}});

        const dados = await resposta.json();
        setFornos(dados);

        };

        buscar();

    }, []);


    if (!Logado || fornoSelecionado !== null) return null;


    return(

         <div>
            
            <h2>Selecione O Forno Que Deseja Ver</h2>

            {fornos.map((forno) => (
                <button key={forno.id} onClick={() => setFornoSelecionado(forno)}>
                    {forno.nome}
                </button>
            ))}
            
        </div>

    )
}

export default SelecionarForno