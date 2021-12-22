<template>
  <div>
    <crew-basic :id-no="idNo"></crew-basic>
    <p>身份证不加隐匿</p>
    <crew-basic :id-no="idNo" :encode="false"></crew-basic>
  </div>
</template>

<script>
  import CrewBasic from "@/../components/service/crew/crew-basic";

  export default {
    components: { CrewBasic },
    name: 'demo-crew-basic',
    data () {
      return {
        idNo: '350481198211094016'
      }
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>
