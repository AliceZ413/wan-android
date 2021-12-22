<template>
  <div>
    <div class="checkbox-box">
      <div>多选组件</div>
      <div>
        <checkbox value="1" name="group-1" @change="checkedBox" checked>选项1</checkbox>
        <checkbox value="2" name="group-1" @change="checkedBox">选项2</checkbox>
      </div>
    </div>
    <div class="checkbox-box">
      <div>多选组件</div>
      <div>
        <checkbox value="1" name="group-2" @change="checkedBox" checked size="2">选项1</checkbox>
        <checkbox value="2" name="group-2" @change="checkedBox" size="3">选项2</checkbox>
        <checkbox value="3" name="group-2" @change="checkedBox" size="3.5">选项3</checkbox>
      </div>
    </div>
    <div class="checkbox-box">
      <div>多选组件</div>
      <div>
        <ul>
          <li>
            <checkbox value="1" name="group-3" @change="check3" checked size="2">
              <div class="margin-left">选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1</div>
            </checkbox>
          </li>
          <li>
            <checkbox value="2" name="group-3" @change="check3" size="2">
              <div class="margin-left">选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2选项2</div>
            </checkbox>
          </li>
          <li>
            <checkbox value="3" name="group-3" @change="check3" size="2">
              <div class="margin-left">选项3选项3选项3选项3选项3选项3选项3选项3选项3选项3选项3选项3选项3选项3选项3选项3选项3选项3选项3选项3选项3</div>
            </checkbox>
          </li>
        </ul>
      </div>
    </div>

    <div class="checkbox-box">
      <div>多选组件</div>
      <div>
        <ul class="ul-list">
          <li>
            <checkbox value="1" name="group-3" @change="check3" checked size="2" class="list-box" :id="`val-1`"></checkbox>
            <label for="val-1">选项1</label>
          </li>
          <li>
            <checkbox value="2" name="group-3" @change="check3" size="2" class="list-box" :id="`val-2`"></checkbox>
            <label for="val-2">选项2</label>
          </li>
          <li>
            <checkbox value="3" name="group-3" @change="check3" size="2" class="list-box" :id="`val-3`" :disabled="true"></checkbox>
            <label for="val-3">禁用选项</label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import checkbox from "@/../components/ui/checkbox";

  export default {
    components: {checkbox},
    name: 'demo-checkbox',
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
  .checkbox-box {
    background-color: #fff;
    padding: 1rem 1.2rem;
  }
  .margin-left {
    margin-left: 2.5rem;
  }
  .ul-list {
    li {
      line-height: 4rem;
      height: 4rem;
      overflow: hidden;
      >label {
        display: block;
      }
    }
  }
  .list-box {
    float: right;
    margin-top: 1rem;
  }
</style>
