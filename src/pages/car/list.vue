<template>
  <div class="container">
    <mt-header :title="title" ref="header" class="header">
      <a @click.stop.prevent="$router.go(-1)" slot="left">
        <mt-button icon="back"></mt-button>
      </a>
    </mt-header>
    <div class="content" ref="content">
      <div class="controller">
        <div class="status_select" v-if="activatedStatus && activatedStatus.value">
          <p @click="statusOptionShow = !statusOptionShow"><span>{{activatedStatus.value}}</span><i class="arrow-down"
              :class="statusOptionShow?'turn-up': ''"></i></p>
          <div class="status_options" :class="statusOptionShow?'show':''">
            <div class="connent"></div>
            <span class="van-hairline--top" v-for="option in carStatusMap" :key="option.id" @click="changeStatus(option)">
              {{option.value}}
              <van-icon size="12px" name="success" :color="activatedStatus.id===option.id?'#41A0FE':'transparent'" />
            </span>
          </div>
        </div>
        <van-search @clear="resetSearch" background="#f5f4f7" placeholder="请输入搜索关键词" ref="search" v-model="search.text" show-action>
          <div slot="action" @click="onSearch" >搜索</div>
        </van-search>
      </div>
      <div class="scroll-wrap" v-show="currentCarList.length">
        <h-scroll
        class="scroll-box"
        ref="scrollWrap"
        :listenScroll="true"
        @scroll="loadMore"
        :pullup="true"
        @scrollToEnd="scrollToEnd"
        :scrollStart="true"
        @scrollStart="scrollStart"
        >
          <div class="car-list_box">
            <div class="car-list_item van-hairline--bottom" v-for="(car, index) in currentCarList" :key="index" @click="goDetail(car)">
              <div class="car-thumb">
                <img v-lazy="car.thumb || 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542888361079&di=d10e185c4c8e9eebd8875c872d3f6e40&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4034970a304e251ff00a96c5ac86c9177f3e5309.jpg'">
              </div>
              <div class="car-info">
                <p class="title">{{car.name}} </p>
                <p class="highlight">公里数{{car.mileage}}</p>
                <p class="addr">位置：<span>{{car.addr || '我™怎么知道位置'}}</span></p>
              </div>
              <!-- <div class="car-status_msg"><span>{{activatedStatus.value}}</span></div> -->
            </div>
          </div>
        </h-scroll>
      </div>
      <h-no-result :show="!currentCarList.length"></h-no-result>
    </div>
    <p class="scroll-msg" v-if="!loadFlag">
      <span>{{loading.msg}}</span>
      <!-- <icon class="icon" scale='1.5' name="up" v-if="!loadFlag"></icon> -->
      <icon class="icon rotate" scale='1.5' name="loading" v-if="loading.state==='loading'"></icon>
      <icon class="icon" scale='1.5' name="stop" v-if="loading.state==='stop'"></icon>
    </p>
    <p class="scroll-msg" v-if="loadFlag && currentCarList.length >= pagesize">
      <span>上拉加载更多</span>
      <icon class="icon" scale='1.5' name="up"></icon>
    </p>
    <!-- <van-tabbar v-model="tabbarActive" ref="tabbar">
      <van-tabbar-item to="/car" icon="wap-home"><span>首页</span></van-tabbar-item>
      <van-tabbar-item to="/typeinList" icon="chat">入库</van-tabbar-item>
      <van-tabbar-item to="/stockOutList" icon="records">出库</van-tabbar-item>
    </van-tabbar> -->
    <transition name="van-fade">
      <!-- <div class="modal" v-show="statusOptionShow"></div> -->
    </transition>
  </div>
</template>
<script>
import {
  fetchParam,
} from '@/api/common/types';
import {
  fetchCar,
} from '@/api/car';
import cookie from 'js-cookie';
import hScroll from '@/components/hScroll';
import hNoResult from '@/components/hNoResult';

export default {
  name: 'CarList',
  data() {
    return {
      carStatusMap: [], // 车辆状态可选列表
      activatedStatusName: '', // 当前选择状态
      statusOptionShow: false, // 是否展示当前车辆状态选项
      tabbarActive: 0, // tabbar当前激活项
      search: {
        text: '',
        page: 1,
        total: 100000000,
        list: [],
      },
      pagesize: 5,
      allCarList: {}, // 所有车辆存放对象
      loadFlag: 1, // 是否允许请求
      STATUSPREFIX: 'status', // 状态对象类的key前缀
      loading: {
        msg: '加载中',
        state: 'loading',
      },
      stateId: null,
      title: '',
    };
  },
  created() {
    console.log(this.$route.params, 'params');
    this.stateId = typeof this.$route.params.id === 'number' ? this.$route.params.id : null;
    this.getCarParams();
  },
  mounted() {
    setTimeout(() => {
      this.calcContent();
    }, 500);
  },
  computed: {
    currentCarList() {
      const name = this.activatedStatusName;
      const allCarList = this.allCarList;
      console.log(allCarList[name]);
      // if (this.search.list.length) {
      if (this.search.list.length || (this.search.text && this.search.total !== 100000000)) {
        return this.search.list;
      }
      if (allCarList[name]) {
        return allCarList[name].list || [];
      }
      return [];
    },
    activatedStatus() {
      let state;
      this.carStatusMap.forEach((status) => {
        const n = this.STATUSPREFIX + status.name;
        if (n === this.activatedStatusName) {
          state = status;
        }
      });
      return state;
    },
  },
  methods: {
    goDetail(car) {
      this.$router.push({
        name: 'carDetail',
        params: {
          id: car.id,
        },
      });
    },
    resetSearch() {
      this.search = {
        text: '',
        page: 1,
        total: 100000000,
        list: [],
      };
    },
    onSearch() {
      this.getCarList();
    },
    setCurrentCarList(currentStatus) {
      this.currentCarList = this.allCarList[currentStatus].list;
    },
    async getCarList(loadmore = false) {
      const currentStatus = this.activatedStatusName;
      let queryObj;
      // const state = this.carStatusMap.filter(s => (this.STATUSPREFIX + s.name) === this.activatedStatusName)[0];
      let state = this.carStatusMap.filter(s => (s.id) === this.stateId)[0];
      if (!state) {
        state = this.carStatusMap[0];
      }
      console.log(this.carStatusMap, state, 123456789);
      console.log(state, 'state');
      this.title = state ? state.value : '车辆列表';
      const searchFlag = !!(this.search.text.length);
      // if (!this.search.text) {
      if (!loadmore) {
        queryObj = {
          page: state.page,
          lx: state.name,
        };
        if (searchFlag) {
          queryObj.page = 1;
          queryObj.key = this.search.text;
        }
        const res = await fetchCar(queryObj);
        if (searchFlag) {
          this.search.list = res.data.rows;
          this.search.total = res.data.total;
        } else {
          this.$set(this.allCarList, currentStatus, {
            list: res.data.rows,
            total: res.data.total,
          });
        }
      } else {
        this.carStatusMap.forEach((s) => {
          const n = this.STATUSPREFIX + s.name;
          if (n === this.activatedStatusName) {
            if (!searchFlag) s.page++;
            else this.search.page++;
            queryObj = {
              lx: s.name,
              page: s.page,
            };
            if (searchFlag) {
              queryObj.page = this.search.page;
              queryObj.key = this.search.text;
            }
          }
        });
        const res = await fetchCar(queryObj);
        if (!searchFlag) {
          this.allCarList[currentStatus].list = this.allCarList[currentStatus].list.concat(res.data.rows);
        } else {
          this.search.list = this.search.list.concat(res.data.rows);
        }
      }
      // } else {
      //   console.log('search');
      // }
      // this.setCurrentCarList(currentStatus);
    },
    loadMore(pos, y) {
      const searchFlag = !!(this.search.text.length);
      if (pos.y <= y - 50 && this.loadFlag) {
        this.loading = {
          msg: '加载中',
          state: 'loading',
        };
        this.loadFlag = 0;
        let total;
        if (!searchFlag) {
          this.carStatusMap.forEach((s) => {
            const n = this.STATUSPREFIX + s.name;
            if (n === this.activatedStatusName) {
              total = this.allCarList[n].total;
              if (total < s.page * this.pagesize) {
                this.loading = {
                  msg: '没有更多',
                  state: 'stop',
                };
              } else {
                this.getCarList(true);
              }
            }
          });
        } else {
          total = this.search.total;
          if (total < this.search.page * this.pagesize) {
            this.loading = {
              msg: '没有更多',
              state: 'stop',
            };
          } else {
            this.getCarList(true);
          }
        }
      }
      return pos;
    },
    scrollToEnd() {
      // this.loadMoreHeight.loading = -1;
      this.loading = {
        msg: '上拉加载更多',
        state: 'up',
      };
      this.$refs.scrollWrap.refresh();
      this.loadFlag = 1;
    },
    scrollStart() {
      this.loading = {
        msg: '上拉加载更多',
        state: 'up',
      };
    },
    changeStatus(option) {
      console.log(option, 'adhf lshf ');
      this.resetSearch();
      this.activatedStatusName = this.STATUSPREFIX + option.name;
      this.stateId = option.id;
      this.statusOptionShow = false;
      console.log(this.allCarList[this.activatedStatusName], 'hello');
      if (!this.allCarList[this.activatedStatusName]) {
        this.getCarList();
      }
    },
    calcContent() {
      const win = window.document.documentElement.clientHeight;
      const header = this.$refs.header.$el.clientHeight;
      // const tabbar = this.$refs.tabbar.$el.clientHeight;
      const search = this.$refs.search.$el.clientHeight;
      this.$refs.scrollWrap.$el.style.height = `${win - header - search - 20}px`;
      this.$refs.scrollWrap.$el.style.maxHeight = `${win - header - search - 20}px`;
    },
    async getCarParams() {
      if (!cookie.getJSON('carStatusMap')) {
        const res = await fetchParam('car_zt');
        const data = res.data;
        data.unshift({
          gmtCreate: 1537459200000,
          gmtModified: 1537804800000,
          id: null,
          name: null,
          orderNum: null,
          parentId: 57,
          remark: null,
          status: 1,
          type: 1,
          value: '全部',
        });
        cookie.set('carStatusMap', data, {
          expires: 1,
        });
      }
      this.carStatusMap = cookie.getJSON('carStatusMap');
      this.carStatusMap.map((status) => {
        status.page = 1;
        return status;
      });
      this.activatedStatusName = this.STATUSPREFIX + this.carStatusMap[0].name;
      this.getCarList();
    },
  },
  components: {
    hScroll,
    hNoResult,
  },
};

</script>
<style lang="scss" scoped>

  .scroll-msg {
    margin-block-start: 0;
    margin-block-end: 0;
    position: fixed;
    bottom: 70px;
    left: 0;
    right: 0;
    line-height: 40px;
    text-align: center;
    z-index: 1;
    font-size: rem(14);
    span{
      vertical-align: middle;
    }
    .icon{
      vertical-align: middle;
      &.rotate{
        animation: rotate 1s linear infinite;
      }
    }
  }

  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99;
  }

  .header {
    z-index: 100;
  }
  .controller{
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .head-right {
    line-height: 35px;
  }

  .status_select {
    min-width: 100px;
    max-width: 100px;
    position: relative;
    height: 100%;
    transform: perspective(500px);
    transform-style: preserve-3d;
    z-index: 99;

    p {
      margin-block-start: 0;
      margin-block-end: 0;
      font-size: rem(16);

      span {
        display: inline-block;
        margin-right: rem(10);
      }
    }

    .status_options {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      height: auto;
      line-height: 35px;
      border-radius: rem(5);
      overflow: hidden;
      transition: all 0.3s;
      transform: scaleY(0);
      transform: rotateX(-89deg);
      transform-origin: top;
      color: #fff;

      &.show {
        transform: rotateX(0);
        color: #333;
      }

      .connent {
        width: 0;
        height: 0;
        border-right: 10px solid transparent;
        border-left: 10px solid transparent;
        border-bottom: 10px solid #FFF;
        border-top: 5px solid transparent;
        margin: 0 rem(15) 0 auto;
        position: relative;
      }

      span {
        display: block;
        width: 100%;
        text-align: center;
        background: #FFF;
        font-size: rem(14);
      }
    }
  }

  .content {
    overflow: hidden;
    width: auto;
    position: relative;
    z-index: 2;

    .van-search {
      padding: rem(10) rem(15);
      flex: 1;
    }

    p {
      font-size: rem(14);
      text-align: center;
    }

    .scroll-wrap {
      overflow: hidden;

      p {
        margin-block-start: 0;
        margin-block-end: 0;
      }
    }

    .car-list_box {
      width: 100%;
      height: auto;
      z-index: 2;
      background: #f5f4f7;

      .car-list_item {
        width: auto;
        height: 115px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 0 rem(15) rem(10);
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
    }
  }

</style>
