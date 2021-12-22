<template>
  <div class="m-body">
    <crew :idNo="idNo" :encode="encode"></crew>
  </div>
</template>
<script>
  import Crew from '@/../components/service/crew/crew';

  export default {
    name: 'demo-crew',
    components: {
      Crew
    },
    data () {

      return {

        idNo: '350481198211094016',
        encode: true
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
