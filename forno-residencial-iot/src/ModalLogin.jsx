function ModalLogin () {

    return (
        <div id="modal-login" role="dialog" aria-modal="true" aria-labelledby="titulo-login" hidden>
        <div>

            <h2 id="titulo-login">Entrar</h2>

            <form id="form-login" noValidate>

                <div>
                    <label htmlFor="login-email">E-mail</label>
                    <input type="email" id="login-email" name="email" placeholder="Digite Seu E-mail" autoComplete="email" required/>
                    <span id="erro-login-email" role="alert"></span>
                </div>

                <div>
                    <label htmlFor="login-senha">Senha</label>
                    <input type="password" id="login-senha" name="senha" placeholder="Digite sua senha" autoComplete="current-password" required/>
                    <span id="erro-login-senha" role="alert"></span>
                </div>

                <button type="submit">Entrar</button>

                <p>Não tem uma conta?<button type="button" id="ir-para-cadastro">Criar Conta</button></p>

            </form>
        </div>
    </div>
    )

}

export default ModalLogin