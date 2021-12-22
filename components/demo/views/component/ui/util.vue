<template>
  <div class="util-demo">
    <ul>
      <li>
        <a href="#SERVER" class="title">$util.SERVER</a>
        <div class="desc">
          描述：接口上下文
        </div>
        <div class="code">
          {{util.SERVER}}
        </div>
      </li>

      <li>
        <a href="#staticAccess" class="title">$util.staticAccess</a>
        <div class="desc">
          描述：访问静态图片资源的url，后面拼上图片guid即可访问图片
        </div>
        <div class="code">
          {{util.staticAccess}}
        </div>
      </li>

      <li>
        <a href="#basePhotoUrl" class="title">$util.basePhotoUrl</a>
        <div class="desc">
          描述：访问船员证件照的URL，参数拼上船员身份证即可访问
        </div>
        <div class="code">
          {{util.basePhotoUrl}}
        </div>
      </li>

      <li>
        <a href="#libPhotoUrl" class="title">$util.libPhotoUrl</a>
        <div class="desc">
          描述：用户在人脸库的照片，参数拼上用户身份证号即可访问
        </div>
        <div class="code">
          {{util.libPhotoUrl}}
        </div>
      </li>

      <li>
        <a href="#SERVER" class="title">$util.constant</a>
        <div class="desc">
          描述：一些系统需要用到的常量值
        </div>
        <table class="constant-table">
          <thead>
          <tr>
            <td>constant</td>
            <td>值</td>
            <td>描述</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>OK</td>
            <td>{{util.constant.OK}}</td>
            <td>接口调用结果代码，定义：接口调用成功</td>
          </tr>
          <tr>
            <td>INVALID_CODE</td>
            <td>{{util.constant.INVALID_CODE}}</td>
            <td>接口调用结果代码，定义：非法的code值</td>
          </tr>
          <tr>
            <td>WX_INDEX</td>
            <td>{{util.constant.WX_INDEX}}</td>
            <td>海事之眼小程序首页</td>
          </tr>
          <tr>
            <td>NETWORK_ERROR</td>
            <td>{{util.constant.NETWORK_ERROR}}</td>
            <td>网络异常的提示语</td>
          </tr>
          <tr>
            <td>MATCH_FAIL</td>
            <td>{{util.constant.MATCH_FAIL}}</td>
            <td>人脸识别不通过的提示语</td>
          </tr>
          <tr>
            <td>MATCH_SCORE</td>
            <td>{{util.constant.MATCH_SCORE}}</td>
            <td>人脸识别匹配阈值</td>
          </tr>
          <tr>
            <td>MIN_MATCH_SCORE</td>
            <td>{{util.constant.MIN_MATCH_SCORE}}</td>
            <td>最低人脸识别匹配阈值</td>
          </tr>
          <tr>
            <td>GD_CODE</td>
            <td>{{util.constant.GD_CODE}}</td>
            <td>广东海事局组织机构代码</td>
          </tr>
          <tr>
            <td>CHINA_CODE</td>
            <td>{{util.constant.CHINA_CODE}}</td>
            <td>部海事局机构代码</td>
          </tr>
          <tr>
            <td>baiduAK</td>
            <td>{{util.constant.baiduAK}}</td>
            <td>项目用到的百度地图ak</td>
          </tr>
          </tbody>
        </table>
      </li>

      <li>
        <a href="#getMiniProgramIndex" class="title">format</a>
        <div class="desc">
          描述：格式化日期
        </div>
        <div class="code">
          <div>格式化前：{{ new Date().getTime() }}</div>
          <div>格式化后：{{ new Date( new Date().getTime() ).format('yyyy-MM-dd hh:mm:ss') }}</div>
          <br>
          <div>格式化前：2020-1-2 2:13:23</div>
          <div>格式化后：{{ new Date('2020-1-2 2:13:23'.replace(/-/ig, '/')).format('yyyy-MM-dd hh:mm') }}</div>
        </div>
      </li>

      <li>
        <a href="#getMiniProgramIndex" class="title">$util.getMiniProgramIndex</a>
        <div class="desc">
          描述：返回海事之眼小程序首页
        </div>
      </li>

      <li>
        <a href="#getUserInfo" class="title">$util.getUserInfo</a>
        <div class="desc">
          描述：获取通过授权认证的code换取的用户信息，返回用户姓名、身份证号、人脸图片guid（如有）、access_token、userId、openId等信息
        </div>
      </li>

      <li>
        <a href="#parseNo" class="title">$util.parseNo</a>
        <div class="desc">
          描述：隐藏部分身份证号码
        </div>
        <div class="code">
          <div>原身份证：440222199001016011</div>
          <div>隐藏后：{{ util.parseNo('440222199001016011') }}</div>
        </div>
      </li>

      <li>
        <a href="#parsePhone" class="title">$util.parsePhone</a>
        <div class="desc">
          描述：隐藏部分手机号码
        </div>
        <div class="code">
          <div>原手机号：13400222738</div>
          <div>隐藏后：{{ util.parsePhone('13400222738') }}</div>
        </div>
      </li>

      <li>
        <a href="#encode" class="title">$util.encode</a>
        <div class="desc">
          描述：混淆字符
        </div>
        <div class="code">
          <div>混淆前：我是谁</div>
          <div>混淆后：{{ util.encode('我是谁') }}</div>
        </div>
      </li>

      <li>
        <a href="#decode" class="title">$util.decode</a>
        <div class="desc">
          描述：解析字符，与encode的作用相反
        </div>
        <div class="code">
          <div>解析前：6211.662f.8c01</div>
          <div>解析后：{{ util.decode('6211.662f.8c01') }}</div>
        </div>
      </li>

      <li>
        <a href="#getMonthEnd" class="title">$util.getMonthEnd</a>
        <div class="desc">
          描述：获取某年某月最后一天是几号
        </div>
        <div class="code">
          2020年2月最后一天是{{util.getMonthEnd(2020, 2)}}号
        </div>
      </li>

      <li>
        <a href="#getId15" class="title">$util.getId15</a>
        <div class="desc">
          描述：18位身份证转15位
        </div>
        <div class="code">
          <div>转换前：440233199303034567</div>
          <div>转换后：{{util.getId15('440233199303034567')}}</div>
        </div>
      </li>

      <li>
        <a href="#fix" class="title">$util.fix</a>
        <div class="desc">
          描述：数字补0
        </div>
        <div class="code">
          <div>转换前：9</div>
          <div>转换后：{{util.fix(9)}}</div>
        </div>
      </li>

      <li>
        <a href="#isPhone" class="title">$util.isPhone</a>
        <div class="desc">
          描述：校验号码是否为手机号
        </div>
        <div class="code">
          <div>手机号：1345678901</div>
          <div>结果：{{util.isPhone('1345678901')}}</div>
        </div>
      </li>

      <li>
        <a href="#isIdNo" class="title">$util.isIdNo</a>
        <div class="desc">
          描述：校验是否为身份证号
        </div>
        <div class="code">
          <div>身份证号：440231193023232</div>
          <div>结果：{{util.isIdNo('440231193023232')}}</div>
        </div>
      </li>

      <li>
        <a href="#bd09togcj02" class="title">$util.bd09togcj02</a>
        <div class="desc">
          描述：地理位置坐标转换，bd09坐标系坐标转换gcj02坐标系（火星坐标）坐标
        </div>
        <div class="code">
          <div>转换前：113.310936,23.14727</div>
          <div>
            转换后：{{util.bd09togcj02(113.310936,23.14727)}}
          </div>
        </div>
      </li>
      <li>
        <a href="#gcj02tobd09" class="title">$util.gcj02tobd09</a>
        <div class="desc">
          描述：gcj02坐标系坐标转bd09坐标系坐标
        </div>
        <div class="code">
          <div>转换前：113.310936,23.14727</div>
          <div>
            转换后：{{util.gcj02tobd09(113.310936,23.14727)}}
          </div>
        </div>
      </li>
      <li>
        <a href="#wgs84togcj02" class="title">$util.wgs84togcj02</a>
        <div class="desc">
          描述：wgs84坐标系坐标转gcj02坐标系坐标
        </div>
        <div class="code">
          <div>转换前：113.310936,23.14727</div>
          <div>
            转换后：{{util.wgs84togcj02(113.310936,23.14727)}}
          </div>
        </div>
      </li>
      <li>
        <a href="#gcj02towgs84" class="title">$util.gcj02towgs84</a>
        <div class="desc">
          描述：gcj02坐标系坐标转wgs84坐标系坐标
        </div>
        <div class="code">
          <div>转换前：113.310936,23.14727</div>
          <div>
            转换后：{{util.gcj02towgs84(113.310936,23.14727)}}
          </div>
        </div>
      </li>
      <li>
        <a href="#wgs84Tobd09" class="title">$util.wgs84Tobd09</a>
        <div class="desc">
          描述：wgs84坐标系坐标转bd09坐标系坐标
        </div>
        <div class="code">
          <div>转换前：113.310936,23.14727</div>
          <div>
            转换后：{{util.wgs84Tobd09(113.310936, 23.14727)}}
          </div>
        </div>
      </li>
      <li>
        <a href="#bd09Towgs84" class="title">$util.bd09Towgs84</a>
        <div class="desc">
          描述：bd09坐标系坐标转wgs84坐标系坐标
        </div>
        <div class="code">
          <div>转换前：113.310936,23.14727</div>
          <div>
            转换后：{{util.bd09Towgs84(113.310936, 23.14727)}}
          </div>
        </div>
      </li>
      <li>
        <a href="#formatGraphicPos" class="title">$util.formatGraphicPos</a>
        <div class="desc">
          描述：格式化坐标系
        </div>
        <div class="code">
          <div>转换前：113.310936,23.14727</div>
          <div>
            转换后：{{`${util.formatGraphicPos(113.310936, 23.14727).longitude}, ${util.formatGraphicPos(113.310936, 23.14727).latitude}`}}
          </div>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
  export default {
    name: 'demo-util',
    data () {
      return {
        util: $util
      }
    }
  }
</script>

<style scoped lang="scss">
  .util-demo {
    ul {
      background-color: #fff;
      li {
        list-style-type: decimal;
        padding: 1rem 1.2rem;
        border-bottom: 1px solid $bdc;
        a.title {
          font-size: 1.8rem;
          font-weight: bold;
          display: block;
        }
        .desc {
          margin-bottom: 1rem;
        }
        .code {
          background-color: #505050;
          border-radius: .4rem;
          padding: 1rem 1.2rem;
          color: #fff;
        }
      }
    }
  }
  .constant-table {
    max-width: 100%;
    tr {
      td {
        border-collapse: collapse;
        word-break: break-all;
        padding: 1rem .4rem;
        &:first-child {
          word-break: keep-all;
        }
      }
    }
  }
</style>
