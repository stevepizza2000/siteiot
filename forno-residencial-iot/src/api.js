import { jwtDecode } from "jwt-decode";

const API_URL = "/v1";

export default API_URL;

let renovacaoEmAndamento = null;

function tokenVencido(token, margemSegundos = 10) {
    if (!token) return true;
    try {
        const { exp } = jwtDecode(token);
        return !exp || exp * 1000 < Date.now() + margemSegundos * 1000;
    } catch {
        return true;
    }
}

async function executarRenovacao() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return "recusado";

    try {
        const resposta = await fetch(`${API_URL}/auth/renovar-refresh-token`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });

        if (!resposta.ok) return "recusado";

        const dados = await resposta.json();
        localStorage.setItem("token", dados.novoToken);
        localStorage.setItem("refreshToken", dados.refreshToken);
        return "ok";
    } catch {
        return "erro";
    }
}

function renovarToken() {
    if (!renovacaoEmAndamento) {
        renovacaoEmAndamento = executarRenovacao().finally(() => {
            renovacaoEmAndamento = null;
        });
    }
    return renovacaoEmAndamento;
}


function montarHeaders(opcoes, token) {
    const headers = {
        "Content-Type": "application/json",
        ...opcoes.headers,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

export async function fetchAutenticado(url, opcoes = {}, sair) {
    const deslogar = () => {
        if (typeof sair === "function") sair();
    };

    if (tokenVencido(localStorage.getItem("token"))) {
        const resultado = await renovarToken();
        if (resultado === "recusado") {
            deslogar();
        }
    }

    let tokenUsado = localStorage.getItem("token");
    let resposta = await fetch(url, { ...opcoes, headers: montarHeaders(opcoes, tokenUsado) });

    if (resposta.status !== 401 && resposta.status !== 403) {
        return resposta;
    }

    const tokenAtual = localStorage.getItem("token");

    if (tokenAtual && tokenAtual !== tokenUsado) {
        return fetch(url, { ...opcoes, headers: montarHeaders(opcoes, tokenAtual) });
    }

    const deveRenovar = resposta.status === 401 || tokenVencido(tokenUsado, 0);
    if (!deveRenovar) {
        return resposta;
    }

    const resultado = await renovarToken();

    if (resultado === "ok") {
        const novoToken = localStorage.getItem("token");
        return fetch(url, { ...opcoes, headers: montarHeaders(opcoes, novoToken) });
    }

    if (resultado === "recusado") {
        deslogar();
    }
    return resposta;
}

export async function lerErroApi(resposta, textoPadrao) {
    const corpo = await resposta.text().catch(() => "");
    let campos = null;

    try {
        const json = JSON.parse(corpo);
        if (json && typeof json === "object") campos = json;
    } catch {
    }

    const texto = campos ? Object.values(campos).join(" ") : corpo;

    return { texto: texto || textoPadrao, campos };
}