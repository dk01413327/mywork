<template>
    <div>
        <div class="el-dialog__wrapper cust-modal" style="z-index:2000" :class="dialogVisible ? 'd-block':'d-none'">
            <el-card class="cust-dialog">
                <div slot="header">
                    <span>审核记录</span>
                </div>
                <el-table :data='checkRecord'>
                    <el-table-column label="审核人" prop="emp_name"></el-table-column>
                    <el-table-column label="审核意见" prop="chk_memo"></el-table-column>
                    <el-table-column label="审核时间" prop="chk_time"></el-table-column>
                </el-table>
                <el-row style="text-align:right;margin-top:10px">
                    <el-col :span="24">
                        <el-button @click="setFalse">关闭</el-button>
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        menuid:{
            type:String,
            default: '',
        },
        applyno:{
            type:String,
            default: '',
        },
        checkVisible:{
            type:Boolean,
            default:false,
        }
    },
    watch:{
        checkVisible(value){
            this.dialogVisible = value;
        },
        applyno(value){
            this.getCheckRecord(value);
        }
    },
    data(){
        return{
            dialogVisible:false,
            checkRecord:[]
        }
    },
    methods:{
        setFalse(){
            this.$emit('setValue')
        },
        getCheckRecord(applyno){
            var data ='applyno='+this.applyno+'&menuid='+this.menuid;
            this.$store.dispatch('getCheckRecord',{data:data,cb:res=>{
                if(res.errcode==0){
                    this.checkRecord= res.data;
                }
            }})
        },
    }
}
</script>
<style>

</style>


