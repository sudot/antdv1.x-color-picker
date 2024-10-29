<template>
  <a-popover
    v-model="showPicker"
    :placement="placement"
    trigger="click"
    v-bind="$attrs"
    class="ant-color-picker-popover"
  >
    <template #content>
      <SvPanel ref="svPanel" :color="color" />
      <div class="ant-color-picker-slider_wrapper">
        <div>
          <HueSlider ref="hue" class="hue-slider" :color="color" />
          <AlphaSlider ref="alpha" :color="color" />
        </div>
        <div class="ant-color-picker__sliders-preview">
          <span
            class="ant-color-picker__sliders-preview-inner"
            :style="{ 'background-color': currentColor }"
          ></span>
        </div>
      </div>
      <div class="ant-color-dropdown__btns">
        <a-input
          :value="displayedColor"
          :size="size"
          @pressEnter="onChanged($event.target.value)"
          @blur="onChanged($event.target.value)"
        >
          <a-select
            slot="addonBefore"
            v-model="selectedFormat"
            style="width: 80px"
          >
            <a-select-option
              :value="format"
              v-for="format in colorFormats"
              :key="format"
            >
              {{ format }}
            </a-select-option>
          </a-select>
        </a-input>
      </div>
      <preDefine
        v-if="predefine.length"
        ref="predefine"
        :colors="predefine"
        @selected="onChanged"
      />
    </template>
    <a-input
      :value="currentColor"
      :size="size"
      allow-clear
      @pressEnter="onChanged($event.target.value)"
      @blur="onChanged($event.target.value)"
      @change="onChanged($event.target.value)"
    >
      <span
        slot="prefix"
        class="ant-color-picker_preview"
        :style="{ 'background-color': currentColor }"
      ></span>
    </a-input>
  </a-popover>
</template>
<script>
import HueSlider from './components/hueSlider.vue';
import SvPanel from './components/svPanel.vue';
import AlphaSlider from './components/alphaSlider.vue';
import preDefine from './components/preDefine.vue';
import Color from './lib/color';

const colorFormats = ['rgb', 'hex', 'hsl', 'hsv'];
export default {
  name: 'ColorPicker',
  components: {
    HueSlider,
    SvPanel,
    preDefine,
    AlphaSlider,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
    },
    size: {
      type: String,
      default: 'default',
    },
    colorFormat: {
      type: String,
      default: 'rgb',
      validator: (val) => {
        return colorFormats.includes(val);
      },
    },
    predefine: {
      type: Array,
      default: () => [],
    },
    placement: {
      type: String,
      default: 'bottomRight',
    },
  },
  emits: ['change'],
  data() {
    return {
      isChanged: false,
      color: new Color({
        enableAlpha: true,
        format: this.colorFormat,
      }),
      showPicker: false,
      selectedFormat: '',
      selectedColor: new Color({
        enableAlpha: true,
        format: this.colorFormat,
      }),

      colorFormats: [...colorFormats],
    };
  },
  computed: {
    currentColor() {
      return this.isChanged ? this.color.value : this.value;
    },
    displayedColor() {
      if (this.selectedFormat == this.colorFormat) {
        return this.currentColor;
      }
      return this.selectedColor.fromString(this.currentColor);
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        this.color.fromString(newVal);
      },
    },
    colorFormat: {
      immediate: true,
      handler(newVal) {
        this.selectedFormat = newVal;
        this.color.format = newVal;
        this.color.doOnChange();
      },
    },
    selectedFormat: {
      immediate: true,
      handler(newVal) {
        this.selectedColor = new Color({
          enableAlpha: true,
          format: newVal,
        });
      },
    },
    currentColor: {
      handler(newVal) {
        this.$emit('change', newVal);
      },
    },
    showPicker: {
      immediate: true,
      handler(newVal) {
        if (!newVal) return;
        this.$nextTick(() => {
          this.$refs.svPanel?.update();
          this.$refs.hue?.update();
          this.$refs.alpha?.update();
        });
      },
    },
  },
  methods: {
    onChanged(value) {
      this.isChanged = true;
      this.color.fromString(value);
    },
  },
};
</script>
<style scoped>
.ant-color-picker-popover {
  display: flex;
  align-items: center;
}
.ant-color-picker-slider_wrapper {
  display: flex;
  align-items: center;
  margin-top: 8px;
}
.ant-color-picker-slider_wrapper > div:first-child {
  flex: 1;
  margin-right: 10px;
}
.ant-color-picker__sliders-preview {
  width: 36px;
  height: 36px;
  border-radius: 3px;
  overflow: hidden;
  background: #fff;
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
.ant-color-picker__sliders-preview-inner {
  display: block;
  width: 100%;
  height: 100%;
}
.ant-color-picker_preview {
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  max-width: 20px;
  max-height: 20px;
  position: relative;
  border: 1px solid #e6e6e6;
  border-radius: 2px;
  margin-left: -6px;
}
.ant-color-dropdown__btns {
  display: flex;
}
</style>
