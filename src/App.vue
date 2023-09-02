<template>
  <!-- 处于首页、文档编辑页时不显示 -->
  <TopNav v-if="!('/' === instance.proxy.$route.path || instance.proxy.$route.path.indexOf('invite') !== -1 || instance.proxy.$route.path.indexOf('preview') !== -1)"
    v-show="!(instance.proxy.$route.path.indexOf('/doc/') !== -1) && !(instance.proxy.$route.path.indexOf('/page/') !== -1)" />
  <RouterView />
  <!-- 消息组件 -->
  <!-- 如果要展示分享链接，这一句代码就必须要加上 -->
  <StylishMessage :show="showMessage" :title="messageTitle" :content="messageContent" />
  <!-- <TeamInviteConfirm></TeamInviteConfirm> -->
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import DocumentView from './components/DocumentWheels/DocumentView.vue'
import TopNav from './components/TopNav/TopNav.vue'
import StylishMessage from './components/Stylish/StylishMessage.vue'
import TeamInviteConfirm from './views/TeamInviteConfirm.vue'

import { useStore } from 'vuex'

let showMessage = ref(false)  // 展示消息
let messageTitle = ref('')    // 消息标题
let messageContent = ref('')  // 消息内容

const instance = getCurrentInstance() // 获取 'vm'
// 绑定全局事件
instance.proxy.$bus.on('message', (data) => {
  messageTitle.value = data.title
  messageContent.value = data.content
  showMessage.value = true
  setTimeout(() => {
    showMessage.value = false
    setTimeout(() => {
      messageTitle.value = ''
      messageContent.value = ''
    },1000)
  }, data.time)
})

const ws = new WebSocket('ws://43.138.14.231:9000/ws/page/view/');
instance.proxy.$bus.on('closeShareRequest', (pageId) => {
  ws.send(JSON.stringify({"page_id":pageId}))
})
ws.onmessage = (messageEvent) => {
  const data = JSON.parse(messageEvent.data)
  if (instance.proxy.$route.path.indexOf('preview') !== -1) {
    if (data.project_id == instance.proxy.$route.params.projectId) {
      instance.proxy.$bus.emit('message', {
        title: '原型预览链接失效',
        content: '',
        time: 3000
      })
      window.opener = null
      window.open('about:blank', '_top').close()
    }
  }
}

const store = useStore()
store.commit('setIsLoggedIn', getCurrentInstance().proxy.$cookies.get('user_id') ? true : false)

  // const { setIsLoggedIn } = mapMutations(['setIsLoggedIn'])
  // console.log(getCurrentInstance().proxy.$cookies.get('user_id') ? true :false)
  // setIsLoggedIn(getCurrentInstance().proxy.$cookies.get('user_id') ? true :false)


</script>
<style>
:deep(.vac-rooms-container.vac-rooms-container-full) {
  background: yellow !important;
}
</style>
