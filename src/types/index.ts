// Tipos compartilhados da aplicação

export interface Barbeiro {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  especialidade?: string;
  rating?: number;
  agendamentos?: Agendamento[];
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  agendamentos?: Agendamento[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
}

export interface Agendamento {
  id: number;
  dataHora: string;
  status: string; // "PENDENTE" | "CONFIRMADO" | "CONCLUIDO" | "CANCELADO"
  clienteId: number;
  barbeiroId: number;
  servicoId: number;
  cliente?: Partial<Cliente>;
  barbeiro?: Partial<Barbeiro>;
  servico?: Partial<Servico>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

export interface DashboardStats {
  agendamentosHoje: number;
  totalAgendamentos: number;
  totalClientes: number;
  barbeirosAtivos: number;
  receitaMensal: number;
  proximosAgendamentos?: Array<{
    id: number;
    client: string;
    service: string;
    date: string;
    time: string;
    barber: string;
    status?: string;
  }>;
}

export interface Avaliacao {
  id: number;
  nota: number;
  comentario?: string;
  barbeiroId: number;
  clienteId: number;
  agendamentoId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notificacao {
  id: number;
  tipo: string;
  titulo: string;
  mensagem: string;
  dataHora: string;
  createdAt: string;
  lida: boolean;
  agendamentoId?: number;
  clienteNome?: string;
  barbeiroNome?: string;
  servicoNome?: string;
  status?: string;
}
