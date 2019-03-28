<template>    
    <div id='login'>
        <myheader ></myheader>
        <div class="bg-blur"></div>
        <div class="modal-dialog" role="document" >            
            <div class="modal-content">
                <div class="modal-header bg-primary">
                    <h5 class="modal-title text-white" >请登录</h5>
                </div>
                
                <div class="modal-body">
                    <form id='form-login'>
                        <fieldset class="form-group">
                            <label>账号</label>
                            <input type="text" class="form-control" id="user" name="empno" placeholder="请输入工号或ID">
                        </fieldset>
                        <fieldset class="form-group">
                            <label>密码</label>
                            <input type="password" class="form-control" id="password" name="passwd" placeholder="请输入密码">
                        </fieldset>   
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="remember" id="remember">
                            <label class="form-check-label" for="inlineRadio3">记住我</label>
                        </div>                      
                    </form>
                    <small style="color:red;margin-top:5px" id="loginmsg"></small>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" type="submit" id="btn-login" @click="login()">登录</button>
                </div>
                
            </div>
        </div>
        <div class="text-center">© SED系统部</div>
    </div>
</template>
<script>
import { mapGetters,mapActions} from 'vuex'
import myheader from '@/components/header';
export default {
    name:'login',
    computed:{
        ...mapGetters([
            'userinfo'
        ])
    },
    components:{'myheader':myheader},
    created(){        
        window.onresize=function(){$('#login').css('height',window.innerHeight-30);}
        if(this.userinfo != null){
            this.$store.dispatch('getUserMenu',{'data':'no='+this.userinfo.emp_no,'cb':()=>{                
                this.$router.push({ path: '/main' });
            }});
        }
    },
    mounted(){
        $('#login').css('height',window.innerHeight-30);
    },
    methods:{
        close () {
            $('#login').hide();
        },
        login:function() {
            var _this = this;
            var data = $('#form-login').serialize();
            this.$store.dispatch('login',{'data':data,'cb':(res)=>{
                if(res.errcode == 0){
                    if($('#remember').is(':checked')){
                        window.localStorage.setItem('userinfo',JSON.stringify(res.data));
                    }
                    this.$store.dispatch('getUserMenu',{'data':'no='+res.data.emp_no,'cb':()=>{
                        this.$router.push({ path: '/main' });
                    }});                    
                }else{
                    $('#loginmsg').html(res.errmsg);
                }
            }});
            
        }
    },
}

</script>
<style scoped>
input{
   background-color: #ededed;
   color: #777777;
}
#login{
    position: relative;
    padding-top:60px;
}
.bg-blur{
    height: 100%;
    background:url('/static/images/sed.jpg') no-repeat;
    background-size: cover;
    filter:blur(5px);
}
.modal-dialog{
    position: absolute;
    left:0;
    right:0;
    top: 100px;
    bottom:0;
    margin:auto;
    width:500px;
}
</style>

