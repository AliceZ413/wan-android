<template>
    <div>
        <div class="shipList" v-if="shipList.length > 0">
            已选择{{ shipNames.length }}条船舶：{{ shipNames.name }}
        </div>
        <div class="cell-button">
            <div class="cell-button_top">
                <div class="cell-button_prefix">无人值守</div>
                <div class="cell-button_suffix">
                    <inline-x-switch class="switch" v-model="nobody.isNobody"></inline-x-switch>
                </div>
            </div>
            <transition name="fade">
                <div class="cell-button_bottom" v-show="nobody.isNobody">
                    <div>报警间隔时长：</div>
                    <div class="alert-input" @click="nobody.nobodyAlertPicker = true">
                        {{ `${nobody.alertTime[0]}分` }}
                    </div>
                </div>
            </transition>
            <group>
                <popup-picker :show.sync="nobody.nobodyAlertPicker" :show-cell="false" title="时间" v-model="nobody.alertTime" :data="timeData" @on-change="nobodyPickerConfirm"></popup-picker>
            </group>
        </div>

        <div class="cell-button">
            <div class="cell-button_top">
                <div class="cell-button_prefix">疲劳驾驶</div>
                <div class="cell-button_suffix">
                    <inline-x-switch class="switch" v-model="tired.isTired"></inline-x-switch>
                </div>
            </div>
            <transition name="fade">
                <div class="cell-button_bottom" v-show="tired.isTired">
                    <div>报警间隔时长：</div>
                    <div class="alert-input" @click="tired.tiredAlertPicker = true">
                        {{ `${tired.alertTime[0]}分` }}
                    </div>
                </div>
            </transition>
            <group>
                <popup-picker :show.sync="tired.tiredAlertPicker" :show-cell="false" title="时间" v-model="tired.alertTime" :data="timeData" @on-change="tiredPickerConfirm"></popup-picker>
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
import { api_getUserMessageInfo, api_updateUserMessageInfo } from '@/api/hw.js';
const getTimeData = () => {
    let minute = [], second = [];
    for (let i = 5; i < 31; i++) {
        minute.push({
            name: `${i}分`,
            value: i
        });
    }
    // for (let i = 0; i < 60; i++) {
    //     second.push({
    //         name: `${i}秒`,
    //         value: i
    //     });
    // }
    return [minute];
}
export default {
    components: {
        Group,
        InlineXSwitch,
        PopupPicker
    },
    data () {
        return {
            query: {},
            params: {},
            shipList: [],
            options: [
                {
                    label: '无人值守',
                    alertTime: ['5', '0'],
                    showAlertTime: true,
                    selected: false,
                },
                {
                    label: '疲劳驾驶',
                    alertTime: ['5', '0'],
                    showAlertTime: true,
                    selected: false,
                }
            ],
            timeData: getTimeData(),
            showPopupPicker: false,
            formatDemoValue: ['05', '00'],
            format: function (value, name) {
                return `${value[0]}:${value[1]}`
            },
            nobody: {
                isNobody: false,
                nobodyAlertPicker: false,
                alertTime: ['5'],
            },
            tired: {
                isTired: false,
                tiredAlertPicker: false,
                alertTime: ['5'],
            }
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
                userId: this.query.userId
            };
            api_getUserMessageInfo(form).then(res => {
                let data = res.data;
                if($util.OK(data.code)) {
                    let item = data.item;
                    console.log('111', item.nobodyTime);
                    this.nobody.isNobody = item.isNobody == 0 ? true : false;
                    this.nobody.alertTime = item.nobodyTime ? [item.nobodyTime+""] : ["5"];
                    this.tired.isTired = item.isTired == 0 ? true : false;
                    this.tired.alertTime = item.tiredTime ? [item.tiredTime+""] : ["5"];
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
            let nobodyWarning = this.nobody.isNobody ? 0 : 1;
            let nobodyTime = this.nobody.alertTime[0];
            let tiredWarning = this.tired.isTired ? 0 : 1;
            let tiredTime = this.tired.alertTime[0];
            console.log('shipUuid', shipUuid);
            console.log('userId', userId);
            console.log('nobodyWarning', nobodyWarning);
            console.log('nobodyTime', nobodyTime);
            console.log('tiredWarning', tiredWarning);
            console.log('tiredTime', tiredTime);
            this.$vux.loading.show('请稍后');
            api_updateUserMessageInfo({
                shipUuid,
                userId,
                nobodyWarning,
                nobodyTime,
                tiredWarning,
                tiredTime
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
            let m = 0, s = 0;
            m = parseInt(second / 60);
            s = parseInt(second % 60);
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