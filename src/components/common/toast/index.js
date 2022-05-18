import Toast from './Toast'
import Vue from 'vue'
const obj = {}
//在obj.install里面其实是有一个参数的，参数就是vue
obj.install = function () {
  // Vue.extend(Toast);
  // console.log('执行了obj的install函数')
  // 这里不能用el，因为还没有挂载，el的结果是undefined
  // document.body.appendchild(Toast.$el);

  //1. 选创建组件构造器
  const toastContrustor = Vue.extend(Toast);
  // 2.new的方式，根据组件构造器，可以创建出一个组件对象
  const toast = new toastContrustor()
  // 3.将组建对象，手动挂载到某一个对象上
  toast.$mount(document.createElement('div'));
  // 这样我们的toast.$el就是div
  document.body.appendChild(toast.$el);

  Vue.prototype.$toast = toast;
}
export default obj
