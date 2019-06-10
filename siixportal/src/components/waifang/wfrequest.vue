<template>
    <div>
        <el-button type="primary" @click="add">新增</el-button>
        <div class="spliter"></div>
        <el-table :data="reqdata" bordered>
            <el-table-column label="申请编号" prop="apply_no">
                <template slot-scope="scope">
                    <span class="clickable" @click="query(scope.row)">{{scope.row.apply_no}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">  
                    <span class="clickable" v-if="scope.row.status==1"  @click="getCheckRecord(scope.row.apply_no)">已关闭</span>
                    <span class="clickable" v-else-if="scope.row.checked==1" @click="getCheckRecord(scope.row.apply_no)">审核完成</span>
                    <span class="clickable" v-else-if="scope.row.post_level>0" @click="getCheckRecord(scope.row.apply_no)">已提交</span>
                    <span class="clickable" v-else  @click="getCheckRecord(scope.row.apply_no)">未提交</span>
                </template>
            </el-table-column>
            <el-table-column label="存放物品" prop="store_goods"></el-table-column>
            <el-table-column label="物品状态" prop="goods_status"></el-table-column>
            <el-table-column label="存放位置" prop="loc_code"></el-table-column>
            <el-table-column label="存放数量" prop="qty"></el-table-column>
            <el-table-column label="开始日期" prop="start_time"></el-table-column>
            <el-table-column label="结束日期" prop="end_time"></el-table-column>
            <el-table-column label="责任人" prop="duty_by"></el-table-column>
            <el-table-column label="存放原因" prop="store_reason"></el-table-column>
            <el-table-column label="申请时间" prop="apply_time"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="120">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
                    <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
                    <el-button @click="submit(scope.row)" type="text" size="small">提交</el-button>
                </template>
            </el-table-column>
        </el-table>
        <checkrecord :applyno="applyno" :menuid='menuRight.menuid' :check-visible="chkDialogVisible" @setValue="changeValue"></checkrecord>
        <wfrequestedt :edit-data='editData' :edit-visible="dialogVisible" :approve="false" @setValue="changeValue" @refresh="getData"></wfrequestedt>
    </div>
</template>
<script>
import {Getters,Actions, mapGetters} from 'vuex';
export default {
    data(){
        return{
            menuRight:'',
            editData:'',
            dialogVisible:false,
            reqdata:[],

            applyno:'',
            chkDialogVisible:false,
        }
    },
    computed:{
        ...mapGetters(['userinfo','getPermission'])
    },
    created(){
        this.menuRight = this.getPermission;
        this.getData();
    },
    methods:{ 
        changeValue(value){
            this.dialogVisible = value;
            this.chkDialogVisible = false;
        },
        getData(){
            this.$store.dispatch('getWFRequestData',{data:'opuser='+this.userinfo.emp_no,cb:res=>{
                this.reqdata = res.data;
            }});
            this.dialogVisible = false;
        },
        add(){
            this.editData = '';
            this.dialogVisible = true;
        },

        edit(item){
            if(item.post_level > 0){
                this.$alert('此单已提交','出错啦',{type:'error'});
                return false;
            }
            item.optype = 'edit';
            this.editData = JSON.stringify(item);
            this.dialogVisible = true;
        },
        del(item){
            if(item.post_level > 0){
                this.$alert('此单已提交','出错啦',{type:'error'});
                return false;
            }
            this.$confirm('确认删除此单?','提示',{confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'}).then(()=>{
                this.$store.dispatch('delWFRequestData',{data:'id='+item.id,cb:res=>{
                    if(res.errcode == 0){
                        this.$message({message:res.errmsg,type:'success'});
                        this.getData()
                    }else{
                        this.$alert(res.errmsg,'出错啦',{type:'error'});
                    }
                }})
            })
        },
        query(item){
            item.optype = 'query'
            this.editData = JSON.stringify(item);
            this.dialogVisible = true;
        },
        submit(item){
            if(item.post_level > 0){
                this.$alert('此单已提交','出错啦',{type:'error'});
                return false;
            }
            this.$confirm('提交后不能修改,确认提交吗?','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                var data = 'applyno='+item.apply_no+'&chkuser='+this.userinfo.emp_no+'&menuid='
                    +this.menuRight.menuid+'&chktype=0&chklevel=0&applyuser='+item.apply_user
                this.$store.dispatch('approveRequest',{data:data,cb:res=>{
                    if(res.errcode==0){
                        this.$message({message:'提交成功',type:'success'});
                        this.getData();
                    }else{
                        this.$alert(res.errmsg,'出错啦',{type:'error'})
                    }                    
                }});
            })
        },
        getCheckRecord(applyno){
            this.applyno = applyno;
            this.chkDialogVisible = true;
        },
    }
}
</script>
<style scoped>    
    .el-form-item{
        margin-bottom: 2px;
    }
    img{  
        width: auto;  
        height: auto;  
        max-width: 100%;  
        max-height: 100%;     
    }

</style>
