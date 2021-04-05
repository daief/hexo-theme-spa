<template>
  <div class="text-center">
    <HImage
      class="avatar block rounded-full w-32 h-32 mx-auto border-white p-0.5 border border-solid"
      :src="src"
      :alt="author"
      :title="author"
    />
    <p class="text-sm font-medium my-2 text-black" itemprop="name">
      {{ author }}
    </p>
    <p class="text-sm my-2 text-gray-600" v-if="!!description">
      {{ description }}
    </p>

    <!-- `一言` -->
    <div
      v-if="!disableHitokoto && hitokoto.callTimes > 0 && !hitokoto.error"
      class="text-sm py-5 px-4 border shadow-xl bg-white bg-opacity-40 my-6 cursor-pointer transition-all hover:text-primary"
      title="Hitokoto 一言，点击更换，by https://hitokoto.cn/"
      @click="() => refetchHitokoto()"
      :style="hitokotoStyle"
    >
      <p class="hko-content text-left">
        <strong class="text-lg">{{ hitokotoContent.first }}</strong
        >{{ hitokotoContent.rest }}
      </p>
      <p class="hko-author text-right mt-1">
        <span style="font-family: cursive">—— </span>
        {{ hitokotoFrom }}
      </p>
    </div>

    <div class="flex justify-center items-center">
      <router-link
        v-for="([count, name, link], index) in siteMetas"
        :key="index"
        :to="link"
        class="block text-center w-14 text-sm text-gray-700"
      >
        <p class="font-medium text-lg">
          {{ count || 0 }}
        </p>
        <p>{{ name }}</p>
      </router-link>
    </div>

    <div v-if="enableSocial" class="my-5">
      <a
        v-for="[key, cfg] in socialConfigList"
        class="inline-block mx-3 whitespace-nowrap text-lg text-gray-800"
        :key="key"
        :href="cfg.link"
        :title="cfg.name"
        target="__blank"
      >
        <Icon :name="cfg.icon" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({});
</script>

<script lang="ts" setup>
import HImage from '@/components/HImage.vue';
import Icon from '@/components/Icon.vue';
import { useAxios } from '@/hooks/useAxios';

/**
 * 随机出圆角
 */
var generateBorderRadius = function () {
  var delta = Math.random() * 10 - 5;
  var long = 220 + 2 * delta + 'px';
  var short = 30 + delta + 'px';
  return Math.random() * 100 > 50 ? long + ' ' + short : short + ' ' + long;
};

const hitokotoStyle = {
  borderTopLeftRadius: generateBorderRadius(),
  borderTopRightRadius: generateBorderRadius(),
  borderBottomRightRadius: generateBorderRadius(),
  borderBottomLeftRadius: generateBorderRadius(),
};

const [hitokoto, refetchHitokoto] = useAxios(
  'https://v1.hitokoto.cn/?encode=json',
  {
    skip: false,
  },
);

const hitokotoContent = computed(() => {
  const str = hitokoto.value.data?.hitokoto || '';
  return {
    first: str.substring(0, 1),
    rest: str.substring(1),
  };
});

const hitokotoFrom = computed(() => hitokoto.value.data?.from || '佚名');

const { avatar: src, disableHitokoto, social } = __theme;
const { enable: enableSocial, ...socialConfig } = social;
const socialConfigList = Object.entries<{ link; name; icon }>(socialConfig);
const { author, description } = __baseConfig;
const { count } = __site;
const siteMetas = computed(() => [
  [count.post, '日志', '/archives'],
  [count.category, '分类', '/categories'],
  [count.tag, '标签', '/tags'],
]);
</script>

<style scoped lang="less">
@keyframes avatar-hvr-buzz {
  50% {
    transform: translateX(3px) rotate(2deg);
  }

  100% {
    transform: translateX(-3px) rotate(-2deg);
  }
}
.avatar {
  &:hover {
    animation-name: avatar-hvr-buzz;
    animation-duration: 0.15s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
}
</style>
