import {
  ADD_COUNTER,
  ADD_TO_COUNTER
} from './mutation-types.js'
export default {
  addCart(context, payload) {
    // state.cartList.push(payload)但是这样写的话就会添加重复的商品
    // 我们做一个判断
    // let oldProduct = null;
    // for (let item of state.cartList) {
    //   if (item.iid === payload.iid) {
    //     oldProduct = item;
    //   }
    // }
    return new Promise((resolve, reject) => {
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);
      //如果oldProduct里面有值的话，那就说明之前是有的
      if (oldProduct) {
        // oldProduct.count++;
        context.commit(ADD_COUNTER, oldProduct);
        resolve('当前商品数量+1')
      } else {
        payload.count = 1;
        // context.state.cartList.push(payload);
        context.commit(ADD_TO_COUNTER, payload);
        resolve('添加新的商品')
      }
    })
  }
}
