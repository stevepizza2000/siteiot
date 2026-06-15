import { useState } from "react";

function ModalEsqueciSenha({setModalLoginAberto, ModalEsqueciSenhaAberto, ModalEsqueciSenhaSet}) {



    if (!ModalEsqueciSenhaAberto) return null;

    return(

            <div id="modal-esqueci-senha" role="dialog" aria-modal="true" aria-labelledby="titulo-esqueci-senha">
            <div>

                <h2 id="titulo-esqueci-senha">Esqueci a Senha</h2>

                <form id="form-esqueci-senha" noValidate>

                    <div>
                        <label htmlFor="esqueci-senha-email">E-mail</label>
                        <input type="email" id="esqueci-senha-email" name="email" placeholder="Digite seu E-mail" autoComplete="email" required/>
                        <span id="erro-esqueci-senha-email" role="alert"></span>
                    </div>

                    <button type="submit">Mandar</button>

                    <p>Lembrou sua senha?<button type="button" id="ir-para-login" onClick={() => {setModalLoginAberto(true); ModalEsqueciSenhaSet(false)}}>Login</button></p>

                </form>

            </div>    

            </div>

    )

}

export default ModalEsqueciSenha