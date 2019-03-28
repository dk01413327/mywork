<template>
    <div>
        <div v-show="visible" :class='position' class="toast bg-primary" v-if="mtype==0">
            <span class="fa fa-info-circle fa-2x"></span><span class="ml-2 mr-1">{{message}}</span>
        </div>
        <div v-show="visible" :class='position' class="toast bg-warning"  v-else-if="mtype==1">
            <span class="fa fa-warning fa-2x"></span><span class="ml-2 mr-1">{{message}}</span>
        </div>
        <div v-show="visible" :class='position' class="toast bg-danger"  v-else-if="mtype==2">
            <span class="fa fa-times-circle fa-2x"></span><span class="ml-2 mr-1">{{message}}</span>
        </div>
        <div v-show="visible" :class='position' class="toast bg-primary"  v-else-if="mtype==3">
            <span class="fa fa-spinner fa-pulse fa-2x"></span><span class="ml-2 mr-1">{{message}}</span>
        </div>
        
    </div>
</template>
<script>
export default {
    data(){
        return{
            visible:false,
            position:'',
            message:'',
            mtype:0, //0:提示，1：警告，2：错误，3：加载
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
