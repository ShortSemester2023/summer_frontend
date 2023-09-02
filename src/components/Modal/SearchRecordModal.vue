<template>
  <StylishModal :show="show" width="650px" height="600px" padding="25px">
    <div class="container-header">
      <div class="modal-title">
        查找聊天记录
      </div>
      <div class="close-icon" @click="handleClose">
        <CloseIcon size="30" />
      </div>
    </div>
    <div class="input-container">
      <input type="text" placeholder="聊天记录关键词" v-model="recordKeyword" @keyup.enter="searchRecord" />
      <div class="search-icon" @click="searchRecord" @mouseover="searchIconIsHovered = true"
        @mouseleave="searchIconIsHovered = false">
        <SearchIcon :color="searchIconIsHovered ? 'rgba(199,29,35, 1)' : 'lightgrey'" />
      </div>
    </div>
    <div class="container-result">
      <div v-for="record in recordList" :key="record.id">
        <img :src="record.sender.user.avatar" >
        <div class="rec-content">
          <div>
            <div class="sender">{{ record.sender.user.username }}</div>
            <div class="time">{{ record.createDatetime }}</div>
          </div>
          <div>
            <div v-html="record.textContent"></div>
            <button @click="locateToMessage(record.id)">定位到聊天位置</button>
          </div>
          
        </div>
        
       
        
       
      </div>
    </div>
  </StylishModal>
</template>

<script>
import StylishModal from '../Stylish/StylishModal.vue'
import SearchIcon from '../Svg/SearchIcon.vue'
import CloseIcon from '../Svg/CloseIcon.vue'
export default {
  name: 'SearchRecordModal',
  props: ['show', 'groupId'],
  emit: ['close'],
  components: {
    StylishModal,
    SearchIcon,
    CloseIcon
  },
  data() {
    return {
      searchIconIsHovered: false,
      recordKeyword: '',
      recordList: []
    }
  },
  methods: {
    searchRecord() {
      if (this.recordKeyword.trim() == '') {
        this.$bus.emit('message', {
          title: '关键词为空',
          content: '搜索聊天关键词不能为空',
          time: 3000
        })
      } else {
        console.log(this.groupId);
        console.log(this.recordKeyword);
        this.$http.get(`/api/groups/${this.groupId}/messages/?keyword=${this.recordKeyword}`).then(
          response => {
            this.recordList = response.data.map((record) => ({
              id: record.id,
              sender: record.sender,
              textContent: record.text_content,
              imageContent: record.image_content,
              createDatetime: record.create_datetime,
              groupId: record.group
            }))
          },
          error => {
            console.log(error.message)
          }
        )
      }
    },
    handleClose() {
      this.recordKeyword = ''
      this.recordList = []
      this.$emit('close')
    },
    locateToMessage(id) {
      this.handleClose()
      this.$bus.emit('scrollToMessage', id)
    }
  }
}
</script>

<style scoped>
::placeholder {
  color: lightgrey;
}

.container-header {
  display: flex;
  width: 100%;
  text-align: center;
}

.modal-title {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: rgba(199, 29, 35, 1);
  width: 100%;
  text-align: center;
}

.close-icon {
  cursor: pointer;
}

input {
  width: 400px;
  height: 50px;
  font-size: 18px;
  caret-color: rgba(199, 29, 35, 1);
  border: 1px solid rgba(199, 29, 35, 1);
  border-radius: 10px;
  padding: 5px;
  box-sizing: border-box;
}

.search-icon {
  margin-left: 10px;
  cursor: pointer;
}

.container-result {
  height: 410px;
  width: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
  overflow-y: auto;
}
.container-result::-webkit-scrollbar {
  display: none;
}
.container-result>div {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid lightgrey;
}

.input-container {
  width: 80%;
  margin: 20px auto;
  display: flex;
  padding: 0 20px;
  justify-content: space-between;
}

img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: inline-block;
}

.rec-content {
  display: inline-block;
  margin-left: 20px;
}

.rec-content * {
  display: inline-block;
}

.rec-content>div:first-child {
  display: flex;
  justify-content: space-between;
  width: 450px;
}
.rec-content>div:last-child {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.rec-content>div:last-child>div {
  width: 350px;
  word-break: break-all;

}

.sender {
  font-size: 18px;
  font-weight: bold;
  color:rgba(199, 29, 35, 1);
}
.time {
  font-size: 14px;
  color: grey;
}

.rec-content button {
  width: 108px;
  padding: 0 5px;
  margin: 0 auto;
  font-size: 14px;
  background: transparent;
  transition: 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  color: grey;
  cursor: pointer;
}

.rec-content button:hover {
  font-weight: bold;
  color: rgba(199, 29, 35, 1);
}



</style>