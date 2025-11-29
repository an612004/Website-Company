declare module 'axios' {
  export interface AxiosResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: unknown;
  }

  export interface AxiosError<T = unknown> extends Error {
    response?: AxiosResponse<T>;
    config?: unknown;
    code?: string;
  }

  function axios<T = unknown>(config: unknown): Promise<AxiosResponse<T>>;
  namespace axios {
    function post<T = unknown>(url: string, data?: unknown, config?: unknown): Promise<AxiosResponse<T>>;
  }

  export default axios;
}
