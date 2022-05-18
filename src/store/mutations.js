import {
  ADD_COUNTER,
  ADD_TO_COUNTER
} from './mutation-types.js'
export default {
  //mutation唯一的目的就是修改state中的状态
  //mutation中的每一个方法尽可能的完成的事件比较单一
  [ADD_COUNTER](state, payload) {
    payload.count++;
  },
  [ADD_TO_COUNTER](state, payload) {
    payload.checked = true;
    state.cartList.push(payload);
  }
}
