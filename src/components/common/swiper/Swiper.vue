<template>
  <div id="hy-swiper">
    <div
      class="swiper"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchedEnd"
    >
      <slot></slot>
    </div>
    <slot name="indicator"> </slot>
    <div class="indicator">
      <slot name="indicator" v-if="showIndicator && slideCount > 1">
        <!-- 下面的小圆圈 -->
        <div
          v-for="(item, index) in slideCount"
          class="indi-item"
          :class="{ active: index === currentIndex - 1 }"
          :key="index"
        ></div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Swiper",
  props: {
    //多久换一张图片
    interval: {
      type: Number,
      default: 3000,
    },
    //延迟多久才开始轮播
    animDuration: {
      type: Number,
      default: 300,
    },
    //拖着的时候滚动的比例
    moveRatio: {
      type: Number,
      default: 0.25,
    },
    //下面的点是否显示
    showIndicator: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      slideCount: 0, // 元素个数
      totalWidth: 0, // swiper的宽度
      swiperStyle: {}, // swiper样式
      currentIndex: 1, // 当前的index
      scrolling: false, // 是否正在滚动
    };
  },
  mounted() {
    //现在前后添加Slide
    setTimeout(() => {
      this.handleDom();
      //开始轮播
      this.startTimer();
    }, 100);
  },

  methods: {
    startTimer() {
      //每隔3秒换一次图片(将定时器写在this上，便于我们后面对定时器的删除)
      this.playTimer = window.setInterval(() => {
        //当前的index
        this.currentIndex++;
        this.scrollContent(-this.currentIndex * this.totalWidth);
      }, this.interval);
    },
    //删除定时器
    stopTimer() {
      window.clearInterval(this.playTimer);
    },
    // 滚动
    scrollContent(currentPosition) {
      //设置开始滚动(在此期间下面的小圆圈不显示)
      this.scrolling = true;
      //滚动的动画
      this.swiperStyle.transition = "transform" + this.animDuration + "ms"; //动画持续的时长
      this.setTransform(currentPosition);
      // 判断滚到的位置
      this.checkPosition();
      // 滚动完成
      this.scrolling = false;
    },
    setTransform(position) {
      this.swiperStyle.transform = `translate3d(${position}px,0,0)`;
      this.swiperStyle[
        "-webkit-transform"
      ] = `translate3d(${position}px), 0, 0`;
      this.swiperStyle["-ms-transform"] = `translate3d(${position}px), 0, 0`;
    },
    checkPosition() {
      window.setInterval(() => {
        this.swiperStyle.transition = "0ms";
        if (this.currentIndex >= this.slideCount + 1) {
          this.currentIndex = 1;
          this.setTransform(-this.currentIndex * this.totalWidth);
        } else if (this.currentIndex <= 0) {
          this.currentIndex = this.slideCount;
          this.setTransform(-this.currentIndex * this.totalWidth);
        }
      }, this.animDuration);
      //结束移动后回调
      //这里的transitionEnd是啥？$emit是子组件向父组件进行通信的
      this.$emit("transitionEnd", this.currentIndex - 1);
    },
    // 操作DOM元素，在原有个slider元素个数前后添加Silder
    handleDom() {
      let swiperEI = document.querySelector(".swiper");
      let slidesEIs = swiperEI.getElementsByClassName("slide");
      //sliderEIs就是当前要进行轮播的图的个数
      this.slideCount = slidesEIs.length;
      //如果大于1就在前后分别添加一个slide
      if (this.slideCount > 1) {
        //复制一个和第一个一样的节点
        let cloneFirst = slidesEIs[0].cloneNode(true);
        let cloneLast = slidesEIs[this.slideCount - 1].cloneNode(true);
        //把这两个节点分别添在前后
        swiperEI.insertBefore(cloneLast, slidesEIs[0]);
        swiperEI.append(cloneFirst);
        // offsetWidth它返回该元素的像素宽度
        this.totalWidth = swiperEI.offsetWidth;
        this.swiperStyle = swiperEI.style;
      }
      // 4.让swiper元素, 显示第一个(目前是显示前面添加的最后一个元素)
      this.setTransform(-this.totalWidth);
    },
    //拖动事件
    touchStart(e) {
      // console.log(e);
      // console.log(this.scrolling);
      //如果正在滚动，就不可以拖动
      if (this.scrolling) return;
      //否则就可以进行拖动（先将定时器删掉）
      this.stopTimer();
      //记录开始滚动的位置
      this.startX = e.touches[0].pageX;
    },
    //计算拖动的距离,并进行拖动
    touchMove(e) {
      console.log("123");
      this.currentX = e.touches[0].pageX;
      this.distance = this.currentX - this.startX;
      let currentPosition = -this.currentIndex * this.totalWidth;
      let moveDistance = this.distance + currentPosition;
      //进行相应的移动
      this.setTransform(moveDistance);
    },
    //拖动的移动结束之后，进行距离的计算，1/3
    touchedEnd(e) {
      console.log(this.currentIndex);
      let currentMove = Math.abs(this.distance);
      console.log(this.distance);
      if (this.distance === 0) {
        return;
      } else if (
        this.distance > 0 &&
        currentMove > this.totalWidth * this.moveRatio
      ) {
        this.currentIndex--;
      } else if (
        this.distance < 0 &&
        currentMove > this.totalWidth * this.moveRatio
      ) {
        this.currentIndex++;
      }

      //移动到正确的位置
      this.scrollContent(-this.currentIndex * this.totalWidth);
      //拖动完成之后重新开启定时器
      this.startTimer();
    },

    // 翻页
    previous() {
      this.changeItem(-1);
    },
    next() {
      this.changeItem(1);
    },
    changeItem(num) {
      //移除定时器
      this.stopTimer();
      //确定当前位置
      this.currentIndex += num;
      //进行轮播到当前的位置
      this.scrollContent(-this.currentIndex * this.totalWidth);
      //移动完成之后添加定时器
      this.startTimer();
    },
  },
};
</script>

<style scoped>
#hy-swiper {
  overflow: hidden;
  position: relative;
}

.swiper {
  display: flex;
}

.indicator {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  bottom: 8px;
}

.indi-item {
  box-sizing: border-box;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #fff;
  line-height: 8px;
  text-align: center;
  font-size: 12px;
  margin: 0 5px;
}

.indi-item.active {
  background-color: rgba(212, 62, 46, 1);
}
</style>
