<template>
    <div class="vue-component">
        <div class="content">
            <h1>Page not found</h1>
            <a href='#' @click='gohome'>回首页</a>
        </div>
    </div>
</template>
<script>
export default {
    name:'page404',
    methods:{
        gohome(){
            this.$router.push({ path: '/main' });
        }
    }
}
</script>
<style scoped>
    .content{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        height: 100px;
        width: 300px;
    }
    
</style>


