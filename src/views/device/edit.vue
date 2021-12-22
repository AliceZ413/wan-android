<template>
    <div>
        <div class="shipList" v-if="shipList.length > 0">
            已选择{{ shipNames.length }}条船舶：{{ shipNames.name }}
        </div>
        <div class="cell-button" v-for="(item, key, index) in options" :key="index">
            <div class="cell-button_top">
                <div class="cell-button_prefix">{{ item.label }}</div>
                <div class="cell-button_suffix">
                    <inline-x-switch class="switch" v-model="item.selected"></inline-x-switch>
                </div>
            </div>
            <transition name="fade">
                <div class="cell-button_bottom" v-show="item.hasPicker && item.selected">
                    <div>{{ key == 'nobody' ? '无人值守' : '疲劳驾驶' }} {{ item.second ? `(${item.second})秒则报警：` : '(-)秒则报警：' }}</div>
                    <div class="alert-input" @click="item.showPicker = true">
                        {{ item.alertTime ? `${item.alertTime[0]}分${item.alertTime[1]}秒` : '' }}
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div class="cell-button_bottom" style="justify-content: center;margin-left: 0;" v-show="item.hasQuietPicker && item.selected">
                    <div class="start" style="display: flex; align-items: center;">
                        <div>开始时间</div>
                        <div class="alert-input" style="margin-left: 0.5rem;" @click="handleQuietPicker('start')">
                            {{ item.startTime }}
                        </div>
                    </div>
                    <div class="end" style="display: flex; align-items: center;margin-left: 7rem;">
                        <div>结束时间</div>
                        <div class="alert-input" style="margin-left: 0.5rem;" @click="handleQuietPicker('end')">
                            {{ item.endTime }}
                        </div>
                    </div>
                </div>
            </transition>
            <group>
                <popup-picker :show.sync="item.showPicker" :show-cell="false" title="时间" v-model="item.alertTime" :data="item.timeData" @on-change="handleChange(item, key)"></popup-picker>
            </group>
        </div>

        <div class="bottom-btn">
            <div class="cancel" @click="handleCancel">取消</div>
            <div class="confirm" @click="handleSubmit">保存</div>
        </div>
    </div>
</template>

<script>
import { InlineXSwitch, PopupPicker, Group } from 'vux';
import { api_getDeviceInfo, api_updateDeviceInfo } from '@/api/hw.js';
const getTimeData = () => {
    let minute = [], second = [];
    for (let i = 0; i < 60; i++) {
        minute.push({
            name: `${i}分`,
            value: i
        });
    }
    for (let i = 0; i < 60; i++) {
        second.push({
            name: `${i}秒`,
            value: i
        });
    }
    return [minute, second];
}
const getTimeData2 = () => {
    let minute = [], second = [];
    for (let i = 0; i < 60; i++) {
        minute.push({
            name: `${i}分`,
            value: i
        });
    }
    for (let i = 0; i < 60; i++) {
        second.push({
            name: `${i}秒`,
            value: i
        });
    }
    return [minute, second];
}
export default {
    components: {
        Group,
        InlineXSwitch,
        PopupPicker,
    },
    data () {
        return {
            query: {},
            params: {},
            shipList: [],
            options: {
                nobody: {
                    label: '无人值守报警音',
                    timeData: getTimeData(),
                    second: 3,
                    alertTime: ['0', '3'],
                    showPicker: false,
                    hasPicker: true,
                    selected: false,
                },
                tired: {
                    label: '疲劳驾驶报警音',
                    timeData: getTimeData2(),
                    second: 3,
                    alertTime: ['0', '3'],
                    pickerText: '',
                    showPicker: false,
                    hasPicker: true,
                    selected: false,
                },
                bridge: {
                    label: '桥梁提醒',
                    hasPicker: false,
                    selected: false,
                },
                driver: {
                    label: '驾驶员适任识别',
                    hasPicker: false,
                    selected: false,
                },
                quiet: {
                    label: '工作时间',
                    hasPicker: false,
                    hasQuietPicker: true,
                    selected: false,
                    startTime: '00:00',
                    endTime: '23:59',
                },
            },
            timeData: getTimeData(),
            showPopupPicker: false,
            format: function (value, name) {
                return `${value[0]}:${value[1]}`
            },
            nobody: {
                isNobody: false,
                timeData: getTimeData(),
                nobodyAlertPicker: false,
                alertTime: ['5', '0'],
            },
            tired: {
                isTired: false,
                itemData: getTimeData2(),
                tiredAlertPicker: false,
                alertTime: ['5', '0'],
            },
            bridge: {
                isTired: false,
                tiredAlertPicker: false,
                alertTime: ['5', '0'],
            },
            driver: {
                isTired: false,
                tiredAlertPicker: false,
                alertTime: ['5', '0'],
            },
            deviceUuid: '',
        }
    },
    computed: {
        shipNames() {
            let shipNameList = this.shipList.map(item => item.shipName);
            return {
                length: shipNameList.length,
                name: shipNameList.join('、')
            };
        }
    },
    methods: {
        async getOptions() {
            this.$vux.loading.show('请稍候');
            let form = {
                shipUuid: this.query.shipUuid,
            };
            api_getDeviceInfo(form).then(res => {
                let data = res.data;
                if($util.OK(data.code)) {
                    let item = data.item;
                    this.deviceUuid = item.deviceUuid;
                    
                    this.options.nobody.selected = item.nobodyWarning == 0 ? true : false;
                    this.options.nobody.alertTime = this.getMinAndSecond(item.nobodyTime);
                    this.options.nobody.second = parseInt(item.nobodyTime) || 5;

                    this.options.tired.selected = item.tiredWarning == 0 ? true : false;
                    this.options.tired.alertTime = this.getMinAndSecond2(item.tiredTime);
                    this.options.tired.second = parseInt(item.tiredTime) || 10;

                    this.options.bridge.selected = item.bridgeWarning == 0 ? true : false;

                    this.options.driver.selected = item.driverWarning == 0 ? true : false;

                    this.options.quiet.selected = item.hwActive == 0 ? true : false;
                    this.options.quiet.startTime = item.hwStartTime ? item.hwStartTime : '';
                    this.options.quiet.endTime = item.hwEndTime ? item.hwEndTime : '';
                } else {
                    this.$vux.toast.text(data.msg);
                }
            }).catch(err => {
                throw err;
            }).finally(() => {
                this.$vux.loading.hide();
            })
        },
        nobodyPickerConfirm(value) {
            console.log(value);
        },
        tiredPickerConfirm(value) {
            console.log(value);
        },
        handleCancel() {
            // this.$router.push({
            //     name: 'message-list'
            // });
            this.$router.back();
        },
        handleSubmit() {
            let shipList = this.shipList;
            let shipUuid = this.query.shipUuid;
            if (shipList && shipList.length > 0) {
                shipUuid = shipList.map(item => item.shipUuid).join(',');
            }
            let userId = this.query.userId;
            let driverWarning = this.options.driver.selected ? 0 : 1;
            let deviceUuid = this.deviceUuid;
            let nobodyWarning = this.options.nobody.selected ? 0 : 1;
            let nobodyTime = this.getSecond(this.options.nobody.alertTime[0], this.options.nobody.alertTime[1]);
            let tiredWarning = this.options.tired.selected ? 0 : 1;
            let tiredTime = this.getSecond(this.options.tired.alertTime[0], this.options.tired.alertTime[1]);
            let bridgeWarning = this.options.bridge.selected ? 0 : 1;
            let hwActive = this.options.quiet.selected ? 0 : 1;
            let hwStartTime = this.options.quiet.startTime;
            let hwEndTime = this.options.quiet.endTime;
            if (this.options.quiet.selected) {
                if (hwStartTime == '' || hwEndTime == '') {
                    this.$vux.toast.show({
                        text: '工作时间不能为空',
                        time: 1000,
                        type: 'text',
                        width: '15rem',
                        isShowMask: true,
                        position: 'middle'
                    });
                    return;
                }
            }
            this.$vux.loading.show('请稍后');
            api_updateDeviceInfo({
                deviceUuid,
                userId,
                nobodyWarning,
                nobodyTime,
                tiredWarning,
                tiredTime,
                bridgeWarning,
                driverWarning,
                hwActive,
                hwStartTime,
                hwEndTime,
            }).then(res => {
                let data = res.data;
                if ($util.OK(data.code)) {
                    this.$vux.toast.show({
                        text: data.msg,
                        time: 1000,
                        type: 'success',
                        isShowMask: true,
                        position: 'middle'
                    });
                    setTimeout(() => {
                        this.$router.back();
                    }, 1000);
                } else {
                    this.$vux.toast.show({
                        text: data.msg,
                        time: 2500,
                        type: 'warn',
                        isShowMask: true,
                        position: 'middle'
                    });
                }
            }).catch(err => {
                throw err;
            }).finally(() => {
                this.$vux.loading.hide();
            });
        },
        getSecond(min, second) {
            let res = 0;
            res = parseInt(min) * 60 + parseInt(second)
            return res;
        },
        getMinAndSecond(second) {
            if (!second) {
                return ['0', '5'];
            }
            let m = 0, s = 0;
            m = parseInt(second / 60) + '';
            s = parseInt(second % 60) + '';
            return [m, s];
        },
        getMinAndSecond2(second) {
            if (!second) {
                return ['0', '10'];
            }
            let m = 0, s = 0;
            m = parseInt(second / 60) + '';
            s = parseInt(second % 60) + '';
            return [m, s];
        },
        handleChange(item, key) {
            if (key == 'nobody') {
                // 5秒 - 5分钟
                let min = item.alertTime[0];
                let second = item.alertTime[1];
                let nobodyToast = {
                    text: '无人值守检测时长应在3秒-60分钟内',
                    duration: 2500,
                    width: '27rem',
                    type: 'text',
                    position: 'middle'
                }
                if (min == 0 && second < 3) {
                    this.options.nobody.alertTime = ['0', '3'];
                    this.$vux.toast.show(nobodyToast);
                }
                if (min == 3 && second > 0) {
                    this.options.nobody.alertTime = ['3', '0'];
                    this.$vux.toast.show(nobodyToast);
                }
            } else if (key == 'tired') {
                // 10秒 - 5分钟
                let min = item.alertTime[0];
                let second = item.alertTime[1];
                let tiredToast = {
                    text: '疲劳驾驶检测时长应在3秒-60分钟内',
                    duration: 2500,
                    width: '27rem',
                    type: 'text',
                    position: 'middle'
                }
                if (min == 0 && second < 3) {
                    this.options.tired.alertTime = ['0', '3'];
                    this.$vux.toast.show(tiredToast);
                }
                if (min == 3 && second > 0) {
                    this.options.tired.alertTime = ['3', '0'];
                    this.$vux.toast.show(tiredToast);
                }
            }
        },
        handleQuietPicker(key) {
            let _this = this;
            if (key == 'start') {
                this.$vux.datetime.show({
                    value: _this.options.quiet.startTime,
                    title: '开始时间',
                    format: 'HH:mm',
                    confirmText: '确认',
                    cancelText: '取消',
                    onConfirm(value) {
                        _this.options.quiet.startTime = value;
                    },
                });
            } else if (key == 'end') {
                this.$vux.datetime.show({
                    value: _this.options.quiet.endTime,
                    title: '结束时间',
                    format: 'HH:mm',
                    confirmText: '确认',
                    cancelText: '取消',
                    onConfirm(value) {
                        _this.options.quiet.endTime = value;
                    },
                });
            } else {
                return;
            }
        },
    },
    created() {
        this.query = this.$route.params;
        console.log(this.query);
        if (this.query.shipList && this.query.shipList.length > 0) {
            this.shipList = this.query.shipList;
            document.title = '多项配置';
        } else {
            document.title = this.query.shipName;
        }
    },
    mounted() {
        if (this.shipList && this.shipList.length > 0) {
            return;
        }
        this.getOptions();
    }
}
</script>
 
<style lang="scss" scoped>
    .fade-enter-active, .fade-leave-active {
        transition: all .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
    .fade-leave, .fade-enter-to {
        opacity: 1;
    }
    .shipList {
        padding: .7rem 1rem;
        color: #101010;
        font-size: 1.6rem;
        background-color: #ffffff;
        margin-bottom: 1rem;
    }
    .cell-button {
        width: 100%;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
        font-size: 1.6rem;
        color: #101010;
        &:not(:last-of-type) {
            margin-bottom: 1.1rem;
        }
        .switch {
            background-color: #17c60b;
            &:checked {
                border-color: #17c60b;
            }
        }
        .cell-button_top, .cell-button_bottom {
            width: 100%;
            height: 5.2rem;
            padding: 0 1.6rem;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cell-button_bottom {
            font-size: 1.4rem;
            margin-left: .8rem;
            justify-content: flex-start;
            .alert-input {
                width: 7.2rem;
                height: 3.3rem;
                line-height: 3.3rem;
                text-align: center;
                border-radius: 0.6rem;
                border: 1px solid #bbbbbb;
            }
        }
    }
    .bottom-btn {
        width: 100%;
        height: 5rem;
        background-color: #ffffff;
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        box-shadow: 0rem -0.2rem 0.6rem 0rem rgba(153, 153, 153, .4);
        .cancel, .confirm {
            flex: 1;
            height: 5rem;
            line-height: 5rem;
            text-align: center;
        }
        .cancel {
            color: #959595;
        }
        .confirm {
            color: #ffffff;
            background: #006fff;
        }
    }
</style>