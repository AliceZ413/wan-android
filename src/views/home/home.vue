<template>
    <div>
        <mu-carousel hide-controls style="height: 21.8rem;">
            <mu-carousel-item>1</mu-carousel-item>
        </mu-carousel>
    </div>
</template>

<script>
import { api_getBanner } from '@/api/wanAdroid.js';
export default {
    data () {
        return {

 
        }
    },
    methods: {
        getBanner() {
            api_getBanner().then(res => {
                console.log(res);
            }).catch(err => {

            })
        },
    },
    created() {
        this.getBanner();
    },
}
</script>
 
<style lang = "scss" scoped>
    
</style>