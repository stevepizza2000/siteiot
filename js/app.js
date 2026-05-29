function validarCadastro(nomeCadastro, emailCadastro, dataCadastro, passwordCadastro, spanNomeCadastro, spanEmailCadastro, spanDataCadastro, spanPasswordCadastro, modalLogin, modalCadastro){
    // variavel para checar se o form passa nas verificações basicas, como todos os campos estarem preenchidos
    let formularioValido          = true;
    // mascara para o email e senha com regex 
    let padraoEmail               = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let padraoSenhaCaracteres     = /.{8,}/;
    let padraoSenhaLetraMaiuscula = /[A-Z]/;
    let padraoSenhaNumeros        = /\d/;

    // confere para ver se os campos estao preenchidos
    // campo do nome cadastro
    if(nomeCadastro    .value === "") {
        spanNomeCadastro    .textContent = "digite algo no campo";
        formularioValido = false;
    } else                            {
        spanNomeCadastro    .textContent = "";
    }

    // campo do email cadastro
    if(emailCadastro   .value === "") {
        spanEmailCadastro   .textContent = "digite algo no campo";
        formularioValido = false;
    } else if (!padraoEmail.test(emailCadastro.value)) {
        spanEmailCadastro   .textContent = "Digite um E-mail real";
        formularioValido = false;
    } else                            {
        spanEmailCadastro.textContent = "";
    }

    // campo da data cadastro
    if(dataCadastro    .value === "") {
        spanDataCadastro    .textContent = "digite algo no campo";
        formularioValido = false;
    } else                            {
        spanDataCadastro    .textContent = "";
    }

    // campo da senha do cadastro
    if(passwordCadastro.value === "") {
        spanPasswordCadastro.textContent = "digite algo no campo";
        formularioValido = false;
    } else if (!padraoSenhaCaracteres.test(passwordCadastro.value))     {
        spanPasswordCadastro.textContent = "A senha deve conter ao menos 8 caracteres";
        formularioValido = false;
    } else if (!padraoSenhaLetraMaiuscula.test(passwordCadastro.value)) {
        spanPasswordCadastro.textContent = "A senha deve conter ao menos uma letra maiuscula";
        formularioValido = false;
    } else if (!padraoSenhaNumeros.test(passwordCadastro.value))        {
        spanPasswordCadastro.textContent = "A senha deve conter ao menos um numero"
        formularioValido = false;
    } else                            {
        spanPasswordCadastro.textContent = "";
    }

    // se estiver tudo certo a requisicao passa
    if (formularioValido === true) {
        console.log("cadastro aceito");
        modalLogin      .hidden = false;
        modalCadastro   .hidden = true;
    }

}

function validarLogin (emailLogin, senhaLogin, spanEmailLogin, spanSenhaLogin, modalLogin, secoesProtegidas, acoesLogado, acoesdeslogado) {
    // variavel para checar se o form passa nas verificações basicas, como todos os campos estarem preenchidos
    let formularioValido = true; 

    // campo para checar se algo foi digitado no email
    if (emailLogin.value === ""){
        spanEmailLogin.textContent = "E-mail ou senha incorretos";
        formularioValido = false;
    } else                      {
        spanEmailLogin.textContent = "";
    }

    //campo para checar se algo foi digitado na senha
    if (senhaLogin.value === ""){
        spanSenhaLogin.textContent = "E-mail ou senha incorretos";
        formularioValido = false;
    } else                      {
        spanSenhaLogin.textContent = "";
    }

    // se estiver tudo certo a requisicao passa
    if (formularioValido === true) {
        console.log("Login aceito")    ;
        modalLogin      .hidden = true ;
        secoesProtegidas.hidden = false;
        acoesLogado     .hidden = false;
        acoesdeslogado  .hidden = true ;  
    }
}

window.onload = function() {
    // modais
    let modalLogin            = document.getElementById("modal-login"        );
    let modalCadastro         = document.getElementById("modal-cadastro"     );
    // acoes do usuario
    let acoesLogado           = document.getElementById("acoes-logado"       );
    let acoesdeslogado        = document.getElementById("acoes-login"        );
    // conteúdo da pagina que ficara bloqueado até alguem ter feito login
    let secoesProtegidas      = document.getElementById("secoes-protegidas"  );
    // botões para ir de um modal a outro
    let botaoIrParaCadastro   = document.getElementById("ir-para-cadastro"   );
    let botaoIrParaLogin      = document.getElementById("ir-para-login"      );
    // inputs para fazer o cadastro
    let nomeCadastro          = document.getElementById("cadastro-nome"      );
    let emailCadastro         = document.getElementById("cadastro-email"     );
    let dataCadastro          = document.getElementById("cadastro-data"      );
    let passwordCadastro      = document.getElementById("cadastro-senha"     );
    // inputs para fazer o login
    let emailLogin            = document.getElementById("login-email"        );
    let senhaLogin            = document.getElementById("login-senha"        );
    // form do cadastro para enviar as informacoes
    let enviarCadastro        = document.getElementById("form-cadastro"      );
    // form do login para enviar as informacoes
    let enviarLogin           = document.getElementById("form-login"         );
    //mensagens de alerta com span do cadastro
    let spanNomeCadastro      = document.getElementById("erro-cadastro-nome" );
    let spanEmailCadastro     = document.getElementById("erro-cadastro-email");
    let spanDataCadastro      = document.getElementById("erro-cadastro-data" );
    let spanPasswordCadastro  = document.getElementById("erro-cadastro-senha");
    //mensagens de alerta com span do login
    let spanEmailLogin        = document.getElementById("erro-login-email"   );
    let spanSenhaLogin        = document.getElementById("erro-login-senha"   );
    // mensagem de aviso caso o usuario burle o modal
    let avisoAuth             = document.getElementById("aviso-auth"         );
    // sair da conta
    let sairConta             = document.getElementById("botao-sair"         );
    // botoes do acoes login
    let botaoLoginSemModal    = document.getElementById("botao-login"        );
    let botaoCadastroSemModal = document.getElementById("botao-cadastro"     );

    // faz o modal-login ser visivel inicialmente e o modal-cadastro não
    secoesProtegidas.hidden = true ;
    modalLogin      .hidden = false;
    avisoAuth       .hidden = true ;
    acoesLogado     .hidden = true ;
    acoesdeslogado  .hidden = false;

    // checa caso o botão seja clicado e faz o modal-cadastro ser aberto
    botaoIrParaCadastro  .addEventListener("click", function()      {
    modalLogin      .hidden = true ;
    modalCadastro   .hidden = false;
    });

    // checa caso o botão seja clicado e faz o modal-login ser aberto
    botaoIrParaLogin     .addEventListener ("click",  function()     {
    modalCadastro    .hidden = true ;
    modalLogin       .hidden = false;
    });

    // checa se o botão for clicado e faz entrar na funcao validarCadastro
    enviarCadastro       .addEventListener ("submit", function(event){
    event.preventDefault();
    validarCadastro(nomeCadastro, emailCadastro, dataCadastro, passwordCadastro, spanNomeCadastro, spanEmailCadastro, spanDataCadastro, spanPasswordCadastro, modalLogin, modalCadastro);
    });

    enviarLogin          .addEventListener ("submit", function(event){
    event.preventDefault();
    validarLogin(emailLogin, senhaLogin, spanEmailLogin, spanSenhaLogin, modalLogin, secoesProtegidas, acoesLogado, acoesdeslogado);
    });

    sairConta            .addEventListener ("click",  function()      {
    modalLogin      .hidden = false;
    secoesProtegidas.hidden = true ;
    acoesLogado     .hidden = true ;
    acoesdeslogado  .hidden = false;
    });

    botaoLoginSemModal   .addEventListener ("click",  function(){
    modalLogin      .hidden = false;
    modalCadastro   .hidden = true;
    });

    botaoCadastroSemModal.addEventListener ("click",  function(){
    modalCadastro   .hidden = false;
    modalLogin      .hidden = true;
    });
}

