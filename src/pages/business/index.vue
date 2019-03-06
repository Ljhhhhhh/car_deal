<template>
  <div class="container">
    <mt-header title="业务管理" ref="header" class="header fff">
      <a @click.stop="$router.back" slot="left">
        <mt-button icon="back"></mt-button>
      </a>
      <router-link to="/business/chat" slot="right">
        <icon name="message" scale="2"></icon>
      </router-link>
    </mt-header>
    <div class="all-info_box" ref="info">
      <div class="all-info_item">
        <p class="info_title">
          <icon class="info_icon" name="business_all" scale='1.8'></icon><span>总订单</span>
        </p>
        <p class="info_value">{{all}}</p>
      </div>
      <div class="all-info_item">
        <p class="info_title">
          <icon class="info_icon" name="business_pass" scale='1.8'></icon><span>已成交</span>
        </p>
        <p class="info_value">{{pass}}</p>
      </div>
      <div class="all-info_item">
        <p class="info_title">
          <icon class="info_icon" name="business_fail" scale='1.8'></icon><span>未通过</span>
        </p>
        <p class="info_value">{{cancels}}</p>
      </div>
    </div>
    <h-scrolls ref="scrollWrap">
    <div class="business-list">
      <div class="business-list_item" v-for="item in list" :key="item.id" @click="goInfo(item.id)">
        <div class="business-base_info van-hairline--bottom">
          <p><icon name='user' scale='2' class="icon"></icon><span class="name">{{item.name}}</span><span class="phone">{{item.phone}}</span></p>
          <p class="time">2018-10-17 10:42</p>
        </div>
        <div class="business-process_info">
          <p><icon name="tag" scale='2' class="icon"></icon><span>{{item.fname}}</span><span>{{item.num}}期</span></p> <!-- <span>云网蒸蒙</span> -->
          <a class="process-btn"><span>初审</span><icon name='arrow_right' scale='2' class="icon"></icon></a>
        </div>
      </div>
    </div>
    </h-scrolls>
    <!-- <van-tabbar v-model="tabbarActive" ref="tabbar">
      <van-tabbar-item to="/car" icon="wap-home"><span>业务管理</span></van-tabbar-item>
      <van-tabbar-item to="/typeinList" icon="chat">新建业务</van-tabbar-item>
      <van-tabbar-item to="/stockOutList" icon="records">消息</van-tabbar-item>
    </van-tabbar> -->
  </div>
</template>
<script>
import 'static/styles/business/index.scss';
import hScrolls from '@/components/hScrolls';
import { initScroll } from '@/utils/dom';
import { business } from '@/api/business';

export default {
  name: 'Business',
  data() {
    return {
      tabbarActive: 0,
      all: null,
      cancels: null,
      pass: null,
      list: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      const win = document.documentElement;
      const header = this.$refs.header;
      const info = this.$refs.info;
      const scroll = this.$refs.scrollWrap;
      initScroll(win, scroll, header, info);
    });
  },
  created() {
    this.getBusiness();
  },
  methods: {
    goInfo(id) {
      this.$router.push({
        name: 'BusinessInfo',
        query: {
          id,
        },
      });
    },
    getBusiness() {
      business().then((res) => {
        console.log(res);
        const data = res.data;
        this.all = data.all;
        this.cancels = data.canans;
        this.pass = data.over;
        this.list = data.rows;
      });
    },
  },
  components: {
    hScrolls,
  },
};
</script>
<style lang="scss" scoped>
  .container .header {
    background: #4294f9;
    .is-left a,{
      color: #FFF;
    }
  }
  .all-info_box {
    font-size: rem(14);
    height: 165px;
    width: auto;
    display: flex;
    justify-content: space-around;
    align-items:flex-end;
    padding-bottom: 30px;
    box-sizing: border-box;
    background: #4294f9 url('../../assets/images/business/head_bg.png') no-repeat;
    background-position: bottom;
    .all-info_item {
      color: #FFF;
      text-align: center;
      p {
        margin-block-start: 0;
        margin-block-end: 0;

        .info_icon,
        span {
          vertical-align: middle;
        }
        span{
          font-size: rem(12);
          display: inline-block;
          margin-left: rem(5);
        }
      }
      p.info_value{
        font-size: rem(20);
        margin-top: 11.5px;
        line-height: rem(20);
        @extend font_bold;
      }
    }
  }
  .business-list{
    font-size: rem(15);
    .business-list_item{
      padding: 0 rem(15);
      background: #FFF;
      margin: 10px 0;
      .business-base_info, .business-process_info{
        display: flex;
        justify-content: space-between;
        align-content: center;
        p{
          margin-block-start: 0;
          margin-block-end: 0;
        }
        .icon, span{
          vertical-align: middle;
        }
        .icon{
          color: #C4C7D0;
        }
        span{
          display: inline-block;
          margin-left: rem(5);
        }
      }
      .business-base_info{
        line-height: 65px;
        .phone{
          color: #999;
          font-size: rem(12);
        }
        .time{
          font-size: rem(14);
          color: #999;
        }
      }
      .business-process_info{
        line-height: 40px;
        a{
          color: $theme_color;
          .icon{
            color: $theme_color;
          }
        }
      }
    }
  }

</style>
