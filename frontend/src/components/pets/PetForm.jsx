import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { petSchema } from '../../schemas/petSchema';
import {
  ESPECIES,
  PORTES,
  MAX_FOTOS,
  TAMANHO_MAX_FOTO_MB,
  TIPOS_FOTO_ACEITOS,
} from '../../utils/petLabels';
import './PetForm.css';

function valoresIniciais(pet) {
  if (!pet) return { vacinado: false, castrado: false };
  return {
    nome: pet.nome,
    especie: pet.especie,
    porte: pet.porte,
    idade_anos: String(pet.idade_anos),
    raca: pet.raca ?? '',
    descricao: pet.descricao ?? '',
    vacinado: pet.vacinado,
    castrado: pet.castrado,
  };
}

// `onSubmit(dados, { novas, remover })` — as fotos ficam fora do react-hook-form/Zod porque
// são Files e a regra de verdade (tipo real e tamanho) é validada no backend.
export function PetForm({ petInicial, onSubmit, onErro, carregando, rotuloEnviar, rotaCancelar }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(petSchema), defaultValues: valoresIniciais(petInicial) });

  const [existentes, setExistentes] = useState(petInicial?.fotos ?? []);
  const [removerIds, setRemoverIds] = useState([]);
  const [novas, setNovas] = useState([]);
  const [erroFoto, setErroFoto] = useState(null);
  const novasRef = useRef(novas);
  novasRef.current = novas;

  const totalFotos = existentes.length + novas.length;

  // Libera as URLs de preview ao sair da tela.
  useEffect(
    () => () => novasRef.current.forEach((nova) => URL.revokeObjectURL(nova.preview)),
    []
  );

  function adicionarFotos(evento) {
    const arquivos = Array.from(evento.target.files ?? []);
    evento.target.value = '';
    setErroFoto(null);

    let restante = MAX_FOTOS - totalFotos;
    const aceitas = [];
    for (const arquivo of arquivos) {
      if (!TIPOS_FOTO_ACEITOS.includes(arquivo.type)) {
        setErroFoto('As fotos devem ser JPG, PNG ou WebP.');
        continue;
      }
      if (arquivo.size > TAMANHO_MAX_FOTO_MB * 1024 * 1024) {
        setErroFoto(`Cada foto deve ter no máximo ${TAMANHO_MAX_FOTO_MB} MB.`);
        continue;
      }
      if (restante === 0) {
        setErroFoto(`Cada pet pode ter no máximo ${MAX_FOTOS} fotos.`);
        break;
      }
      aceitas.push({ file: arquivo, preview: URL.createObjectURL(arquivo) });
      restante -= 1;
    }
    if (aceitas.length) setNovas((atual) => [...atual, ...aceitas]);
  }

  function removerNova(indice) {
    setErroFoto(null);
    setNovas((atual) => {
      URL.revokeObjectURL(atual[indice].preview);
      return atual.filter((_, i) => i !== indice);
    });
  }

  function removerExistente(foto) {
    setErroFoto(null);
    setExistentes((atual) => atual.filter((item) => item.id !== foto.id));
    setRemoverIds((atual) => [...atual, foto.id]);
  }

  async function enviar(dados) {
    try {
      await onSubmit(dados, { novas: novas.map((nova) => nova.file), remover: removerIds });
    } catch (err) {
      onErro?.(err.response?.data?.erro || 'Não foi possível salvar o pet.');
    }
  }

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate>
      <div className="pet-form__fotos">
        <div className="pet-form__fotos-lista">
          {existentes.map((foto) => (
            <div key={`existente-${foto.id}`} className="pet-form__foto">
              <img src={foto.url} alt="Foto do pet" />
              <button
                type="button"
                className="pet-form__foto-remover"
                onClick={() => removerExistente(foto)}
                aria-label="Remover foto"
              >
                ×
              </button>
            </div>
          ))}
          {novas.map((nova, indice) => (
            <div key={nova.preview} className="pet-form__foto">
              <img src={nova.preview} alt="Nova foto do pet" />
              <button
                type="button"
                className="pet-form__foto-remover"
                onClick={() => removerNova(indice)}
                aria-label="Remover foto"
              >
                ×
              </button>
            </div>
          ))}
          {totalFotos < MAX_FOTOS && (
            <label className="pet-form__foto pet-form__foto--adicionar">
              <Icon name="camera" size={26} />
              <span>Adicionar</span>
              <input
                type="file"
                accept={TIPOS_FOTO_ACEITOS.join(',')}
                multiple
                onChange={adicionarFotos}
                className="pet-form__foto-input"
              />
            </label>
          )}
        </div>
        <p className="pet-form__fotos-ajuda">
          Até {MAX_FOTOS} fotos (JPG, PNG ou WebP, {TAMANHO_MAX_FOTO_MB} MB cada). A primeira é a
          capa.
        </p>
        {erroFoto && <p className="pet-form__erro">{erroFoto}</p>}
      </div>

      <Input label="Nome do pet" error={errors.nome?.message} {...register('nome')} />

      <fieldset className="pet-form__especie">
        <legend className="input-field__label">Espécie</legend>
        <div className="pet-form__opcoes">
          {ESPECIES.map((especie) => (
            <label key={especie.valor} className="pet-form__opcao">
              <input type="radio" value={especie.valor} {...register('especie')} />
              <span>{especie.label}</span>
            </label>
          ))}
        </div>
        {errors.especie && <p className="pet-form__erro">{errors.especie.message}</p>}
      </fieldset>

      <div className="pet-form__row">
        <Select label="Porte" error={errors.porte?.message} {...register('porte')}>
          <option value="">Selecione...</option>
          {PORTES.map((porte) => (
            <option key={porte.valor} value={porte.valor}>
              {porte.label}
            </option>
          ))}
        </Select>
        <Input
          label="Idade (anos)"
          type="number"
          min="0"
          max="40"
          inputMode="numeric"
          error={errors.idade_anos?.message}
          {...register('idade_anos')}
        />
      </div>

      <Input label="Raça" placeholder="SRD" error={errors.raca?.message} {...register('raca')} />

      <div className={`input-field${errors.descricao ? ' input-field--error' : ''}`}>
        <label htmlFor="descricao" className="input-field__label">
          Descrição
        </label>
        <textarea
          id="descricao"
          rows={4}
          placeholder="Temperamento, cuidados especiais, se convive com crianças..."
          className="input-field__control pet-form__textarea"
          {...register('descricao')}
        />
        {errors.descricao && <p className="input-field__error">{errors.descricao.message}</p>}
      </div>

      <div className="pet-form__checks">
        <label className="pet-form__check">
          <input type="checkbox" {...register('vacinado')} /> Vacinado
        </label>
        <label className="pet-form__check">
          <input type="checkbox" {...register('castrado')} /> Castrado
        </label>
      </div>

      <div className="pet-form__actions">
        <Button type="submit" variant="accent" disabled={carregando}>
          {carregando ? 'Salvando...' : rotuloEnviar}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate(rotaCancelar)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
