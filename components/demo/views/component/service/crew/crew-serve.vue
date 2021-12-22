<template>
  <div>
    <crew-serve :idNo="idNo"></crew-serve>
  </div>
</template>

<script>
  import CrewServe from "@/../components/service/crew/crew-serve";

  export default {
    components: {CrewServe},
    name: 'demo-crew-serve',
    data () {
      return {
        idNo: '350128197510303137'
      }
    }
  }
</script>

<style scoped>

</style>
