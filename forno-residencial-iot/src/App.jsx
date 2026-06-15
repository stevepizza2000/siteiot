import Header from "./Header"
import ModalCadastro from "./ModalCadastro"
import ModalLogin from "./ModalLogin"
import MainContent from "./MainContent"
import ModalEsqueciSenha from "./ModalEsqueciSenha"

import { useState } from "react"


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
    ModalEsqueciSenha={ModalEsqueciSenhaAberto}
    setLogado={setLogado}
    />

    <ModalEsqueciSenha
    ModalEsqueciSenhaAberto={ModalEsqueciSenhaAberto}
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
