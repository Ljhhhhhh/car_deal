<template>
  <div class="container">
    <mt-header title="车辆详情" ref="header" class="header">
      <a @click.stop="$router.back" slot="left">
        <mt-button icon="back"></mt-button>
      </a>
    </mt-header>
    <h-scroll class="scroll-box" ref="scrollWrap">
      <div class="content">
        <div class="car-detail-desc">
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
            <router-link to='/car/info/1/info'>
              <img src="../../assets/images/1.jpg" alt="">
              <p>基本信息</p>
            </router-link>
            <router-link to='/car/info/1/photos'>
              <img src="../../assets/images/1.jpg" alt="">
              <p>车辆照片</p>
            </router-link>
            <router-link to='/car/info/1/used'>
              <img src="../../assets/images/1.jpg" alt="">
              <p>使用情况</p>
            </router-link>
            <router-link to='/car/info/1/service'>
              <img src="../../assets/images/1.jpg" alt="">
              <p>监测维修</p>
            </router-link>
            <router-link to='/car/info/1/rule'>
              <img src="../../assets/images/1.jpg" alt="">
              <p>事故违章</p>
            </router-link>
          </div>
        </div>
      </div>
    </h-scroll>
  </div>
</template>
<script>
import 'static/styles/car/car.scss';
import hScroll from '@/components/hScroll';
import { initScroll } from '@/utils/dom';
import { carDetail } from '@/api/car';

export default {
  name: 'carDetail',
  created() {
    this.id = this.$route.params.id;
    if (!this.id) {
      this.$route.back();
    }
    this.getDetail();
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
      id: '',
      car: {
        thumb: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542888361079&di=d10e185c4c8e9eebd8875c872d3f6e40&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4034970a304e251ff00a96c5ac86c9177f3e5309.jpg',
        name: 'hello world',
        mileage: '186541',
        addr: '位置啊位置',
        state: '在售',
      },
    };
  },
  methods: {
    getDetail() {
      carDetail(this.id).then((res) => {
        console.log(res);
      });
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

</style>
