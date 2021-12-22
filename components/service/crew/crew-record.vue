<template>
  <div class="crew-record_page">
    <div class="tabs">
      <div class="service-qualifications">登记资历 ({{serveRanges.totalServeRecord || 0}})</div>
      <div class="verification-record">配员核查 ({{serveRanges.totalCheckinRecord || 0}})</div>
    </div>
    <div>

      <!--<div v-if="isCrewQuestion && isCrewQuestion.count >= 2" class="warning-section">-->
      <!--<img :src="infoImg" />-->
      <!--该船员1个月内存在频繁换船的情况-->
      <!--</div>-->
    </div>
    <div class="sev-main" v-show="!loading">

      <div class="service-box" v-for="(item, index) in serveRanges" :key="index">
        <div class="service-list" >
          <div class="dismissTime" :class="item.isVirtual ? '' : 'serve-item'">
            <div class="left-box">
              <div class="dismissTimeText" v-for="(serve, key) in item.serveRecord" :key="key" v-if="!item.isVirtual">
                <div>{{serve.shipName}}</div>
                <div>{{serve.positionName}}</div>
                <div>{{serve.servingTimeTxt}}</div>
                <div>~{{serve.dismissTimeTxt}}</div>
                <div>{{serve.servingDayTxt}}</div>
              </div>
            </div>
            <div class="right-box">
              <div
                class="contain_record-list"
                :class="taskCheckGuid === record.itemGuid ? 'active' : ''"
                v-for="(record, j) in item.checkinRecord"
                :key="j"
                @click="handleRouterToCheckDetail(record)">
                <div class="time">
                  {{record.createdAt}}
                </div>
                <div class="position-info">
                  <span :class="record.isShipNameMatch ? '' : 'red_text'">{{record.shipName}}</span>
                  <span :class="record.isPositionMatch ? '' : 'red_text'">{{record.positionName}}</span>
                </div>
                <template v-if="!item.isVirtual">
                  <div class="checkRemark-btn" v-if="!record.isShipNameMatch">
                    <img src="@/../resource/images/danger_icon.png" alt="danger_icon">
                    船名与资历不匹配
                  </div>
                  <div class="checkRemark-btn" v-if="!record.isPositionMatch">
                    <img src="@/../resource/images/danger_icon.png" alt="danger_icon">
                    岗位核查不通过
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="no-seniorityExpe" v-show="!serveRanges.totalServeRecord">无相关资历记录</div>
      <div class="intermediate-border" v-show="!serveRanges.totalServeRecord && !serveRanges.totalCheckinRecord"></div>
      <div class="no-taskItemCheck" v-show="!serveRanges.totalCheckinRecord">无核查记录</div>

      <div class="lastSmallDots" :style="{display: seniorityExpeData.list.length !== 0 && 'block'}"></div>
    </div>
    <div class="loading-bar" v-show="loading">
      加载中...
    </div>
  </div>
</template>

<script>

  import { api_getTaskCheckAndExpe } from "@/../resource/api/mediator";

  let infoImg = require('@/../resource/images/icon_yellow-min.png');

  export default {
    name: "crew-record",
    props: {
      idx: {
        type: String,
        default: ''
      },
      //配员核查记录的guid 标记当前核查记录的浏览节点
      guid: {
        type: String,
        default: ''
      }
    },
    data() {
      let serveRanges = this.createServeRange();

      return {
        seniorityExpeData: {
          list: [],
          total: 0,
        },
        taskItemCheckData: {
          total: 0
        },
        infoImg,
        taskCheckGuid: '',
        loading: false,
        isCrewQuestion: null,
        serveRanges
      }
    },
    mounted () {
      //通过此ID标记目前在查看哪条核查记录
      this.taskCheckGuid = this.$route.query.guid;

      this.getTaskCheckAndExpe()
    },
    methods: {
      handleRouterToCheckDetail(record) {

        const { itemGuid } = record;

        window.location.href = (`${$util.SERVER}/checkin/?v=${new Date().getTime()}#/ship-checkin/crew-detail?guid=${itemGuid}`)
      },
      // 获取船员检查记录
      getTaskCheckAndExpe () {
        this.loading = true;
        api_getTaskCheckAndExpe({guid: this.idx}).then(res => {
          const {code, item} = res.data;
          if ($util.OK(code))  {
            this.duleServeList(item.result);
          } else {
            this.$vux.toast.text(res.data.msg);
          }
        }).catch(err => {
          throw err
        }).finally(() => {
          this.loading = false;
        })
      },
      duleServeList (serveList) {
        /**
         * seniorityExpe 登记资历
         * taskItemCheck 配员核查
         * isCrewQuestion 船员存疑 多次打卡
         */
        let {seniorityExpe, taskItemCheck, isCrewQuestion} = serveList;
        // this.isCrewQuestion = isCrewQuestion;

        let serveRanges = [];

        seniorityExpe.forEach(item => {
          //重新初始化服务资历
          let exp = this.getServeRecord(item);

          let isCover = false;
          //判断该服务资历是否在初始化的服务资历列表中
          serveRanges = serveRanges.map(range => {
            let coverResult = this.isServeCover(range, exp);
            //服务资历是否存在覆盖，如果存在，则合并
            if(coverResult.isCover) {
              isCover = true;
              range.servingTime = coverResult.servingTime;
              range.dismissTime = coverResult.dismissTime;
              range.serveRecord.push(exp);
            }
            return range;
          });

          if(!isCover) {
            //服务资历新增一段
            let positionName = exp.positionName ? exp.positionName.trim() : '';
            let range = this.createServeRange();
            range.servingTime = exp.servingTime;
            range.dismissTime = exp.dismissTime;
            range.serveShipName = exp.shipName;
            range.servePositions.push(positionName);
            range.serveRecord.push(exp);
            serveRanges.push(range);
          }
        });

        taskItemCheck.forEach(record => {
          record.createdAt = this.getDate(record.createdAt, 2);
          let isInServeList = false;
          //判断核查记录是否存在于某一段服务资历内
          serveRanges = serveRanges.map(range => {
            //真实的服务资历才需要进行船舶、岗位比对
            if(record.createdAt >= range.servingTime && record.createdAt <= range.dismissTime) {
              if(!range.isVirtual) {
                //判定服务资历的任职岗位与配员核查的船舶是否相同
                range.serveRecord.forEach(serve => {
                  if(record.createdAt >= serve.servingTime && record.createdAt <= serve.dismissTime) {
                    record.isPositionMatch = (function () {
                      //添加对GMDSS职务的比对处理
                      if(serve.positionName.toUpperCase().indexOf('GMDSS') >= 0 && record.positionName.indexOf('GMDSS') >= 0) {
                        return true;
                      }
                      return record.isPositionMatch || (serve.positionName.indexOf(record.positionName) >= 0)
                    })();
                    //判定服务资历的任职船舶与配员核查的船舶是否相同，只要在任意一艘船匹配上船名，都算匹配成功
                    record.isShipNameMatch = record.isShipNameMatch || (serve.shipName == record.shipName);
                  }
                });
                range.checkinRecord.push(record);
                isInServeList = true;
              }
            }
            return range;
          });
          //如果核查记录不存在于某一段服务资历内，则为该核查记录创建一段虚拟的服务资历
          if(!isInServeList) {
            let range = this.createServeRange();
            range.servingTime = record.createdAt;
            range.dismissTime = record.createdAt;

            range.isVirtual = true;
            record.isPositionMatch = true;
            record.isShipNameMatch = true;
            range.checkinRecord.push(record);
            serveRanges.push(range);
          }
        });
        //排序
        serveRanges = serveRanges.sort((a, b) => a.dismissTime > b.dismissTime ? -1 : 1 );
        serveRanges = serveRanges.map(range => {
          range.serveRecord = range.serveRecord.sort((a,b) => a.dismissTime > b.dismissTime ? -1 : 1);
          return range;
        });
        serveRanges.totalCheckinRecord = taskItemCheck.length;
        serveRanges.totalServeRecord = seniorityExpe.length;

        this.serveRanges = serveRanges;

        console.log(serveRanges);
      },
      isServeCover (serve1, serve2) {
        //判断两段服务资历之间是否出现重叠，并返回两段重叠资历合并后的任职时间和解职时间
        let result = { isCover: false };
        let condition1 = serve2.servingTime >= serve1.servingTime && serve2.servingTime <= serve1.dismissTime,
          conditioin2 = serve2.dismissTime >= serve1.servingTime && serve2.dismissTime <= serve1.dismissTime;
        if( condition1 || conditioin2 ) {
          result.isCover = true;
          if(condition1) {
            result.servingTime = serve1.servingTime;
            if(serve2.dismissTime > serve1.dismissTime) {
              result.dismissTime = serve1.dismissTime;
            } else {
              result.dismissTime = serve2.dismissTime;
            }
          }
          if(conditioin2) {
            result.dismissTime = serve1.dismissTime;
            if(serve2.servingTime > serve1.servingTime) {
              result.servingTime = serve1.servingTime;
            } else {
              result.servingTime = serve2.servingTime;
            }
          }
        }
        return result;
      },
      createServeRange () {
        /**
         * 一段服务资历对应若干核查记录，这段服务资历包含一个任职时间和解职时间
         * 该段服务资历里面可能含有兼职职务，两段资历重叠
         * 重叠资历的解职时间可能不一样，以最后一个解职的时间点，标记在时间轴上
         * */

        return {
          servingTime: '',
          dismissTime: '',
          isVirtual: false,
          serveShipName: '',//任职船舶
          servePositions: [],//任职岗位
          serveRecord: [],
          checkinRecord: []
        }
      },
      getServeRecord (record) {
        /**
         * 服务资历格式化
         * */
        record = Object.assign({
          crewName: '',
          dismissTime: '',//解职时间
          dismissTimeTxt: '',
          guid: null,
          positionName: '',
          servingDayCount: 0,
          servingDayTxt: '',//任职了多长时间，按照月份计算
          servingDismissMark: null,
          servingTime: '',//任职时间
          servingTimeTxt: '',
          shipId: '',
          shipName: ''
        }, record);

        if(record.servingDismissMark == '0' && record.dismissTime.indexOf('1900') >= 0) {
          //未解职
          record.dismissTimeTxt = '至今';
          record.dismissTime = new Date().format('yyyy-MM-dd hh:mm:ss');
        } else {
          record.dismissTimeTxt = this.getDate(record.dismissTime, 2);
        }
        record.servingTimeTxt = this.getDate(record.servingTime, 2);
        let serveInfo = this.getServeDay(record.servingTime, record.dismissTime);
        let serveYearTxt = serveInfo.workYear > 0 ? serveInfo.workYear + '年' : '',
          serveMonthTxt = serveInfo.workMonth > 0 ? serveInfo.workMonth + '个月' : '',
          serveDayTxt = serveInfo.workDay > 0 ? serveInfo.workDay + '天' : '';

        record.servingDayTxt = `${serveYearTxt}${serveMonthTxt}${serveDayTxt}`;

        return record;
      },
      getDate (date, type) {
        if(!date) return '';
        date = new Date(date.replace(/-/g, '/'));
        return type === 1 ? date.getTime() : (type === 2 ? date.format('yyyy-MM-dd') : '');
      },
      // 计算任职时间
      getServeDay(servingTime, dismissTime) {
        let toTime = this.getDate(dismissTime, 1),
          fromTime = this.getDate(servingTime, 1);

        if (toTime - fromTime < 0) {
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
  };
</script>

<style scoped lang="scss">
  * {box-sizing: border-box}
  .red_text {color: #DD2121;}
  .no-seniorityExpe, .no-taskItemCheck, .intermediate-border {
    background-color: #fff;
    color: #101010;
    position: absolute;
    top: 0;
  }
  .no-seniorityExpe {
    width: 50%;
    left: 0;
    line-height: 4.4rem;
    text-align: center;
  }
  .no-taskItemCheck {
    right: 0;
    width: 50%;
    line-height: 4.4rem;
    text-align: center;

  }
  .intermediate-border {
    width: .1rem;
    height: 2rem;
    margin-top: 1.2rem;
    background-color: #bbb;
    left: 50%;
    z-index: 10;
  }
  .crew-record_page {
    background-color: #fff;
    position: relative;
    .no-Data-showText {
      position: absolute;
      top: 6.2rem;
      .no-seniorityExpe, .no-taskItemCheck, .intermediate-border {
        color: #101010;
        position: absolute;
        top: 0;
        padding: 3rem 2rem;
        width: 50%;
        left: 0;
      }

    }
    .tabs {
      padding: 1rem 2rem;
      border-bottom: 0.09rem solid #ddd;
      display: flex;
      .service-qualifications, .verification-record {
        flex: 1;
        font-weight: bold;
        text-align: center;
      }
      .verification-record {
        padding-left: 1rem;
      }
    }
    .sev-main {
      position: relative;
      padding-bottom: 2rem;
      .service-box {
        position: relative;

        &:before {
          content: ' ';
          position: absolute;
          width: 0;
          height: 100%;
          top: 0;
          bottom: 0;
          left: 50%;
          right: 50%;
          border-left: 1px dashed #F4A536;
          z-index: 1;
        }
        &:last-child::after {
          position: absolute;
          width: .91rem;
          height: .91rem;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          background-color: #BBB;
        }
        .hidden_border {
          position: absolute;
          left: 50%;
          top: 0;
          width: 1rem;
          height: 2rem;
          z-index: 1;
          background-color: #fff;
          transform: translateX(-50%);
        }
        .service-list {
          position: relative;
          .dismissTime {
            position: relative;
            overflow: hidden;
            &.serve-item {
              &:after {
                content: ' ';
                display: block;
                width: .91rem;
                height: .91rem;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                top: 1.6rem;
                border-radius: 50%;
                z-index: 2;
                background-color: #F4A536;
              }
            }
            .left-box, .right-box {
              width: 50%;
              min-height: 2rem;
              float: left;
            }
            .left-box {
              text-align: right;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              padding-right: 1.3rem;
              font-size: 1.18rem;
              .dismissTimeText {
                width: 13.64rem;
                padding: .6rem;
                color: #101010;
                position: relative;
                border: .09rem solid #F4A536;
                background-color: #F7F7F7;
                &:first-child {
                  margin-top: 1rem;
                  border-top-left-radius: .36rem;
                  border-top-right-radius: .36rem;
                  &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    right: -1.1rem;
                    top: .45rem;
                    width: 0;
                    height: 0;
                    border: .55rem solid;
                    border-color: transparent transparent transparent #F4A536;
                  }
                }
                &:not(:first-child) {
                  border-top: 0;
                }
                &:last-child {
                  border-bottom-left-radius: .36rem;
                  border-bottom-right-radius: .36rem;
                }
              }
            }
            .right-box {
              background-color: #fff;
              padding-left: 1rem;
              padding-top: 4rem;
              /*border-left:  1px dashed #F4A536;*/
              .contain_record-list {
                position: relative;
                margin-bottom: 2rem;
                &::after {
                  content: '';
                  display: block;
                  width: .6rem;
                  height: .6rem;
                  position: absolute;
                  left: -1rem;
                  top: .4rem;
                  transform: translateX(-50%);
                  border-radius: 50%;
                  background-color: #F7F7F7;
                  border: .2rem solid #bbb;
                  z-index: 2;
                }
                &.active::after {
                  background-image: url('~@/../resource/images/mt-arrow.svg');
                  background-repeat: no-repeat;
                  background-size: cover;
                  border: none;
                  width: 1.6rem;
                  height: 1.6rem;
                }
                .time {
                  color: #848485;
                }
                .position-info {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: .5rem;
                  color: #4A4A4A;
                  white-space: nowrap;
                  :last-child {
                    margin-right: 2rem;
                  }
                }
                .checkRemark-btn {
                  display: flex;
                  width: 15.91rem;
                  height: 2.82rem;
                  background-color: #E6E6E6;
                  align-items: center;
                  border-radius: .36rem;
                  color: #DD2121;
                  font-size: 1.27rem;
                  margin-bottom: 1rem;
                  padding-left: 1.8rem;
                  img {
                    width: 1.45rem;
                    height: 1.45rem;
                    margin-right: 1rem;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .warning-section {
    margin: 0.5rem;
    background:rgba(251,174,23,.15);
    padding: .6rem 1.5rem;
    color: rgb(244, 204, 104);
    box-sizing: border-box;
    display: flex;
    align-items: baseline;
    img {
      width: 1.2rem;
      height: 1.2rem;
      vertical-align: sub;
      margin-right: .5rem;
    }
  }
  .loading-bar {
    line-height: 4.4rem;
    text-align: center;
    background-color: #fff;
  }
</style>
