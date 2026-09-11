import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../../components/common/Icon';
import { Loader } from '../../components/common/Loader';
import { ongService } from '../../services/ongService';
import './DetalhesOng.css';

export default function DetalhesOng() {
  const { id } = useParams();
  const [ong, setOng] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

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
        </>
      )}
    </div>
  );
}
