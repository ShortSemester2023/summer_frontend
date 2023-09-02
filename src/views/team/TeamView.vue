<!-- zby -->
<template>
  <!-- <FirstView></FirstView> -->
  <!-- <hr> -->
  <div class="container" :key="$route.fullPath">
    <ul>
      <li><router-link class="link" :to="`/team/${teamId}/info`">团队信息</router-link></li>
      <li><router-link class="link" :to="`/team/${teamId}/member`">团队成员</router-link></li>
      <li><router-link class="link" :to="`/team/${teamId}/project`">团队项目</router-link></li>
      <li><router-link class="link" :to="`/team/${teamId}/chat`">团队群聊</router-link></li>
    </ul>
    <div>
      <!-- <keep-alive> -->
        <RouterView></RouterView>
      <!-- </keep-alive> -->
    </div>
  </div>
</template>

<script>
// import FirstView from '../FirstView.vue';
export default {
  name: 'TeamView',
  data() {
    return {
      teamId: null
    }
  },
  mounted() {
    this.teamId = this.$route.params.teamId
  },
  updated() {
    this.teamId = this.$route.params.teamId
  }
  // components: { FirstView }
}
</script>

<style scoped>
.container {
  display: flex;
  height: calc(100vh - 90px);
  margin-top: 10px;
}

ul {
  width: 250px;
  height: 100%;
  flex: none;
  /* background-color: lightgray; */
  border-radius: 10px;
  box-shadow: 3px 3px 3px lightgrey;
  overflow: hidden;
}

.container>div {
  margin-left: 10px;
  width: calc(100% - 330px);
  padding: 0;
  padding-left: 20px;
  /* background-color: lightgrey; */
}

.link {
  display: block;
  width: 200px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 18px;
  margin: 0 auto;
  margin-top: 20px;
  border-radius: 5px;
  color: grey;
  box-shadow: 1px 1px 5px grey;
}

.link:hover {
  color: rgb(100, 100, 100);
}

.router-link-active {
  box-sizing: border-box;
  color: rgba(199, 29, 35, 1);
  border: 1px solid rgba(199, 29, 35, 1);
  box-shadow: 2px 2px rgba(199, 29, 35, 1);
}
</style>