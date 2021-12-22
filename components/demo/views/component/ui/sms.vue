<template>
  <div class="demo-call">

    <ul>
      <li>
        点击icon发送短信：
        <sms :mobile="mobile">
          <slot>
            <img src="@/../resource/images/demo/sms-min.png" class="sms-icon"/>
          </slot>
        </sms>
      </li>
    </ul>
  </div>
</template>

<script>
  import sms from "@/../components/ui/sms";

  export default {
    components: {sms},
    name: 'demo-sms',
    data () {
      return {
        mobile: '15600000000'
      }
    }
  }
</script>

<style scoped lang="scss">
  .sms-icon {
    width: 1.6rem;
    height: 1.6rem;
    vertical-align: middle;
  }
  ul li {
    padding: 1rem 0;
    border-bottom: 1px solid $bdc;
    background-color: #fff;
  }
</style>
