import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OngForm } from '../../components/ongs/OngForm';
import { Icon } from '../../components/common/Icon';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../hooks/useAuth';
import { ongService } from '../../services/ongService';
import '../CadastroOng/CadastroOng.css';

export default function EditarOng() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { perfil, setPerfil } = useAuth();
  const [ong, setOng] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    ongService
      .buscarPorId(id)
      .then(setOng)
      .catch((err) => {
        setErro(err.response?.status === 404 ? 'ONG não encontrada.' : 'Não foi possível carregar a ONG.');
      })
      .finally(() => setCarregando(false));
  }, [id]);

  async function handleSubmit(dados) {
    setSalvando(true);
    setErro(null);
    try {
      const atualizada = await ongService.atualizar(id, dados);
      // Mantém o nome do menu da conta em dia.
      if (perfil?.id === atualizada.id) setPerfil({ ...perfil, ...atualizada });
      navigate(`/ongs/${id}`);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="cadastro-ong">
      <div className="cadastro-ong__card">
        <div className="cadastro-ong__header">
          <div className="cadastro-ong__icon" aria-hidden="true">
            <Icon name="shelter" size={24} />
          </div>
          <div>
            <h1 className="cadastro-ong__title">Editar perfil da ONG</h1>
            <p className="cadastro-ong__subtitle">Atualize os dados da organização</p>
          </div>
        </div>

        {carregando && <Loader texto="Carregando ONG..." />}
        {erro && <p className="cadastro-ong__mensagem cadastro-ong__mensagem--erro">{erro}</p>}

        {!carregando && ong && (
          <OngForm
            ong={ong}
            onSubmit={handleSubmit}
            onErro={setErro}
            carregando={salvando}
            cancelarPara={`/ongs/${id}`}
          />
        )}
      </div>
    </div>
  );
}
