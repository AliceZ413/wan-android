<template>
  <div class="demo-call">

    <ul>
      <li>
        点击拨打：
        <phone-call :mobile="mobile">
          {{mobile}}
        </phone-call>
      </li>

      <li>
        点击icon拨打：
        <phone-call :mobile="mobile">
          <img src="@/../resource/images/demo/icon_phone-min.png" class="phone-icon"/>
        </phone-call>
      </li>
    </ul>
  </div>
</template>

<script>
  import PhoneCall from "@/../components/ui/phone-call";

  export default {
    components: {PhoneCall},
    name: 'demo-call',
    data () {
      return {
        mobile: '15600000000'
      }
    }
  }
</script>

<style scoped lang="scss">
  .demo-call{
    padding: 1rem 1.2rem;
    background-color: #fff;
    .phone-icon {
      width: 1.6rem;
      height: 1.6rem;
      vertical-align: middle;
    }
  }
  ul li {
    padding: 1rem 0;
    border-bottom: 1px solid $bdc;
  }
</style>
