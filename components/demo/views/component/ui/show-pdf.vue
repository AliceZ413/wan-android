<template>
  <div class="pdf-view">
    <div @click="showPdfView">点击查看PDF</div>

    <show-pdf class="pdf-style" v-if="showPDF" :url="pdfUrl" @hidePDF="hidePDF"></show-pdf>

  </div>
</template>

<script>

  import showPdf from '@/../components/ui/show-pdf';

  export default {
    name: 'demo-pdf',
    components: { showPdf },
    data () {
      return {
        showPDF: false,
        pdfUrl: ''
      }
    },
    methods: {
      showPdfView () {
        this.showPDF = true;
        this.pdfUrl = 'https://wx.gd.msa.gov.cn/msa-checkin-debug/file/get?guid=5Mdktkk4g9UNYZJUgF4RU3';
      },
      hidePDF () {
        this.showPDF = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  .pdf-view {
    padding: 1rem 1.2rem;
    background-color: #fff;
  }
</style>
