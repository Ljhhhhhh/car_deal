<template>
  <div class="container">
    <mt-header title="添加订单">
      <router-link to="/order" slot="left">
        <mt-button icon="back" color="#333333"></mt-button>
      </router-link>
    </mt-header>
    <div class="content" ref="scrollWrap">
      <h-scrolls class="scroll-wrap">
        <van-cell-group>
          <van-field v-if="id" label="订单编号" v-model="orderNo" palceholder="请输入" input-align="right"></van-field>
          <van-field label="客户" :readonly="id !== null" v-model="formInfo.usrname" placeholder="请输入客户姓名" input-align="right"></van-field>
          <van-field label="联系方式" :readonly="id !== null" v-model="formInfo.phone" placeholder="请输入客户手机号" input-align="right"></van-field>
          <van-cell title="商品" is-link @click="goProduct" v-model="product.title"></van-cell>
          <van-field label="租车天数" type="number" v-model="formInfo.days" placeholder="请输入" @keyup="daysChange(formInfo.days)" input-align="right"></van-field>
          <van-field label="开始时间" @click="startDateshow = !startDateshow" placeholder="请选择" v-model="formInfo.startTime" readonly is-link :max="formInfo.endTime"></van-field>
          <van-field label="结束时间" @click="endDateshow = !endDateshow" placeholder="请选择" v-model="formInfo.endTime" readonly is-link :min="formInfo.startTime"></van-field>
          <van-field readonly label="租金" v-model="formInfo.money" placeholder="请输入" input-align="right"></van-field>
          <van-field label="优惠金额" type="number" v-model="formInfo.discount" placeholder="请输入" @keyup="count(formInfo.money)" input-align="right"></van-field>
          <van-field label="总金额" v-model="formInfo.total" placeholder="请输入" input-align="right"></van-field>
        </van-cell-group>
        <p class="submit_box">
          <van-button v-if="status === 0" type="default" size="large" @click="addOrder" class="submit_btn">{{id?'修改':'提交'}}</van-button>
          <!-- <van-button v-if="status === 0" type="default" size="large" @click="acceptOrder" class="submit_btn">受理订单</van-button> -->
        </p>
      </h-scrolls>
    </div>
    <van-popup v-model="startDateshow" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="startTime"
        type="datetime"
        :min-date="new Date()"
        @cancel="startDateshow = false" @confirm="startConfirm"
        @change="timeChoose"
      />
    </van-popup>
    <van-popup v-model="endDateshow" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="endTime"
        type="datetime"
        :min-date="startTime"
        @cancel="endDateshow = false" @confirm="endConfirm"
        @change="timeChoose"
      />
    </van-popup>
    <products-list v-if="productShow" @selectProduct="selectProduct" lx="rentings"></products-list>
  </div>
</template>
<script>
import hScrolls from '@/components/hScrolls';
import { tradeInfo, addOrder, acceptOrder } from '@/api/order';
import productsList from './productsList';

export default {
  data() {
    return {
      id: null,
      orderNo: null,
      startDateshow: false,
      endDateshow: false,
      productShow: false,
      status: 0,
      formInfo: {
        type: 'rentings',
        productId: null,
        // usrid: null,
        usrname: '',
        phone: '',
        days: null,
        startTime: '',
        endTime: '',
        total: null,
        discount: 0,
        money: null,
      },
      product: {},
      endTime: null,
      startTime: new Date(),
      time: null,
    };
  },
  computed: {
    money() {
      return this.formInfo.money;
    },
  },
  created() {
    this.id = this.$route.params.car ? this.$route.params.car.id : null;
    if (this.id) {
      this.getOrderInfo();
    }
  },
  watch: {
    money(val) {
      this.count(val);
    },
  },
  methods: {
    timeChoose(picker) {
      this.time = picker.getValues();
    },
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
    daysChange(value) {
      console.log(this.startTime);
      const endTime = this.startTime.getTime() + (value * 86400000);
      this.endTime = new Date(endTime);
      if (this.formInfo.startTime !== '') {
        this.time = null;
        this.endConfirm(this.endTime);
      }
    },
    startConfirm(value) {
      const time = this.time !== null ? `${this.time[0]}-${this.time[1]}-${this.time[2]} ${this.time[3]}:${this.time[4]}` : `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, 0)}` +
        `-${String(value.getDate()).padStart(2, 0)}` +
        ` ${String(value.getHours()).padStart(2, 0)}:${String(value.getMinutes()).padStart(2, 0)}`;
      this.formInfo.startTime = time;
      if (this.formInfo.days) {
        this.daysChange(this.formInfo.days);
      }
      this.startDateshow = false;
    },
    endConfirm(value) {
      const time = this.time !== null ? `${this.time[0]}-${this.time[1]}-${this.time[2]} ${this.time[3]}:${this.time[4]}` : `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, 0)}` +
        `-${String(value.getDate()).padStart(2, 0)}` +
        ` ${String(value.getHours()).padStart(2, 0)}:${String(value.getMinutes()).padStart(2, 0)}`;
      this.formInfo.endTime = time;
      this.formInfo.days = Math.ceil((value.getTime() - this.startTime.getTime()) / 86400000);
      this.endDateshow = false;
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
              name: 'rentOrderList',
            });
          } else {
            this.$toast.fail({ message: res.errmsg, duration: 800 });
          }
        });
      }
    },
    count(money) {
      const discount = this.formInfo.discount;
      if (discount >= money) {
        this.$toast.fail({ message: '优惠金额不能大于租金', duration: 800 });
        this.formInfo.discount = 0;
      } else {
        this.formInfo.total = money - discount;
      }
    },
    goProduct() {
      this.productShow = true;
    },
    selectProduct(car) {
      this.productShow = false;
      this.product = car;
      this.formInfo.money = this.product.payment;
    },
    getOrderInfo() {
      const carInfo = this.$route.params.car;
      this.product = carInfo;
      console.log(carInfo);
      this.orderNo = carInfo.no;
      this.formInfo.money = carInfo.money;
      this.formInfo.days = carInfo.days;
      tradeInfo(this.id).then((res) => {
        const orderDetail = res.data.trade;
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
        this.startTime = new Date(orderDetail.start_time);
        this.endTime = new Date(orderDetail.end_time);
        this.startConfirm(this.startTime);
        this.endConfirm(this.endTime);
      });
    },
  },
  components: {
    hScrolls,
    productsList,
  },
};
</script>
<style lang="scss" scoped>
  .content {
    margin-top: 10px;
    .mint-cell {
      min-height: 0;
    }
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

