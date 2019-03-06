<template>
<div class="container">
  <mt-header title="客户管理" ref="header" class="header">
      <a @click.stop="$router.back" slot="left">
        <mt-button icon="back"></mt-button>
      </a>
    </mt-header>
  <div class="search" ref="search">
    <van-search placeholder="请输入搜索关键词" v-model="value" background="#f5f4f7" input-align="left" />
  </div>
  <h-scrolls ref="scrollWrap">
    <div class="staff_list">
      <template v-for="dept in staffList">
        <div :key="dept.id">
      <p class="staff_dept">{{dept.name}}</p>
      <!-- <div class="staff_item" v-for="staff in dept.staff" :key="staff.id">{{staff.name}}</div> -->
      <van-swipe-cell class="staff_item van-hairline--bottom" :right-width="90" v-for="staff in dept.staff" :key="staff.id">
        <div class="staff">
        <span class="avatar">
          <img :src="staff.headpho">
        </span>
        <span>{{staff.name}}</span>
        <span>{{staff.phone}}</span>
        </div>
        <span slot="right" class="staff_delete">删除</span>
      </van-swipe-cell>
        </div>
      </template>
    </div>
  </h-scrolls>
</div>
</template>
<script>
import hScrolls from '@/components/hScrolls';
import { initScroll } from '@/utils/dom';
import 'static/styles/staff/index.scss';

export default {
  data() {
    return {
      value: '',
      staffList: [
        {
          id: 1,
          name: '技术部',
          staff: [
            {
              id: 2,
              name: '员工姓名',
              position: 'Web前端',
              phone: '13216698987',
              headpho: 'https://img2.woyaogexing.com/2018/01/19/7e0f7018cc0843e8!200x200.jpg',
            },
            {
              id: 8,
              name: '员工姓2名',
              position: 'Web前端',
              phone: '13216698987',
              headpho: 'https://img2.woyaogexing.com/2018/01/19/7e0f7018cc0843e8!200x200.jpg',
            },
          ],
        },
        {
          id: 2,
          name: '技术2部',
          staff: [
            {
              id: 3,
              name: '员工姓名',
              position: 'Web前端',
              phone: '13216698987',
              headpho: 'https://img2.woyaogexing.com/2018/01/19/7e0f7018cc0843e8!200x200.jpg',
            },
          ],
        },
        {
          id: 3,
          name: '技术部3',
          staff: [
            {
              id: 4,
              name: '员工1姓名',
              position: 'Web前端',
              phone: '13216698987',
              headpho: 'https://img2.woyaogexing.com/2018/01/19/7e0f7018cc0843e8!200x200.jpg',
            },
            {
              id: 5,
              name: '员工姓2名',
              position: 'Web前端',
              phone: '13216698987',
              headpho: 'https://img2.woyaogexing.com/2018/01/19/7e0f7018cc0843e8!200x200.jpg',
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      const win = document.documentElement;
      const header = this.$refs.header;
      const search = this.$refs.search;
      const scrollWrap = this.$refs.scrollWrap;
      initScroll(win, scrollWrap, header, search);
    });
  },
  components: {
    hScrolls,
  },
};
</script>
<style lang="scss" scoped>
  p{
    margin-block-start: 0;
    margin-block-end: 0;
  }
  .staff_list {
    width: auto;
    height: auto;
    background: #FFF;
    .staff_dept{
      background: #f5f4f7;
      color: #C4C7D0;
      font-size: rem(15);
      padding-left: rem(15);
      padding-bottom: 10px;
    }
    .staff_item{
      height: 64px;
      .staff{
        font-size: rem(15);
        height: 64px;
      }
    }
  }

</style>
