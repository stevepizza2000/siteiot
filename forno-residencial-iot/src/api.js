const API_URL = "/v1";

export default API_URL;

export async function fetchAutenticado(url, opcoes = {}, sair) {
    let token = localStorage.getItem("token");
    
    // Configura os cabeçalhos iniciais
    const headersIniciais = {
        "Content-Type": "application/json",
        ...opcoes.headers,
    };
    
    if (token) {
        headersIniciais["Authorization"] = `Bearer ${token}`;
    }

    let resposta = await fetch(url, { ...opcoes, headers: headersIniciais });

    // Se o token estiver vencido/inválido
    if (resposta.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!refreshToken) {
            sair();
            return resposta; 
        }

        // Tenta renovar
        const resRenovar = await fetch(`${API_URL}/auth/renovar-refresh-token`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });

        if (resRenovar.ok) {
            const dados = await resRenovar.json();
            localStorage.setItem("token", dados.novoToken);
            
            // Repete a requisição original com o novo token
            const headersRenovados = {
                ...headersIniciais,
                "Authorization": `Bearer ${dados.novoToken}`
            };
            
            resposta = await fetch(url, { ...opcoes, headers: headersRenovados });
        } else {
            // Se o refresh token também falhar/vencer, expulsa o usuário
            sair();
        }
    }

    return resposta;
}