<template>
    <div id="loading">
        <div :class='position' class="toast bg-primary" >
            <span class="fa fa-spinner fa-pulse fa-2x"></span><span class="ml-2 mr-1">{{message}}</span>
        </div>
        
    </div>
</template>
<script>
export default {
    props:{
        message:{
            type:String,
            default:'拼命加载中,请稍候...',
        }
    },
    data(){
        return{
            position:'middle',
        }
    }
}
</script>
<style lang="scss" scoped>
    .toast {
        position: fixed;
        left:50%;
        transform:translate(-50%,-50%) scale(1);
        word-wrap:break-word;
        padding:10px;
        text-align: center;
        z-index:9999;
        font-size:1rem;
        max-width:80%;
        color: #fff;
        border-radius: 5px;
        background: rgba(0,0,0,0.7);
        overflow: hidden;
          
    }
    .middle{
        top:50%;
    }
    .top{
        top:10%;
    }
    .bottom{
        top:90%;
    }
    .error{
        background:rgba(190, 27, 27, 0.9);
    }
    .fade-enter-active, .fade-leave-active {
        transition: transform .5s;
    }
    .fade-enter, .fade-leave-active {
        transform:translate(-50%,-50%) scale(0);
    }
</style>
