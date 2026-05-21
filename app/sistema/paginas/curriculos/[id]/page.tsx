"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiBriefcase, FiMail, FiPhone, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import Header from "../../../../componentes/header";
import Footer from "../../../../componentes/footer";
import { Button } from "../../../../componentes/ui/button";
import { findCurriculo, loadCurriculos, saveCurriculos } from "../data";

export default function CurriculoDetalhesPage() {
  const [selected, setSelected] = useState(() => null as null | ReturnType<typeof findCurriculo>);
  const [loading, setLoading] = useState(true);
  const routeParams = useParams();
  const router = useRouter();
  const id = Array.isArray(routeParams.id) ? routeParams.id[0] : routeParams.id;

  useEffect(() => {
    const task = setTimeout(() => {
      if (!id) {
        setSelected(null);
        setLoading(false);
        return;
      }
      setSelected(findCurriculo(id) ?? null);
      setLoading(false);
    }, 0);
    return () => clearTimeout(task);
  }, [id]);

  const handleDelete = () => {
    if (!selected) return;
    saveCurriculos(loadCurriculos().filter((item) => item.id !== selected.id));
    toast.success("Curriculo excluido com sucesso.");
    router.push("/sistema/paginas/curriculos");
  };

  return (
    <div className="site-shell">
      <Header />
      <main className="main-v2">
        <div className="actions-v2">
          <Link href="/sistema/paginas/curriculos" className="btn-secondary">
            Voltar para a lista
          </Link>
          <Button type="button" variant="danger" onClick={handleDelete}>
            <FiTrash2 />
            Excluir curriculo
          </Button>
        </div>

        {loading ? (
          <div className="empty-box">Carregando curriculo...</div>
        ) : selected ? (
          <>
            <section className="detail-hero-v2">
              <div className="avatar-v2">
                <Image src={selected.avatar} alt={selected.nome} fill className="object-cover" />
              </div>
              <div>
                <p className="copy-v2">Ficha do talento</p>
                <h1 className="title-v2">{selected.nome}</h1>
                <div className="chips-v2">
                  <span className="chip"><FiBriefcase /> {selected.cargo}</span>
                  <span className="chip"><FiMail /> {selected.email}</span>
                </div>
              </div>
            </section>

            <section className="detail-grid-v2">
              <aside className="aside-v2">
                <h2 className="title-v2">Contato</h2>
                <div className="listbox-v2">
                  <p><FiMail /> {selected.email}</p>
                  <p><FiPhone /> {selected.telefone}</p>
                  <p><strong>CPF:</strong> {selected.cpf}</p>
                </div>
              </aside>

              <div className="panel-v2 soft-v2">
                <h2 className="title-v2">Resumo profissional</h2>
                <p className="copy-v2">{selected.resumo}</p>
              </div>
            </section>

            <section className="detail-grid-v2">
              <div className="panel-v2 soft-v2">
                <h2 className="title-v2">Experiencias</h2>
                <div className="listbox-v2">
                  {selected.experiencias.map((item, index) => (
                    <div key={index} className="mini-v2">
                      <strong>{item.empresa}</strong>
                      <p className="copy-v2">{item.cargo} | {item.periodo}</p>
                      <p className="copy-v2">{item.descricao}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-v2 soft-v2">
                <h2 className="title-v2">Formacao</h2>
                <div className="listbox-v2">
                  {selected.formacoes.map((item, index) => (
                    <div key={index} className="mini-v2">
                      <strong>{item.instituicao}</strong>
                      <p className="copy-v2">{item.curso}</p>
                      <p className="copy-v2">{item.periodo}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="panel-v2 soft-v2">
              <h2 className="title-v2">Habilidades</h2>
              <div className="skills-v2">
                {selected.habilidades.map((skill) => (
                  <span key={skill} className="chip">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="empty-box">Curriculo nao encontrado. Verifique se o ID esta correto.</div>
        )}
      </main>
      <Footer />
    </div>
  );
}
