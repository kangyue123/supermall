<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-nav"
      @titleClick="titleClick"
      ref="nav"
    ></detail-nav-bar>
    <scroll
      class="content"
      ref="scroll"
      @scroll="contentScroll"
      :probe-type="3"
    >
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods" ref="params"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        class="white"
        @imageLoad="imageLoad"
        :detail-info="detailInfo"
      ></detail-goods-info>
      <detail-param-info
        :param-info="paramInfo"
        class="white"
        ref="params"
      ></detail-param-info>
      <detail-comment-info
        ref="comment"
        :comment-info="commentInfo"
      ></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <!-- <toast :message="message" :show="show"></toast> -->
  </div>
</template>
<script>
import DetailNavBar from "./childComps/DetailNavBar";
import {
  getDetail,
  getRecommend,
  Goods,
  Shop,
  GoodsParam,
} from "network/detail";
import DetailSwiper from "./childComps/detailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import Scroll from "components/common/scroll/Scroll";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import GoodsList from "components/content/goods/GoodsList";
// import Toast from "components/common/toast/Toast";

import { itemListenerMixin, backTopMixin } from "common/mixin";
import { debounce } from "common/utils";
import { mapActions } from "vuex";
import DetailBottomBar from "./childComps/DetailBottomBar";

export default {
  name: "Detail",
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      message: "",
      show: false,
    };
  },
  mixins: [itemListenerMixin, backTopMixin],
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    // Toast,
    // itemImgListener,
  },
  created() {
    this.iid = this.$route.params.iid;
    // console.log(this.iid);
    getDetail(this.iid)
      .then((res) => {
        // console.log(res);
        // 获取顶部的图片轮播数据
        const data = res.result;
        // console.log(data);
        this.topImages = res.result.itemInfo.topImages;
        //获取商品信息
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        );
        // 获取店铺信息
        this.shop = new Shop(data.shopInfo);
        // 保存商品的详情数据
        this.detailInfo = data.detailInfo;
        // 获取参数信息
        this.paramInfo = new GoodsParam(
          data.itemParams.info,
          data.itemParams.rule
        );
        // 取出评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }
        // this.$nextTick表示的是下一帧，当数据拿到，然后渲染完之后，然后才会执行下面的代码
        // this.$nextTick(() => {
        //   this.themeTopYs = [];
        //   // 这里可以拿到数据但是拿到的数据是有问题的，因为图片还没有加载完
        //   this.themeTopYs.push(0);
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        // });
      })
      .catch((error) => {
        console.log(error);
      });
    getRecommend()
      .then((res) => {
        // console.log(res);
        this.recommends = res.data.list;
      })
      .catch((err) => {
        console.log(err);
      });
    // 给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      console.log("------");
      this.themeTopYs = [];
      // 我们直接在数组里面再放一个值，就是js能表示的最大的值

      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
      // 表示的是最大的值
      console.log(this.themeTopYs);
    }, 50);
  },
  mounted() {
    // let refresh = debouce(this.$refs.scroll.refresh, 50);
    // this.itemImgListener = () => {
    //   refresh();
    // }
    //   this.$bus.$on("itemImgLoad", this.itemImgListener);
  },
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  //   update () {

  // },

  methods: {
    ...mapActions(["addCart"]),
    imageLoad() {
      // 当图片加载完时候会调用，这样图片高度已经算上了
      this.$refs.scroll.refresh();
      // 这样在计算的时候就不会出现问题了
      this.getThemeTopY();
    },
    titleClick(index) {
      console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300);
    },
    contentScroll(position) {
      //不许传过去一个参数probe-type=3，因为只有等于3的时候，才会发送事件
      const positionY = -position.y;
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        if (
          this.currentIndex != i &&
          positionY > this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex;
        }
        // if (
        //   i != this.currentIndex &&
        //   ((i < length - 1 &&
        //     positionY >= this.themeTopYs[i] &&
        //     positionY < this.themeTopYs[i + 1]) ||
        //     (i === length - 1 && positionY >= this.themeTopYs[i]))
        // ) {
        //   this.currentIndex = i;
        //   console.log(this.currentIndex);
        //   this.$refs.nav.currentIndex = this.currentIndex;
        // }
        //是否显示回到顶部
        this.isShowBackTop = -position.y > 700;
      }
    },
    addToCart() {
      // console.log('添加到购物车');
      // 获取购物车需要展示的提示信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      // 将商品添加到购物车里
      // 我们虽然可以这样做，但是我们一般通过mutation里面的方法去改变state里面的值
      // this.$store.cartList.push(product);
      // 这是mutation里面的提交方法
      // this.$store.commit('addCart',product)
      // 这是调用action里面的方法
      // this.$store.dispatch("addCart", product).then((res) => {
      //   console.log(res);
      // });

      this.addCart(product).then((res) => {
        // this.show = true;
        // this.message = res;
        // setTimeout(() => {
        //   this.show = false;
        //   this.message = "";
        // }, 1500);
        this.$toast.show(res, 2000);
      });
      // 添加购物车成功
    },
  },
};
</script>
<style  scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background: #fff;
}
.content {
  height: calc(100% - 44px - 58px);
  overflow: hidden;
}
.white {
  background: #fff;
}
</style>
