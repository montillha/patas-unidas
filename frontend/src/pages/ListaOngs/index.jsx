import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { OngCard } from '../../components/ongs/OngCard';
import { ongService } from '../../services/ongService';
import './ListaOngs.css';

export default function ListaOngs() {
  const [ongs, setOngs] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [cidadeFiltro, setCidadeFiltro] = useState('');

  useEffect(() => {
    ongService
      .listar()
      .then(setOngs)
      .catch(() => setErro('Não foi possível carregar as ONGs.'))
      .finally(() => setCarregando(false));
  }, []);

  const estados = useMemo(
    () => [...new Set(ongs.map((ong) => ong.estado))].sort(),
    [ongs]
  );

  const ongsFiltradas = useMemo(() => {
    return ongs.filter((ong) => {
      const bateEstado = !estadoFiltro || ong.estado === estadoFiltro;
      const bateCidade =
        !cidadeFiltro || ong.cidade.toLowerCase().includes(cidadeFiltro.trim().toLowerCase());
      return bateEstado && bateCidade;
    });
  }, [ongs, estadoFiltro, cidadeFiltro]);

  return (
    <div className="lista-ongs">
      <div className="lista-ongs__cabecalho">
        <h1 className="lista-ongs__titulo">ONGs parceiras</h1>
      </div>

      {!carregando && !erro && ongs.length > 0 && (
        <div className="lista-ongs__filtros">
          <select
            className="lista-ongs__filtro"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="">Todos os estados</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          <input
            className="lista-ongs__filtro"
            type="text"
            placeholder="Cidade"
            value={cidadeFiltro}
            onChange={(e) => setCidadeFiltro(e.target.value)}
          />
        </div>
      )}

      {carregando && <Loader texto="Carregando ONGs..." />}

      {!carregando && erro && <p className="lista-ongs__mensagem lista-ongs__mensagem--erro">{erro}</p>}

      {!carregando && !erro && ongs.length === 0 && (
        <p className="lista-ongs__mensagem">Nenhuma ONG cadastrada ainda.</p>
      )}

      {!carregando && !erro && ongs.length > 0 && ongsFiltradas.length === 0 && (
        <p className="lista-ongs__mensagem">Nenhuma ONG encontrada com esse filtro.</p>
      )}

      {!carregando && !erro && ongsFiltradas.length > 0 && (
        <div className="lista-ongs__grade">
          {ongsFiltradas.map((ong) => (
            <OngCard key={ong.id} ong={ong} />
          ))}
        </div>
      )}
    </div>
  );
}
