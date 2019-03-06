<template>
  <div class="container">
    <mt-header title="我" ref="header" class="header" />
    <div class="head">
      <div class="avatar"><img src="http://thirdwx.qlogo.cn/mmopen/3jiaYjme3ZEjLwZoTq82FKZRkD2XjxEl2hBOPGDsSZt6RHoPic0U0y4DM3iaZmibMlPpMARheIYY9g1qibXkZuibxfjMrzicZ0nOjVn/132"></div>
      <div class="info" @click="goInfo">
        <p><strong>{{userinfo.deptName}}</strong><icon class="icon" name="qrcode" scale="2" color="#C4C7D0" /></p>
        <span>账户名：{{userinfo.username}}</span>
      </div>
      <!-- <div class="position">业务经理</div> -->
    </div>
    <van-cell-group class="cell_box">
      <van-cell title="安全设置" value="手机号、密码" to="/usercenter/safe" is-link><icon name="safe" slot="icon" color="#2BBC18" /></van-cell>
    </van-cell-group>
    <!-- <van-cell-group class="cell_box">
      <van-cell title="业绩" is-link><icon name="performance" slot="icon" color="#F2C334" /></van-cell>
    </van-cell-group> -->
    <van-cell-group class="cell_box">
      <van-cell title="状态" is-link :value="currentState || '请选择'" @click.native="shwoPopup"><icon name="state" slot="icon" color="#8090C7" /></van-cell>
      <!-- <van-cell title="求助反馈" is-link><icon name="help" slot="icon" color="#4CB56D" /></van-cell> -->
      <van-cell title="关于" is-link to="/usercenter/about" value="版本号0.01" ><icon name="about" slot="icon" color="#657BB0"/></van-cell>
    </van-cell-group>
    <div class="logout" @click="beforeLogout">退出登录</div>
    <van-tabbar v-model="tabbarActive" ref="tabbar">
      <van-tabbar-item to="/index" icon="wap-home"><span>首页</span></van-tabbar-item>
      <van-tabbar-item to="" icon="chat">消息</van-tabbar-item>
      <van-tabbar-item to="" icon="contact">我的</van-tabbar-item>
    </van-tabbar>
    <van-popup v-model="popupShow" position="bottom">
      <van-radio-group v-model="state" @change="changeState">
        <van-cell-group>
          <van-cell :title="state.title" clickable v-for="state in stateList" :key="state.id">
            <van-radio :name="state.id" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
  </div>
</template>
<script>
import 'static/styles/usercenter/index.scss';
import cookie from 'js-cookie';
import { mapGetters, mapMutations } from 'vuex';
import { setState } from '@/api/usercenter';
//  TODO:: 根据API进行状态的修改
export default {
  name: 'usercenter',
  data() {
    return {
      tabbarActive: 2,
      popupShow: false,
      stateList: [
        { id: 1, title: '上班中' },
        { id: 2, title: '休假' },
        { id: 3, title: '繁忙' },
      ],
      state: '', // 状态值
      currentState: '', // 状态提示文字
    };
  },
  computed: {
    ...mapGetters([
      'userinfo',
    ]),
  },
  methods: {
    goInfo() {
      this.$router.push({
        name: 'usercenterInfo',
      });
    },
    changeState(state) {
      console.log(state);
      setState(state).then(() => {
        this.currentState = this.stateList.filter(s => s.id === state)[0].title;
        this.popupShow = false;
      });
    },
    shwoPopup() {
      this.popupShow = true;
    },
    beforeLogout() {
      this.$dialog.confirm({
        title: '退出登录',
        message: '确认退出登录',
      }).then(() => {
        // on confirm
        this.logout();
      }).catch(() => {
        // on cancel
      });
    },
    logout() {
      cookie.remove('token');
      cookie.remove('role');
      this.removeUserinfo(null);
      this.removeToken(null);
      this.removeRole(null);
      this.$router.push({
        name: 'Login',
      });
    },
    ...mapMutations({
      removeUserinfo: 'SET_USERINFO',
      removeToken: 'SET_TOKEN',
      removeRole: 'SET_ROLE',
    }),
  },
};

</script>
<style lang="scss" scoped>
  .head{
    margin: 11px rem(15);
    border-radius: rem(3);
    width: auto;
    height: auto;
    box-shadow: 0 0 5px #0002;
    font-size: rem(14);
    background: #FFF;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 30px 20px;
    height: 120px;
    box-sizing: border-box;
    .avatar{
      width: 55px;
      height: 55px;
      border-radius: 50%;
      overflow: hidden;
      img{
        width: 100%;
      }
    }
    .info{
      height: 100%;
      margin-left: rem(20);
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      p{
        @extend font_bold;
        font-size: rem(16);
        strong{
          font-size: rem(16);
          vertical-align: middle;
        }
        .icon{
          vertical-align: middle;
          margin-left: rem(5);
        }

      }
      span{
        color: #999;
        font-style: rem(12);
      }
    }
  }
  .cell_box{
    margin: 10px 0;
    .van-cell{
      font-size: rem(15);
      padding-left: rem(15);
    }
  }
  .logout{
    height: 50px;
    width: 100%;
    line-height: 50px;
    font-size: rem(15);
    color: #FF0000;
    background: #FFF;
    margin-top: 10px;
    text-align: center;
  }
</style>
