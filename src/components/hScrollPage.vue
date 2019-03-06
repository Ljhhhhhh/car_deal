<template>
  <div ref="wrapper" class="scroll-box">
    <slot class="scroll-content"></slot>
    <p v-show="loadShow" class="scroll-msg">
      <span>{{load.msg}}</span>
      <icon :name="load.icon" :class="[{rotate: load.icon === 'loading'}, 'icon']" scale='1.5'></icon>
    </p>
    <p class="refresh-msg">
      <span>{{refreshConf.msg}}</span>
      <icon :name="refreshConf.icon" :class="[{rotate: refreshConf.icon==='loading'}, 'icon']" scale='1.5'></icon>
    </p>
  </div>
</template>
<script>
import BScroll from 'better-scroll';

export default {
  props: {
    data: { // 数据
      type: Array,
      default: null,
    },
    noMore: { // 是否没有更多数据
      type: Boolean,
      default: false,
    },
    state: { // 当前状态（是否请求中）
      type: String,
      default: 'loading',
    },
  },
  data() {
    return {
      loadShow: false, // 是否展示加载信息
      refreshIn: false, // 是否展示刷新信息
    };
  },
  computed: {
    load() {
      if (this.noMore) {
        return {
          icon: 'stop',
          msg: '已全部加载',
        };
      }
      if (this.loadShow) {
        if (this.state === 'loading') {
          return {
            icon: 'loading',
            msg: '加载中',
          };
        }
        return {
          icon: 'loaded',
          msg: '加载完成',
        };
      }
      return {
        icon: 'loading',
        msg: '加载中',
      };
    },
    refreshConf() {
      if (!this.refreshIn) {
        return {
          icon: 'down',
          msg: '下拉刷新',
        };
      }
      if (this.state === 'loaded') {
        return {
          icon: 'loaded',
          msg: '刷新成功',
        };
      }
      return {
        icon: 'loading',
        msg: '刷新中',
      };
    },
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 100);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      const me = this;
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: 2,
        click: true,
      });
      this.scroll.on('scroll', (pos) => {
        // 上拉加载
        if (pos.y < this.scroll.maxScrollY - 50 && !this.loadShow) {
          this.loadShow = true;
          this.$emit('scrollToEnd');
        }
        if (pos.y > 40 && !this.refreshIn) {
          // 下拉刷新
          this.refreshIn = true;
          document.querySelector('.refresh-msg').style.zIndex = 99;
          this.$emit('refresh');
        }
      });
      this.scroll.on('scrollEnd', () => {
        // 滑动停止
        if (this.loadShow) {
          this.loadShow = false;
          document.querySelector('.scroll-msg').style.zIndex = -1;
        }
        if (this.refreshIn) {
          this.refreshIn = false;
          document.querySelector('.refresh-msg').style.zIndex = -1;
        }
        this.refresh();
        this.$emit('scrollOver');
      });
      if (this.scrollStart) {
        this.scroll.on('scrollStart', () => {
          me.$emit('scrollStart');
        });
      }
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
  },
  components: {
    BScroll,
  },
};
</script>
<style lang="scss" scoped>
  .scroll-box{
    position: relative;
    .scroll-msg, .refresh-msg{
      position: absolute;
      bottom: 0;
      font-size: rem(14);
      width: 100%;
      text-align: center;
      z-index: -1;
      span, .icon{
        line-height: 40px;
        vertical-align: middle;
      }
    }
    .refresh-msg{
      top: 0;
      height: 30px;
      span, .icon{
        line-height: 30px;
      }
    }
  }
  .rotate{
    animation: rotate 1s linear infinite;
  }
</style>
