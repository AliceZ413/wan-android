<template>
    <div class="history-pic-page">
        <!-- 筛选框 -->
        <div>
            <div class="check-box">
                条件筛选：
                <div class="yc-time-item" v-for="item in check" :key="'check_' + item.id" @click="clickTimeRadio(item.id)">
                    <icon v-show="item.checked" class="icon-selected" type="success"></icon>
                    <icon v-show="!item.checked" class="icon-not-selected" type="circle"></icon>
                    <span class="label" v-if="specialList.indexOf(query.shipCode) == -1">{{ item.label }}</span>
                    <span class="label" v-else>{{ item.specialLabel }}</span>
                </div>
            </div>
            <div :class="['top-bar', activeIndex == 3 ? 'extend' : '']">
                <div class="radio-groups">
                    <span>时间筛选：</span>
                    <div class="radio-button" v-for="item in radio" :key="'radio_' + item.id" @click="handleRadioSelect(item.id)">
                        <div class="radio_not-select" v-show="!item.selected"></div>
                        <div class="radio_selected" v-show="item.selected"></div>
                        <div class="radio_label">{{ item.label }}</div>
                    </div>
                </div>
                <div class="radio-extend">
                    <div class="start-time" @click="handleShowStartPicker">{{ startTime }}</div>
                    <div class="divice"></div>
                    <div class="end-time" @click="handleShowEndPicker">{{ endTime }}</div>
                    <div class="search" @click="handleSearch">查询</div>
                </div>
            </div>
        </div>
        <scroller :class="['list', activeIndex == 3 ? 'extend' : '']" :loader="false">
            <template v-if="coverList.length > 0">
                <div slot="content" :class="['pic-list']">
                    <div class="item" v-for="item in coverList" :key="item.id">
                        <div class="item-inner" @click="handleClickCover(item)">
                            <img class="cover" :src="item.path" :alt="item.behavior" />
                            <div class="time" v-if="activeIndex == 0">{{ `${item.startHour}~${item.endHour}点` }}</div>
                            <div class="time" v-else-if="activeIndex == 1">{{ `${item.day} ${item.weekCn}` }}</div>
                            <div class="time" v-else>{{ `${item.day}` }}</div>
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
import { api_getPhotoCover } from '@/api/hw.js';
import { specialList } from '@/config/specialList.js';
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
            activeIndex: 0,
            radio: [
                {
                    id: 0,
                    label: '本日',
                    selected: true,
                },
                {
                    id: 1,
                    label: '本周',
                    selected: false,
                },
                {
                    id: 2,
                    label: '本月',
                    selected: false,
                },
                {
                    id: 3,
                    label: '自定义',
                    selected: false,
                }
            ],
            checkedIndex: 0,
            check: [
                {
                    id: 0,
                    value: '正常,静止',
                    label: '正常驾驶',
                    specialLabel: '正常驾驶',
                    checked: true,
                },
                {
                    id: 1,
                    value: '疲劳驾驶',
                    label: '疲劳驾驶',
                    specialLabel: '未正视前方',
                    checked: true,
                },
                {
                    id: 2,
                    value: '无人值守',
                    label: '无人值守',
                    specialLabel: '无人值守',
                    checked: true,
                }
            ],
            startTime: new dayjs().format('YYYY-MM-DD'),
            endTime: new dayjs().format('YYYY-MM-DD'),
            loadingCount: 0,
            behavior: '正常,静止,疲劳驾驶,无人值守',
            coverList: [], // 封面图
            days: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            empty: false,
            error: false,
            specialList,
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
        document.title = '历史照片';
        this.getCover();
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
        // 点击check
        clickTimeRadio(id) {
            let checked = this.check[id].checked;
            this.check[id].checked = !checked;
            // console.log(this.check.some((item) => item.checked));
            if (!this.check.some((item) => item.checked)) {
                // 如果没有选中的
                this.check[id].checked = true;
            }
        },
        handleRadioSelect(id) {
            if (this.radio[id]) {
                this.activeIndex = id;
            }
            if (id == 0) {
                // 本日
                this.startTime = new dayjs().format('YYYY-MM-DD');
                this.endTime = new dayjs().format('YYYY-MM-DD');
            } else if (id == 1) {
                // 本周
                // console.log(DateUtil.DateUtil);
                this.startTime = DateUtil.DateUtil.getStartDayOfWeek();
                this.endTime = DateUtil.DateUtil.getEndDayOfWeek();
            } else if (id == 2) {
                // 本月
                this.startTime = DateUtil.DateUtil.getStartDayOfMonth();
                this.endTime = DateUtil.DateUtil.getEndDayOfMonth();
            } else if (id == 3) {
                this.startTime = DateUtil.DateUtil.getStartDayOfMonth();
                this.endTime = DateUtil.DateUtil.getEndDayOfMonth();
            }
            this.coverList = [];
            this.getCover();
        },
        // 选择开始时间
        handleShowStartPicker() {
            let _this = this;
            _this.$vux.datetime.show({
                value: _this.startTime,
                format: 'YYYY-MM-DD',
                cancelText: '取消',
                confirmText: '确定',
                onConfirm(value) {
                    let startTime = new dayjs(value).valueOf(),
                        endTime = new dayjs(_this.endTime).valueOf();
                    if (startTime > endTime) {
                        _this.$vux.toast.show({
                            text: '开始时间不能大于结束时间',
                            width: '22rem',
                            time: 1500,
                            type: 'text',
                            isShowMark: false,
                            position: 'middle',
                        });
                        return;
                    }
                    _this.startTime = value;
                }
            });
        },
        // 选择结束时间
        handleShowEndPicker() {
            let _this = this;
            _this.$vux.datetime.show({
                value: _this.endTime,
                format: 'YYYY-MM-DD',
                cancelText: '取消',
                confirmText: '确定',
                onConfirm(value) {
                    let startTime = new dayjs(_this.startTime).valueOf(),
                        endTime = new dayjs(value).valueOf();
                    if (startTime > endTime) {
                        _this.$vux.toast.show({
                            text: '开始时间不能大于结束时间',
                            time: 1500,
                            width: '22rem',
                            type: 'text',
                            isShowMark: false,
                            position: 'middle',
                        });
                        return;
                    }
                    _this.endTime = value;
                }
            });
        },
        // 搜索
        handleSearch() {
            let start = new dayjs(this.startTime);
            let end = new dayjs(this.endTime);
            if (end.diff(start, 'day') > 90) {
                this.$vux.toast.show({
                    type: 'text',
                    text: '查询时间不能超过90天',
                    duration: 1500,
                    position: 'middle',
                    width: '20rem'
                });
                return false;
            }
            this.getCover();
        },
        // 获取封面
        getCover() {
            this.beforeReq();
            api_getPhotoCover({
                shipId: this.query.shipId,
                behavior: this.behavior,
                start: this.startTime + ' 00:00:00',
                end: this.endTime + ' 23:59:59'
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
            // console.log(item);
            let shipId = this.query.shipId, behavior = this.behavior;
            if (item.level == 1) {
                // 获得点击天数的小时封面
                this.$router.push({
                    path: `/device/video/history-pic-next?shipId=${encodeURI(shipId)}&behavior=${encodeURI(behavior)}&time=${item.time}`,
                });
            } else {
                // 进入详情
                this.$router.push({
                    path: `/device/video/history-pic-detail?shipId=${encodeURI(shipId)}&behavior=${encodeURI(behavior)}&time=${item.time}`,
                });
            }
        },
    }
}
</script>
 
<style lang = "scss" scoped>
    .history-pic-page {
        width: 100%;
        background-color: #fff;
        overflow: hidden;
        .check-box {
            height: 3.5rem;
            line-height: 3.5rem;
            width: 100%;
            box-sizing: border-box;
            padding: 0 1.5rem;
            display: flex;
            white-space: nowrap;
            .icon-selected {
                color: #3644ec;
            }
            .icon-not-selected {
                color: #939393;
            }
            .icon-selected, .icon-not-selected {
                font-size: 1.6rem;
            }
            .label {
                color: #777777;
                white-space: nowrap;
            }
            .yc-time-item:not(:first-of-type) {
                margin-left: 1rem;
            }
        }
        .top-bar {
            /* position: absolute;
            left: 0;
            top: 0;
            z-index: 1001; */
            width: 100%;
            height: 3.5rem;
            box-sizing: border-box;
            padding: 0 1.5rem;
            background-color: #ffffff;
            transition: height .25s;
            overflow: hidden;
            border-bottom: 1px solid #bbbbbb;
            &.extend {
                height: 8rem;
            }
            .radio-groups {
                .radio-button {
                    display: inline-block;
                    height: 3.5rem;
                    line-height: 3.5rem;
                    &:not(:first-of-type) {
                        margin-left: 1rem;
                    }
                    .radio_not-select, .radio_selected, .radio_label {
                        display: inline-block;
                        vertical-align: middle;
                    }
                    .radio_not-select {
                        width: 1.4rem;
                        height: 1.4rem;
                        box-sizing: border-box;
                        border-radius: .7rem;
                        border: 1px solid #939393;
                    }
                    .radio_selected {
                        width: 1.4rem;
                        height: 1.4rem;
                        box-sizing: border-box;
                        border-radius: .7rem;
                        background-color: #3644ec;
                        border: 1px solid #3644ec;
                        position: relative;
                        &::before {
                            content: "";
                            position: absolute;
                            /* top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%); */
                            top: .4rem;
                            left: .4rem;
                            width: .4rem;
                            height: .4rem;
                            background-color: #ffffff;
                            border-radius: .2rem;
                        }
                    }
                    .radio_label {
                        font-size: 14px;
                        color: #777777;
                    }
                }
            }
            .radio-extend {
                width: 100%;
                height: 3.5rem;
                line-height: 3.5rem;
                box-sizing: border-box;
                background-color: #ffffff;
                display: flex;
                align-items: center;
                overflow: hidden;
                transition: height .25s;
                &.active {
                  height: 5rem;
                }
                .start-time , .end-time {
                  width: 9rem;
                  height: 3rem;
                  line-height: 3rem;
                  text-align: center;
                  border: 1px solid #bbbbbb;
                  box-sizing: border-box;
                  border-radius: .4rem;
                }
                .divice {
                  width: 1.8rem;
                  height: .1rem;
                  margin: 0 1rem;
                  background-color: #bbb;
                }
                .search {
                    background-color: #3644ec;
                    color: #ffffff;
                    height: 3rem;
                    line-height: 3rem;
                    padding: 0 1.5rem;
                    text-align: center;
                    border-radius: .4rem;
                    margin-left: 2rem;
                }
            }
        }
        .list {
            height: calc(100vh - 7rem) !important;
            &.extend {
                height: calc(100vh - 8rem - 3.5rem);
            }
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