<template>
    <div class="vue-component" > 
        <div class="div-content">
            <table>
                <tr>
                    <td>工号</td><td><input id="qry-empno" class="form-control"></td>
                    <td><button class="btn btn-primary" @click="showPage(1)">查询</button></td>
                    <td>
                        <button  class="btn btn-primary" @click="addEmployee" :disabled="getPermisson.permission.substr(1,1)==0">新增</button>
                    </td>
                </tr>
            </table>
            
            <div class="div-table">
                <table class="table table-sm table-bordered table-hover mb-1 ">
                    <thead class="text-center"><tr ><th>工号</th><th>姓名</th><th>部门</th><th>职位</th><th>是否启用</th>
                        <th>邮件</th><th>电话</th><th>备注</th>
                        <th>操作</th></tr></thead>
                    <tbody>
                        <tr v-for='(emp,idx) in pagedata ? pagedata:users' :key="idx" v-if="idx < pageSize">
                            <td>{{emp.emp_no}}</td>
                            <td>{{emp.emp_name}}</td>
                            <td>{{emp.dept}}</td>
                            <td>{{emp.position}}</td>
                            <td class="text-center text-white"><span class="bg-success p-1" :class="{'bg-danger':emp.enabled=='禁用'}">{{emp.enabled}}</span></td>
                            <td>{{emp.email}}</td>
                            <td>{{emp.tel}}</td>
                            <td >{{emp.remark}}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-success td-btn" @click="editEmployee(idx)" :disabled="getPermisson.permission.substr(2,1)==0">修改</button>
                                <button class="btn btn-sm btn-danger td-btn" @click="editRole(idx)" :disabled="getPermisson.permission.substr(2,1)==0">权限</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <paging class="paging" :page-index="currentPage" :class="{'d-none':(pagedata ? pagedata.length==1 : users.lengt<pageSize)}"
            :total="users.length" :page-size="pageSize" @change="pageChange"></paging>
            
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

        <div class="modal fade" id="div-permission" >
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header bg-primary">
                    <h5 class="modal-title">权限设置</h5>
                    
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p id="username" class="text-center border-bottom"></p>
                    <div class="row" style="height:400px">
                        <div class="div-roles col">
                            <p>角色列表</p>
                            <ul class="ul-role">
                                <li class="role-item" :class="{'selected':idx==0}" v-for="(role,idx) in sysroles" :key="idx" @click="selected(0,idx)">{{role.role_name}}</li>
                            </ul>
                        </div>
                        <div class="col-1 div-operator">
                            <p @click="addUserRole"><span class="fa fa-angle-double-right fa-2x"></span></p>
                            <p @click="removeUserRole"><span class="fa fa-angle-double-left  fa-2x"></span></p>
                        </div>
                        <div class="div-roles col">
                            <p>拥有角色</p>
                            <ul class="ul-user">
                                <li class="user-item" :class="{'selected':idx==0}" v-for="(role,idx) in userroles" :key="idx" @click="selected(1,idx)">{{role}}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="save">保存</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>                    
                </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import {mapGetters, mpaActions} from 'vuex'
export default {
    name:'user',
    data(){
        return{
            pagedata:null,
            pageSize:9,
            currentPage:1,
            userroles:[],
            sysroles:[],
            engs:null,
            users:[],
        }
    },
    computed:{
        ...mapGetters([
            'userinfo',
            'getRoles','getPermisson'
        ]),
    },
    created(){
        var _this = this;
        this.$emit('childtitle', '人员资料');
        this.$store.dispatch('getUser',{'data':'all=true','cb':res=>{
            this.users = res.data;
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
            var size = this.pageSize
            var end = page*size
            var start = (page-1)*size-1

            var arr = this.users
            if($('#qry-empno').val().length>0){
                arr = arr.filter(function(item,idx){
                    return item.emp_no==$('#qry-empno').val();
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
        editEmployee :function(obj){
            var arr = this.pagedata ? this.pagedata : this.users;
            $.each(arr,function(idx,item){                
                if(obj == idx){
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
                }
            })              
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
                this.$toast(res.errmsg)
                if(res.errcode==0){
                    $('#div-employee').modal('hide');
                    this.$store.dispatch('getUser',{'data':'all=true','cb':res=>{
                        this.users = res.data;
                    }});
                }
            }});               
        },
        editRole(idx){                 
            var data = this.pagedata ? this.pagedata : this.users;
            var roles = data[idx].permission;
            console.log(this.getRoles);
            this.sysroles = this.getRoles;
            this.userroles = [];
            if(roles != null){
                this.userroles = roles.split(';');
            }
            $('#username').html('用户:'+data[idx].emp_name).attr('data-id',data[idx].emp_no);
            $('#div-permission').modal('show');
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
            var ids = Array();
            $.each(this.userroles,function(idx,item){
                var role = _this.sysroles.filter(function(e){return e.role_name==item});
                ids.push(role[0].role_id);
            });
            var data = 'userid='+$('#username').data('id')+'&roles='+ids+'&no='+this.userinfo.emp_no;
            var params = {'data':data,'cb':res => {
                this.$toast(res.errmsg);
                this.$store.dispatch('getUser',{'data':'all=true','cb':res=>{
                    _this.users = res.data;
                    _this.showPage(1);
                }});
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
