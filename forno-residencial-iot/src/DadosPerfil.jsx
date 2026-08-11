

function DadosPerfil({setModalEmailAberto, setModalSenhaAberto, setModalPerfilAberto}){


    return(
        
        <div id="modal-perfil" role="dialog" aria-modal="true">
            <div>
                <p>{nome}</p>
                <p>{email}</p>
                <p>{nascimento}</p>

                <button onClick={() => setModalEmailAberto(true)}>Alterar E-mail</button>
                <button onClick={() => setModalSenhaAberto(true)}>Alterar Senha</button>

                <button onClick={() => setModalPerfil(false)}>Fechar</button>
            </div>  
        </div>
    );

}

export default DadosPerfil