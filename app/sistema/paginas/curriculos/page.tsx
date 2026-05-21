"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import Header from "../../../componentes/header";
import Footer from "../../../componentes/footer";
import { Curriculo, loadCurriculos } from "./data";

export default function CurriculosPage() {
  const [storedRecords] = useState<Curriculo[]>(() => loadCurriculos());
  const [typedSearch, setTypedSearch] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");

  useEffect(() => {
    const waitSearch = setTimeout(() => {
      setCommittedSearch(typedSearch.trim().toLowerCase());
    }, 200);

    return () => clearTimeout(waitSearch);
  }, [typedSearch]);

  const matchingItems = useMemo(() => {
    if (!committedSearch) return storedRecords;
    return storedRecords.filter((profile) => profile.nome.toLowerCase().includes(committedSearch) || profile.cargo.toLowerCase().includes(committedSearch));
  }, [storedRecords, committedSearch]);

  return (
    <div className="site-shell">
      <Header />
      <main className="main-v2">
        <div className="intro-v2">
          <div>
            <h1 className="title-v2">Lista de curriculos</h1>
            <p className="copy-v2">Consulte os perfis salvos e filtre por nome ou cargo.</p>
          </div>
          <div className="aside-v2">
            <strong>Atalho principal</strong>
            <Link href="/sistema/paginas/curriculos/novo" className="btn-primary">
              Adicionar perfil
            </Link>
          </div>
        </div>

        <section className="toolbar-v2">
          <label className="search-box">
            <FiSearch />
            <input
              value={typedSearch}
              onChange={(event) => setTypedSearch(event.target.value)}
              placeholder="Buscar por nome ou cargo"
              className="field field-search"
            />
          </label>
          <div className="counter-v2">
            <span>Perfis</span>
            <strong>{matchingItems.length}</strong>
          </div>
        </section>

        {matchingItems.length === 0 ? (
          <div className="empty-box">Nenhum curriculo encontrado. Tente outro termo de pesquisa.</div>
        ) : (
          <section className="cards-v2">
            {matchingItems.map((profile) => (
              <article key={profile.id} className="card-v2">
                <div className="head-v2">
                  <div>
                    <h2 className="title-v2">{profile.nome}</h2>
                    <p className="copy-v2">{profile.cargo}</p>
                  </div>
                  <Link href={`/sistema/paginas/curriculos/${profile.id}`} className="btn-secondary">
                    Ver detalhes
                  </Link>
                </div>
                <p className="copy-v2">{profile.resumo}</p>
              </article>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
