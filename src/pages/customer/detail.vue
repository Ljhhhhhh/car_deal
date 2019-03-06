<template>
  <div class="container">
    <div class="base-info">
      <mt-header :title="customer.name" ref="header" class="header fff">
        <a @click.stop="$router.back" slot="left">
          <mt-button icon="back"></mt-button>
        </a>
        <span @click="tel" slot="right">
          <icon name="tel" scale="2" color="#FFF"></icon>
        </span>
      </mt-header>
      <div class="center">
        <p class="phone">15805634739</p>
        <p class="no">360222199205064720</p>
      </div>
      <div class="more-info">
        <div class="wrap">
          <div>
            <p class="theme_color">租车中</p><span>租车状态</span>
          </div>
          <div>
            <p>2018-10-12</p><span>合同开始</span>
          </div>
          <div>
            <p>2018-10-25</p><span>合同结束</span>
          </div>
        </div>
      </div>
    </div>
    <h-scrolls class="scroll-wrap">
    <div class="menu">
      <div class="item van-hairline--surround">
        <span class="icon"></span>
        <p>租车记录</p>
      </div>
      <div class="item van-hairline--surround">
        <span class="icon"></span>
        <p>还款记录</p>
      </div>
      <div class="item van-hairline--surround">
        <span class="icon"></span>
        <p>延期记录</p>
      </div>
      <div class="item van-hairline--surround">
        <span class="icon"></span>
        <p>退押金记录</p>
      </div>
      <div class="item van-hairline--surround">
        <span class="icon"></span>
        <p>保养记录</p>
      </div>
      <div class="item van-hairline--surround">
        <span class="icon"></span>
        <p>违章记录</p>
      </div>
      <div class="item van-hairline--surround">
        <span class="icon"></span>
        <p>出险记录</p>
      </div>
      <div class="item van-hairline--surround">
        <span class="icon"></span>
        <p>维修记录</p>
      </div>
    </div>
    </h-scrolls>
  </div>
</template>
<script>
import 'static/styles/customer/index.scss';
import hScrolls from '@/components/hScrolls';

export default {
  name: 'Customer',
  data() {
    return {
      customer: {
        name: '卢洁辉',
        phone: 1,
      },
    };
  },
  methods: {
    tel() {
      window.location.href = `tel://${this.phone}`;
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

    .is-left a,
      {
      color: #FFF;
    }
  }

  .base-info {
    width: auto;
    height: 200px;
    text-align: center;
    font-size: rem(18);
    color: #FFF;
    background: $theme_color;
    position: relative;
    background: #4294f9 url('../../assets/images/business/head_bg.png') no-repeat;
    background-position: bottom;
    margin-bottom: 55px;
    .center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .phone {
        line-height: rem(18);
        font-size: rem(18);
        margin-bottom: 15px;
      }

      .no {
        font-size: rem(15);
        line-height: rem(15);
      }
    }

    .more-info {
      position: absolute;
      transform: translateY(50%);
      bottom: 0;
      width: 100%;
      .wrap{
        width: auto;
        margin: 0 rem(15);
        padding: 20px 0;
        background: #FFF;
        color: #C4C6D2;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-radius: rem(5);
        div{
          p{
            color: #999;
            font-size: rem(14);
            line-height: 25px;
            &.theme_color{
              color: $theme_color;
              @extend font_bold;
            }
          }
          span{
            color: #C3C8CE;
            font-size: rem(14);
            line-height: rem(14);
          }
        }
      }
    }
  }
  .scroll-wrap{
    height: calc(100vh - 255px);
    overflow: hidden;
  }
  .menu{
    font-size: rem(14);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .item{
      min-width: 50%;
      max-width: 50%;
      box-sizing: border-box;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 120px;
      background: #FFF;
      .icon {
        display: block;
        width: 20px;
        height: 20px;
        background: red;
        margin-bottom: 5px;
      }
      p{
        color: #333;
        line-height: 1;
      }
    }
    .item{
      &:first-child .icon{
        background: #4294f9;
        background: url('~@/assets/images/customer/css_sprites.png') no-repeat;
        background-size: 23px 184px;
        background-position: -2px -2px;
      }
      &:nth-child(2) .icon{
        background: #4294f9;
        background: url('~@/assets/images/customer/css_sprites.png') no-repeat;
        background-size: 23px 184px;
        background-position: -2px -25px;
      }
      &:nth-child(3) .icon{
        background: #4294f9;
        background: url('~@/assets/images/customer/css_sprites.png') no-repeat;
        background-size: 23px 184px;
        background-position: -2px -48px;
      }
      &:nth-child(4) .icon{
        background: #4294f9;
        background: url('~@/assets/images/customer/css_sprites.png') no-repeat;
        background-size: 23px 184px;
        background-position: -2px -71px;
      }
      &:nth-child(5) .icon{
        background: #4294f9;
        background: url('~@/assets/images/customer/css_sprites.png') no-repeat;
        background-size: 23px 184px;
        background-position: -2px -94px;
      }
      &:nth-child(6) .icon{
        background: #4294f9;
        background: url('~@/assets/images/customer/css_sprites.png') no-repeat;
        background-size: 23px 184px;
        background-position: -2px -117px;
      }
      &:nth-child(7) .icon{
        background: #4294f9;
        background: url('~@/assets/images/customer/css_sprites.png') no-repeat;
        background-size: 23px 184px;
        background-position: -2px -140px;
      }
      &:nth-child(8) .icon{
        background: #4294f9;
        background: url('~@/assets/images/customer/css_sprites.png') no-repeat;
        background-size: 23px 184px;
        background-position: -2px -163px;
      }
    }
  }
</style>
