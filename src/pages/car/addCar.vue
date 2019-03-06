<template>
  <div class="container">
    <!-- <keep-alive> -->
    <mt-header title="新增车辆" ref="header" class="header">
      <a @click.stop="$router.back" slot="left">
        <mt-button icon="back"></mt-button>
      </a>
    </mt-header>
    <h-scroll ref="scrollWrap" class="scroll_wrap">
      <div class="form_box">
        <van-field v-model="formObj.name" label="车辆名称：" required placeholder="请输入" input-align="right"></van-field>
        <van-cell title="车型：" required @click="openCars" :value="mode" />
        <van-field v-model="formObj.platNo" label="车牌：" placeholder="请输入" input-align="right"></van-field>
        <van-field v-model="formObj.frameNo" required label="车架号：" placeholder="请输入" input-align="right"></van-field>
        <van-field v-model="formObj.engine" label="发动机号：" placeholder="请输入" input-align="right"></van-field>
        <van-field v-model="formObj.mileage" label="行驶公里：" required placeholder="请输入" input-align="right">
          <span slot="icon">KM</span>
        </van-field>
        <van-cell title="车辆颜色：" :value="formObj.color" required is-link @click.native="toggleColor" />

        <van-cell title="车辆类型：" required is-link>
          <div>
            <select name="" v-model="formObj.type" placeholder="请选择">
              <option v-for="option in selectOptions.type" :value="option.name" :key="option.id">{{option.value}}</option>
            </select>
          </div>
        </van-cell>
        <van-field v-model="formObj.price" label="采购价：" required placeholder="请输入" input-align="right">
          <span slot="icon">元</span>
        </van-field>
        <van-field v-model="formObj.mprice" label="厂商指导价：" required placeholder="请输入" input-align="right">
          <span slot="icon">元</span>
        </van-field>
        <van-field v-model="formObj.bprice" label="批发价：" required placeholder="请输入" input-align="right">
          <span slot="icon">元</span>
        </van-field>
        <van-switch-cell v-model="formObj.share" title="是否共享" />
        <van-cell v-if="NO" title="编号" :value="NO" />
        <van-field v-model="formObj.auth" label="权属人：" placeholder="请输入" input-align="right"></van-field>
        <!-- 如果是修改，根据接口获取编号 -->
        <van-field
          v-model="formObj.remark"
          label="备注："
          type="textarea"
          placeholder="请输入"
          rows="1"
          autosize
          input-align="right"
        />
        <div class="document van-hairline--bottom">
          <p class="title">车辆图册：</p>
          <div class="banner" v-show="formObj.uploads && formObj.uploads.length" >
            <swiper :options="swiperConfig" ref="mySwiper">
              <swiper-slide v-for="(banner, index) in formObj.uploads" :key="index">
                <div class="img_box">
                  <icon name="close" scale="2.5" class="remove_img" @click.native="remove('uploads', banner)"/>
                  <img :src="banner.url">
                </div>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>

          <van-uploader multiple :after-read="onRead" @click.native="setOptions('uploads')">
            <div class="btn">
              <van-icon name="photograph" size="2em" color="#41a0fe" />
              <p>点击上传</p>
            </div>
          </van-uploader>
        </div>
        <div class="document van-hairline--bottom">
          <p class="title">封面图：</p>
          <div v-show="!!formObj.carimgs" class="img_box">
            <icon name="close" scale="2.5" class="remove_img" @click.native="remove('carimgs')"/>
            <img :src="formObj.carimgs">
          </div>
          <!-- <div v-show="formObj.uploads.length" class="img_box">
            <icon name="close" scale="2.5" class="remove_img" @click.native="remove('uploads')"/>
            <img :src="formObj.uploads">
          </div> -->
          <van-uploader :after-read="onRead" @click.native="setOptions('carimgs')">
            <div class="btn">
              <van-icon name="photograph" size="2em" color="#41a0fe" />
              <p>点击上传</p>
            </div>
          </van-uploader>
        </div>
        <div class="btn">
          <van-button size="large" @click="submit" type="default">提交</van-button>
        </div>
      </div>
    </h-scroll>
    <van-popup v-model="selectingColor" position="bottom" class="select_box">
      <van-checkbox-group v-model="color" @change="colorChange">
          <van-cell-group>
            <van-cell
              v-for="option in selectOptions.color"
              clickable
              :key="option.id"
              :title="option.name"
            >
              <van-checkbox :name="option.name" ref="checkboxes" />
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
    </van-popup>
    <h-cars v-if="isSelectCar" @selectedMode="setMode"></h-cars>
  </div>
</template>
<script>
import hScroll from '@/components/hScroll';
import {
  initScroll,
} from '@/utils/dom';
import hCars from '@/components/hCars';
import {
  fetchParam,
} from '@/api/common/types';
import { swiperConfig } from '@/pages/config';
import uploadFile from '@/api/common/uploadFile';
// eslint-disable-next-line
import 'swiper/dist/css/swiper.css';
import {
  swiper,
  swiperSlide,
} from 'vue-awesome-swiper';
import { addCar } from '@/api/car';


export default {
  name: 'addCar',
  data() {
    return {
      NO: '',
      formObj: {
        mode: false,
        uploads: [],
        color: '',
      },
      swiperConfig,
      currentName: '',
      mode: '请选择',
      isSelectCar: false,
      selectOptions: {
        color: [],
        type: [],
      },
      selectingColor: false,
      color: [],
    };
  },
  created() {
    this.getParams();
  },
  mounted() {
    this.$nextTick(() => {
      const win = document.documentElement;
      const header = this.$refs.header;
      const scroll = this.$refs.scrollWrap;
      console.log(scroll);
      initScroll(win, scroll, header);
    });
  },
  methods: {
    toggleColor() {
      this.selectingColor = !this.selectingColor;
    },
    colorChange(val) {
      this.formObj.color = val.join(',');
    },
    openCars() {
      this.isSelectCar = true;
    },
    setMode(mode) {
      this.isSelectCar = false;
      this.formObj.mprice = (mode.price * 10000).toFixed(0);
      this.formObj.modeId = mode.id;
      this.mode = mode.name;
    },
    onRead(r) {
      const fileData = new FormData();
      if (Array.isArray(r) && r.length) {
        r.forEach((f, i) => {
          fileData.append(`${this.currentName}&${i}`, f.file);
        });
      } else {
        fileData.append(this.currentName, r.file);
      }
      this.$toast.loading({
        mask: true,
        forbidClick: true,
        message: '图片上传中...',
        duration: 0,
      });
      uploadFile(this.currentName, fileData).then((res) => {
        if (this.currentName === 'carimgs') {
          const { url } = res.data.rows[0];
          this.$set(this.formObj, 'carimgs', url);
        } else {
          const rows = res.data.rows;
          if (!this.formObj[this.currentName]) {
            this.$set(this.formObj, this.currentName, []);
          }
          const fileArr = this.formObj[this.currentName];
          rows.forEach((f) => {
            fileArr.push({
              id: f.id,
              url: f.url,
              del: 0,
              name: f.name,
            });
            // fileArr.push(f.url);
          });
          this.$set(this.formObj, this.currentName, fileArr);
          // this.formObj[this.currentName] = fileArr;
        }
        this.$nextTick(() => {
          this.$refs.scrollWrap.refresh();
          this.$toast.clear();
        });
      });
    },
    setOptions(name) {
      this.currentName = name;
    },
    remove(type, file) {
      if (type === 'carimgs') {
        this.formObj.carimgs = '';
      } else {
        this.formObj[type].forEach((f, i) => {
          // if (file.id === f.id) {
          //   this.formObj[type].splice(i, 1);
          // }
          if (file === f) {
            this.formObj[type].splice(i, 1);
          }
        });
      }
    },
    submit() {
      addCar(this.formObj).then((res) => {
        console.log(res);
        if (res.errno === 0) {
          this.$toast.success({
            message: '保存成功，即将返回车辆列表',
            duration: 1000,
          });
          setTimeout(() => {
            this.$router.push({
              name: 'carList',
            });
          }, 1000);
        } else {
          this.$toast.fail(res.errmsg);
        }
      });
    },
    getParams() {
      fetchParam('car_color').then((res) => {
        this.selectOptions.color = res.data;
      });
      fetchParam('car_type').then((res) => {
        this.selectOptions.type = res.data;
      });
    },
  },
  components: {
    hScroll,
    hCars,
    swiper,
    swiperSlide,
  },
};

</script>
<style lang="scss" scoped>
  .select_box{
    max-height: 50%;
    overflow-y: auto;
  }
  .form_box {
    padding: 10px 0;
  }
  .btn{
    width: 100%;
    height: auto;
    text-align: center;
    box-sizing: border-box;
    padding: 20px rem(15);
    font-size: 0;
  }
  .document{
    padding: 0 rem(15);
    font-size: rem(14);
    color: #333;
    .img_box{
      width: 100%;
      height: 330px;
      padding: rem(15);
      border: 1px dashed $theme_color;
      border-radius: rem(5);
      margin-bottom: 10px;
      position: relative;
      box-sizing: border-box;
      img{
        display: block;
        margin: 0 auto;
        max-width: 95%;
        max-height: 300px;
        width: auto;
        height: auto;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
      .remove_img{
        position: absolute;
        top: rem(5);
        right: rem(5);
        // background: #AAA;
        border: 1px solid $theme_color;
        border-radius: 50%;
        padding: rem(10);
        color: $theme_color;
        z-index: 2;
      }
    }
    .van-uploader{
      display: block;
      border: 1px dotted $theme_color;
      border-radius: rem(5);
      background: #41a0fe1c;
    }
    .title{
      line-height: 30px;
    }
    .list{
      width: auto;
      padding-left: rem(10);
      li{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .icon{
          margin: 0 rem(5);
        }
      }
    }
    .btn{
      font-size: rem(14);
      margin: 0 auto;
      padding: 40px 0;
      p{
        color: #41a0fe;
      }
    }
  }
</style>
