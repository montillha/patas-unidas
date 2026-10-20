import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../../components/common/Icon';
import { Loader } from '../../components/common/Loader';
import { PetForm } from '../../components/pets/PetForm';
import { useAuth } from '../../hooks/useAuth';
import { petService } from '../../services/petService';
import './CadastroPet.css';

// Mesma tela para cadastrar (/pets/cadastro) e editar (/pets/:id/editar).
export default function CadastroPet() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();
  const { perfil } = useAuth();

  const [pet, setPet] = useState(null);
  const [carregandoPet, setCarregandoPet] = useState(editando);
  const [erroCarga, setErroCarga] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!editando) return;
    setCarregandoPet(true);
    setErroCarga(null);
    petService
      .buscarPorId(id)
      .then(setPet)
      .catch((err) => {
        setErroCarga(err.response?.status === 404 ? 'Pet não encontrado.' : 'Não foi possível carregar o pet.');
      })
      .finally(() => setCarregandoPet(false));
  }, [id, editando]);

  async function handleSubmit(dados, fotos) {
    setCarregando(true);
    setErro(null);
    try {
      const salvo = editando
        ? await petService.atualizar(id, dados, fotos)
        : await petService.criar(dados, fotos);
      navigate(`/pets/${salvo.id}`);
    } finally {
      setCarregando(false);
    }
  }

  const semPermissao = editando && pet && pet.ong_id !== perfil?.id;
  const rotaCancelar = editando ? `/pets/${id}` : '/pets';

  return (
    <div className="cadastro-pet">
      <div className="cadastro-pet__card">
        <div className="cadastro-pet__header">
          <div className="cadastro-pet__icon" aria-hidden="true">
            <Icon name="paw" size={24} />
          </div>
          <div>
            <h1 className="cadastro-pet__title">{editando ? 'Editar pet' : 'Cadastro de pet'}</h1>
            {perfil?.nome && <p className="cadastro-pet__subtitle">{perfil.nome}</p>}
          </div>
        </div>

        {carregandoPet && <Loader texto="Carregando pet..." />}

        {!carregandoPet && erroCarga && (
          <p className="cadastro-pet__mensagem cadastro-pet__mensagem--erro">{erroCarga}</p>
        )}

        {semPermissao && (
          <p className="cadastro-pet__mensagem cadastro-pet__mensagem--erro">
            Você não tem permissão para editar este pet.{' '}
            <Link to={`/pets/${id}`}>Voltar</Link>
          </p>
        )}

        {erro && <p className="cadastro-pet__mensagem cadastro-pet__mensagem--erro">{erro}</p>}

        {!carregandoPet && !erroCarga && !semPermissao && (
          <PetForm
            petInicial={pet}
            onSubmit={handleSubmit}
            onErro={setErro}
            carregando={carregando}
            rotuloEnviar={editando ? 'Salvar alterações' : 'Publicar pet'}
            rotaCancelar={rotaCancelar}
          />
        )}
      </div>
    </div>
  );
}
