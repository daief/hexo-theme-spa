export function isExternalLink(link: string) {
  const url = new URL(link);
  const siteUrl = new URL(__baseConfig.url);
  const localUrl = __SSR__ ? siteUrl : new URL(location.href);
  return url.hostname !== localUrl.hostname;
}

export function isNil(obj: any) {
  return [null, void 0].includes(obj);
}
