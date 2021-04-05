const defaultTheme = '255, 140, 22';

const storageThemeKey = '__def__theme__';

export function getThemeColor() {
  if (__SSR__) return '';
  return `rgb(${localStorage.getItem(storageThemeKey) || defaultTheme})`;
}

let styleEl: HTMLStyleElement | null = null;

export function setTheme(rgbString: string) {
  if (__SSR__) return;
  localStorage.setItem(storageThemeKey, rgbString);

  if (!styleEl) {
    styleEl = document.createElement('style');
    document.head.append(styleEl);
  }

  styleEl.innerHTML = `
    :root {
      --base-primary: ${rgbString};
    }
  `;
}

export function initTheme() {
  setTheme(defaultTheme);
}
