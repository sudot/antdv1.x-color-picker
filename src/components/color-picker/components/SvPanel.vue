<template>
  <div
    class="ant-color-svpanel"
    :style="{ backgroundColor: `hsl(${hue}, 100%, 50%)` }"
  >
    <div class="ant-color-svpanel__white"></div>
    <div class="ant-color-svpanel__black"></div>
    <div
      class="ant-color-svpanel__cursor"
      :style="{
        top: cursorTop + 'px',
        left: cursorLeft + 'px',
      }"
    ></div>
  </div>
</template>

<script>
import draggable from '../lib/draggable';

export default {
  name: 'SvPanel',
  props: {
    // 色调
    hue: {
      type: Number,
      required: true,
    },
    // 饱和度
    saturation: {
      type: Number,
      required: true,
    },
    // 明度
    brightness: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      panelWidth: 0,
      panelHeight: 0,
    };
  },
  emits: ['change'],
  computed: {
    cursorTop() {
      return ((100 - this.brightness) * this.panelHeight) / 100;
    },
    cursorLeft() {
      return (this.saturation * this.panelWidth) / 100;
    },
  },
  methods: {
    handleDrag(event) {
      const rect = this.$el.getBoundingClientRect();

      let left = event.clientX - rect.left;
      let top = event.clientY - rect.top;

      left = Math.max(0, left);
      left = Math.min(left, rect.width);
      top = Math.max(0, top);
      top = Math.min(top, rect.height);

      this.$emit('change', {
        saturation: (left / rect.width) * 100,
        brightness: 100 - (top / rect.height) * 100,
      });
    },
  },

  mounted() {
    draggable(this.$el, {
      drag: (event) => {
        this.handleDrag(event);
      },
      end: (event) => {
        this.handleDrag(event);
      },
    });
    this.panelWidth = this.$el.clientWidth;
    this.panelHeight = this.$el.clientHeight;
  },
};
</script>

<style scoped>
.ant-color-svpanel {
  position: relative;
  height: 180px;
  border-radius: 3px;
  overflow: hidden;
}

.ant-color-svpanel__white,
.ant-color-svpanel__black {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.ant-color-svpanel__white {
  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
}
.ant-color-svpanel__black {
  background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
}
.ant-color-svpanel__cursor {
  position: absolute;
  width: 18px;
  height: 18px;
  box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0, 0, 0, 0.3),
    0 0 1px 2px rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
</style>
