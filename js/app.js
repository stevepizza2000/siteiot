function validarCadastro(nomeCadastro, emailCadastro, dataCadastro, passwordCadastro, spanNomeCadastro, spanEmailCadastro, spanDataCadastro, spanPasswordCadastro){
    // confere para ver se os campos estao
    if(nomeCadastro    .value === "") {spanNomeCadastro    .textContent = "digite algo no campo";}
    if(emailCadastro   .value === "") {spanEmailCadastro   .textContent = "digite algo no campo";}
    if(dataCadastro    .value === "") {spanDataCadastro    .textContent = "digite algo no campo";}
    if(passwordCadastro.value === "") {spanPasswordCadastro.textContent = "digite algo no campo";}

    if(nomeCadastro    .value === "") {spanNomeCadastro    .textContent = "";}
    if(emailCadastro   .value === "") {spanEmailCadastro   .textContent = "";}
    if(dataCadastro    .value === "") {spanDataCadastro    .textContent = "";}
    if(passwordCadastro.value === "") {spanPasswordCadastro.textContent = "";}
}

window.onload = function() {
    // modais
    let modalLogin           = document.getElementById("modal-login"        );
    let modalCadastro        = document.getElementById("modal-cadastro"     );
    // conteúdo da pagina que ficara bloqueado até alguem ter feito login
    let secoesProtegidas     = document.getElementById("secoes-protegidas"  );
    // botões para ir de um modal a outro
    let botaoIrParaCadastro  = document.getElementById("ir-para-cadastro"   );
    let botaoIrParaLogin     = document.getElementById("ir-para-login"      );
    // botoes para fazer o cadastro
    let nomeCadastro         = document.getElementById("cadastro-nome"      );
    let emailCadastro        = document.getElementById("cadastro-email"     );
    let dataCadastro         = document.getElementById("cadastro-data"      );
    let passwordCadastro     = document.getElementById("cadastro-senha"     );
    // form do cadastro para enviar as informações
    let enviarCadastro       = document.getElementById("form-cadastro"      );
    //mensagens de alerta com span do cadastro
    let spanNomeCadastro     = document.getElementById("erro-cadastro-nome" );
    let spanEmailCadastro    = document.getElementById("erro-cadastro-email");
    let spanDataCadastro     = document.getElementById("erro-cadastro-data" );
    let spanPasswordCadastro = document.getElementById("erro-cadastro-senha");

    // faz o modal-login ser visivel inicialmente e o modal-cadastro não
    secoesProtegidas.hidden = true;
    modalLogin      .hidden = false;

    // checa caso o botão seja clicado e faz o modal-cadastro ser aberto
    botaoIrParaCadastro.addEventListener("click", function()      {
    modalLogin      .hidden = true;
    modalCadastro   .hidden = false;
    });

    // checa caso o botão seja clicado e faz o modal-login ser aberto
    botaoIrParaLogin  .addEventListener ("click",  function()     {
    modalCadastro   .hidden = true;
    modalLogin      .hidden = false;
    });

    // checa se o botão for clicado e faz entrar na funcao validarCadastro
    enviarCadastro    .addEventListener ("submit", function(event){
    event.preventDefault();
    validarCadastro(nomeCadastro, emailCadastro, dataCadastro, passwordCadastro, spanNomeCadastro, spanEmailCadastro, spanDataCadastro, spanPasswordCadastro);
    });

}

