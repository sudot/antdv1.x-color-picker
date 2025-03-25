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
        <a-button
          class="ant-color-picker-back"
          size="small"
          @click="showEasyPanel = true"
        >
          返回
        </a-button>
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
          <HueSlider
            class="hue-slider"
            v-model="color.hue"
            v-if="!showEasyPanel"
          />
          <AlphaSlider :rgb="rgb" v-model="color.alpha" />
        </div>
        <div class="ant-color-picker__sliders-preview">
          <span
            class="ant-color-picker__sliders-preview-inner"
            :style="{ 'background-color': rgbString }"
          ></span>
        </div>
      </div>
      <div class="ant-color-dropdown__btns">
        <a-input
          :value="selectedFormatColor"
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
        :style="{ 'background-color': rgbString }"
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
import tinycolor from './lib/tinycolor.js';
window.tinycolor = tinycolor;
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
        alpha: 0, // 透明度
      },

      selectedFormat: '',

      historyColors: [],
    };
  },
  computed: {
    colorFormats() {
      return colorFormats;
    },
    colorValue() {
      return {
        h: this.color.hue,
        s: this.color.saturation / 100,
        v: this.color.brightness / 100,
        a: this.color.alpha / 100,
      };
    },
    tcColor() {
      return tinycolor(this.colorValue);
    },
    rgb() {
      return this.tcColor.toRgb();
    },
    rgbString() {
      return this.tcColor.toRgbString();
    },
    selectedFormatColor() {
      return this.tcColor.toString(this.selectedFormat);
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        if (!newVal) return;
        const tc = tinycolor(newVal);
        if (!tc.isValid()) return;
        const { h, s, v, a } = tc.toHsv();
        this.color = {
          hue: h,
          // 乘 10000 再除 100 是为了保留精度，避免出现逆向转换后和正向转换的结果不一致
          // 例如 #fcc02e 转为 hsv 之后再转为 hex 则会变成 #fcc02d
          // 增加精度之后就不会发生这样的情况了
          saturation: Math.round(s * 10000) / 100,
          brightness: Math.round(v * 10000) / 100,
          alpha: Math.round(a * 10000) / 100,
        };
      },
    },
    format: {
      immediate: true,
      handler(newVal) {
        this.selectedFormat = newVal;
      },
    },
    colorValue: {
      handler() {
        this.debounceEmitColorValue(this.tcColor);
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
    emitColorValue(tc) {
      this.$emit('change', tc.toString(this.format));
      this.$nextTick(() => {
        this.storageHistoryColors();
      });
    },
    onChanged(value) {
      const tc = tinycolor(value);
      if (!tc.isValid()) return;
      this.emitColorValue(tc);
    },
    debounceChanged: debounce(function (value) {
      this.onChanged(value);
    }, 500),
    debounceEmitColorValue: debounce(function (tc) {
      this.emitColorValue(tc);
    }, 500),
    storageHistoryColors() {
      const value = this.rgbString;
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
  margin-bottom: 10px;
}
.ant-color-picker-slider_wrapper {
  display: flex;
  align-items: center;
  margin: 12px 0;
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
