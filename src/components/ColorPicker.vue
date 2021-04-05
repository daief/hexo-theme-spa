<template>
  <div ref="el"></div>
</template>

<script lang="ts">
import {
  defineComponent,
  defineEmit,
  defineProps,
  onMounted,
  ref,
  watch,
} from 'vue';
// import '@simonwep/pickr/dist/themes/classic.min.css'; // 'classic' theme
// import '@simonwep/pickr/dist/themes/monolith.min.css';  // 'monolith' theme
import '@simonwep/pickr/dist/themes/nano.min.css'; // 'nano' theme

export default defineComponent({
  name: 'ColorPicker',
});
</script>

<script lang="ts" setup>
import type IPicker from '@simonwep/pickr';

const el = ref<HTMLElement | null>(null);
let picker: IPicker | null = null;

const props = defineProps({
  value: String,
});

const emit = defineEmit(['update:value']);

onMounted(async () => {
  const Pickr = (await import('@simonwep/pickr')).default;
  picker = Pickr.create({
    el: el.value,
    theme: 'nano',
    swatches: ['rgba(244, 67, 54, 1)'],
    default: props.value || null,

    components: {
      // Main components
      preview: true,
      opacity: false,
      hue: true,

      // Input / output Options
      interaction: {
        // hex: true,
        // rgba: true,
        // hsla: true,
        // hsva: true,
        // cmyk: true,
        // input: true,
        // clear: true,
        // save: true,
      },
    },
  });

  picker
    .on('init', instance => {
      // console.log('Event: "init"', instance);
    })
    .on('hide', () => {
      const rgba = picker.getColor().toRGBA();
      emit('update:value', rgba.toString(), rgba);
    })
    .on('show', (color, instance) => {
      // console.log('Event: "show"', color, instance);
    })
    .on('save', (color, instance) => {
      // console.log('Event: "save"', color, instance);
    })
    .on('clear', instance => {
      // console.log('Event: "clear"', instance);
    })
    .on('change', (color, source, instance) => {
      // console.log('Event: "change"', color, source, instance);
    })
    .on('changestop', (source, instance) => {
      // console.log('Event: "changestop"', source, instance);
    })
    .on('cancel', instance => {
      // console.log('Event: "cancel"', instance);
    })
    .on('swatchselect', (color, instance) => {
      // console.log('Event: "swatchselect"', color, instance);
    });
});

watch(
  () => props.value,
  () => {
    props.value && picker?.setColor(props.value);
  },
);
</script>

<style scoped lang="less"></style>
