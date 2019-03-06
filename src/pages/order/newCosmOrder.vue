<template>
  <div class="container">
    <mt-header :title="id?'修改订单':'添加订单'">
      <router-link to="/order" slot="left" ref="header">
        <mt-button icon="back" style="color:#333"></mt-button>
      </router-link>
    </mt-header>
    <div class="content" ref="scrollWrap">
      <h-scrolls class="scroll-wrap">
        <van-cell-group>
          <van-field v-if="id" label="订单编号" v-model="orderNo" placeholder="请输入订单号" input-align="right"></van-field>
          <van-field label="客户" :readonly="id !== null" v-model="formInfo.usrname" placeholder="请输入客户姓名" input-align="right"></van-field>
          <van-field label="联系方式" :readonly="id !== null" v-model="formInfo.phone" placeholder="请输入客户手机号码" input-align="right"></van-field>
          <van-cell title="商品" @click="goProduct" v-model="product.title" is-link></van-cell>
          <!-- <van-field label="开始时间" placeholder="请选择" @click="startDateshow = !startDateshow" v-model="formInfo.startTime" input-align="right" :max="formInfo.endTime" is-link></van-field>
          <van-field label="结束时间" placeholder="请选择" @click="endDateshow = !endDateshow" v-model="formInfo.endTime"  input-align="right" :min="formInfo.startTime" is-link></van-field> -->
          <van-field label="初始金额" v-model="formInfo.money" palceholder="请输入" input-align="right"></van-field>
          <van-field label="优惠金额" v-model="formInfo.discount" @keyup="count(formInfo.money)" palceholder="请输入" input-align="right"></van-field>
          <van-field label="消费金额" v-model="formInfo.total" palceholder="请输入" input-align="right"></van-field>
        </van-cell-group>
        <p class="submit_box">
          <van-button v-if="status === 0" size="large" @click="addOrder" class="submit_btn">{{id?'确认修改':'提交'}}</van-button>
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
    <products-list v-if="productShow" @selectProduct="selectProduct" lx="cosm"></products-list>
  </div>
</template>
<script>
import hScrolls from '@/components/hScrolls';
import productsList from './productsList';
import { tradeInfo, addOrder, acceptOrder } from '@/api/order';
import { initScroll } from '@/utils/dom';

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
        type: 'cosm',
        productId: null,
        usrid: null,
        // startTime: null,
        // endTime: null,
        total: null,
        discount: null,
        usrname: '',
        phone: '',
        money: null,
      },
      product: {},
      orderId: null,
      endTime: null,
      startTime: new Date(),
      time: null,
    };
  },
  created() {
    this.id = this.$route.params.car ? this.$route.params.car.id : null;
    if (this.id) {
      this.getOrderInfo();
    }
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
  mounted() {
    const win = window.document.documentElement;
    const scrollWrap = this.$refs.scrollWrap;
    const header = this.$refs.header;
    this.$nextTick(() => {
      initScroll(win, scrollWrap, header);
    });
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
    goProduct() {
      this.productShow = true;
    },
    selectProduct(car) {
      this.productShow = false;
      this.product = car;
      this.formInfo.money = this.product.price;
    },
    count(money) {
      const discount = this.formInfo.discount;
      if (discount >= money) {
        this.$toast.fail('优惠金额不能大于租金');
        this.formInfo.discount = 0;
      } else {
        this.formInfo.total = money - discount;
      }
    },
    timeChoose(picker) {
      this.time = picker.getValues();
    },
    startConfirm(value) {
      const time = this.time !== null ? `${this.time[0]}-${this.time[1]}-${this.time[2]} ${this.time[3]}:${this.time[4]}` : `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, 0)}` +
        `-${String(value.getDate()).padStart(2, 0)}` +
        ` ${String(value.getHours()).padStart(2, 0)}:${String(value.getMinutes()).padStart(2, 0)}`;
      this.formInfo.startTime = time;
      this.startDateshow = false;
    },
    endConfirm(value) {
      const time = this.time !== null ? `${this.time[0]}-${this.time[1]}-${this.time[2]} ${this.time[3]}:${this.time[4]}` : `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, 0)}` +
        `-${String(value.getDate()).padStart(2, 0)}` +
        ` ${String(value.getHours()).padStart(2, 0)}:${String(value.getMinutes()).padStart(2, 0)}`;
      this.formInfo.endTime = time;
      this.endDateshow = false;
    },
    getOrderInfo() {
      const carInfo = this.$route.params.car;
      this.product = carInfo;
      console.log(carInfo);
      this.orderNo = carInfo.no;
      this.formInfo.money = carInfo.money;
      tradeInfo(this.id).then((res) => {
        const orderDetail = res.data.trade;
        this.status = orderDetail.status;
        this.product.id = orderDetail.product_id;
        Object.assign(this.formInfo, {
          discount: orderDetail.discount,
          usrname: orderDetail.name,
          phone: orderDetail.phone,
          total: orderDetail.total,
        });
        // this.startTime = new Date(orderDetail.start_time);
        // console.log(this.startTime);
        // this.endTime = new Date(orderDetail.end_time);
        // this.startConfirm(this.startTime);
        // this.endConfirm(this.endTime);
      });
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
              name: 'cosmOrderlist',
            });
          } else {
            this.$toast.fail(res.errmsg);
          }
        });
      }
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
  select:invalid { color: gray; }
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

