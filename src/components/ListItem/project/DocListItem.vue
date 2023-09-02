<template>
  <!-- 这是展示的文档卡片 -->
  <div>
    <div class="doc-container" @contextmenu.prevent="handleClick" ref="container">
      <div class="doc-image">
        <svg t="1693141765365" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="2289" width="80" height="80">
          <path d="M543.68 288.64h320v64h-320zM320 512h384v64H320z" fill="rgba(199, 29, 35, 1)" p-id="2290"></path>
          <path d="M543.04 107.2h64v245.44h-64zM320 672h384v64H320z" fill="rgba(199, 29, 35, 1)
        " p-id="2291"></path>
          <path d="M608 128l192 192v576H224V128z m45.12-45.12L634.56 64H160v896h704V288" fill="rgba(199, 29, 35, 1)"
            p-id="2292"></path>
        </svg>
      </div>
      <div class="doc-info">
        <div class="doc-name" ref="name">
          {{ name }}({{ doc.isPublic ? '公开' : '私有' }})
        </div>
        <div class="input-hint" ref="hint">敲击回车以确定</div>
        <input type="text" v-model="rename" @keydown.enter="beforeSendRename" @blur="recoverName" ref="nameInput"/>
        <!-- <button @click.stop="sendChangeDocIdentityRequest">修改文档权限</button>&nbsp;
        <button @click.stop="shareDocLink">分享链接</button>&nbsp;
        <button @click.stop="sendDeleteDocRequest">删除</button>
        <br>
        <input type="text" v-model="rename">
        {{ rename }}
        <button @click.stop="sendRenameDocRequest">重命名, 这里缺少一个输入框</button> -->
      </div>
    </div>
  </div>
  <div 
    class="menu" 
    v-if="showContextMenu"
    :style="{ left: x + 'px', top: y + 'px'}"
  >
    <button @click.stop="handleMoveout" v-if="inFolder">移出文件夹</button>
    <button @click.stop="handleChangeVisibility">修改权限</button>
    <button @click.stop="handleShare">分享链接</button>
    <button @click.stop="handleRename">重命名</button>
    <button @click.stop="doNothing" @dblclick.stop="handleDelete" v-tooltip="'文档删除后将无法找回。双击按钮以确认'">删除</button>
  </div>
</template>


<script>
export default {
  name: 'DocListItem',
  props: {
    doc: {
      type: Object
    },
    inFolder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rename: this.doc.name,
      name: this.doc.name,
      showDocModal: false,
      link: '',

      showContextMenu: false,
      x: 0,   // 弹窗相对浏览器左上角的横坐标
      y: 0,   // 弹窗相对浏览器左上角的纵坐标
      renaming: false, // 是否进入重命名状态
    }
  },
  mounted() {
    window.addEventListener('click', this.hideMenu)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.hideMenu)
  },
  methods: {
    doNothing() {},
    handleMoveout() {
      let files = []
      files.push(this.doc.id)
      let data = { files: files }
      this.$http.post('/api/projects/folder/move_out/', data).then(
        response => {
          // console.log('success')
          this.$bus.emit('flushFolder')
          this.showContextMenu = false
        },
        error => {
          console.log(error)
        }
      )
    },
    handleChangeVisibility() {
      this.sendChangeDocIdentityRequest()
      this.showContextMenu = false
    },
    handleShare() {
      this.shareDocLink()
      this.showContextMenu = false
    },
    handleRename() {
      const width = this.$refs.name.getBoundingClientRect().width
      this.$refs.name.style.display = 'none'
      this.$refs.nameInput.style.width = width
      this.$refs.nameInput.style.display = 'block'
      this.$refs.hint.style.display = 'block'
      this.$refs.nameInput.focus()
      this.showContextMenu = false
    },
    beforeSendRename() {
      this.name = this.rename
      this.sendRenameDocRequest()
      this.recoverName()
    },
    recoverName() {
      this.rename = this.name
      this.$refs.name.style.display = 'block'
      this.$refs.nameInput.style.display = 'none'
      this.$refs.hint.style.display = 'none'
    },
    handleDelete() {
      this.sendDeleteDocRequest()
      this.showContextMenu = false
    },
    sendDeleteDocRequest() {
      this.$bus.emit('deleteDocRequest', this.doc)
    },
    sendRenameDocRequest() {
      if (this.rename.trim() == '') {
        this.$bus.emit('message', {
          title: '重命名失败',
          content: '',
          time: 1500
        })
      } else {
        this.$bus.emit('renameDocRequest', { doc: this.doc, rename: this.rename })
      }
    },
    sendChangeDocIdentityRequest() {
      this.$bus.emit('changeDocIdentityRequest', this.doc)
    },
    shareDocLink() {
      this.$http.get(`/api/projects/${this.doc.id}/generate_invite_url/`).then(
        response => {
          this.link = response.data.url 
          // navigator.clipboard.writeText(this.link)
          this.$bus.emit('message', { title: '复制链接，即刻协作', content: this.link, time: 5000 })
        },
        error => {
          console.log(error.message)
        }
      )
    },
    // 控制右键弹出菜单
    handleClick(event) {
      this.showContextMenu = true
      this.x = event.clientX
      this.y = event.clientY
    },
    // 隐藏菜单
     hideMenu() {
      if (this.showContextMenu) this.showContextMenu = false
    },
  }
}
</script>

<style scoped>
.doc-container {
  min-width: 120px;
  height: 120px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 5px lightgrey;
  margin: 15px;
  cursor: pointer;
  transition: 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.doc-container:hover {
  transform: translate(-2px, -2px) scale(1.02);
  box-shadow: 0 0 5px grey;
}

img {
  display: block;
  margin: 0 auto;
  width: 200px;
  height: 150px;
}

.doc-info {
  min-width: 120px;
  text-align: center;
  margin: 0 auto;
  margin-top: 10px;
  position: relative;
}

.doc-info input {
  display: none;
  width: 140px;
  height: 20px;
  border: 2px solid rgba(199, 29, 35, 1);
  caret-color: rgba(199, 29, 35, 1);
  font-size: 18px;
  padding: 5px;
  border-radius: 5px;
  position: relative;
}
.input-hint {
  display: none;
  position: absolute;
  font-size: 12px;
  top: -15px;
  font-weight: bold;
  color: grey;
}

.doc-name {
  color: rgba(199, 29, 35, 1);
  font-size: 20px;
  font-weight: bold;
  position: relative;
}

.doc-image {
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto
}

.menu {
  width: 100px;
  /* height: 90px; */
  padding: 10px;
  background: white;
  /* border: 2px solid rgba(199, 29, 35, 1); */
  box-shadow: 1px 1px 10px grey;
  border-radius: 10px;
  position: absolute;
  z-index: 99;
}

.menu button {
  /* display: block;/ */
  width: 100px;
  height: 30px;
  box-shadow: 0px 0px 3px grey;
  background: transparent;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  margin-bottom: 5px;
}

.menu button:last-of-type {
  margin-bottom: 0;
}

.menu button:hover {
  background: rgba(199, 29, 35, 1);
  color: white;
}
</style>