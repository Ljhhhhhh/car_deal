<template>
  <div class="container">
    <mt-header title="车辆入库" ref="header" class="header">
      <router-link to="/" @click.native="$router.go(-1)" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <h-scroll ref="scroll" class="form-box van-hairline--top">
      <div class="form">
        <van-cell-group>
          <van-field v-model="formObj.frameNo" label="车架号" placeholder="请输入" input-align="right"></van-field>
          <van-cell title="车辆" is-link @click.native="selectCar = true">
            <div>{{car.name}}</div>
          </van-cell>
          <van-cell title="车辆来源" is-link>
            <div>
              <select name="" v-model="formObj.origin" placeholder="请选择">
                <option v-for="option in selectOptions.origin" :value="option.name" :key="option.id">{{option.value}}</option>
              </select>
            </div>
          </van-cell>
          <van-cell title="车辆颜色" is-link>
            <div>
              <select name="" v-model="formObj.color" placeholder="请选择">
                <option v-for="option in selectOptions.color" :value="option.name" :key="option.id">{{option.value}}</option>
              </select>
            </div>
          </van-cell>
          <van-cell title="供应商" is-link>
            <div>
              <select name="" v-model="formObj.gysId" placeholder="请选择">
                <option v-for="option in selectOptions.supplier" :value="option.id" :key="option.id">{{option.name}}</option>
              </select>
            </div>
          </van-cell>
          <!-- <van-field v-model="formObj.mileage" clearable label="公里数" placeholder="请输入" input-align="right" /> -->
          <van-field v-model="formObj.mileage" label="公里数" placeholder="请输入" input-align="right">
            <span slot="icon">KM</span>
          </van-field>
          <van-cell title="停车场" is-link>
            <div>
              <select name="" v-model="formObj.positionId" placeholder="请选择">
                <option v-for="option in selectOptions.park" :value="option.id" :key="option.id">{{option.name}}</option>
              </select>
            </div>
          </van-cell>
        </van-cell-group>
        <p class="car-photo_title">车辆照片</p>
        <div class="car-photo_box">
          <div class="banner">
            <swiper :options="swiperOption" ref="mySwiper">
              <swiper-slide v-for="(banner, index) in imgArr" :key="index" @click.native="removePhoto(banner)">
                <img :src="banner.url">
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
          <div class="add-photo">
            <uploader :options="uploadConfig.options" class="uploader-example" @file-success="onread">
              <uploader-unsupport></uploader-unsupport>
              <uploader-btn :attrs="uploadConfig.attrs">
                <icon name="take_photos" scale="5" class="icon"></icon>
                <p>添加图片</p>
              </uploader-btn>
              <!-- <uploader-list></uploader-list> -->
            </uploader>
          </div>
        </div>
        <p class="submit_box">
          <van-button type="default" :disabled="btnDisabled" size="large" class="submit_btn" @click="typeinCar">提交</van-button>
        </p>
      </div>
    </h-scroll>
    <h-car-list v-if="selectCar" @selectedCar="selectedCar"></h-car-list>
  </div>
</template>
<script>
import hScroll from '@/components/hScroll';
import {
  fetchParam,
} from '@/api/common/types';
import {
  fetchSuppliers,
  fetchPark,
  typein,
  typeinDetail,
  carDetail,
} from '@/api/car';
import uploadConfig from '@/api/common/upload';
import hCarList from '@/components/hCarList';
// eslint-disable-next-line
import 'swiper/dist/css/swiper.css';
import {
  swiper,
  swiperSlide,
} from 'vue-awesome-swiper';

export default {
  name: 'carTypein',
  data() {
    return {
      id: null, // 出库订单Id
      swiperOption: {
        // swipe配置
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
        },
      },
      selectCar: false,
      uploadConfig,
      car: {},
      formObj: {
        platNo: '',
        frameNo: '',
        carId: '',
        origin: '',
        color: '',
        gysId: '',
        mileage: '',
        positionId: '',
        uploads: [],
      },
      selectOptions: {
        origin: [],
        color: [],
        supplier: [],
        park: [],
      },
      imgArr: [],
      timer: null,
    };
  },
  computed: {
    btnDisabled() {
      if (!this.car.id) {
        return true;
      }
      if (!this.imgArr.length) {
        return true;
      }
      Object.keys(this.formObj).forEach((v) => {
        if (v !== 'uploads') {
          if (!this.formObj[v]) {
            return true;
          }
        }
        return false;
      });
      return false;
    },
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      this.getDetail(this.id);
    }
  },
  mounted() {
    this._initPage();
    this.getParams();
  },
  methods: {
    getDetail(id) {
      typeinDetail(id).then((res) => {
        const data = res.data;
        this.formObj = {
          platNo: data.platNo,
          frameNo: data.frameNo,
          carId: data.carId,
          origin: data.origin,
          color: data.color,
          gysId: data.gysId,
          mileage: data.mileage,
          positionId: data.positionId,
          uploads: [],
        };
        this.imgArr = data.uploadList.length ? data.uploadList : [];
        carDetail(data.carId).then((item) => {
          this.car = item.data;
        });
      });
    },
    typeinCar() {
      this.formObj.carId = this.car.id;
      this.formObj.uploads = [];
      this.imgArr.forEach((img) => {
        this.formObj.uploads.push({
          del: 0,
          id: img.id,
        });
      });
      typein(this.formObj, this.id).then((res) => {
        if (res.errno === 0) {
          // console.log(res);
          this.$router.push({
            name: 'typeinList',
          });
        }
      });
    },
    selectedCar(car) {
      this.car = car;
      this.selectCar = false;
    },
    removePhoto(img) {
      console.log(img);
      this.imgArr = this.imgArr.filter(v => v.id !== img.id);
      this.formObj.uploads = this.formObj.uploads.filter(v => v.id !== img.id);
    },
    onread(r, f, m) {
      const res = JSON.parse(m);
      if (res.errno === 0) {
        // this.formObj.uploads.push({
        //   del: 0,
        //   id: res.data.rows[0].id,
        // });
        this.imgArr.push(res.data.rows[0]);
        this.timer = setTimeout(() => {
          // this.$refs.scroll.refresh();
        }, 200);
      }
    },
    getParams() {
      const me = this;
      fetchParam('car_origin').then((res) => {
        me.selectOptions.origin = res.data;
      });
      fetchParam('car_color').then((res) => {
        me.selectOptions.color = res.data;
      });
      fetchSuppliers().then((res) => {
        me.selectOptions.supplier = res.data.rows;
      });
      fetchPark().then((res) => {
        me.selectOptions.park = res.data.rows;
      });
    },
    _initPage() {
      const win = document.documentElement.clientHeight;
      const header = this.$refs.header.$el.clientHeight;
      const content = this.$refs.scroll.$el;
      content.style.height = `${win - header}px`;
      content.style.maxHeight = `${win - header}px`;
    },
  },
  components: {
    hScroll,
    hCarList,
    swiper,
    swiperSlide,
  },
  destroyed() {
    this.timer = null;
  },
};

</script>
<style lang="scss" scoped>
  .form-box {
    overflow: hidden;

    .car-photo_title {
      font-size: rem(13);
      color: #999;
      padding: 0 rem(15);
    }

    .car-photo_box {
      padding: 0 rem(30);
      font-size: 0;
      width: auto;
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
