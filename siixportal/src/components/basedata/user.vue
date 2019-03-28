<template>
    <div class="vue-component" > 
        <el-form inline>
            <el-form-item label="工号">
                <el-input v-model="inputEmpno"></el-input>
            </el-form-item>
            <el-button type="primary" @click="showPage(1)">查询</el-button>
            <el-button type="warning" @click="addEmployee" :disabled="getPermission.permission.substr(1,1)==0">新增</el-button>
        </el-form>
        <div class="div-content">
            <el-table :data="pagedata">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-form  label-width="90px">
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="邮件"><span>{{scope.row.email}}</span></el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="手机"><span>{{scope.row.tel}}</span></el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="备注"><span>{{scope.row.remark}}</span></el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="工号" prop="emp_no"></el-table-column>
                <el-table-column label="姓名" prop="emp_name"></el-table-column>
                <el-table-column label="部门" prop="dept"></el-table-column>
                <el-table-column label="职位" prop="position"></el-table-column>
                <el-table-column label="是否启用" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.enabled=='禁用'" class="p-1 bg-danger text-white">{{scope.row.enabled}}</span>
                        <span v-else class="p-1 bg-success text-white">{{scope.row.enabled}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini"  @click="editEmployee(scope.row)" :disabled="getPermission.permission.substr(2,1)==0">修改</el-button>
                        <el-button type="warning" size="mini"  @click="editRole(scope.row)" :disabled="getPermission.permission.substr(2,1)==0">权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <paging class="paging" :page-index="currentPage" :class="{'d-none':(pagedata ? pagedata.length==1 : users.lengt<getPageSize)}"
            :total="users.length" :page-size="getPageSize" @change="pageChange"></paging>
            
        </div>  

        <div class="modal fade" id="div-employee" >
            <div class="modal-dialog" role="document" style="max-width:50%">
                <div class="modal-content" >
                <div class="modal-header bg-primary">
                    <h5 class="modal-title" id="exampleModalLabel">人员维护</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form role="form" id="form-employee" >                       
                        <div class="form-group row">
                            <label for='subject' class="col-2 col-form-label">工号<span class="text-danger">*</span></label>
                            <div class="col-10">
                                <input class="form-control" name="empno" id="empno" placeholder="工号">
                            </div>
                        </div>        
                        
                        <div class="form-group row">
                            <label for='subject' class="col-2 col-form-label">姓名<span class="text-danger">*</span></label>
                            <div class="col-10">
                                <input class="form-control" name="empname" id="empname" placeholder="姓名">
                            </div>
                        </div>  

                        <div class="form-group row">
                            <label for='subject' class="col-2 col-form-label">部门<span class="text-danger">*</span></label>
                            <div class="col-10">
                                <input class="form-control" name="dept" id="dept" placeholder="部门">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for='subject' class="col-2 col-form-label">职位</label>
                            <div class="col-10">
                                <input class="form-control" name="position" id="position" placeholder="职位">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-2 col-form-label">邮件<span class="text-danger">*</span></label>
                            <div class="col-10">
                                <input class="form-control" name="email" id="email" placeholder="邮件">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label  class="col-2 col-form-label">电话<span class="text-danger">*</span></label>
                            <div class="col-10">
                                <input class="form-control" type="number" name="tel" id="tel" placeholder="电话">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-2 col-form-label">维护工程</label>
                            <div class="col-10">
                                <select class="form-control" type="number" name="engid" id="engid" >
                                    <option value="0"></option>
                                    <option v-for="(item,idx) in engs" :key="idx" :value="item.eng_id">{{item.eng_name}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group form-row">
                            <label for='endtime' class="col-2 col-form-label">是否启用</label>
                            <div class="col-10" style="line-height: 40px" >
                                <div class="form-check form-check-inline ">
                                    <input class="form-check-input" type="radio" name="enabled" id="rd-emp-check1" value="Y" checked>
                                    <label class="form-check-label" for="inlineRadio1">启用</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="enabled" id="rd-emp-check2" value="N">
                                    <label class="form-check-label" for="inlineRadio2">禁用</label>
                                </div>
                            </div>
                        </div>   
                        <div class="form-group row">
                            <label for='subject' class="col-2 col-form-label">备注</label>
                            <div class="col-10">
                                <input class="form-control" name="remark" id="emp-remark" placeholder="备注">
                            </div>
                        </div>                             
                        <div id="emp-feedback" class="form-row feedback" ></div>                 
                    </form> 
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="saveEmpData">保存</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>                    
                </div>
                </div>
            </div>
        </div>

        <el-dialog title="权限设置" :visible.sync="dialogVisible">
            <p id="username" class="text-center border-bottom" style="font-size:20px;font-weight:600"></p>
            <div class="row" style="min-height:300px;">
                <el-transfer :titles="['角色列表','已选角色']" 
                    :data="sysroles" 
                    :props="{'key':'role_id','label':'role_name'}"
                    v-model="userroles" style="margin:auto">
                </el-transfer>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">保 存</el-button>
            </span>
        </el-dialog>
    </div>

</template>
<script>
import {mapGetters, mpaActions} from 'vuex'
export default {
    name:'user',
    data(){
        return{
            dialogVisible:false,
            pagedata:null,
            currentPage:1,
            userroles:[],
            sysroles:[],
            engs:null,
            users:[],
            selectUserID:'',
            inputEmpno:'',
        }
    },
    computed:{
        ...mapGetters([
            'userinfo',
            'getRoles','getPermission','getPageSize'
        ]),
    },
    created(){
        var _this = this;
        this.$emit('childtitle', '人员资料');
        this.$store.dispatch('getUser',{'data':'all=true','cb':res=>{
            this.users = res.data;
            this.pagedata = res.data.slice(0,this.getPageSize);
        }});
        this.$store.dispatch('getRoles',null);
        this.$store.dispatch('getEngs',{'cb':(res)=>{
            _this.engs = res.data;
        }})
    },
    updated(){
        this.$store.dispatch('clickMenu');
    },
    methods:{
        pageChange(page){
            this.currentPage = page
            this.showPage(page);
        },
        showPage(page){
            var size = this.getPageSize
            var end = page*size
            var start = (page-1)*size-1

            var arr = this.users;
            var empno = this.inputEmpno;
            if(empno.length>0){
                arr = arr.filter(function(item,idx){
                    return item.emp_no==empno;
                })
            }
            this.pagedata = arr.filter(function(item,idx){
                return idx > start && idx < end;
            })
        },
        addEmployee:function(){
            if(this.userinfo.length ==0){
                this.$toast({'message':'请先登录','mtype':2});
                return false;
            }

            this.opType = 'new';
            $('#empno').attr("readonly",false);
            document.getElementById('form-employee').reset();
            $('.feedback').html();
            $('#div-employee').modal('show');
        },        
        editEmployee(item){
            $('#empno').val(item.emp_no).attr("readonly",true);
            $('#empname').val(item.emp_name);
            $('#dept').val(item.dept);
            $('#position').val(item.position);
            $('#email').val(item.email);
            $('#tel').val(item.tel);
            $('#remark').val(item.remark);
            if(item.enabled=='禁用'){
                $('#rd-emp-check1').prop('checked',false);
                $('#rd-emp-check2').prop('checked',true);                
            }else{
                $('#rd-emp-check2').prop('checked',false);
                $('#rd-emp-check1').prop('checked',true);
            }
            $('#div-employee').modal('show');                    
        },
        saveEmpData:function(){
            if($('#empno').val().length == 0){
                $('#emp-feedback').html('工号不能为空');
                return false;
            }   
            if($('#empname').val().length == 0){
                $('#emp-feedback').html('姓名不能为空');
                return false;
            }
            if($('#email').val().length == 0){
                $('#emp-feedback').html('邮件不能为空');
                return false;
            }else if($('#email').val().indexOf('@') < 0){
                $('#emp-feedback').html('邮件格式不正确');
                return false;
            }
            if($('#tel').val().length == 0){
                $('#emp-feedback').html('电话不能为空');
                return false;
            }
            var data = $('#form-employee').serialize();
            
            if ($('#empno').attr("readonly")=='readonly')
              data += '&optype=edit'+'&userno='+this.userinfo.emp_no
            else
              data += '&optype=new'+'&userno='+this.userinfo.emp_no
            
            this.$store.dispatch('saveUser',{'data':data,'cb':(res)=>{
                if(res.errcode==0){
                    this.$message(res.errmsg,{type:'success'})
                    $('#div-employee').modal('hide');
                    this.$store.dispatch('getUser',{'data':'all=true','cb':res=>{
                        this.users = res.data;
                        this.pagedata = res.data.slice(0,this.getPageSize)
                    }});
                }else{
                    this.$alert(res.errmsg,'出错啦',{type:'errorr'})
                }
            }});               
        },
        editRole(item){
            var roles = item.permission;
            this.sysroles = this.getRoles;
            var arr = [];
            this.userroles = [];
            if(roles){
                arr = roles.split(';');
            }
            for(var i=0; i < arr.length; i++){
                var role = this.sysroles.filter(item => {return item.role_name==arr[i]});
                this.userroles.push(role[0].role_id)
            }
            this.selectUserID = item.emp_no;
            $('#username').html('用户:'+item.emp_name);
            this.dialogVisible = true;
        },
        selected(type,idx){
            if(type==0){
                $('.role-item').removeClass('selected');
                $('.role-item:eq('+idx+')').addClass('selected');
            }else{
                $('.user-item').removeClass('selected');
                $('.user-item:eq('+idx+')').addClass('selected');
            }
        },
        addUserRole(){
            var str = $('.ul-role .selected').html();
            if( this.userroles.indexOf(str)>=0){
                this.$toast('已有该角色')
                return false;
            }
            this.userroles.push(str);
        },
        removeUserRole(){
            var str = $('.ul-user .selected').html();
            var idx = this.userroles.indexOf(str);
            this.userroles.splice(idx,1);
        },
        save(){
            var _this = this;
            //var ids = Array();
           // $.each(this.userroles,function(idx,item){
           //     var role = _this.sysroles.filter(function(e){return e.role_name==item});
           //     ids.push(role[0].role_id);
           // });
            //var data = 'userid='+$('#username').data('id')+'&roles='+ids+'&no='+this.userinfo.emp_no;
            if(this.userroles.length==0){
                this.$alert('请选择角色','出错啦',{type:'error'});
                return false;
            }
            var data = 'userid='+this.selectUserID+'&roles='+this.userroles+'&no='+this.userinfo.emp_no;
            var params = {'data':data,'cb':res => {
                if(res.errcode == 0){
                    this.$message({message:res.errmsg,type:'success'});
                    this.dialogVisible = false;
                    this.$store.dispatch('getUser',{'data':'all=true','cb':res=>{
                        _this.users = res.data;
                        _this.showPage(1);
                    }});
                }else{
                    this.$alert(res.errmsg,'出错啦',{type:'error'})
                }                
            }};
            this.$store.dispatch('saveUserRole',params);
        }
    }   
}
    
            
</script>
<style lang="scss" scoped>
    .div-roles{
        height: 100%;
        >ul{
            border: 1px inset;
            height: 90%;
            list-style: none;
            padding: 0;
            overflow: hidden;
            overflow-y: scroll;
            >li{
                padding-left:5px;
                line-height: 40px;
                background-color:#eee;
                border-bottom: 1px solid #fff;
                cursor: pointer;
            }
        }
        .selected{
            background-color: forestgreen;
        }
    }
    .div-operator{
        margin: auto;
        text-align: center;
        >p{
            cursor: pointer;
            color: blue;
            opacity: 0.5;
        }
        >p:hover{
           opacity: 0.8;
        }
    }
</style>
