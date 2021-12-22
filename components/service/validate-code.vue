<template>
  <button class="validate-code-btn" :disabled="verCodeBtnDisable"  @click="getVerCode" >{{verCodeBtn}}</button>
</template>

<script>
  import {api_checkCode} from '@/../resource/api/common'
  import { api_sendCodeV2 } from '@/../resource/api/support'
  export default {
    name: "validateCode",
    props: {
      phone: String,
      imgCode: String,
      imgCodeGuid: String,
      appId: String
    },
    data(){
      return {
        verCodeBtn: '获取验证码',
        verCodeBtnDisable: false,
        waitingTime: 60,
      }
    },
    computed: {

    },
    methods:{
      //获取验证码
      getVerCode: function () {
        let imgCode = this.imgCode;
        let imgCodeGuid = this.imgCodeGuid;
        let $this = this;
        if (!$util.isPhone($this.phone)) {
          $this.$vux.toast.text('请填写正确的手机号码');
          return false;
        }
        if( !imgCode || !imgCodeGuid ) {
          $this.$vux.toast.text('请填写图形验证码');
          return false;
        }
        $this.getCode(imgCode, imgCodeGuid);
      },
      getCode: function (imgCode, imgCodeGuid) {
        let $this = this;

        let data = {
          mobile: $this.phone,
          appId: this.appId,
          imgCode,
          imgCodeGuid
        }
        api_sendCodeV2(data).then(function(result){
          let res = result.data;
          if($util.OK(res.code)){
            $this.$vux.toast.text('发送成功');
            $this.waitingTimer();
          } else {
            $this.$vux.toast.text(res.entity);
          }
          $this.$emit('onSend', res);
        }).catch(function(error){
          $this.$vux.loading.hide();
          throw error;
        });
      },
      waitingTimer: function (reset) {
        let $this = this;
        let timer = null;

        var resetter = function () {
          clearTimeout(timer);
          timer = null;
          $this.waitingTime = 60;
          $this.verCodeBtnDisable = false;
          $this.verCodeBtn = '获取验证码';
        }

        if(reset) {
          resetter();
          return;
        }
        timer = setTimeout(function(){
          let waitingTime = $this.waitingTime;

          waitingTime--;

          if( waitingTime > 0){
            $this.waitingTime = waitingTime;
            $this.verCodeBtnDisable = true;
            $this.verCodeBtn = waitingTime + '秒后获取';
            $this.waitingTimer();
          }else{
            resetter();
          }

        }, 1000);
      },

      checkVerCode(verCode) {
        const vercodeReg = /^[0-9]{4,4}$/
        if (vercodeReg.test(verCode)) {
          return true
        } else {
          return ;
        }
      },
      // 校验验证码
      submitVerCode: function (setting) {
        /*
          setting.data
          setting.data.mobile
          setting.data.code
          setting.success
          setting.fail
        */
        let $this = this;
        if (setting.data.code) {
          $this.$vux.loading.show({text: '请稍候'});
          api_checkCode(setting.data).then(function(result){
            $this.$vux.loading.hide();
            setting.success(result);
          }).catch(function(error){
            $this.$vux.loading.hide();
            if (setting.fail) {
              setting.fail();
            } else {
              $this.$vux.toast.text(error);
            }
          });
        } else {
          $this.$vux.toast.text('请输入验证码')
          setting.fail();
        }
      }
    }
  }
</script>

<style scoped>
  .validate-code-btn {
    width: 10.5rem;
    background-color: #f4f7ff;
    border: 1px solid #99c1ff;
    border-radius: .4rem;
    color: #2a4edf;
    font-size: 1.5rem;
    padding: .9rem 1.2rem;
    margin-bottom: 1.4rem;
    height: 5.5125rem;
    box-sizing: border-box;
  }
</style>
