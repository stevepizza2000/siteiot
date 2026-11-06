import { useState, useEffect } from "react";
import API_URL, { fetchAutenticado, lerErroApi } from "./api";
import DadosPerfil from "./DadosPerfil";
import ModalEmail from "./ModalEmail";
import ModalSenha from "./ModalSenha";
import ModalConfirmar from "./ModalConfirmar";
import { redimensionarImagem } from "./redimensionarImagem";

const TAMANHO_MAXIMO_ARQUIVO = 10 * 1024 * 1024;

function ModalPerfil({ ModalPerfilAberto, Logado, setModalPerfil, sair, setMensagemSucesso }) {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [carregandoFoto, setCarregandoFoto] = useState(false);
    const [erroFoto, setErroFoto] = useState("");
    const [fotoBase64, setFotoBase64] = useState("");

    const [ModalConfirmarAberto, setModalConfirmarAberto] = useState(false);
    const [ModalEmailAberto, setModalEmail] = useState(false);
    const [ModalSenhaAberto, setModalSenha] = useState(false);

    async function buscar() {
        try {
            const resposta = await fetchAutenticado(`${API_URL}/usuario/meu-perfil`, { method: "GET" }, sair);
            if (resposta.ok) {
                const dados = await resposta.json();
                setEmail(dados.email);
                setNome(dados.nome);

                if (dados.nascimento) {
                    const [ano, mes, dia] = dados.nascimento.split("-");
                    setNascimento(`${dia}/${mes}/${ano}`);
                } else {
                    setNascimento("");
                }
            }
        } catch (erro) {
            console.log("Erro ao buscar perfil: ", erro.message);
        }

        try {
            const respostaFoto = await fetchAutenticado(`${API_URL}/usuario/foto-perfil/visualizar-img`, { method: "GET" }, sair);
            if (respostaFoto.ok) {
                const foto = await respostaFoto.json();
                setFotoBase64(foto.fotoBase64 ?? "");
            } else {
                setFotoBase64("");
            }
        } catch (erro) {
            console.log("Erro ao buscar foto: ", erro.message);
        }
    }

    useEffect(() => {
        if (!ModalPerfilAberto) return;
        setErroFoto("");
        buscar();
    }, [ModalPerfilAberto]);

    async function handleSelecionarFoto(arquivo) {
        setErroFoto("");

        if (!arquivo.type.startsWith("image/")) {
            setErroFoto("Escolha um arquivo de imagem.");
            return;
        }
        if (arquivo.size > TAMANHO_MAXIMO_ARQUIVO) {
            setErroFoto("A imagem deve ter no máximo 10 MB.");
            return;
        }

        setCarregandoFoto(true);

        try {
            const base64 = await redimensionarImagem(arquivo);
            const jaTemFoto = fotoBase64 !== "";

            const resposta = await fetchAutenticado(
                `${API_URL}/usuario/foto-perfil/${jaTemFoto ? "update-img" : "set-img"}`,
                {
                    method: jaTemFoto ? "PUT" : "POST",
                    body: JSON.stringify({
                        fotoBase64: base64,
                        usuarioId: localStorage.getItem("id")
                    })
                },
                sair
            );

            if (resposta.ok) {
                const dados = await resposta.json();
                setFotoBase64(dados.fotoBase64 ?? base64);
            } else {
                const { texto } = await lerErroApi(resposta, "Não foi possível salvar a foto.");
                setErroFoto(texto);
            }
        } catch (erro) {
            console.log("Erro ao enviar foto: ", erro.message);
            setErroFoto("Não foi possível processar a imagem. Tente outra.");
        } finally {
            setCarregandoFoto(false);
        }
    }

    async function handleRemoverFoto() {
        setErroFoto("");
        setCarregandoFoto(true);

        try {
            const resposta = await fetchAutenticado(
                `${API_URL}/usuario/foto-perfil/delete-img`,
                { method: "DELETE" },
                sair
            );

            if (resposta.ok) {
                setFotoBase64("");
            } else {
                setErroFoto("Não foi possível remover a foto.");
            }
        } catch (erro) {
            console.log("Erro ao remover foto: ", erro.message);
            setErroFoto("Erro de conexão. Tente novamente.");
        } finally {
            setCarregandoFoto(false);
        }
    }

    if (!ModalPerfilAberto) return null;

    return (
        <div>

            <DadosPerfil
                setModalEmailAberto={setModalEmail}
                setModalSenhaAberto={setModalSenha}
                setModalPerfilAberto={setModalPerfil}
                nome={nome}
                email={email}
                nascimento={nascimento}
                fotoBase64={fotoBase64}
                carregandoFoto={carregandoFoto}
                erroFoto={erroFoto}
                onSelecionarFoto={handleSelecionarFoto}
                onRemoverFoto={handleRemoverFoto}
            />

            <ModalEmail
                ModalEmailAberto={ModalEmailAberto}
                setModalEmail={setModalEmail}
                setModalConfirmarAberto={setModalConfirmarAberto}
                sair={sair}

            />

            <ModalConfirmar
                ModalConfirmarAberto={ModalConfirmarAberto}
                setModalConfirmarAberto={setModalConfirmarAberto}
                sair={sair}
                setMensagemSucesso={setMensagemSucesso}
            />

            <ModalSenha
                ModalSenhaAberto={ModalSenhaAberto}
                setModalSenha={setModalSenha}
                sair={sair}
                setMensagemSucesso={setMensagemSucesso}
            />
        </div>
    );
}

export default ModalPerfil