<template>
  <div class="util-demo">
    <ul>
      <li>
        <a href="#getURLBase64" class="title">$util.getURLBase64</a>
        <div class="desc">
          描述：通过URL将图片转为base64
        </div>
        <img src="@/../resource/images/logo.png" id="demo-img"/>
        <div class="code">
          let url = document.getElementById('demo-img').src;
          <br>
          let data = await $util.getURLBase64(url);
          <br/>
          <br/>
          <br/>
          <div style="overflow-x: scroll">
            返回：
            {{base64}}
          </div>
        </div>
      </li>

      <li>
        <a href="#compressToBlob" class="title">$util.compressToBlob</a>
        <div class="desc">
          描述：对图片进行压缩,返回blob文件流，一般用于上传文件
        </div>
        <input type="file" accept="image/*" @change="getFile" class="btn"/>
        <div v-if="file.name" style="background-color: #D9E2FA;overflow: scroll">
          <div v-if="file.name">上传的文件：{{file.name}}</div>
          <div v-if="file.lastModified">修改日期：{{new Date(file.lastModified).format('yyyy/mm/dd hh:MM:ss')}}</div>
          <div v-if="file.size">文件大小：{{file.size/1000}}KB</div>
          <div v-if="file.type">文件类型：{{file.type}}</div>
        </div>

        <div v-if="compressFile.size" style="background-color: #FEE7E7;overflow: scroll">
          <div>上传后</div>
          <div v-if="compressFile.size">文件大小：{{compressFile.size/1000}}KB</div>
          <div v-if="compressFile.type">文件类型：{{compressFile.type}}</div>
          <div v-if="fileGuid">文件guid：{{fileGuid}}</div>
          <img v-if="fileGuid" :src="`${util.staticAccess}${fileGuid}`" style="width: 10rem;height: 10rem;">
        </div>

        <div class="code" style="display: block">
          let file = this.file = e.target.files[0];
          <br>
          const compressFile = await $util.compressToBlob(file);
        </div>
      </li>

      <li>
        <a href="#getLocation" class="title">$util.getLocation</a>
        <div class="desc">
          描述：获取地理位置，默认wgs84坐标系（线上才可以预览效果）
        </div>
        <button class="btn" @click="getLocation">点我获取地理位置</button>
        <table class="constant-table">
          <thead>
          <tr>
            <td>参数</td>
            <td>描述</td>
            <td>返回</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>type</td>
            <td>坐标类型(默认wgs84)</td>
            <td></td>
          </tr>
          <tr>
            <td>success</td>
            <td>成功获取地理位置的回调函数</td>
            <td>返回地理位置坐标</td>
          </tr>
          <tr>
            <td>fail</td>
            <td>获取地理位置失败的回调函数</td>
            <td>无</td>
          </tr>
          </tbody>
        </table>
      </li>
      <li>
        <a href="#previewImage" class="title">$util.previewImage</a>
        <div class="desc">
          描述：预览图片，只接受域名访问的图片的预览，不接受本地图片的预览
        </div>
        <img v-for="(url, index) in imgs" :src="url" @click="preview(url)" class="test-photo"/>
        <div class="code">
          <table class="constant-table">
            <thead>
              <tr>
                <td>参数</td>
                <td>描述</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>urls</td>
                <td>要预览的图片组的集合</td>
              </tr>
              <tr>
                <td>current</td>
                <td>当前预览的图片</td>
              </tr>
            </tbody>
          </table>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
  import {api_save_file} from '@/../resource/api/common'

  export default {
    name: 'demo-sdk',
    data () {
      return {
        util: $util,
        base64: '',

        file: {},
        compressFile: {},
        fileGuid: '',

        imgs: [
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584013647877&di=28814284a80673e580add3fa2394e4b7&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2F43c522c3255726fc33fea69bfbf6436ad6321895.jpg',
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584013647878&di=d6440c7c8c510eb442d0d8aede4e1b4f&imgtype=0&src=http%3A%2F%2Fpic1.zhimg.com%2F50%2Fv2-d90f73dc5a5cd06756ea820b1380aabd_hd.jpg'

        ]
      }
    },
    mounted () {
      this.getURLBase64();

    },
    methods: {
      async getURLBase64 () {
        let url = document.getElementById('demo-img').src;
        this.base64 = await $util.getURLBase64(url);
      },
      async getFile(e) {
        console.log(e);
        let file = this.file = e.target.files[0];
        const compressFile = await $util.compressToBlob(file);
        this.compressFile = {
          size: compressFile.size,
          type: compressFile.type
        }

        this.saveFile(compressFile);
      },
      async saveFile (compressFile) {
        let $this = this;
        let formData = new FormData();
        formData.append('catalog', 'test_img');
        formData.append('file', compressFile);

        this.$vux.loading.show();
        const fileGuid = await api_save_file(formData)
          .then(({ data }) => {
            $this.$vux.loading.hide();
            if (data.success) {
              return data.item;
            } else {
              throw {
                message: data.message
              };
            }
          }).catch(e => {
            $this.$vux.toast.text('文件上传异常，请重试');
          });

        this.fileGuid = fileGuid;
      },
      getLocation () {
        let $this = this;
        $util.getLocation({
          success (res) {
            $this.$vux.alert.show({
              title: '信息',
              content: `${res.longitude},${res.latitude}`
            });
          },
          fail () {
            $this.$vux.alert.show({
              title: '信息',
              content: '无法获取地理位置信息'
            });
          }
        })
      },
      preview (url) {
        $util.previewImage({
          urls: this.imgs,
          current: url
        });
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
          margin-top: 1rem;
        }
      }
    }
  }
  .constant-table {
    max-width: 100%;
    tr {
      td {
        border: 1px solid $bdc;
        border-collapse: collapse;
        word-break: break-all;
        padding: 1rem .4rem;
        &:first-child {
          word-break: keep-all;
        }
      }
    }
  }
  .btn {
    background-color: #edf1f5;
    padding: .6rem;
    border-radius: .4rem;
  }
  .test-photo {
    width: 12rem;
    height: 20rem;
    margin-right: 1rem
  }
</style>
