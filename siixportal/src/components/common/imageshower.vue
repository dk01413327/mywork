<template>
    <el-dialog :title="title" :visible.sync="visible" append-to-body top="5vh">
                <el-carousel trigger="click" height="500px">
                    <el-carousel-item  v-for="(item,index) in fileList" :key="index" class="text-center">
                        <img :src="item">
                    </el-carousel-item>
                </el-carousel>
            </el-dialog>
</template>
<script>
export default {
    data(){
        return{
            visible:false,
        }
    },
    props:{
        title:{
            type:String,
            default:'写真',
        },
        fileList:{
            type:Array,
            default:[],
        },
        dialogVisible:{
            type:Boolean,
            default:false,
        }
    },
    watch:{
        fileList(data){
            console.log(data);
        },
        dialogVisible(data){
            this.visible = data;
        },
        visible(data){
            this.$emit('visibleChange',data);
        }
    }
}
</script>
<style scoped>
    img{
        width: auto;  
        height: auto;  
        max-width: 100%;  
        max-height: 100%;
    }
</style>


