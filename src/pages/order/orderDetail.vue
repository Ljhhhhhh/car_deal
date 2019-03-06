<template>
  <div class="container">
    <div class="header">
      <mt-header title="订单详情" ref="header" class="header">
        <router-link to="/order/list" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
    </div>
    <div style="margin-top:10px">
      <h-scrolls id="scrollWrap" ref="scrollWrap">
        <div class="form">
          <div class="car-photo_box">
            <div class="banner">
              <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide v-for="(banner, index) in imgArr" :key="index">
                  <img :src="banner.url">
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
              </swiper>
            </div>
          </div>
          <van-cell-group>
            <van-cell title="客户："><span>{{ formObj.customer }}</span></van-cell>
            <van-cell title="联系方式："><span>{{ formObj.customer }}</span></van-cell>
            <van-cell title="订单号："><span>{{ formObj.customer }}</span></van-cell>
            <van-cell title="交付日期："><span>{{ formObj.customer }}</span></van-cell>
            <van-cell title="订单状态："><span>{{ formObj.customer }}</span></van-cell>
          </van-cell-group>
          <van-cell-group style="margin-top:10px;">
            <van-cell title="结款方式："><span>{{ formObj.customer }}</span></van-cell>
            <van-cell title="订单期数："><span>{{ formObj.customer }}</span></van-cell>
            <van-cell title="订单金额："><span>{{ formObj.customer }}</span></van-cell>
          </van-cell-group>
          <p class="submit_box">
            <van-button type="default" size="large" class="submit_btn" @click.native="newVehicle">受理订单</van-button>
          </p>
        </div>
      </h-scrolls>
    </div>
  </div>
</template>
<script>
import hScrolls from '@/components/hScrolls';
import { initScroll } from '@/utils/dom';
// eslint-disable-next-line
import 'swiper/dist/css/swiper.css';
import {
  swiper,
  swiperSlide,
} from 'vue-awesome-swiper';

export default {
  data() {
    return {
      id: null,
      swiperOption: {
        // swipe配置
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
        },
      },
      formObj: {
        price: '客户',
        customer: '',
      },
      imgArr: [],
    };
  },
  mounted() {
    const win = window.document.documentElement;
    const scrollWrap = this.$refs.scrollWrap;
    const header = this.$refs.header;
    const mySwiper = this.$refs.mySwiper;
    this.$nextTick(() => {
      initScroll(win, scrollWrap, header, mySwiper);
    });
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      console.log(this.id);
      this.getDetails(this.id);
    }
  },
  methods: {
    getDetails(id) {
      console.log(id);
      this.imgArr = [];
    },
    newVehicle() {
    },
  },
  components: {
    hScrolls,
    swiper,
    swiperSlide,
  },
};
</script>
<style lang="scss" scoped>
  .container{
    overflow: hidden;
    font-size: rem(15);
    .van-cell {
      color:#999999;
      span {
        color:#333333;
      }
    }
    .bor_no::after {
      border-bottom: none;
    }
    .car-photo_title {
      font-size: rem(13);
      color: #999;
      padding: 0 rem(15);
    }

    .car-photo_box {
      padding: 0 rem(30) 30px;
      font-size: 0;
      width: auto;
      border-bottom: 1px solid #eee;
      height: auto;
      .banner{
        width: 100%;
        margin-bottom: 10px;
        img{
          width: 100%;
        }
      }
      .car-photo{
        width: 100%;
        height: auto;
        margin-bottom: 10px;
      }

      .add-photo {
        border: 1px dashed $theme_color;
        font-size: rem(14);
        height: 193px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(65, 160, 254, 0.05);
        border-radius: rem(5);

        .uploader-btn {
          border: none;
          color: $theme_color;
        }

        .icon {
          display: block;
          margin: 0 auto;
        }
      }
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

