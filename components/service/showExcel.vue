<template>
	<div id="show-excel-comp">
		<div :style="tableWrapStyle" v-html="tableHtml"></div>
		<div class="menu">
			<img @click="hideExcel" :src="icon_return" alt="">
			<img @click="scaleD" :src="icon_scaleD" alt="">
			<img @click="scaleX" :src="icon_scaleX" alt="">
			<!-- <img @click="rotateL" :src="icon_download" alt=""> -->
			<!-- <img @click="rotateR" :src="icon_download" alt=""> -->
			<img @click="copyUrl" :data-clipboard-text="copySrc" class="link" :src="icon_download" alt="">
		</div>
	</div>
</template>

<script>
	import Clipboard from 'clipboard'
	import icon_return from '@/assets/images/icon_return.png';
	import icon_download from '@/assets/images/icon_download-min.png';
	import icon_scaleD from '@/assets/images/icon_scaleD.png';
	import icon_scaleX from '@/assets/images/icon_scaleX.png';
	import XLSX from 'xlsx'
	import axios from 'axios'
	export default {
		props: {
			excelUrl: String,
		},
		data() {
			return {
				tableHtml: '',
				icon_download: icon_download,
				icon_return: icon_return,
				icon_scaleX,
				icon_scaleD,
				scale: 1, //放大系数
				copySrc: '',
			}
		},
		computed: {
			tableWrapStyle: function() { //动态样式
				var str = 'transform: scale(' + this.scale + ');';
				str += 'transform-origin:left top;'
				return str;
			}
		},
		watch: {
			excelUrl: function() {
				if (this.excelUrl != '') {
					var url = decodeURIComponent(this.excelUrl);
					this.copySrc = url;
					this.readWorkbookFromRemoteFile(url)
				}
			}
		},
		methods: {
			//放大
			scaleD: function() {
				this.scale += 0.3;
			},
			//缩小
			scaleX: function() {
				if (this.scale <= 0.5) {
					return;
				}
				this.scale += -0.3;
			},
			hideExcel: function() {
					this.copySrc = '';
					this.scale = 1;
					this.tableHtml = '';
					this.$emit('hideExcel');
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
					that.$vux.toast.text('复制失败，请手动复制');
					that.showPDFUrl = true;
				});
			},
			readWorkbookFromRemoteFile: function(url) {
				let that = this;
				var xhr = new XMLHttpRequest()
				xhr.open('get', url, true)
				xhr.responseType = 'arraybuffer'
				xhr.onload = function(e) {
					if (xhr.status === 200) {
						var data = new Uint8Array(xhr.response)
						var workbook = XLSX.read(data, {
							type: 'array'
						})
						that.tableToHtml(workbook)
					}
				}
				xhr.send()
			},
			tableToHtml: function(workbook) {
				var worksheet = workbook.Sheets[workbook.SheetNames[0]];
				var innerHTML = XLSX.utils.sheet_to_html(worksheet);
				this.tableHtml = innerHTML;
			},
		}
	}
</script>

<style scoped lang="scss">
	#show-excel-comp {
		padding: 2rem 2rem 6.5rem;
		.menu {
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
				width: 2rem;
				height: 2rem;
			}
		}
	}

	#show-excel-comp /deep/ table {
		border-right: 1px solid #333;
		border-bottom:1px solid #333;
		border-collapse: collapse;
	}

	#show-excel-comp /deep/ table td {
		border-left: 1px solid #333;
		border-top: 1px solid #333;
		white-space: nowrap;
		text-align: center;
		padding: .5rem;
	}

	#show-excel-comp /deep/ tbody tr:nth-of-type(1) {
		font-weight: bold;
		font-size: 20px;
	}
</style>
