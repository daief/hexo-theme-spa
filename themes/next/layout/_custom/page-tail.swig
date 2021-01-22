<!-- 一些自定义的脚本 -->
<script defer type="text/javascript" src="/js/daief/common.js"></script>

<!--
prismjs 功能
ref：https://prismjs.com/#basic-usage
-->
<script>
window.Prism = window.Prism || {};
// window.Prism.manual = true;  // 开启后将不自动高亮
</script>
<script src="{{ theme.prismjs }}/components/prism-core.min.js"></script>
<script src="{{ theme.prismjs }}/plugins/autoloader/prism-autoloader.min.js"></script>
<script src="{{ theme.prismjs }}/plugins/line-numbers/prism-line-numbers.min.js"></script>
<script src="{{ theme.prismjs }}/plugins/toolbar/prism-toolbar.min.js"></script>
<script src="{{ theme.prismjs }}/plugins/show-language/prism-show-language.min.js"></script>
<script src="{{ theme.prismjs }}/plugins/show-language/prism-show-language.min.js"></script>
<script src="{{ theme.prismjs }}/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"></script>

<!-- mermaid 绘图功能 -->
<script src="{{ theme.mermaid }}"></script>
<style>
.mermaid {
  /* 避免一开始显示图表代码 */
  font-size: 0;
}
</style>
<script>
mermaid && mermaid.initialize({ startOnLoad: true });
</script>
