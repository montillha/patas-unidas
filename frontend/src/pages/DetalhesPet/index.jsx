import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../../components/common/Icon';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { petService } from '../../services/petService';
import { formatarIdade, rotuloEspecie, rotuloPorte } from '../../utils/petLabels';
import './DetalhesPet.css';

export default function DetalhesPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { conta, perfil } = useAuth();

  const [pet, setPet] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [processando, setProcessando] = useState(false);
  const [erroAcao, setErroAcao] = useState(null);

  useEffect(() => {
    setCarregando(true);
    setErro(null);
    setFotoAtiva(0);
    petService
      .buscarPorId(id)
      .then(setPet)
      .catch((err) => {
        setErro(err.response?.status === 404 ? 'Pet não encontrado.' : 'Não foi possível carregar o pet.');
      })
      .finally(() => setCarregando(false));
  }, [id]);

  // A permissão de verdade é checada no backend; aqui só decide se mostra os botões.
  const ehDono = Boolean(pet && conta?.tipo === 'ong' && perfil?.id === pet.ong_id);
  const adotado = pet?.status === 'adotado';

  async function alternarStatus() {
    setProcessando(true);
    setErroAcao(null);
    try {
      setPet(await petService.alterarStatus(pet.id, adotado ? 'disponivel' : 'adotado'));
    } catch (err) {
      setErroAcao(err.response?.data?.erro || 'Não foi possível atualizar o status.');
    } finally {
      setProcessando(false);
    }
  }

  async function excluir() {
    if (!window.confirm(`Excluir ${pet.nome}? Essa ação não pode ser desfeita.`)) return;
    setProcessando(true);
    setErroAcao(null);
    try {
      await petService.excluir(pet.id);
      navigate(`/ongs/${pet.ong_id}`);
    } catch (err) {
      setErroAcao(err.response?.data?.erro || 'Não foi possível excluir o pet.');
      setProcessando(false);
    }
  }

  return (
    <div className="detalhes-pet">
      <Link to="/pets" className="detalhes-pet__voltar">
        ← Voltar para pets
      </Link>

      {carregando && <Loader texto="Carregando pet..." />}

      {!carregando && erro && (
        <p className="detalhes-pet__mensagem detalhes-pet__mensagem--erro">{erro}</p>
      )}

      {!carregando && !erro && pet && (
        <div className="detalhes-pet__card">
          <div className="detalhes-pet__galeria">
            <div className="detalhes-pet__foto-principal">
              {pet.fotos[fotoAtiva] ? (
                <img src={pet.fotos[fotoAtiva].url} alt={`Foto de ${pet.nome}`} />
              ) : (
                <span className="detalhes-pet__placeholder" aria-hidden="true">
                  <Icon name={pet.especie === 'gato' ? 'cat' : 'dog'} size={72} />
                </span>
              )}
              {adotado && <span className="detalhes-pet__selo">Adotado</span>}
            </div>

            {pet.fotos.length > 1 && (
              <div className="detalhes-pet__miniaturas">
                {pet.fotos.map((foto, indice) => (
                  <button
                    key={foto.id}
                    type="button"
                    className={`detalhes-pet__miniatura${
                      indice === fotoAtiva ? ' detalhes-pet__miniatura--ativa' : ''
                    }`}
                    onClick={() => setFotoAtiva(indice)}
                    aria-label={`Ver foto ${indice + 1}`}
                  >
                    <img src={foto.url} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detalhes-pet__info">
            <h1 className="detalhes-pet__nome">{pet.nome}</h1>
            <p className="detalhes-pet__resumo">
              {rotuloEspecie(pet.especie)} · {formatarIdade(pet.idade_anos)} · {rotuloPorte(pet.porte)}
              {pet.raca ? ` · ${pet.raca}` : ''}
            </p>

            <div className="detalhes-pet__tags">
              <span className={`detalhes-pet__tag${pet.vacinado ? ' detalhes-pet__tag--sim' : ''}`}>
                {pet.vacinado ? 'Vacinado' : 'Não vacinado'}
              </span>
              <span className={`detalhes-pet__tag${pet.castrado ? ' detalhes-pet__tag--sim' : ''}`}>
                {pet.castrado ? 'Castrado' : 'Não castrado'}
              </span>
            </div>

            {pet.descricao && <p className="detalhes-pet__descricao">{pet.descricao}</p>}

            <p className="detalhes-pet__ong">
              <Icon name="pin" size={16} />
              <span>
                <Link to={`/ongs/${pet.ong_id}`}>{pet.ong_nome}</Link> · {pet.cidade}, {pet.estado}
              </span>
            </p>

            {!ehDono && !adotado && (
              <Link to={`/ongs/${pet.ong_id}`}>
                <Button variant="accent">Falar com a ONG</Button>
              </Link>
            )}

            {ehDono && (
              <div className="detalhes-pet__acoes">
                <Link to={`/pets/${pet.id}/editar`}>
                  <Button variant="outline-primary">Editar</Button>
                </Link>
                <Button variant="accent" onClick={alternarStatus} disabled={processando}>
                  {adotado ? 'Voltar para disponível' : 'Marcar como adotado'}
                </Button>
                <Button variant="outline" onClick={excluir} disabled={processando}>
                  Excluir
                </Button>
              </div>
            )}

            {erroAcao && <p className="detalhes-pet__mensagem detalhes-pet__mensagem--erro">{erroAcao}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
