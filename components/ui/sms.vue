<template>
  <a class="sms-icon" :href="`sms:${mobile}`">
    <slot></slot>
  </a>
</template>

<script>
  export default {
    name: 'ui-sms',
    props: {mobile: String}
  }
</script>

<style scoped lang="scss">

</style>
