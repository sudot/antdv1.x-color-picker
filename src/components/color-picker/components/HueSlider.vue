<template>
  <div class="ant-color-hue-slider">
    <div ref="bar" class="ant-color-hue-slider__bar" @click="handleClick"></div>
    <div
      ref="thumb"
      class="ant-color-hue-slider__thumb"
      :style="{ left: thumbLeft + 'px' }"
    ></div>
  </div>
</template>

<script>
import draggable from '../lib/draggable.js';

export default {
  name: 'HueSlider',
  model: { prop: 'hue', event: 'change' },
  props: {
    hue: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      sliderWidth: 0,
    };
  },
  emits: ['change'],
  computed: {
    thumbLeft() {
      return Math.round((this.hue * this.sliderWidth) / 360);
    },
  },
  methods: {
    handleClick(event) {
      if (event.target !== this.$refs.thumb) {
        this.handleDrag(event);
      }
    },
    handleDrag(event) {
      const rect = this.$el.getBoundingClientRect();

      let offset = Math.max(0, event.clientX - rect.left);
      offset = Math.min(offset, this.sliderWidth);
      const hue = (offset / this.sliderWidth) * 360;

      this.$emit('change', hue);
    },
  },
  mounted() {
    const dragConfig = {
      drag: (event) => {
        this.handleDrag(event);
      },
      end: (event) => {
        this.handleDrag(event);
      },
    };

    draggable(this.$refs.bar, dragConfig);
    draggable(this.$refs.thumb, dragConfig);
    this.sliderWidth = this.$el.clientWidth - this.$refs.thumb.offsetWidth / 2;
  },
};
</script>

<style scoped>
.ant-color-hue-slider {
  box-sizing: border-box;
  position: relative;
  height: 12px;
  margin-bottom: 12px;
}
.ant-color-hue-slider__bar {
  height: 100%;
  border-radius: 12px;
  position: relative;
  background: linear-gradient(
    to right,
    #f00 0%,
    #ff0 17%,
    #0f0 33%,
    #0ff 50%,
    #00f 67%,
    #f0f 83%,
    #f00 100%
  );
}
.ant-color-hue-slider__thumb {
  cursor: pointer;
  position: absolute;
  box-sizing: border-box;
  z-index: 1;
  left: 0;
  top: 50%;
  width: 18px;
  height: 18px;
  transform: translate(-9px, -50%);
  border-radius: 100%;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
}
</style>
