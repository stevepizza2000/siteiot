import { useRef } from "react";

function DadosPerfil({setModalEmailAberto, setModalSenhaAberto, setModalPerfilAberto, nome, email, nascimento, fotoBase64, carregandoFoto, erroFoto, onSelecionarFoto, onRemoverFoto}) {

    const inputArquivoRef = useRef(null);

    function abrirSeletor() {
        if (!carregandoFoto) inputArquivoRef.current.click();
    }

    function handleArquivoEscolhido(e) {
        const arquivo = e.target.files[0];
        e.target.value = "";
        if (arquivo) onSelecionarFoto(arquivo);
    }

    return (
        <div id="modal-perfil" role="dialog" aria-modal="true">
            <div>

                <button className="botao-fechar-perfil" onClick={() => setModalPerfilAberto(false)}>
                    <i className="bi bi-x-lg"></i>
                </button>

                <div className="perfil-coluna-esquerda">

                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={inputArquivoRef}
                        onChange={handleArquivoEscolhido}
                    />

                    <div
                        className="perfil-foto-container"
                        role="button"
                        tabIndex={0}
                        aria-label="Trocar foto de perfil"
                        onClick={abrirSeletor}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") abrirSeletor();
                        }}
                    >
                        {fotoBase64 ? (
                            <img src={`data:image/jpeg;base64,${fotoBase64}`} alt="Foto de perfil" />
                        ) : (
                            <i className="bi bi-person-fill"></i>
                        )}
                    </div>

                    {carregandoFoto && <p>Enviando foto...</p>}
                    <span className="erro-foto" role="alert">{erroFoto}</span>

                    {fotoBase64 && (
                        <button
                            type="button"
                            className="botao-remover-foto"
                            onClick={onRemoverFoto}
                            disabled={carregandoFoto}
                        >
                            Remover foto
                        </button>
                    )}

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