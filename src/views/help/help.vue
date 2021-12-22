<template>
    <div class="help-page">
        <div class="content">
            <template v-for="(item, index) in helps">
                <div class="box" v-if="item.show" :key="'help_' + index" @click="clickBox(item.path)">
                    <img class="icon" :src="item.icon" alt=""/>
                    <div class="title">{{ item.label }}</div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            helps: [
                {
                    label: '故障指引',
                    icon: require('@/assets/image/help/help-gzpc.png'),
                    path: '/help/gzpc',
                    show: true,
                },
                {
                    label: '联系我们',
                    icon: require('@/assets/image/help/help-phone.png'),
                    path: '/help/contact-us',
                    show: false,
                }
            ],
        }
    },
    methods: {
        clickBox(path) {
            this.$router.push({
                path
            });
        },
    },
}
</script>
 
<style lang = "scss" scoped>
    .help-page {
        width: 100%;
        height: 100vh;
        background-color: #f5f5f5;
        .content {
            width: 100%;
            height: 100%;
            padding: 1.4rem;
            box-sizing: border-box;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-row-gap: 1.5rem;
            grid-column-gap: 1.5rem;
            .box {
                width: 100%;
                height: 9rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: #ffffff;
                border-radius: .5rem;
                box-shadow: 0 .4rem 1rem 0 rgba(197, 197, 197, .3);
                .icon {
                    width: 2.5rem;
                    height: 2.5rem;
                    display: block;
                }
                .title {
                    margin-top: 1rem;
                    color: #101010;
                    font-size: 1.2rem;
                }
            }
        }
    }
</style>