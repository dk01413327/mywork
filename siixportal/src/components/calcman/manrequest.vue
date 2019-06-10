<template>
    <div>
        <el-button type="primary" @click="add">新增</el-button>
        <div class="spliter"></div>
        <el-table :data="recriutData">
            <el-table-column type="expand" >
                <template slot-scope="scope" >
                    <el-form inline class="table-expand" label-width="80px" label-position="right">
                        <el-form-item label="英语" >
                            <span v-if="scope.row.english_level==0">精通</span>
                            <span v-else-if="scope.row.english_level==1">熟练</span>
                            <span v-else-if="scope.row.english_level==2">良好</span>
                            <span v-else-if="scope.row.english_level==3">一般</span>
                            <span v-else>不需要</span>
                        </el-form-item>
                        <el-form-item label="日语" >
                            <span v-if="scope.row.japanese_level==0">精通</span>
                            <span v-else-if="scope.row.japanese_level==1">熟练</span>
                            <span v-else-if="scope.row.japanese_level==2">良好</span>
                            <span v-else-if="scope.row.japanese_level==3">一般</span>
                            <span v-else>不需要</span>
                        </el-form-item>
                        <el-form-item label="ISO知识">
                            <span v-if="scope.row.iso_level==0">精通</span>
                            <span v-else-if="scope.row.iso_level==1">熟练</span>
                            <span v-else-if="scope.row.iso_level==2">良好</span>
                            <span v-else-if="scope.row.iso_level==3">一般</span>
                            <span v-else>不需要</span>
                        </el-form-item>
                        <el-form-item label="职称" >
                            <span>{{scope.row.pro_title}}</span>
                        </el-form-item>
                        <el-form-item label="专业" >
                            <span>{{scope.row.major}}</span>
                        </el-form-item>
                        <el-form-item label="经历" >
                            <span>{{scope.row.experience}}</span>
                        </el-form-item>
                        <el-form-item label="技能" >
                            <span>{{scope.row.skill}}</span>
                        </el-form-item>
                        
                        <el-form-item label="个性" >
                            <span>{{scope.row.personality}}</span>
                        </el-form-item>
                        <el-form-item label="补充内容" >
                            <span>{{scope.row.supplement}}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column label="申请单号">
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
            <el-table-column label="申请职务" prop="position"></el-table-column>
            <el-table-column label="人数" prop="req_qty"></el-table-column>
            <el-table-column label="需求日期" prop="need_date"></el-table-column>
            <el-table-column label="需求原因" >
                <template slot-scope="scope">
                    <span v-if="scope.row.reason_code==0">离职补充-{{scope.row.reason_desc}}</span>
                    <span v-else-if="scope.row.reason_code==1">扩大生产-{{scope.row.reason_desc}}</span>
                    <span v-else>人事调动-{{scope.row.reason_desc}}</span>
                </template>
            </el-table-column>
            <el-table-column label="性别" >
                <template slot-scope="scope">
                    <span v-if="scope.row.req_sex==0">女</span>
                    <span v-else-if="scope.row.req_sex==1">男</span>
                    <span v-else>不限</span>
                </template>
            </el-table-column>
            <el-table-column label="婚姻">
                <template slot-scope="scope">
                    <span v-if="scope.row.marital_status==0">未婚</span>
                    <span v-else-if="scope.row.marital_status==1">已婚</span>
                    <span v-else>不限</span>
                </template>
            </el-table-column>
            <el-table-column label="年龄" prop="req_age">
                <template slot-scope="scope">
                    <span>{{scope.row.req_age_min}}~{{scope.row.req_age_max}}</span>
                </template>
            </el-table-column>
            <el-table-column label="学历">
                <template slot-scope="scope">
                    <span v-if="scope.row.education==0">初中</span>
                    <span v-else-if="scope.row.education==1">高中/中专</span>
                    <span v-else-if="scope.row.education==2">大专/大学</span>
                    <span v-else-if="scope.row.education==3">本科</span>
                    <span v-else>硕士</span>
                </template>
            </el-table-column>            
            <el-table-column label="操作" min-width="150">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="edit(scope.row)">修改</el-button>
                    <el-button type="text" size="mini" @click="del(scope.row)">删除</el-button>
                    <el-button type="text" size="mini" @click="submit(scope.row)">提交</el-button>
                </template>
                
            </el-table-column>            
        </el-table>
        <checkrecord :applyno="applyno" :menuid='menuRight.menuid' :check-visible="chkDialogVisible" @setValue="changeValue"></checkrecord>
        <manrequestedt :edit-data='editData' :edit-visible="dialogVisible" :approve="false" @setValue="changeValue" @refresh="getData"></manrequestedt>
    </div>

</template>
<script>
import {mapGetters,mapActions} from 'vuex'
export default {
    data(){
        return{
            recriutData: null,
            dialogVisible: false,
            editData: '',
            menuRight: '',

            applyno:'',
            chkDialogVisible:false,
        }        
    },
    computed:{
        ...mapGetters(['userinfo','getPermission','imageUrl'])
    },
    created(){
        this.menuRight = this.getPermission;
        this.getData();
    },
    methods:{
        changeValue(value){
            this.dialogVisible = false;
            this.chkDialogVisible = false;
        },
        add(){
            this.editData = '';
            this.dialogVisible = true;
        },
        getData(){
            this.dialogVisible = false;
            this.$store.dispatch('getRecruitData',{data:'opuser='+this.userinfo.emp_no,cb:res=>{
                this.recriutData = res.data;
            }})
        },
        query(item){
            item.optype = 'query';
            this.editData = JSON.stringify(item);
            this.dialogVisible = true;
            
        },
        edit(item){
            //console.log(typeof(item))
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
                this.$store.dispatch('delRecruitData',{data:'id='+item.id,cb:res=>{
                    if(res.errcode == 0){
                        this.$message({message:res.errmsg,type:'success'});
                        this.getData()
                    }else{
                        this.$alert(res.errmsg,'出错啦',{type:'error'});
                    }
                }})
            })
        },
        submit(item){
            if(item.post_level > 0){
                this.$alert('此单已提交','出错啦',{type:'error'});
                return false;
            }
            this.$confirm('提交后不能修改,确认提交码?','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                var data = 'applyno='+item.apply_no+'&chkuser='+this.userinfo.emp_no
                    +'&menuid='+this.menuRight.menuid+'&chktype=0&chklevel=0&applyuser='+item.apply_user;
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
        margin-bottom: 1px;
    }
    .el-dialog__body{
        padding-bottom: 5px;
    }
    .table-expand{
        font-size: 0;
    }
    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 33%;
    }
    .el-form-item__content{
        color:#21218b;
    }
</style>
