<template>
  <div>
    <crew-cert :idNo="idNo"></crew-cert>
  </div>
</template>

<script>
  import CrewCert from "@/../components/service/crew/crew-cert";

  export default {
    components: {CrewCert},
    name: 'demo-crew-cert',
    data () {
      return {
        idNo: '350481198211094016'
      }
    }
  }
</script>

<style scoped>

</style>
