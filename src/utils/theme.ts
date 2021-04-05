const defaultTheme = '255, 140, 50';

export function getThemeColor() {
  return `rgb(${defaultTheme})`;
}

let styleEl: HTMLStyleElement | null = null;

export function setTheme(rgbString: string) {
  if (__SSR__) return;
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
