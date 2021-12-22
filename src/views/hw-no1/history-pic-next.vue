<template>
    <div class="history-pic-page">
        <scroller :class="['list']" :loader="false">
            <template v-if="coverList.length > 0">
                <div slot="content" :class="['pic-list']">
                    <div class="item" v-for="item in coverList" :key="item.id">
                        <div class="item-inner" @click="handleClickCover(item)">
                            <img class="cover" :src="item.path" :alt="item.behavior" />
                            <div class="time">{{ `${item.startHour}~${item.endHour}点` }}</div>
                            <badge class="badge" :text="item.totalNum"></badge>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div slot="content">
                    <div class="empty" v-if="empty">
                        无查询结果
                    </div>
                    <div class="error" v-if="error" @click="handleReload">
                        点击重新请求
                    </div>
                </div>
            </template>
        </scroller>
    </div>
</template>

<script>
import { Icon, Badge } from 'vux';
import checkbox from '../../../components/ui/checkbox.vue';
import scroller from '@/../components/ui/scroller';
import dayjs from 'dayjs';
import DateUtil from '../../../resource/js/dateUtil.js';
import { api_getPhotoCover, api_getPhotoList } from '@/api/hw.js';
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
            refresh: true,
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
        }
    },
    created() {
        this.query = this.$route.query;
        document.title = this.query.time;
        // this.getCover();
    },
    activated() {
        // document.title = this.query.time;
        // console.log('-----', this.query.time);
        console.log('ac refresh', this.refresh);
        if (this.refresh) {
            this.getCover();
        }
    },
    beforeRouteEnter (to, from, next) {
        // console.log(from, to);
        if (from.name == 'history-pic') {
            // 从hitory-pic进入需要重新加载
            // console.log('重新加载');
            next((vm) => {
                vm.refresh = true;
                vm.updateTitle(to);
                vm.updateQuery(to);
            });
            return;
        } else {
            // 从histoy-pic-next进入不需要重新加载
            // console.log('不重新加载');
            next((vm) => {
                vm.refresh = false;
                vm.updateTitle(to);
                vm.updateQuery(to);
            });
        }
        next(vm => {
            vm.updateTitle(to);
            vm.updateQuery(to);
        });
    },
    methods: {
        beforeReq() {
            this.error = false;
            this.empty = false;
            this.loadingCount += 1;
            this.$vux.loading.show();
        },
        afterRes() {
            this.loadingCount -= 1;
            if (this.loadingCount == 0) {
                this.$vux.loading.hide();
            }
        },
        // 获取封面
        getCover() {
            this.beforeReq();
            api_getPhotoCover({
                shipId: this.query.shipId,
                behavior: this.query.behavior,
                start: new dayjs(this.query.time).format('YYYY-MM-DD') + ' 00:00:00',
                end: new dayjs(this.query.time).format('YYYY-MM-DD') + ' 23:59:59'
            }).then(res => {
                let { code, item ,msg } = res.data;
                if ($util.OK(code)) {
                    if (item) {
                        item = item.map((item) => {
                            let totalNum = 0;
                            if (item.totalNum >= 0 && item.totalNum <= 99) {
                                totalNum = item.totalNum.toString();
                            } else if (item.totalNum > 99) {
                                totalNum = '99+';
                            } else if (item.totalNum < 0) {
                                totalNum = '0';
                            }
                            return {
                                ...item,
                                date: new dayjs(item.time).format('YYYY-MM-DD'), // YYYY-MM-DD格式
                                day: new dayjs(item.time).format('MM-DD'), // MM-DD格式
                                weekCn: this.days[new dayjs(item.time).day()], // 获得星期几
                                week: new dayjs(item.time).day(), // 获得星期几
                                startHour: new dayjs(item.time).hour(),
                                endHour: new dayjs(item.time).hour() + 1,
                                totalNum: totalNum
                            }
                        });
                    }
                    this.coverList = item;
                    if (this.coverList.length == 0) {
                        this.empty = true;
                    }
                } else {
                    this.$vux.toast.show(msg);
                    this.error = true;
                }
            }).catch(err => {
                this.coverList = [];
                this.error = true;
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
            let shipId = this.query.shipId, behavior = this.query.behavior, time = this.query.time;
            if (item.level == 1) {
                // 获得点击天数的小时封面
            } else {
                // 进入详情
                this.$router.push({
                    path: `/device/video/history-pic-detail?shipId=${encodeURI(shipId)}&behavior=${encodeURI(behavior)}&time=${item.time}`,
                });
            }
        },
        // 更新标题
        updateTitle(route) {
            document.title = route.query.time || '海王一号';
        },
        // 更新本地query
        updateQuery(route) {
            this.query = route.query;
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
            grid-template-columns: 1fr 1fr;
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
                        height: 15.3rem;
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
    }
</style>