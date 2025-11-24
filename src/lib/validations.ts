import { z } from "zod";

// Schema de Login
export const loginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Schema de Cadastro
export const cadastroSchema = z
  .object({
    nome: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .regex(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
        "Nome deve conter apenas letras e espaços"
      ),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    telefone: z
      .string()
      .min(1, "Telefone é obrigatório")
      .regex(
        /^[\d\s()-]+$/,
        "Telefone deve conter apenas números e caracteres especiais válidos"
      )
      .min(10, "Telefone deve ter no mínimo 10 dígitos"),
    senha: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(6, "Senha deve ter no mínimo 6 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Senha deve conter letras maiúsculas, minúsculas e números"
      ),
    confirmSenha: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.senha === data.confirmSenha, {
    message: "As senhas não coincidem",
    path: ["confirmSenha"],
  });

export type CadastroFormData = z.infer<typeof cadastroSchema>;

// Schema de Barbeiro
export const barbeiroSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .regex(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
      "Nome deve conter apenas letras e espaços"
    ),
  telefone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(/^[\d\s()-]+$/, "Telefone deve conter apenas números")
    .min(10, "Telefone deve ter no mínimo 10 dígitos"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  especialidade: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
});

export type BarbeiroFormData = z.infer<typeof barbeiroSchema>;

// Schema de Cliente
export const clienteSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .regex(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
      "Nome deve conter apenas letras e espaços"
    ),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  telefone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(/^[\d\s()-]+$/, "Telefone deve conter apenas números")
    .min(10, "Telefone deve ter no mínimo 10 dígitos"),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;

// Schema de Serviço
export const servicoSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  descricao: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(10, "Descrição deve ter no mínimo 10 caracteres"),
  preco: z
    .number({ invalid_type_error: "Preço deve ser um número" })
    .positive("Preço deve ser maior que zero")
    .min(0.01, "Preço deve ser maior que zero"),
  duracao: z
    .number({ invalid_type_error: "Duração deve ser um número" })
    .int("Duração deve ser um número inteiro")
    .positive("Duração deve ser maior que zero")
    .min(1, "Duração deve ser no mínimo 1 minuto"),
});

export type ServicoFormData = z.infer<typeof servicoSchema>;

// Schema de Agendamento
export const agendamentoSchema = z.object({
  clienteId: z
    .number({ invalid_type_error: "Cliente é obrigatório" })
    .positive("Selecione um cliente válido"),
  barbeiroId: z
    .number({ invalid_type_error: "Barbeiro é obrigatório" })
    .positive("Selecione um barbeiro válido"),
  servicoId: z
    .number({ invalid_type_error: "Serviço é obrigatório" })
    .positive("Selecione um serviço válido"),
  data: z.string().min(1, "Data é obrigatória"),
  hora: z.string().min(1, "Horário é obrigatório"),
});

export type AgendamentoFormData = z.infer<typeof agendamentoSchema>;
