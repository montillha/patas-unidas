import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { ongSchema } from '../../schemas/ongSchema';
import { localizacaoService } from '../../services/localizacaoService';
import './OngForm.css';

export function OngForm({ onSubmit, onErro, carregando }) {
  const navigate = useNavigate();
  const [estados, setEstados] = useState([]);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(ongSchema) });

  useEffect(() => {
    localizacaoService.listarEstados().then(setEstados).catch(() => setEstados([]));
  }, []);

  async function enviar(dados) {
    try {
      await onSubmit(dados);
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao cadastrar ONG.';
      if (err.response?.status === 409) {
        setError('email', { type: 'server', message: msg });
      } else {
        onErro?.(msg);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(enviar)}>
      <Input label="Nome da ONG" error={errors.nome?.message} {...register('nome')} />

      <div className="ong-form__row">
        <Input label="E-mail" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Telefone" error={errors.telefone?.message} {...register('telefone')} />
      </div>

      <Input label="Senha" type="password" error={errors.senha?.message} {...register('senha')} />

      <Input label="Endereço" error={errors.endereco?.message} {...register('endereco')} />

      <div className="ong-form__row">
        <Input label="Cidade" error={errors.cidade?.message} {...register('cidade')} />
        <Select label="Estado" error={errors.estado?.message} {...register('estado')}>
          <option value="">Selecione...</option>
          {estados.map((estado) => (
            <option key={estado.sigla} value={estado.sigla}>
              {estado.sigla} — {estado.nome}
            </option>
          ))}
        </Select>
      </div>

      <Input label="Descrição" error={errors.descricao?.message} {...register('descricao')} />

      <div className="ong-form__actions">
        <Button type="submit" variant="accent" disabled={carregando}>
          {carregando ? 'Salvando...' : 'Cadastrar ONG'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/')}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
