<template>
    <nav class="navbar navbar-light fixed-top page-header" style="">
        
        <span class="navbar-brand mb-0 h1"><img style="height:34px" src='/static/images/logo.gif' /></span>
        <ul class="nav" >
            <li class="nav-item" id="nav-login" v-if="userinfo==null"><button class="btn btn-outline-success" >请登录</button></li>                   
            <li class="nav-item dropdown" id="nav-user" v-else>
                <button class="btn btn-outline-success dropdown-toggle" data-toggle="dropdown" >
                    {{userinfo.emp_name}}
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" @click="showChangePW(true)" style="cursor: pointer;">修改密码</a>
                    <a class="dropdown-item"  @click="logout" style="cursor: pointer;">注销登录</a>
                </div>
            </li>
        </ul>

        <div id='change-password' class="modal-dialog d-none" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary">
                    <h5 class="modal-title" id="title">修改密码</h5>
                </div>
                <div class="modal-body">
                    <form id='form-changepw'>
                        <div class="form-group has-error row">
                            <label for='subject' class="col-3 col-form-label">旧密码</label>
                            <div class="col-9">
                                <input class="form-control" type="password" name="passwd" id="passwd" >
                            </div>
                        </div>
                        <div class="form-group has-error row">
                            <label for='subject' class="col-3 col-form-label">新密码</label>
                            <div class="col-9">
                                <input class="form-control" type="password" name="newpassword" id="newpassword" >
                            </div>
                        </div>
                        <div class="form-group has-error row">
                            <label for='subject' class="col-3 col-form-label">确认密码</label>
                            <div class="col-9">
                                <input class="form-control" type="password" name="repassword" id="repassword" >
                            </div>
                        </div>
                        <div id="changepw-feedback" class="form-row feedback"></div>                      
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" @click="changePassowrd()">确定修改</button>
                    <button class="btn btn-warning" @click="showChangePW(false)">取消</button>
                </div>
            </div>
        </div>

    </nav>
</template>
<script>
//import ChangePassword from '@/components/login/changepassword'
import {mapGetters} from 'vuex'
export default {
    name:'myheader',
    data(){
        return{
            dialogVisible:false,
        }
    },
    computed:{
        ...mapGetters(['userinfo'])
    },
    methods:{        
        logout:function(){
            window.localStorage.clear();
            window.sessionStorage.clear();            
            this.$store.dispatch('logout',()=>{
                this.$router.push({ path: '/login' });
            });
        },
        showChangePW(flag){
           //ChangePassword();
           if(flag){
               $('#change-password').removeClass('d-none');
           }else{
               $('#change-password').addClass('d-none');
           }
           
        },

        changePassowrd(){
            if($('#passwd').val().length == 0){
                $('#changepw-feedback').html('旧密码不能为空');
                return false;
            }
            if($('#newpassword').val().length == 0){
                $('#changepw-feedback').html('新密码不能为空');
                return false;
            }
            if($('#newpassword').val() != $('#repassword').val()){
                $('#changepw-feedback').html('两次密码不一致');
                return false;
            }
            if($('#newpassword').val() == $('#passwd').val()){
                $('#changepw-feedback').html('新密码不能和旧密码一致');
                return false;
            }
            var data =$("#form-changepw").serialize();
            data +='&empno='+this.userinfo.emp_no;
            var _this = this;
            this.$store.dispatch('changePassword',{'data':data,'cb':(res)=>{
                if(res.errcode == 0){
                    this.$message({message:'密码修改成功',type:'success'})
                    this.logout();
                }else{
                    this.$alert(res.errmsg,'出错啦',{type:'error'})
                }
            }})
            
        }      
    }
}
</script>

<style scoped>
    .page-header{
        background:linear-gradient(#e3f2fd,#c1e2f5,#e3f2fd)        
    }
    #change-password{
        position: fixed;
        right: 0;
        top: 30px;
        width: 400px;
    }
</style>

