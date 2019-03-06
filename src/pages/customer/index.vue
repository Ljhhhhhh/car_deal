<template>
  <div class="container">
    <mt-header ref="header" title="客户管理" class="header">
      <span slot="left">
        <icon name="client_search" scale="1.8" color="#333"></icon>
      </span>
      <router-link to="/client/newClient" slot="right">
        <icon name="add" scale="1.8" color="#333"></icon>
      </router-link>
    </mt-header>
    <div class="tab" ref="tab">
      <van-button :class="{active: show === 1}" @click=" show = 1">已租客户</van-button>
      <van-button :class="show === 2?'active' + ' last':'last'" @click=" show = 2">全部客户</van-button>
    </div>
    <div class="content" ref="scrollWrap">
      <quick-loadmore ref="vueLoad" :bottom-method="handleBottom" :bottom-status-change="handleBottomStatusChange"
        :disable-top="true" :disable-bottom="false">
        <div class="car-list_box">
          <div v-for="(client, index) in currentList" :key="index">
            <van-cell title="沪A12345" class="item_header" is-link>
              <span>解放牌卡车</span>
            </van-cell>
            <div class="car-list_item van-hairline--bottom">
              <div class="car-info">
                <p class="info">
                  <span>客户姓名：</span>
                  {{client.name}}
                </p>
                <p class="info">
                  <span>剩余租期：</span>
                  {{client.price}}
                </p>
                <p class="info">
                  <span>月租金：</span>
                  {{client.year}}
                </p>
                <span class="svg">
                  <icon name="phone" scale="2.0" @click.native="tel"></icon>
                </span>
              </div>
            </div>
          </div>
        </div>
      </quick-loadmore>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: 1,
      productList: [],
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
  computed: {
    currentList() {
      if (this.searchList.length) {
        return this.searchList;
      }
      return this.productList;
    },
  },
  created() {
    this.productList = [{
      name: '',
      price: '',
      year: '',
    },
    {},
    {},
    {},
    ];
  },
  methods: {
    tel() {},
    buttonClick(index) {
      this.show = index;
    },
    handleBottomStatusChange(status) {
      console.log(status, 'bottomchange');
    },
    handleBottom() {
      // 上拉加载
      // 定时器用来模拟上拉加载接口延迟时间
      setTimeout(() => {}, 1000);
    },
  },
};

</script>
<style lang="scss" scoped>
  .container {
    .tab {
      padding: 11px rem(15);
      box-sizing: border-box;
      display: flex;

      .van-button {
        width: 50%;
        height: 32px;
        line-height: 31px;
        border-radius: rem(5) 0 0 rem(5);
        background: white;
        color: #41a0fe;
        font-size: rem(15);
        border: 1px solid #41a0fe;
      }

      .last {
        border-radius: 0 rem(5) rem(5) 0;
      }

      .active {
        background: #41a0fe;
        color: white;
      }
    }

    .car-list_box {
      width: 100%;
      height: auto;
      z-index: 2;
      background: #f5f4f7;

      .item_header {
        font-size: rem(18);
        color: #333;

        span {
          font-size: rem(15);
          color: #c4c7d0;
        }
      }

      .car-list_item {
        width: auto;
        height: 151px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 0 0 rem(10);
        padding: 22px 0 0;
        background: #fff;
        box-sizing: border-box;
        position: relative;
        box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);

        .car-info {
          flex: 1;
          padding-left: rem(15);
          padding-bottom: 22px;
          border-left: 3px solid#41A0FE;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          justify-content: space-between;
          align-items: flex-start;

          span {
            color: #999999;
          }

          .svg {
            position: absolute;
            right: rem(15);
          }

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
  }

</style>
