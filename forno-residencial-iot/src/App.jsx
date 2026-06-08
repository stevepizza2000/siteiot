import Header from "./Header"
import ModalCadastro from "./ModalCadastro"
import ModalLogin from "./ModalLogin"
import MainContent from "./MainContent"

import { useState } from "react"


function App() {

  const [ModalLoginAberto, setModalLoginAberto] = useState(true);
  const [ModalCadastroAberto, setModalCadastroAberto] = useState(false);
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
    setLogado={setLogado}
    />

    <ModalCadastro 
    aberto={ModalCadastroAberto}
    ModalLogin= {setModalLoginAberto}
    ModalCadastro={setModalCadastroAberto}
    />
    <MainContent
    ModalLogin= {setModalLoginAberto}
    Logado={Logado}
    />

  </>
)

}

export default App
