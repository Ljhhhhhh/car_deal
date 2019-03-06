<template>
  <div>
    <div class="header">
      <mt-header title="二手车管理" ref="header" class="header">
        <router-link to="/product" slot="left">
          <mt-button icon="back" style="color:black"></mt-button>
        </router-link>
        <span slot="right" class="head-right">
          <icon name="add" scale="1.8" color="#333" @click.native="usedCar"></icon>
        </span>
      </mt-header>
    </div>
    <van-search  @clear="resetSearch" background="#f5f4f7" placeholder="请输入搜索关键词" ref="search" v-model="search.text" show-action><div slot="action" @click="onSearch(false)">搜索</div></van-search>
    <div class="content" ref="scrollWrap">
      <!-- 注意：quick-loadmore要求外面包裹容器(本例#app)
    的高度固定且overflow:hidden,并且quick-loadmore内部数据的高度要大于包裹容器的高度,
      才能触发quick-loadmore的上拉加载功能-->
      <quick-loadmore
      ref="vueLoad"
      :bottom-method="handleBottom"
      :bottom-status-change="handleBottomStatusChange"
      :disable-top="true"
      :disable-bottom="false"
      >
        <div class="car-list_box">
          <div class="car-list_item van-hairline--bottom" v-for="(car, index) in currentList" :key="index"   @click="usedCar(car)">
            <div class="car-thumb">
              <img v-lazy="car.thumb || 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542888361079&di=d10e185c4c8e9eebd8875c872d3f6e40&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4034970a304e251ff00a96c5ac86c9177f3e5309.jpg'">
            </div>
            <div class="car-info">
              <p class="title">{{car.name}} </p>
              <p class="info"></p>
              <p class="info">{{car.price}}万/<span class="blue">首付{{car.payment}}万</span></p>
              <!-- <p class="info">{{car.year}} </p> -->
            </div>
          </div>
        </div>
      </quick-loadmore>
      <div v-show="!currentList.length">
        <p>暂无相关车辆</p>
      </div>
    </div>
  </div>
</template>
<script>
import { initScroll } from '@/utils/dom';
import { fentchProducts } from '@/api/product';

export default {
  created() {
    this.getProduct();
  },
  data() {
    return {
      active: 0,
      productList: [],
      carTotal: 0,
      options: {
        page: 1,
        lx: 'olds',
        size: 15,
      },
      search: {
        list: [],
        text: '',
        page: 1,
        total: 100000,
        size: 15,
      },
      searchList: [],
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
  deactivated() {},
  computed: {
    currentList() {
      if (this.searchList.length || this.search.total !== 100000) {
        return this.searchList;
      }
      return this.productList;
    },
  },
  methods: {
    getProduct(loadmore = false) {
      const conf = this.options;
      fentchProducts(conf).then((res) => {
        if (loadmore) {
          this.productList = this.productList.concat(res.data.rows);
        } else {
          this.productList = res.data.rows;
          this.carTotal = res.data.total;
        }
      });
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
      if (!loadmore) {
        this.search.page = 1;
      }
      const conf = {
        page: this.search.page,
        lx: 'olds',
        searchText: this.search.text,
        size: this.search.size,
      };
      fentchProducts(conf).then((res) => {
        if (loadmore) {
          this.searchList = this.searchList.concat(res.data.rows);
        } else {
          this.searchList = res.data.rows;
          this.search.total = res.data.total;
        }
      });
    },
    usedCar(item) {
      if (item) {
        this.$router.push({
          name: 'newUsedCar',
          params: {
            id: item.id,
          },
        });
      } else {
        this.$router.push({
          name: 'newUsedCar',
        });
      }
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
          if (this.carTotal < this.options.page * this.options.size) {
            console.log('全部加载完成');
            this.$refs.vueLoad.onBottomLoaded(false);
            return false;
          }
          this.options.page = this.options.page + 1;
          this.getProduct(true);
          this.$refs.vueLoad.onBottomLoaded();
        }
        return '';
      }, 1000);
    },
  },
  mounted() {
    const win = window.document.documentElement;
    const scrollWrap = this.$refs.scrollWrap;
    const header = this.$refs.header;
    const search = this.$refs.search;
    this.$nextTick(() => {
      initScroll(win, scrollWrap, header, search);
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
  }

  em {
    font-size: rem(15);
    color: #999;
    font-style: normal;
  }
}
.tab_box {
  .van-tabbar-item {
    font-size: rem(15)
  }

  .tab_item  {
    padding: 17px rem(2) 11px;
  }
  .van-tabbar-item--active {
    color: #41A0FE;
    .tab_item {
      border-bottom:2px solid #41A0FE;
    }
  }

}
.car-list_box {
  width: 100%;
  height: auto;
  z-index: 2;
  background: #f5f4f7;

  .car-list_item {
    width: auto;
    height: 151px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 0 rem(10);
    padding: 22px rem(15);
    background: #fff;
    box-sizing: border-box;
    position: relative;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);

    .car-thumb {
      width: rem(106);
      height: rem(106);
      position: relative;
      overflow: hidden;

      img {
        width: auto;
        height: 100%;
      }
    }

    .blue {
     color: #41A0FE;
    }

    .car-info {
      flex: 1;
      padding-left: rem(15);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;

      p.title {
        color: #333;
        font-size: rem(16);
        max-width: 78%;
        margin: 0;
      }

      p.info {
        font-size: rem(15);
        margin: 0;
      }
    }
  }
}
.plus-icon {
  width: 20px;
  height: 20px;
  position: relative;
  float: right;
  &::after,
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background: #333;
    border-radius: 1.5px;
  }
  &:after {
    width: 17px;
    height: 2px;
  }
  &:before {
    width: 2px;
    height: 17px;
  }
}
</style>
