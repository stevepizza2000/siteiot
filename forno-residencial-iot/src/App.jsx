import Header from "./Header"
import ModalCadastro from "./ModalCadastro"
import ModalLogin from "./ModalLogin"
import MainContent from "./MainContent"
import ModalEsqueciSenha from "./ModalEsqueciSenha"

import { useState, useEffect } from "react"



useEffect(() =>{

}, []);


function App() {

  const [ModalLoginAberto, setModalLoginAberto] = useState(true);
  const [ModalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [ModalEsqueciSenhaAberto, setModalEsqueciSenha] = useState(false);
  const [Logado, setLogado] = useState(false);

  return (
  <>

    <Header
    Logado={Logado}
    setLogado={setLogado}
    setModalLoginAberto= {setModalLoginAberto}
    />

    <ModalLogin 
    aberto={ModalLoginAberto} 
    ModalLogin={setModalLoginAberto}
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
    ModalLogin= {setModalLoginAberto}
    Logado={Logado}
    setLogado={setLogado}
    />

  </>
)

}

export default App
