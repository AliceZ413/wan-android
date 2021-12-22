<template>
  <div>
    <div class="scroll-nav" v-show="tables.length">
      <div class="item" :class="curNav == index ? 'active' : ''"
           v-for="(item,index) in tables"
           @click="switchNav(index)"> {{item.name}} {{index+1}}
      </div>
    </div>
    <div class="table-view">
      <div class="manning-table">
        <div class="table-detail">
          <table class="r-table">
            <thead class="table-thead">
              <tr class="table-tr">
                <th class="table-th pos-name">岗位</th>
                <th class="table-th pos-num">人数</th>
                <th class="table-th pos-name">岗位</th>
                <th class="table-th pos-num th-end">人数</th>
              </tr>
            </thead>
            <tbody class="table-tbody">
              <tr class="table-tr" v-for="(position, i) in positionList" v-if="i <= positionList.length">
                <td class="table-td pos-name" :data-index="i" v-if="positionList[i * 2]"> {{positionList[i * 2].postNameCn || '--'}}</td>
                <td class="table-td pos-num" v-if="positionList[i * 2]"> {{positionList[i * 2].crewNumber || '--'}}</td>
                <td class="table-td pos-name" v-if="positionList[i * 2 + 1]"> {{positionList[i * 2 + 1].postNameCn || '--'}}</td>
                <td class="table-td pos-num" v-if="positionList[i * 2 + 1]"> {{positionList[i * 2 + 1].crewNumber || '--'}}</td>
              </tr>
            </tbody>
          </table>

          <div class="r-block">
            <div class="float-box">
              <label>适用范围：</label>
              <span> {{minManning.applyScopeCn || '--'}}</span>
            </div>
            <div class="float-box">
              <label>附加规定：</label>
              <span> {{minManning.remark || '--'}}</span>
            </div>
            <div class="float-box">
              <label>有效期：</label>
              <span> {{minManning.expdateStart}} -  {{minManning.expdateEnd}}</span>
            </div>
            <div class="float-box">
              <label>签发日期：</label>
              <span> {{minManning.issuDate}}</span>
            </div>
            <div class="float-box">
              <label>发证机关：</label>
              <span> {{minManning.issuOrgName || '--'}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="no-table" v-if="!loadingTable && !tables.length">
      无有效船舶最低安全配员表
    </div>
  </div>
</template>

<script>
  import {api_getShipManningCertificate, api_getShipManningDetail} from '@/../resource/api/ship'

  export default {
    name: 'manning-tables',
    props: {
      effect: Boolean
    },
    data () {
      return {
        loadingTable: false,
        tables: [],

        errorTips: '',
        selectCertNo: '',
        curNav: 0,
        nav: [],
        hasEffective: false,
        minManning: {},
        effectCertNum: -1,
        unEffectCertNum: -1,
        minManningList: [],
        positionList: []
      }
    },
    mounted () {

    },
    methods: {
      switchNav: function(index){
        this.minManning = this.tables[index];
        this.curNav = index;
        this.getManningDetail(index);
      },
      getMinManningList: function (shipId, callback) {
        callback = callback || function(){};
        shipId = shipId || '';
        // 获取配员证书列表
        let $this = this;
        let data = {
          shipId: shipId
        };

        if( $this.effect ) {
          //是否查询有效的船舶配员表
          data.flag = 1;
        }
        $this.$vux.loading.show({text: '请稍候'});
        this.loadingTable = true;

        api_getShipManningCertificate(data).then(function (result) {
          $this.loadingTable = false;
          result = result.data;
          $this.$vux.loading.hide();

          callback(result);

          if (result.success) {
            let certs = result.list,
              certArr = [],
              now = new Date().getTime();

            let effectCertNum = 0, //有效证书的数量（存在多本有效证书）
              hasEffective = false;//证书列表中，是否有有效证书标志

            for (let j = 0; j < certs.length; j++) {
              let cert = certs[j];
              let expdateEnd = new Date(parseInt(cert.expdateEnd)).getTime();
              /*
              判断证书是否有效，确定有几本有效证书
              invaForm=0或invaForm=null且
              证书未过期的才是有效证书
              */
              if (expdateEnd > now && (cert.invaForm == '0' || cert.invaForm == null)) {
                hasEffective = true;
                effectCertNum++;
              }
            }

            for (let i = 0; i < certs.length; i++) {
              let item = certs[i], name = '';

              let expdateEnd = new Date(parseInt(item.expdateEnd)).getTime();
              let certIsEffective = (now <= expdateEnd && (item.invaForm == '0' || item.invaForm == null));

              /*
                证书列表中有有效证书时，且当前证书为有效证书
                证书均为无效证书
              */
              if ((hasEffective && certIsEffective)) {
                if (!item.applyScopeCn) {
                  name = '船舶配员表'
                } else if (item.applyScopeCn.indexOf('内河') != -1) {
                  name = '内河船舶配员表'
                } else if (item.applyScopeCn.indexOf('海河') != -1) {
                  name = '海船船舶配员表'
                }
                item.name = name;
                item.expdateStart = new Date(parseInt(item.expdateStart)).format('yyyy-MM-dd');
                item.expdateEnd = new Date(parseInt(item.expdateEnd)).format('yyyy-MM-dd');
                item.issuDate = new Date(parseInt(item.issuDate)).format('yyyy-MM-dd');

                certArr.push(item);
              }else if( !hasEffective ){
                //证书均为无效证书
                if (!item.applyScopeCn) {
                  name = '船舶配员表'
                } else if (item.applyScopeCn.indexOf('内河') != -1) {
                  name = '内河船舶配员表'
                } else if (item.applyScopeCn.indexOf('海河') != -1) {
                  name = '海船船舶配员表'
                }
                item.name = name;
                item.expdateStart = new Date(parseInt(item.expdateStart)).format('yyyy-MM-dd');
                item.expdateEnd = new Date(parseInt(item.expdateEnd)).format('yyyy-MM-dd');
                item.issuDate = new Date(parseInt(item.issuDate)).format('yyyy-MM-dd');

                $this.unEffectCertNum ++;
                certArr.push(item);
              }
            }

            /*
              如果有有效证书，则只列出所有有效证书（可能多本）
            */
            if (certArr.length == 0) {
              $this.$emit('onNoEffectCert', false);
            } else {
              $this.tables = certArr;
              $this.minManning = certArr[0];
              $this.getManningDetail(0);
            }
            $this.hasEffective = hasEffective;
            $this.effectCertNum = effectCertNum;
          } else {
            $this.$vux.confirm.show({
              content: data.message,
              confirmText: '重试',
              onConfirm: function() {
                $this.getMinManningList($this.shipId);
              }
            });
          }
        }).catch(e => {
          $this.loadingTable = false;
        });
      },
      getManningDetail: function(index){
        let $this = this;
        // 获取配员详情
        $this.$vux.loading.show('请稍候');
        let certNo = this.tables[index].serialNo;

        let data = {certNo: certNo};

        $this.$emit('onCertNoChange', certNo);

        api_getShipManningDetail(data).then(function(result){
          $this.$vux.loading.hide();

          result = result.data;
          if (result.success) {
            let arr = [], list = result.list;
            for (let i = 0; i < list.length; i++) {
              let item = list[i];
              arr.push(item);
            }
            $this.positionList = arr;
            $this.$emit('onHasEffectCert', true);
          } else {
            $this.$vux.alert.show({
              content: '获取最低安全配员表详情失败',
              buttonText: '重试',
              onHide: function () {
                $this.getManningDetail(certNo);
              }
            })
            $this.$emit('onNoEffectCert', false);
          }
        }).catch(function(){
          $this.$vux.loading.hide();
          $this.$emit('onNoEffectCert', false);
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  .table-view {
    background-color: #fff;
  }
  .scroll-nav div{
    float: left;
    padding: .4rem .6rem;
    position: relative;
    margin-bottom: 1rem;
    &.active{
      color: $mc;
      &:after{
        position: absolute;
        content: ' ';
        display: block;
        z-index: 1;
        background-color: $mc;
        height: .2rem;
        width: 80%;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
  }
  .manning-table {
    padding-bottom: 3rem;
  }
  .manning-table .table-title {
    line-height: 4.4rem;
    padding: 0 3rem;
    background-color: #fff;
  }
  .title-expand {
    float: right;
  }
  .title-expand label{
    color: #2a4edf;
    font-size: 1.4rem;
  }
  .title-expand img {
    width: 1.2rem;
    height: 1.2rem;
    vertical-align: middle;
  }

  .table-tr{
    display: flex;
    width: 100%;
  }
  .table-tbody .table-tr:last-child {
    padding-bottom: .5rem;
  }
  .table-thead{
    background-color: #f1f1f1;
  }
  .pos-name {
    width: 40%;
  }
  .pos-num {
    width: 10%;
  }
  .r-table {
    width: 100%;
  }
  .table-th{
    flex: 1;
    font-size: 1.4rem;
    color: #888;
    padding: 1rem;
    padding-right: 0;
    text-align: left;
  }
  .table-tbody{
    background-color: #f5f5f5;
    margin-bottom: 1rem;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 1rem;
  }
  .table-td{
    padding: .5rem .5rem 0 1rem;
    width: 20%;
    float: left;
    text-align: left;
  }
  .table-td,.table-th{
    white-space: nowrap;
    word-break: break-all;
  }
  .td-end, .th-end{
    border-right: none;
  }
  .r-block {padding: 1rem;background-color: #f5f5f5;}
  .r-block>.float-box {
    padding-top: .5rem;
    overflow: hidden;
  }
  .r-block>.float-box label {
    float: left;
    font-size: 1.4rem;
    width: 8rem;
  }
  .r-block>.float-box span {
    display: block;
    margin-left: 8rem;
    font-size: 1.4rem;
    color: #999;
  }

  .footer {
    padding: 1.2rem 1.5rem;
    background: #fff;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: -.15rem 0 1rem #f5f5f5;
  }
  .footer button {
    display: block;
    width: 100%;
  }

  .show {
    display: block;
  }
  .inline {
    display: inline-block;
  }
  .hide {
    display: none;
  }

  .no-table {
    padding: 1.5rem;
    text-align: left;
    background-color: #fff;
  }
</style>
