import {
  Brain,
  Code,
  Headphones,
  Network,
  Wrench,
  Download,
  Settings,
  GraduationCap,
  Shield,
  Cctv
} from "lucide-react";

export const services = [
  {
    slug: "consultoria-ti",
    icon: Brain,
    title: "Consultoria em TI",
    description: "Análise completa da sua infraestrutura tecnológica com recomendações estratégicas para otimização de processos e redução de custos.",
    features: [
      "Auditoria completa de TI",
      "Planejamento estratégico tecnológico",
      "Análise de ROI em investimentos",
      "Roadmap de modernização"
    ]
  },
  {
    slug: "solucoes-em-software",
    icon: Code,
    title: "Soluções em Software",
    description: "Desenvolvimento e implementação de sistemas personalizados que atendem às necessidades específicas do seu negócio.",
    features: [
      "Sistemas web personalizados",
      "Integração entre sistemas",
      "Automação de processos",
      "APIs e integrações"
    ]
  },
  {
    slug: "help-desk",
    icon: Headphones,
    title: "Help Desk",
    description: "Suporte técnico especializado para manter sua equipe produtiva e resolver problemas tecnológicos rapidamente.",
    features: [
      "Suporte remoto e presencial",
      "Atendimento multicanal",
      "SLA garantido",
      "Relatórios de atendimento"
    ]
  },
  {
    slug: "infraestrutura-de-rede",
    icon: Network,
    title: "Infraestrutura de Rede",
    description: "Projeto e implementação de redes robustas, seguras e escaláveis para suportar o crescimento da sua empresa.",
    features: [
      "Cabeamento estruturado",
      "Configuração de servidores",
      "Redes Wi-Fi empresariais",
      "Telefonia IP",
      "Switches e roteadores",
      "Segurança de rede"
    ]
  },
  {
    slug: "manutencao-de-hardware",
    icon: Wrench,
    title: "Manutenção de Hardware",
    description: "Manutenção preventiva e corretiva de equipamentos para garantir máxima disponibilidade e performance.",
    features: [
      "Computadores e notebooks",
      "Monitores e periféricos",
      "Impressoras e multifuncionais",
      "Manutenção preventiva",
      "Diagnóstico avançado"
    ]
  },
  {
    slug: "instalacao-de-software",
    icon: Download,
    title: "Instalação de Software",
    description: "Instalação, configuração e otimização de softwares empresariais para máxima eficiência operacional.",
    features: [
      "Softwares empresariais",
      "Licenciamento correto",
      "Configuração personalizada",
      "Treinamento de uso"
    ]
  },
  {
    slug: "administracao-de-ti",
    icon: Settings,
    title: "Administração de TI",
    description: "Gestão completa do ambiente tecnológico da sua empresa, garantindo estabilidade e segurança.",
    features: [
      "Monitoramento 24/7",
      "Backup e recovery",
      "Atualizações de segurança",
      "Gestão de usuários"
    ]
  },
  {
    slug: "treinamentos",
    icon: GraduationCap,
    title: "Treinamentos",
    description: "Capacitação da sua equipe em ferramentas tecnológicas e melhores práticas de segurança digital.",
    features: [
      "Treinamento em ferramentas",
      "Conscientização em segurança",
      "Melhores práticas de TI",
      "Combate à engenharia social"
    ]
  },
  {
    slug: "consultoria-lgpd",
    icon: Shield,
    title: "Consultoria LGPD",
    description: "Adequação completa à Lei Geral de Proteção de Dados, garantindo conformidade e evitando multas.",
    features: [
      "Mapeamento de dados",
      "Políticas de privacidade",
      "Treinamento de equipes",
      "Monitoramento contínuo"
    ]
  },
  {
    slug: "cftv-cameras-de-seguranca",
    icon: Cctv,
    title: "Câmeras de Segurança - CFTV",
    description: "Projeto, instalação e manutenção de sistemas de videomonitoramento para proteger o patrimônio e as pessoas da sua empresa, com acesso às imagens em tempo real.",
    features: [
      "Projeto e instalação de câmeras IP e analógicas",
      "Gravação em DVR/NVR",
      "Monitoramento remoto pelo celular",
      "Manutenção preventiva e corretiva",
      "Integração com a rede da empresa"
    ]
  }
];

export const getServiceBySlug = (slug) => services.find((s) => s.slug === slug);
