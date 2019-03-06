<template>
  <div class="container">
    <div id="header">
      <mt-header title="商品管理" ref="header" class="header">
        <a @click.stop="$router.back" slot="left">
          <mt-button icon="back" style="color:black"></mt-button>
        </a>
        <span slot="right" class="head-right">
          <img src="@/assets/images/commodity/statistics@2x.png" alt>
        </span>
      </mt-header>
    </div>
    <div class="content">
      <h-scrolls
        id="scrollWrap"
        ref="scrollWrap"
        :data="array"
        :listenScroll="true"
        @scroll="scroll"
        :scrollStart="true"
        @scrollStart="refresh"
      >
        <div>
          <div class="tab-list_box">
            <div class="tab-list_header">
              <img src="@/assets/images/commodity/state_of_operation@2x.png">
              <p>经营状况</p>
            </div>
            <div class="tab-list_content">
              <a class="tab-list_item">
                <p>所有商品</p>
                <p class="mt7">
                  <span class="span">{{res.s}}</span>
                  <span class="p">种</span>
                </p>
              </a>
              <a class="tab-list_item">
                <p>新增商品</p>
                <p class="mt7">
                  <span class="span">{{res.s_3}}</span>
                  <span class="p">种</span>
                </p>
              </a>
              <a class="tab-list_item">
                <p>已上架</p>
                <p class="mt7">
                  <span class="span">{{res.s_1}}</span>
                  <span class="p">种</span>
                </p>
              </a>
              <a class="tab-list_item last_one">
                <p>已下架</p>
                <p class="mt7">
                  <span class="span">{{res.s_2}}</span>
                  <span class="p">种</span>
                </p>
              </a>
              <!-- <div class="tab-list_item border_bn">
              <p>已租客户</p>
              <p class="mt7">
                <span class="span">50</span>
                <span class="p">人</span>
              </p>
            </div>
            <div class="tab-list_item border_bn">
              <p>逾期客户</p>
              <p class="mt7">
                <span class="span">60</span>
                <span class="p">人</span>
              </p>
            </div>
            <div class="tab-list_item border_bn">
              <p>违章车辆</p>
              <p class="mt7">
                <span class="span">70</span>
                <span class="p">辆</span>
              </p>
            </div>
            <div class="tab-list_item border_bn last_one">
              <p>出险车辆</p>
              <p class="mt7">
                <span class="span">100</span>
                <span class="p">辆</span>
              </p>
              </div>-->
            </div>
          </div>
          <div class="tab-for_box">
            <div class="tab-list_header">
              <img src="@/assets/images/commodity/toolbar@2x.png">
              <p>工具栏</p>
            </div>
            <div class="tab-for_content">
              <router-link to>
                <img src="@/assets/images/commodity/checkViolation@2x.png" alt>
                <p>查违章</p>
              </router-link>
              <router-link to>
                <img src="@/assets/images/commodity/checkclient@2x.png" alt>
                <p>客户审查</p>
              </router-link>
              <router-link to>
                <img src="@/assets/images/commodity/checkCar@2x.png" alt>
                <p>车辆核检</p>
              </router-link>
              <router-link to>
                <img src="@/assets/images/commodity/blacklist@2x.png" alt>
                <p>黑名单</p>
              </router-link>
            </div>
          </div>
          <div class="tab-for_box">
            <div class="tab-list_header">
              <img src="@/assets/images/commodity/toolbar@2x.png">
              <p>新车管理</p>
            </div>
            <div class="tab-for_content">
              <router-link to="/product/newCarList">
               <icon name="product_list" scale="2"></icon>
                <p>新车列表</p>
              </router-link>
              <router-link to="/product/newCar">
                <icon name="product_add" scale="2"></icon>
                <p>添加新车</p>
              </router-link>
            </div>
          </div>
          <div class="tab-for_box">
            <div class="tab-list_header">
              <img src="@/assets/images/commodity/toolbar@2x.png">
              <p>二手车管理</p>
            </div>
            <div class="tab-for_content">
              <router-link to="/product/usedCarList">
                <icon name="product_list" scale="2"></icon>
                <p>二手车列表</p>
              </router-link>
              <router-link to="/product/newUsedCar">
                <icon name="product_add" scale="2"></icon>
                <p>添加二手车</p>
              </router-link>
            </div>
          </div>
          <div class="tab-for_box">
            <div class="tab-list_header">
              <icon name="rentCar" scale="2"></icon>
              <p>租车管理</p>
            </div>
            <div class="tab-for_content">
              <router-link to="/product/rentCarList">
                <icon name="product_list" scale="2"></icon>
                <p>租车列表</p>
              </router-link>
              <router-link to="/product/newRentCar">
                <icon name="product_add" scale="2"></icon>
                <p>添加租车</p>
              </router-link>
            </div>
          </div>
          <div class="tab-for_box">
            <div class="tab-list_header">
              <img src="@/assets/images/commodity/toolbar@2x.png">
              <p>洗美护管理</p>
            </div>
            <div class="tab-for_content">
              <router-link to="/product/cosmList">
                <icon name="product_list" scale="2"></icon>
                <p>洗美护列表</p>
              </router-link>
              <router-link to="/product/newCosm">
                <icon name="product_add" scale="2"></icon>
                <p>添加</p>
              </router-link>
            </div>
          </div>
          <div class="tab-for_box" v-for="(tab,index) in array" :key="index">
            <div class="tab-list_header">
              <img :src="tab.tab_title_icon">
              <p v-html="tab.tab_title"></p>
            </div>
            <div class="tab-for_content">
              <router-link v-for="item in tab.tab_list" :key="item.title" :to="item.router_link">
                <img :src="item.icon" alt>
                <p>{{item.title}}</p>
              </router-link>
            </div>
          </div>
        </div>
      </h-scrolls>
    </div>
  </div>
</template>
<script>
import hScrolls from '@/components/hScrolls';
import { initScroll } from '@/utils/dom';
import { fetchTab } from '@/api/product';

export default {
  data() {
    return {
      array: [],
      res: {},
      total: 2,
      loading: {
        msg: '加载中',
        state: 'loading',
      },
    };
  },
  mounted() {
    const win = window.document.documentElement;
    const scrollWrap = this.$refs.scrollWrap;
    const header = this.$refs.header;
    this.$nextTick(() => {
      initScroll(win, scrollWrap, header);
    });
  },
  created() {
    this.getTablist();
  },
  methods: {
    getTablist() {
      // 获取当前时间
      const nowDate = new Date();
      const year = nowDate.getFullYear();
      let month = nowDate.getMonth() + 1;
      let today = nowDate.getDate();
      const hours = nowDate.getHours();
      const minutes = nowDate.getMinutes();
      const seconds = nowDate.getSeconds();
      if (month >= 1 && month <= 9) {
        month = `0${month}`;
      }
      if (today >= 1 && today <= 9) {
        today = `0${today}`;
      }
      const currentdate =
        `${year}-${month}-${today} ${hours}:${minutes}:${seconds}`;
      const date = new Date(
        currentdate.replace(new RegExp('-', 'gm'), '/'),
      ).getTime();
      fetchTab(date).then((res) => {
        if (res.errno === 0) {
          this.res = res.data;
        }
      });
    },
    scroll(pos, scroll) {
      if (pos.y <= scroll.maxScrollY - 40) {
        const num = document.getElementsByClassName('tab-for_box').length;
        if (num < this.total) {
          this.getTablist();
        }
      }
    },
    refresh() {},
  },
  components: {
    hScrolls,
  },
};
</script>
<style lang='scss' scoped>
.head-right {
  img {
    width: rem(20);
    height: rem(17);
  }
}
.content {
  position: relative;
  z-index: 2;
  overflow: hidden;
  width: auto;
}
#scrollWrap {
  margin-top: rem(10);
}
.tab-for_box {
  margin-top: rem(10);
}
.tab-list_box,
.tab-for_box {
  width: 100%;
  height: auto;
  background: rgba(255, 255, 255, 1);
  p {
    width: auto;
    margin-block-start: 0;
    margin-block-end: 0;
    height: 12px;
    margin: 0;
    font-size: rem(12);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }
  .tab-list_header {
    width: auto;
    display: flex;
    padding: 15px rem(15);
    position: relative;
    border-bottom: 1px solid #cccccc;

    p {
      margin: 0 0 0 rem(5);
    }
    img {
      width: rem(15);
      height: rem(15);
    }
    svg {
      height: rem(15);
      width: rem(15);
    }
  }
  .tab-list_content {
    // height: 152px;
    position: relative;
    overflow: hidden;
    display: flex;
    z-index: 2;
    background: rgba(255, 255, 255, 1);
    .tab-list_item {
      display: block;
      width: 25%;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      box-sizing: border-box;
      border-right: 1px solid #cccccc;
      z-index: 2;
      margin-left: rem(-1);
      padding: 22px rem(22);
      p {
        color: rgba(102, 102, 102, 1);
      }
      .span {
        height: 14px;
        font-size: rem(18);
        margin-top: 7px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(255, 0, 0, 1);
      }
      .p {
        width: rem(11);
      }
    }
    .last_one {
      border-right: none;
      margin-left: rem(-2);
    }
    p.mt7 {
      margin-top: 7px;
    }
    .border_bn {
      border-bottom: none;
    }
  }
  .tab-for_content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    z-index: 2;
    a {
      color: #333;
      text-align: center;
      width: 25%;
      height: 95px;
      background: rgba(255, 255, 255, 1);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      box-sizing: border-box;
      img {
        width: rem(22);
        height: rem(22);
      }
      svg {
        height: rem(22);
        width: rem(22);
      }
      p {
        margin-top: 10px;
      }
    }
  }
}
</style>
