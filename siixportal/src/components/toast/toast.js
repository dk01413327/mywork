import Vue from 'vue'
import toast from '@/components/toast/toast.vue'
const ToastConstructor = Vue.extend(toast)
let removeDom = event => {
    event.target.parentNode.removeChild(event.target);
 
};
ToastConstructor.prototype.close = function() {
    this.visible = false;
    this.$el.remove();
    //this.$el.addEventListener('transitionend', removeDom);
};
const Toast = (options = {}) => { 
    var instance = new ToastConstructor().$mount(document.createElement('div'))
    let duration = options.duration || 2500;
    instance.message = typeof options === 'string' ? options : options.message
    instance.position = options.position || 'middle'
    instance.mtype = options.mtype || 0;
    document.body.appendChild(instance.$el);
    instance.visible = true;
    if(instance.mtype < 3){
        Vue.nextTick(() => {
            instance.timer = setTimeout(function() {
                instance.close();
            }, duration);
        })  
    }
     
    
    return instance
}
function regToast() {
    // 将组件注册到 vue 的 原型链里去,
    // 这样就可以在所有 vue 的实例里面使用 this.$toast()
    Vue.prototype.$toast = Toast
  }
 
export default regToast
