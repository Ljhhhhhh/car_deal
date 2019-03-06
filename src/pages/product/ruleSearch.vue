<template>
  <div class="container gray-bg">
    <mt-header title="违章查询">
      <router-link to="/user" slot="left">
        <mt-button icon="back" style="color:white"></mt-button>
      </router-link>
    </mt-header>
    <div class="banner">
      <img src="/static/images/banner-car-rule.png">
    </div>
    <div class="content">
      <van-cell-group class="search-info">
        <van-field label="车牌号" @change="toUpperCase(car.plateNo, 'plateNo')" v-model="car.plateNo" placeholder="请输入车牌号" input-align="right"></van-field>
        <van-field label="车架号" v-model="car.frameNo" placeholder="请输入17位车架号(VIN码)" input-align="right"></van-field>
        <van-field label="发动机号" v-model="car.engineNo" placeholder="请输入发动机号" input-align="right"></van-field>
      </van-cell-group>
    </div>
    <p class="submit-box">
      <van-button size="large" type="default" class="submit-btn" @click="ruleSearch">查询</van-button>
    </p>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'ruleSearch',
  data() {
    return {
      car: {
        plateNo: '',
        frameNo: '',
        engineNo: '',
      },
    };
  },
  methods: {
    ruleSearch() {
      this.$router.push({
        name: 'ruleInfo',
        params: this.car,
      });
    },
    toUpperCase(val, key) {
      this.car[key] = val.toLocaleUpperCase();
    },
  },
  components: {
    // RToast,
  },
};
</script>
<style lang="scss" scoped>
.banner {
  width: 100%;
  height: auto;
  font-size: 0;

  img {
    width: 100%;
  }
}

.search-info {
  margin-top: 24px;
}

.submit-box {
  margin-top: 13px;
  padding: rem(14) 10px;

  .submit-btn {
    color: white;
    font-size: 17px;
    font-weight: bold;
    border-radius: rem(5);
  }
}
</style>
