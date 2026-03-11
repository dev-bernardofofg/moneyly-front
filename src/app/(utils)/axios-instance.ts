import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { deleteCookie, getCookie, setCookie } from "./cookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
})

const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

// Flag para evitar múltiplos refreshs simultâneos
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// Função para processar a fila de requisições falhadas após refresh
const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor de request (headers, auth, etc.)
api.interceptors.request.use(
  (config) => {
    const token = getCookie("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response (formata erro e trata refresh token)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Se o erro não for 401 ou se já tentamos fazer refresh, retorna erro formatado
    if (error.response?.status !== 401 || originalRequest._retry) {
      const status = error.response?.status;
      const errorData = error.response?.data as any;

      // Extrai mensagem de erro considerando diferentes formatos da API
      let message = "Erro inesperado";
      if (errorData?.error) {
        message = errorData.error;
      } else if (errorData?.message) {
        message = errorData.message;
      } else if (errorData?.details?.message) {
        message = errorData.details.message;
      }

      return Promise.reject({
        status,
        message,
        data: error.response?.data,
      });
    }

    // Se está tentando fazer refresh na própria rota de refresh, retorna erro
    if (originalRequest.url?.includes("/auth/refresh")) {
      // Refresh token inválido ou expirado - fazer logout
      deleteCookie("auth_token");
      deleteCookie("refresh_token");
      localStorage.removeItem("auth_user");

      // Se estiver no browser, redirecionar para login
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }

      return Promise.reject({
        status: 401,
        message: "Sessão expirada. Faça login novamente.",
        data: error.response?.data,
      });
    }

    // Se já está fazendo refresh, adiciona à fila e aguarda
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    // Marca que está fazendo refresh
    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getCookie("refresh_token");

    if (!refreshToken) {
      // Sem refresh token - fazer logout
      processQueue(new Error("Refresh token não encontrado"), null);
      isRefreshing = false;

      deleteCookie("auth_token");
      deleteCookie("refresh_token");
      localStorage.removeItem("auth_user");

      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }

      return Promise.reject({
        status: 401,
        message: "Sessão expirada. Faça login novamente.",
        data: error.response?.data,
      });
    }

    try {
      // Tenta fazer refresh do token usando instância sem interceptors
      const response = await refreshApi.post<{
        data?: {
          user?: any;
          accessToken?: string;
        };
        message?: string;
        error?: string;
      }>(
        "/auth/refresh",
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Verifica se a resposta indica erro
      if (response.data.error) {
        const errorMessage =
          response.data.error ||
          response.data.message ||
          "Token de refresh inválido ou expirado";

        throw new Error(errorMessage);
      }

      const newAccessToken = response.data?.data?.accessToken;

      if (!newAccessToken) {
        throw new Error("Token de acesso não retornado no refresh");
      }

      // Atualiza o token no cookie
      setCookie("auth_token", newAccessToken);

      // Atualiza o header da requisição original
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      // Processa a fila com sucesso
      processQueue(null, newAccessToken);

      // Retenta a requisição original com o novo token
      return api(originalRequest);
    } catch (refreshError: any) {
      // Erro ao fazer refresh - fazer logout
      processQueue(refreshError, null);

      deleteCookie("auth_token");
      deleteCookie("refresh_token");
      localStorage.removeItem("auth_user");

      // Extrai mensagem de erro considerando diferentes formatos
      let errorMessage = "Sessão expirada. Faça login novamente.";

      if (refreshError?.response?.data) {
        const errorData = refreshError.response.data;
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.details?.message) {
          errorMessage = errorData.details.message;
        }
      } else if (refreshError?.message) {
        errorMessage = refreshError.message;
      }

      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }

      return Promise.reject({
        status: 401,
        message: errorMessage,
        data: refreshError?.response?.data,
      });
    } finally {
      isRefreshing = false;
    }
  }
);


export const customInstance = async <T>(
  config: AxiosRequestConfig,
): Promise<T> => {
  return (await api(config)).data;
};

export { api };

