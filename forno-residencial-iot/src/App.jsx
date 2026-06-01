import Header from "./Header"

function App() {

  return (
   <>

  <Header/>
 


    <div id="modal-cadastro" role="dialog" aria-modal="true" aria-labelledby="titulo-cadastro" hidden>
        <div>

            <div id="titulo-cadastro"><h2>Criar conta</h2></div>

            <form id="form-cadastro" noValidate>

                <div>
                    <label htmlFor="nome">Nome Completo</label>
                    <input type="text" id="cadastro-nome"  placeholder="Digite Seu Nome Completo" autoComplete="name" required/>
                    <span id="erro-cadastro-nome" role="alert"></span>
                </div>

                <div>
                    <label htmlFor="cadastro-email">E-mail</label>
                    <input type="email" id="cadastro-email" name="email" autoComplete="email" placeholder="Digite Seu E-mail" required/>
                    <span id="erro-cadastro-email" role="alert"></span>
                </div>

                <div>
                    <label htmlFor="cadastro-data">Data De Nascimento</label>
                    <input type="date" id="cadastro-data" name="data" autoComplete="data" placeholder="Digite Sua Data De Nascimento" required/>
                    <span id="erro-cadastro-data" role="alert"></span>
                </div>

                <div>
                    <label htmlFor="cadastro-senha">Senha</label>
                    <input type="password" id="cadastro-senha" name="senha" autoComplete="new-password" placeholder="Digite Sua Senha" required/>
                    <span id="erro-cadastro-senha" role="alert"></span>
                </div>

                <button type="submit">Criar Conta</button>

                <p>Já tem uma conta? <button type="button" id="ir-para-login">Entrar</button></p>
            </form>

        </div>
    </div>

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

    <main>
            
        <div id="aviso-auth" hidden>
            <p>Faça login ou crie uma conta para continuar.</p>
            <button id="aviso-btn-login">Entrar</button>
            <button id="aviso-btn-cadastro">Criar Conta</button>
        </div>

        <div id="secoes-protegidas">

            <section id="dashboard" aria-labelledby="titulo-dashboard">
                <h2 id="titulo-dashboard">Dashboard</h2>
                <p>status do sistema</p>
            </section>

            <section id="temperatura" aria-labelledby="titulo-temperatura">
                <h2 id="titulo-temperatura">Temperatura</h2>
                <p>72C°</p>
            </section>

            <section id="temporizador" aria-labelledby="titulo-temporizador">
                <h2 id="titulo-temporizador">Temporizador</h2>
                <p>minutos</p>
            </section>

            <section id="alertas" aria-labelledby="titulo-alertas">
                <h2 id="titulo-alertas">Alertas</h2>
                <p>Nenhum Alerta No Momento</p>
            </section>

            <section id="graficos" aria-labelledby="titulo-graficos">
                <h2 id="titulo-graficos">Gráficos</h2>
                <p>Gráficos</p>
            </section>

            <section id="configuracoes" aria-labelledby="titulo-configuracoes">
                <h2 id="titulo-configuracoes">Configurações</h2>
                <p>Preferencias Do Sistema</p>
            </section>
        </div>

    </main>
   </>
  )

}

export default App
