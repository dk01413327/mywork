import Vue from 'vue'
import Vuex from 'vuex'
import myStore from '../../store'
import ChangePassword from '@/components/login/changepassword.vue'

//Vue.use(Vuex)

let ChangeConstrutor = Vue.extend(ChangePassword)

let myChange = ()=>{
	let ChangeDom = new ChangeConstrutor({
		el:document.createElement('div')    //将组件挂载到新创建的div上
	})
    document.body.appendChild(ChangeDom.$el)   //把组件的dom添加到body里
}
export default myChange
