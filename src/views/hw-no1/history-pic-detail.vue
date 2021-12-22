<template>
    <div class="history-pic-page">
        <scroller
            :class="['list']"
            :loading="loading"
            :page="page"
            :totalPage="totalPage"
            @scroll-to-bottom="loadMore"
        >
            <div slot="content" :class="['pic-list']">
                <div class="item" v-for="(item, index) in coverList" :key="item.id">
                    <div class="item-inner" @click="openPicModal(item, index)">
                        <img class="cover" :src="item.path" :alt="item.behavior" />
                    </div>
                </div>
            </div>
        </scroller>

        <!-- 图片弹窗 -->
        <transition name="fade">
            <div class="pic-modal" v-show="showPicModal">
                <div class="modal-bg"></div>
                <div class="modal-content">
                    <div class="top">
                        <span v-if="currentPic.time">{{ currentPic.time }}</span>
                        <span v-if="currentPic.behavior" :class="['behavior', (currentPic.behavior == '正常' || currentPic.behavior == '静止') ? 'green' : 'red']">{{ currentPic.behavior }}</span>
                    </div>
                    <div class="bottom">
                        <img :src="currentPic.pic" alt="" @click="previewBanner(currentPic.pic)">
                        <div class="left-arrow" @click="handleChangePic('left')">
                            <img src="@/assets/image/icon-left-arrow.png" alt=""/>
                        </div>
                        <div class="right-arrow" @click="handleChangePic('right')">
                            <img src="@/assets/image/icon-right-arrow.png" alt=""/>
                        </div>
                    </div>
                    <div class="icon-close" @click="closePicModal"></div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { Icon, Badge } from 'vux';
import checkbox from '../../../components/ui/checkbox.vue';
import scroller from '@/../components/ui/scroller';
import dayjs from 'dayjs';
import DateUtil from '../../../resource/js/dateUtil.js';
import { api_getPhotoList } from '@/api/hw.js';
export default {
    components: {
        Icon,
        Badge,
        checkbox,
        scroller
    },
    data () {
        return {
            query: {},
            startTime: new dayjs().format('YYYY-MM-DD'),
            endTime: new dayjs().format('YYYY-MM-DD'),
            loadingCount: 0,
            behavior: '正常,静止,疲劳驾驶,无人值守',
            coverList: [], // 封面图
            days: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            empty: false,
            error: false,
            page: 1,
            totalPage: 0,
            loading: false,
            showPicModal: false,
            currentPic: {},
            photoIndex: null,
        }
    },
    watch: {
        activeIndex: {
            handler(val) {
                this.radio.forEach(item => {
                    if (item.id == val) {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                })
            }
        },
        checkedIndex: {
            handler(val) {
                this.check.forEach(item => {
                    if (val == 0) {
                        if (item.id == 0) {
                            item.checked = true;
                        } else {
                            item.checked = false;
                        }
                    }
                });
            }
        },
        check: {
            handler(val) {
                if (val) {
                    let res = val.filter((item) => {
                        return item.checked;
                    }).map(item => {
                        return item.value;
                    });
                    this.behavior = res.join(',');
                    this.getCover();
                }
            },
            deep: true
        },
        photoIndex: {
            handler(val) {
                let item = this.coverList[val];
                console.log(val, item);

                this.currentPic = {
                    pic: item.path,
                    behavior: item.behavior,
                    picId: item.id,
                    time: new dayjs(item.shipTime).format('YYYY-MM-DD HH:mm:ss'),
                };
            }
        }
    },
    filters: {
        formatShipTime(val) {
            return new dayjs(val).format('YYYY-MM-DD HH:mm:ss');
        },
    },
    created() {
        this.query = this.$route.query;
        let time = new dayjs(this.query.time).format('YYYY-MM-DD');
        let start = new dayjs(this.query.time).hour();
        let end = start + 1;
        document.title = `${this.query.time}:00`;
        this.getCover(1);
    },
    methods: {
        beforeReq() {
            this.error = false;
            this.empty = false;
            this.loadingCount += 1;
            this.loading = true;
            this.$vux.loading.show();
        },
        afterRes() {
            this.loadingCount -= 1;
            this.loading = false;
            if (this.loadingCount == 0) {
                this.$vux.loading.hide();
            }
        },
        // 获取小时内所有图片
        getCover(page) {
            this.beforeReq();
            api_getPhotoList({
                shipId: this.query.shipId,
                behavior: this.query.behavior,
                start: this.query.time + ':00:00',
                end: this.query.time + ':59:59',
                page: page,
                size: 18,
            }).then(res => {
                let { code, item ,msg } = res.data;
                if ($util.OK(code)) {
                    let { list, totalPage } = item;
                    if(page == 1) {
                        this.coverList = list || [];
                    } else {
                        this.coverList = this.coverList.concat(list);
                    }
                    this.page = page;
                    this.totalPage = totalPage;
                } else {
                    this.$vux.toast.show(msg);
                }
            }).catch(err => {
                throw err;
            }).finally(() => {
                this.afterRes();
            });
        },
        // 重新请求
        handleReload() {
            this.getCover();
        },
        // 点击封面
        handleClickCover(item) {
            console.log(item);
        },
        // 列表加载
        loadMore () {
            this.page = this.page + 1;
            if (this.page <= this.totalPage) {
                this.getCover(this.page);
            }
        },
        // 打开图片列表
        openPicModal(item, index) {
            console.log(item, index);
            this.photoIndex = index;
            this.showPicModal = true;
        },
        // 关闭图片列表
        closePicModal() {
            this.showPicModal = false;
        },
        // 点击左右按钮
        handleChangePic(direction) {
            if (direction == 'left') {
                this.photoIndex > 0 ? (this.photoIndex -= 1) : (this.photoIndex = 0);
            } else if (direction == 'right') {
                this.photoIndex < this.coverList.length - 1 ? (this.photoIndex += 1) : (this.photoIndex = this.coverList.length - 1);
            }
        },
        // 大图预览
        previewBanner(url) {
            // 不支持base64图片预览
            if (url.indexOf('base64') >= 0) return;
            // 首图预览，包含了优先加载图片监控的图片预览
            let urls = [];
            if (!url) return;
            if (this.coverList) {
                this.coverList.forEach((item) => {
                    urls.push(item.path);
                });
            }
            $util.previewImage({
                urls,
                current: url,
            });
        },
    }
}
</script>
 
<style lang = "scss" scoped>
    .history-pic-page {
        width: 100%;
        background-color: #fff;
        overflow: hidden;
        .list {
            height: 100vh !important;
            padding-bottom: 0;
            .empty, .error {
                width: 100%;
                height: 3rem;
                line-height: 3rem;
                text-align: center;
            }
            .error {
                color: #3644ec;
            }
        }
        .pic-list {
            width: 100%;
            /* height: calc(100vh - 7rem); */
            transition: height .25s;
            padding: 1rem .8rem;
            box-sizing: border-box;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-row-gap: .8rem;
            grid-column-gap: .8rem;
            .item {
                /* width: 50%; */
                box-sizing: border-box;
                display: flex;
                /* padding: 0 0.4rem; */
                .item-inner {
                    width: 100%;
                    color: #2a2a2a;
                    position: relative;
                    .cover {
                        margin: auto;
                        width: 100%;
                        height: 10.3rem;
                        display: block;
                        object-fit: contain;
                        background-color: #000000;
                    }
                    .time {
                        font-size: 1.8rem;
                        font-weight: bold;
                        line-height: 3rem;
                    }
                    >>>.badge {
                        position: absolute;
                        right: 0;
                        top: 0;
                        transform: translate(20%, -50%);
                        z-index: 1;
                        background-color: #3644ec;
                    }
                }
            }
        }
        .pic-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            z-index: 1001;
            .modal-bg {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, .3);
            }
            .modal-content {
                position: absolute;
                top: 18rem;
                left: 50%;
                transform: translateX(-50%);
                width: 32.8rem;
                /* height: 36.6rem; */
                background-color: #ffffff;
                border-radius: 1.3rem;
                .top {
                    width: 100%;
                    height: 4.5rem;
                    box-sizing: border-box;
                    line-height: 4.5rem;
                    padding: 0 1.6rem;
                    .behavior {
                        float: right;
                        &.red {
                            color: #EE514E;                        
                        }
                        &.green {
                            color: #35C45A;
                        }
                    }
                }
                .bottom {
                    width: 100%;
                    height: 18.4rem;
                    position: relative;
                    overflow: hidden;
                    border-bottom-left-radius: 1.4rem;
                    border-bottom-right-radius: 1.4rem;
                    /* height: calc(100% - 4.5rem); */
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    .swiper {
                        height: 100%;
                    }
                    .left-arrow, .right-arrow {
                        position: absolute;
                        width: 4.5rem;
                        height: 4.5rem;
                        background-color: rgba(0, 0, 0, .3);
                        border-radius: 2.5rem;
                        display: flex;
                        img {
                            width: 2rem;
                            height: 2rem;
                            display: block;
                            margin: auto;
                        }
                    }
                    .left-arrow {
                        top: 50%;
                        left: 1rem;
                        transform: translateY(-50%);
                    }
                    .right-arrow {
                        top: 50%;
                        right: 1rem;
                        transform: translateY(-50%);
                    }
                }
            }
            .icon-close {
                position: absolute;
                width: 2.4rem;
                height: 2.4rem;
                background-image: url('../../assets/image/icon-close-white.png');
                background-size: contain;
                background-repeat: no-repeat;
                transform: translateX(-50%) rotate(45deg);
                left: 50%;
                bottom: -3.4rem;
            }
        }
    }
</style>