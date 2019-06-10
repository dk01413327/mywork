import Vue from 'vue';
import Vuex from 'vuex';
import Router from 'vue-router';

import Login from '@/components/login/login.vue';
import Page404 from '@/components/common/page404.vue';
import Index from '@/components/common/index.vue';
import Main from '@/components/main';
//公共数据
import User from '@/components/basedata/user'
import Role from '@/components/basedata/role'
import Part from '@/components/basedata/part'
import Eng from '@/components/basedata/eng'
import Chkroute from '@/components/basedata/chkroute'
//会议室预约
import Room from '@/components/meeting/room'
import Meeting from '@/components/meeting/meeting'
import Mybooking from '@/components/meeting/mybooking'
//人力计算
import Mapping from '@/components/calcman/mapping'
import Productive from '@/components/calcman/productive'
import Shippingplan from '@/components/calcman/shippingplan'
import Manreport from '@/components/calcman/manreport'
import Manrequest from '@/components/calcman/manrequest'
//报关系统
import Bando from '@/components/custom/bando'
//仓库系统
import Deliverynote from '@/components/warehouse/deliverynote'
//物品外置系统
import Wfrequest from '@/components/waifang/wfrequest'
import Wfoverview from '@/components/waifang/wfoverview'
//tar
import RepairGroup from '@/components/tar/repairgroup'
import DeviceArea from '@/components/tar/devicearea'
import Device from '@/components/tar/device'
import Tarreport from '@/components/tar/tarreport'

//smt
import StencilMgr from '@/components/smt/stencilmgr'

Vue.use(Router)
Vue.use(Vuex)

export default new Router({
  mode:'history',
  base:'/sed/',
  routes: [
    {
      path:'/',
      name: 'home',
      component: Login,
    },
    {
      path:'/login',
      name: 'login',
      component: Login,
    },
    {
      path:'/wfoverview',
      name:'wfoverview',
      component:Wfoverview,
      meta: {
        // 添加该字段，表示进入这个路由是需要登录的
         requireAuth: true,  
      },
    },
    {
      path:'/meeting',
      name:'meeting',
      component:Meeting,
      meta: {
        // 添加该字段，表示进入这个路由是需要登录的
         requireAuth: true,  
      },
    },
    {      
      path: '/main',
      name: 'main',
      component: Main,
      meta: {
        // 添加该字段，表示进入这个路由是需要登录的
         requireAuth: true,  
      }, 
      children:[              
        {path:'/index',
        meta: {
          // 添加该字段，表示进入这个路由是需要登录的
           requireAuth: true,  
        }, 
        components:{
          index:Index,
          chkroute:Chkroute,
          
          user:User,
          role:Role,
          part:Part,
          eng:Eng,

          room:Room,          
          mybooking:Mybooking,

          mapping:Mapping,
          productive:Productive,
          shippingplan:Shippingplan,
          manreport:Manreport,
          manrequest:Manrequest,

          bando:Bando,
          
          deliverynote : Deliverynote,
          
          wfrequest:Wfrequest,

          repairgroup:RepairGroup,
          devicearea:DeviceArea,
          device:Device,
          tarreport:Tarreport,

          stencilmgr:StencilMgr,

        }}
      ],
      redirect:'/index'
    },
    { path: '/page404', component: Page404 },
    { path: '*', component: Page404 }
  ],
})
