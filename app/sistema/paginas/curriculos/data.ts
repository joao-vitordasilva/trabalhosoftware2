export interface Experiencia {
  empresa: string;
  cargo: string;
  periodo: string;
  descricao: string;
}

export interface Formacao {
  instituicao: string;
  curso: string;
  periodo: string;
}

export interface Curriculo {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  cpf: string;
  resumo: string;
  experiencias: Experiencia[];
  formacoes: Formacao[];
  habilidades: string[];
  avatar: string;
}

const STORAGE_KEY = "sistema_curriculos_v1";

export const initialCurriculos: Curriculo[] = [
  {
    id: "1",
    nome: "Maria Silva",
    cargo: "Desenvolvedora Front-end",
    email: "maria.silva@example.com",
    telefone: "(11) 98123-4567",
    cpf: "123.456.789-10",
    resumo:
      "Profissional com 5 anos de experiencia em desenvolvimento front-end, especializada em React e acessibilidade web.",
    experiencias: [
      {
        empresa: "TecnoWeb",
        cargo: "Front-end Developer",
        periodo: "2021 - 2024",
        descricao: "Desenvolvimento de interfaces responsivas e manutencao de componentes reutilizaveis.",
      },
    ],
    formacoes: [
      {
        instituicao: "Universidade Paulista",
        curso: "Analise e Desenvolvimento de Sistemas",
        periodo: "2018 - 2021",
      },
    ],
    habilidades: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Acessibilidade"],
    avatar: "/avatar-1.svg",
  },
  {
    id: "2",
    nome: "Joao Pereira",
    cargo: "Analista de Dados",
    email: "joao.pereira@example.com",
    telefone: "(21) 98765-4321",
    cpf: "987.654.321-00",
    resumo:
      "Analista de dados orientado a resultados, com experiencia em dashboards, ETL e visualizacao de informacoes estrategicas.",
    experiencias: [
      {
        empresa: "Data Insights",
        cargo: "Analista de Dados",
        periodo: "2020 - 2024",
        descricao: "Criacao de relatorios gerenciais e automacao de processos de analise usando Python e SQL.",
      },
    ],
    formacoes: [
      {
        instituicao: "Universidade Federal",
        curso: "Ciencia da Computacao",
        periodo: "2016 - 2020",
      },
    ],
    habilidades: ["SQL", "Python", "Power BI", "ETL", "Modelagem de Dados"],
    avatar: "/avatar-2.svg",
  },
];

export function loadCurriculos(): Curriculo[] {
  if (typeof window === "undefined") return initialCurriculos;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialCurriculos;
    const parsed = JSON.parse(stored) as Curriculo[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialCurriculos;
  } catch {
    return initialCurriculos;
  }
}

export function saveCurriculos(curriculos: Curriculo[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(curriculos));
}

export function findCurriculo(id: string): Curriculo | undefined {
  return loadCurriculos().find((item) => item.id === id);
}
