import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';
import { onMounted, Ref, ref, toRaw, UnwrapRef } from 'vue';

const CancelToken = axios.CancelToken;

export type IConfig<T> = {
  defaultValue?: T;
  skip?: boolean;
} & AxiosRequestConfig;

export function useAxios<T = any>(
  url: string,
  config?: IConfig<T>,
): [
  Ref<{
    loading: boolean;
    data: UnwrapRef<T>;
    error: any;
    callTimes: number;
  }>,
  (cfg?: IConfig<T>) => Promise<AxiosResponse<T>>,
  {
    cancel(msg?: string): void;
  },
] {
  const { defaultValue, skip = true, ...axiosConfig } = { ...config };

  let cancel: Canceler | null = null;

  const res = ref({
    loading: false,
    data: defaultValue,
    error: null,
    callTimes: 0,
  });

  const call = async (cfg?: IConfig<T>) => {
    try {
      res.value.loading = true;

      const data = await axios.request({
        url,
        ...axiosConfig,
        ...cfg,
        cancelToken: new CancelToken(function (c) {
          cancel = c;
        }),
      });

      res.value = {
        ...toRaw(res),
        loading: false,
        data: data.data ?? defaultValue,
        error: null,
        callTimes: res.value.callTimes + 1,
      };

      return data;
    } catch (error) {
      const isCancelled = error instanceof axios.Cancel;

      res.value = {
        ...toRaw(res),
        loading: false,
        data: isCancelled ? (res.value.data as any) : defaultValue,
        error,
        callTimes: res.value.callTimes + 1,
      };

      throw error;
    }
  };

  if (!skip) {
    onMounted(() => {
      call();
    });
  }

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
