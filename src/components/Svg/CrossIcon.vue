<template>
  <svg t="1692946670617" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7675" :width="size" :height="size"><path d="M512.201 448.08L885.643 74.638c42.426-42.426 106.066 21.214 63.64 63.64L575.84 511.719l374.353 374.353c42.426 42.427-21.213 106.066-63.64 63.64L512.201 575.359 137.848 949.712c-42.426 42.426-106.066-21.213-63.64-63.64L448.563 511.72 75.12 138.278c-42.427-42.426 21.213-106.066 63.64-63.64L512.2 448.08z" p-id="7676" fill="#707070"></path></svg>
</template>

<script>
export default {
  name: 'CrossIcon',
  props: {
    size: {
      type: String,
      default: '30px'
    }
  }
  
}
</script>
<style scoped>
.icon {
  display: inline-block;
  cursor: pointer;
}
</style>