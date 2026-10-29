import Header from "./Header";
import ModalCadastro from "./ModalCadastro";
import ModalLogin from "./ModalLogin";
import MainContent from "./MainContent";
import ModalEsqueciSenha from "./ModalEsqueciSenha";
import PaginaRedefinirSenha from "./PaginaRedefinirSenha";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SelecionarForno from "./SelecionarForno";
import { useState, useEffect } from "react";
import PainelAdmin from "./PainelAdmin";
import ModalPerfil from "./ModalPerfil";
import { jwtDecode } from "jwt-decode";
import API_URL from "./api";

function App() {
  const [ModalLoginAberto, setModalLoginAberto] = useState(true);
  const [ModalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [ModalEsqueciSenhaAberto, setModalEsqueciSenha] = useState(false);
  const [ModalPerfilAberto, setModalPerfil] = useState(false);
  const [Logado, setLogado] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [fornoSelecionado, setFornoSelecionado] = useState(null);
  const [admin, setAdmin] = useState(false);
  let [verificandoAuth, setVerificandoAuth] = useState(true);

  const sair = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken })
        });
      } catch (e) {
        console.error("Erro ao revogar sessão:", e);
      }
    }
    
    setLogado(false);
    setAdmin(false);
    setFornoSelecionado(null);
    setModalPerfil(false);
    setModalLoginAberto(true);
    
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
        try {
            const tokenDecodificado = jwtDecode(token);
            // Verifica se o token expirou (exp é em segundos, Date.now em ms)
            if (tokenDecodificado.exp * 1000 < Date.now()) {
                sair(); // Token vencido: limpa tudo
            } else {
                setModalLoginAberto(false);
                setLogado(true);
                if (tokenDecodificado.role === "ADMIN" || tokenDecodificado.role === "ROLE_ADMIN") {
                    setAdmin(true);
                }
            }
        } catch (erro) {
            console.log("Erro ao ler token no App.jsx: " + erro.message);
            sair();
        }
    }
    setVerificandoAuth(false); 
  }, []);

  useEffect(() => {
      if (mensagemSucesso !== "") {
        const timer = setTimeout(() => {
          setMensagemSucesso("");
        }, 45000);
        return () => clearTimeout(timer);
      }
  }, [mensagemSucesso]);

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={
            verificandoAuth ? (
            <p>Carregando...</p>
    ) : admin ? (
        <Navigate to="/admin" replace />
    ) : (
            <>
              <Header
              Logado={Logado}
              setModalLoginAberto={setModalLoginAberto}
              setFornoSelecionado={setFornoSelecionado}
              setModalPerfil={setModalPerfil}
              admin={admin}
              fornoSelecionado={fornoSelecionado}
              sair={sair}
              />

              <ModalPerfil
              Logado={Logado}
              ModalPerfilAberto={ModalPerfilAberto}
              setModalPerfil={setModalPerfil}
              />

              <ModalLogin 
              aberto={ModalLoginAberto} 
              setModalLogin={setModalLoginAberto}
              ModalCadastro={setModalCadastroAberto}
              ModalEsqueciSenha={setModalEsqueciSenha}
              setLogado={setLogado}
              mensagemSucesso={mensagemSucesso}
              setAdmin={setAdmin}
              />

              <SelecionarForno
              fornoSelecionado={fornoSelecionado}
              Logado={Logado}
              setFornoSelecionado={setFornoSelecionado}
              admin={admin}
              />

              <ModalEsqueciSenha
              setModalLoginAberto={setModalLoginAberto}
              ModalEsqueciSenhaAberto={ModalEsqueciSenhaAberto}
              ModalEsqueciSenhaSet={setModalEsqueciSenha}
              setMensagemSucesso={setMensagemSucesso}
              />

              <ModalCadastro 
              aberto={ModalCadastroAberto}
              ModalLogin={setModalLoginAberto}
              ModalCadastro={setModalCadastroAberto}
              />

              <MainContent
              setFornoSelecionado={setFornoSelecionado}
              setModalLoginAberto={setModalLoginAberto}
              Logado={Logado}
              setLogado={setLogado}
              fornoSelecionado={fornoSelecionado}
              admin={admin}
              sair={sair}
              />
            </>
    )
          }/>

          <Route path="/redefinir-senha" element={
              <PaginaRedefinirSenha />
          }/>

          <Route path="/admin" element={
            verificandoAuth ? (
            <p>Carregando...</p>
              ) : admin && Logado ? (
                <>
                  <Header
                  Logado={Logado}
                  setModalLoginAberto={setModalLoginAberto}
                  setFornoSelecionado={setFornoSelecionado}
                  admin={admin}
                  setModalPerfil={setModalPerfil}
                  fornoSelecionado={fornoSelecionado}
                  sair={sair}
                  />

                  <PainelAdmin 
                  admin={admin} 
                  setAdmin={setAdmin}
                  sair={sair} 
                  />
                </>
              ) : (
                  <Navigate to="/" replace />
              )
          }/>
        </Routes>
   </BrowserRouter>   
  )
}

export default App;