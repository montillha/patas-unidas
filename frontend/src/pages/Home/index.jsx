import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import carameloRajado from '../../assets/carameloRajado.png';
import './Home.css';

const PASSOS = [
  { icone: 'search', texto: 'Encontre o pet ideal', tom: 'blush' },
  { icone: 'heart', texto: 'Favorite e converse com a ONG', tom: 'lilas' },
  { icone: 'check', texto: 'Finalize a adoção', tom: 'sage' },
];

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <h1 className="home-hero__title">
            Cada pata merece
            <br />
            um{' '}
            <span className="home-hero__highlight">
              lar
              <svg className="home-hero__rabisco" viewBox="0 0 140 16" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 10 Q 35 2, 70 8 T 138 6" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
            .
          </h1>
          <p className="home-hero__subtitle">
            Conectamos ONGs e tutores para tornar a adoção simples, segura e transparente.
          </p>
          <div className="home-hero__actions">
            <Link to="/pets">
              <Button variant="accent">Ver pets disponíveis</Button>
            </Link>
            <Link to="/ongs/cadastro">
              <Button variant="outline-primary">Sou uma ONG</Button>
            </Link>
          </div>
        </div>

        <div className="home-hero__image">
          <div className="home-hero__blob" aria-hidden="true" />
          <img src={carameloRajado} alt="Cão e gato fofos esperando por um lar" className="home-hero__foto" />
          <span className="home-hero__washi" aria-hidden="true" />
          <svg className="home-hero__coracao" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path
              d="M32 54 C 12 40 4 26 12 14 C 18 5 30 6 32 18 C 34 6 46 5 52 14 C 60 26 52 40 32 54 Z"
              fill="var(--home-blush)"
              stroke="var(--home-ink)"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </section>

      <section className="home-como-funciona">
        <div className="home-como-funciona__head">
          <p className="home-como-funciona__kicker">Sem burocracia, com carinho</p>
          <h2 className="home-como-funciona__titulo">Como funciona</h2>
          <p className="home-como-funciona__descricao">
            Do interesse à chegada em casa, em três etapas simples e transparentes.
          </p>
        </div>

        <div className="home-como-funciona__passos">
          {PASSOS.map((passo) => (
            <div key={passo.texto} className="home-como-funciona__passo">
              <span className={`home-como-funciona__icone home-como-funciona__icone--${passo.tom}`}>
                <Icon name={passo.icone} size={22} />
              </span>
              <p className="home-como-funciona__texto">{passo.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-cta-banner">
        <h2 className="home-cta-banner__titulo">Pronto para dar um lar a quem precisa?</h2>
        <p className="home-cta-banner__texto">
          Comece agora a buscar pets disponíveis perto de você ou cadastre sua ONG gratuitamente.
        </p>
        <Link to="/pets">
          <Button variant="outline-primary">Ver pets disponíveis</Button>
        </Link>
      </section>
    </div>
  );
}
