import Header from "./Header"
import ModalCadastro from "./ModalCadastro"
import ModalLogin from "./ModalLogin"
import MainContent from "./MainContent"

import { useState } from "react"


function App() {

  const [ModalLoginAberto, setModalLoginAberto] = useState(true);
  const [ModalCadastroAberto, setModalCadastroAberto] = useState(false);
 

  return (
   <>

  <Header/>

  <ModalLogin 
  aberto={ModalLoginAberto} 
  ModalLogin={setModalLoginAberto}
  ModalCadastro={setModalCadastroAberto}
  />

  <ModalCadastro 
  aberto={ModalCadastroAberto}
  ModalLogin= {setModalLoginAberto}
  ModalCadastro={setModalCadastroAberto}
  />
  <MainContent/>

   </>
  )

}

export default App
