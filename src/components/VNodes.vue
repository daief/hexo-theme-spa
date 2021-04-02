<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VNodes',
  functional: true,
  props: {
    vnodes: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    return () => props.vnodes;
  },
});
</script>

<style scoped lang="less"></style>
