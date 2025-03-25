<template>
  <div class="ant-color-predefine">
    <div
      class="ant-color-predefine__colors"
      v-for="(rows, rIdx) in colors"
      :key="rIdx"
    >
      <div
        v-for="color in rows"
        :key="color"
        :title="color"
        class="ant-color-predefine__color-selector"
        :class="{
          advance: color === 'advance',
          transparent: color === 'transparent',
        }"
        @click="handleSelect(color)"
      >
        <div :style="{ backgroundColor: color }"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreDefine',
  emits: ['selected', 'hide'],
  computed: {
    colors() {
      return [
        // 第一行
        [
          '#fcc02e',
          '#f67c01',
          '#e64a19',
          '#d81b43',
          '#8e24aa',
          '#512da7',
          '#1f87e8',
          '#008781',
          '#05a045',
          '#4e342e',
        ],
        // 第二行
        [
          '#fed835',
          '#fb8c00',
          '#f5511e',
          '#eb1d4e',
          '#9c28b1',
          '#5d35b0',
          '#2097f3',
          '#029688',
          '#4cb050',
          '#5d4037',
        ],
        // 第三行
        [
          '#ffeb3c',
          '#ffa727',
          '#fe5722',
          '#eb4165',
          '#aa47bc',
          '#673bb7',
          '#42a5f6',
          '#26a59a',
          '#83c683',
          '#6d4c41',
        ],
        // 第四行
        [
          '#fff176',
          '#ffb74e',
          '#ff8a66',
          '#f1627e',
          '#b968c7',
          '#7986cc',
          '#64b5f6',
          '#80cbc4',
          '#a5d6a7',
          '#8d6e63',
        ],
        // 第五行
        [
          '#fff59c',
          '#ffcc80',
          '#ffab91',
          '#fb879e',
          '#cf93d9',
          '#9ea8db',
          '#90caf8',
          '#b2dfdc',
          '#c8e6ca',
          '#bcaaa4',
        ],
        // 最后一行
        [
          'transparent',
          '#ffffff',
          '#dedede',
          '#a9a9a9',
          '#808080',
          '#4b4b4b',
          '#353535',
          '#212121',
          '#000000',
          'advance',
        ],
      ];
    },
  },
  methods: {
    handleSelect(color) {
      if ('advance' === color) {
        return this.$emit('hide');
      }
      this.$emit('selected', color);
    },
  },
};
</script>

<style scoped>
.ant-color-predefine {
  display: flex;
  flex-direction: column;
  width: 280px;
  font-size: 12px;
}
.ant-color-predefine__colors {
  display: flex;
  flex-wrap: wrap;
}
.ant-color-predefine__color-selector {
  position: relative;
  cursor: pointer;
  margin: 0;
  width: 28px;
  height: 28px;
}
.ant-color-predefine__color-selector:hover {
  transform: scale(1.2);
  z-index: 299;
  transition: transform 0.2s;
}
.ant-color-predefine__color-selector.transparent::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
      45deg,
      #c5c5c5 25%,
      transparent 0,
      transparent 75%,
      #c5c5c5 0,
      #c5c5c5
    ),
    linear-gradient(
      45deg,
      #c5c5c5 25%,
      transparent 0,
      transparent 75%,
      #c5c5c5 0,
      #c5c5c5
    );
  background-size: 6px 6px;
  background-position: 0 0, 3px 3px;
}
.ant-color-predefine__color-selector.transparent::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  transform: rotate(-45deg);
  transform-origin: 0 0;
  width: 38px;
  height: 1px;
  background: red;
}
.ant-color-predefine__color-selector.advance {
  background: url(data:image/png;base64,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);
}
.ant-color-predefine__color-selector > div {
  height: 100%;
}
</style>
