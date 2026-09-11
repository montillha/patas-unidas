import { useState } from 'react';
import { UsuarioForm } from '../../components/usuarios/UsuarioForm';
import { Icon } from '../../components/common/Icon';
import { SeletorTipoCadastro } from '../../components/common/SeletorTipoCadastro';
import { usuarioService } from '../../services/usuarioService';
import './CadastroUsuario.css';

export default function CadastroUsuario() {
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  async function handleSubmit(dados) {
    setCarregando(true);
    setErro(null);
    setMensagem(null);

    try {
      await usuarioService.criar(dados);
      setMensagem('Cadastro realizado com sucesso!');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-usuario">
      <div className="cadastro-usuario__card">
        <SeletorTipoCadastro ativo="usuario" />

        <div className="cadastro-usuario__header">
          <div className="cadastro-usuario__icon" aria-hidden="true">
            <Icon name="paw" size={24} />
          </div>
          <div>
            <h1 className="cadastro-usuario__title">Cadastro de tutor</h1>
            <p className="cadastro-usuario__subtitle">Crie sua conta para adotar um pet</p>
          </div>
        </div>

        {mensagem && <p className="cadastro-usuario__mensagem cadastro-usuario__mensagem--sucesso">{mensagem}</p>}
        {erro && <p className="cadastro-usuario__mensagem cadastro-usuario__mensagem--erro">{erro}</p>}

        <UsuarioForm onSubmit={handleSubmit} onErro={setErro} carregando={carregando} />
      </div>
    </div>
  );
}
