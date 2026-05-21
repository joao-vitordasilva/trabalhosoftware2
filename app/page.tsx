import Link from "next/link";
import Header from "./componentes/header";
import Footer from "./componentes/footer";

export default function Home() {
  return (
    <div className="site-shell">
      <Header />
      <div className="content-v2">
        <main className="main-v2">
          <section className="banner-v2">
            <h1 className="title-v2">Painel lateral para reunir curriculos e consultar fichas.</h1>
            <p className="copy-v2">A pagina principal funciona como porta de entrada simples, com atalhos curtos e distribuicao vertical.</p>
            <div className="actions-v2">
              <Link href="/sistema/paginas/curriculos" className="btn-primary">Abrir talentos</Link>
              <Link href="/sistema/paginas/curriculos/novo" className="btn-secondary">Cadastrar</Link>
            </div>
          </section>
          <section className="cols-v2">
            <article className="soft-v2"><strong>Lista</strong><p className="copy-v2">Cards simples em colunas.</p></article>
            <article className="soft-v2"><strong>Formulario</strong><p className="copy-v2">Blocos empilhados e area lateral de apoio.</p></article>
            <article className="soft-v2"><strong>Detalhes</strong><p className="copy-v2">Contato, resumo e registros em paines separados.</p></article>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
