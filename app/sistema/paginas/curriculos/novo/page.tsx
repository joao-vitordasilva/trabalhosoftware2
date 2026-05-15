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
import { Curriculo, Formacao, Experiencia, loadCurriculos, saveCurriculos } from "../data";

type FormValues = {
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

const schema = yup.object({
  nome: yup.string().required("Nome e obrigatorio").min(3, "Nome precisa ter ao menos 3 caracteres."),
  cargo: yup.string().required("Cargo e obrigatorio").min(3, "Cargo precisa ter ao menos 3 caracteres."),
  email: yup.string().required("E-mail e obrigatorio").email("Digite um e-mail valido."),
  telefone: yup.string().required("Telefone e obrigatorio").min(14, "Telefone incompleto."),
  cpf: yup.string().required("CPF e obrigatorio").min(14, "CPF incompleto."),
  resumo: yup.string().required("Resumo profissional e obrigatorio").min(30, "Resumo deve ter ao menos 30 caracteres."),
  habilidades: yup.string().required("Habilidades sao obrigatorias").min(5, "Liste ao menos uma habilidade."),
  avatar: yup.mixed().nullable(),
  experiencias: yup
    .array()
    .of(
      yup.object({
        empresa: yup.string().required("Empresa e obrigatoria."),
        cargo: yup.string().required("Cargo e obrigatorio."),
        periodo: yup.string().required("Periodo e obrigatorio."),
        descricao: yup.string().required("Descricao e obrigatoria.").min(20, "Descricao muito curta."),
      }),
    )
    .min(1, "Adicione ao menos uma experiencia profissional."),
  formacoes: yup
    .array()
    .of(
      yup.object({
        instituicao: yup.string().required("Instituicao e obrigatoria."),
        curso: yup.string().required("Curso e obrigatorio."),
        periodo: yup.string().required("Periodo e obrigatorio."),
      }),
    )
    .min(1, "Adicione ao menos uma formacao academica."),
});

function generateCurriculoId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `curr-${Math.random().toString(36).slice(2, 10)}`;
}

const defaultValues: FormValues = {
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

function extractErrorMessage(errors: FieldErrors<FormValues>): string {
  if (!errors) return "Erro na validacao.";
  const error = Object.values(errors)[0];
  if (!error) return "Erro na validacao.";
  if (typeof error === "string") return error;
  if (Array.isArray(error)) return extractErrorMessage(error as unknown as FieldErrors<FormValues>);
  return typeof error.message === "string" ? error.message : "Erro na validacao.";
}

export default function NovoCurriculoPage() {
  const router = useRouter();
  const [preview, setPreview] = useState("/avatar-placeholder.svg");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<FormValues>({
    mode: "onTouched",
    defaultValues,
    resolver: yupResolver(schema) as Resolver<FormValues>,
  });

  const experiencias = useFieldArray({ control, name: "experiencias" });
  const formacoes = useFieldArray({ control, name: "formacoes" });

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setValue("avatar", files);

    if (files && files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setPreview(url);
    } else {
      setPreview("/avatar-placeholder.svg");
    }
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const skills = data.habilidades
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const novo: Curriculo = {
      id: generateCurriculoId(),
      nome: data.nome,
      cargo: data.cargo,
      email: data.email,
      telefone: data.telefone,
      cpf: data.cpf,
      resumo: data.resumo,
      experiencias: data.experiencias,
      formacoes: data.formacoes,
      habilidades: skills,
      avatar: preview || "/avatar-placeholder.svg",
    };

    saveCurriculos([novo, ...loadCurriculos()]);
    toast.success("Curriculo salvo com sucesso.");
    reset(defaultValues);
    router.push("/sistema/paginas/curriculos");
  };

  const onError = (formErrors: FieldErrors<FormValues>) => {
    toast.error(extractErrorMessage(formErrors));
  };

  return (
    <div className="site-frame flex min-h-screen flex-col">
      <Header />

      <main className="site-main">
        <div className="shell page-space">
          <section className="page-panel">
            <div className="page-top">
              <div className="max-w-3xl">
                <span className="section-kicker">Cadastrar</span>
                <h1 className="section-title">Formulario completo com validacao, mascara e field arrays.</h1>
                <p className="section-copy mt-4 text-sm sm:text-base">
                  A logica do formulario permanece intacta: Yup, React Hook Form, upload fake de imagem,
                  Sonner e os blocos dinamicos de experiencias e formacoes continuam funcionando.
                </p>
              </div>

              <div className="toolbar-actions">
                <Link href="/sistema/paginas/curriculos" className="btn-secondary">
                  Voltar para a lista
                </Link>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="stack-list mt-8">
              <div className="form-grid">
                <section className="panel-card surface-card">
                  <div className="panel-heading">
                    <div>
                      <span className="section-kicker">Perfil</span>
                      <h2>Dados principais</h2>
                    </div>
                    <span className="status-chip">Obrigatorio</span>
                  </div>

                  <div className="field-grid mt-6 md:grid-cols-2">
                    <div className="field-group">
                      <label className="field-label">Nome</label>
                      <Input {...register("nome")} type="text" placeholder="Nome completo" />
                      {errors.nome && <p className="error-text">{errors.nome.message?.toString()}</p>}
                    </div>

                    <div className="field-group">
                      <label className="field-label">Cargo desejado</label>
                      <Input {...register("cargo")} type="text" placeholder="Cargo desejado" />
                      {errors.cargo && <p className="error-text">{errors.cargo.message?.toString()}</p>}
                    </div>
                  </div>

                  <div className="field-grid mt-6 lg:grid-cols-3">
                    <div className="field-group">
                      <label className="field-label">E-mail</label>
                      <Input {...register("email")} type="email" placeholder="nome@exemplo.com" />
                      {errors.email && <p className="error-text">{errors.email.message?.toString()}</p>}
                    </div>

                    <div className="field-group">
                      <label className="field-label">Telefone</label>
                      <Controller
                        name="telefone"
                        control={control}
                        render={({ field }) => (
                          <IMaskInput
                            {...field}
                            mask="(00) 00000-0000"
                            placeholder="(99) 99999-9999"
                            className="input-shell"
                          />
                        )}
                      />
                      {errors.telefone && <p className="error-text">{errors.telefone.message?.toString()}</p>}
                    </div>

                    <div className="field-group">
                      <label className="field-label">CPF</label>
                      <Controller
                        name="cpf"
                        control={control}
                        render={({ field }) => (
                          <IMaskInput
                            {...field}
                            mask="000.000.000-00"
                            placeholder="000.000.000-00"
                            className="input-shell"
                          />
                        )}
                      />
                      {errors.cpf && <p className="error-text">{errors.cpf.message?.toString()}</p>}
                    </div>
                  </div>
                </section>

                <section className="panel-card surface-card">
                  <div className="panel-heading">
                    <div>
                      <span className="section-kicker">Imagem</span>
                      <h2>Upload fake com pre-visualizacao</h2>
                    </div>
                    <span className="status-chip">Opcional</span>
                  </div>

                  <div className="stack-list mt-6">
                    <div className="preview-card">
                      <div className="avatar-frame">
                        <Image src={preview} alt="Avatar" fill className="object-cover" />
                      </div>
                      <div>
                        <strong>Previa da foto</strong>
                        <p className="panel-copy m-0 mt-2">
                          O arquivo continua sendo processado apenas na camada visual, sem backend.
                        </p>
                      </div>
                    </div>

                    <Controller
                      name="avatar"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            field.onChange(event.target.files);
                            handleAvatarChange(event);
                          }}
                          className="input-shell file:mr-4 file:rounded-full file:border-0 file:bg-white/90 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-900"
                        />
                      )}
                    />
                  </div>
                </section>
              </div>

              <section className="panel-card surface-card">
                <div className="panel-heading">
                  <div>
                    <span className="section-kicker">Conteudo</span>
                    <h2>Resumo e habilidades</h2>
                  </div>
                </div>

                <div className="split-grid mt-6">
                  <div className="field-group">
                    <label className="field-label">Resumo profissional</label>
                    <Textarea {...register("resumo")} placeholder="Descreva a experiencia e principais competencias" />
                    {errors.resumo && <p className="error-text">{errors.resumo.message?.toString()}</p>}
                  </div>

                  <div className="field-group">
                    <label className="field-label">Habilidades</label>
                    <Input {...register("habilidades")} type="text" placeholder="React, Next.js, TypeScript" />
                    <p className="hint-text">Separe as habilidades por virgula.</p>
                    {errors.habilidades && <p className="error-text">{errors.habilidades.message?.toString()}</p>}
                  </div>
                </div>
              </section>

              <div className="split-grid">
                <section className="panel-card surface-card">
                  <div className="array-heading">
                    <div>
                      <span className="section-kicker">Array</span>
                      <h2 className="array-title">Experiencias profissionais</h2>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => experiencias.append({ empresa: "", cargo: "", periodo: "", descricao: "" })}
                    >
                      Adicionar
                    </Button>
                  </div>

                  <div className="array-list mt-6">
                    {experiencias.fields.map((field, index) => (
                      <div key={field.id} className="array-card">
                        <div className="array-heading">
                          <span className="status-chip">Experiencia {index + 1}</span>
                          <Button type="button" variant="danger" onClick={() => experiencias.remove(index)}>
                            Remover
                          </Button>
                        </div>

                        <div className="field-grid mt-5 md:grid-cols-2">
                          <div className="field-group">
                            <label className="field-label">Empresa</label>
                            <Input {...register(`experiencias.${index}.empresa` as const)} type="text" placeholder="Nome da empresa" />
                          </div>
                          <div className="field-group">
                            <label className="field-label">Cargo</label>
                            <Input {...register(`experiencias.${index}.cargo` as const)} type="text" placeholder="Cargo ocupado" />
                          </div>
                        </div>

                        <div className="field-grid mt-4 md:grid-cols-2">
                          <div className="field-group">
                            <label className="field-label">Periodo</label>
                            <Input {...register(`experiencias.${index}.periodo` as const)} type="text" placeholder="2021 - 2024" />
                          </div>
                          <div className="field-group">
                            <label className="field-label">Descricao</label>
                            <Textarea
                              {...register(`experiencias.${index}.descricao` as const)}
                              placeholder="Descreva responsabilidades e resultados"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {errors.experiencias && <p className="error-text">{extractErrorMessage(errors.experiencias)}</p>}
                  </div>
                </section>

                <section className="panel-card surface-card">
                  <div className="array-heading">
                    <div>
                      <span className="section-kicker">Array</span>
                      <h2 className="array-title">Formacao academica</h2>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => formacoes.append({ instituicao: "", curso: "", periodo: "" })}
                    >
                      Adicionar
                    </Button>
                  </div>

                  <div className="array-list mt-6">
                    {formacoes.fields.map((field, index) => (
                      <div key={field.id} className="array-card">
                        <div className="array-heading">
                          <span className="status-chip">Formacao {index + 1}</span>
                          <Button type="button" variant="danger" onClick={() => formacoes.remove(index)}>
                            Remover
                          </Button>
                        </div>

                        <div className="field-grid mt-5">
                          <div className="field-group">
                            <label className="field-label">Instituicao</label>
                            <Input {...register(`formacoes.${index}.instituicao` as const)} type="text" placeholder="Instituicao" />
                          </div>
                          <div className="field-grid md:grid-cols-2">
                            <div className="field-group">
                              <label className="field-label">Curso</label>
                              <Input {...register(`formacoes.${index}.curso` as const)} type="text" placeholder="Curso" />
                            </div>
                            <div className="field-group">
                              <label className="field-label">Periodo</label>
                              <Input {...register(`formacoes.${index}.periodo` as const)} type="text" placeholder="Periodo" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {errors.formacoes && <p className="error-text">{extractErrorMessage(errors.formacoes)}</p>}
                  </div>
                </section>
              </div>

              <div className="form-actions justify-end">
                <Button type="submit" disabled={isSubmitting || !isValid}>
                  {isSubmitting ? "Salvando..." : "Salvar curriculo"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
