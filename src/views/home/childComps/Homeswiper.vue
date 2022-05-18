<template>
  <swiper>
    <swiper-item v-for="(item, index) in banners" :key="index">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="loadMore" />
      </a>
    </swiper-item>
  </swiper>
</template>
<script>
import { Swiper, SwiperItem } from "components/common/swiper";
export default {
  name: "Homeswiper",
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    Swiper,
    SwiperItem,
  },
  data() {
    return {
      isLoad:false
    };
  },

  mounted() {},

  methods: {
    // 我们只需要发送一次就可以了，没有必要发送四次
    loadMore() {
      if(!this.isLoad){
        this.isLoad=true;
        this.$emit("swiperImageLoad");
      }

    },
  },
};
</script>
