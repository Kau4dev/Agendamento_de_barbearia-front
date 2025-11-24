import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  Barbeiro,
  Cliente,
  Servico,
  Agendamento,
  Usuario,
  DashboardStats,
  Notificacao,
  Avaliacao,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiService {
  private axios: AxiosInstance;

  constructor(baseURL: string) {
    this.axios = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    this.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          this.clearAuth();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  private clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  private async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.axios.get<T>(url, config);
    return res.data;
  }

  private async post<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.axios.post<T>(url, body, config);
    return res.data;
  }

  private async put<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.axios.put<T>(url, body, config);
    return res.data;
  }

  private async patch<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.axios.patch<T>(url, body, config);
    return res.data;
  }

  private async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.axios.delete<T>(url, config);
    return res.data;
  }

  auth = {
    login: async (email: string, senha: string) => {
      const response = await this.post<
        { token: string; usuario: Usuario },
        { email: string; senha: string }
      >("/auth/login", { email, senha });
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.usuario));
      }
      return response;
    },

    register: async (data: {
      nome: string;
      email: string;
      senha: string;
      telefone: string;
    }) => {
      return this.post<{ token: string; usuario: Usuario }, typeof data>(
        "/auth/register",
        data
      );
    },

    logout: () => {
      this.clearAuth();
    },

    getUser: (): Usuario | null => {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    },

    isAuthenticated: (): boolean => {
      return !!localStorage.getItem("token");
    },
  };

  barbeiros = {
    getAll: () => this.get<Barbeiro[]>("/barbeiros"),
    getById: (id: number) => this.get<Barbeiro>(`/barbeiros/${id}`),
    create: (data: Partial<Barbeiro>) =>
      this.post<Barbeiro, Partial<Barbeiro>>("/barbeiros", data),
    update: (id: number, data: Partial<Barbeiro>) =>
      this.put<Barbeiro, Partial<Barbeiro>>(`/barbeiros/${id}`, data),
    delete: (id: number) => this.delete<void>(`/barbeiros/${id}`),
  };

  clientes = {
    getAll: () => this.get<Cliente[]>("/clientes"),
    getById: (id: number) => this.get<Cliente>(`/clientes/${id}`),
    create: (data: Partial<Cliente>) =>
      this.post<Cliente, Partial<Cliente>>("/clientes", data),
    update: (id: number, data: Partial<Cliente>) =>
      this.put<Cliente, Partial<Cliente>>(`/clientes/${id}`, data),
    delete: (id: number) => this.delete<void>(`/clientes/${id}`),
  };

  servicos = {
    getAll: () => this.get<Servico[]>("/servicos"),
    getById: (id: number) => this.get<Servico>(`/servicos/${id}`),
    create: (data: Partial<Servico>) =>
      this.post<Servico, Partial<Servico>>("/servicos", data),
    update: (id: number, data: Partial<Servico>) =>
      this.put<Servico, Partial<Servico>>(`/servicos/${id}`, data),
    delete: (id: number) => this.delete<void>(`/servicos/${id}`),
  };

  agendamentos = {
    getAll: () => this.get<Agendamento[]>("/agendamentos"),
    getById: (id: number) => this.get<Agendamento>(`/agendamentos/${id}`),
    create: (data: Partial<Agendamento>) =>
      this.post<Agendamento, Partial<Agendamento>>("/agendamentos", data),
    update: (id: number, data: Partial<Agendamento>) =>
      this.put<Agendamento, Partial<Agendamento>>(`/agendamentos/${id}`, data),
    updateStatus: (
      id: number,
      status: "PENDENTE" | "CONFIRMADO" | "CANCELADO" | "CONCLUIDO"
    ) =>
      this.patch<Agendamento, { status: string }>(
        `/agendamentos/${id}/status`,
        { status }
      ),
    delete: (id: number) => this.delete<void>(`/agendamentos/${id}`),
  };

  usuarios = {
    getAll: () => this.get<Usuario[]>("/usuarios"),
    getById: (id: number) => this.get<Usuario>(`/usuarios/${id}`),
    create: (data: Partial<Usuario>) =>
      this.post<Usuario, Partial<Usuario>>("/usuarios", data),
    update: (id: number, data: Partial<Usuario>) =>
      this.put<Usuario, Partial<Usuario>>(`/usuarios/${id}`, data),
    delete: (id: number) => this.delete<void>(`/usuarios/${id}`),
  };

  dashboard = {
    getStats: () => this.get<DashboardStats>("/dashboard/stats"),
  };

  agenda = {
    getByBarbeiroId: (barbeiroId: number) =>
      this.get<{
        id: number;
        barbeiroId: number;
        seg_inicio: string | null;
        seg_fim: string | null;
        ter_inicio: string | null;
        ter_fim: string | null;
        qua_inicio: string | null;
        qua_fim: string | null;
        qui_inicio: string | null;
        qui_fim: string | null;
        sex_inicio: string | null;
        sex_fim: string | null;
        sab_inicio: string | null;
        sab_fim: string | null;
        dom_inicio: string | null;
        dom_fim: string | null;
      }>(`/agendas/${barbeiroId}`),
    update: (
      barbeiroId: number,
      data: {
        seg_inicio?: string | null;
        seg_fim?: string | null;
        ter_inicio?: string | null;
        ter_fim?: string | null;
        qua_inicio?: string | null;
        qua_fim?: string | null;
        qui_inicio?: string | null;
        qui_fim?: string | null;
        sex_inicio?: string | null;
        sex_fim?: string | null;
        sab_inicio?: string | null;
        sab_fim?: string | null;
        dom_inicio?: string | null;
        dom_fim?: string | null;
      }
    ) =>
      this.put<{ message: string }, typeof data>(
        `/agendas/${barbeiroId}`,
        data
      ),
  };

  notificacoes = {
    getRecentes: () => this.get<Notificacao[]>("/notificacoes"),
  };

  avaliacoes = {
    criar: (
      barbeiroId: number,
      data: { nota: number; comentario?: string; agendamentoId?: number }
    ) =>
      this.post<Avaliacao, typeof data>(
        `/barbeiros/${barbeiroId}/avaliacoes`,
        data
      ),
    listarPorBarbeiro: (barbeiroId: number) =>
      this.get<Avaliacao[]>(`/barbeiros/${barbeiroId}/avaliacoes`),
    podeAvaliar: (agendamentoId: number) =>
      this.get<{ podeAvaliar: boolean }>(
        `/agendamentos/${agendamentoId}/pode-avaliar`
      ),
  };
}

export const api = new ApiService(API_BASE_URL);
export default api;
