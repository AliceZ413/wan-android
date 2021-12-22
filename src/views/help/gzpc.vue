<template>
    <!-- 故障排查 -->
    <div class="page">
        <img src="@/assets/image/help/help-long-pic.png" alt="" :draggable="false" @click="handleClick"/>
    </div>
</template>

<script>
export default {
    data () {
        return {

 
        }
    },
    methods: {
        handleClick(e) {
            e.stopPropagation();
            e.preventDefault();
        }
    },
}
</script>
 
<style lang = "scss" scoped>
    .page {
        width: 100%;
        img {
            width: 100%;
        }
    }
</style>