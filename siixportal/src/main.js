// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import myStore from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入自定义组件
import Paging from './components/common/paging';
import UploadMsg from './components/common/uploadmsg';
import Toast from './components/toast/toast';
import Tablebox from './components/common/table';
import imageShower from './components/common/imageshower';
import checkRecord from './components/common/checkrecord';
//引入编辑组件
import manRequestEdt from './components/edittemplate/manrequestedt';
import wfRequestEdt from './components/edittemplate/wfrequestedt';

//引入第三方JS
import 'babel-polyfill'
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '../static/js/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js';
import '../static/js/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css';

//import '../static/js/jquery.PrintArea.js'

import 'wc-messagebox/style.css';
//引入自定义CSS样式
import '../static/css/meeting.css';
import '../static/css/leftmenu.css';

Vue.use(ElementUI)
Vue.use(Toast)
Vue.component("paging",Paging);//全局注册分页组件
Vue.component('uploadmsg',UploadMsg); //全局注册上传文件错误提示组件
Vue.component('Tablebox',Tablebox);  //全局注册表格组件
Vue.component('imageshower',imageShower);  //全局注册表格组件
Vue.component('checkrecord',checkRecord); //显示审核记录组件

Vue.component('manrequestedt',manRequestEdt); //人力申请编辑组件
Vue.component('wfrequestedt',wfRequestEdt);  //物品外置编辑组件

Vue.config.productionTip = false

//全局导航钩子
router.beforeEach((to, from, next) => {
  if(myStore.getters.userinfo==null){
    var userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'));
    if(userinfo == null ){
        userinfo =JSON.parse(window.localStorage.getItem('userinfo'));
    }    
    if(userinfo != null){
      myStore.dispatch('setUserInfo',userinfo);
    }
  }
  if (to.meta.requireAuth) {
    if(myStore.getters.userinfo == null){
      next({path:'/login'})
    }else if(to.path == '/index' && myStore.getters.getMenu == null){
      myStore.dispatch('getUserMenu',{'data':'no='+myStore.getters.userinfo.emp_no,'cb':()=>{
        next();
      }})
    }else{
      next();
    }
  }else{
    next();
  }
})

new Vue({
  el: '#app',
  store: myStore,
  router ,  
  components: { App },
  template: '<App/>',
})
