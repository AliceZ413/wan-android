<template>
  <div class="">
    <crew-on-ship :ship-id="shipId" :ship-name="shipName"></crew-on-ship>
  </div>
</template>

<script>
  import CrewOnShip from "@/../components/service/ship/crewOnShip";

  export default {
    components: {CrewOnShip},
    name: 'demo-ship-crew',
    data () {
      return {
        shipId: 'CN20169339823',
        shipName: '东桂16'
      }
    }
  }
</script>

<style scoped>

</style>
