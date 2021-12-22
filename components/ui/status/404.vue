<template>
    <div>
      <div class="container">
        <img src="@/../resource/images/404.svg"/>
      </div>
      <p class="label-404">404</p>
    </div>
</template>

<script>
    export default {
        name: 'ui-page404'
    }
</script>

<style scoped lang="scss">
  .container{
    border-top: 1px solid transparent;
    img{
      display: block;
      width: 16rem;
      height: 16rem;
      margin: 5rem auto 0;
    }
  }

  .label-404{
    line-height: 4rem;
    font-size: 4rem;
    text-align: center;
    color: #8a8a8a;
  }
</style>
