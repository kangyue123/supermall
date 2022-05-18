import { debounce } from "common/utils";
import BackTop from "components/content/backTop/backTop.vue";
export const itemListenerMixin = {
  data() {
    return {
      itemListenerMixin: null,
    };
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 50);
    // 监听item中图片的加载
    // 对监听的事件进行保存
    this.itemImgListener = () => {
      refresh();
    }
    this.$bus.$on("itemImageLoad", this.itemImgListener);
  },
}

export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false,
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick() {
      //利用$refs.name可以返回拿到该组件，然后调用里面的函数
      this.$refs.scroll.scrollTo(0, 0);
    },
    // listenShowBackTop() {
    //   this.isShowBack=-SVGTextPositioningElement.y>700
    // }
  },

}
