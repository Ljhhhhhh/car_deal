<template>
  <div class="container bg_white">
    <mt-header title="活动选择" ref="header" class="header">
    </mt-header>
    <van-search @clear="resetSearch" background="#f5f4f7" placeholder="请输入搜索关键词" ref="search" v-model="search.text"
      show-action>
      <div slot="action" @click="onSearch(false)">搜索</div>
    </van-search>
    <div class="content" ref="scrollWrap">
    <!-- 注意：quick-loadmore要求外面包裹容器(本例#app)
    的高度固定且overflow:hidden,并且quick-loadmore内部数据的高度要大于包裹容器的高度,
    才能触发quick-loadmore的上拉加载功能 -->
      <quick-loadmore ref="vueLoad" :bottom-method="handleBottom" :bottom-status-change="handleBottomStatusChange"
        :disable-top="true" :disable-bottom="false">
        <div class="item van-hairline--bottom" v-for="item in currentList" :key="item.id">
          <span><input type="checkbox" name="act" class="input" @click="selectAct(item, $event)">{{item.name}}</span>
          <em>{{item.remark}}</em>
        </div>
      </quick-loadmore>
    </div>
    <p class="submit_box" ref="button">
      <van-button type="default" size="large" @click="submitAct" class="submit_btn">确定</van-button>
    </p>
  </div>
</template>
<script>
import { initScroll } from '@/utils/dom';
import { fentchActs } from '@/api/product';

export default {
  created() {
    this.getAct();
  },
  data() {
    return {
      actList: [],
      actTotal: 0,
      searchList: [],
      selectActList: [],
      ActIds: [],
      search: {
        list: [],
        text: '',
        page: 1,
        total: 100000,
        size: 15,
      },
      options: {
        page: 1,
        lx: '',
        size: 15,
      },
    };
  },
  // 实现进入详情页返回列表位置功能-搭配keep-alive
  beforeRouteLeave(to, from, next) {
    // 如果进入详情页
    if (to.name === 'MessageDetail') {
      // 获得滚动距离
      const scrollTop = this.$refs.vueLoad.getScrollTop();
      // 设置缓存
      sessionStorage.setItem('messageScrollTop', scrollTop);
    } else {
      // 如果去其他页移除缓存
      sessionStorage.removeItem('messageScrollTop');
    }
    next();
  },
  activated() {
    // 激活路由
    const scrollTop = sessionStorage.getItem('messageScrollTop');
    // 判断来源
    if (scrollTop == null) {
      console.log('不需要缓存的页面');
    } else {
      // 需要缓存的页面,滚动
      this.$refs.vueLoad.setScrollTop(scrollTop);
    }
  },
  deactivated() {

  },
  computed: {
    currentList() {
      if (this.searchList.length || this.search.total !== 100000) {
        return this.searchList;
      }
      return this.actList;
    },
  },
  methods: {
    selectAct(act, event) {
      const el = event.currentTarget;
      if (el.checked === true) {
        this.selectActList.push(act);
      } else {
        const index = this.selectActList.findIndex(i => i.id === act.id);
        this.selectActList.splice(index, 1);
      }
    },
    submitAct() {
      this.$emit('selectedAct', this.selectActList);
    },
    resetSearch() {
      this.search = {
        text: '',
        page: 1,
        total: 100000,
        size: 15,
      };
      this.searchList = [];
    },
    onSearch(loadmore = false) {
      console.log(loadmore);
    },
    handleBottomStatusChange(status) {
      console.log(status, 'bottomchange');
    },
    handleBottom() {
      // 上拉加载
      // 定时器用来模拟上拉加载接口延迟时间
      setTimeout(() => {
        if (this.search.text) {
          if (this.search.total < this.search.page * this.search.size) {
            console.log('全部加载完成');
            this.$refs.vueLoad.onBottomLoaded(false);
            return false;
          }
          this.search.page = this.search.page + 1;
          this.onSearch(true);
          this.$refs.vueLoad.onBottomLoaded();
        } else {
          if (this.actTotal < this.options.page * this.options.size) {
            console.log('全部加载完成');
            this.$refs.vueLoad.onBottomLoaded(false);
            return false;
          }
          this.options.page = this.options.page + 1;
          this.getAct(true);
          this.$refs.vueLoad.onBottomLoaded();
        }
        return '';
      }, 1000);
    },
    getAct(loadmore = false) {
      fentchActs().then((res) => {
        console.log(res);
        if (loadmore) {
          this.actList = this.actList.concat(res.data.rows);
        } else {
          console.log(res.data.rows.length === 0);
          this.actList = res.data.rows;
          // res.data.rows.length === 0 ? this.actList = [{ name: '双12京东暖暖节抢先引爆狂欢局', remark: '22222222', id: 10 }, { name: 'steam圣诞特惠-90%', remark: '222212222', id: 101 }] : this.actList = res.data.rows;
          this.actTotal = res.data.rows.length;
        }
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      const win = window.document.documentElement;
      const header = this.$refs.header;
      const search = this.$refs.search;
      const scroll = this.$refs.scrollWrap;
      const button = this.$refs.button;
      initScroll(win, scroll, header, search, button);
    });
  },
};

</script>
<style lang="scss" scoped>
  .item {
    line-height: 50px;
    padding: 0 rem(15);
    font-size: rem(14);
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-size: rem(18);
      max-width: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      input {
       -webkit-appearance: checkbox;
      }
    }

    em {
      font-size: rem(15);
      color: #999;
      font-style: normal;
    }
  }
  .submit_box {
    font-size: 0;
    padding: 20px rem(15);

    .submit_btn {
      font-size: rem(20);
    }
  }
</style>
