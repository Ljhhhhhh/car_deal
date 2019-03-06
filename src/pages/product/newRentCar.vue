<template>
  <div class="container">
    <div class="header">
      <mt-header :title="id!==null?formObj.name:'新增出租车辆'" ref="header" class="header">
        <router-link to="/product/rentCarList" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
    </div>
    <div style="margin-top:10px">
      <h-scrolls id="scrollWrap" ref="scrollWrap">
        <div class="form">
          <van-cell-group>
            <van-field required v-model="formObj.title" label="商品名称" placeholder="请输入" input-align="right"></van-field>
            <van-cell required title="车辆" is-link @click.native="selectCar = true">
              <div>{{ car.name }}</div>
            </van-cell>
            <van-field required v-model="formObj.price" label="押金价格" placeholder="请输入" input-align="right"></van-field>
            <van-field required v-model="formObj.payment" label="租金价格/日" placeholder="请输入" input-align="right"></van-field>
            <p class="car-photo_title">上传车辆照片</p>
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
            <van-cell title="标签：" readonly class="bor_no"></van-cell>
            <van-checkbox-group v-model="formObj.tags" class="check_box">
              <van-checkbox class="check_item" style="font-size:rem(15)"
                v-for="(item, index) in tagList"
                :key="index"
                :name="item.name"
              >
                {{ item.value }}
              </van-checkbox>
            </van-checkbox-group>
            <van-cell title="活动集合：" readonly class="bor_no">
              <!-- <div v-for="option in actList" :key="option.id">{{ option.name }}</div> -->
            </van-cell>
            <van-checkbox-group v-model="formObj.acts" class="check_box">
              <van-checkbox class="check_item" style="font-size:rem(15)"
                v-for="(item, index) in actList"
                :key="index"
                :name="item.id"
              >
               {{ item.name }}
              </van-checkbox>
            </van-checkbox-group>
            <!-- <van-field placeholder="请添加营销方案" type="textarea"></van-field> -->
          </van-cell-group>
          <p class="submit_box">
            <van-button type="default" size="large" class="submit_btn" @click="newVehicle" v-html="id===null?'确认添加':'确认修改'"></van-button>
          </p>
        </div>
      </h-scrolls>
      <h-car-list v-if="selectCar" father="newCar" @selectedCar="selectedCar"></h-car-list>
      <act v-if="selectAct" @selectedAct="selectedAct"></act>
    </div>
  </div>
</template>
<script>
import hScrolls from '@/components/hScrolls';
import hCarList from '@/components/hCarList';
import act from './act';
import {
  swiper,
  swiperSlide,
} from 'vue-awesome-swiper';
import { fetchParam } from '@/api/common/types';
import uploadConfig from '@/api/common/upload';
import { initScroll } from '@/utils/dom';
import { newVehicle, fentchActs, productInfo } from '@/api/product';

export default {
  data() {
    return {
      id: null,
      car: {},
      tagList: [],
      actList: [],
      imgArr: [],
      swiperOption: {
        // swipe配置
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
        },
      },
      uploadConfig,
      formObj: {
        carId: null,
        lx: 'rentings',
        payment: '',
        price: '',
        title: '',
        tags: [],
        acts: [],
      },
      tags: [],
      selectCar: false,
      selectAct: false,
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
    this.getTags();
    this.actsList();
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      this.getDetail(this.id);
    }
  },
  methods: {
    getDetail(id) {
      console.log(id);
      this.actsList();
      productInfo(id).then((res) => {
        console.log(res);
        const data = res.data.obj;
        // const finId = [];
        // data.financeList.map((item) => {
        //   finId.push(item.id);
        //   return finId;
        // });
        this.formObj = {
          carId: null,
          lx: data.lx,
          payment: data.payment,
          price: data.price,
          title: data.title,
          tags: [],
          acts: data.actList,
        };
        this.car.name = data.car.name;
        this.imgArr = data.uploadList !== null && data.uploadList.length ? data.uploadList : [];
      });
    },
    async getTags() {
      const res = await fetchParam('product_tags');
      this.tagList = res.data;
    },
    onread(r, f, m) {
      const res = JSON.parse(m);
      if (res.errno === 0) {
        this.imgArr.push(res.data.rows[0]);
        this.timer = setTimeout(() => {

        }, 200);
      }
    },
    removePhoto(img) {
      console.log(img);
      this.imgArr = this.imgArr.filter(v => v.id !== img.id);
      this.formObj.uploads = this.formObj.uploads.filter(v => v.id !== img.id);
    },
    actsList() {
      fentchActs().then((res) => {
        this.actList = res.data.rows;
      });
    },
    // selectedAct(row) {
    //   this.actList = row;
    //   this.selectAct = false;
    // },
    selectedCar(car) {
      this.car = car;
      this.selectCar = false;
    },
    newVehicle() {
      this.formObj.acts = [];
      this.formObj.carId = this.car.id;
      this.actList.map((item) => {
        this.formObj.acts.push(item.id);
        return this.formObj.acts;
      });
      this.formObj.uploads = [];
      this.imgArr.forEach((img) => {
        this.formObj.uploads.push({
          del: 0,
          id: img.id,
        });
      });
      console.log(this.formObj);
      newVehicle(this.formObj, this.id).then((res) => {
        if (res.errno === 0) {
          this.$router.push({
            name: 'rentCarList',
          });
        } else {
          console.log(res.errmsg);
        }
      });
    },
  },
  components: {
    hScrolls,
    hCarList,
    swiper,
    swiperSlide,
    act,
  },
};
</script>
<style lang="scss" scoped>
  .container {
    overflow: hidden;
    .check_box {
      display: flex;
      overflow: hidden;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      position: relative;
      line-height: 30px;
      border-bottom: 1px solid #eee;

      .check_item {
        justify-content: center;
        align-items: center;
        flex-direction: column;
        box-sizing: border-box;
        padding: 10px rem(15);
        color: #999999;
        font-size: rem(15);
        span {
          overflow: hidden;
        }
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

