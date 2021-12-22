<template>
    <span :class="['hw-switch', hwSwitchClass]" :value="value" @click.stop="toggle">
        <div v-if="isChecked && direction.length > 0" class="text-on">{{ direction[0] }}</div>
        <div v-if="!isChecked && direction.length > 0" class="text-off">{{ direction[1] }}</div>
    </span>
</template>

<script>
export default {
    name: 'hw-switch',
    computed: {
        hwSwitchClass() {
            let hwSwitchClass = '';
            if (this.isChecked) {
                hwSwitchClass = 'hw-switch-on';
            }
            return hwSwitchClass;
        },
        direction() {
            if (this.text) {
                return this.text.split('|');
            } else {
                return [];
            }
        }
    },
    model: {
        props: 'value',
        event: 'change'
    },
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        text: {
            type: String,
            default: ''
        },
    },
    watch: {
        value(val) {
            this.isChecked = val;
        },
        isChecked(val) {
            this.$emit('change', val);
        }
    },
    data () {
        return {
            isChecked: this.value,
            event: null,
        }
    },
    methods: {
        toggle(event) {
            this.isChecked = !this.isChecked;
            this.event = event;
        }
    }
}
</script>
 
<style lang = "scss" scoped>
    .hw-switch {
        display: block;
        position: relative;
        width: 5.2rem;
        height: 2.4rem;
        border: 1px solid #DFDFDF;
        outline: 0;
        border-radius: 1.6rem;
        box-sizing: border-box;
        background-color: #DFDFDF;
        transition: background-color 0.1s, border 0.1s;
        cursor: pointer;
    }
    .hw-switch:before {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 5rem;
        height: 2.2rem;
        border-radius: 1.5rem;
        background-color: #FDFDFD;
        transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
    }
    .hw-switch:after {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 1.5rem;
        background-color: #FFFFFF;
        box-shadow: 0 .1rem .3rem rgba(0, 0, 0, 0.4);
        transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
    }
    .hw-switch-on {
        border-color: #00e266;
        background-color: #00e266;
    }
    .hw-switch-on:before {
        border-color: #1AAD19;
        background-color: #00e266;
    }
    .hw-switch-on:after {
        transform: translateX(2.8rem);
    }
    .text-on {
        width:100%;
        height:100%;
        position:absolute;
        padding:0 .5rem;
        line-height:2rem;
        color:#FFF;
        user-select:none;
    }
    .text-off {
        width:100%;
        height:100%;
        position:absolute;
        padding:0 .5rem;
        right: .2rem;
        line-height: 2.2rem;
        color:#7A7A7A;
        text-align:right;
        user-select:none;
    }
</style>