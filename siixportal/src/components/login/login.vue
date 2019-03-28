<template>    
    <div id='login'>
        <div><img class="logo" src="/static/images/logo.gif"></div>
        <div class="bg-blur">         
            <h2 class="head">SED PORTAL</h2>
        </div>
        <div class="modal-dialog login" role="document" >            
            <div class="modal-content">
                <div class="modal-header ">
                    <h3 class="modal-title" >请登录</h3>
                </div>                
                <div class="modal-body">
                    <form id='form-login'>
                        <fieldset class="form-group">
                            <label>账号</label>
                            <input type="text" class="form-control" id="user" name="empno" placeholder="请输入工号或ID">
                        </fieldset>
                        <fieldset class="form-group">
                            <label>密码</label>
                            <input type="password" class="form-control" id="password" name="passwd" placeholder="请输入密码" >
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
        <div class="footer mt-4 text-center">© SED系统部</div>
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
        $('#login').css('height',window.innerHeight);
        var _this = this;
        $("#password").keydown(function(e) {  
           if (e.keyCode == 13) {  
                _this.login();
           }  
        });
        $("#user").keydown(function(e) {  
           if (e.keyCode == 13) {  
               $("#password")[0].focus();
           }  
        });
    },
    methods:{
        close () {
            $('#login').hide();
        },
        login() {
            var _this = this;
            var data = $('#form-login').serialize();
            this.$store.dispatch('login',{'data':data,'cb':(res)=>{
                console.log(res)
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
            
        },
    },
}

</script>
<style scoped>
.logo{
    padding: 5px 10px;
    width: 120px;
}
.head{
    text-shadow: 3px 3px #000;
    color: #fff;
    text-align: center;
    padding-top: 90px;
}
input{
   background-color: #ededed;
   color: #777777;
}
#login{
    height: 100%;
    position: relative;
    background: #fff;
}
.bg-blur{
    height: 350px;
    background:url('/static/images/bg.jpg') no-repeat;
    background-size: cover;    
}
.modal-dialog{
    position: absolute;
    left:0;
    right:0;
    top: 200px;
    margin:auto;
    width:500px;
    box-shadow: 0px 0px 5px 5px #333
}
.modal-content{
    z-index: 1;
    overflow: hidden;
    
}
.modal-content::after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    filter:blur(200px);
    z-index: -1;
    margin: -30px;
}
.footer{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
}
</style>

