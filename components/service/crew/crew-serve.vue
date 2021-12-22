<template>
  <div class="crew-serve__comp">
    <div class="serve-contain">
      <table class="serve-table">
        <thead>
        <tr>
          <th>岗位</th>
          <th>船舶名称</th>
          <th>任职时段</th>
          <th>服务天数</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, key) in detailList">
          <td>{{item.positionName}}</td>
          <td>{{item.shipName}}</td>
          <td>
            <div class="td-date">{{item.serveDate}}</div>
            <div class="td-date">~</div>
            <div class="td-date">{{item.dismissTime}}</div>
          </td>
          <td>
            <span v-if="item.serveDay.workYear">{{item.serveDay.workYear}}年</span>
            <span v-if="item.serveDay.workMonth">{{item.serveDay.workMonth}}个月</span>
            <span v-if="(!item.serveDay.workYear && !item.serveDay.workMonth) || (item.serveDay.workYear || item.serveDay.workMonth)">{{item.serveDay.workDay}}天</span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="m-no-record" v-show="!detailList.length">
      <span v-show="!serveData.loading">未查询到任职记录</span>
      <span v-show="serveData.loading">查询中...</span>
    </div>
  </div>
</template>

<script>
  import { api_getHistoryDismiss } from '@/../resource/api/core'

  export default {
    name: 'service-crew-serve',
    props: { idNo: String },
    data () {
      return {
        detailList: {},
        serveData: {
          loading: false
        }
      }
    },
    watch: {
      idNo (value) {
        this.idNo = value;
        this.getServeHistory(value);
      }
    },
    mounted () {
      this.getServeHistory(this.idNo);
    },
    methods: {
      getServeHistory: function (idNo) {
        let $this = this;
        $this.serveData.loading = true;

        api_getHistoryDismiss({guid: idNo}).then(function (response) {
          $this.serveData.loading = false;
          $this.$vux.loading.hide();
          let data = response.data;
          if ($util.OK(data.code)) {
            let history = data.list, serveList = [];

            for (let i = 0; i < history.length; i++) {
              let item = history[i];
              let serveItem = {};
              serveItem.serveDate = new Date(parseInt(item.servingTime)).format('yyyy年MM月dd日');

              serveItem.dismissTime = (function () {
                let dismissTime = parseInt(item.dismissTime);

                if (dismissTime < 0 && item.servingDismissMark == '0') {
                  //未解职
                  return '至今';
                }
                return new Date(dismissTime).format('yyyy年MM月dd日');
              })();

              serveItem.positionName = item.positionName || '';
              serveItem.shipName = item.shipName;
              serveItem.servingDismissMark = item.servingDismissMark;

              serveItem.serveDay = $this.getServeDay(item.servingTime, item.dismissTime)

              if (item.servingDismissMark == '0' && !$this.serveTimeData) {
                //获取当前任职信息
                $this.serveTimeData = item;
              }
              serveList.push(serveItem);
            }

            $this.detailList = serveList;

          } else {
            $this.$vux.toast.text(data.msg);
          }
        })
      },
      getServeDay(servingTime, dismissTime) {
        let toTime = parseInt(dismissTime),
          fromTime = parseInt(servingTime);

        if (toTime < 0) {
          //未解职
          toTime = new Date().getTime();
        }
        toTime += 24 * 60 * 60 * 1000;

        let toDate = new Date(toTime);
        let to_year = toDate.getFullYear(),
          to_month = toDate.getMonth() + 1,
          to_day = toDate.getDate();

        let fromDate = new Date(fromTime),
          from_year = fromDate.getFullYear(),
          from_month = fromDate.getMonth() + 1,
          from_day = fromDate.getDate();


        let workDay = to_day - from_day;
        let workYear = to_year - from_year;
        let reduse = false;

        if (workDay < 0) {
          //上个月是何年何月
          let lastMonth = to_month - 1;
          if (lastMonth == 0) {
            --to_year;
            reduse = true;
            to_month = lastMonth = 12;
          }
          //获取上个月有多少天
          let tempDate = $util.getMonthEnd(to_year, lastMonth);
          workDay = tempDate + to_day - from_day;
          if(!reduse) {
            //已跨年相减
            --to_month;
          }
        }

        let workMonth = to_month - from_month;
        if (workMonth < 0) {
          let lastYear = to_year - 1;
          --to_year;
          workMonth = to_month + 12 - from_month;
        }

        workYear = to_year - from_year;

        return {
          workYear: workYear,
          workMonth: workMonth,
          workDay: workDay
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .crew-serve__comp{
    background-color: #fff;
    .serve-table{
      width: 100%;
      th, td{
        padding: .7rem 0;
        text-align: center;
        width: 25%;
      }
      th{
        font-weight: normal;
        color: #888;
      }
      td{
        background-color: #f7f7f7;
        border-bottom: 1px solid $bdc;
      }
      .td-date{
        white-space: nowrap;
        line-height: 1;
      }
    }
  }

  .m-no-record{
    color: $fc-6;
    padding: 1.5rem;
    background-color: #f7f7f7;
  }
</style>
