<template>
  <div class="detail-item">
    <swiper class="swipers">
      <swiper-item v-for="(item, index) in topImages" :key="index">
        <img :src="item" alt="" />
      </swiper-item>
    </swiper>
  </div>
</template>
<script>
import { Swiper, SwiperItem } from "components/common/swiper/index";
export default {
  name: "DetailSwiper",
  props: {
    topImages: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data(){
    return{
      isLoad:false,
    } 
  },
  components: {
    Swiper,
    SwiperItem,
  },
  methods:{
    // loadMore(){
    //   if(!this.isLoad){
    //     this.isLoad=true;
    //     this.$emit("swiperImageLoad");
    //   }
    // }
  }
};
</script>
<style  scoped>
.swipers{
    height: 300px;
    overflow: hidden;
  }
</style>