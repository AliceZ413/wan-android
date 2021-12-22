<template>
  <div class="time-picker">
    <div class="choose-time">
      <div class="choose-date">
        <div>日期范围</div>
        <div style="display: flex">
          <div :class="dateIndex == 3 ? 'active' : ''" @click="getDate(3)">全部</div>
          <div :class="dateIndex == 0 ? 'active' : ''" @click="getDate(0)">今天</div>
          <div :class="dateIndex == 1 ? 'active' : ''" @click="getDate(1)">近7天</div>
          <div :class="dateIndex == 2 ? 'active' : ''" @click="getDate(2)">近30天</div>
        </div>
      </div>
      <div class="ep-data">
        <div class="date">
          <group>
            <datetime v-model="startDate" format="YYYY-MM-DD" @on-change="getDate(4)">
            </datetime>
          </group>
        </div>
        <div class="date-line">—</div>
        <div class="date">
          <group>
            <datetime v-model="endDate" format="YYYY-MM-DD" @on-change="getDate(4)">
            </datetime>
          </group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Datetime, Group} from 'vux'
  export default {
    name: 'demo-date-picker',
    props: {
      start: Number,
      end: Number
    },
    components: {Datetime, Group},
    data () {
      return {
        startDate: new Date(this.start).format('yyyy-MM-dd'),
        endDate: new Date(this.end).format('yyyy-MM-dd'),
        dateIndex: '1',//日期范围
      }
    },
    mounted () {
      // console.log(this.startDate, this.endDate );
    },
    methods: {
      getDate (value) {
        let start, end;
        switch (value.toString()) {
          case '0':
            this.dateIndex = 0;
            start = new Date().format('yyyy-MM-dd');
            end = new Date().format('yyyy-MM-dd');
            break;
          case '1':
            this.dateIndex = 1;
            start = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd');
            end = new Date().format('yyyy-MM-dd');
            break;
          case '2':
            this.dateIndex = 2;
            start = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).format('yyyy-MM-dd');
            end = new Date().format('yyyy-MM-dd');
            break;
          case '3':
            this.dateIndex = 3;
            start = '2018-06-01';
            end = new Date().format('yyyy-MM-dd');
            break;
          case '4':
            this.dateIndex = 4;
            start = this.startDate;
            end = this.endDate;
            break;
          default: break;
        }
        this.$emit('onPick', {
          startDate: `${start} 00:00:00`,
          endDate: `${end} 23:59:59`
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  .choose-time{
    background: #fff;
    width: 100%;
    padding: 1rem .8rem;
    margin-bottom: .8rem;
    box-sizing: border-box;
  }
  .choose-date{
    display: flex;
    font-size: 1.2rem;
    color: #666;
    margin-bottom: .8rem;
    align-items: center;
  }
  .choose-date>div>div{
    padding: .3rem .8rem;
    border: 1px solid $bdc;
    border-radius: .2rem;
    font-size: 1.2rem;
    margin-left: .8rem;
  }
  .choose-date div.active{
    color: $mc;
    border: 1px solid $mc;
  }
  .ep-data{
    display: flex;
    align-items: center;
  }
  .date-line{
    margin: 0 .8rem;
    color: #999;
  }
</style>

<style lang="scss">
  .ep-data .date .weui-cell_access .weui-cell__ft {
    background: #fff;
    padding: 1rem 2rem 1rem 1rem;
  }
  .ep-data .date .vux-no-group-title {
    border-radius: .5rem;
    border: 1px solid $bdc;
  }
  .date {
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    color: #333;

    .vux-no-group-title {
      margin-top: 0 !important;
    }

    .weui-cells:before,
    .weui-cells:after {
      border: none;
    }

    .vux-datetime {
      font-size: 1.2rem;
      color: #999999;
      line-height: 1;
      padding: 0;
    }

    .weui-cell_access .weui-cell__ft:after {
      width: 4px;
      height: 4px;
      // margin-top: -2px;
      // display: none;
      border-width: 0 2px 2px 0;
      right: 1rem;
    }

    .weui-cell_access .weui-cell__ft {
      background: #edf1f5;
      border-radius: .5rem;
      padding: .8rem 1.5rem .8rem 1rem;
    }
  }
</style>

