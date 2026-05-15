"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import Header from "../../../componentes/header";
import Footer from "../../../componentes/footer";
import { Curriculo, loadCurriculos } from "./data";

export default function CurriculosPage() {
  const [curriculos] = useState<Curriculo[]>(() => loadCurriculos());
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim().toLowerCase());
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const filteredCurriculos = useMemo(
    () =>
      curriculos.filter((item) => {
        const term = search;
        if (!term) return true;

        return item.nome.toLowerCase().includes(term) || item.cargo.toLowerCase().includes(term);
      }),
    [curriculos, search],
  );

  return (
    <div className="site-frame flex min-h-screen flex-col">
      <Header />

      <main className="site-main">
        <div className="shell page-space">
          <section className="page-panel">
            <div className="page-top">
              <div className="max-w-3xl">
                <span className="section-kicker">Curriculos</span>
                <h1 className="section-title">Lista com busca instantanea e leitura organizada.</h1>
                <p className="section-copy mt-4 text-sm sm:text-base">
                  A funcionalidade da busca permanece a mesma, usando nome e cargo em tempo real, mas
                  a organizacao visual muda completamente entre as versoes.
                </p>
              </div>

              <div className="toolbar sm:flex-row sm:items-center sm:justify-between">
                <label className="search-shell sm:max-w-[360px]">
                  <FiSearch className="h-4 w-4" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar por nome ou cargo"
                    className="input-shell pl-11"
                  />
                </label>

                <div className="toolbar-actions">
                  <Link href="/sistema/paginas/curriculos/novo" className="btn-primary">
                    Cadastrar novo
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>

            <div className="stats-grid mt-8">
              <div className="metric-card">
                <span className="metric-label">Total visivel</span>
                <div className="metric-value">{filteredCurriculos.length}</div>
              </div>
              <div className="metric-card">
                <span className="metric-label">Origem</span>
                <div className="metric-value text-xl">LocalStorage</div>
              </div>
              <div className="metric-card">
                <span className="metric-label">Filtro ativo</span>
                <div className="metric-value text-xl">Nome e cargo</div>
              </div>
            </div>

            <div className="record-list mt-8">
              {filteredCurriculos.length === 0 ? (
                <div className="surface-card empty-state">
                  Nenhum curriculo encontrado. Tente outro termo de pesquisa.
                </div>
              ) : (
                filteredCurriculos.map((item) => (
                  <article key={item.id} className="record-card surface-card">
                    <div className="record-card__top">
                      <div className="chip-row">
                        <span className="chip">{item.cargo}</span>
                        <span className="chip">{item.email}</span>
                      </div>
                      <Link href={`/sistema/paginas/curriculos/${item.id}`} className="ghost-link">
                        Ver detalhes
                        <FiArrowRight />
                      </Link>
                    </div>

                    <div className="mt-4">
                      <h2 className="m-0 text-2xl font-semibold">{item.nome}</h2>
                      <p className="detail-copy mt-3">{item.resumo}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
