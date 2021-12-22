<template>
  <div class="m-signature-board">
    <div class="m-board" v-show="showSignatureBoard">
      <div class="m-title" :style="`width: ${bH}px;transform-origin: ${0.5 * bW}px ${0.5 * bW}px;`">
        请&nbsp;&nbsp;&nbsp;&nbsp;签&nbsp;&nbsp;&nbsp;&nbsp;名
      </div>
      <canvas
        :width="canvasW"
        :height="canvasH"
        ref="signatureBoard"
        :id="id"
        class="signature-area"
        @touchstart=""
        :style="`width: ${canvasStyleWidth}px;height: ${canvasStyleHeight}px;`"
      >
      </canvas>
      <div class="button-group" :style="`width: ${bH}px;transform-origin: 0 0;`">
        <button class="btn-cancel" @click="hideBoard">取消</button>
        <button class="btn-clear" @click="clearBoard">清除</button>
        <button class="btn-confirm" @click="saveBoard">确定</button>
      </div>
    </div>
    <canvas
      :id="`${id}-img-builder`"
      class="img-builder"
      :width="canvasH"
      :height="canvasW"
      :style="`width: ${canvasStyleHeight}px;height: ${canvasStyleWidth}px;`">
    </canvas>
  </div>
</template>

<script>
  /*
  * 组件调用：
  * 设置showBoard=true
  * 确定签名时触发onConfirm事件
  * */
  export default {
    name: 'ui-signature',
    props: {
      value: Boolean,
      /* 是否展示已签的签名 */
      isClear: {
        type: Boolean,
        default: false
      },
      id: {
        type: String,
        default: 'main-board'
      }
    },
    data () {
      let bW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      let bH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

      return {
        bW: bW,
        bH: bH,
        showSignatureBoard: false,

        canvas: null,
        ctx: null,
        canvasW: '',
        canvasH: '',
        canvasStyleWidth: '',
        canvasStyleHeight: '',

        devicePixelRatio: 1,

        penColor: '#000',
        penSize: 10,
        isPainting: false,
        rotation: 0
      }
    },
    watch: {
      value (showSignatureBoard) {
        if(!showSignatureBoard && this.isClear){
          this.clearBoard()
        }
        this.showSignatureBoard = showSignatureBoard;
      },
      showSignatureBoard (val) {
        let $this = this;

        this.$emit('input', val);

        if(val) {
          let timer = setTimeout(initFn, 200);

          function initFn() {
            if ($this.$refs.signatureBoard.offsetWidth) {
              $this.initSignature();
              clearTimeout(timer);
              timer = null;
            } else {
              initFn();
            }
          }
        }
      }
    },
    methods: {
      initSignature () {
        let devicePixelRatio = this.devicePixelRatio = window.devicePixelRatio || 1;
        let canvasWidth = 0,
          canvasHeight = 0;

        canvasWidth = this.$refs.signatureBoard.offsetWidth * devicePixelRatio;
        canvasHeight = this.$refs.signatureBoard.offsetHeight * devicePixelRatio;

        this.canvasW = canvasWidth;
        this.canvasH = canvasHeight;

        this.canvasStyleWidth = canvasWidth / devicePixelRatio;
        this.canvasStyleHeight = canvasHeight / devicePixelRatio;
        this.initBoard(devicePixelRatio);
      },
      initBoard (devicePixelRatio) {
        let $this = this;
        let canvas = this.canvas = document.getElementById($this.id);
        let ctx = this.ctx = canvas.getContext('2d');
        const requestAnimationFrame = window.requestAnimationFrame;
        const { left, top } = canvas.getBoundingClientRect();

        canvas.ontouchstart = function (e) {
          ctx.beginPath();
          $this.isPainting = true;
        }

        function touchmove (e) {
          ctx.strokeStyle = $this.penColor;
          ctx.lineWidth = $this.penSize * devicePixelRatio;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          let point = {};
          point.x = (e.touches[0].clientX - left) * devicePixelRatio  + 0.5;
          point.y = (e.touches[0].clientY - top) * devicePixelRatio + 0.5;

          if ($this.isPainting) {
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          }
        }

        canvas.ontouchmove = (requestAnimationFrame ?
          function(e) {
            e.preventDefault();
            e.cancelBubble = true;
            e.stopPropagation();

            requestAnimationFrame(() => {
              touchmove(e);
            });
          } : touchmove);


        canvas.ontouchend = function () {
          $this.isPainting = false;
        }
      },
      showSignBoard () {
        if(this.isClear){
          this.clearBoard()
        }
        this.showSignatureBoard = true;
      },
      hideBoard: function(){
        this.showSignatureBoard = false;
      },
      clearBoard: function(){
        this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
      },
      saveBoard () {
        let $this = this;
        let imgUrl = this.canvas.toDataURL("image/png");
        let dpr = this.devicePixelRatio;
        let exportTool = document.getElementById(`${$this.id}-img-builder`);
        let ctx = exportTool.getContext('2d');
        let imgWidth = this.canvasW / dpr;
        let imgHeight = this.canvasH / dpr;
        let img = new Image();

        img.src = imgUrl;

        img.onload = function() {
          ctx.clearRect(0, 0, $this.canvasW, $this.canvasH);

          if($this.rotation == 0) {
            $this.rotation = -90;
            ctx.translate(0, $this.canvasW);
            ctx.rotate($this.rotation * Math.PI / 180);
          }
          ctx.drawImage( img, 0, 0, img.width, img.height);

          let base64DataUrl = exportTool.toDataURL("image/png");

          $this.$emit('onConfirm', base64DataUrl);
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .m-board{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 20;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #fff;
    .m-container{
    }
  }
  .m-title{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3rem;
    font-size: 1.6rem;
    text-align: center;
    border-bottom: .5px solid $bdc;
    line-height: 3rem;
    white-space: nowrap;
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  .signature-area {
    display: block;
    height: 100%;
    width: 85%;
    width: calc(100% - 8rem);
    margin-left: 5rem;
  }
  .button-group{
    height: 5rem;
    line-height: 5rem;
    position: absolute;
    top: 0;
    left: 5rem;
    display: flex;
    justify-content: center;
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transform: rotate(90deg);
    &>button:nth-child(1),&>button:nth-child(2) {
      margin-right: 2.5rem;
    }
    button{
      width: 13.5rem;
      height: 3.8rem;
      line-height: 3.8rem;
      text-align: center;
      font-size: 1.6rem;
    }
    .btn-cancel{
      border: .5px solid $bdc;
      background-color: #fff;
      color: #bebebe;
    }
    .btn-clear{
      border: .5px solid $mc;
      background-color: #fff;
      color: $mc;
    }
    .btn-confirm{
      border: none;
      color: #fff;
      background-image: linear-gradient(90deg,rgba(105,172,255,1),rgba(45,95,228,1));
    }
  }
  .img-builder{
    position: absolute;
    top: -9000px;
    left: -9000px;
    opacity: 0;
    z-index: -1;
  }
</style>
