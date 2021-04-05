declare const __baseConfig: any;
declare const __theme: any;
declare const __site: {
  count: {
    category: number;
    post: number;
    tag: number;
  };
};

declare const __SSR__: boolean;
declare const __PROD__: boolean;
declare const __PAGE_PATH__: string;

declare module '*.vue';

interface Window {
  __PAGE_DATA__: any;
}
