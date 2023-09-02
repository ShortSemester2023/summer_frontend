<template>
<StylishModal :show="show" width="500px" height="630px" padding="25px">
    <div class="container-header">
      <div class="header-title">
        邀请成员进群
      </div>
      <div class="list">
        <img  v-for="member in selectedList" :key="member.id" :src="member.avatar">
      <!-- <div @click="handleClose">
        <CloseIcon size="30"></CloseIcon>
      </div> -->
      </div>
      <!-- <button @click="confirmSend">确认发送</button> -->
      <div class="container-rooms">
        <div v-for="member in inviteList" :key="member.id" @click="handleSelect(member)">
          <img :src="member.avatar">
          <div>{{ member.username }}</div>
          <!-- <div v-if="group.isSelect">已选择</div> -->
        </div>
      </div>
      <div class="buttons">
        <button @click="handleClose">取消</button>
        <button @click="handleInvite">邀请</button>
      </div>
    </div>
  </StylishModal>
</template>
<script>
import { number } from 'echarts';
import StylishModal from '../Stylish/StylishModal.vue';
import CloseIcon from '../Svg/CloseIcon.vue';
export default {
  name: 'InviteNewMemberModal',
  props: ['show', 'groupId'],
  emits: ['close'],
  components: { StylishModal, CloseIcon },
  data() {
    return {
      teamMemberList: [],
      groupMemberList: [],
      inviteList: [],
      selectedList: []
    }
  },
  watch: {
    show() {
      this.getData()
      this.inviteList = this.teamMemberList.filter(itemA => !this.groupMemberList.some(itemB => itemB.id == itemA.id))
    },
    groupId() {
      this.getData()
    }
  },
  // mounted() {
  //   this.getData()
  // },
  methods: {
    handleClose() {
      this.groupMemberList = []
      this.selectedList = []
      this.$emit('close')
    },
    getData() {
      if (this.$route.params.teamId.trim().length != 0) {
        this.$http.get(`/api/teams/${this.$route.params.teamId}/`).then(
          response => {
            this.teamMemberList = response.data.members.map((member) => ({
              id: member.user.id,
              username: member.user.username,
              avatar: member.user.avatar,
              isSelect: false
            }))
          },
          error => {
            console.log(error.message)
          }
        )
      }
      if (typeof this.groupId === 'number') {
        this.$http.get(`/api/groups/${this.groupId}/`).then(
          response => {
            this.groupMemberList = response.data.members.map((member) => ({
              id: member.user.id,
              username: member.user.username,
              avatar: member.user.avatar,
              isSelect: false
            }))
          },
          error => {
            console.log(error.message)
          }
        )
      }
    },
    handleSelect(member) {
      if (!member.isSelect) {
        member.isSelect = true
        this.selectedList.push(member)
      } else {
        this.selectedList.splice(this.selectedList.indexOf(member), 1)
        member.isSelect = false
      }
    },
    handleInvite() {
      let idList = this.selectedList.map(item => item.id)
      console.log(idList.join(' '));
      let formData = new FormData()
      formData.append('users', idList.join(' '))
      this.$http.post(`/api/groups/${this.groupId}/add/member/`, formData).then(
        response => {
          this.$bus.emit('roomOption', JSON.stringify({
            'option': 'join',
            'group_data': response.data
          }))
          this.$bus.emit('message', {
            title: '邀请新成员进群成功',
            content: '',
            time: 3000
          })
        },
        error => {
          this.$bus.emit('message', {
            title: '邀请新成员进群失败',
            content: '',
            time: 3000
          })
        }
      )
      this.handleClose()
    }
  }
}
</script>
<style scoped>
.container-header {
  height: 100%;
}
.header-title {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: rgba(199, 29, 35, 1);
}

.show-list {
  height: 50px;
  display: flex;
  border: rgba(199, 29, 35, 0.8) solid;
  overflow-x: auto;
  width: 500;
}

.group-list-item {
  margin-bottom: 7px;
  display: flex;
  cursor: pointer;
  border-radius: 50px;
}


.list {
  width: 430px;
  height: 50px;
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid lightgrey;
  padding-bottom: 10px;
  margin-bottom: 30px;
  margin-left: 10px;
  padding-top: 10px;
}
.list::-webkit-scrollbar {
  display: none;
}
img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0;
  margin-right: 10px;
  margin-bottom: 10px;
}


.container-rooms {
  width: 450px;
  height: 350px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin-left: 10px;
  overflow-y: auto;
}

.container-rooms>div {
  display: flex;
  width: 200px;
  padding-right: 10px;
  margin-bottom: 10px;
}
.container-rooms>div>div {
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.buttons {
  width: 100%;
  height: calc(100% - 510px);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.buttons button {
  width: 100px;
  height: 40px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
}
.buttons button:first-child {
  border: 1px solid rgba(199, 29, 35, 1);
  color: rgba(199, 29, 35, 1);
  background: white;
  box-sizing: border-box;
}
.buttons button:last-child {
  color: white;
  background: rgba(199, 29, 35, 1);
}
.buttons button:first-child:hover {
  border: 1px solid rgba(199, 29, 35, 0.8);
  color: rgba(199, 29, 35, 0.8);
}
.buttons button:last-child:hover {
  color: white;
  background: rgba(199, 29, 35, 0.8);
}
</style>