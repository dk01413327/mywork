<template>
    <el-container>
        <el-aside class="aside" style="border:1px solid #eee;margin-right:20px">
            <el-tabs v-model="settingType" @tab-click="handleClick">
                <el-tab-pane label="部门审核" name="dept">
                    <ul style="list-style:none">
                        <li class="clickable dept-item"  v-for="(item,index) in deptData" :key="index"
                            @click="showDeptRoute(item,index)">{{item.dept_name}}</li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="菜单审核" name="menu">
                    <el-tree highlight-current default-expand-all :data="getMenu" :props="defaultProps" @node-click="showChkRoute">
                        <span slot-scope="{node,data}">
                            <span class="tree-item">{{ node.label }}</span>
                        </span>
                    </el-tree>
                </el-tab-pane>
            </el-tabs>
        </el-aside>
        <el-container>
            <el-header height="40px">
                <el-button type="primary" @click="showDialog" :disabled="notSetup">审核设置</el-button>
                
            </el-header>
            <div class="spliter"></div>
            <el-table border :data="chkRoute" >
                <el-table-column label='审核顺序' >
                    <template slot-scope="scope">
                        <input class="row-level" style="border:none;width:100%" :value="scope.row.chk_level">
                    </template>
                </el-table-column>
                <el-table-column label='发送邮件' >
                    <template slot-scope="scope">
                        <el-checkbox :checked="scope.row.need_mail==1"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label='审核人' prop="emp_name"></el-table-column>
                <el-table-column label='部门' prop="dept"></el-table-column>
                <el-table-column label='设定时间' prop="updated_time"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="save(scope.$index,scope.row)">保存</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-container>
        <el-dialog title="审核流程设置" :visible.sync="dialogVisible">
            <div style="text-align:center">
            <el-transfer :titles="['用户列表','审核列表']" style="text-align: left; display: inline-block"
                filterable
                :data="users" 
                :props="{'key':'emp_no','label':'emp_name'}"
                v-model="chkusers" >
            </el-transfer>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="saveRoute">保存</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
export default {
    data(){
        return {
            dialogVisible:false,
            notSetup : true,
            selMenu : '',
            selDept : 0,
            chkRoute:[],
            users:[],
            deptData:[],
            chkusers:[],
            settingType:'dept',
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    
    computed:{
        ...mapGetters(['getMenu','userinfo','getPermission'])
    },
    created(){
        this.getUsers();
        this.getDept();
    },
    mounted(){
        $('.aside').css('height',window.innerHeight-180)
    },
    methods:{
        getUsers(){
            var _this = this;
            this.$store.dispatch('getUser',{cb:res=>{
                _this.users = res.data;
            }})
        },
        getDept(){
            this.$store.dispatch('getDept',{cb:res=>{
                this.deptData = res.data;
            }})
        },
        getChkRoute(){
            var _this = this;
            this.chkusers = [];             
            this.$store.dispatch('getChkRoute',{data:'mid='+this.selMenu,cb:res=>{
                _this.chkRoute = res.data;                
                res.data.forEach(element => {
                    _this.chkusers.push(element.emp_no)
                });
            }})
        },
        showChkRoute(data,node,self){
            //$('.is-current .el-tree-node__label').css('background-color', 'blue');
            if(this.selMenu == data.menu_id) return ;
            this.selMenu = data.menu_id;
            
            if(data.need_chk==0){
                this.notSetup = true;    
                this.$message({message:'此菜单不需要审核',type:'warning'});
                this.chkRoute=[];
                return;
            }else{
                this.notSetup = false;                
                this.getChkRoute();
            }
        },
        showDialog(){
            this.dialogVisible = true;
        },
        saveRoute(){
            if(this.chkusers.length==0){this.$message({message:'请选择审核人员',type:'error'});return;}
            var _this = this;
            var data = 'users='+this.chkusers.toString()+'&menuid='+this.selMenu+'&deptid='+this.selDept+'&opuser='+this.userinfo.emp_no;
            this.$store.dispatch('saveChkRoute',{data:data,cb:res=>{
                if(res.errcode == 0){
                    this.$message({message:'保存成功',type:'success'});
                    _this.dialogVisible = false;
                    if(this.settingType=='dept'){
                        this.getDeptChkRoute();
                    }else{
                        this.getChkRoute();
                    }
                }else{
                    this.$alert(res.errmsg,'出错啦',{type:'error'});
                }
            }})
        },
        save(index,item){
            var chklevel = $('.row-level:eq('+index+')').val();
            var needmail = $('.el-checkbox__original:eq('+index+')').is(":checked") ? 1 : 0;
            this.$store.dispatch('saveRouteLevel',{data:'chklevel='+chklevel+'&needmail='+needmail+'&levelid='+item.id,cb:res=>{
                if(res.errcode==0){
                    this.$message({message:'保存成功',type:'success'});
                    if(this.settingType=='dept'){
                        this.getDeptChkRoute();
                    }else{
                        this.getChkRoute();
                    }                    
                }else{
                    this.$alert(res.errmsg,'出错啦',{type:'error'});
                }
            }})
        },
        handleClick(tab,event){
            this.notSetup = true;
            this.settingType = tab.name;
            this.chkRoute = []
        },
        getDeptChkRoute(){
            var _this = this;
            this.chkusers = [];
            this.$store.dispatch('getDeptCheckRoute',{data:'deptid='+this.selDept,cb:res=>{
                if(res.errcode==0){
                    this.chkRoute = res.data;
                    res.data.forEach(element => {
                        _this.chkusers.push(element.chk_emp)
                    });
                }
            }})
        },
        showDeptRoute(item,index){
            this.notSetup = false;
            $('.dept-item').removeClass('bg-bbdaf1');
            $('.dept-item:eq('+index+')').addClass('bg-bbdaf1');
            this.selDept = item.id;
            this.getDeptChkRoute();            
        }
    }
}
</script>
<style scoped>
    .aside{
        -ms-overflow-style: none;
    }
    .aside::-webkit-scrollbar {display: none;}
    .cell{
        text-align: center;
    }
    li{
        padding:5px;
    }
    .dept-item:hover{
        background:#eee;
    }
    .bg-none{
        background: none;
    }
    .bg-bbdaf1{
        background:#bbdaf1;
    }
</style>
