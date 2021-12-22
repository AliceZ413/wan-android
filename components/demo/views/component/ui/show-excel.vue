<template>
  <div>
    <show-excel :excelUrl="excelUrl" v-model="showExcel" @hideExcel="hideExcel"></show-excel>
  </div>
</template>

<script>
  import showExcel from '@/../components/ui/show-excel'

  export default {
    name: 'demo-show-excel',
    components: { showExcel },
    data () {
      return {
        excelUrl: ''
      }
    }
  }
</script>

<style scoped>

</style>
