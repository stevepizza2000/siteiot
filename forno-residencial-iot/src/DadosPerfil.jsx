function DadosPerfil({setModalEmailAberto, setModalSenhaAberto, setModalPerfilAberto, nome, email, nascimento, cpf, fotoBase64}){

    return(

        <div id="modal-perfil" role="dialog" aria-modal="true">
            <div>

                <button className="botao-fechar-perfil" onClick={() => setModalPerfilAberto(false)}>
                    <i className="bi bi-x-lg"></i>
                </button>

                <div className="perfil-coluna-esquerda">

                    <div className="perfil-foto-container">
                        {fotoBase64 ? (
                            <img src={`data:image/jpeg;base64,${fotoBase64}`} alt="Foto de perfil" />
                        ) : (
                            <i className="bi bi-person-fill"></i>
                        )}
                    </div>

                    <div className="perfil-info-card">
                        <div className="perfil-info-item">
                            <span className="label">Nome</span>
                            <span className="valor">{nome}</span>
                        </div>
                        <div className="perfil-info-item">
                            <span className="label">E-mail</span>
                            <span className="valor">{email}</span>
                        </div>
                        <div className="perfil-info-item">
                            <span className="label">Nascimento</span>
                            <span className="valor">{nascimento}</span>
                        </div>
                        <div className="perfil-info-item">
                            <span className="label">CPF</span>
                            <span className="valor">{cpf}</span>
                        </div>
                    </div>

                </div>

                <div className="perfil-coluna-direita">
                    <button onClick={() => setModalEmailAberto(true)}>
                        <i className="bi bi-envelope"></i>
                        Alterar E-mail
                    </button>
                    <button onClick={() => setModalSenhaAberto(true)}>
                        <i className="bi bi-lock"></i>
                        Alterar Senha
                    </button>
                </div>

            </div>
        </div>
    );

}

export default DadosPerfil