import Header from "./Header"
import ModalCadastro from "./ModalCadastro"
import ModalLogin from "./ModalLogin"
import MainContent from "./MainContent"
import ModalEsqueciSenha from "./ModalEsqueciSenha"
import PaginaRedefinirSenha from "./PaginaRedefinirSenha"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelecionarForno from "./SelecionarForno";
import { useState, useEffect } from "react"

function App() {

  const [ModalLoginAberto, setModalLoginAberto] = useState(true);
  const [ModalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [ModalEsqueciSenhaAberto, setModalEsqueciSenha] = useState(false);
  const [Logado, setLogado] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [fornoSelecionado, setFornoSelecionado] = useState(null);

  useEffect(() =>{

    const token = localStorage.getItem("token");

    if (token){
      setModalLoginAberto(false);
      setLogado(true);
    }
  
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
            <>

              <Header
              Logado={Logado}
              setLogado={setLogado}
              setModalLoginAberto= {setModalLoginAberto}
              />

              <ModalLogin 
              aberto={ModalLoginAberto} 
              setModalLogin={setModalLoginAberto}
              ModalCadastro={setModalCadastroAberto}
              ModalEsqueciSenha={setModalEsqueciSenha}
              setLogado={setLogado}
              mensagemSucesso = {mensagemSucesso}
              />

              <SelecionarForno
                fornoSelecionado = {fornoSelecionado}
                Logado = {Logado}
                setFornoSelecionado = {setFornoSelecionado}
              />

              <ModalEsqueciSenha
              setModalLoginAberto={setModalLoginAberto}
              ModalEsqueciSenhaAberto={ModalEsqueciSenhaAberto}
              ModalEsqueciSenhaSet={setModalEsqueciSenha}
              setMensagemSucesso = {setMensagemSucesso}
              />

              <ModalCadastro 
              aberto={ModalCadastroAberto}
              ModalLogin= {setModalLoginAberto}
              ModalCadastro={setModalCadastroAberto}
              />

              <MainContent
              setModalLoginAberto= {setModalLoginAberto}
              Logado={Logado}
              setLogado={setLogado}
              fornoSelecionado={fornoSelecionado}
              />
            
            </>
          }/>

          <Route path="/redefinir-senha" element=  {
              <PaginaRedefinirSenha
              
              />
          }/>

        </Routes>
   </BrowserRouter>   
)

}

export default App
