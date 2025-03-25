const hsv2hsl = function (hue, sat, val) {
  return [
    hue,
    (sat * val) / ((hue = (2 - sat) * val) < 1 ? hue : 2 - hue) || 0,
    hue / 2,
  ];
};

const isOnePointZero = function (n) {
  return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
};

const isPercentage = function (n) {
  return typeof n === 'string' && n.indexOf('%') !== -1;
};

const bound01 = function (value, max) {
  if (isOnePointZero(value)) value = '100%';

  const processPercent = isPercentage(value);
  value = Math.min(max, Math.max(0, parseFloat(`${value}`)));

  if (processPercent) {
    value = parseInt(`${value * max}`, 10) / 100;
  }

  if (Math.abs(value - max) < 0.000001) {
    return 1;
  }

  return (value % max) / parseFloat(max);
};

const INT_HEX_MAP = { 10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F' };

const hexOne = function (value) {
  value = Math.min(Math.round(value), 255);
  const high = Math.floor(value / 16);
  const low = value % 16;
  return `${INT_HEX_MAP[high] || high}${INT_HEX_MAP[low] || low}`;
};

const toHex = function ({ r, g, b }) {
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '';

  return `#${hexOne(r)}${hexOne(g)}${hexOne(b)}`;
};

const HEX_INT_MAP = { A: 10, B: 11, C: 12, D: 13, E: 14, F: 15 };

const parseHexChannel = function (hex) {
  if (hex.length === 2) {
    return (
      (HEX_INT_MAP[hex[0].toUpperCase()] || +hex[0]) * 16 +
      (HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1])
    );
  }

  return HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1];
};

const hsl2hsv = function (hue, sat, light) {
  sat = sat / 100;
  light = light / 100;
  let smin = sat;
  const lmin = Math.max(light, 0.01);
  // let sv
  // let v

  light *= 2;
  sat *= light <= 1 ? light : 2 - light;
  smin *= lmin <= 1 ? lmin : 2 - lmin;
  const v = (light + sat) / 2;
  const sv =
    light === 0 ? (2 * smin) / (lmin + smin) : (2 * sat) / (light + sat);

  return {
    h: hue,
    s: sv * 100,
    v: v * 100,
  };
};

const rgb2hsv = function (r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  const v = max;

  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: {
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      }
      case g: {
        h = (b - r) / d + 2;
        break;
      }
      case b: {
        h = (r - g) / d + 4;
        break;
      }
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsv2rgb = function (h, s, v) {
  h = bound01(h, 360) * 6;
  s = bound01(s, 100);
  v = bound01(v, 100);

  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

/**
 * 将颜色字符串转换为可计算的数值
 * @param {String} value 颜色字符串
 * @returns {Object} {hue, saturation, brightness, alpha}
 *          hue: 色调
 *          saturation: 饱和度
 *          brightness: 明度
 *          alpha: 透明度
 */
const fromString = function (value) {
  let alpha = 100;
  value = (value || '').trim();

  const fromHSV = (h, s, v) => {
    return {
      hue: parseInt(Math.max(0, Math.min(360, h))), // 色调
      saturation: Math.max(0, Math.min(100, s)), // 饱和度
      brightness: Math.max(0, Math.min(100, v)), // 明度
      alpha: alpha, // 透明度
    };
  };

  if (value.indexOf('hsl') === 0) {
    const parts = value
      .replace(/hsla|hsl|\(|\)/gm, '')
      .split(/\s|,/g)
      .filter((val) => val !== '')
      .map((val, index) => (index > 2 ? parseFloat(val) : parseInt(val, 10)));

    if (parts.length === 4) {
      alpha = parseFloat(parts[3]) * 100;
    } else if (parts.length === 3) {
      alpha = 100;
    }
    if (parts.length >= 3) {
      const { h, s, v } = hsl2hsv(parts[0], parts[1], parts[2]);
      return fromHSV(h, s, v);
    }
  } else if (value.indexOf('hsv') === 0) {
    const parts = value
      .replace(/hsva|hsv|\(|\)/gm, '')
      .split(/\s|,/g)
      .filter((val) => val !== '')
      .map((val, index) => (index > 2 ? parseFloat(val) : parseInt(val, 10)));

    if (parts.length === 4) {
      alpha = parseFloat(parts[3]) * 100;
    } else if (parts.length === 3) {
      alpha = 100;
    }
    if (parts.length >= 3) {
      return fromHSV(parts[0], parts[1], parts[2]);
    }
  } else if (value.indexOf('rgb') === 0) {
    const parts = value
      .replace(/rgba|rgb|\(|\)/gm, '')
      .split(/\s|,/g)
      .filter((val) => val !== '')
      .map((val, index) => (index > 2 ? parseFloat(val) : parseInt(val, 10)));

    if (parts.length === 4) {
      alpha = parseFloat(parts[3]) * 100;
    } else if (parts.length === 3) {
      alpha = 100;
    }
    if (parts.length >= 3) {
      const { h, s, v } = rgb2hsv(parts[0], parts[1], parts[2]);
      return fromHSV(h, s, v);
    }
  } else if (value.indexOf('#') === 0) {
    const hex = value.replace('#', '').trim();
    if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(hex)) return;
    let r, g, b;

    if (hex.length === 3) {
      r = parseHexChannel(hex[0] + hex[0]);
      g = parseHexChannel(hex[1] + hex[1]);
      b = parseHexChannel(hex[2] + hex[2]);
    } else if (hex.length === 6 || hex.length === 8) {
      r = parseHexChannel(hex.substring(0, 2));
      g = parseHexChannel(hex.substring(2, 4));
      b = parseHexChannel(hex.substring(4, 6));
    }

    if (hex.length === 8) {
      alpha = (parseHexChannel(hex.substring(6)) / 255) * 100;
    } else if (hex.length === 3 || hex.length === 6) {
      alpha = 100;
    }

    const { h, s, v } = rgb2hsv(r, g, b);
    return fromHSV(h, s, v);
  }
  return {
    hue: 0, // 色调
    saturation: 0, // 饱和度
    brightness: 0, // 明度
    alpha: 100, // 透明度
  };
};

/**
 * 将颜色字符串转换为可计算的数值
 * @param {Object} {hue, saturation, brightness, alpha, format, enableAlpha}
 *          hue: 色调
 *          saturation: 饱和度
 *          brightness: 明度
 *          alpha: 透明度
 *          format: 输出格式化类型
 *          enableAlpha: 是否启用透明度
 * @returns {String} value 颜色字符串
 */
const hsv2String = function ({
  hue,
  saturation,
  brightness,
  alpha,
  format,
  enableAlpha,
}) {
  if (enableAlpha) {
    switch (format) {
      case 'hsl': {
        const hsl = hsv2hsl(hue, saturation / 100, brightness / 100);
        return `hsla(${hue}, ${Math.round(hsl[1] * 100)}%, ${Math.round(
          hsl[2] * 100
        )}%, ${alpha / 100})`;
      }
      case 'hsv': {
        return `hsva(${hue}, ${Math.round(saturation)}%, ${Math.round(
          brightness
        )}%, ${alpha / 100})`;
      }
      case 'hex': {
        return `${toHex(hsv2rgb(hue, saturation, brightness))}${hexOne(
          (alpha * 255) / 100
        )}`;
      }
      default: {
        const { r, g, b } = hsv2rgb(hue, saturation, brightness);
        return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
      }
    }
  } else {
    switch (format) {
      case 'hsl': {
        const hsl = hsv2hsl(hue, saturation / 100, brightness / 100);
        return `hsl(${hue}, ${Math.round(hsl[1] * 100)}%, ${Math.round(
          hsl[2] * 100
        )}%)`;
      }
      case 'hsv': {
        return `hsv(${hue}, ${Math.round(saturation)}%, ${Math.round(
          brightness
        )}%)`;
      }
      case 'rgb': {
        const { r, g, b } = hsv2rgb(hue, saturation, brightness);
        return `rgb(${r}, ${g}, ${b})`;
      }
      default: {
        return toHex(hsv2rgb(hue, saturation, brightness));
      }
    }
  }
};

export { hsv2rgb, fromString, hsv2String };
