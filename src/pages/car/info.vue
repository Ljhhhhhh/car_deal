<template>
  <div class="container">
    <mt-header :title="title" ref="header" class="header">
      <a @click.stop="$router.back" slot="left">
        <mt-button icon="back"></mt-button>
      </a>
    </mt-header>
    <h-scroll class="scroll-box" ref="scrollWrap">
      <div class="content">
        <div class="car-detail-desc" v-if="currentShowPrograma==='desc'">
          <div class="car-desc">
            <div class="car-thumb">
              <img v-lazy="car.thumb || 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542888361079&di=d10e185c4c8e9eebd8875c872d3f6e40&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4034970a304e251ff00a96c5ac86c9177f3e5309.jpg'">
            </div>
            <div class="car-info">
              <p class="title">{{car.name}} </p>
              <p class="highlight">公里数{{car.mileage}}</p>
              <p class="addr">位置：<span>{{car.addr || '我™怎么知道位置'}}</span></p>
            </div>
            <div class="car-status_msg"><span>{{car.state}}</span></div>
          </div>
          <div class="car-link_box">
            <router-link to='/'>
              <img src="../../assets/images/1.jpg" alt="">
              <p>基本信息</p>
            </router-link>
            <router-link to='/car/detail/1/photos'>
              <img src="../../assets/images/1.jpg" alt="">
              <p>车辆照片</p>
            </router-link>
            <router-link to='/'>
              <img src="../../assets/images/1.jpg" alt="">
              <p>使用情况</p>
            </router-link>
            <router-link to='/'>
              <img src="../../assets/images/1.jpg" alt="">
              <p>监测维修</p>
            </router-link>
            <router-link to='/'>
              <img src="../../assets/images/1.jpg" alt="">
              <p>监测维修</p>
            </router-link>
          </div>
        </div>
        <van-cell-group class="car-detail-info" v-if="currentShowPrograma==='info'">
          <van-cell title="车架号:" value="SDFSLDJF2345SDFU23" />
          <van-cell title="车辆型号:" value="保时捷卡宴2017款3.0T运动款" />
          <van-cell title="车辆编号:" value="001" />
          <van-cell title="车辆来源:" value="杭州顺丰4S店购买" />
          <van-cell title="车辆颜色:" value="银灰色" />
          <van-cell title="供应商:" value="不知道" />
          <van-cell title="公里数:" value="20000km" />
          <van-cell title="停车场:" value="人车人运营中心1楼" />
        </van-cell-group>
        <div class="car-detail_photos" v-if="currentShowPrograma==='photos'">
          <img src="http://img2.bitautoimg.com/autoalbum/files/20181014/748/20181014214230423019651_6306977_16.jpg">
          <img src="http://img2.bitautoimg.com/autoalbum/files/20181014/561/20181014214233423311049_6306973_16.jpg">
          <img src="http://img4.bitautoimg.com/autoalbum/files/20181014/217/20181014214236423615542_6306971_16.jpg">
        </div>
        <van-cell-group class="car-detail-info" v-if="currentShowPrograma==='used'">
          <van-cell title="使用时间:" value="2018-11-09" />
          <van-cell title="用车人:" value="陈威" />
          <van-cell title="用车原因:" value="外省办事" />
          <van-cell title="行驶里程:" value="2000KM" />
          <van-cell title="归还时间:" value="2018-11-13" />
          <van-field label="备注" v-model="remark" placeholder="请输入用户名" type="textarea" autosize readonly input-align="left"/>
        </van-cell-group>
        <van-cell-group class="car-detail-info" v-if="currentShowPrograma==='service'">
          <van-cell title="送修时间:" value="2018-11-09" />
          <van-cell title="地址:" value="浙江省义乌市江东中路456号中发汽修" />
          <van-cell title="送修人电话:" value="123" />
          <van-cell title="车款介绍:" value="奥迪Q3" />
          <van-cell title="报修内容:" value="左面刮擦,左面大灯损坏" />
          <van-cell title="维修说明:" value="补漆,更换原版左侧大灯" />
          <van-cell title="交车时间:" value="2018-11-11" />
          <van-field label="备注" v-model="remark" placeholder="请输入用户名" type="textarea" autosize readonly input-align="left"/>
        </van-cell-group>
        <van-cell-group class="car-detail-info" v-if="currentShowPrograma==='rule'">
          <van-cell title="时间:" value="2018-11-09" />
          <van-cell title="地址:" value="浙江省义乌市江东中路456号中发汽修" />
          <van-cell title="违规当事人电话:" value="123" />
          <van-cell title="驾驶证/工号:" value="212" />
          <van-cell title="违规种类:" value="超速" />
          <van-cell title="审查单位:" value="义乌稠州支部交警大队" />
          <van-cell title="违规情况/与概述:" value="2018-11-11" />
          <van-field label="处理情况" v-model="remark" placeholder="请输入用户名" type="textarea" autosize readonly input-align="left"/>
        </van-cell-group>
      </div>
    </h-scroll>
  </div>
</template>
<script>
import 'static/styles/car/car.scss';
import hScroll from '@/components/hScroll';
import { initScroll } from '@/utils/dom';

export default {
  name: 'carDetail',
  created() {
    console.log(this.$route.params);
    this.initPage();
  },
  mounted() {
    this.$nextTick(() => {
      const win = window.document.documentElement;
      const header = this.$refs.header;
      const scroll = this.$refs.scrollWrap;
      initScroll(win, scroll, header);
      this.$refs.scrollWrap.refresh();
    });
  },
  data() {
    return {
      title: '',
      currentShowPrograma: '',
      remark: '不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道不知道',
      titleMap: {
        photos: '车辆照片',
        info: '基本信息',
        used: '使用情况',
        service: '检测维修',
        rule: '事故违章',
      },
    };
  },
  methods: {
    back() {
      const id = this.$route.params.id;
      this.$router.push({
        name: 'carDetail',
        params: {
          id,
        },
      });
    },
    initPage() {
      this.currentShowPrograma = this.$route.params.program;
      this.title = this.titleMap[this.currentShowPrograma];
    },
  },
  components: {
    hScroll,
  },
};

</script>
<style lang="scss" scoped>
  .car-desc {
    width: auto;
    height: 115px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: rem(10) rem(15);
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

  .car-link_box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;

    a {
      color: #333;
      text-align: center;
      display: block;
      width: 50%;
      height: 117px;
      background: #FFf;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      box-sizing: border-box;
      border: 1px solid #f5f4f7;

      img {
        width: rem(20);
        height: rem(20);
      }

      p {
        font-size: rem(15);
      }
    }
  }

  .car-detail-info {
    margin-top: 10px;
  }

  .car-detail_photos {
    margin-top: 10px;
    padding: 0 rem(15) 15px;
    font-size: 0;
    img{
      margin-top: rem(10);
      width: 100%;
      height: auto;
      border-radius: rem(5);
    }
  }

</style>
