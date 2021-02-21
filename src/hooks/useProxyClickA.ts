import { isExternalLink, isNil } from '@/utils';
import { useRouter } from 'vue-router';
import { PAGE_NAME_MAP } from '@shared/route';

export function useProxyClickA() {
  const router = useRouter();
  return {
    click: async (e: MouseEvent) => {
      let elA: HTMLAnchorElement = e.target as any;

      while ((e.currentTarget as any).contains(elA)) {
        if (isAnchor(elA)) {
          break;
        }
        elA = elA.parentElement as any;
      }

      if (!isAnchor(elA)) {
        return;
      }

      const { target, href, pathname } = elA;
      const replace = !isNil(elA.getAttribute('replace'));
      const queryString = href.split('?')[1] || '';

      const to = pathname + (queryString ? `?${queryString}` : '');

      // 站外链接
      if (isExternalLink(href)) {
        return;
      }

      // match 404，路由配置中未包含
      if (router.resolve(to).matched[0]?.name === PAGE_NAME_MAP.$404) {
        return;
      }

      if (!guardEvent(e, target)) {
        return;
      }

      // spa navigate
      return router[replace ? 'replace' : 'push'](to);
    },
  };
}

function isAnchor(el: any) {
  return (el?.tagName || '').toUpperCase() === 'A';
}

/**
 * @see https://github.com/vuejs/vue-router-next/blob/6e7f877127ce2c52da3542c8142f9e5f35b372bc/src/RouterLink.ts#L207
 * @param e
 */
function guardEvent(e: MouseEvent, target: string) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
  // don't redirect when preventDefault called
  if (e.defaultPrevented) return;
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) return;
  // don't redirect if `target="_blank"`
  // @ts-ignore getAttribute does exist
  if (/\b_blank\b/i.test(target)) return;
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) e.preventDefault();

  return true;
}
