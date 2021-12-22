<template>
  <label class="radio-label">
    <input
      type="radio"
      :value="value"
      class="m-radio"
      :name="name"
      :checked="checked"
      @change="change"
      :id="id"
      :disabled="disabled"
      :style="(size ? `width: ${size}rem;height: ${size}rem;`: '')"/>
    <span :style="`line-height: ${size}rem;`">
      <slot></slot>
    </span>
  </label>
</template>

<script>
  export default {
    name: 'ui-radio',
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
  .radio-label {
    vertical-align: middle;
    overflow: hidden;
    display: inline-block;
  }
  .m-radio {
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
    }
    &:checked {border: none;}
    &:disabled {
      filter: grayscale(1);
    }
  }
</style>
