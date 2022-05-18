<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      :titels="['流行', '新款', '精选']"
      @tabClick="tabClick"
      class="tab-control"
      ref="tabControl1"
      v-show="isTabfixed"
    ></tab-control>
    <!-- 如果这里不写:的话，他默认就是一个字符串 -->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <!-- 这里因为我们的高度是不确定的，所以在每一个组建里面设置高度 -->
      <home-swiper
        :banners="banners"
        @swiperImageLoad="swiperImageLoad"
      ></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control
        :titels="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      ></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!-- 因为组件不能够直接监听事件，我们这里需要修饰符 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl.vue";
import GoodsList from "components/content/goods/GoodsList.vue";
import Scroll from "components/common/scroll/Scroll.vue";

import { getHomeMultidata, getHomeGoods } from "network/home.js";

import { itemListenerMixin, backTopMixin } from "common/mixin";
// import BScroll from "better-scroll";

import HomeSwiper from "./childComps/Homeswiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";
export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      // result: null,
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      tabOffsetTop: 0,
      isTabfixed: false,
      saveY: 0,
    };
  },
  //等我们首页组件创建完的时候，我们就要开始发送求情
  created() {
    //create里面的this就是当前的的vue对象
    this.getHomeMultidata();

    // 请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
    // this.$refs.scroll.refresh();
  },
  mounted() {
    //图片加载完成的事件监听
    // 原本这个函数是在created函数里面写的，但是因为在created函数里面可能会this.$refs.scroll可能是空的
    // 获取不要这个组件，我们拿到的值是null，所以不能使用refresh
    // this.$bus.$on("itemImageLoad", () => {
    //   refresh();
    // });
    // 获取tabControl的offsetTop
    // 所有组件都有一个属性就是$el，就是挂载的那个组件的元素
    // this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
  },
  destoryed() {
    console.log("destoryed");
  },
  // 活跃时执行
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    // 最好要进行一次刷新
    this.$refs.scroll.refresh();
    console.log("actived");
  },
  // 不活跃时执行
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY();
    // 当我们离开这个页面的时候，就去取消这个全局监听的事件
    this.$bus.$off("itemImageLoad", this.itemImgListener);
    // 我们这里可以通过off取消
    // 他有两个参数(第一个是监听事件的名称，第二个是函数)
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  methods: {
    // 事件监听相关的事情
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      // 不能保证用户点击的是哪一个tabcontrol键
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    // 把向上的图标展示出来
    contentScroll(position) {
      this.isShowBackTop = -position.y > 700;
      // 决定tabControl是否吸顶（position:fixed）
      this.isTabfixed = -position.y > this.tabOffsetTop;
    },
    // 加载更多
    loadMore() {
      this.getHomeGoods(this.currentType);
    },
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    // 网络请求相关的事情
    //请求多个数据
    //getHomeMultidata()返回的是一个promise对象
    getHomeMultidata() {
      getHomeMultidata()
        .then((res) => {
          // this.result = res;
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //请求商品数据
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page)
        .then((res) => {
          // ...相当于是对数组的解构，我们也可以使用for循环去将数组中的元素放进去
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page++;
          this.$refs.scroll.finishPullUp();
          this.$refs.scroll.refresh();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
/* 在这里加上scoped之后，我们在这里写的样式就不会给别的地方起效果，只会给这个组建有用 */
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 9; */
}
.tab-control {
  /* sticky属性相当于两个属性，当他到达44px的时候，内部会将自己的属性改成fixed
    当我们开发移动端的时候可以使用这个属性，但是我们要是开发PC短的时候要兼容多个浏览器，有的浏览器是不支持的*/
  /* position: sticky; */
  /* top: 44px; */
  position: relative;
  z-index: 9;
}
.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

/* .content {
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
} */
</style>
