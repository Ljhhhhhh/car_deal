<template>
<div class="container">
  <mt-header title="完善资料" ref="header" class="header">
    <a @click.stop="$router.back" slot="left">
      <mt-button icon="back"></mt-button>
    </a>
  </mt-header>
  <p class="group-title">订单详情</p>
  <van-cell-group class="group">
    <van-cell center>
      <icon name="user" scale="2" class="icon" slot="icon"></icon>
      <p slot="title">
        <span>{{info.name}}</span>
        <span class="vice">{{info.phone}}</span>
      </p>
      <!-- <span class="tag">云网真孟</span> -->
    </van-cell>
    <van-cell center>
      <icon name="business_type" scale="2" class="icon" slot="icon"></icon>
      <p slot="title">
        <span>{{info.financeName}}</span>
        <span class="vice">{{info.num}}期</span>
      </p>
    </van-cell>
  </van-cell-group>
  <p class="group-title">完善资料</p>
  <van-cell-group class="group">
    <van-cell center is-link @click.native="detail(item)" v-for="item in tables" :key="item.id">
      <!-- <icon name="business_origin" scale="2" class="icon" slot="icon"></icon> -->
      <p slot="title">
        <span>{{item.tb_title}}</span>
      </p>
    </van-cell>
  </van-cell-group>
</div>
</template>
<script>
import 'static/styles/business/index.scss';
import { tradeDetail } from '@/api/business';

export default {
  name: 'BusinessInfo',
  data() {
    return {
      id: null,
      info: {},
      tables: [],
    };
  },
  created() {
    this.id = this.$route.query.id || 48;
    this.getInfo();
  },
  methods: {
    detail(item) {
      this.$router.push({
        name: 'BusinessDetail',
        params: {
          parentId: item.id,
          tradeId: this.id,
          title: item.tb_title,
          table: item.tb_name,
        },
      });
    },
    getInfo() {
      const id = this.id;
      tradeDetail(id).then((res) => {
        this.info = res.data.trade;
        this.tables = res.data.tables;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
  p.group-title{
    font-size: rem(14);
    color: #999;
    line-height: 40px;
    padding: 0 rem(15);
  }
  .group{
    .icon{
      vertical-align: middle;
      line-height: 30px;
      color: #C4C7D0;
      margin-right: rem(5);
    }
    span{
      vertical-align: middle;
      line-height: 30px;
      &.vice{
        color: #999;
        margin-left: rem(10);
      }
    }
    .tag{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: $theme_color;
      font-size: rem(12);
      border: 1px solid currentColor;
      line-height: rem(12);
      padding: rem(2) rem(4);
      border-radius: rem(3);
    }
  }
</style>
