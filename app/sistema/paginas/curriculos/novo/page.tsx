"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { Controller, FieldErrors, Resolver, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IMaskInput } from "react-imask";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as yup from "yup";
import Header from "../../../../componentes/header";
import Footer from "../../../../componentes/footer";
import { Button } from "../../../../componentes/ui/button";
import { Input } from "../../../../componentes/ui/input";
import { Textarea } from "../../../../componentes/ui/textarea";
import { Curriculo, Experiencia, Formacao, loadCurriculos, saveCurriculos } from "../data";

type ResumeDraft = {
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  cpf: string;
  resumo: string;
  habilidades: string;
  avatar: FileList | null | undefined;
  experiencias: Experiencia[];
  formacoes: Formacao[];
};

const validationSchema = yup.object({
  nome: yup.string().required("Nome e obrigatorio").min(3, "Nome precisa ter ao menos 3 caracteres."),
  cargo: yup.string().required("Cargo e obrigatorio").min(3, "Cargo precisa ter ao menos 3 caracteres."),
  email: yup.string().required("E-mail e obrigatorio").email("Digite um e-mail valido."),
  telefone: yup.string().required("Telefone e obrigatorio").min(14, "Telefone incompleto."),
  cpf: yup.string().required("CPF e obrigatorio").min(14, "CPF incompleto."),
  resumo: yup.string().required("Resumo profissional e obrigatorio").min(30, "Resumo deve ter ao menos 30 caracteres."),
  habilidades: yup.string().required("Habilidades sao obrigatorias").min(5, "Liste ao menos uma habilidade."),
  avatar: yup.mixed().nullable(),
  experiencias: yup.array().of(yup.object({ empresa: yup.string().required("Empresa e obrigatoria."), cargo: yup.string().required("Cargo e obrigatorio."), periodo: yup.string().required("Periodo e obrigatorio."), descricao: yup.string().required("Descricao e obrigatoria.").min(20, "Descricao muito curta.") })).min(1, "Adicione ao menos uma experiencia profissional."),
  formacoes: yup.array().of(yup.object({ instituicao: yup.string().required("Instituicao e obrigatoria."), curso: yup.string().required("Curso e obrigatorio."), periodo: yup.string().required("Periodo e obrigatorio.") })).min(1, "Adicione ao menos uma formacao academica."),
});

const formSeed: ResumeDraft = {
  nome: "",
  cargo: "",
  email: "",
  telefone: "",
  cpf: "",
  resumo: "",
  habilidades: "",
  avatar: null,
  experiencias: [{ empresa: "", cargo: "", periodo: "", descricao: "" }],
  formacoes: [{ instituicao: "", curso: "", periodo: "" }],
};

function nextResumeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `curr-${Math.random().toString(36).slice(2, 10)}`;
}

function extractFirstIssue(formIssues: FieldErrors<ResumeDraft>): string {
  if (!formIssues) return "Erro na validacao.";
  const firstValue = Object.values(formIssues)[0];
  if (!firstValue) return "Erro na validacao.";
  if (typeof firstValue === "string") return firstValue;
  if (Array.isArray(firstValue)) return extractFirstIssue(firstValue as unknown as FieldErrors<ResumeDraft>);
  return typeof firstValue.message === "string" ? firstValue.message : "Erro na validacao.";
}

export default function NovoCurriculoPage() {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState("/next.svg");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ResumeDraft>({
    mode: "onTouched",
    defaultValues: formSeed,
    resolver: yupResolver(validationSchema) as Resolver<ResumeDraft>,
  });

  const workCollection = useFieldArray({ control, name: "experiencias" });
  const studyCollection = useFieldArray({ control, name: "formacoes" });

  const syncAvatarPreview = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setValue("avatar", files);
    if (files && files.length > 0) {
      setPreviewImage(URL.createObjectURL(files[0]));
      return;
    }
    setPreviewImage("/next.svg");
  };

  const saveResume: SubmitHandler<ResumeDraft> = (draft) => {
    const normalizedAbilities = draft.habilidades.split(",").map((entry) => entry.trim()).filter(Boolean);
    const createdProfile: Curriculo = {
      id: nextResumeId(),
      nome: draft.nome,
      cargo: draft.cargo,
      email: draft.email,
      telefone: draft.telefone,
      cpf: draft.cpf,
      resumo: draft.resumo,
      experiencias: draft.experiencias,
      formacoes: draft.formacoes,
      habilidades: normalizedAbilities,
      avatar: previewImage || "/next.svg",
    };
    saveCurriculos([createdProfile, ...loadCurriculos()]);
    toast.success("Curriculo salvo com sucesso.");
    reset(formSeed);
    router.push("/sistema/paginas/curriculos");
  };

  return (
    <div className="site-shell">
      <Header />
      <main className="main-v2">
        <div className="intro-v2">
          <div>
            <h1 className="title-v2">Novo curriculo</h1>
            <p className="copy-v2">Preencha os dados principais, experiencias, formacoes e habilidades.</p>
          </div>
          <Link href="/sistema/paginas/curriculos" className="btn-secondary">
            Voltar para a lista
          </Link>
        </div>

        <div className="pair-v2">
          <aside className="aside-v2">
            <strong>Resumo do envio</strong>
            <p className="copy-v2">O cadastro mantem validacao, upload fake, arrays dinamicos e persistencia local.</p>
            <div className="preview-v2">
              <div className="avatar-v2">
                <Image src={previewImage} alt="Avatar" fill className="object-cover" />
              </div>
              <div className="field-stack-v2">
                <span className="hint-v2">Preview da imagem</span>
                <span className="copy-v2">A foto e opcional e compoe a ficha do candidato.</span>
              </div>
            </div>
          </aside>

          <form onSubmit={handleSubmit(saveResume, (formErrors) => toast.error(extractFirstIssue(formErrors)))} className="form-page-v2">
            <section className="section-v2">
              <div className="line-v2">
                <div>
                  <h2 className="title-v2">Informacoes principais</h2>
                  <p className="copy-v2">Dados basicos do curriculo.</p>
                </div>
              </div>
              <div className="pair-v2">
                <label className="label-v2">
                  <span>Nome</span>
                  <Input {...register("nome")} type="text" placeholder="Nome completo" />
                  {errors.nome && <span className="error-text">{errors.nome.message?.toString()}</span>}
                </label>
                <label className="label-v2">
                  <span>Cargo desejado</span>
                  <Input {...register("cargo")} type="text" placeholder="Cargo desejado" />
                  {errors.cargo && <span className="error-text">{errors.cargo.message?.toString()}</span>}
                </label>
              </div>
              <label className="label-v2">
                <span>Resumo profissional</span>
                <Textarea {...register("resumo")} placeholder="Descreva experiencia e competencias" />
                {errors.resumo && <span className="error-text">{errors.resumo.message?.toString()}</span>}
              </label>
            </section>

            <section className="light-v2">
              <div className="line-v2">
                <div>
                  <h2 className="title-v2">Imagem do candidato</h2>
                  <p className="copy-v2">Upload visual para compor a ficha.</p>
                </div>
              </div>
              <label className="label-v2">
                <span>Arquivo</span>
                <Controller
                  name="avatar"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        field.onChange(event.target.files);
                        syncAvatarPreview(event);
                      }}
                      className="field file:mr-3 file:border-0 file:bg-black file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                    />
                  )}
                />
              </label>
            </section>

            <section className="section-v2">
              <div className="line-v2">
                <div>
                  <h2 className="title-v2">Contato</h2>
                  <p className="copy-v2">Dados usados na consulta da ficha.</p>
                </div>
              </div>
              <div className="triple-v2">
                <label className="label-v2">
                  <span>E-mail</span>
                  <Input {...register("email")} type="email" placeholder="nome@exemplo.com" />
                  {errors.email && <span className="error-text">{errors.email.message?.toString()}</span>}
                </label>
                <label className="label-v2">
                  <span>Telefone</span>
                  <Controller
                    name="telefone"
                    control={control}
                    render={({ field }) => <IMaskInput {...field} mask="(00) 00000-0000" placeholder="(99) 99999-9999" className="field" />}
                  />
                  {errors.telefone && <span className="error-text">{errors.telefone.message?.toString()}</span>}
                </label>
                <label className="label-v2">
                  <span>CPF</span>
                  <Controller
                    name="cpf"
                    control={control}
                    render={({ field }) => <IMaskInput {...field} mask="000.000.000-00" placeholder="000.000.000-00" className="field" />}
                  />
                  {errors.cpf && <span className="error-text">{errors.cpf.message?.toString()}</span>}
                </label>
              </div>
            </section>

            <section className="light-v2">
              <div className="line-v2">
                <div>
                  <h2 className="title-v2">Habilidades</h2>
                  <p className="copy-v2">Informe separando por virgula.</p>
                </div>
              </div>
              <label className="label-v2">
                <span>Lista de habilidades</span>
                <Input {...register("habilidades")} type="text" placeholder="React, Next.js, TypeScript" />
                <span className="hint-v2">Exemplo: React, SQL, Power BI</span>
                {errors.habilidades && <span className="error-text">{errors.habilidades.message?.toString()}</span>}
              </label>
            </section>

            <section className="section-v2">
              <div className="line-v2">
                <div>
                  <h2 className="title-v2">Experiencias profissionais</h2>
                  <p className="copy-v2">Adicione ou remova linhas conforme necessario.</p>
                </div>
                <Button type="button" variant="secondary" onClick={() => workCollection.append({ empresa: "", cargo: "", periodo: "", descricao: "" })}>
                  Adicionar
                </Button>
              </div>
              <div className="field-stack-v2">
                {workCollection.fields.map((field, index) => (
                  <div key={field.id} className="item-v2">
                    <div className="line-v2">
                      <strong>Experiencia {index + 1}</strong>
                      <Button type="button" variant="danger" onClick={() => workCollection.remove(index)}>
                        Remover
                      </Button>
                    </div>
                    <div className="pair-v2">
                      <Input {...register(`experiencias.${index}.empresa` as const)} type="text" placeholder="Empresa" />
                      <Input {...register(`experiencias.${index}.cargo` as const)} type="text" placeholder="Cargo" />
                    </div>
                    <div className="pair-v2">
                      <Input {...register(`experiencias.${index}.periodo` as const)} type="text" placeholder="2021 - 2024" />
                      <Textarea {...register(`experiencias.${index}.descricao` as const)} placeholder="Descricao" />
                    </div>
                  </div>
                ))}
                {errors.experiencias && <span className="error-text">{extractFirstIssue(errors.experiencias)}</span>}
              </div>
            </section>

            <section className="section-v2">
              <div className="line-v2">
                <div>
                  <h2 className="title-v2">Formacao academica</h2>
                  <p className="copy-v2">Mantenha os cursos em ordem livre.</p>
                </div>
                <Button type="button" variant="secondary" onClick={() => studyCollection.append({ instituicao: "", curso: "", periodo: "" })}>
                  Adicionar
                </Button>
              </div>
              <div className="field-stack-v2">
                {studyCollection.fields.map((field, index) => (
                  <div key={field.id} className="item-v2">
                    <div className="line-v2">
                      <strong>Formacao {index + 1}</strong>
                      <Button type="button" variant="danger" onClick={() => studyCollection.remove(index)}>
                        Remover
                      </Button>
                    </div>
                    <div className="field-stack-v2">
                      <Input {...register(`formacoes.${index}.instituicao` as const)} type="text" placeholder="Instituicao" />
                      <div className="pair-v2">
                        <Input {...register(`formacoes.${index}.curso` as const)} type="text" placeholder="Curso" />
                        <Input {...register(`formacoes.${index}.periodo` as const)} type="text" placeholder="Periodo" />
                      </div>
                    </div>
                  </div>
                ))}
                {errors.formacoes && <span className="error-text">{extractFirstIssue(errors.formacoes)}</span>}
              </div>
            </section>

            <div className="actions-end-v2">
              <Button type="submit" disabled={isSubmitting || !isValid}>
                {isSubmitting ? "Salvando..." : "Salvar curriculo"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
