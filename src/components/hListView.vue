<template>
  <h-scroll class="listview" :data="data" ref="listview" @scroll="scroll" :listenScroll="listenScroll" :probeType="probeType">
    <ul>
      <li v-for="group in data" :key="group.title" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" :key="item.name" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList" :key="item" class="item" :data-index="index" :class="{'current':currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </h-scroll>
</template>
<script>
import hScroll from '@/components/hScroll';
import {
  getData,
} from '@/utils/dom';

const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;
export default {
  name: 'hListView',
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1,
      hasHeight: false,
    };
  },
  props: {
    data: {
      type: Array,
    },
    len: {
      type: Number,
    },
  },
  computed: {
    shortcutList() {
      return this.data.map(group => group.title.substr(0, 1));
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return '';
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
    },
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item);
    },
    refresh() {
      this.$refs.listview.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    onShortcutTouchStart(e) {
      const anchorIndex = getData(e.target, 'index');
      const firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e) {
      const firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      const delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0; // |0的意思等同于  MATH.floor
      const anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
      console.log(anchorIndex);
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight - 2) {
        index = this.listHeight - 2;
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      if (!list) {
        return;
      }
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
  },
  watch: {
    len() {
      if (!this.hasHeight || this.listHeight[this.listHeight.length - 1] === 0) {
        this._calculateHeight();
        this.hasHeight = true;
      }
    },
    data() {
      this.$nextTick(() => {
        this._calculateHeight();
      });
      // setTimeout(() => {
      //   this._calculateHeight();
      // }, 200);
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 滚动到顶部
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        const height1 = listHeight[i];
        const height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      // 滚动到底部，且-newY大于最后一个元素的上线
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      const fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    },
  },
  components: {
    hScroll,
  },
};
</script>
<style scoped lang="scss">
  .listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #FFF;

    .list-group {
      padding-bottom: 0;

      .list-group-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: rem(14);
        color: $font_vice;
        background: #F2F2F2;
        margin-block-start: 0;
        margin-block-end: 0;
      }

      .list-group-item {
        display: flex;
        align-items: center;
        line-height: 30px;

        .avatar {
          width: 0px;
          height: 0px;
          border-radius: 50%;
          // display: none;
        }

        .name {
          margin-left: 20px;
          color: #666;
          font-size: rem(14);
        }
      }
    }

    .list-shortcut {
      position: absolute;
      z-index: 30;
      right: rem(5);
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      text-align: center;

      .item {
        padding: 2px;
        line-height: 1;
        color: #666;
        font-size: rem(13);

        &.current {
          color: $theme_color;
        }
      }
    }

    .list-fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: rem(12);
        color: $font_vice;
        background: #F2F2F2;
        margin-block-start: 0;
        margin-block-end: 0;
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }

</style>
