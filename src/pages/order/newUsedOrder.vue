<template>
  <div class="container">
    <mt-header :title="id?'修改订单':'添加订单'">
      <router-link to="/order"  slot="left" ref="header">
        <mt-button icon="back" style="color:#333333"></mt-button>
      </router-link>
    </mt-header>
    <div class="content" ref="scrollWrap">
      <h-scrolls class="scroll-wrap">
        <van-cell-group>
          <van-field v-if="id" label="订单编号" v-model="orderNo" readonly input-align="right"></van-field>
          <van-field required :readonly="id !== null" v-model="formInfo.usrname" label="客户" placeholder="请输入客户姓名" input-align="right"></van-field>
          <van-field required :readonly="id !== null" v-model="formInfo.phone" label="联系方式" placeholder="请输入客户手机号码" input-align="right"></van-field>
          <van-cell title="商品" is-link @click="goProduct" v-model="product.title"></van-cell>
          <van-cell title="金融方案" is-link>
            <select placeholder="请选择" v-model="formInfo.financeId" @change="financeChange(formInfo.financeId)">
              <option v-for="item in financeList" :key="item.id" :value="item.id">{{item.name}}</option>
            </select>
          </van-cell>
          <van-cell title="选择期数" is-link>
            <select placeholder="请选择" v-model="formInfo.num">
              <option v-for="(item, index) in numList" :key="index" :value="item.num">{{item.num}}</option>
            </select>
          </van-cell>
        </van-cell-group>
        <van-cell-group>
          <van-field label="车价" v-model="formInfo.money" readonly placeholder="请选择商品" input-align="right"></van-field>
          <van-field label="优惠金额" v-model="formInfo.discount" placeholder="请输入" @keyup="count(formInfo.money)" input-align="right"></van-field>
          <van-field label="总金额" v-model="formInfo.total" readonly input-align="right"></van-field>
        </van-cell-group>
        <p class="submit_box">
          <van-button v-if="status === 0" type="default" @click="addOrder" size="large"  class="submit_btn">{{id?'修改':'提交'}}</van-button>
        </p>
      </h-scrolls>
    </div>
    <products-list v-if="productShow" @selectProduct="selectProduct" lx="olds"></products-list>
  </div>
</template>
<script>
import hScrolls from '@/components/hScrolls';
import productsList from './productsList';
import { initScroll } from '@/utils/dom';
import { tradeInfo, findNum, addOrder, acceptOrder } from '@/api/order';
import { fentchFinances } from '@/api/product';

export default {
  data() {
    return {
      id: null,
      orderNo: null,
      productShow: false,
      product: {},
      status: 0,
      carInfo: {},
      orderDetail: {},
      financeList: [],
      numList: [],
      formInfo: {
        type: 'olds',
        productId: null,
        financeId: null,
        total: null,
        discount: null,
        money: null,
        num: null,
        phone: '',
        usrname: '',
      },
    };
  },
  computed: {
    money() {
      return this.formInfo.money;
    },
  },
  watch: {
    money(val) {
      this.count(val);
    },
  },
  created() {
    this.finances();
    this.id = this.$route.params.car ? this.$route.params.car.id : null;
    if (this.id) {
      this.getOrderInfo();
    }
  },
  methods: {
    acceptOrder() {
      acceptOrder(this.id).then((res) => {
        console.log(res);
        if (res.errno === 0) {
          this.$toast.success(res.errmsg);
        } else {
          this.$toast.fail(res.errmsg);
        }
      });
    },
    finances() {
      fentchFinances().then((res) => {
        this.financeList = res.data.rows;
      });
    },
    financeChange(id) {
      findNum(id).then((res) => {
        this.numList = res.data;
      });
    },
    count(money) {
      const discount = this.formInfo.discount;
      if (discount >= money) {
        this.$toast.fail('优惠金额不能大于车价');
        this.formInfo.discount = 0;
      } else {
        this.formInfo.total = money - discount;
      }
    },
    addOrder() {
      this.formInfo.productId = this.product.id;
      const test = !!this.formInfo.phone.match(
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
      if (test === false) {
        this.$toast.fail('请正确填写手机号');
      } else {
        addOrder(this.formInfo, this.id).then((res) => {
          if (res.errno === 0) {
            this.$router.push({
              name: 'usedCarOrderList',
            });
          } else {
            this.$toast.fail(res.errmsg);
          }
        });
      }
    },
    goProduct() {
      this.productShow = true;
    },
    selectProduct(car) {
      this.productShow = false;
      this.product = car;
      this.formInfo.money = this.product.price;
    },
    getOrderInfo() {
      const carInfo = this.$route.params.car;
      this.product = carInfo;
      console.log(carInfo);
      this.formInfo.money = carInfo.price;
      this.orderNo = carInfo.no;
      tradeInfo(this.id).then((res) => {
        const orderDetail = res.data.trade;
        this.financeChange(orderDetail.financeId);
        this.status = orderDetail.status;
        this.product.id = orderDetail.product_id;
        Object.assign(this.formInfo, {
          financeId: orderDetail.financeId,
          num: orderDetail.num,
          usrname: orderDetail.name,
          phone: orderDetail.phone,
          discount: orderDetail.discount,
          total: orderDetail.total,
        });
      });
    },
  },
  mounted() {
    const win = window.document.documentElement;
    const scrollWrap = this.$refs.scrollWrap;
    const header = this.$refs.header;
    this.$nextTick(() => {
      initScroll(win, scrollWrap, header);
    });
  },
  components: {
    hScrolls,
    productsList,
  },
};
</script>
<style lang="scss">
  .van-cell-group {
    margin-top: 10px;
  }
  .submit_box {
    font-size: 0;
    padding: 20px rem(15);
    margin-bottom: 20px;

    .submit_btn {
      font-size: rem(20);
    }
  }
</style>
