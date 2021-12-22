<template>
	<div class="pdf-style">
		<div class="pdf-menu">
			<img @click="hidePDF" src="@/../resource/images/pdf/icon_return.png" alt="">
			<img @click="scaleD" src="@/../resource/images/pdf/icon_scaleD.png" alt="">
			<img @click="scaleX" src="@/../resource/images/pdf/icon_scaleX.png" alt="">
			<img @click="copyUrl" :data-clipboard-text="pdfUrl" class="link" src="@/../resource/images/pdf/icon_download-min.png"
			 alt="">
		</div>
		<div class="pdf-wrap" :style="pdfWrapStyle">
			<pdf v-for="i in pageCount" :key="i" :src="src" :page="i">
			</pdf>
		</div>
	</div>
</template>

<script>
	import Clipboard from 'clipboard'
	import pdf from 'vue-pdf-signature';
	import CMapReaderFactory from 'vue-pdf-signature/src/CMapReaderFactory.js'

	export default {
		name: 'pdf-component',
		props: {
			url: String,
		},
		components: {
			pdf
		},
		data() {
			return {
				pdfUrl: '',
				src: '',
				pageCount: 0,
				scale: 1, //放大系数
			}
		},
		computed: {
			pdfWrapStyle: function() { //动态样式
				var str = 'transform: scale(' + this.scale + ');';
				str += 'transform-origin:left top;'
				return str;
			}
		},
		created() {
			this.pdfUrl = decodeURIComponent(this.url);
			this.loadFile();
		},
		methods: {
			loadFile: function() {
				let that = this;
				this.$vux.loading.show({
					text: '加载中'
				});

				that.src = pdf.createLoadingTask({
					url: this.pdfUrl,
					CMapReaderFactory
				});

				this.src.promise.then(pdf => {
					that.pageCount = pdf.numPages;
					that.$vux.loading.hide();
				}).catch(err => {
          that.$vux.loading.hide();
          // that.$vux.toast.text('加载PDF文件出错：');
        })

			},
			//放大
			scaleD: function() {
				this.scale += 0.5;
			},
			//缩小
			scaleX: function() {
				if (this.scale == 1) {
					return;
				}
				this.scale += -0.5;
			},
			hidePDF: function() {
				this.src = '';
				this.pdfUrl = '';
				this.pageCount = 0;
				this.scale = 1;

				this.$emit('hidePDF');
			},
			copyUrl: function() {
				let that = this;

				let clipboard = new Clipboard('.link');

				clipboard.on('success', function(e) {
					that.$vux.toast.text('复制成功，请在浏览器打开链接下载');
					// 释放内存
					clipboard.destroy()
				});
				clipboard.on('error', function(e) {
					that.$vux.toast.text('复制失败');
				});
			},
		},
	}
</script>

<style scoped lang="scss">
	.pdf-style {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: #fff;
		overflow-y: scroll;
		z-index: 999;
	}

	.pdf-menu {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		padding: 1.5rem;
		background: #272822;
		z-index: 2;

		img {
			// padding: .5rem;
			width: 2rem;
			height: 2rem;
		}
	}

	.pdf-wrap {
		padding-bottom: 4rem;
	}

	.btn-wrap {
		background: #fff;
		display: flex;
		justify-content: space-between;
		left: 0;
		right: 0;
		position: fixed;
		bottom: 0;
		padding: 1rem;
		border-top: 1px solid #E5E5E5;

		p {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			flex: 0 0 50%;
			text-align: center;
		}

		img {
			width: 1.5rem;
			height: 1.5rem;
			margin-bottom: .5rem;
		}
	}
</style>
