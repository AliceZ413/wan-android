<template>
  <div>
    <group :title="'签名板'">
      <cell
        :title="'去签名'"
        is-link
        :border-intent="false"
        :arrow-direction="'right'"
        @click.native="openSignBoard"></cell>

    </group>

    <img v-if="signatureGuid" :src="url" class="img-show"/>
    <!--签名板-->
    <signature v-model="showBoard" ref="signatureBoard" @onConfirm="confirmSignature"></signature>
  </div>
</template>

<script>
  import signature from '@/../components/ui/signature'
  import { api_save_file } from '@/../resource/api/common'
  import { Cell, Group } from 'vux'

  export default {
    name: 'demo-signature',
    components: {
      Cell,
      Group,
      signature
    },
    data () {
      return {
        showBoard: false,
        signatureGuid: '',
        url: ''
      }
    },
    watch: {
      signatureGuid (guid) {
        this.url = `${$util.staticAccess}${guid}`
      }
    },
    methods: {
      openSignBoard () {
        this.showBoard = true;
        //使用以下方法也可以
        // this.$refs.signatureBoard.showSignBoard();
      },
      async confirmSignature (dataUrl) {
        console.log(dataUrl);
        let $this = this;
        let formData = new FormData();
        const YOUR_DIRECTOR = 'TEST_DIRECTOR';

        // this.$vux.loading.show();

        // let file = await $util.compressToBlob(dataUrl);

        // formData.append('catalog', YOUR_DIRECTOR);
        // formData.append('file', file);
        //
        // this.signatureGuid = await api_save_file(formData)
        //   .then(({ data }) => {
        //     $this.$vux.loading.hide();
        //     if (data.success) {
        //       return data.item;
        //     } else {
        //       throw {
        //         message: data.message
        //       };
        //     }
        //   }).catch(e => {
        //     $this.$vux.toast.text('文件上传异常，请重试');
        //   });
        //
        this.showBoard = false;
        //使用以下方法也可以关闭签名板
        //this.$refs.signatureBoard.hideBoard();
      }
    }
  }
</script>

<style scoped lang="scss">
 .img-show {
   width: 20rem;
   height: 13rem;
 }
</style>
