<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from 'better-scroll';

export default {
  props: {
    probeType: {
      type: Number,
      default: 2,
    },
    click: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Array,
      default: null,
    },
    listenScroll: {
      type: Boolean,
      default: false,
    },
    scrollStart: {
      type: Boolean,
      default: false,
    },
    pullup: {
      type: Boolean,
      default: false,
    },
    beforeScroll: {
      type: Boolean,
      default: false,
    },
    refreshDelay: {
      type: Number,
      default: 200,
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
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
      });
      if (this.listenScroll) {
        const me = this;
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos, me.scroll.maxScrollY);
        });
      }
      if (this.scrollStart) {
        const me = this;
        this.scroll.on('scrollStart', () => {
          me.$emit('scrollStart');
        });
      }

      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          this.$emit('scrollToEnd');
          // if (this.scroll.y <= (this.scroll.maxScrollY + 60)) {
          // // this.$emit('scrollToEnd');
          // }
        });
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll');
        });
      }
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      console.log('refresh');
      this.scroll && this.scroll.refresh();
    },
    scrollTo(...args) {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, args);
    },
    scrollToElement(...args) {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, args);
    },
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay);
    },
  },
};
</script>
