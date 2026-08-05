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

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
        setModalLoginAberto(false);
        setLogado(true);

        try {
            const tokenDecodificado = jwtDecode(token);
            if (tokenDecodificado.role === "ADMIN" || tokenDecodificado.role === "ROLE_ADMIN") {
                setAdmin(true);
            }
        } catch (erro) {
            console.log("Erro ao ler token no App.jsx");
        }
    }

    setVerificandoAuth(false); 

}, []);

    useEffect(() => {

      if (mensagemSucesso !== "" ) {
        
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
              setLogado={setLogado}
              setModalLoginAberto= {setModalLoginAberto}
              setAdmin= {setAdmin}
              setFornoSelecionado= {setFornoSelecionado}
              setModalPerfil= {setModalPerfil}
              admin= {admin}
              />

              <ModalPerfil
              Logado= {Logado}
              ModalPerfil= {ModalPerfilAberto}
              />

              <ModalLogin 
              aberto={ModalLoginAberto} 
              setModalLogin={setModalLoginAberto}
              ModalCadastro={setModalCadastroAberto}
              ModalEsqueciSenha={setModalEsqueciSenha}
              setLogado={setLogado}
              mensagemSucesso = {mensagemSucesso}
              setAdmin={setAdmin}
              />

              <SelecionarForno
              fornoSelecionado= {fornoSelecionado}
              Logado= {Logado}
              setFornoSelecionado= {setFornoSelecionado}
              admin= {admin}
              />

              <ModalEsqueciSenha
              setModalLoginAberto={setModalLoginAberto}
              ModalEsqueciSenhaAberto={ModalEsqueciSenhaAberto}
              ModalEsqueciSenhaSet={setModalEsqueciSenha}
              setMensagemSucesso= {setMensagemSucesso}
              />

              <ModalCadastro 
              aberto={ModalCadastroAberto}
              ModalLogin= {setModalLoginAberto}
              ModalCadastro={setModalCadastroAberto}
              />

              <MainContent
              setFornoSelecionado= {setFornoSelecionado}
              setModalLoginAberto= {setModalLoginAberto}
              Logado={Logado}
              setLogado={setLogado}
              fornoSelecionado={fornoSelecionado}
              admin= {admin}
              />
            
            </>
    )
          }/>

          <Route path="/redefinir-senha" element=  {
              <PaginaRedefinirSenha
              
              />
          }/>

          <Route path="/admin" element= {
            verificandoAuth ? (
            <p>Carregando...</p>
              ) : admin ? (
                <>

                  <Header
                  Logado={Logado}
                  setLogado={setLogado}
                  setModalLoginAberto= {setModalLoginAberto}
                  setAdmin= {setAdmin}
                  setFornoSelecionado= {setFornoSelecionado}
                  admin= {admin}
                  />

                  <PainelAdmin 
                  admin={admin} 
                  setAdmin={setAdmin} 
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

export default App
