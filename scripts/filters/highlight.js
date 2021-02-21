/**
 * 借助 hexo-renderer-marked 扩展，自定义渲染 code
 * ref：https://github.com/hexojs/hexo-renderer-marked/blob/master/README.md#extensibility
 */

const hljs = require('highlight.js');

const escapeHtml = str =>
  str.replace(
    /[&<>'"]/g,
    tag =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      }[tag] || tag),
  );

hexo.extend.filter.register('marked:renderer', function (renderer) {
  // const { config } = this; // Skip this line if you don't need user config from _config.yml

  renderer.code = (sourceCode, language) => {
    // 处理 mermaid 图表
    if (/^mermaid$/i.test(language)) {
      return `<div class="mermaid">${sourceCode}</div>`;
    }

    const codeResult = !hljs.getLanguage(language)
      ? escapeHtml(sourceCode)
      : hljs.highlight(language, sourceCode).value;

    return `<pre class="line-numbers language-${language}"><code>${codeResult}</code></pre>`;
  };
});
