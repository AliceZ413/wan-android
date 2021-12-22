<template>
  <label class="checkbox-label">
    <input
      :id="id"
      type="checkbox"
      :value="value"
      class="m-checkbox"
      :name="name"
      :checked="checked"
      @change="change"
      :disabled="disabled"
      :style="(size ? `width: ${size}rem;height: ${size}rem;`: '')"/>
    <span :style="`line-height: ${size}rem;`">
      <slot></slot>
    </span>
  </label>
</template>

<script>
  export default {
    name: 'checkbox',
    props: {
      name: String,
      value: String,
      checked: Boolean,
      id: String,
      disabled: Boolean,
      size: {
        type: String,
        default: '2'
      }
    },
    methods: {
      change (e) {
        this.$emit('change', e.target.value, e)
      }
    }
  }
</script>

<style scoped lang="scss">
  .checkbox-label {
    vertical-align: middle;
    overflow: hidden;
    display: inline-block;
  }
  .m-checkbox {
    width: 2rem;
    height: 2rem;
    border: 1px solid #ccc;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: .4rem;
    float: left;
    display: block;
    &:checked, &:disabled {
      background-image: url('~@/../resource/images/checkbox/checked-true.svg');
      background-size: 100%;
      background-repeat: no-repeat;
      border: none;
    }
    &:disabled {
      filter: alpha(.5);
    }
  }
</style>
