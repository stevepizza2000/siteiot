import { useState } from "react";

function ModalCadastro({aberto, ModalLogin, ModalCadastro}) {

    const [Nome, setNome] = useState("");
    const [Email, setEmail] = useState("");
    const [Date, setDate] = useState("");
    const [Password, setPassword] = useState("");


    if (!aberto) return null;

    return (
        <div id="modal-cadastro" role="dialog" aria-modal="true" aria-labelledby="titulo-cadastro">
        <div>

            <div id="titulo-cadastro"><h2>Criar conta</h2></div>

            <form id="form-cadastro" noValidate>

                <div>
                    <label htmlFor="nome">Nome Completo</label>
                    <input 
                    value={Nome}
                    onChange={(e) => setNome(e.target.value)}
                    type="text" id="cadastro-nome"
                    placeholder="Digite Seu Nome Completo"
                    autoComplete="name" 
                    required/>
                    <span id="erro-cadastro-nome" role="alert"></span>
                </div>

                <div>
                    <label htmlFor="cadastro-email">E-mail</label>
                    <input 
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email" 
                    id="cadastro-email" 
                    name="email" autoComplete="email" 
                    placeholder="Digite Seu E-mail" 
                    required/>
                    <span id="erro-cadastro-email" role="alert"></span>
                </div>

                <div>
                    <label htmlFor="cadastro-data">Data De Nascimento</label>
                    <input 
                    value={Date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date" 
                    id="cadastro-data" 
                    name="data" 
                    autoComplete="data" 
                    placeholder="Digite Sua Data De Nascimento" 
                    required/>
                    <span id="erro-cadastro-data" role="alert"></span>
                </div>

                <div>
                    <label htmlFor="cadastro-senha">Senha</label>
                    <input 
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password" 
                    id="cadastro-senha" 
                    name="senha" 
                    autoComplete="new-password" 
                    placeholder="Digite Sua Senha" 
                    required/>
                    <span id="erro-cadastro-senha" role="alert"></span>
                </div>

                <button type="submit">Criar Conta</button>

                <p>Já tem uma conta? <button type="button" id="ir-para-login" 
                onClick={() => {ModalLogin(true); ModalCadastro(false)}}
                >Entrar</button></p>

            </form>

        </div>
    </div>
    )
}

export default ModalCadastro