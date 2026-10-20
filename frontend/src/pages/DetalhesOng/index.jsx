import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../../components/common/Icon';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { PetGrade } from '../../components/pets/PetGrade';
import { useAuth } from '../../hooks/useAuth';
import { ongService } from '../../services/ongService';
import { petService } from '../../services/petService';
import './DetalhesOng.css';

export default function DetalhesOng() {
  const { id } = useParams();
  const { conta, perfil } = useAuth();
  const [ong, setOng] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [pets, setPets] = useState([]);
  const [carregandoPets, setCarregandoPets] = useState(true);
  const [erroPets, setErroPets] = useState(false);

  useEffect(() => {
    setCarregandoPets(true);
    setErroPets(false);
    petService
      .listar({ ongId: id })
      .then(setPets)
      .catch(() => setErroPets(true))
      .finally(() => setCarregandoPets(false));
  }, [id]);

  // Só a própria ONG vê os já adotados (para poder editar, reverter ou excluir).
  const ehDono = Boolean(ong && conta?.tipo === 'ong' && perfil?.id === ong.id);
  const disponiveis = pets.filter((pet) => pet.status === 'disponivel');
  const adotados = pets.filter((pet) => pet.status === 'adotado');

  useEffect(() => {
    setCarregando(true);
    setErro(null);
    ongService
      .buscarPorId(id)
      .then(setOng)
      .catch((err) => {
        setErro(err.response?.status === 404 ? 'ONG não encontrada.' : 'Não foi possível carregar a ONG.');
      })
      .finally(() => setCarregando(false));
  }, [id]);

  return (
    <div className="detalhes-ong">
      <Link to="/ongs" className="detalhes-ong__voltar">
        ← Voltar para ONGs
      </Link>

      {carregando && <Loader texto="Carregando ONG..." />}

      {!carregando && erro && <p className="detalhes-ong__mensagem detalhes-ong__mensagem--erro">{erro}</p>}

      {!carregando && !erro && ong && (
        <>
          <div className="detalhes-ong__cabecalho">
            <span className="detalhes-ong__icone" aria-hidden="true">
              <Icon name="shelter" size={30} />
            </span>
            <div>
              <h1 className="detalhes-ong__nome">{ong.nome}</h1>
              <p className="detalhes-ong__local">
                <Icon name="pin" size={14} />
                {ong.cidade}, {ong.estado}
              </p>
            </div>
          </div>

          <div className="detalhes-ong__corpo">
            {ong.descricao && <p className="detalhes-ong__descricao">{ong.descricao}</p>}

            <p className="detalhes-ong__endereco">
              <Icon name="pin" size={18} />
              {ong.endereco}
            </p>

            <div className="detalhes-ong__contato">
              <span className="detalhes-ong__contato-item">
                <Icon name="mail" size={18} />
                <a href={`mailto:${ong.email}`}>{ong.email}</a>
              </span>
              {ong.telefone && (
                <span className="detalhes-ong__contato-item">
                  <Icon name="phone" size={18} />
                  {ong.telefone}
                </span>
              )}
            </div>
          </div>

          <section className="detalhes-ong__pets">
            <div className="detalhes-ong__pets-cabecalho">
              <h2 className="detalhes-ong__pets-titulo">Pets disponíveis nesta ONG</h2>
              {ehDono && (
                <Link to="/pets/cadastro">
                  <Button variant="accent">+ Cadastrar pet</Button>
                </Link>
              )}
            </div>

            {carregandoPets && <Loader texto="Carregando pets..." />}

            {!carregandoPets && erroPets && (
              <p className="detalhes-ong__mensagem detalhes-ong__mensagem--erro">
                Não foi possível carregar os pets.
              </p>
            )}

            {!carregandoPets && !erroPets && disponiveis.length === 0 && (
              <p className="detalhes-ong__pets-vazio">Nenhum pet disponível no momento.</p>
            )}

            {!carregandoPets && !erroPets && disponiveis.length > 0 && <PetGrade pets={disponiveis} />}

            {!carregandoPets && !erroPets && ehDono && adotados.length > 0 && (
              <>
                <h2 className="detalhes-ong__pets-titulo detalhes-ong__pets-titulo--secundario">
                  Já adotados
                </h2>
                <PetGrade pets={adotados} />
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
