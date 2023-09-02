<template>
	<ul>
		<li v-if="!($route.path.indexOf('preview') !== -1)" @click="backToProject">返回</li>
		<li 
			v-for="page in pages" 
			:key="page.id"
			@click="select(page.id)"
			:class="{ 'is-selected': page.id === parseInt($route.params.protoId) }" 
		>
			{{ page.name }}
		</li>
	</ul>
</template>

<script>
export default {
  data() {
    return {
			projectId: '',
			pages: [],
    }
  },
	mounted() {
		this.projectId = this.$route.params.projectId
		this.$http.get(`/api/projects/page/${this.projectId}/list/`).then((response) => {
			this.pages = response.data
		})
	},
	methods: {
		select(id) {
			if(this.$route.path.indexOf('preview') !== -1) {
				this.$router.replace(`/preview/projects/${this.projectId}/page/${id}`)
			}
			else {
				this.$router.replace(`/projects/${this.projectId}/page/${id}`)
			}
		},
		backToProject() {
			
			this.$router.push(`/project/${this.projectId}/page`)
		}
	}
}
</script>
<style scoped>
ul {
	max-width: 100%;
	overflow-x: hidden;
	padding: 5px;
}
li {
	display: inline-block;
	font-size: 18px;
	border-radius: 5px;
	padding: 5px 10px;
	margin-right: 10px;
	box-shadow: 1px 1px 5px grey;
	color: rgba(199,29,35, 1);
	cursor: pointer;
	transition: .3s cubic-bezier(0.075, 0.82, 0.165, 1);
}
li.is-selected {
	color: white;
	font-weight: bold;
	background: rgba(199,29,35, 1);
}

</style>