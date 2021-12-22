<template>
  <div>
    <div class="form-item">
      <p>手机号</p>
      <div>
        <input class="input-line" v-model="phone" placeholder="请填写手机号"/>
      </div>
    </div>
    <div class="form-item">
      <p>验证码</p>
      <div class="flex-box">
        <input class="input-line" v-model="phoneCode" placeholder="请输入验证码" @input="submit"/>
        <validate-code :phone="phone" class="my-code" ref="validate"></validate-code>
      </div>
    </div>

  </div>
</template>

<script>
  import validateCode from '@/../components/service/validate-code'

  export default {
    name: 'demo-validate-code',
    components: {
      validateCode
    },
    data () {
      return {
        phone: '',
        phoneCode: ''
      }
    },
    methods: {
      submit () {
        if(this.phoneCode.length < 4) return ;
        let $this = this;
        $this.$refs.validate.submitVerCode({
          data: {
            mobile: $this.phone,
            code: $this.phoneCode
          },
          success: function (res) {
            console.log(res);
            $this.$vux.confirm.show({
              title: '返回值',
              content: res.data.message,
              showCancelButton: false,
              onConfirm (res) {

              }
            });
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .form-item {
    background-color: #fff;
    padding: 1rem 1.2rem 1rem 1.2rem;
    input{
      border:none;
      border-bottom: .5px solid $bdc;
      padding: .5rem 0 .5rem 0;
      display: block;
      width: 100%;
    }
    .flex-box {
      display: flex;
      input{
        flex: 1;
      }
    }
  }
  button.my-code {
    padding: 0;
    margin: 0;
    height: 4.4rem;
    line-height: 4.4rem;
  }
</style>
