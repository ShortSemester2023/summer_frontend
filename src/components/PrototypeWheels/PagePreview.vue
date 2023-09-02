<template>
  <div class="page-select container">
    <PageSelect />
    <div id="gjs"></div>
  </div>
</template>
<script>
import grapesjs from 'grapesjs'; // 引入 GrapesJS
import Plugin from 'grapesjs-blocks-basic'; //basic-blocks
import BasicPlugin from 'grapesjs-preset-webpage'; //basic-blocks
import gjsForms from 'grapesjs-plugin-forms'; //form-blocks
import Navbar from 'grapesjs-navbar'; 
import Countdown from 'grapesjs-component-countdown'; //倒计时
import Tabs from 'grapesjs-tabs';
import Tooltip from 'grapesjs-tooltip';
import CodePlugin from 'grapesjs-custom-code';
import Type from 'grapesjs-typed';
import ExportPlugin from 'grapesjs-plugin-export'; //导出html和css
import ScriptPlugin from 'grapesjs-script-editor'; //js代码编辑
import PageSelect from './PageSelect.vue';

export default {
    data() {
      return {
        pageId: '',
        editor: undefined,
        ws: undefined,
      }
        
    },
    components: {
      PageSelect,
    },
    mounted() {
      this.pageId = this.$route.params.protoId
      this.$watch('$route.params', (newVal, oldVal) => {
        this.pageId = newVal.protoId
        this.$http.get(`http://43.138.14.231/projects/${this.pageId}`).then((response) => {
          this.initEditor();
          this.banButton();
          this.setPreview();
          this.editor.on('load', () => {
            const prv = document.querySelector('#gjs > div.gjs-editor.gjs-one-bg.gjs-two-color > span')
            prv.style.display = 'none'
          })
        })
      })
      this.initEditor();
      this.banButton();
      this.setPreview();
      this.editor.on('load', () => {
        const prv = document.querySelector('#gjs > div.gjs-editor.gjs-one-bg.gjs-two-color > span')
        prv.style.display = 'none'
      })
    },
    methods: {
      initEditor() {
        this.editor = grapesjs.init({
          container: '#gjs',
          plugins: [
					Plugin,
					BasicPlugin,
					ExportPlugin,
					Tabs,
					Tooltip,
					CodePlugin,
					Countdown,
					gjsForms,
					Type,
					Navbar,
					ScriptPlugin
				],
          storageManager: {
            type: 'remote',
            options: {
              remote: {
                urlLoad: `http://43.138.14.231/projects/${this.pageId}/`,
							  urlStore: `http://43.138.14.231/projects/${this.pageId}/`,
                fetchOptions: opts => (opts.method === 'POST' ?  { method: 'PATCH' } : {}),
                onStore: data => {
                  // this.ws.send(JSON.stringify(data))
                  if (data.pages.length == 0) {
                    data.pages.push({})
                  }
                  return {
                    id: this.pageId,
                    data,
                    //存储画布宽高
                    size: {
                      height: this.canvasHeight,
                      width: this.canvasWidth,
                    },
                    Devices: this.Devices,
                  }
                },
                onLoad: result => {
                  if (result.Devices && result.size) {
                    this.Devices = result.Devices
                    this.canvasHeight = result.size.height
                    this.canvasWidth = result.size.width
                  }
                  console.log(result)
                  return result.data
                }
              }
            }
          }
        })
      },
      setPreview() {
        this.editor.on('load', () => {
          this.editor.runCommand('preview');
        });
      },
      banButton() {
        this.editor.Panels.removeButton('options', 'preview');
      }
    }
}
</script>
<style scoped>
.container {
  width: 80%;
  margin: auto;
  /* display: flex;
  justify-content: center; */
}
:deep(#editor) {
    position: relative;
}

:deep(#editor::before) {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.5);  
    pointer-events: none; 
}
</style>