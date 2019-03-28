<template>
    <div id='change-password' >
        <div class="modal-dialog" role="document">
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
                    <button class="btn btn-warning" @click="close">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import myStore from '../../store'
export default {
    name:'changepassword',
    created(){
    },
    methods:{
        close(){
            $('#change-password').remove();
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
            data +='&empno='+myStore.getters.userinfo.emp_no;
            var _this = this;
            myStore.dispatch('changePassword',{'data':data,'cb':(res)=>{
                if(res.errcode == 0){
                    this.$toast('密码修改成功')
                    $('#change-password').remove();
                    window.localStorage.clear();
                }else{
                    this.$toast(res.errmsg)
                }
            }})
            
        }
    }
}
</script>

<style scoped>
    #change-password{
        position: fixed;
        right: 0;
        top: 30px;
        width: 400px;
    }
</style>
