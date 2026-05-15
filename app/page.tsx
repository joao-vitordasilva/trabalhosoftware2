import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiLayers, FiShield } from "react-icons/fi";
import Header from "./componentes/header";
import Footer from "./componentes/footer";

const featureIcons = [FiCheckCircle, FiLayers, FiShield];

export default function Home() {
  return (
    <div className="site-frame flex min-h-screen flex-col">
      <Header />

      <main className="site-main">
        <div className="shell page-space">
          <section className="hero-panel">
            <div className="hero-grid">
              <div className="hero-copy">
                <span className="hero-badge">Versao 2</span>
                <h1 className="hero-title">Uma vitrine de talentos com energia de startup e acabamentos mais fluidos.</h1>
                <p className="soft-copy mt-5 max-w-3xl text-base sm:text-lg">
                  A experiencia aqui privilegia impacto visual, superficies translúcidas e composicao de marketing, sem alterar qualquer funcionalidade do trabalho.
                </p>

                <div className="hero-actions mt-8">
                  <Link href="/sistema/paginas/curriculos" className="btn-primary">
                    Entrar na lista
                    <FiArrowRight />
                  </Link>
                  <Link href="/sistema/paginas/curriculos/novo" className="btn-secondary">
                    Cadastrar novo perfil
                  </Link>
                </div>
              </div>

              <div className="hero-aside">
                <article className="hero-highlight">
                  <FiCheckCircle className="mb-4 h-5 w-5" />
                  <strong>Hero com gradiente</strong>
                  <p className="soft-copy m-0 text-sm">
                    Todos os fluxos obrigatorios continuam preservados, apenas com nova apresentacao visual.
                  </p>
                </article>
<article className="hero-highlight">
                  <FiLayers className="mb-4 h-5 w-5" />
                  <strong>Glassmorphism leve</strong>
                  <p className="soft-copy m-0 text-sm">
                    A camada de interface foi reorganizada para mudar percepcao e hierarquia sem mexer na regra de negocio.
                  </p>
                </article>
<article className="hero-highlight">
                  <FiShield className="mb-4 h-5 w-5" />
                  <strong>Fluxo rapido para cadastro</strong>
                  <p className="soft-copy m-0 text-sm">
                    Startup moderna com atmosfera mais vibrante.
                  </p>
                </article>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
