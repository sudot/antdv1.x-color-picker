<template>
  <div class="ant-color-history">
    <div
      v-for="color in colors"
      :key="color"
      :title="color"
      class="ant-color-history__color"
      @click="handleSelect(color)"
    >
      <div :style="{ background: color }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistorySelector',
  props: {
    colors: {
      type: Array,
      required: true,
    },
  },
  emits: ['selected'],
  methods: {
    handleSelect(color) {
      this.$emit('selected', color);
    },
  },
};
</script>

<style scoped>
.ant-color-history {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
}
.ant-color-history__color {
  width: 24px;
  height: 24px;
  margin: 0 0 4px 4px;
  border-radius: 4px;
  cursor: pointer;
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
.ant-color-history__color:nth-child(10n + 1) {
  margin-left: 0;
}
.ant-color-history__color > div {
  height: 100%;
  border-radius: 3px;
  border: 1px solid #e8e8e8;
  transition: all 0.2s cubic-bezier(0.38, 0, 0.24, 1);
}
.ant-color-history__color > div:hover {
  transform: scale(1.25);
  transform-origin: center;
}
</style>
