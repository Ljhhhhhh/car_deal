<template>
<div class="container">
  <mt-header title="车辆管理" ref="header" class="header">
    <a @click.stop="$router.back" slot="left">
      <mt-button icon="back"></mt-button>
    </a>
  </mt-header>
  <h-scrolls ref="scrollWrap">
    <div>
      <div class="title van-hairline--bottom">
        <em class="icon cgzt"></em><span>车管状态</span>
      </div>
      <div class="menu-list">
        <div class="item" @click="goList(59)">
          <em class="icon xzz"></em>
          <span>闲置中</span>
          <!-- 59 -->
        </div>
        <div class="item" @click="goList(58)">
          <em class="icon dsz"></em>
          <span>待售中</span>
        </div>
        <div class="item" @click="goList(62)">
          <em class="icon zlz"></em>
          <span>租赁中</span>
        </div>
        <div class="item" @click="goList(60)">
          <em class="icon yck"></em>
          <span>已出库</span>
        </div>
      </div>
      <div class="title van-hairline--bottom">
        <em class="icon clgl"></em><span>车辆管理</span>
      </div>
      <div class="menu-list">
        <div class="item" @click="goList">
          <em class="icon ck"></em>
          <span>车辆列表</span>
        </div>
        <div class="item" @click="goPage('addCar')">
          <em class="icon xzcl"></em>
          <span>新增车辆</span>
        </div>
        <div class="item" @click="goPage('typeinList')">
          <em class="icon ck"></em>
          <span>入库列表</span>
        </div>
        <div class="item" @click="goPage('carTypein')">
          <em class="icon rk"></em>
          <span>新增入库</span>
        </div>
        <div class="item" @click="goPage('stockOutList')">
          <em class="icon ck"></em>
          <span>出库列表</span>
        </div>
        <div class="item" @click="goPage('carStockOut')">
          <em class="icon rk"></em>
          <span>新增出库</span>
        </div>
      </div>
      <!-- <div class="title van-hairline--bottom">
        <em class="icon cggzt"></em><span>车管工作台</span>
      </div>
      <div class="menu-list">
        <div class="item">
          <em class="icon xzkh"></em>
          <span>新增客户</span>
        </div>
        <div class="item">
          <em class="icon xzzc"></em>
          <span>新增租车</span>
        </div>
        <div class="item">
          <em class="icon xztc"></em>
          <span>新增退车</span>
        </div>
        <div class="item">
          <em class="icon xzyc"></em>
          <span>新增验车</span>
        </div>
        <div class="item">
          <em class="icon xzjc"></em>
          <span>新增借车</span>
        </div>
        <div class="item">
          <em class="icon xzhc"></em>
          <span>新增还车</span>
        </div>
        <div class="item">
          <em class="icon gps"></em>
          <span>车辆GPS</span>
        </div>
      </div> -->
    </div>
  </h-scrolls>
</div>
</template>
<script>
import hScrolls from '@/components/hScrolls';
import { initScroll } from '@/utils/dom';


export default {
  name: 'Car',
  data() {
    return {};
  },
  mounted() {
    const win = window.document.documentElement;
    const scrollWrap = this.$refs.scrollWrap;
    const header = this.$refs.header || null;
    this.$nextTick(() => {
      initScroll(win, scrollWrap, header);
    });
  },
  methods: {
    goPage(name) {
      this.$router.push({
        name,
      });
    },
    goList(id = null) {
      this.$router.push({
        name: 'carList',
        params: {
          id,
        },
      });
    },
  },
  components: {
    hScrolls,
  },
};
</script>
<style lang="scss" scoped>
  .title{
    font-size: rem(12);
    color: #333;
    line-height: 44px;
    padding: 0 rem(15);
    margin-top: 10px;
    background: #FFF;
    em.icon{
      display: inline-block;
      width: 15px;
      height: 18px;
      vertical-align: middle;
      background: $theme_color;
      margin-right: rem(5);
      background: url('~@/assets/images/car/css_sprites.png') no-repeat;
      background-size: 30px 484px;
      &.cgzt{
        background-position: -3px -23px;
      }
      &.clgl{
        background-position: -3px -45px;
      }
      &.cggzt{
        background-position: -3px -1px;
      }
    }
    span{
      vertical-align: middle;
    }
  }
  .menu-list{
    width: 100%;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    background: #FFF;
    .item{
      min-width: 25%;
      max-width: 25%;
      height: 100px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      font-size: rem(12);
      em.icon{
        width: 25px;
        height: 25px;
        background: url('~@/assets/images/car/css_sprites.png') no-repeat;
        background-size: 25px 403px;
        &.xzz{
          background-position: 0 -303px;
        }
        &.dsz{
          background-position: 0 -254px;
        }
        &.zlz{
          background-position: 0 -104px;
        }
        &.yck{
          background-position: 0 -78px;
        }
        &.ck{
          background-position: 0 -228px;
        }
        &.rk{
          background-position: 0 -277px;
        }
        &.xzcl{
          background-position: 0 -327px;
        }
        &.xzkh{
          background-position: 0 -128px;
        }
        &.xzzc{
          background-position: 0 -204px;
        }
        &.xztc{
          background-position: 0 -177px;
        }
        &.xzyc{
          background-position: 0 -155px;
        }
        &.xzjc{
          background-position: 0 -380px;
        }
        &.xzhc{
          background-position: 0 -355px;
        }
        &.gps{
          background-position: 0 -54px;
        }
      }
    }
  }
</style>
