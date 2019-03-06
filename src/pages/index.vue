<template>
  <div class="container">
    <div id="header">
      <mt-header title="汽车销售管理台" ref="header" class="header">
        <!-- <router-link to="/" slot="left">
          <mt-button icon="back" style="color:black"></mt-button>
        </router-link>
        <span slot="right" class="head-right">
          <icon name="user" scale="2"></icon>
        </span> -->
      </mt-header>
    </div>
    <van-search @clear="resetSearch" background="#f5f4f7" placeholder="请输入搜索关键词" ref="search" v-model="search.text"
      show-action>
      <div slot="action">搜索</div>
    </van-search>
    <div class="content">
      <h-scrolls id="scrollWrap" ref="scrollWrap" :data="array">
        <div>
          <div class="tab-for_box">
            <div class="tab-for_content">
              <router-link v-for="router in routerList" :key="router.key" :to="router.path">
                <img :src="'static/images/router/'+ router.icon +'.png'">
                <p>{{router.name}}</p>
              </router-link>
            </div>
          </div>
        </div>
      </h-scrolls>
      <van-tabbar v-model="tabbarActive" ref="tabbar">
        <van-tabbar-item to="" icon="wap-home"><span>首页</span></van-tabbar-item>
        <van-tabbar-item to="" icon="chat">消息</van-tabbar-item>
        <van-tabbar-item to="/usercenter" icon="contact">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>
<script>
import hScrolls from '@/components/hScrolls';
import {
  initScroll,
} from '@/utils/dom';
import {
  fetchMenus,
} from '@/api/common/index';

import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      array: [],
      routerList: [],
      total: 2,
      search: {
        text: '',
      },
      tabbarActive: 0,
      iconBaseUrl: '',
    };
  },
  mounted() {
    const win = window.document.documentElement;
    const scrollWrap = this.$refs.scrollWrap;
    const header = this.$refs.header;
    const search = this.$refs.search;
    this.$nextTick(() => {
      initScroll(win, scrollWrap, header, search);
    });
  },
  created() {
    this.getTablist();
  },
  computed: {
    ...mapGetters([
      'role',
    ]),
  },
  methods: {
    getTablist() {
      const routerList = this.$router.options.routes;
      const showRouterList = routerList.filter(route => route.meta.parent === 0 && route.meta.role.includes(this.role));
      console.log(showRouterList);
      showRouterList.forEach((r, i) => {
        this.routerList.push({
          name: r.meta.title,
          path: r.path,
          key: i,
          icon: r.meta.icon,
        });
      });
      fetchMenus().then((res) => {
        if (res.errno === 0) {
          this.res = res.data.rows;
          console.log(res);
        }
      });
    },
    resetSearch() {
      this.search = {
        text: '',
      };
      this.searchList = [];
    },
    onSearch(loadmore = false) {
      if (!loadmore) {
        this.search.page = 1;
      }
      const conf = {
        searchText: this.search.text,
      };
      fetchMenus(conf).then((res) => {
        console.log(res);
      });
    },
  },
  components: {
    hScrolls,
  },
};

</script>
<style lang='scss' scoped>
  .container {
    background: rgba(255, 255, 255, 1);
  }

  .head-right {
    img {
      width: rem(20);
      height: rem(17);
    }
  }

  .content {
    position: relative;
    z-index: 2;
    overflow: hidden;
    width: auto;
  }

  .tab-list_box,
  .tab-for_box {
    width: 100%;
    height: auto;
    background: rgba(255, 255, 255, 1);

    p {
      width: auto;
      margin-block-start: 0;
      margin-block-end: 0;
      height: 12px;
      margin: 0;
      font-size: rem(12);
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }

    .tab-list_header {
      width: auto;
      display: flex;
      padding: 15px rem(15);
      position: relative;
      border-bottom: 1px solid #cccccc;

      p {
        margin: 0 0 0 rem(5);
      }

      img {
        width: rem(15);
        height: rem(15);
      }

      svg {
        height: rem(15);
        width: rem(15);
      }
    }

    .tab-list_content {
      // height: 152px;
      position: relative;
      overflow: hidden;
      display: flex;
      z-index: 2;

      .tab-list_item {
        display: block;
        width: 25%;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        box-sizing: border-box;
        border-right: 1px solid #cccccc;
        z-index: 2;
        margin-left: rem(-1);
        padding: 22px rem(22);

        p {
          color: rgba(102, 102, 102, 1);
        }

        .span {
          height: 14px;
          font-size: rem(18);
          margin-top: 7px;
          font-family: PingFang-SC-Medium;
          font-weight: 500;
          color: rgba(255, 0, 0, 1);
        }

        .p {
          width: rem(11);
        }
      }

      .last_one {
        border-right: none;
        margin-left: rem(-2);
      }

      p.mt7 {
        margin-top: 7px;
      }

      .border_bn {
        border-bottom: none;
      }
    }

    .tab-for_content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      z-index: 2;

      a {
        color: #333;
        text-align: center;
        width: 25%;
        height: 95px;
        background: rgba(255, 255, 255, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        box-sizing: border-box;

        img {
          width: rem(30);
          height: rem(30);
        }

        svg {
          height: rem(22);
          width: rem(22);
        }

        p {
          margin-top: 10px;
        }
      }
    }
  }

</style>
