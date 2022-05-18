<template>
  <div class="cart">
    <!-- 上面的导航 -->
    <nav-bar class="cart-nav">
      <div slot="center">购物街({{ length }})</div>
    </nav-bar>
    <!-- 商品的列表 -->
    <cart-list></cart-list>
    <!-- 底部的汇总 -->
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/cartList";
import CartBottomBar from './childComps/CartBottomBar';
import { mapGetters } from "vuex";
export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // 我们也可以这默写使用mapGetters
    // ...mapGetters(["cartLength", "cartList"]),
    // 或者这样写
    ...mapGetters({
      length: "cartLength",
      // list: "cartList",
    }),
  },
};
</script>

<style scoped>
.cart-nav {
  background: var(--color-tint);
  color: #fff;
}
</style>
