import { onMount } from 'svelte';
import { writable, Writable } from 'svelte/store';
import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';

const CancelToken = axios.CancelToken;

export type IConfig<T> = {
  defaultValue?: T;
  skip?: boolean;
} & AxiosRequestConfig;

export function useAxios<T = any>(
  url: string,
  config?: IConfig<T>,
): [
  Writable<{
    loading: boolean;
    data: T;
    error: any;
    callTimes: number;
  }>,
  (cfg?: IConfig<T>) => Promise<AxiosResponse<T>>,
  {
    cancel(msg?: string): void;
  },
] {
  const { defaultValue, skip, ...axiosConfig } = { ...config };

  let cancel: Canceler | null = null;

  let res = writable({
    loading: false,
    data: defaultValue,
    error: null,
    callTimes: 0,
  });

  const call = async (cfg?: IConfig<T>) => {
    try {
      res.update(pre => {
        return { ...pre, loading: true };
      });

      const data = await axios.request({
        url,
        ...axiosConfig,
        ...cfg,
        cancelToken: new CancelToken(function (c) {
          cancel = c;
        }),
      });

      res.update(pre => {
        return {
          ...pre,
          loading: false,
          data: data.data ?? defaultValue,
          error: null,
          callTimes: pre.callTimes + 1,
        };
      });

      return data;
    } catch (error) {
      const isCancelled = error instanceof axios.Cancel;

      res.update(pre => {
        return {
          ...pre,
          loading: false,
          data: isCancelled ? pre.data : defaultValue,
          error,
          callTimes: pre.callTimes + 1,
        };
      });

      throw error;
    }
  };

  onMount(() => {
    !skip && call();
  });

  return [
    res,
    call,
    {
      cancel: (msg?: string) => {
        typeof cancel === 'function' && cancel(msg);
        cancel = null;
      },
    },
  ];
}
