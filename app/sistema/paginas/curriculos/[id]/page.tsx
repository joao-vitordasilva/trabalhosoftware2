"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiBriefcase, FiMail, FiPhone, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import Header from "../../../../componentes/header";
import Footer from "../../../../componentes/footer";
import { findCurriculo, loadCurriculos, saveCurriculos } from "../data";
import { Button } from "../../../../componentes/ui/button";

export default function CurriculoDetalhesPage() {
  const [curriculo, setCurriculo] = useState(() => null as null | ReturnType<typeof findCurriculo>);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const curriculoId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!curriculoId) {
        setCurriculo(null);
        setIsLoading(false);
        return;
      }

      const foundCurriculo = findCurriculo(curriculoId) ?? null;
      setCurriculo(foundCurriculo);
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [curriculoId]);

  const handleDelete = () => {
    if (!curriculo) return;

    const current = loadCurriculos().filter((item) => item.id !== curriculo.id);
    saveCurriculos(current);
    toast.success("Curriculo excluido com sucesso.");
    router.push("/sistema/paginas/curriculos");
  };

  return (
    <div className="site-frame flex min-h-screen flex-col">
      <Header />

      <main className="site-main">
        <div className="shell page-space">
          <section className="page-panel">
            <div className="page-top">
              <div className="max-w-3xl">
                <span className="section-kicker">Detalhes</span>
                <h1 className="section-title">Pagina dinamica com tudo o que foi cadastrado.</h1>
              </div>

              <div className="detail-actions">
                <Link href="/sistema/paginas/curriculos" className="btn-secondary">
                  Voltar para a lista
                </Link>
                <Button type="button" variant="danger" onClick={handleDelete}>
                  <FiTrash2 />
                  Excluir curriculo
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="surface-card empty-state mt-8">Carregando curriculo...</div>
            ) : curriculo ? (
              <div className="stack-list mt-8">
                <section className="surface-card detail-hero">
                  <div className="detail-header">
                    <div className="detail-person">
                      <div className="avatar-frame">
                        <Image src={curriculo.avatar} alt={curriculo.nome} fill className="object-cover" />
                      </div>

                      <div>
                        <span className="section-kicker">{curriculo.cargo}</span>
                        <h2>{curriculo.nome}</h2>
                        <div className="chip-row mt-3">
                          <span className="chip">
                            <FiMail />
                            {curriculo.email}
                          </span>
                          <span className="chip">
                            <FiBriefcase />
                            {curriculo.cargo}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="status-chip">ID: {curriculo.id}</span>
                  </div>
                </section>

                <section className="details-grid">
                  <article className="surface-card">
                    <h3 className="m-0 text-xl font-semibold">Contato e identificacao</h3>
                    <div className="detail-meta mt-5">
                      <div className="surface-card">
                        <strong className="flex items-center gap-2">
                          <FiPhone />
                          Telefone
                        </strong>
                        <p className="detail-copy m-0 mt-2">{curriculo.telefone}</p>
                      </div>
                      <div className="surface-card">
                        <strong>CPF</strong>
                        <p className="detail-copy m-0 mt-2">{curriculo.cpf}</p>
                      </div>
                    </div>
                  </article>

                  <article className="surface-card">
                    <h3 className="m-0 text-xl font-semibold">Resumo profissional</h3>
                    <p className="detail-copy mt-5">{curriculo.resumo}</p>
                  </article>
                </section>

                <section className="split-grid">
                  <article className="surface-card">
                    <h3 className="m-0 text-xl font-semibold">Experiencias profissionais</h3>
                    <div className="stack-list mt-5">
                      {curriculo.experiencias.map((item, index) => (
                        <div key={index} className="array-card">
                          <strong>{item.empresa}</strong>
                          <p className="detail-copy m-0 mt-2">
                            {item.cargo} | {item.periodo}
                          </p>
                          <p className="detail-copy m-0 mt-3">{item.descricao}</p>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="surface-card">
                    <h3 className="m-0 text-xl font-semibold">Formacao academica</h3>
                    <div className="stack-list mt-5">
                      {curriculo.formacoes.map((item, index) => (
                        <div key={index} className="array-card">
                          <strong>{item.instituicao}</strong>
                          <p className="detail-copy m-0 mt-2">{item.curso}</p>
                          <p className="detail-copy m-0 mt-3">{item.periodo}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                </section>

                <section className="surface-card">
                  <h3 className="m-0 text-xl font-semibold">Habilidades</h3>
                  <div className="skill-row mt-4">
                    {curriculo.habilidades.map((skill) => (
                      <span key={skill} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="surface-card empty-state mt-8">
                Curriculo nao encontrado. Verifique se o ID esta correto.
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
