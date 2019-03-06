<template>
  <transition name="slide">
    <div class="sub container gray-bg">
      <mt-header :title="car.plateNo">
        <router-link to="/product/ruleSearch" slot="left">
          <mt-button icon="back" style="color:white"></mt-button>
        </router-link>
      </mt-header>
      <div class="no-break" v-if="!breakRuleList.length">
        <img v-if="rescode === 0" src="/static/icon/assist.png">
        <p v-if="rescode === 0">暂无违章记录</p>
        <p v-if="rescode === 1">您输入的车辆信息有误</p>
      </div>
      <div class="break-rule-list" v-else>
        <div class="item" v-for="item in breakRuleList" :key="item.id">
          <van-field readonly label="违章时间：" v-model="item.time" input-align="right"></van-field>
          <van-field readonly label="违章地点：" v-model="item.address" input-align="right"></van-field>
          <van-field readonly label="扣分：" v-model="item.score" input-align="right"><span slot="button">分</span></van-field>
          <van-field readonly label="罚金：" v-model="item.amount" input-align="right"><span slot="button">元</span></van-field>
          <van-field readonly label="违章原因：" v-model="item.reason" class="reason" type="textarea"></van-field>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { seachRule } from '@/api/product';

export default {
  name: 'ruleInfo',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      console.log(to.params);
      vm.car = to.params;
      window.myData = to.params;
    });
  },
  created() {
    this.seachRule();
    console.log(window.myData);
  },
  data() {
    return {
      car: {},
      rescode: 0,
      breakRuleList: [],
    };
  },
  methods: {
    seachRule() {
      const vin = this.$route.params.frameNo;
      const platNo = this.$route.params.plateNo;
      const engineNo = this.$route.params.engineNo;
      seachRule(platNo, vin, engineNo).then((res) => {
        if (res.errno !== 0) {
          this.$toast.fail({ message: res.errmsg, duration: 800 });
          this.rescode = 1;
        } else {
          this.breakRuleList = res.data.records;
          this.rescode = 0;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.no-break {
  margin: 15px rem(20);
  border-radius: rem(5);
  text-align: center;
  background: #fff;
  padding: 15px 0;
  img {
    width: rem(32);
    height: auto;
  }
  p {
    color: #666;
  }
}

.break-rule-list {
  position: absolute;
  top: 44px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
  padding: 10px rem(15);
  -webkit-overflow-scrolling: touch;

  .item {
    background: #fff;
    border-radius: 5px;
    padding: 0 rem(10) 5px;
    margin-bottom: 5px;
    p {
      line-height: 40px;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      &:last-child::after {
        display: none;
      }
      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        height: 1px;
        background: #c5c5c5;
        width: 100%;
        // border-bottom: 1px solid #c5c5c5;
        transform: translateY(0.5);
      }
      span.label {
        flex: 1;
        max-width: 6em;
        min-width: 6em;
        color: #111;
      }
      span.value {
        flex: 6;
        text-align: right;
        font-size: rem(12);
        color: #666;
      }
      &.reason {
        margin-top: 5px;
        textarea {
          font-size: rem(13);
        }
        span.label {
          line-height: 18px;
        }
        span.value {
          line-height: 18px;
          text-align: right;
          em {
            display: inline-block;
            font-style: normal;
            text-align: left;
            font-size: rem(13);
            color: #666;
          }
        }
      }
    }
  }
}
</style>
