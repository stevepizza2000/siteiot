import Header from "./Header"
import ModalCadastro from "./ModalCadastro"
import ModalLogin from "./ModalLogin"
import MainContent from "./MainContent"
import ModalEsqueciSenha from "./ModalEsqueciSenha"
import PaginaRedefinirSenha from "./PaginaRedefinirSenha"
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState, useEffect } from "react"

function App() {

  const [ModalLoginAberto, setModalLoginAberto] = useState(true);
  const [ModalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [ModalEsqueciSenhaAberto, setModalEsqueciSenha] = useState(false);
  const [Logado, setLogado] = useState(false);

  useEffect(() =>{

    const token = localStorage.getItem("token");

    if (token){
      setModalLoginAberto(false);
      setLogado(true);
    }
  
    }, []);

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
              />

              <ModalEsqueciSenha
              setModalLoginAberto={setModalLoginAberto}
              ModalEsqueciSenhaAberto={ModalEsqueciSenhaAberto}
              ModalEsqueciSenhaSet={setModalEsqueciSenha}
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
