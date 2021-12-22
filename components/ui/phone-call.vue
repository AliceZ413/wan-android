<template>
  <a :href="`tel:${mobile}`" class="link-style">
    <slot></slot>
  </a>
</template>

<script>
  export default {
    name: 'ui-phone-call',
    props: {
      mobile: String
    }
  }
</script>

<style scoped lang="scss">
  .link-style {
    color: $mc;
  }
</style>
