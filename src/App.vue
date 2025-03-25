<template>
  <div id="app">
    <div class="page-header">
      <h1>antdv1.x-color-picker</h1>
      <h2>基于 Vue2 和 Ant Design of Vue 1.x 封装的颜色选择器组件</h2>
      <a
        href="https://gitee.com/sudot/antdv1.x-color-picker"
        class="btn"
        target="_blank"
      >
        View on Gitee
      </a>
      <a
        href="https://github.com/sudot/antdv1.x-color-picker"
        class="btn"
        target="_blank"
      >
        View on GitHub
      </a>
    </div>
    <div class="page-content">
      <h1>antdv1.x-color-picker</h1>
      <p>
        ant-design-vue 的 UI 框架中，并没有 ColorPicker
        颜色选择器。找了一圈没有找到合适的支持 Vue2 的颜色选择组件，最终找到了
        <code>
          <a
            href="https://gitee.com/ghkeeping/ant-color-picker"
            target="_blank"
          >
            https://gitee.com/ghkeeping/ant-color-picker
          </a>
        </code>
        ，并在其源码基础上修改后适配 Vue2 和 Antdv1.x 封装了该组件。
      </p>
      <h2>示例</h2>
      <a-form-model
        ref="ruleForm"
        class="form"
        :model="ruleForm"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 14 }"
      >
        <a-form-model-item label="Color1">
          <a-row :gutter="[8, 8]">
            <a-col :span="12">
              <color-picker
                v-model="ruleForm.color"
                show-alpha
                placement="bottomLeft"
              />
            </a-col>
            <a-col :span="12" :style="{ color: ruleForm.color }">
              回显：{{ ruleForm.color }}
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item label="Color1">
          <a-row :gutter="[8, 8]">
            <a-col :span="12">
              <color-picker
                v-model="ruleForm.color1"
                show-alpha
                format="hex"
                placement="bottomLeft"
              />
            </a-col>
            <a-col :span="12" :style="{ color: ruleForm.color1 }">
              回显：{{ ruleForm.color1 }}
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item label="Color2">
          <a-row :gutter="[8, 8]">
            <a-col :span="12">
              <color-picker
                v-model="ruleForm.color2"
                show-alpha
                format="hsl"
                placement="bottomLeft"
              />
            </a-col>
            <a-col :span="12" :style="{ color: ruleForm.color2 }">
              回显：{{ ruleForm.color2 }}
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item label="外部操作">
          <a-button @click="onClickSetColor('#FF0000')">设置固定颜色</a-button>
          <a-button style="margin-left: 10px" @click="onClickSetColor('')">
            清空值
          </a-button>
        </a-form-model-item>
      </a-form-model>
      <h2>使用方法</h2>
      <ol>
        <li>
          将
          <code>src/components/color-picker</code>
          整个目录拷贝至你项目中任意位置。
        </li>
        <li>
          在你的要使用此组件的页面中，引入
          <code>src/components/color-picker/index.vue</code>
          即可。
        </li>
      </ol>
      <pre><code class="language-html">&lt;template&gt;
  &lt;color-picker v-model=&quot;color&quot; /&gt;
&lt;/template&gt;

&lt;script&gt;
  import ColorPicker from '@/components/color-picker';

  export default {
    components: { ColorPicker },
    data () {
      return {
        color: &#x27;#ff0000&#x27;
      }
    }
  }
&lt;/script&gt;</code></pre>
      <h2>属性</h2>
      <table>
        <thead>
          <tr>
            <th>属性</th>
            <th>说明</th>
            <th>类型</th>
            <th>可选值</th>
            <th>默认值</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>value/v-model</td>
            <td>绑定值</td>
            <td>string</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>size</td>
            <td>尺寸</td>
            <td>string</td>
            <td>
              <code>large</code>
              <code>default</code>
              <code>small</code>
            </td>
            <td><code>default</code></td>
          </tr>
          <tr>
            <td>color-format</td>
            <td>写入 v-model 的颜色格式</td>
            <td>string</td>
            <td>
              <code>hsl</code>
              <code>hsv</code>
              <code>hex</code>
              <code>rgb</code>
            </td>
            <td><code>rgb</code></td>
          </tr>
          <tr>
            <td>predefine</td>
            <td>预定义颜色</td>
            <td>Array&lt;string&gt;</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>placement</td>
            <td>颜色选择器弹出位置</td>
            <td>string</td>
            <td>
              <code>top</code>
              <code>left</code>
              <code>right</code>
              <br />
              <code>bottom</code>
              <code>topLeft</code>
              <br />
              <code>topRight</code>
              <code>bottomLeft</code>
              <br />
              <code>bottomRight</code>
              <code>leftTop</code>
              <br />
              <code>leftBottom</code>
              <code>rightTop</code>
              <br />
              <code>rightBottom</code>
            </td>
            <td><code>bottomRight</code></td>
          </tr>
        </tbody>
      </table>
      <h2>事件</h2>
      <table>
        <thead>
          <tr>
            <th>事件名称</th>
            <th>说明</th>
            <th>回调参数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>change</td>
            <td>当绑定值变化时触发</td>
            <td>当前值</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="page-footer">
      antdv1.x-color-picker 组件由
      <a href="https://sudot.net/antdv1.x-color-picker/" target="_blank">
        sudot
      </a>
      编写
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js/lib/common';
import ColorPicker from '@/components/color-picker';

export default {
  name: 'App',
  components: {
    ColorPicker,
  },
  data() {
    return {
      ruleForm: {
        color: '',
        color1: undefined,
        color2: '#FF0000',
      },
    };
  },
  methods: {
    onClickSetColor(color) {
      this.ruleForm.color = color;
      this.ruleForm.color1 = color;
      this.ruleForm.color2 = color;
    },
  },
  mounted() {
    hljs.highlightAll();
  },
};
</script>

<style>
@import 'highlight.js/styles/github.min.css';
@import 'assets/main.css';

table > thead > tr > th {
  text-align: center;
}
table > thead > tr > th,
table > tbody > tr > td {
  padding: 5px 10px;
  border: 1px solid #d0d7de;
}
</style>
