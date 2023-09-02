<!-- 团队成员列表 -->
<template>
  <div class="member-top">
    <div class="back-to-all" v-if="!showAll" @click="showAll = true; userKeyword = ''">
      返回全部
    </div>
    <input type="text" placeholder="团队成员账号或姓名" v-model="userKeyword" @keyup.enter="searchUser"/>
    <div 
      class="search-icon" 
      @click="searchUser" 
      @mouseover="searchIconIsHovered = true" @mouseleave="searchIconIsHovered = false"
    >
      <SearchIcon :color="searchIconIsHovered ? 'rgba(199,29,35, 1)' : 'lightgrey'"/>
    </div>
    <a class="invite-link" v-if="curIdentity === 'leader' || curIdentity === 'admin'" @click="getInviteUrl">
      邀请新成员
    </a>
  </div>
  
  <div class="container">
    <template v-if="showAll">
      <MemberListItem v-for="user in founderData" :key="user" :data="user" :curIdentity="curIdentity"></MemberListItem>
      <MemberListItem v-for="user in adminData" :key="user" :data="user" :curIdentity="curIdentity"></MemberListItem>
      <MemberListItem v-for="user in ordinaryData" :key="user" :data="user" :curIdentity="curIdentity"></MemberListItem>
    </template>
    <template v-else>
      <MemberListItem v-for="user in searchResault" :key="user" :data="user" :curIdentity="curIdentity"></MemberListItem>
    </template>
  </div>
</template>

<script>
import MemberListItem from '../../../components/ListItem/team/MemberListItem.vue'
import SearchIcon from '../../../components/Svg/SearchIcon.vue'
export default {
  name: 'MemberListView',
  components: { MemberListItem, SearchIcon },
  data() {
    return {
      teamId: null,
      searchIconIsHovered: false,
      showAll: true,    // 默认展示全部数据
      //团队创建者数据
      founderData: [],
      //团队管理员数据
      adminData: [],
      //团队普通成员数据
      ordinaryData: [],
      curIdentity: 'member',
      userKeyword: '',
      // 存放搜索到的成员的数据
      searchResault: [],
      inviteUrl: ''
    }
  },
  mounted() {
    this.teamId = this.$route.params.teamId
    this.$http.get(`/api/teams/${this.teamId}/`).then(
      (response) => {
        this.founderData = response.data.members.filter(item => item.identity == 'leader').map((member) =>
        ({
          userId: member.user.id,
          avatar: member.user.avatar,
          username: member.user.username,
          firstName: member.user.first_name,
          lastName: member.user.last_name,
          email: member.user.email,
          identity: member.identity,
          Identity: '创建者', // 注意这两个 identity 首字母大小写不一样
          profile: member.user.profile === '' ? '暂无' : member.user.profile,
          joinDateTime: member.join_datetime
        }))
        this.adminData = response.data.members.filter(item => item.identity == 'admin').map((member) =>
        ({
          userId: member.user.id,
          avatar: member.user.avatar,
          username: member.user.username,
          firstName: member.user.first_name,
          lastName: member.user.last_name,
          email: member.user.email,
          identity: member.identity,
          Identity: '管理员',
          profile: member.user.profile === '' ? '暂无' : member.user.profile,
          joinDateTime: member.join_datetime
        }))
        this.ordinaryData = response.data.members.filter(item => item.identity == 'member').map((member) =>
        ({
          userId: member.user.id,
          avatar: member.user.avatar,
          username: member.user.username,
          firstName: member.user.first_name,
          lastName: member.user.last_name,
          email: member.user.email,
          identity: member.identity,
          Identity: '成员',
          profile: member.user.profile === '' ? '暂无' : member.user.profile,
          joinDateTime: member.join_datetime
        }))
        let curUserId = this.$cookies.get('user_id') // 当前登录用户id
        if (this.founderData.some(founder => founder.userId == curUserId)) {
          this.curIdentity = 'leader'
        } else if (this.adminData.some(admin => admin.userId == curUserId)) {
          this.curIdentity = 'admin'
        }
      }
    )
    this.$bus.on('leaderHandleIdentity', this.leaderHandleIndentity)
    this.$bus.on('adminHandleIdentity', this.adminHandleIdentity)
  },
  methods: {
    leaderHandleIndentity(value) {
      if (value.data.identity === 'admin') {
        if (value.handleIdentity.cancelAdmin) {
          this.cancelAdmin(value.data)
        }
      } else if (value.data.identity === 'member') {
        if (value.handleIdentity.setAdmin) {
          this.setAdmin(value.data)
        } else if (value.handleIdentity.deleteMember) {
          this.deleteMember(value.data)
        }
      }
    },
    adminHandleIdentity(value) {
      if (value.data.identity === 'member') {
        if (value.handleIdentity.setAdmin) {
          this.setAdmin(value.data)
        } else if (value.handleIdentity.deleteMember) {
          this.deleteMember(value.data)
        }
      }
    },
    setAdmin(user) {
      this.$http.put(`/api/teams/${this.teamId}/add/admin/${user.userId}/`).then(
        response => {
          this.ordinaryData.splice(this.ordinaryData.indexOf(user), 1)
          user.identity = 'admin'
          user.Identity = '管理员'
          this.adminData.push(user)
        },
        error => {
          console.log(error.message);
        }
      )
    },
    cancelAdmin(user) {
      this.$http.put(`/api/teams/${this.teamId}/remove/admin/${user.userId}/`).then(
        response => {
          this.adminData.splice(this.adminData.indexOf(user), 1)
          user.identity = 'member'
          user.Identity = '普通成员'
          this.ordinaryData.push(user)
        },
        error => {
          console.log(error.message);
        }
      )
    },
    deleteMember(user) {
      this.$http.delete(`/api/teams/${this.teamId}/remove/member/${user.userId}/`).then(
        response => {
          this.ordinaryData.splice(this.ordinaryData.indexOf(user), 1)
        },
        error => {
          console.log(error.message);
        }
      )
    },
    searchUser() {
      this.userKeyword = this.userKeyword.trim()
      // 输入内容为空但是搜索 默认展示全部
      if (this.userKeyword.length === 0) {
        this.showAll = true
      } else { // 否则才搜索
        this.$http.get(`/api/teams/${this.teamId}/find/?keyword=${this.userKeyword}`).then(
          response => {
            this.searchResault = response.data.map((item) => ({
              userId: item.user.id,
              avatar: item.user.avatar,
              username: item.user.username,
              firstName: item.user.first_name,
              lastName: item.user.last_name,
              email: item.user.email,
              identity: item.identity,
              Identity: item.identity === 'leader' ? '创建者' : (item.identity === 'admin' ? '管理员' : '成员'),
              profile: item.profile,              // zyh 加上的
              joinDateTime: item.join_datetime
            }))
            this.showAll = false
          },
          error => {
            console.log(error.message);
          },
        )
      }
    },
    getInviteUrl() {
      this.$http.get(`/api/teams/${this.teamId}/generate_invite_url/`).then(
        response => {
          this.inviteUrl = response.data.url
          // navigator.clipboard.writeText(this.inviteUrl)
          this.$bus.emit('message', {
            title: '复制链接，即刻分享',
            content: this.inviteUrl,
            time: 5000
          })
        },
        error => {
          console.log(error.message)
        }
      )
    }
  }
}
</script>

<style scoped>
.member-top {
  height: 10%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}

.back-to-all {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 20px;
  font-weight: bold;
  color: rgba(199,29,35, 1);
  cursor: pointer;
}

.back-to-all:hover {
  text-decoration: underline;
}

.member-top input {
  width: 300px;
  height: 35px;
  font-size: 18px;
  border-radius: 10px;
  border: 2px solid lightgrey;
  padding: 5px 10px;
  transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  caret-color: rgba(199,29,35, 1);
}

.member-top input::placeholder {
  color: lightgrey;
}

.member-top input:focus {
  border: 3px solid rgba(199,29,35, 1);
  /* outline: 1px solid rgba(199,29,35, 1); */
}

.search-icon {
  margin-left: 10px;
  cursor: pointer;
}

.invite-link {
  margin-left: 20px;
  color: rgba(199,29,35, 0.8);
  cursor: pointer;
}
.invite-link:hover {
  color: rgba(199,29,35, 1);
  text-decoration: underline;
}

.container {
  width: 1200px;
  height: 90%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
  /* justify-content: space-evenly; */
  align-content: flex-start;
  /* padding-left: 30px; */
}
</style>