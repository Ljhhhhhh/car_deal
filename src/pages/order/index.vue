<template>
  <div class="container">
    <mt-header title="订单管理" ref="header" class="header">
      <a @click.stop="$router.back" slot="left">
        <mt-button icon="back" style="color:#333"></mt-button>
      </a>
    </mt-header>
    <div class="content">
      <div class="tab-list_box">
        <div class="tab-list_header">
          <img src="@/assets/images/commodity/state_of_operation@2x.png">
          <p>订单统计</p>
        </div>
        <div class="tab-list_content">
          <a class="tab-list_item">
            <p>所有</p>
            <p class="mt7">
              <span class="span">{{statistics.all}}</span>
              <span class="p">单</span>
            </p>
          </a>
          <a class="tab-list_item">
            <p>已取消</p>
            <p class="mt7">
              <span class="span">{{statistics.canans}}</span>
              <span class="p">单</span>
            </p>
          </a>
          <a class="tab-list_item" style="border-right:none;">
            <p>已完成</p>
            <p class="mt7">
              <span class="span">{{statistics.over}}</span>
              <span class="p">单</span>
            </p>
          </a>
        </div>
      </div>
      <div class="tab-for_box">
        <div class="tab-for_content">
          <router-link to="/order/newCarList">
            <icon name="product_list" scale="2"></icon>
            <p>新车订单</p>
          </router-link>
          <router-link to="/order/newCarOrder">
            <icon name="product_add" scale="2"></icon>
            <p>添加订单</p>
          </router-link>
        </div>
      </div>
      <div class="tab-for_box">
        <div class="tab-for_content">
          <router-link to="/order/usedCarList">
            <icon name="product_list" scale="2"></icon>
            <p>二手车订单</p>
          </router-link>
          <router-link to="/order/newUsedOrder">
            <icon name="product_add" scale="2"></icon>
            <p>添加订单</p>
          </router-link>
        </div>
      </div>
      <div class="tab-for_box">
        <div class="tab-for_content">
          <router-link to="/order/rentList">
            <icon name="rentCar" scale="2"></icon>
            <p>租车订单</p>
          </router-link>
          <router-link to="/order/newRentOrder">
            <icon name="product_add" scale="2"></icon>
            <p>添加订单</p>
          </router-link>
        </div>
      </div>
      <div class="tab-for_box">
        <div class="tab-for_content">
          <router-link to="/order/cosmList">
            <icon name="product_list" scale="2"></icon>
            <p>洗美护订单</p>
          </router-link>
          <router-link to="/order/newCosmOrder">
            <icon name="product_add" scale="2"></icon>
            <p>添加订单</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { tradeIndex } from '@/api/order';

export default {
  data() {
    return {
      statistics: {},
    };
  },
  created() {
    this.getIndex();
  },
  methods: {
    getIndex() {
      tradeIndex().then((res) => {
        if (res.errno === 0) {
          this.statistics = res.data;
        } else {
          this.$toast.fail({ message: res.errmsg, duration: 800 });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.tab-list_box,.tab-for_box {
  width: 100%;
  margin-top: 10px;
  height: auto;
  background: rgba(255, 255, 255, 1);
  p {
    width: auto;
    margin-block-start: 0;
    margin-block-end: 0;
    height: 12px;
    line-height: 12px;
    margin: 0;
    font-size: rem(12);
    font-family: 'PingFang-SC-Medium';
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
      width: 33%;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      box-sizing: border-box;
      border-right: 1px solid #cccccc;
      z-index: 2;
      margin-left: rem(-1);
      padding: 22px rem(22);
      p {
        color: #333333;
        font-size: rem(12);
      }
      .span {
        height: 14px;
        font-size: rem(18);
        margin-top: 7px;
        font-family: 'PingFang-SC-Medium';
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
        margin-top: 5px;
      }
    }
  }
</style>
