<template>
    <div class="vue-component">
        <el-row>
            <el-col :span="24">
                <div class="jumbotron col-12">
                    <h1 class="display-4">{{userinfo.emp_name}},欢迎使用!</h1>
                </div>
                <div class="card" v-if="mycheck && mycheck.length>0">
                    <h5 class="card-header">待审单据</h5>
                    <div class="card-body">
                        <el-table :data="mycheck">
                            <el-table-column label="单据类型" prop="menu_name"></el-table-column>
                            <el-table-column label="申请单号" >
                                <template slot-scope="scope">
                                    <span class="clickable" @click="query(scope.row)">{{scope.row.apply_no}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="申请人" prop="emp_name"></el-table-column>
                            <el-table-column label="申请部门" prop="dept"></el-table-column>
                            <el-table-column label="提交时间" prop="chk_time" min-width="140"></el-table-column>
                            <el-table-column label="操作" min-width="120px">
                                <template slot-scope="scope">
                                    <el-button size="mini"  type="primary" @click="approve(scope.row)">批准</el-button>
                                    <el-button size="mini"  type="danger" @click="back(scope.row)">退单</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="5" style="margin-top:5px" v-if="mycheck.length==0">
            <el-col :span="12" >
                <div class="card" style="height:250px">
                    <h5 class="card-header">系统日志</h5>
                    <div class="card-body">
                        <ul v-for="(item,idx) in syslog" :key="idx">
                            <li class="head-log">
                                <el-badge value="new" v-if="idx==0"><h4 class="card-title text-primary float-left" >{{item.version}}</h4></el-badge>
                                <h4 class="card-title text-primary float-left" v-else>{{item.version}}</h4>
                                <small>修改日期:{{item.modify_time}}</small>
                            </li>
                            
                            <li class="text-log">{{item.modify_log}}</li>
                        </ul>                       
                    </div>
                </div>
            </el-col>
            <el-col :span="12" >
                
            </el-col>
        </el-row>
        <manrequestedt :edit-data='editData' :edit-visible="manVisible" :approve="true" :menuid="menuid"
            @setValue="changeValue" @refresh="getMyData"></manrequestedt>
        <wfrequestedt :edit-data='editData' :edit-visible="wfVisible" :approve="true" :menuid="menuid"
            @setValue="changeValue" @refresh="getMyData"></wfrequestedt>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    data(){
        return {
            syslog:null,
            mycheck:[],
            wfVisible:false,
            manVisible:false,
            editData: '',
            menuid: '',
        }
    },
    computed:{
        ...mapGetters(['userinfo','imageUrl'])
    },
    created(){
        this.$emit('childtitle', '');        
        this.getMyData();     
    },
    updated(){ 
    },
    methods:{
        changeValue(value){
            this.wfVisible = false;
            this.manVisible = false;
        },
        getMyData(){
            var _this = this;
            this.$store.dispatch('getSystemLog',{data:'userno='+this.userinfo.emp_no,'cb':(res)=>{
                _this.syslog = res.data[0];
                _this.mycheck = res.data[1];
            }})
            this.changeValue(false);
        },
        approve(item){
            var _this = this;
            this.$confirm('确定批准此单?','提示',{confirmButtonText:'确定',cancelButtonText:'取消'}).then(({value})=>{
                var post = 'applyno='+item.apply_no
                          +'&chkuser='+_this.userinfo.emp_no+'&chktype=1&memo='+value
                          +'&menuid='+item.menu_id+'&chklevel='+item.chk_level;
                this.$store.dispatch('approveRequest',{data:post,cb:(res)=>{
                    if(res.errcode==0){
                        this.$message({message:'审核成功',type:'success'});
                        _this.getMyData(); 
                    }else{
                        this.$alert(res.errmsg,'出错啦',{type:'error'});
                    }
                }})
            })
        },
        back(item){
            var _this = this;
            this.$prompt('请输入退单原因:','提示',{confirmButtonText:'确定',cancelButtonText:'取消'}).then(({value})=>{
                var post = 'applyno='+item.apply_no
                          +'&chkuser='+_this.userinfo.emp_no+'&chktype=2&memo='+value
                          +'&menuid='+item.menu_id+'&chklevel='+item.chk_level;
                this.$store.dispatch('approveRequest',{data:post,cb:(res)=>{
                    if(res.errcode==0){
                        this.$message({message:'退单成功',type:'success'});
                        _this.getMyData(); 
                    }else{
                        this.$alert(res.errmsg,'出错啦',{type:'error'});
                    }
                }})
            })
        },
        query(data){
            this.menuid = data.menu_id;
            this.$store.dispatch('getCheckDetail',{data:'menuid='+data.menu_id+'&applyno='+data.apply_no,cb:res=>{
                if(res.errcode==1){
                    this.$alert(res.errmsg,'出错啦',{type:'error'});
                }else{
                    this.editData = JSON.stringify(res.data[0]);

                    this.wfVisible = data.menu_id == 'm0701'
                    this.manVisible =  data.menu_id == 'm0405';
                }
            }})                       
        },
        preview(){
            this.dialogImage = true;
        },
        
    }
}


</script>
<style lang="scss" scoped>
    .head-log{
        list-style: none;
        margin-left: -40px;
        line-height: 40px;
        >small{
            color: rgba(0,0,0,.4);
            display: inline-block;
            font-size: .875em;
            margin-left: .5em;
        }
    }
    .text-log{
        font-size: 14px;
    }
    .clickable{
        cursor: pointer;
        color: rgb(95, 154, 243);
    }
    img{  
        width: auto;  
        height: auto;  
        max-width: 100%;  
        max-height: 100%;     
    }
    .el-form-item{
        margin-bottom: 2px;
    }
</style>

