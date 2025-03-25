<template>
  <a-popover
    v-model="showPicker"
    :placement="placement"
    trigger="click"
    :overlayStyle="{ width: '312px' }"
    v-bind="$attrs"
  >
    <template #content>
      <PreDefine
        v-if="showEasyPanel"
        @selected="onChanged"
        @hide="showEasyPanel = false"
      />
      <template v-else>
        <a-icon
          class="ant-color-picker-back"
          type="rollback"
          @click="showEasyPanel = true"
        />
        <SvPanel
          :hue="color.hue"
          :saturation="color.saturation"
          :brightness="color.brightness"
          @change="onSvPanelChanged"
          @hide="showEasyPanel = true"
        />
      </template>
      <div class="ant-color-picker-slider_wrapper">
        <div>
          <HueSlider class="hue-slider" v-model="color.hue" />
          <AlphaSlider :rgb="rgb" v-model="color.alpha" />
        </div>
        <div class="ant-color-picker__sliders-preview">
          <span
            class="ant-color-picker__sliders-preview-inner"
            :style="{ 'background-color': displayedColor }"
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
            style="width: 80px"
            v-model="selectedFormat"
          >
            <a-select-option v-for="format in colorFormats" :key="format">
              {{ format }}
            </a-select-option>
          </a-select>
        </a-input>
      </div>
      <HistorySelector
        v-if="historyColors.length"
        :colors="historyColors"
        @selected="onChanged"
      />
    </template>
    <a-input
      :value="value"
      :size="size"
      allow-clear
      @pressEnter="onChanged($event.target.value)"
      @blur="onChanged($event.target.value)"
      @change="debounceChanged($event.target.value)"
    >
      <span
        slot="prefix"
        class="ant-color-picker_preview"
        :style="{ 'background-color': value }"
      ></span>
    </a-input>
  </a-popover>
</template>
<script>
import { debounce } from 'lodash';
import PreDefine from './components/PreDefine.vue';
import SvPanel from './components/SvPanel.vue';
import HueSlider from './components/HueSlider.vue';
import AlphaSlider from './components/AlphaSlider.vue';
import HistorySelector from './components/HistorySelector.vue';
import { hsv2rgb, fromString, hsv2String } from './lib/color';

const MAX_STORAGE_LENGTH = 20;
const HistoryColorKey = 'color-history';
const colorFormats = ['rgb', 'hex', 'hsl', 'hsv'];
export default {
  name: 'ColorPicker',
  components: {
    PreDefine,
    SvPanel,
    HueSlider,
    AlphaSlider,
    HistorySelector,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
    },
    showAlpha: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: 'default',
    },
    format: {
      type: String,
      default: 'rgb',
      validator: (val) => {
        return colorFormats.includes(val);
      },
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
      showPicker: false,
      showEasyPanel: true,
      color: {
        hue: 0, // 色调
        saturation: 0, // 饱和度
        brightness: 0, // 明度
        alpha: 100, // 透明度
      },

      selectedFormat: '',

      historyColors: [],
    };
  },
  computed: {
    colorFormats() {
      return colorFormats;
    },
    rgb() {
      return hsv2rgb(
        this.color.hue,
        this.color.saturation,
        this.color.brightness
      );
    },
    colorValue() {
      return {
        hue: this.color.hue,
        saturation: this.color.saturation,
        brightness: this.color.brightness,
        alpha: this.color.alpha,
      };
    },
    displayedColor() {
      return hsv2String({
        ...this.colorValue,
        format: this.selectedFormat,
        enableAlpha: this.showAlpha,
      });
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        if (!newVal) return;
        const color = fromString(newVal);
        if (!color) return;
        this.color = color;
      },
    },
    format: {
      immediate: true,
      handler(newVal) {
        this.selectedFormat = newVal;
      },
    },
    colorValue: {
      handler(color) {
        this.debounceEmitColorValue(color);
        if (this.isChanged) return;
        this.isChanged = true;
      },
    },
  },
  methods: {
    onSvPanelChanged({ saturation, brightness }) {
      this.color.saturation = saturation;
      this.color.brightness = brightness;
    },
    emitColorValue(color) {
      const value = hsv2String({
        ...color,
        format: this.format,
        enableAlpha: this.showAlpha,
      });
      this.$emit('change', value);
      this.$nextTick(() => {
        this.storageHistoryColors();
      });
    },
    onChanged(value) {
      const color = fromString(value);
      if (!color) return;
      this.emitColorValue(color);
    },
    debounceChanged: debounce(function (value) {
      this.onChanged(value);
    }, 500),
    debounceEmitColorValue: debounce(function (color) {
      this.emitColorValue(color);
    }, 500),
    storageHistoryColors() {
      const { r, g, b } = this.rgb;
      const alpha = this.color.alpha;
      const value = `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
      this.historyColors = [
        value,
        ...this.historyColors.filter((v) => v != value),
      ].slice(0, MAX_STORAGE_LENGTH);
      localStorage.setItem(HistoryColorKey, JSON.stringify(this.historyColors));
    },
  },
  mounted() {
    this.historyColors = JSON.parse(
      localStorage.getItem(HistoryColorKey) || '[]'
    ).slice(0, MAX_STORAGE_LENGTH);
  },
};
</script>
<style scoped>
.ant-color-picker-back {
  padding: 10px;
  margin: -10px 0 0 -10px;
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
