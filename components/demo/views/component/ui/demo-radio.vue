<template>
  <div>
    <div class="radio-box">
      <div>单选组件</div>
      <div>
        <radio value="1" name="group-1" @change="checkedBox" checked>选项1</radio>
        <radio value="2" name="group-1" @change="checkedBox">选项2</radio>
      </div>
    </div>
    <div class="radio-box">
      <div>单选组件</div>
      <div>
        <radio value="1" name="group-2" @change="checkedBox" checked size="2">选项1</radio>
        <radio value="2" name="group-2" @change="checkedBox" size="3">选项2</radio>
        <radio value="3" name="group-2" @change="checkedBox" size="3.5">选项3</radio>
      </div>
    </div>
    <div class="radio-box">
      <div>单选组件</div>
      <div>
        <ul>
          <li>
            <radio value="1" name="group-3" @change="check3" checked size="2">
              <div class="margin-left">选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1</div>
            </radio>
          </li>
          <li>
            <radio value="2" name="group-3" @change="check3" size="2">
              <div class="margin-left">选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2</div>
            </radio>
          </li>
          <li>
            <radio value="3" name="group-3" @change="check3" size="2" :disabled="true">
              <div class="margin-left">禁用选项</div>
            </radio>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
  import Radio from "@/../components/ui/radio";

  export default {
    components: {Radio},
    name: 'demo-radio',
    methods: {
      checkedBox (value, e) {
        console.log('change');
        console.log(value);
      },
      check3 (value, e) {
        console.log(value);
      }
    }
  }
</script>

<style scoped lang="scss">
  .radio-box {
    background-color: #fff;
    padding: 1rem 1.2rem;
  }
  .margin-left {
    margin-left: 2.5rem;
  }
</style>
