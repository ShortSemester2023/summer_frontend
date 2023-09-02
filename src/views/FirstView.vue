<template>
  <Guide v-if="isNew"/>
  <div v-if="!hasTeam">
    <div class="container-card">
      <NewProject what="团队" @click="showCreateTeamModal = true"></NewProject>
    </div>
  </div>
  <CreateTeamModal :show="showCreateTeamModal" @close="showCreateTeamModal = false" />
</template>

<script>
import ProjectListItem from '../components/ListItem/team/ProjectListItem.vue'
import Guide from '../components/Guide/Guide.vue'
import NewProject from '../components/ListItem/team/NewProject.vue';
import CreateTeamModal from '../components/Modal/CreateTeamModal.vue';
export default {
  name: 'FirstView',
  components: { ProjectListItem, Guide, NewProject, CreateTeamModal },
  data() {
    return {
      projectData: [],
      isNew: false,
      hasTeam: false,
      showCreateTeamModal: false
    };
  },
  created() {
    this.$http.get(`/api/accounts/${this.$cookies.get('user_id')}/`).then(
      response => {
        this.isNew = response.data.is_new
        this.$http.get(`/api/teams/list_by_identity/`).then(
          response => {
            this.hasTeam = response.data.length > 0 ? true : false
            if (!this.isNew && this.hasTeam) {
              let recentTeam = null
              this.$http.get('/api/accounts/recent_team/').then(
                response => {
                  recentTeam = response.data.team_id
                  if (recentTeam) {
                    // this.$router.push(`/team/${recentTeam}/info`)
                  }
                }
              )
            }
          }
        )
      },
      error => {
        console.log(error)
      }
    )
  },

  methods: {
    jumpToProject(id, teamId) {
      // console.log('teAm: ', teamId)
      this.$cookies.set('teamId', teamId)
      this.$router.push(`/project/${id}/doc`)
      this.$bus.emit('manualSet', teamId)
    }
  },
  mounted() {
    this.$http.get(`/api/projects/search/`).then(response => {
      this.projectData = response.data.map((project) => ({
        teamId: project.teamId,
        id: project.id,
        name: project.name,
        creator: project.creator,
        team: project.team,
        image: project.image,
        latestUpdateTime: project.changedDate,
      }))
    }, error => {
      console.log(error.message);
    });
  },
}
</script>
<style scoped>
.container-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>