import {useState, useEffect} from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import API_URL from "./api";

function MainContent({Logado, setLogado, setModalLoginAberto, fornoSelecionado, setFornoSelecionado, admin}) {

    const [quentura, setQuentura]     = useState([]);
    const [tempo, setTempo]           = useState([]);
    const [sessoes, setSessoes]       = useState([]);
    const [eventos, setEventos]       = useState([]);
    const [dashboard, setDashboard]   = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        if (!fornoSelecionado) return;

        const fornoId    = fornoSelecionado.id;
        const controller = new AbortController();
        let timerId;

        setQuentura([]);
        setTempo([]);
        setSessoes([]);
        setEventos([]);
        setDashboard(null);
        setCarregando(true);

        const buscarDados = async () => {
            try {
                const token             = localStorage.getItem("token");
                const headers           = {"Content-Type": "application/json", "Authorization": "Bearer " + token};
                const respostaDashboard = await fetch(`${API_URL}/telemetrias/forno/${fornoId}/dashboard`,{ method: "GET", headers, signal: controller.signal });

                if (respostaDashboard.status === 401) 

            } catch (error) {
                
            }
        }

    })

}

export default MainContent;