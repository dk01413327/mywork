<template>
    <div>
        <el-input placeholder="请输入维修组别" v-model="groupname" style="width: 300px">
            <el-button slot="append" icon="el-icon-plus" @click="addGroup"></el-button>
        </el-input>
        <div class="spliter"></div>
        <el-table :data="repairGroup">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-table :data="wechatUser ? (wechatUser.filter(item=>{return item.group_id==scope.row.id})) : wechatUser">
                        <el-table-column label="工号" prop="emp_no"></el-table-column>
                        <el-table-column label="姓名" prop="emp_name"></el-table-column>
                        <el-table-column label="部门" prop="dept"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="small" type="danger" @click="delGroupUser('user',scope.row.id)">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column label="组别名称" prop="group_name"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.enabled==0">禁用</span>
                    <span v-else>启用</span>
                </template>
            </el-table-column>
            <el-table-column label="更新人" prop="emp_name"></el-table-column>
            <el-table-column label="更新时间" prop="update_time"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="showAdd(scope.row)">添加成员</el-button>
                    <el-button size="small" type="danger" @click="delGroupUser('group',scope.row.id)">移除成员</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" title="添加维修员">
            <el-table :data="wechatUser ? (wechatUser.filter(item=>{return item.group_id==0})) : wechatUser" @selection-change="selected">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="工号" prop="emp_no"></el-table-column>
                <el-table-column label="姓名" prop="emp_name"></el-table-column>
                <el-table-column label="部门" prop="dept"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addGroupUser">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
export default {
    data(){
        return{
            dialogVisible:false,
            groupname:'',
            repairGroup:null,
            wechatUser:null,

            selGroupID:0,
            selectUser:[],
        }
    },
    computed:{
        ...mapGetters(['userinfo','getPermisson','errTitle'])
    },
    created(){
        this.getData();
    },
    methods:{
        getData(){
            this.$store.dispatch('getRepairGroup',{data:'opuser='+this.userinfo.emp_no,cb:(res)=>{
                this.wechatUser = res.data[1];
                this.repairGroup = res.data[0];                
            }})
        },
        addGroup(){
            if(this.groupname==''){
                this.$alert('请输入组别名称','出错啦',{type:error});
                return;
            }
            this.$store.dispatch('saveRepairGroup',{data:'gname='+this.groupname+'&opuser='+this.userinfo.emp_no,cb:(res)=>{
                if(res.errcode==0){
                    this.$message({message:res.errmsg,type:'success'})
                    this.getData();
                }else{
                    this.$alert(res.errmsg,this.errTitle,{type:'error'})
                }
            }})
        },
        showAdd(item){
            this.selGroupID=item.id;
            this.dialogVisible = true;
        },
        addGroupUser(){
            if(this.selectUser.length==0){
                this.$alert('没有选择维修员','出错啦',{type:'error'});
                return false;
            }
            var data = 'groupid='+this.selGroupID+'&userids='+this.selectUser+'&opuser='+this.userinfo.emp_no;
            this.$store.dispatch('saveGroupUser',{data:data,cb:res=>{
                if(res.errcode==0){
                    this.$message({message:res.errmsg,type:'success'});
                    this.dialogVisible = false;
                    this.getData();
                }else{
                    this.$alert(res.errmsg,this.errTitle,{type:'error'});
                }
            }})
        },
        delGroupUser(optype,id){
            if(optype=='user'){
                var message = '确认移除该成员吗?';
            }else{
                message = '确认移除所有成员吗?';
            }
            this.$confirm(message,'提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                var data = 'optype='+optype+'&id='+id;
                this.$store.dispatch('delGroupUser',{data:data,cb:res=>{
                    if(res.errcode==0){
                        this.$message({message:'删除成功',type:'success'});
                        this.getData();
                    }else{
                        this.$alert(res.errmsg,this.errTitle,{type:'error'})
                    }                    
                }});
            })
        },
        selected(selection){
            this.selectUser = [];
            for(var i = 0; i < selection.length; i++){
                this.selectUser[i] = selection[i].id;
            }
        }
    }
}
</script>
<style scoped>

</style>
