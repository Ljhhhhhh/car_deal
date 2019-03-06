<template>
  <div class="container">
    <mt-header title="车辆出库" ref="header" class="header">
      <a @click.stop="$router.back()" slot="left">
        <mt-button icon="back"></mt-button>
      </a>
    </mt-header>
    <h-scroll ref="scrollWrap">
      <div class="content">
        <div class="car-desc" v-if="car.name" @click="carListShow = true">
          <div class="car-thumb">
            <img v-lazy="car.thumb || 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542888361079&di=d10e185c4c8e9eebd8875c872d3f6e40&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4034970a304e251ff00a96c5ac86c9177f3e5309.jpg'">
          </div>
          <div class="car-info">
            <p class="title">{{car.name}} </p>
            <p class="highlight">公里数{{car.mileage}}</p>
            <p class="addr">位置：<span>{{car.addr || '我™怎么知道位置'}}</span></p>
          </div>
          <!-- <div class="car-status_msg"><span>{{car.state}}</span></div> -->
        </div>
        <div v-else class="select-car">
          <p>选择车辆</p>
          <div class="btn" @click="carListShow = true"></div>
        </div>
        <div class="form">
          <van-cell-group>
            <van-cell title="出库人" is-link>
              <div>
                <select name="" v-model="formObj.osterId">
                  <option v-for="user in usersList" :key="user.userId" :value="user.userId">{{user.username}}</option>
                </select>
              </div>
            </van-cell>
            <van-cell title="交接人" is-link>
              <div>
                <select name="" v-model="formObj.managerId">
                  <option v-for="user in usersList" :key="user.userId" :value="user.userId">{{user.username}}</option>
                </select>
              </div>
            </van-cell>
            <van-cell title="出库类型" is-link>
              <div>
                <select name="" v-model="formObj.lx">
                  <option value="Q">其他</option>
                </select>
              </div>
            </van-cell>
            <van-field v-model="formObj.remark" label="备注" placeholder="请输入" input-align="right" type="textarea" autosize></van-field>
            <div class="photo-box">
              <p class="car-photo_title">车辆交接照片</p>
              <div class="car-photo_box">
                <!-- <img class="car-photo" v-if="formObj.connectPhoto" @click="removePhoto(2)" :src="formObj.connectPhoto"> -->
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
            </div>
            <!-- <van-field v-model="phone" label="手机号" placeholder="请输入" input-align="right"></van-field>
            <van-field v-model="verify" label="验证码" placeholder="请输入验证码" input-align="right">
              <van-button class="verify_btn" slot="button" size="small" type="default" @click="getVerify" :disabled="phoneFlag">
                发送验证码
              </van-button>
            </van-field> -->
          </van-cell-group>
        </div>
        <p class="submit_box">
          <van-button type="default" :disabled="btnDisabled" size="large" class="submit_btn" @click="stockoutCar">提交</van-button>
        </p>
      </div>
    </h-scroll>
    <h-car-list v-if="carListShow" @selectedCar="selectedCar"></h-car-list>
    <van-popup v-model="popup.show" position="top" :overlay="false" class="popup">
      {{popup.msg}}
    </van-popup>
  </div>
</template>
<script>
import hScroll from '@/components/hScroll';
import uploadConfig from '@/api/common/upload';
import hCarList from '@/components/hCarList';
import { fetchUsers, getVerify } from '@/api/common/users';
import { stockout, stockoutDetail, carDetail } from '@/api/car';
import {
  initScroll,
} from '@/utils/dom';
// eslint-disable-next-line
import 'swiper/dist/css/swiper.css';
import {
  swiper,
  swiperSlide,
} from 'vue-awesome-swiper';

export default {
  name: 'carStockOut',
  data() {
    return {
      id: null, // 修改的id
      swiperOption: {
        // swipe配置
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
        },
      },
      popup: {
        msg: '',
        show: false,
        time: null,
        wait: 0,
      },
      carListShow: false,
      uploadConfig,
      phone: '',
      car: {
        thumb: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542888361079&di=d10e185c4c8e9eebd8875c872d3f6e40&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4034970a304e251ff00a96c5ac86c9177f3e5309.jpg',
        // name: 'hello world',
        mileage: '186541',
        addr: '位置啊位置',
        state: '在售',
      },
      verify: '',
      formObj: {
        carId: '',
        uploads: [],
        managerId: '', // 交接人ID
        osterId: '', // 出库人Id
        remark: '',
        lx: '',
      },
      imgArr: [],
      usersList: [],
      selectOptions: {
        origin: [],
        color: [],
        supplier: [],
        park: [],
      },
    };
  },
  created() {
    this.getUsers();
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      this.getStockoutDetail(this.id);
    }
  },
  mounted() {
    const win = window.document.documentElement;
    const header = this.$refs.header;
    const scroll = this.$refs.scrollWrap;
    initScroll(win, scroll, header);
  },
  watch: {
    // eslint-disable-next-line
    'popup.show': function (val) {
      if (val) {
        this.popup.time = setTimeout(() => {
          this.popup.show = false;
        }, 2000);
      }
    },
    // eslint-disable-next-line
    'popup.wait': function (val) {
      if (val > 0) {
        this.popup.time = setTimeout(() => {
          this.popup.wait--;
        }, 1000);
      } else {
        this.popup.time = null;
      }
    },
  },
  computed: {
    phoneFlag() {
      const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (phoneReg.test(this.phone) && this.popup.wait <= 0) {
        return false;
      }
      return true;
    },
    btnDisabled() {
      if (!this.car.id) {
        return true;
      }
      if (!this.imgArr.length) {
        return true;
      }
      Object.keys(this.formObj).forEach((k) => {
        if (!this.formObj[k] && k !== 'uploads') {
          return true;
        }
        return false;
      });
      return false;
    },
  },
  methods: {
    getStockoutDetail(id) {
      stockoutDetail(id).then((res) => {
        console.log(res);
        const data = res.data;
        this.formObj = {
          carId: data.carId,
          uploads: [],
          managerId: data.managerId, // 交接人ID
          osterId: data.osterId, // 出库人Id
          remark: data.remark,
          lx: data.lx,
        };
        this.imgArr = data.uploadList.length ? data.uploadList : [];
        carDetail(data.carId).then((item) => {
          this.car = item.data;
        });
      });
    },
    removePhoto(photo) {
      this.imgArr = this.imgArr.filter(img => img.id !== photo.id);
    },
    getVerify() {
      getVerify(this.phone).then((res) => {
        if (res.errno === 0) {
          this.popup.msg = '已发送验证码';
          this.popup.wait = 60;
        } else {
          this.popup.msg = res.errmsg;
        }
        this.popup.show = true;
      });
    },
    stockoutCar() {
      const uploads = [];
      this.imgArr.forEach((img) => {
        uploads.push({
          del: 0,
          id: img.id,
        });
      });
      const data = this.formObj;
      data.uploads = uploads;
      stockout(data, this.id).then((res) => {
        if (res.errno === 0) {
          this.$router.push({
            name: 'stockOutList',
          });
        } else {
          // alert('操作失败，请重试')
        }
      });
    },
    selectedCar(car) {
      this.car = car;
      this.formObj.carId = car.id;
      this.carListShow = false;
    },
    getUsers() {
      fetchUsers().then((res) => {
        this.usersList = res.data.rows;
      });
    },
    onread(r, f, m) {
      const res = JSON.parse(m);
      if (res.errno === 0) {
        this.imgArr = this.imgArr.concat(res.data.rows);
        if (!this.timer) {
          this.timer = setTimeout(() => {
            this.$refs.scrollWrap.refresh();
            this.timer = null;
          }, 200);
        }
      }
    },
  },
  components: {
    hScroll,
    hCarList,
    swiper,
    swiperSlide,
  },
};

</script>
<style lang="scss" scoped>
  .banner {
    width: 100%;
    height: auto;
    position: relative;
    margin-bottom: 20px;

    img {
      width: 100%;
      height: auto;
    }

    .indicators {
      position: absolute;
      bottom: rem(10);
      right: rem(15);
      color: #999;
      font-size: rem(12);
      font-family: $font_bold;
      letter-spacing: rem(2);
      z-index: 3;
    }
  }
  .popup{
    font-size: rem(16);
    text-align: center;
    line-height: 40px;
    background: #999;
    color: #FFF;
  }
  .content{
    padding-top: 10px;
  }
  .car-desc {
    width: auto;
    height: 115px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 rem(15) 10px;
    border-radius: rem(5);
    padding: 20px rem(12.5);
    background: #FFF;
    box-sizing: border-box;
    position: relative;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.1);

    .car-thumb {
      width: rem(70);
      height: rem(70);
      position: relative;
      overflow: hidden;

      img {
        width: auto;
        height: 100%;
      }
    }

    .car-info {
      flex: 1;
      padding-left: rem(15);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;

      p {
        margin-block-start: 0;
        margin-block-end: 0;
      }

      p.title {
        color: #333;
        font-size: rem(16);
        max-width: 78%;
      }

      p.addr {
        color: #999;
        font-size: rem(12);
      }

      p.highlight {
        color: #41A0FE;
        font-size: rem(12);

        span {
          font-size: rem(20);
          display: inline-block;
          padding: 0 rem(3);
        }
      }
    }

    .car-status_msg {
      position: absolute;
      right: 0;
      top: 10px;
      font-size: rem(14);
      width: rem(66.5);
      height: rem(30);
      line-height: rem(30);
      text-align: center;
      color: #FFF;
      background: linear-gradient(to right, #6DB0F2, #41A0FE);
      border-radius: 14px 0 0 14px;
    }
  }

  .select-car {
    width: auto;
    height: auto;
    padding: 0 rem(15);
    margin-bottom: 20px;

    p {
      color: #999;
      font-size: rem(15);
      margin-block-start: 0;
    }

    .btn {
      width: rem(50);
      height: rem(50);
      background: #FFF;
      border-radius: rem(5);
      border: 1px dashed $theme_color;
      margin: 0 rem(13);
      position: relative;

      &::before,
      &::after {
        content: '';
        position: absolute;
        background: $theme_color;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
      }

      &:before {
        width: 1px;
        height: 70%;
      }

      &::after {
        width: 70%;
        height: 1px;
      }
    }
  }

  .form {
    .photo-box {
      background: #f5f4f7;
    }

    .car-photo_title {
      font-size: rem(13);
      color: #999;
      padding: 0 rem(15);
      margin-block-start: 0;
      padding-top: 15px;
    }

    .car-photo_box {
      padding: 0 rem(30);
      font-size: 0;
      width: auto;
      height: auto;
      border-bottom: 20px solid transparent;

      .car-photo {
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

    .verify_btn {
      background: #C4C7D0;
      color: #F5F5F8;
      border-radius: rem(5);
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
