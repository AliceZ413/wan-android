<template>
  <div class="cert-contain">
    <div class="block-title">证书信息</div>
    <!-- 船员证书 -->
    <div v-if="actCertTab > -1">
      <div class="cert-nav">
        <div>

          <div
            class="cert-nav-item cert-fwb"
            :class="actCertTab == 2 ? 'cert-nav-item-active': ''"
            data-certtype="2"
            @click="setCertView"
            v-if="certs.fwb && certs.fwb.length > 0"
          >
            服务簿
          </div>

          <div
            class="cert-nav-item cert-river-comp"
            :class="actCertTab == 0 ? 'cert-nav-item-active': ''" data-certtype="0"
            @click="setCertView"
            v-if="certs.riverComp && certs.riverComp.length > 0"
          >
            内河适任证书
          </div>

          <div
            class="cert-nav-item cert-river-spec"
            :class="actCertTab == 1 ? 'cert-nav-item-active': ''"
            data-certtype="1"
            @click="setCertView"
            v-if="certs.riverSpec && certs.riverSpec.length > 0"
          >
            内河培训合格证
          </div>

          <div
            class="cert-nav-item cert-sea-comp"
            :class="actCertTab == 3 ? 'cert-nav-item-active': ''"
            data-certtype="3"
            @click="setCertView"
            v-if="certs.seaComp && certs.seaComp.length > 0"
          >
            海船适任证书
          </div>

          <div
            class="cert-nav-item cert-sea-spec"
            :class="actCertTab == 4 ? 'cert-nav-item-active': ''"
            data-certtype="4"
            @click="setCertView"
            v-if="certs.seaSpec && certs.seaSpec.length > 0"
          >
            海船培训合格证
          </div>

          <div
            class="cert-nav-item cert-yacht-driving"
            :class="actCertTab == 5 ? 'cert-nav-item-active': ''"
            data-certtype="5"
            @click="setCertView"
            v-if="certs.yachtDriving && certs.yachtDriving.length > 0"
          >
            游艇驾驶证书
          </div>
        </div>
      </div>
      <div class="cert-types">
        <div class="cert-1" v-show="actCertTab == 0" v-if="certs.riverComp && certs.riverComp.length > 0">
          <!-- 内河适任证书 -->
          <div>
            <div class="certificate" :class="certificate.certStatus != 1 ? 'certificate-outdate': ''" v-for="(certificate, index) in certs.riverComp" :data-index="index">
              <div>姓名：{{ certificate.name }}</div>
              <div>证书编号：{{ certificate.certNo }}</div>
              <div>适任类型：{{ certificate.compTypeName }}</div>
              <div>适任限制：{{ certificate.limiCn || '--' }}</div>
              <div>统考限制：{{ certificate.uniexamLimiCn || '--' }}</div>
              <div>船舶限制：{{ certificate.shipLimiCn || '--' }}</div>
              <div>岸基限制：{{ certificate.shoreLimiCn || '--' }}</div>
              <div>签发日期：{{ certificate.issuDate }}</div>
              <div>截止日期：{{ certificate.expiryDate || '--' }}</div>
              <div :class="certificate.certStatus == 1 ? 'blue':'red'">是否有效：
                <span>{{ certificate.certStatus == 1 ? '有效': '无效' }}</span>
              </div>
              <div v-show="certificate.certStatus == 0">证书无效原因：{{ certificate.invareason || '' }}</div>
            </div>
          </div>
        </div>
        <div class="cert-2" v-show="actCertTab == 1" v-if="certs.riverSpec && certs.riverSpec.length > 0">
          <!-- 内河培训合格证 -->
          <div>
            <div class="certificate" :class="certificate.certStatus != 1 ? 'certificate-outdate': ''" v-for="(certificate, index) in certs.riverSpec" :data-index="index">
              <div>姓名：{{ certificate.name }}</div>
              <div>证书编号：{{ certificate.certNo || '' }}</div>
              <div>培训项目：{{ certificate.compTypeName }}</div>
              <div>适任限制：{{ certificate.limiCn || '--' }}</div>
              <div>签发日期：{{ certificate.issuDate || '' }}</div>
              <div>截止日期：{{ certificate.expiryDate || '' }}</div>
              <div :class="certificate.certStatus == 1 ? 'blue':'red'">是否有效：
                <span>{{ certificate.certStatus == 1 ? '有效':'无效' }}</span>
              </div>
              <div v-show="certificate.certStatus == 0">证书无效原因：{{ certificate.invareason || '' }}</div>
            </div>
          </div>
        </div>
        <div class="cert-3" v-show="actCertTab == 3" v-if="certs.seaComp && certs.seaComp.length > 0">
          <!-- 海船适任证书 -->
          <div>
            <div class="certificate" :class="certificate.certStatus != 1 ? 'certificate-outdate': ''" v-for="(certificate, index) in certs.seaComp" :data-index="index">
              <div>姓名：{{ certificate.name }}</div>
              <div>证书编号：{{ certificate.certNo }}</div>
              <div>证书类型：{{ certificate.certCateName || '--' }}</div>
              <div>适任类型：{{ certificate.compTypeName || '--' }}</div>
              <div>适任限制：{{ certificate.limiCn || '--' }}</div>
              <div>统考限制：{{ certificate.uniexamLimiCn || '--' }}</div>
              <div>船舶限制：{{ certificate.shipLimiCn || '--' }}</div>
              <div>岸基限制：{{ certificate.shoreLimiCn || '--' }}</div>
              <div>签发日期：{{ certificate.issuDate || '' }}</div>
              <div>截止日期：{{ certificate.expiryDate || '--' }}</div>
              <div :class="certificate.certStatus == 1 ? 'blue':'red'">是否有效：
                <span>{{ certificate.certStatus == 1 ? '有效':'无效' }}</span>
              </div>
              <div v-show="certificate.certStatus == 0">证书无效原因：{{ certificate.invareason || '' }}</div>
            </div>
          </div>
        </div>
        <div class="cert-4" v-show="actCertTab == 4" v-if="certs.seaSpec && certs.seaSpec.length > 0">
          <!-- 海船培训合格证书 -->
          <div>
            <div class="certificate" :class="certificate.certStatus != 1 ? 'certificate-outdate': ''" v-for="(certificate, index) in certs.seaSpec" :data-index="index">
              <div>姓名：{{ certificate.name }}</div>
              <div>证书编号：{{ certificate.certNo }}</div>
              <div>证书名称：{{ certificate.compTypeName }}</div>
              <div>签发日期：{{ certificate.issuDate || '--' }}</div>
              <div>截止日期：{{ certificate.longTime ? '--' : (certificate.expiryDate || '--') }}</div>
              <div :class="certificate.certStatus == 1 ? 'blue':'red'">是否有效：
                <span>{{ certificate.certStatus == 1 ? '有效':'无效' }}</span>
              </div>
              <div v-show="certificate.certStatus == 0">证书无效原因：{{ certificate.invareason || '' }}</div>
            </div>
          </div>
        </div>
        <div class="cert-5" v-show="actCertTab == 2" v-if="certs.fwb && certs.fwb.length > 0">
          <!-- 服务簿 -->
          <div>
            <div class="certificate" :class="certificate.certStatus != 1 ? 'certificate-outdate': ''" v-for="(certificate, index) in certs.fwb" :data-index="index">
              <div>姓名：{{ certificate.name }}</div>
              <div>服务簿号码：{{ certificate.certNo }}</div>
              <div>适任限制：{{ certificate.limiCn == 'H' ? '海船': (certificate.limiCn == 'N' ? '内河': certificate.limiCn) }}</div>
              <div>签发日期：{{ certificate.issuDate || '--' }}</div>
              <div :class="certificate.certStatus == 1 ? 'blue':'red'">是否有效：
                <span>{{ certificate.certStatus == 1 ? '有效':'无效' }}</span>
              </div>
              <div v-show="certificate.certStatus == 0">证书无效原因：{{ certificate.invareason || '' }}</div>
            </div>
          </div>
        </div>
        <div class="cert-6" v-show="actCertTab == 5" v-if="certs.yachtDriving && certs.yachtDriving.length > 0">
          <!-- 游艇驾驶证书 -->
          <div>
            <div class="certificate" :class="certificate.certStatus != 1 ? 'certificate-outdate': ''" v-for="(certificate, index) in certs.yachtDriving" :data-index="index">
              <div>姓名：{{ certificate.name }}</div>
              <div>证书号码：{{ certificate.certNo }}</div>
              <div>证书类别：{{ certificate.certCateName }}</div>
              <div>证书等级：{{ certificate.compTypeName }}</div>
              <div>适用范围：{{ certificate.limiCn }}</div>
              <div>签发日期：{{ certificate.issuDate || '--' }}</div>
              <div>截止日期：{{ certificate.expiryDate || '--' }}</div>
              <div :class="certificate.certStatus == 1 ? 'blue':'red'">证书状态：
                <span>{{ certificate.certStatus == 1 ? '有效':'无效' }}</span>
              </div>
              <div v-show="certificate.certStatus == 0">证书无效原因：{{ certificate.invareason || '' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-cert">
      暂无数据
    </div>
  </div>
</template>

<script>
  import { api_getCerts } from '@/../resource/api/core'

  export default {
    name: 'service-crew-cert',
    props: {
      idNo: String
    },
    data () {
      return {
        actCertTab: 2,//证书tab
        certs: {
          fwb: [],
          riverComp: [],
          riverSpec: [],
          seaComp: [],
          seaSpec: [],
        }
      }
    },
    watch: {
      idNo (value) {
        this.idNo = value;
        this.getCrewCerts(value);
      }
    },
    mounted () {
      this.getCrewCerts(this.idNo);
    },
    methods: {
      getCrewCerts: function(idNo){
        let $this = this;
        this.$vux.loading.show({text: '请稍候'});

        let data = {
          guid: idNo
        };
        api_getCerts(data).then(function(response){
          let data = response.data;
          $this.$vux.loading.hide();
          if ($util.OK(data.code)) {
            $this.$data.certs = $this.sortCertificate(data.list);
          } else {
            $this.$vux.toast.text(data.msg);
          }
        });
      },
      sortCertificate: function (certificates) {
        let certs = {
          fwb: [],
          riverComp: [],
          riverSpec: [],
          seaComp: [],
          seaSpec: [],
          yachtDriving: []
        };
        /*
            0	内河适任证书
            1	内河培训证书
            2	服务簿
            3	海船适任证书
            4	海船培训证书
            6 游艇驾驶证书
            */
        let effectCert = [],
          outDateCert = [];
        while (certificates.length) {
          let obj = certificates.shift();
          if (obj.certStatus == 1) {
            effectCert.push(obj);
          } else {
            outDateCert.push(obj);
          }
        }
        certificates = effectCert.concat(outDateCert);
        for (let i = 0; i < certificates.length; i++) {
          let cert = certificates[i];
          // 无效日期为1900-01-01，则证书为有效证书
          if (cert.invaDate == '1900-01-01' || cert.expiryDate == '1900-01-01') {
            cert.longTime = true;

            if(cert.expiryDate == '1900-01-01') {
              cert.expiryDate = '--';
            }
            if (cert.invaDate == '1900-01-01') {
              cert.invaDate = '--';
            }
          }
          // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
          var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
          if (reg.test(cert.certNo)) {
            cert.certNo = $util.parseNo(cert.certNo);
          }
          // 身份证号码为 's' + 身份证
          if(cert.certNo) {
            if (cert.certNo.length == 16 || cert.certNo.length == 19) {
              var idNoTemp = cert.certNo.substring(1, cert.certNo.length);
              if (reg.test(idNoTemp)) {
                cert.certNo = $util.parseNo(idNoTemp);
              }
            }
          }

          switch (cert.typeCode.toString()) {
            case '0': certs.riverComp.push(cert); break;
            case '1': certs.riverSpec.push(cert); break;
            case '2': certs.fwb.push(cert); break;
            case '3': certs.seaComp.push(cert); break;
            case '4': certs.seaSpec.push(cert); break;
            case '5': certs.seaComp.push(cert);break;
            case '6': certs.yachtDriving.push(cert); break;
            default: break;
          }
        }

        if (certs.fwb && certs.fwb.length > 0) {
          this.actCertTab = 2;
        } else if (certs.riverComp && certs.riverComp.length > 0) {
          this.actCertTab = 0;
        } else if (certs.riverSpec && certs.riverSpec.length > 0) {
          this.actCertTab = 1;
        } else if (certs.seaComp && certs.seaComp.length > 0) {
          this.actCertTab = 3;
        } else if (certs.seaSpec && certs.seaSpec.length > 0) {
          this.actCertTab = 4;
        } else if (certs.yachtDriving && certs.yachtDriving.length > 0) {
          this.actCertTab = 5;
        } else {
          this.actCertTab = -1;
        }

        return certs;
      },
      setCertView: function (e) {
        //切换证书
        this.actCertTab = e.target.dataset.certtype;
      },
    }
  }
</script>

<style scoped lang="scss">
  /*证书信息*/
  .block-title{
    padding: 1.2rem 0 1.2rem 2.3rem;
    position: relative;
  }
  .block-title::before{
    content: ' ';
    display: block;
    position: absolute;
    width: .4rem;
    height: 1.7rem;
    background-color: #2a4edf;
    left: 1.2rem;
    top: 1.2rem;
  }
  /* 无效证书 */
  .certificate-outdate{
    color: #aaa;
  }
  .cert-nav{
    width: 100%;
    white-space: nowrap;
    background-color: #fff;
    padding: .05rem 1.5rem;
    box-sizing: border-box;
    overflow-x: scroll;
    overflow-y: hidden;
  }
  .cert-types{
    background-color: #fff;
  }
  .cert-nav-item{
    display: inline-block;
    padding: .8rem .4rem;
    border-radius: .4rem;
    background-color: #f5f5f5;
    font-size: 1rem;
    line-height: 1;
    color: #888;
    margin-right: 0;
  }
  .cert-nav-item-active{
    color: #fff;
    background-color: #2a4edf;
    border: none;
  }
  .cert-types{
    padding: 1.2rem;
  }
  .cert-1,.cert-2,.cert-3,.cert-4,.cert-5{
    padding: 0 1rem;
    border-radius: .4rem;
    background-color: #f5f5f5;
    font-size: 1.4rem;
    color: #555;
  }
  .certificate{
    border-bottom: .5px solid $bdc;
    padding: 1rem 0;
    &:last-child{
      border-bottom: 0;
    }
  }
  .certificate>div{
    margin-bottom: .8rem;
    line-height: 1;
  }
  .blue span{
    color: blue;
  }
  .red span{
    color: red;
  }
  .no-cert{
    padding: 1rem 0 3rem;
    text-align:center;
    color:#888;
    font-size: 1.3rem;
  }
  .cert-contain{
    background-color: #fff;
  }
</style>
