<template>
  <!-- <StylishModal :show="false" width="500px" height="400px" padding="25px"> -->
  <div class="outer-container" ref="container" id="temp">
    <div class="group-name" ref="name">
      {{ groupName }}
    </div>
    <input type="text" v-model="rename" ref="nameInput" @keydown.enter="confirmRenameGroup" @blur="recover">
    <div class="input-hint" ref="hint">敲击回车以确认</div>
    <div class="member-container">
      <img class="member-avatar" v-for="member in memberList" :key="member.id" :src="member.avatar">
    </div>
    <button class="line-btn" @click="handleRename">重命名</button>
    <button class="line-btn" @click="clickSearchRecordModal">
      查找聊天记录
    </button>
    <div class="quit">
      <template v-if="!isDefault">
        <template v-if="$cookies.get('user_id') == groupLeader">
          <button @click="showInviteNewMember">邀请新成员</button>
          <button @click="handleDisbandGroup">解散群聊</button>
        </template>
        <template v-else>
          <button @dblclick="handleQuitGroup" v-tooltip="'双击以确认退出群聊'">
            退出群聊
          </button>
        </template>
      </template>
    </div>
    <SearchRecordModal :show="showSearchRecordModal" :groupId="groupId" @close="showSearchRecordModal = false">
    </SearchRecordModal>
    <InviteNewMemberModal :show="showInviteNewMemberModal" :groupId="groupId" @close="showInviteNewMemberModal = false">
    </InviteNewMemberModal>
  </div>
  <!-- </StylishModal> -->
</template>
<script>
import StylishModal from '../Stylish/StylishModal.vue'
import SearchRecordModal from './SearchRecordModal.vue'
import InviteNewMemberModal from './InviteNewMemberModal.vue'
export default {
  name: 'GroupDetailModal',
  components: { StylishModal, SearchRecordModal, InviteNewMemberModal },
  props: ['groupId'],
  data() {
    return {
      memberList: [],
      teamId: '',
      groupName: '',
      groupAvatar: '',
      rename: '',
      showSearchRecordModal: false, // 展示搜索聊天记录的模态框
      showInviteNewMemberModal: false, // 展示邀请新成员的模态框
      isShowing: false,
      groupLeader: null,
      isDefault: false
    }
  },
  mounted() {
    this.$bus.on('showGroupDetail', () => {
      this.isShowing = true
      const div = document.getElementById('temp')
      div.style.display = 'block'
      // this.$refs.container.style.display = 'block'
      div.classList.add('slide-out')
      // this.$refs.container.classList.add('slide-out')
      setTimeout(() => {
        div.classList.remove('slide-out')
      }, 250)
      this.getData()
      document.addEventListener('click', this.close)
    })
    this.$bus.on('hideGroupDetail', () => {
      this.isShowing = false
      const div = document.getElementById('temp')
      div.classList.add('slide-hide')
      // this.$refs.container.classList.add('slide-hide')
      document.removeEventListener('click', this.close)
      setTimeout(() => {
        div.classList.remove('slide-hide')
        // this.$refs.container.classList.remove('slide-hide')
        div.style.display = 'none'
        // this.$refs.container.style.display = 'none'
      }, 250);
    })
  },
  methods: {
    getData() {
      this.teamId = this.$route.params.teamId
      this.$http.get(`/api/groups/${this.groupId}/`).then(
        response => {
          this.memberList = response.data.members.map((member) => ({
            id: member.user.id,
            username: member.user.username,
            realname: member.user.last_name + member.user.first_name,
            avatar: member.user.avatar
          }))
          this.groupAvatar = response.data.avatar
          this.groupName = response.data.name
        }
      ),
        this.$http.get(`/api/groups/find/${this.groupId}/`).then(
          response => {
            console.log(this.groupId);
            this.groupLeader = response.data.id
            console.log(this.groupLeader);
          }
        ),
        this.$http.get(`/api/groups/${this.groupId}/is_default/`).then(
          response => {
            this.isDefault = response.data.is_default
          },
          error => {
            console.log(error.message)
          }
        )
    },
    confirmRenameGroup() {
      if (this.rename.trim() == '') {
        this.$bus.emit('message', {
          title: '群聊名不能为空',
          content: '',
          time: 1500
        })
      } else {
        let formData = new FormData()
        formData.append('name', this.rename)
        this.$http.patch(`/api/groups/${this.groupId}/`, formData).then(
          response => {
            this.$bus.emit('roomOption', JSON.stringify({
              'option': 'edit',
              'group_data': response.data
            }))
            this.groupName = this.rename
            this.$bus.emit('message', {
              title: '重命名成功',
              content: '重命名为：' + this.rename,
              time: 3000
            })
          },
          error => {
            this.$bus.emit('message', {
              title: '重命名失败',
              content: '',
              time: 3000
            })
          }
        )
      }
    },
    clickSearchRecordModal() {
      this.$bus.emit('fetchAllMessages')
      this.showSearchRecordModal = true
    },
    handleQuitGroup() {
      this.$http.delete(`/api/groups/${this.groupId}/quit/`).then(
        response => {
          this.$bus.emit('roomOption', JSON.stringify({
            'option': 'quit',
            'group_data': { 'id': this.groupId, 'user_id': this.$cookies.get('user_id') }
          }))
          this.$bus.emit('message', {
            title: '退出群聊成功',
            content: '',
            time: 2000
          })
        },
        error => {
          this.$bus.emit('message', {
            title: '退出群聊失败',
            content: '',
            time: 2000
          })
        }
      )
    },
    handleDisbandGroup() {
      this.$http.delete(`/api/groups/${this.groupId}/`).then(
        response => {
          this.$bus.emit('roomOption', JSON.stringify({
            'option': 'delete',
            'group_data': { 'id': this.groupId }
          }))
          this.$bus.emit('message', {
            title: '解散群聊成功',
            content: '',
            time: 2000
          })
          this.$bus.emit('hideGroupDetail')
        },
        error => {
          console.log(error.message)
        }
      )
    },
    showInviteNewMember() {
      this.showInviteNewMemberModal = true
    },
    handleRename() {
      this.rename = this.groupName
      this.$refs.name.style.display = 'none'
      this.$refs.nameInput.style.display = 'block'
      this.$refs.hint.style.display = 'block'
      this.$refs.nameInput.focus()
    },
    recover() {
      this.rename = this.groupName
      this.$refs.name.style.display = 'block'
      this.$refs.nameInput.style.display = 'none'
      this.$refs.hint.style.display = 'none'
    },
    close(event) {
      if (this.isShowing) {
        const x = event.clientX
        const y = event.clientY
        const div = document.getElementById('temp')
        const rect = div.getBoundingClientRect()
        if (!(rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom)) {
          this.$bus.emit('hideGroupDetail')
        }
      }
    }
  }
}
</script>
<style scoped>
.outer-container {
  display: none;
  background-color: white;
  border-radius: 10px;
  position: fixed;
  width: 270px;
  padding: 5px;
  /* height: 100px; */
  z-index: 999;
  right: 50px;
  top: 145px;
  box-shadow: -1px 1px 5px grey;
}

.group-name {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: rgba(199, 29, 35, 1);
  margin: 10px auto;
  max-width: 240px;
  word-break: break-all;
}

input {
  display: none;
  margin: 10px auto;
  margin-bottom: 0;
  width: 240px;
  height: 30px;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 18px;
  caret-color: rgba(199, 29, 35, 1);
  border: 1px solid rgba(199, 29, 35, 1);
  padding: 5px;
}

input:focus-visible {
  outline: 2px solid rgba(199, 29, 35, 1);
}

.input-hint {
  display: none;
  margin-left: 10px;
  font-size: 12px;
  color: grey;
  margin-bottom: 10px;
}

button.line-btn {
  width: 100%;
  text-align: left;
  padding: 5px;
  height: 60px;
  background: white;
  font-weight: bold;
  font-size: 18px;
  border-bottom: 1px solid lightgrey;
  cursor: pointer;
  transition: 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  border-radius: 5px;
}

button.line-btn:first-of-type {
  border-top: 1px solid lightgrey;
}

button.line-btn:hover {
  background: rgba(199, 29, 35, 1);
  color: white;
}

.member-avatar {
  width: 40px;
  height: 40px;
  margin: 5px;
  border-radius: 5px;
}

.member-container {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  height: 200px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.quit {
  width: 100%;
  height: 250px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}

.quit button {
  width: 120px;
  height: 40px;
  margin: 5px 20px;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid rgba(199, 29, 35, 1);
  font-size: 18px;
  border-radius: 5px;
  /* font-weight: lighter; */
  color: rgba(199, 29, 35, 1);
  cursor: pointer;
  transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.quit button:hover {
  box-sizing: content-box;
  background: rgba(199, 29, 35, 1);
  color: white;
  font-weight: bold;

}

@keyframes popout {
  from {
    width: 0;
  }

  to {
    width: 250px;
  }
}

.slide-out {
  animation: popout .2s ease;
}

.slide-hide {
  animation: popout .2s ease reverse forwards;
}
</style>