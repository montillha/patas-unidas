import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { loginSchema } from '../../schemas/loginSchema';
import './LoginForm.css';

export function LoginForm({ onSubmit, onErro, carregando }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function enviar(dados) {
    try {
      await onSubmit(dados);
    } catch (err) {
      const msg = err.response?.data?.erro || 'E-mail ou senha inválidos.';
      if (err.response?.status === 401) {
        setError('senha', { type: 'server', message: msg });
      } else {
        onErro?.(msg);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(enviar)}>
      <Input label="E-mail" type="email" error={errors.email?.message} {...register('email')} />
      <Input label="Senha" type="password" error={errors.senha?.message} {...register('senha')} />

      <div className="login-form__actions">
        <Button type="submit" variant="accent" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/')}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
