<template>
    <div class="contact-us">
    </div>
</template>

<script>
import Clipboard from 'clipboard'
export default {
    data () {
        return {
            forwordText: ''
        }
    },
    methods: {
        copyWenZi() {
            document.querySelector('.tipTxt').classList.remove('show')
            let _this = this
            let clipboard = new Clipboard('#copyWenZi')
            clipboard.on('success',function(e) {
                e.clearSelection()
            })
            setTimeout(()=>{
                document.querySelector('.tipTxt').classList.add('show')
            },100)
        }
    },
    mounted() {
        
    }
}
</script>
 
<style lang = "less" scoped>
    .contact-us {
        font-size: 1.4rem;
        width: 100%;
        height: 100vh;
        background-color: #edf1f5;
        em {
            font-style: normal;
        }
        .contact-title {
            padding: 2.4rem 0;
            text-align: center;
            
            img {
                width: 5rem;
                height: 5rem;
                vertical-align: top;
            }
            .name {
                display: inline-block;
                margin-left: 1rem;
                text-shadow: 1px 1px 1px #FFFFFF;
                height: 5rem;
                .name-cn {
                    font-size: 1.8rem;
                    margin-bottom: 0.6rem;
                }
                .name-en {
                    font-size: 1.4rem;
                    color: #AAAAAA;
                }
            }
        }
        .contact-content {
            width: 100%;
            background-color: #fff;
            i {
                font-style: normal;
            }
            & > div {
                padding: 1rem 1.2rem;
                border-bottom: 0.5px solid #e9e9e9;
                overflow: hidden;
                label {
                    width: 12rem;
                    float: left;
                }
                span {
                    margin-left: 12rem;
                    display: block;
                    text-align: right;
                }
                p,a {
                    color: #294fdf;
                }
                img {
                    width: 80px;
                    height: 80px;
                    margin-top: 1rem;
                }
            }
        }
        .tipTxt {
            opacity: 0;
            position: fixed;
            top: 180px;
            left: 50%;
            z-index: 5001;
            width: 187.5px;
            height: 61.5px;
            /* min-height: 7.6em; */
            margin-left: -93.5px;
            box-sizing: border-box;
            padding: 10px 8px 0 8px;
            background: rgba(17, 17, 17, 0.7);
            text-align: center;
            border-radius: 5px;
            color: #FFFFFF;
            font-size: 16px;
        }
        .show {
            animation: show 3s 1;
        }
        @keyframes show {
            0% {
                opacity: 0;
            }
            50% {
                opacity: 1;
            }
            100% {
                opacity: 0;
            }
        }
    }
</style>