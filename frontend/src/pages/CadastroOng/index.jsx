import { useState } from 'react';
import { OngForm } from '../../components/ongs/OngForm';
import { Icon } from '../../components/common/Icon';
import { SeletorTipoCadastro } from '../../components/common/SeletorTipoCadastro';
import { ongService } from '../../services/ongService';
import './CadastroOng.css';

export default function CadastroOng() {
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  async function handleSubmit(dados) {
    setCarregando(true);
    setErro(null);
    setMensagem(null);

    try {
      await ongService.criar(dados);
      setMensagem('ONG cadastrada com sucesso!');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-ong">
      <div className="cadastro-ong__card">
        <SeletorTipoCadastro ativo="ong" />

        <div className="cadastro-ong__header">
          <div className="cadastro-ong__icon" aria-hidden="true">
            <Icon name="shelter" size={24} />
          </div>
          <div>
            <h1 className="cadastro-ong__title">Cadastro de ONG</h1>
            <p className="cadastro-ong__subtitle">Preencha os dados da organização</p>
          </div>
        </div>

        {mensagem && <p className="cadastro-ong__mensagem cadastro-ong__mensagem--sucesso">{mensagem}</p>}
        {erro && <p className="cadastro-ong__mensagem cadastro-ong__mensagem--erro">{erro}</p>}

        <OngForm onSubmit={handleSubmit} onErro={setErro} carregando={carregando} />
      </div>
    </div>
  );
}
