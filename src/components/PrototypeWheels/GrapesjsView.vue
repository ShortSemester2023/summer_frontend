<template>
  <span id="size-setter" v-if="Devices !== undefined">
    <!-- 桌面端按钮 -->
    <span @click="switchDevice(0)"
      :class="{ 'selected-device': Devices[0].selected, 'unselected-device': !Devices[0].selected }" class="tooltip">
      <svg t="1693450725716" class="icon" style="cursor: pointer;" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="1477" width="23" height="23">
        <path
          d="M928 140H96c-17.7 0-32 14.3-32 32v496c0 17.7 14.3 32 32 32h380v112H304c-8.8 0-16 7.2-16 16v48c0 4.4 3.6 8 8 8h432c4.4 0 8-3.6 8-8v-48c0-8.8-7.2-16-16-16H548V700h380c17.7 0 32-14.3 32-32V172c0-17.7-14.3-32-32-32z m-40 488H136V212h752v416z"
          p-id="1478"></path>
      </svg>
      <span class="tooltiptext">PC端</span>
    </span>
    <!-- 平板按钮 -->
    <span @click="switchDevice(1)"
      :class="{ 'selected-device': Devices[1].selected, 'unselected-device': !Devices[1].selected }" class="tooltip">
      <svg t="1693456457079" class="icon" style="cursor: pointer;" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="2689" width="23" height="23">
        <path
          d="M800 64H224c-35.3 0-64 28.7-64 64v768c0 35.3 28.7 64 64 64h576c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64z m-8 824H232V136h560v752z"
          p-id="2690"></path>
        <path d="M512 784m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z" p-id="2691"></path>
      </svg>
      <span class="tooltiptext">平板端</span>
    </span>
    <!-- 手机按钮 -->
    <span @click="switchDevice(2)"
      :class="{ 'selected-device': Devices[2].selected, 'unselected-device': !Devices[2].selected }" class="tooltip">
      <svg t="1693456616174" class="icon" style="cursor: pointer;" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="4595" width="23" height="23">
        <path
          d="M746.666667 949.333333H277.333333c-40.533333 0-74.666667-34.133333-74.666666-74.666666V149.333333c0-40.533333 34.133333-74.666667 74.666666-74.666666h469.333334c40.533333 0 74.666667 34.133333 74.666666 74.666666v725.333334c0 40.533333-34.133333 74.666667-74.666666 74.666666z m-469.333334-810.666666c-6.4 0-10.666667 4.266667-10.666666 10.666666v725.333334c0 6.4 4.266667 10.666667 10.666666 10.666666h469.333334c6.4 0 10.666667-4.266667 10.666666-10.666666V149.333333c0-6.4-4.266667-10.666667-10.666666-10.666666H277.333333z"
          p-id="4596"></path>
        <path d="M512 768m-42.666667 0a42.666667 42.666667 0 1 0 85.333334 0 42.666667 42.666667 0 1 0-85.333334 0Z"
          p-id="4597"></path>
        <path
          d="M597.333333 245.333333h-170.666666c-17.066667 0-32-14.933333-32-32s14.933333-32 32-32h170.666666c17.066667 0 32 14.933333 32 32s-14.933333 32-32 32z"
          p-id="4598"></path>
      </svg>
      <span class="tooltiptext">手机端</span>
    </span>
    <!-- 自定义按钮 -->
    <span @click="switchDevice(3)"
      :class="{ 'selected-device': Devices[3].selected, 'unselected-device': !Devices[3].selected }" class="tooltip">
      <svg t="1693400825308" style="cursor: pointer;" class="icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="11286" id="mx_n_1693400825309" width="23" height="23">
        <path
          d="M863.744 896h-224.256c-17.92 0-31.744-14.336-31.744-31.744s14.336-31.744 31.744-31.744h192.512v-640h-640v190.976c0 17.92-14.336 32.256-32.256 32.256S128 400.896 128 383.488V160.256c0-17.92 14.336-32.256 32.256-32.256h704c17.92 0 31.744 14.336 31.744 32.256v704c0 17.408-14.336 31.744-32.256 31.744z"
          p-id="11287"></path>
        <path
          d="M482.304 896h-322.56c-17.92 0-32.256-14.336-32.256-31.744v-322.56c0-17.92 14.336-32.256 32.256-32.256h322.56c17.92 0 32.256 14.336 32.256 32.256v322.56c0 17.408-14.336 31.744-32.256 31.744z m-290.304-64H450.56V573.44H192v258.56z"
          p-id="11288"></path>
      </svg>
      <span class="tooltiptext">自定义画布大小</span>
    </span>
    <span v-if="Devices[3].selected" class="animate__animated animate__fadeIn">
      <svg t="1693312903898" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="2576" width="25" height="25">
        <path
          d="M819.198 910.218 204.799 910.218c-50.267 0-91.022-40.75-91.022-91.02L113.777 204.822c0-50.29 40.755-91.045 91.022-91.045l614.398 0c50.27 0 91.02 40.755 91.02 91.045l0 614.376C910.218 869.468 869.468 910.218 819.198 910.218zM841.953 227.554c0-25.122-20.385-45.51-45.51-45.51L227.554 182.044c-25.122 0-45.51 20.387-45.51 45.51l0 568.889c0 25.125 20.387 45.535 45.51 45.535l568.889 0c25.125 0 45.51-20.39 45.51-45.535L841.953 227.554zM603.268 400.952l-57.14-57.115 0 335.802 55.505-55.5c13.335-13.31 34.93-13.335 48.265 0 13.33 13.335 13.33 34.95 0 48.29l-105.77 105.765c-1.615 3.415-3.525 6.78-6.37 9.625-7.1 7.08-16.475 10.1-25.76 9.67-9.262 0.46-18.66-2.59-25.76-9.69-2.842-2.85-4.8-6.15-6.347-9.58l-105.79-105.79c-13.335-13.34-13.335-34.955 0-48.29 13.332-13.31 34.927-13.335 48.262 0l55.502 55.5L477.865 343.837l-57.117 57.115c-13.335 13.357-34.952 13.335-48.287 0s-13.335-34.93 0-48.265l115.395-115.37c13.332-13.335 34.927-13.357 48.262 0l115.395 115.37c13.335 13.335 13.335 34.952 0 48.265C638.198 414.286 616.583 414.286 603.268 400.952z"
          fill="#c71d23" p-id="2577"></path>
      </svg>
      <input type="number" v-model="canvasWidth" max="100000"> px</span>
    <span v-if="Devices[3].selected" class="animate__animated animate__fadeIn"><svg t="1693314788367" class="icon "
        viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3702" width="25" height="25">
        <path
          d="M113.777 819.198 113.777 204.8c0-50.267 40.75-91.022 91.02-91.022l614.376 0c50.29 0 91.045 40.755 91.045 91.022l0 614.398c0 50.27-40.755 91.02-91.045 91.02L204.797 910.218C154.527 910.218 113.777 869.468 113.777 819.198zM796.438 841.953c25.125 0 45.51-20.385 45.51-45.51L841.948 227.554c0-25.122-20.385-45.51-45.505-45.51L227.552 182.044c-25.125 0-45.535 20.387-45.535 45.51l0 568.889c0 25.125 20.39 45.51 45.535 45.51L796.438 841.953zM623.043 603.269l57.115-57.14L344.357 546.129l55.5 55.505c13.31 13.335 13.335 34.93 0 48.265-13.335 13.33-34.95 13.33-48.29 0l-105.765-105.77c-3.415-1.615-6.78-3.525-9.625-6.37-7.08-7.1-10.1-16.475-9.67-25.76-0.46-9.262 2.59-18.66 9.69-25.76 2.85-2.842 6.15-4.8 9.58-6.348l105.79-105.79c13.34-13.335 34.955-13.335 48.29 0 13.31 13.332 13.335 34.927 0 48.262l-55.5 55.502 335.802 0-57.115-57.117c-13.355-13.335-13.335-34.952 0-48.287s34.93-13.335 48.265 0l115.37 115.395c13.335 13.332 13.36 34.927 0 48.262l-115.37 115.395c-13.335 13.335-34.95 13.335-48.265 0C609.708 638.198 609.708 616.583 623.043 603.269z"
          fill="#c71d23" p-id="3703"></path>
      </svg>
      <input type="number" v-model="canvasHeight" max="100000"> px
    </span>
    <button @click="exportAsImage" class="tooltip">
      <svg t="1693619986390" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="2613" width="23" height="23">
        <path
          d="M938.666667 553.92V768c0 64.8-52.533333 117.333333-117.333334 117.333333H202.666667c-64.8 0-117.333333-52.533333-117.333334-117.333333V256c0-64.8 52.533333-117.333333 117.333334-117.333333h618.666666c64.8 0 117.333333 52.533333 117.333334 117.333333v297.92z m-64-74.624V256a53.333333 53.333333 0 0 0-53.333334-53.333333H202.666667a53.333333 53.333333 0 0 0-53.333334 53.333333v344.48A290.090667 290.090667 0 0 1 192 597.333333a286.88 286.88 0 0 1 183.296 65.845334C427.029333 528.384 556.906667 437.333333 704 437.333333c65.706667 0 126.997333 16.778667 170.666667 41.962667z m0 82.24c-5.333333-8.32-21.130667-21.653333-43.648-32.917333C796.768 511.488 753.045333 501.333333 704 501.333333c-121.770667 0-229.130667 76.266667-270.432 188.693334-2.730667 7.445333-7.402667 20.32-13.994667 38.581333-7.68 21.301333-34.453333 28.106667-51.370666 13.056-16.437333-14.634667-28.554667-25.066667-36.138667-31.146667A222.890667 222.890667 0 0 0 192 661.333333c-14.464 0-28.725333 1.365333-42.666667 4.053334V768a53.333333 53.333333 0 0 0 53.333334 53.333333h618.666666a53.333333 53.333333 0 0 0 53.333334-53.333333V561.525333zM320 480a96 96 0 1 1 0-192 96 96 0 0 1 0 192z m0-64a32 32 0 1 0 0-64 32 32 0 0 0 0 64z"
          p-id="2614"></path>
      </svg>
      <span class="tooltiptext">导出为图片</span>
    </button>
    <button class="sharebutton tooltip" @click="shareLink">
      <svg t="1693620510278" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="16296" width="23" height="23">
        <path
          d="M477.934459 330.486594A50.844091 50.844091 0 0 1 406.752731 258.796425L512 152.532274a254.220457 254.220457 0 0 1 359.467726 359.467726L762.66137 618.772592a50.844091 50.844091 0 1 1-71.690168-71.690169l106.772591-106.772592a152.532274 152.532274 0 0 0-215.578947-215.578947z m70.164846 361.501489A50.844091 50.844091 0 1 1 619.789474 762.66137l-107.281033 107.281033A254.220457 254.220457 0 0 1 152.532274 512L259.813307 406.752731a50.844091 50.844091 0 1 1 72.19861 69.656405l-107.789474 107.281033a152.532274 152.532274 0 0 0 215.578947 215.578947z m-126.601788-16.77855a50.844091 50.844091 0 1 1-71.690168-71.690169l251.678252-251.678252a50.844091 50.844091 0 0 1 71.690169 71.690169z"
          p-id="16297"></path>
      </svg>
      <span class="tooltiptext">生成预览链接</span>
    </button>
    <button class="sharebutton tooltip" @click="closeShare">
      <svg t="1693620396396" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="13159" width="23" height="23">
        <path
          d="M227.911022 493.700575A51.187203 51.187203 0 1 1 298.549363 563.315171l-105.957511 106.981255a149.978505 149.978505 0 0 0 204.748813 218.057486l6.3984-6.142465 105.957511-105.95751a51.187203 51.187203 0 0 1 70.63834 70.63834l-105.95751 105.957511a249.793552 249.793552 0 0 1-353.191702-353.191703zM606.696326 141.788553a249.793552 249.793552 0 0 1 243.139215 435.091227l-130.783304 72.941765a51.187203 51.187203 0 0 1-48.627843-86.506374l130.783304-72.941764a149.722569 149.722569 0 0 0-137.949513-265.405649l-7.934016 4.094976-130.783304 72.941765a51.187203 51.187203 0 0 1-48.883779-87.274182z m-25.593602 281.529617a51.187203 51.187203 0 0 1 70.638341 70.638341l-211.915022 211.915021a51.187203 51.187203 0 0 1-70.63834-70.63834z m0 0M179.539115 18.427393l106.981255 215.498126-224.455886-102.886279L179.283179 18.427393h0.255936zM429.332667 0l-66.7993 181.458635-66.799301-181.458635h133.598601zM42.869283 371.107223l188.880779-63.984004-188.880779-64.23994v128.223944z"
          p-id="13160"></path>
      </svg>
      <span class="tooltiptext">取消预览</span>
    </button>
  </span>
  <div class="page-select">
    <PageSelect />
    <div id="gjs"></div>
  </div>
</template>
	
<script>
import grapesjs from 'grapesjs'; // 引入 GrapesJS
import zh from 'grapesjs/locale/zh.js'//引入中文
import en from 'grapesjs/locale/en.js'//引入英文
import 'grapesjs/dist/css/grapes.min.css'; // 引入样式
import 'grapesjs/dist/grapes.min.js';
import 'grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css';
import 'grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.js';
import Plugin from 'grapesjs-blocks-basic'; //basic-blocks
import BasicPlugin from 'grapesjs-preset-webpage'; //basic-blocks
import gjsForms from 'grapesjs-plugin-forms'; //form-blocks
import Navbar from 'grapesjs-navbar';
import Countdown from 'grapesjs-component-countdown'; //倒计时
import Tabs from 'grapesjs-tabs';
import Tooltip from 'grapesjs-tooltip';
import CodePlugin from 'grapesjs-custom-code';
import Type from 'grapesjs-typed';
// import PresetPlugin from 'grapesjs-preset-newsletter';
import ExportPlugin from 'grapesjs-plugin-export'; //导出html和css
import ScriptPlugin from 'grapesjs-script-editor'; //js代码编辑
import html2canvas from 'html2canvas';
import 'animate.css'
import PageSelect from './PageSelect.vue';

export default {
  name: 'GrapesEditor',
  components: {
    PageSelect
  },
  mounted() {
    this.pageId = this.$route.params.protoId
    this.$watch('$route.params', (newVal, oldVal) => {
      this.$http.get(`http://43.138.14.231/projects/${newVal.protoId}`).then((response) => {
        //保存一下size-setter
        let sizeSetter = document.querySelector('#size-setter')
        document.body.appendChild(sizeSetter)
        //清除之前的eventlistener
        document.body.removeEventListener('click', this.handleSelectChange)
        document.querySelector('iframe').contentWindow.document.body.removeEventListener('click', this.handleSelectChange)
        document.querySelector('iframe').contentWindow.document.removeEventListener('scroll', this.handleScroll)
        document.querySelector('iframe').contentWindow.document.removeEventListener('keydown', this.handleSelectChange)
        document.removeEventListener('scroll', this.handleScroll)
        // const newData = response.data.data
        this.pageId = newVal.protoId
        this.initEditor();
        this.addBlock();
        this.clearCanvas();
        this.editor.on('load', () => {
          console.log('加载完毕')
          let topPanel = document.querySelector('.gjs-pn-panel.gjs-pn-devices-c.gjs-one-bg.gjs-two-color .gjs-pn-buttons')
          topPanel.appendChild(sizeSetter)
          //添加新的的监听事件
          document.body.addEventListener('click', this.handleSelectChange)
          document.querySelector('iframe').contentWindow.document.body.addEventListener('click', this.handleSelectChange)
          document.querySelector('iframe').contentWindow.document.addEventListener('scroll', this.handleScroll)
          document.querySelector('iframe').contentWindow.document.addEventListener('keydown', this.handleSelectChange)
          document.addEventListener('scroll', this.handleScroll)
        })
      })
    })
    this.initEditor();
    this.addBlock();
    this.clearCanvas();
    this.editor.on('load', () => {
      console.log('加载完毕')
      let topPanel = document.querySelector('.gjs-pn-panel.gjs-pn-devices-c.gjs-one-bg.gjs-two-color .gjs-pn-buttons')
      let sizeSetter = document.querySelector('#size-setter')
      topPanel.appendChild(sizeSetter)
      //此处为监听iframe外部中gjs内部和外部事件
      // document.body.addEventListener('click', (e) => {
      //   if (document.getElementById('gjs').contains(e.target)) {
      //     console.log('重合')
      //   }
      //   else {
      //     console.log('不重合')
      //   }
      // }
      // )
      document.body.addEventListener('click', this.handleSelectChange)
      document.querySelector('iframe').contentWindow.document.body.addEventListener('click', this.handleSelectChange)
      document.querySelector('iframe').contentWindow.document.addEventListener('scroll', this.handleScroll)
      document.querySelector('iframe').contentWindow.document.addEventListener('keydown', this.handleSelectChange)
      document.addEventListener('scroll', this.handleScroll)

    })
    this.ws = new WebSocket(`ws://43.138.14.231:9000/ws/page/${this.pageId}/`)


    //必须在editor加载完之后才添加点击事件监听

    // window.removeEventListener()
    this.ws.onmessage = (message) => {
    	const data = JSON.parse(message.data).data
    	if (JSON.stringify(this.editor.getProjectData()) !== JSON.stringify(data)) {
    		this.editor.loadProjectData(data)
    	}
    }

    //设置默认大小
    // this.closeCategory();
  },
  data() {
    return {
      ws: '',
      pageId: null,
      pageName: 'page1',
      selectedIds: undefined,//当前用户选中的元素的id
      pagesNum: 1,
      canvasHeight: '1000',
      canvasWidth: '1000',
      autosave: true,
      Devices: [
        {
          selected: true,
          id: 'Desktop',
          // width: '1920px',
          // height: '1080px',
        },
        {
          selected: false,
          id: 'Tablet',
          width: '1024px',
          height: '768px',
        },
        {
          selected: false,
          id: 'Mobile portrait',
          width: '640px',
          height: '1200px'
        },
        {
          selected: false,
          id: 'Customization',
          width: '1000px',
          height: '1000px',
        },
      ],
      editor: undefined,
      currentDevice: undefined
    }
  },
  watch: {
    //监听画布大小改变,更新设备配置
    canvasHeight(value) {
      if (this.editor !== undefined) {
        if (value > 100000) {
          this.$bus.emit('message', {
            title: '画布尺寸设置警告',
            content: '设置尺寸超过最大高度',
            time: 3000
          })
          return
        }
        if (value <= 0) {
          this.$bus.emit('message', {
            title: '画布尺寸设置警告',
            content: '设置尺寸小于最小高度',
            time: 3000
          })
          return
        }
        if (this.editor !== undefined) {
          let oldName = this.editor.Devices.get('Customization') === null ? 'Customization1' : 'Customization'
          let newName = oldName === 'Customization1' ? 'Customization' : 'Customization1'
          let width = this.Devices[3].width//保持宽度不变
          this.editor.Devices.add({//添加一个设备
            id: newName,
            name: newName,
            height: value + 'px',
            width: width
          })
          // console.log(this.editor.Devices.get('Desktop').attributes.height)
          this.editor.Devices.select(newName)//选择该设备
          this.editor.Devices.remove(oldName)//把原来的设备删了
          this.Devices[3].id = newName//设置新id
          this.Devices[3].height = value + 'px'//设置新高度
          setTimeout(() => {
            this.editor.store()
          }, 100)
        }
      }
    },
    canvasWidth(value) {
      if (this.editor !== undefined) {
        if (value > 100000) {
          this.$bus.emit('message', {
            title: '画布尺寸设置警告',
            content: '设置尺寸超过最大宽度',
            time: 3000
          })
          return
        }
        if (value <= 0) {
          this.$bus.emit('message', {
            title: '画布尺寸设置警告',
            content: '设置尺寸小于最小宽度',
            time: 3000
          })
        }
        if (this.editor !== undefined) {
          let oldName = this.editor.Devices.get('Customization') === null ? 'Customization1' : 'Customization'
          let newName = oldName === 'Customization1' ? 'Customization' : 'Customization1'
          let height = this.Devices[3].height//保持高度不变
          this.editor.Devices.add({//添加一个设备
            id: newName,
            name: newName,
            height: height,
            width: value + 'px'
          })
          // console.log(this.editor.Devices.get('Desktop').attributes.height)
          this.editor.Devices.select(newName)//选择该设备
          this.editor.Devices.remove(oldName)//把原来的设备删了
          this.Devices[3].id = newName//设置新id
          this.Devices[3].width = value + 'px'//设置新宽度
          setTimeout(() => {
            this.editor.store()
          }, 100)
        }
      }
    }
  },
  methods: {
    initEditor() {
      this.editor = grapesjs.init({
        container: '#gjs',
        i18n: {
          locale: 'zh',
          localeFallback: 'en',
          messages: {
            zh: {
              assetManager: {
                addButton: '添加图片',
                inputPlh: 'http://path/to/the/image.jpg',
                modalTitle: '选择图片',
                uploadTitle: '点击或者拖拽图片上传'
              },
              blockManager: {
                labels: {
                  // 基础组件,
                  'column1': '单列分布',
                  'column2': '两列分布',
                  'column3': '三列分布',
                  'column3-7': '两列差异分布',
                  'text': '文本',
                  'link': '链接',
                  'image': '图片',
                  'video': '视频',
                  'map': '地图',
                  'quote': '引用',
                  'text-basic': '文本段落',
                  //进阶组件
                  'tabs': '水平分页栏',
                  'tooltip': '浮动提示框',
                  'custom-code': '代码',
                  'countdown': '倒计时',
                  'typed': '文字动画',
                  'navbar': '导航栏',
                  //表单组件
                  'form': '基本表单',
                  'input': '基本输入框',
                  'textarea': '文本段落输入框',
                  'select': '下拉菜单',
                  'button': '按钮',
                  'label': '标签',
                  'checkbox': '多选框',
                  'radio': '单选框'
                },
                categories: {
                  // 'category-id': 'Category Label',
                }
              },
              domComponents: {
                names: {
                  '': 'Box',
                  wrapper: 'Body',
                  text: '文字',
                  comment: '评论',
                  image: '图片',
                  video: '视频',
                  label: '文本',
                  link: '超链接',
                  map: '地图',
                  tfoot: '表格末尾',
                  tbody: '表格主体',
                  thead: '表头',
                  table: '表格',
                  row: '行',
                  cell: '单元格'
                }
              },
              deviceManager: {
                device: '设备',
                devices: {
                  desktop: '桌面',
                  tablet: '平板',
                  mobilePortrait: '手机'
                }
              },
              panels: {
                buttons: {
                  titles: {
                    preview: '预览',
                    fullscreen: '全屏',
                    'sw-visibility': '查看组件',
                    'export-template': '查看代码',
                    'open-sm': '打开样式管理器',
                    'open-tm': '设置',
                    'open-layers': '打开布局管理器',
                    'open-blocks': '打开块选择器'
                  },
                }
              },
              selectorManager: {
                label: 'CSS类',
                selected: '选中元素',
                emptyState: '- 状态 -',
                states: {
                  hover: 'Hover',
                  active: 'Click',
                  'nth-of-type(2n)': 'Even/Odd'
                }
              },
              styleManager: {
                empty: '设置样式前请选择一个元素',
                layer: '层级',
                fileButton: '图片',
                sectors: {
                  general: '常规',
                  layout: '布局',
                  typography: '版式',
                  decorations: '装饰',
                  extra: '扩展',
                  flex: '盒子模型',
                  dimension: '尺寸',

                },
                // The core library generates the name by their `property` name
                properties: {
                }
              },
              traitManager: {
                empty: '用设置项前选择一个组件',
                label: '组件设置',
                traits: {
                  // In a simple trait, like text input, these are used on input attributes
                  attributes: {
                    id: {
                      placeholder: '例子. 输入文字'
                    },
                    alt: {
                      placeholder: '例子. 输入文字'
                    },
                    title: {
                      placeholder: '例子. 输入文字'
                    },
                    href: {
                      placeholder: 'eg. https://google.com'
                    }
                  },
                  // In a trait like select, these are used to translate option names
                  options: {
                    target: {
                      false: '本窗口',
                      _blank: '新窗口'
                    }
                  }
                }
              }
            }
          }
        },
        height: 'calc(100vh - 70px)',
        showOffsets: 1,
        autosave: true,
        noticeOnUnload: 0,
        formElement: true,
        deviceManager: {
          devices: [
            {
              id: 'Desktop',
              name: 'Desktop',
              // width: '1920px',
              // height: '1080px',
            },
            {
              id: 'Tablet',
              name: 'Tablet',
              width: '1024px',
              height: '768px',
            },
            {
              id: 'Mobile portrait',
              name: 'Mobile portrait',
              width: '640px'
            },
            {
              id: 'Customization',
              name: 'Customization',
              width: this.canvasWidth + 'px',
              height: this.canvasHeight + 'px',
            }]
        },
        blockManager: {
          //添加模板
          blocks: [
            {
              id: 't1',
              label: '学术成果分享平台',
              category: '原型模板',
              media: `<img src = '/src/assets/zixunfabu.png' style="height:100%;width:100%">`,
              content: `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>学术成果分享平台</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <header>
        <div class="container">
            <div class="header-top">
                <div id="login-button">登录</div>
                <div id="register-button">注册</div>
            </div>
            <div class="header-content">
                <h1>学术成果分享平台</h1>
                <h2>Make Academia Visible</h2>
                <div class="search-box">
                    <input type="text" id="search-input" placeholder="搜索">
                    <button type="button" id="search-button">搜索</button>
                </div>
            </div>
        </div>
    </header>

    <nav>
        <div class="container">
            <ul class="tab-container">
                <li class="tab" data-tab="tab1">业界精英</li>
                <li class="tab" data-tab="tab2">学术论文</li>
                <li class="tab" data-tab="tab3">科技前沿</li>
                <li class="tab" data-tab="tab4">最新成果</li>
                <li class="tab" data-tab="tab5">新闻资讯</li>
            </ul>
        </div>
    </nav>

    <section class="image-section">
        <div class="container">
            <div class="image-grid">
                <div class="image">
                    <img src="/src/assets/template1-4.jpg" alt="Image 1">
                </div>
                <div class="image">
                    <img src="/src/assets/template1-3.jpg" alt="Image 2">
                </div>
                <div class="image">
                    <img src="/src/assets/template1-2.jpg" alt="Image 3">
                </div>
                <div class="image">
                    <img src="/src/assets/template1-5.jpg" alt="Image 4">
                </div>
                <div class="image">
                    <img src="/src/assets/template1-1.jpg" alt="Image 5">
                </div>
            </div>
        </div>
    </section>

    <section class="tab-content" id="tab1-content"></section>
    <section class="tab-content" id="tab2-content"></section>
    <section class="tab-content" id="tab3-content"></section>
    <section class="tab-content" id="tab4-content"></section>
    <section class="tab-content" id="tab5-content"></section>

    <footer>
        <div class="container">
            <p>&copy; 2023 学术成果分享平台</p>
        </div>
    </footer>
</body>
<style>
    /* 重置全局样式 */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        transition: all 0.5s;
    }

    /* 响应式断点 */
    @media screen and (max-width: 768px) {
        /* 在这里添加响应式样式 */
    }

    body {
        font-family: 'Arial', sans-serif;
        background-color: #c2cedc;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    /* 头部样式 */
    header {
        background-color: #686789;
        color: #ffffff;
        padding: 20px 0;
    }

    .header-top {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }

    #login-button,
    #register-button {
        margin-top: 8px;
        margin-right: 20px;
        padding: 10px;
        cursor: pointer;
        color: #ffffff;
    }

    #login-button:hover,
    #register-button:hover {
        background-color: #555;
    }

    .header-content {
        text-align: center;
    }

    #platform-title {
        font-size: 30px;
        margin-bottom: 10px;
    }

    #platform-subtitle {
        margin-bottom: 20px;
    }

    /* 搜索框样式 */
    .search-box {
        display: flex;
        justify-content: center;
    }

    #search-input {
        margin-left: 10px;
        margin-right: 10px;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        min-width: 200px;
    }

    #search-button {
        margin-left: 10px;
        margin-right: 10px;
        padding: 10px 15px;
        background-color: #555;
        border: none;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
    }

    #search-button:hover {
        background-color: #444;
    }

    /* 导航样式 */
    nav {
        background-color: #333;
    }

    .tab-container {
        display: flex;
        justify-content: space-around;
        padding: 10px 0;
    }

    .tab {
        cursor: pointer;
        padding: 10px 20px;
        border: 2px solid #ccc;
        border-radius: 5px;
        background-color: #444;
        color: #fff;
    }

    .tab:hover {
        background-color: #333;
    }

    /* 图片部分样式 */
    .image-section {
        margin-top: 30px;
    }

    .image-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }

    .image {
        flex: 1;
    }

    .image img {
        max-width: 100%;
        display: block;
        margin: 0 auto;
    }

    /* 页脚样式 */
    footer {
        background-color: #333;
        color: #fff;
        text-align: center;
        padding: 10px 0;
    }
</style>

</html>`
            },
            {
              id: 't2',
              label: '后台用户管理界面',
              category: '原型模板',
              media: `<img src = '/src/assets/Channel.png' style="height:100%;width:100%">`,
              content: `
          <body>
    <header>
        <div class="logo">后台用户管理界面</div>
        <nav>
            <ul>
                <li><a href="#">仪表板</a></li>
                <li><a href="#">用户管理</a></li>
                <li><a href="#">设置</a></li>
                <li><a href="#">注销</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <h1>用户管理</h1>
        <table>
            <thead>
                <tr>
                    <th>用户名</th>
                    <th>邮箱</th>
                    <th>电话</th>
                    <th>城市</th>
                    <th>注册日期</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>John Doe</td>
                    <td>john@example.com</td>
                    <td>1234567890</td>
                    <td>北京</td>
                    <td>2023-09-01</td>
                    <td>
                        <button class="edit">编辑</button>
                        <button class="delete">删除</button>
                        <button class="view">查看</button>
                    </td>
                </tr>
                <tr>
                    <td>Jane Smith</td>
                    <td>jane@example.com</td>
                    <td>0987654321</td>
                    <td>上海</td>
                    <td>2023-08-28</td>
                    <td>
                        <button class="edit">编辑</button>
                        <button class="delete">删除</button>
                        <button class="view">查看</button>
                    </td>
                </tr>
                <tr>
                    <td>Lucas Green</td>
                    <td>lucas@example.com</td>
                    <td>1112223334</td>
                    <td>广州</td>
                    <td>2023-08-20</td>
                    <td>
                        <button class="edit">编辑</button>
                        <button class="delete">删除</button>
                        <button class="view">查看</button>
                    </td>
                </tr>
                <tr>
                    <td>Mary Johnson</td>
                    <td>mary@example.com</td>
                    <td>5556667778</td>
                    <td>深圳</td>
                    <td>2023-07-15</td>
                    <td>
                        <button class="edit">编辑</button>
                        <button class="delete">删除</button>
                        <button class="view">查看</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </main>
    <style>
    body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #fff;
}


header {
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.logo {
    font-size: 24px;
    font-weight: bold;
}

nav ul {
    list-style-type: none;
    display: flex;
}

nav ul li {
    margin-right: 20px;
}

nav ul li a {
    text-decoration: none;
    color: #fff;
    padding: 8px 16px;
    border-radius: 4px;
    transition: background-color 0.3s;
}

nav ul li a:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

main {
    max-width: 1100px;
    margin: 40px auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
    border-bottom: 2px solid black;
    padding-bottom: 10px;
    margin-bottom: 20px;
    font-size: 24px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

table, th, td {
    border: 1px solid black;
}

th, td {
    padding: 10px;
    text-align: left;
}

button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
}

.edit {
    background-color: #3498db;
    color: #fff;
    transition: background-color 0.3s;
    display: inline-block;
}

.edit:hover {
    background-color: #2980b9;
    display: inline-block;
}

.delete {
    background-color: #e74c3c;
    color: #fff;
    transition: background-color 0.3s;
    display: inline-block;
}

.delete:hover {
    background-color: #c0392b;
    display: inline-block;
}

.view {
    background-color: #2ecc71;
    color: #fff;
    transition: background-color 0.3s;
    display: inline-block;
}

.view:hover {
    background-color: #27ae60;
    display: inline-block;
}
    </style>
          `
            },
            {
              id: 't3',
              label: '个人博客',
              category: '原型模板',
              media: `<img src = '/src/assets/Kinguser.png' style="height:100%;width:100%">`,
              content: `
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="blog-styles.css">
            <title>我的博客</title>
          </head>

          <body>
            <header>
              <div class="logo">我的个人博客</div>
              <nav>
                <ul>
                  <li><a href="#">首页</a></li>
                  <li><a href="#">关于我</a></li>
                  <li><a href="#">博客文章</a></li>
                  <li><a href="#">联系</a></li>
                </ul>
              </nav>
            </header>

            <main>
              <section class="intro">
                <img src="/src/assets/template2.png" alt="个人照片">
                <p>欢迎来到我的博客! 请随便看看吧！</p>
              </section>
              <section class="posts">
                <article>
                  <h2>博客标题1</h2>
                  <p>这里是博客摘要。点击阅读更多...</p>
                  <footer>
                    <span>发布于 2023-09-01</span>
                    <a href="#">阅读更多</a>
                  </footer>
                </article>
                <article>
                  <h2>博客标题2</h2>
                  <p>这里是博客摘要。点击阅读更多...</p>
                  <footer>
                    <span>发布于 2023-08-25</span>
                    <a href="#">阅读更多</a>
                  </footer>
                </article>
                <!-- 更多博客文章... -->
              </section>
            </main>
            <footer>
            </footer>
          </body>

          <style>
          a {
            color: #fff;
            margin-left: 10px;
          }
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #fffed7;
            color: #333;
          }
          header {
            background-color: #e5e2b9;
            color: #fff;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
          }
          nav ul {
            list-style-type: none;
            display: flex;
            gap: 20px;
          }
          nav ul li a {
            text-decoration: none;
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            transition: background-color 0.3s;
          }
          nav ul li a:hover {
            background-color: #3a4750;
          }
          main {
            max-width: 900px;
            margin: 40px auto;
            padding: 20px;
          }
          .intro {
            display: flex;
            gap: 20px;
            align-items: center;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .intro img {
            max-width: 150px;
            border-radius: 50%;
          }
          .posts article {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
          }
          h2 {
            color: #1b262c;
            margin-top: 0;
          }
          footer {
            background-color: #e5e2b9;
            color: #fff;
            text-align: center;
            padding: 20px 0;
            margin-top: 40px;
          }
          </style>
        `
            },
            {
              id: 't4',
              label: '计划清单',
              category: '原型模板',
              media: `<img src = '/src/assets/Zhishifabu.png' style="height:100%;width:100%">`,
              content: `
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="styles.css">
            <title>计划清单</title>
        </head>

        <body>
            <header>
                <h1>我的计划清单</h1>
            </header>

            <main>
                <section class="todo-section">
                    <div id="todo-inputs">
                        <input type="text" id="new-todo" placeholder="新任务...">
                        <textarea id="description" placeholder="任务描述..."></textarea>
                        <input type="date" id="due-date">
                        <button id="add-button">添加</button>
                    </div>

                    <ul id="todo-list">
                        <li>
                            <input type="checkbox">
                            <div>
                                <strong>学习CSS</strong>
                                <p>学习关于Flexbox和Grid的基本知识。</p>
                                <small>到期日: 2023-09-15</small>
                            </div>
                        </li>
                        <li>
                            <input type="checkbox">
                            <div>
                                <strong>完成项目报告</strong>
                                <p>为下周的会议完成关于项目进展的报告。</p>
                                <small>到期日: 2023-09-10</small>
                            </div>
                        </li>
                    </ul>
                </section>
            </main>
        </body>
        <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
            color: #333;
        }

        header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 20px 0;
            text-align: center;
        }

        main {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .todo-section {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        #todo-inputs {
            width: 80%;
        }

        #new-todo, #description, #due-date {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        #description {
            height: 80px;
            resize: vertical;
        }

        #add-button {
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #4CAF50;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        #add-button:hover {
            background-color: #45a049;
        }

        #todo-list {
            list-style-type: none;
            width: 80%;
            margin-top: 20px;
            padding: 0;
        }

        #todo-list li {
            display: flex;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #eee;
        }

        #todo-list li:last-child {
            border-bottom: none;
        }

        strong {
            font-size: 18px;
        }

        small {
            display: block;
            margin-top: 10px;
            color: #777;
        }

        footer {
            background-color: #4CAF50;
            color: #ffffff;
            text-align: center;
            padding: 20px 0;
            margin-top: 40px;
            position: absolute;
            bottom: 0;
            width: 100%;
        }

        </style>
          `
            },
            {
              id: 't5',
              label: '线上商城',
              category: '原型模板',
              media: `<img src = '/src/assets/zixun-zhuanti.png' style="height:100%;width:100%">`,
              content: `
        <body>
            <header>
                <div class="logo">MyShop</div>
                <nav>
                    <ul>
                        <li><a href="#">首页</a></li>
                        <li><a href="#">商品分类</a></li>
                        <li><a href="#">热销商品</a></li>
                        <li><a href="#">关于我们</a></li>
                        <li><a href="#">联系方式</a></li>
                    </ul>
                </nav>
                <div class="cart">
                    <a href="#"><svg t="1693569366497" class="icon" viewBox="0 0 1028 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2624" width="32" height="32"><path d="M332.8 790.528q19.456 0 36.864 7.168t30.208 19.968 20.48 30.208 7.68 36.864-7.68 36.864-20.48 30.208-30.208 20.48-36.864 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-36.864 7.68-36.864 20.48-30.208 30.208-19.968 37.888-7.168zM758.784 792.576q19.456 0 37.376 7.168t30.72 19.968 20.48 30.208 7.68 36.864-7.68 36.864-20.48 30.208-30.72 20.48-37.376 7.68-36.864-7.68-30.208-20.48-20.48-30.208-7.68-36.864 7.68-36.864 20.48-30.208 30.208-19.968 36.864-7.168zM930.816 210.944q28.672 0 44.544 7.68t22.528 18.944 6.144 24.064-3.584 22.016-13.312 37.888-22.016 62.976-23.552 68.096-18.944 53.248q-13.312 40.96-33.28 56.832t-49.664 15.872l-35.84 0-65.536 0-86.016 0-96.256 0-253.952 0 14.336 92.16 517.12 0q49.152 0 49.152 41.984 0 20.48-9.728 35.84t-38.4 14.336l-49.152 0-94.208 0-118.784 0-119.808 0-99.328 0-55.296 0q-20.48 0-34.304-9.216t-23.04-24.064-14.848-32.256-8.704-32.768q-1.024-6.144-5.632-29.696t-11.264-58.88-14.848-78.848-16.384-87.552q-19.456-103.424-44.032-230.4l-76.8 0q-15.36 0-25.6-7.68t-16.896-18.432-9.216-23.04-2.56-22.528q0-20.48 13.824-33.792t37.376-12.288l103.424 0q20.48 0 32.768 6.144t19.456 15.36 10.24 18.944 5.12 16.896q2.048 8.192 4.096 23.04t4.096 30.208q3.072 18.432 6.144 38.912l700.416 0zM892.928 302.08l-641.024-2.048 35.84 185.344 535.552 1.024z" p-id="2625" fill="#ffffff"></path></svg></a>
                </div>
            </header>

            <main>
                <section class="product-section">
                    <!-- Sample products. You can add more similar structures -->
                    <article class="product">
                        <img src="/src/assets/shopping1.png" alt="商品1">
                        <h3>商品1</h3>
                        <p>简洁的商品描述1</p>
                        <span class="price">$19.99</span>
                        <button class="add-to-cart">添加到购物车</button>
                    </article>

                    <article class="product">
                        <img src="/src/assets/shopping2.png" alt="商品2">
                        <h3>商品2</h3>
                        <p>美观的商品描述2</p>
                        <span class="price">$24.99</span>
                        <button class="add-to-cart">添加到购物车</button>
                    </article>

                    <article class="product">
                        <img src="/src/assets/shopping3.png" alt="商品3">
                        <h3>商品3</h3>
                        <p>优雅的商品描述3</p>
                        <span class="price">$29.99</span>
                        <button class="add-to-cart">添加到购物车</button>
                    </article>

                    <article class="product">
                        <img src="/src/assets/shopping4.png" alt="商品4">
                        <h3>商品4</h3>
                        <p>古典的商品描述4</p>
                        <span class="price">$14.99</span>
                        <button class="add-to-cart">添加到购物车</button>
                    </article>

                    <article class="product">
                        <img src="/src/assets/shopping5.png" alt="商品5">
                        <h3>商品5</h3>
                        <p>动感的商品描述5</p>
                        <span class="price">$34.99</span>
                        <button class="add-to-cart">添加到购物车</button>
                    </article>

                    <article class="product">
                        <img src="/src/assets/shopping6.png" alt="商品6">
                        <h3>商品6</h3>
                        <p>流畅的商品描述6</p>
                        <span class="price">$44.99</span>
                        <button class="add-to-cart">添加到购物车</button>
                    </article>
                </section>
            </main>
        </body>
        <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f2f5;
            color: #333;
        }

        header {
            background-color: #b57c82;
            color: #ecf0f1;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 28px;
            font-weight: bold;
        }

        nav ul {
            list-style-type: none;
            display: flex;
        }

        nav ul li {
            margin-right: 25px;
        }

        nav ul li a {
            text-decoration: none;
            color: #ecf0f1;
            transition: color 0.3s ease;
        }

        nav ul li a:hover {
            color: #bdc3c7;
        }

        .cart img {
            width: 32px;
            height: 32px;
            cursor: pointer;
        }

        main {
            max-width: 1200px;

            padding: 20px;
        }

        .product-section {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
        }

        .product {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.3s ease;
        }

        .product:hover {
            transform: translateY(-10px);
        }

        .product img {
            max-width: 250px;
            height: auto;
            border-radius: 8px;
            margin-bottom: 15px;
        }

        .product h3 {
            font-size: 20px;
            margin-top: 0;
            color: #2c3e50;
        }

        .product p {
            color: #7f8c8d;
            margin-bottom: 15px;
        }

        .price {
            font-size: 20px;
            color: #724e52;
            display: block;
            margin-bottom: 15px;
        }

        .add-to-cart {
            padding: 10px 20px;
            background-color: #ecced0;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .add-to-cart:hover {
            background-color: #2980b9;
        }

        footer {
            background-color: #34495e;
            color: #ecf0f1;
            text-align: center;
            padding: 20px 0;
            margin-top: 60px;
        }

        </style>
        `
            }
          ]
        },
        assetManager: [],//预加载资产，图片/图标等
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
        pluginsOpts: {
          [Plugin]: {
            category: '基础组件'
          },
          [BasicPlugin]: {
            blocks: ['quote', 'text-basic'],
            block: () => ({ category: '基础组件' })
          },
          [Navbar]: {
            block: { category: '进阶组件' }
          },
          [Countdown]: {
            block: { category: '进阶组件' }
          },
          [Tooltip]: {
            blockTooltip: { category: '进阶组件' }
          },
          [CodePlugin]: {
            blockCustomCode: {
              category: '进阶组件'
            },
            modalTitle: '插入代码',
            buttonLabel: '保存'
          },
          [ExportPlugin]: {
            addExportBtn: true,
            btnLabel: '导出项目文件ZIP',
            fileName: this.fileName,
            root: {
              css: {
                'style.css': ed => ed.getCss(),
              },
              'index.html': ed => `<body>${ed.getHtml()}</body>`,
              'index.js': ed => ed.getJs()
            }
          },
          [ScriptPlugin]: {
            starter: `//对该元素节点进行代码编辑
						let el = this`,
            buttonLabel: '保存',

          },
          [Type]: {
            block: {
              category: '进阶组件'
            }
          },
          [Tabs]: {
            tabsBlock: {
              category: '进阶组件'
            }
          },
          [gjsForms]: {
            category: '表单组件'
          }
        },
        styleManager: [],
        storageManager: {
          type: 'remote',
          stepsBeforeSave: 1,
          autosave: true,
          autoload: true,
          options: {
            remote: {
              urlLoad: `http://43.138.14.231/projects/${this.pageId}/`,
              urlStore: `http://43.138.14.231/projects/${this.pageId}/`,
              // urlLoad: `http://localhost:3000/projects/${this.pageId}`,
              // urlStore: `http://localhost:3000/projects/${this.pageId}`,
              fetchOptions: opts => (opts.method === 'POST' ? { method: 'PATCH' } : {}),
              // urlLoad: `http://localhost:3000/projects/1`,
              // urlStore: `http://localhost:3000/projects/1`,
              // The `remote` storage uses the POST method when stores data but
              // the json-server API requires PATCH.

              onStore: data => {
                console.log('store')
                this.updateCursorPlace(this.selectedId)//自动保存时更新id
                if (data.pages.length == 0) {
                  data.pages.push({})
                }
                this.ws.send(JSON.stringify(data))
                return {
                  id: this.pageId,
                  data,
                  // //存储画布宽高
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
                return result.data
              }
            }
          }
        },
      })
    },
    addBlock() {
      if (this.editor !== undefined) {
        this.editor.BlockManager.add('Block', {
          id: 'block',
          label: '基本块',
          category: '基础组件',
          media: '<svg t="1693317219863" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1506" width="100%" height="100%"><path d="M960 392.078222a98.602667 98.602667 0 0 1-98.588444 98.588445H148.366222A98.602667 98.602667 0 0 1 49.777778 392.078222V148.366222A98.602667 98.602667 0 0 1 148.366222 49.777778h713.059556a98.602667 98.602667 0 0 1 98.588444 98.588444v243.712z m-56.888889-243.712A41.699556 41.699556 0 0 0 861.411556 106.666667H148.366222A41.699556 41.699556 0 0 0 106.666667 148.366222v243.726222a41.699556 41.699556 0 0 0 41.699555 41.699556h713.059556a41.699556 41.699556 0 0 0 41.699555-41.699556V148.366222z" fill="#c71d23" p-id="1507"></path><path d="M163.555556 277.333333a14.222222 14.222222 0 0 1-14.222223-14.222222v-25.628444c0-36.352 17.720889-73.927111 56.32-73.927111h94.776889a14.222222 14.222222 0 1 1 0 28.444444H205.653333c-20.792889 0-27.875556 23.125333-27.875555 45.482667V263.111111a14.222222 14.222222 0 0 1-14.222222 14.222222zM152.092444 326.115556c-3.697778 0-7.409778-1.564444-10.097777-4.124445-2.702222-2.688-4.124444-6.4-4.124445-10.097778s1.422222-7.395556 4.124445-10.097777c5.404444-5.404444 14.791111-5.262222 20.053333 0 2.688 2.702222 4.266667 6.4 4.266667 10.097777s-1.564444 7.409778-4.124445 9.955556c-2.844444 2.688-6.4 4.266667-10.097778 4.266667zM661.333333 875.633778a98.602667 98.602667 0 0 1-98.588444 98.588444H148.366222A98.602667 98.602667 0 0 1 49.777778 875.633778V631.921778a98.602667 98.602667 0 0 1 98.588444-98.588445h414.392889a98.602667 98.602667 0 0 1 98.588445 98.588445v243.712z m-56.888889-243.712a41.699556 41.699556 0 0 0-41.699555-41.699556H148.366222A41.699556 41.699556 0 0 0 106.666667 631.921778v243.726222a41.699556 41.699556 0 0 0 41.699555 41.699556h414.392889a41.699556 41.699556 0 0 0 41.699556-41.699556V631.921778z" fill="#c71d23" p-id="1508"></path><path d="M974.222222 875.633778a98.602667 98.602667 0 0 1-98.588444 98.588444h-73.059556a98.602667 98.602667 0 0 1-98.588444-98.588444V631.921778a98.602667 98.602667 0 0 1 98.588444-98.588445h73.059556a98.602667 98.602667 0 0 1 98.588444 98.588445v243.712z m-56.888889-243.712a41.699556 41.699556 0 0 0-41.699555-41.699556h-73.059556a41.699556 41.699556 0 0 0-41.699555 41.699556v243.726222a41.699556 41.699556 0 0 0 41.699555 41.699556h73.059556a41.699556 41.699556 0 0 0 41.699555-41.699556V631.921778z" fill="#c71d23" p-id="1509"></path></svg>',
          attributes: {
            class: 'gjs-fonts gjs-f-b1', title: '基本块'
          },
          content: `<div style="text-align:center"><span>Hello World</span></div>`
        })
      }
    },
    exportAsImage() {
      let node = document.createElement('div')
      node.style.position = 'fixed'
      node.style.zIndex = -1
      node.style.top = '-100000px'
      node.style.left = '0px'
      node.classList.add("export-image")
      node.style.width = document.querySelector('.gjs-frame').contentDocument.documentElement.scrollWidth + 'px'
      node.style.height = document.querySelector('.gjs-frame').contentDocument.documentElement.scrollHeight + 'px'
      node.innerHTML =
        `${this.editor.getHtml()}
            <style>
            /* 清除reset.css的影响 */
              /* 恢复默认字体大小和滚动行为 */
* {
    font-size: inherit;
    scroll-behavior: auto;
}

/* 恢复常见标签的内外边距 */
body,
h1, h2, h3, h4, h5, h6,
hr,
p, pre,
blockquote,
dl, dt, dd, ul, ol, li,
form, fieldset, legend, input, button, textarea,
th, td {
    margin: inherit;
    padding: inherit;
}

/* 恢复列表符号 */
ul, ol {
    list-style: inherit;
}

/* 恢复图片的默认显示方式和边框 */
img {
    display: inline; /* 或根据需要设置其他值 */
    border: inherit;
}

/* 恢复强调性文字的默认字体重量和样式 */
b, strong {
    font-weight: bolder;
}

i, em {
    font-style: italic;
}

/* 恢复标题的默认字体大小和字重 */
h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-weight: bold;
}

/* 恢复删除线和下划线 */
u, s, ins, del {
    text-decoration: inherit;
}

/* 恢复表格的默认边框样式 */
table {
    border: inherit;
    border-spacing: inherit;
    border-collapse: inherit;
}

/* 恢复单元格的默认边框样式 */
th, td {
    border: inherit;
}

/* 恢复输入元素和按钮的默认轮廓和边框 */
input, button {
    outline: inherit;
    border: inherit;
}

/* 恢复超链接的默认文本装饰和颜色 */
a {
    text-decoration: inherit;
    color: inherit;
}

/* 清除浮动 */
.leftfix, .rightfix, .clearfix::after {
    float: none;
    clear: none;
}

/* 恢复SVG的默认显示方式 */
svg {
    display: inline; /* 或根据需要设置其他值 */
}

/* 恢复文本区域的默认调整大小方式 */
textarea {
    resize: auto;
}

          ${this.editor.getCss().replace(/body/g, '.export-image')} 
            </style>
        `
      document.body.appendChild(node)
      html2canvas(node).then(canvas => {
        document.body.removeChild(node)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.download = `${this.pageName}.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
        link.remove()
      })

    },
    shareLink() {
      this.$http.get(`/api/projects/${this.pageId}/generate_invite_url/page/`).then((response) => {
        // navigator.clipboard.writeText(response.data.url)
        this.$bus.emit('message', {
          title: '复制链接，即刻预览',
          content: response.data.url,
          time: 5000
        })
      })
    },
    closeShare() {
      this.$bus.emit('closeShareRequest', this.pageId)
      this.$bus.emit('message', {
        title: '分享链接已失效',
        content: '',
        time: 3000
      })
    },
    switchDevice(deviceIndex) {
      this.Devices.forEach((device) => {
        device.selected = false
      })
      this.Devices[deviceIndex].selected = true
      this.editor.Devices.select(this.Devices[deviceIndex].id)
    },
    clearCanvas() {
      this.editor.Commands.add('canvas-clear', {
        run: function (editor) {
          editor.DomComponents.clear();
          editor.CssComposer.clear();
          document.querySelector('#gjs .gjs-editor.gjs-one-bg.gjs-two-color .gjs-pn-panels').lastChild.click()
        }
      })

    },
    //操作分为change(当前节点位置宽高等改变、当前点击的元素改变)和remove(选中的节点被删除了，用户点击了gjs以外的位置)
    //1需要监听iframe外部，gjs内部事件并响应，id删除
    //2需要监听iframe内部元素，id不变、改变或删除
    //3需要监听gjs外部元素，id删除
    //store时id可能不变、改变或删除 改变情况由click负责，不变或删除直接由onload后判断对应元素是否存在即可
    //不监听键盘事件
    //需要传递第二个参数：id是否改变/id删除？
    handleSelectChange(e, command = 'change') {
      if (document.getElementById('gjs').contains(e.target)) {
        console.log('位于gjs内')//
        this.selectedId = undefined//太麻烦了，还是非选中吧
      }
      else if (document.body.contains(e.target)) {
        console.log('位于gjs外')
        this.selectedId = undefined//点击外部一定为非选中状态
      }
      else {
        this.selectedId = e.target.id//只有这时候刷新？
      }
      this.updateCursorPlace(this.selectedId)
    },
    //元素滚动，此时只需要刷新位置
    handleScroll(e) {
      this.updateCursorPlace(this.selectedId)
    },
    updateCursorPlace(id) {
      //刷新光标位置
      // 首先将前面的悬浮框和框框清除
      document.querySelector('.selection-tooltip-container')?.remove()
      document.querySelector('.selection-tooltip-text')?.remove()
      document.querySelector('.selection-wrapper')?.remove()
      if (id === undefined || id === '') {//这时什么都不做？
        return
      }
      else {
        // 这里可以处理用户在 iframe 内点击内容的逻辑
        console.log('用户点击了 iframe 内的内容');
        const element = document.querySelector('iframe').contentWindow.document.body.querySelector(`#${id}`)
        if (element) {
          // 创建悬浮框容器
          const tooltipContainer = document.createElement('div');
          tooltipContainer.className = `selection-tooltip-container`;//TODO:类名要改为独一无二
          tooltipContainer.style.pointerEvents = 'none'//设置不能被选中

          tooltipContainer.style.backgroundColor = 'rgb(199, 29, 35)';
          tooltipContainer.style.color = 'white';

          // 设置悬浮框内容
          const tooltipText = document.createElement('div');
          tooltipText.className = `selection-tooltip-text`;//TODO:类名要改为独一无二
          tooltipText.textContent = '这是一个tooltip';

          // 将悬浮框内容添加到容器
          tooltipContainer.appendChild(tooltipText);

          // 将悬浮框容器添加到 body 的直接子元素
          document.body.appendChild(tooltipContainer);

          // 定位悬浮框，底部与元素顶部对齐，左边界与元素左边界对齐
          //这块可能要改改,加上iframe的高度差
          const elementRect = {
            left: element.getBoundingClientRect().left + document.querySelector('iframe').getBoundingClientRect().left,
            top: element.getBoundingClientRect().top + document.querySelector('iframe').getBoundingClientRect().top,
            width: element.getBoundingClientRect().width,
            height: element.getBoundingClientRect().height
          }
          //这里因为直接绑在body上面，所以不需要
          const tooltipRect = tooltipContainer.getBoundingClientRect();

          tooltipContainer.style.position = 'absolute';
          tooltipContainer.style.left = elementRect.left + 'px';
          tooltipContainer.style.zIndex = 1;
          tooltipContainer.style.top = elementRect.top - tooltipRect.height + 'px';

          //接下来再设置一个方框
          // 创建一个包裹元素的容器 这里为了方便直接设为borderbox
          const wrapperDiv = document.createElement('div');
          wrapperDiv.className = `selection-wrapper`;//TODO:类名要改为独一无二
          wrapperDiv.style.boxSizing = 'border-box'
          wrapperDiv.style.pointerEvents = 'none'//穿透元素
          // 获取被包裹元素的位置和大小

          // 设置包裹容器的样式，使其刚好包裹住指定元素
          wrapperDiv.style.position = 'absolute';
          wrapperDiv.style.zIndex = 1;
          wrapperDiv.style.left = elementRect.left + 'px';
          wrapperDiv.style.top = elementRect.top + 'px';
          wrapperDiv.style.width = elementRect.width + 'px';
          wrapperDiv.style.height = elementRect.height + 'px';

          // 添加包裹容器到 body
          document.body.appendChild(wrapperDiv);

          // 为包裹容器设置边框样式,颜色和tooltip保持一致
          wrapperDiv.style.border = `5px solid rgb(199,29,35)`;
        }
      }
    },
  },
  beforeUnmount() {
    document.body.removeEventListener('click', this.handleSelectChange)
    document.querySelector('iframe').contentWindow.document.body.removeEventListener('click', this.handleSelectChange)
    document.querySelector('iframe').contentWindow.document.removeEventListener('scroll', this.handleScroll)
    document.querySelector('iframe').contentWindow.document.removeEventListener('keydown', this.handleSelectChange)
    document.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped>
#gjs * {
  font-family: sans-serif !important;
}

#gjs {
  margin: 0 auto;
  display: inline-block;
  position: relative;
  /* --frame-height: 1080px;
	 --frame-width: 1920px; */
}

:deep(.gjs-editor) {
  font-family: sans-serif;
}

:deep(.gjs-sm-header) {
  font-weight: 400;
}

:deep(.trt-header) {
  padding: 10px;
}

:deep(.gjs-one-bg) {
  background-color: white;
}

:deep(.gjs-two-color) {
  color: rgba(199, 29, 35, 1);
}

:deep(.gjs-four-color-h:hover) {
  color: #ddd;
}

:deep(.gjs-four-color) {
  color: darkred;
}

/* 被选中边框颜色，未改成功 */
:deep(.gjs-selected) {
  outline-color: #c71d23;
  outline-style: solid;
  outline-offset: -2px;
}

:deep(.gjs-pn-views-container) {
  width: 20%;
}

:deep(.gjs-pn-options) {
  right: 20%;
}

:deep(.gjs-pn-views) {
  width: 20%;
}

:deep(.gjs-three-bg) {
  background-color: #c71d23;
  color: #eee;
}

:deep(.gjs-pn-commands) {
  display: none;
}

:deep(.gjs-cv-canvas) {
  /* overflow: auto; */
  box-sizing: border-box;
  width: 80%;
  height: calc(100% - 40px);
  bottom: 0;
  z-index: 1;
  position: absolute;
  left: 0;
  top: 40px;
}

:deep(.gjs-pn-devices-c .gjs-pn-btn) {
  display: none;
}

/* :deep(.gjs-pn-devices-c .gjs-pn-btn:nth-child(3)) {
	display: none;
}
:deep(.gjs-pn-devices-c .gjs-pn-btn:nth-child(2)) {
	display: none;
} */
:deep(.gjs-pn-btn) {
  transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 0.5s;
}


:deep(.gjs-pn-btn:hover) {
  background: rgb(199, 29, 35);
  color: #ddd;
}

:deep(.cm-s-hopscotch.CodeMirror) {
  background-color: white;
  color: black;
}

:deep(.cm-s-hopscotch .CodeMirror-gutters) {
  background: #eee;
  border-right: 0px;
}

:deep(.gjs-cm-editor#gjs-cm-css #gjs-cm-title) {
  color: #804f7b;
}

:deep(.CodeMirror) {
  font-family: consolas;
  height: 300px;
  color: black;
  direction: ltr;
}

:deep(.gjs-block-label) {
  font-family: sans-serif;
  font-size: 110%;
  font-weight: 700;
  white-space: nowrap;
}

:deep(#gjs-clm-new) {
  color: rgb(199, 29, 35)
}

:deep(.gjs-editor-cont .sp-cancel, .gjs-editor-cont .sp-cancel:hover) {
  color: #c71d23 !important
}

:deep(.gjs-editor-cont .sp-container button, .gjs-editor-cont .sp-container button:hover, .gjs-editor-cont .sp-container button:active) {
  background: #c71d23;
  color: white
}

:deep(.gjs-layer-vis) {
  left: 0;
  top: 0;
  padding: 7px 10px 7px 10px;
  position: absolute;
  box-sizing: content-box;
  cursor: pointer;
  width: 20px;
  z-index: 1;
}

:deep(.gjs-layer-caret) {
  width: 20px;
  padding: 0px;
  cursor: pointer;
  position: absolute;
  box-sizing: content-box;
  left: -8px;
  top: 2px;
  opacity: .7;
  filter: alpha(opacity=70);
}

:deep(.gjs-layer-name) {
  padding: 6px 0 10px 0;
  display: inline-block;
  max-width: 170px;
  box-sizing: content-box;
  overflow: hidden;
  white-space: nowrap;
  margin: 0 30px 0 15px;
  vertical-align: top;
  height: 15px;
}

:deep(.gjs-select option, .gjs-field-select option, .gjs-clm-select option, .gjs-sm-select option, .gjs-fields option, .gjs-sm-unit option) {
  background: white;
  color: #c71d23;
  /* transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 0.5s; */
}

#size-setter {
  height: 30px;
  display: inline-block;
}

#size-setter svg {
  vertical-align: middle;
  margin-right: 10px;
  cursor: default;
  border-radius: 5px;
}

#size-setter input {
  vertical-align: middle;
  padding-left: 10px;
  width: 75px;
  border: #c71d23 2px solid;
  color: #c71d23;
  border-radius: 3px;
}

#size-setter span {
  display: inline-block;
  margin: 0 10px;
  font-weight: 700;
  font-family: consolas;
  vertical-align: top;
}

#size-setter button {
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin: 0 10px;
  vertical-align: bottom;
  color: #c71d23;
  border-radius: 5px;
  background: none;
}

#size-setter button svg {
  fill: #c71d23;
  transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 0.5s;
  cursor: pointer;
}

#size-setter button svg:hover {
  background: #c71d23;
  transform: scale(1.3);
  fill: white;
}

.selected-device svg {
  fill: white;
  background: #c71d23;
  box-shadow: #c71d23 0 0 3px;
}


.unselected-device svg:hover {
  fill: white;
  background: #c71d23;
  transform: scale(1.3);
}


.unselected-device svg {
  fill: #c71d23;
  transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 0.5s;

}

.sharebutton {
  margin-left: 20px;
}


/* Tooltip 容器 */
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip 文本 */
.tooltip .tooltiptext {
  font-weight: 300 !important;
  font-family: Microsoft Yahei;
  font-size: 10px;
  visibility: hidden;
  white-space: nowrap;
  background-color: white;
  border: 1px black solid;
  color: black;
  text-align: center;
  padding: 4px 8px;
  /* 定位 */
  position: absolute;
  z-index: 1;
  bottom: -30px;
  right: -50px
}

/* 鼠标移动上去后显示提示框 */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

:deep(.gjs-title) {
  font-weight: bold;
}
</style>  