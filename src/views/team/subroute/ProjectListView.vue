<!-- 团队项目列表 -->
<template>
  <div class="project-top">
    <div class="back-to-all" v-if="showSearch" @click="showSearch = false; projectKeyword = ''">
      返回全部
    </div>
    <div class="back-to-all" v-else-if="showDeleted" @click="showDeleted = false">
      返回项目列表
    </div>
    <template v-if="!showDeleted">
      <input type="text" placeholder="团队项目名称" v-model="projectKeyword" @keyup.enter="handleSearchProject" />
      <div class="search-icon" @click="handleSearchProject" @mouseover="searchIconIsHovered = true"
        @mouseleave="searchIconIsHovered = false">
        <SearchIcon :color="searchIconIsHovered ? 'rgba(199,29,35, 1)' : 'lightgrey'" />
      </div>
      <div class="sort-icon">
        <svg t="1693361864133" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2274" width="50" height="50"><path d="M384 320l512 0c17.696 0 32-14.336 32-32s-14.304-32-32-32L384 256c-17.664 0-32 14.336-32 32S366.336 320 384 320z" fill="rgba(199,29,35, 1)" p-id="2275"></path><path d="M896 480 384 480c-17.664 0-32 14.336-32 32s14.336 32 32 32l512 0c17.696 0 32-14.336 32-32S913.696 480 896 480z" fill="rgba(199,29,35, 1)" p-id="2276"></path><path d="M896 704 384 704c-17.664 0-32 14.304-32 32s14.336 32 32 32l512 0c17.696 0 32-14.304 32-32S913.696 704 896 704z" fill="rgba(199,29,35, 1)" p-id="2277"></path><path d="M192 288m-64 0a2 2 0 1 0 128 0 2 2 0 1 0-128 0Z" fill="rgba(199,29,35, 1)" p-id="2278"></path><path d="M192 512m-64 0a2 2 0 1 0 128 0 2 2 0 1 0-128 0Z" fill="rgba(199,29,35, 1)" p-id="2279"></path><path d="M192 736m-64 0a2 2 0 1 0 128 0 2 2 0 1 0-128 0Z" fill="rgba(199,29,35, 1)" p-id="2280"></path></svg>
        <ul class="sort-opt-container">
          <li @click="sortByName">按项目名称</li>
          <li @click="sortByCreateTime">按创建时间</li>
          <li @click="sortByUpdateTime">按修改时间</li>
        </ul>
      </div>
      <div class="trash-icon" @click="showDeleted = true">
        <TrashIcon />
      </div>
    </template>
  </div>
  <div class="container">
    <!-- 如果是展示模式 -->
    <template v-if="!showDeleted && !showSearch">
      <!-- 展示新建项目卡片 -->
      <NewProject what="项目" @click="showModal = true" />
      <!-- 
          用 v-for 生成卡片列表 
          【说明】ProjectListItem 有一个 type 属性，默认值为 'normal'，展示卡片
          任何非 'normal' 值会使之变成带头 “恢复” icon 的被删除卡片
      -->
      <div v-for="project in projectData" :key="project" @click="handleCardClick($event, id, teamId)">
        <ProjectListItem :data="project"></ProjectListItem>
      </div>
    </template>
    <!-- 如果是回收站模式 -->
    <template v-else-if="showDeleted">
      <ProjectListItem v-for="project in recycleData" :key="project" type="delete" :data="project"></ProjectListItem>
    </template>
    <template v-else-if="showSearch">
      <div v-for="project in searchData" :key="project" @click="jumpToProject(project.id,project.teamId)">
      <ProjectListItem :key="project" :data="project"></ProjectListItem>
      </div>
    </template>
  </div>
  <CreateProjectModal :show="showModal" @close="showModal = false" />
</template>

<script>
import ProjectListItem from '../../../components/ListItem/team/ProjectListItem.vue'
import NewProject from '../../../components/ListItem/team/NewProject.vue'
import SearchIcon from '../../../components/Svg/SearchIcon.vue'
import TrashIcon from '../../../components/Svg/TrashIcon.vue'
import CreateProjectModal from '../../../components/Modal/CreatProjectModal.vue'
export default {
  name: 'ProjectListView',
  components: { ProjectListItem, NewProject, SearchIcon, TrashIcon, CreateProjectModal },
  data() {
    return {
      teamId: null,
      projectData: [],
      recycleData: [],
      searchData: [],     // 记得补充 search 的接口
      showDeleted: false, // 是否正在回收站
      showSearch: false,
      searchIconIsHovered: false,
      projectKeyword: '', // 搜索关键字
      showModal: false,
      nameIsAsc: true,        // 名字需要升序
      createTimeIsDesc: true, // 创建时间需要降序
      updateTimeIsDesc: true  // 更新时间需要降序
    }
  },
  mounted() {
    this.teamId = this.$route.params.teamId
    this.getProjectData()
    this.$http.get(`/api/projects/list/deleted/${this.teamId}/`).then(
      response => {
        this.recycleData = response.data.map((project) => ({
          teamId: project.teamId,
          id: project.id,
          name: project.name,
          creator: project.creator,
          latestUpdateTime: project.changedDate,
          image: project.image,
          interfaceNum: project.interfaceNum,
          documentsNum: project.documentsNum
        }))
      },
      error => {
        console.log(error.message)
      }
    )
    this.$bus.on('renameRequest', this.handleRenameProject)
    this.$bus.on('deleteRequest', this.handleDeleteProject)
    this.$bus.on('restoreRequest', this.handleRestoreProject)
    this.$bus.on('regetProjectListRequest', this.regetProjectList)
    this.$bus.on('copyProject', this.handleCopyProject)
  },
  beforeUnmount() {
    this.$bus.off('copyProject')
  },
  methods: {
    // 将获取数据从 mounted 中抽离，在复制项目时复用
    getProjectData() {
      this.$http.get(`/api/projects/list/${this.teamId}/`).then(
        response => {
          // console.log(response.data);
          this.projectData = response.data.map((project) => ({
            teamId: project.teamId,
            id: project.id,
            name: project.name,
            creator: project.creator,
            latestUpdateTime: project.changedDate,
            image: project.image,
            interfaceNum: project.interfaceNum,
            documentsNum: project.documentsNum,
            createTime: project.createDate
          }))
        },
        error => {
          console.log(error.message)
        }
      )
    },
    regetProjectList(inValue) {
      this.$http.get(`/api/projects/list/${this.teamId}/`).then(
        response => {
          this.projectData = response.data.map((project) => ({
            teamId:project.teamId,
            id: project.id,
            name: project.name,
            creator: project.creator,
            latestUpdateTime: project.changedDate,
            image: project.image,
            interfaceNum: project.interfaceNum,
            documentsNum: project.documentsNum
          }))
        },
        error => {
          console.log(error.message)
        }
      )
    },
    handleRenameProject(data) {
      let renameInfo = new FormData()
      renameInfo.append('name', data.rename)
      this.$http.post(`/api/projects/${data.project.id}/rename/`, renameInfo).then(
        response => {
          data.project.name = data.rename
        },
        error => {
          this.$bus.emit('message', {
            title: '重命名失败',
            content: '',
            time: 1000
          })
          // this.$bus.emit('renameFailRequest', true)
        }
      )
    },
    handleDeleteProject(data) {
      this.$http.post(`/api/projects/${data.id}/delete/`).then(
        response => {
          this.projectData.splice(this.projectData.indexOf(data), 1)
          this.recycleData.push(data)
        }
      )
    },
    handleRestoreProject(data) {
      this.$http.post(`/api/projects/${data.id}/restore/`).then(
        response => {
          this.projectData.push(data)
          this.recycleData.splice(this.recycleData.indexOf(data), 1)
        },
        error => {
          console.log(error)
        }
      )
    },
    handleSearchProject() {
      this.$http.get(`/api/projects/${this.teamId}/search/?keyword=${this.projectKeyword}`).then(
        response => {
          this.searchData = response.data.map((project) => ({
            teamId:project.teamId,
            id: project.id,
            name: project.name,
            creator: project.creator,
            latestUpdateTime: project.changedDate,
            image: project.image,
            interfaceNum: project.interfaceNum,
            documentsNum: project.documentsNum
          }))
        },
        error => {
          console.log(error.message)
        },
        this.showSearch = true
      )
    },
    jumpToProject(id, teamId) {
      this.$cookies.set('teamId', this.teamId)
      this.$router.push(`/project/${id}/doc`)
    },
    handleCopyProject(id) {
      console.log('before', this.projectData)
      console.log('to request')
      this.$http.post(`/api/projects/copy/${id}`).then(
        response => {
          console.log('response')
          this.getProjectData()
        },
        error => {
          this.$bus.emit('message', {
            title: '拷贝失败',
            content: '',
            time: 1000
          })
        }
      )
      console.log('after', this.projectData)
      // this.getProjectData()
    },

    // 排序
    sortByName() {
      this.projectData.sort((a, b) => this.nameIsAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))
      this.nameIsAsc = !this.nameIsAsc
    },
    sortByCreateTime() {
      this.projectData.sort((a, b) => {
        const ta = new Date(a.createTime)
        const tb = new Date(b.createTime)
        return this.createTimeIsDesc ? tb - ta : ta - tb
      })
      this.createTimeIsDesc = !this.createTimeIsDesc
    },
    sortByUpdateTime() {
      this.projectData.sort((a, b) => {
        const ta = new Date(a.latestUpdateTime)
        const tb = new Date(b.latestUpdateTime)
        return this.updateTimeIsDesc ? tb - ta : ta - tb
      })
      this.updateTimeIsDesc = !this.updateTimeIsDesc
    },

    handleCardClick(e, id, teamId) {
      if (e.target.tagName === 'INPUT') {

      } else {
        this.jumpToProject(id, teamId)
      }
    }
  }
}
</script>

<style scoped>
.project-top {
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
  color: rgba(199, 29, 35, 1);
  cursor: pointer;
}

.back-to-all:hover {
  text-decoration: underline;
}

.project-top input {
  width: 300px;
  height: 35px;
  font-size: 18px;
  border-radius: 10px;
  border: 2px solid lightgrey;
  padding: 5px 10px;
  transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  caret-color: rgba(199, 29, 35, 1);
}

.project-top input:focus {
  border: 3px solid rgba(199, 29, 35, 1);
  /* outline: 1px solid rgba(199,29,35, 1); */
}

.project-top input::placeholder {
  color: lightgrey;
}


.search-icon {
  margin-left: 10px;
  cursor: pointer;
}

.sort-icon, .trash-icon {
  margin-left: 30px;
  cursor: pointer;
}

.sort-icon {
  position: relative;
}

.sort-opt-container {
  display: none;
  position: absolute;
  box-sizing: border-box;
  border-radius: 10px;
  left: 0;
  top: 90%;
  width: 150px;
  height: 200px;
  background-color: white;
  box-shadow: 3px 3px 10px grey;
  flex-wrap: wrap;
  justify-content: center;
  align-content: space-evenly;
  z-index: 100;
}

.sort-icon:hover .sort-opt-container {
  display: flex;
}

.sort-opt-container li {
  width: 100px;
  padding: 10px;
  /* margin: 10px; */
  height: 30px;
  border-radius: 5px;
  box-shadow: 1px 1px 5px grey;
  background: white;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(199, 29, 35, 1);
  transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.sort-opt-container li:hover {
  transform: translate(-2px, -2px) scale(1.02);
}

.container {
  width: 1200px;
  height: 90%;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
  align-content: flex-start;
  /* padding-left: 30px; */
}
</style>