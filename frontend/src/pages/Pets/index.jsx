import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { PetGrade } from '../../components/pets/PetGrade';
import { useAuth } from '../../hooks/useAuth';
import { petService } from '../../services/petService';
import './Pets.css';

export default function Pets() {
  const { conta } = useAuth();
  const [pets, setPets] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [cidadeFiltro, setCidadeFiltro] = useState('');

  useEffect(() => {
    petService
      .listar({ status: 'disponivel' })
      .then(setPets)
      .catch(() => setErro('Não foi possível carregar os pets.'))
      .finally(() => setCarregando(false));
  }, []);

  const estados = useMemo(() => [...new Set(pets.map((pet) => pet.estado))].sort(), [pets]);

  const petsFiltrados = useMemo(() => {
    const cidade = cidadeFiltro.trim().toLowerCase();
    return pets.filter(
      (pet) =>
        (!estadoFiltro || pet.estado === estadoFiltro) &&
        (!cidade || pet.cidade.toLowerCase().includes(cidade))
    );
  }, [pets, estadoFiltro, cidadeFiltro]);

  return (
    <div className="pets">
      <div className="pets__cabecalho">
        <h1 className="pets__titulo">Pets disponíveis para adoção</h1>
        {conta?.tipo === 'ong' && (
          <Link to="/pets/cadastro">
            <Button variant="accent">+ Cadastrar pet</Button>
          </Link>
        )}
      </div>

      {!carregando && !erro && pets.length > 0 && (
        <div className="pets__filtros">
          <select
            className="pets__filtro"
            aria-label="Estado"
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
            className="pets__filtro"
            type="text"
            aria-label="Cidade"
            placeholder="Cidade"
            value={cidadeFiltro}
            onChange={(e) => setCidadeFiltro(e.target.value)}
          />
        </div>
      )}

      {carregando && <Loader texto="Carregando pets..." />}

      {!carregando && erro && <p className="pets__mensagem pets__mensagem--erro">{erro}</p>}

      {!carregando && !erro && pets.length === 0 && (
        <p className="pets__mensagem">Nenhum pet disponível para adoção no momento.</p>
      )}

      {!carregando && !erro && pets.length > 0 && petsFiltrados.length === 0 && (
        <p className="pets__mensagem">Nenhum pet encontrado com esse filtro.</p>
      )}

      {!carregando && !erro && petsFiltrados.length > 0 && <PetGrade pets={petsFiltrados} />}
    </div>
  );
}
