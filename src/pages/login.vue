<template>
  <div class="container bg_white">
    <!-- <mt-header title="登录" class="header fff">
      <router-link to="/" @click.native="$router.go(-1)" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <span slot="right"><router-link to="/register">注册</router-link></span>
    </mt-header> -->
    <canvas class="login-bg" id="loginBg"></canvas>
    <div class="form-box">
      <p class="input">
        <icon class="icon" name="success" scale='2.5' /><input type="text" v-model="username" placeholder="账号">
      </p>
      <p class="input">
        <icon class="icon" name="success" scale='2.5' /><input type="password" v-model="password" placeholder="密码">
      </p>
      <div class="login_btn" @click="login">登录</div>
      <!-- <p class="forget">忘记密码？</p> -->
    </div>
    <!-- <div class="loginby-social">
      <p class="title">第三方登录</p>
      <div class="social-icon">
        <span><img src="../assets/images/1.jpg"></span>
        <span><img src="../assets/images/1.jpg"></span>
      </div>
    </div> -->
    <van-popup v-model="popup.show" position="top">
      <p class="popup">{{popup.msg}}</p>
    </van-popup>
  </div>
</template>
<script>
import {
  login,
} from '@/api/common/users';
import md5 from 'crypto-js/md5';
import cookie from 'js-cookie';
import {
  mapMutations,
} from 'vuex';
import canvasAnimate from '@/utils/canvas';
import 'static/styles/business/index.scss';

export default {
  data() {
    return {
      username: 'xs',
      password: '888888',
      popup: {
        show: false,
        msg: '',
      },
    };
  },
  watch: {
    popup(val) {
      if (val.show) {
        setTimeout(() => {
          this.popup.show = false;
        }, 1000);
      }
    },
    deep: true,
  },
  mounted() {
    this.$nextTick(() => {
      canvasAnimate();
    });
  },
  methods: {
    login() {
      const data = {
        account: this.username,
        password: md5(this.password).toString().toUpperCase(),
      };
      login(data).then((res) => {
        if (res.errno === 0) {
          cookie.set('token', res.data.token, {
            expiress: res.data.expire / 3600 / 24,
          });
          cookie.set('role', res.data.role, {
            expiress: res.data.expire / 3600 / 24,
          });
          // store.commit('SET_TOKEN', cookie.get('token'));
          this.setToken(res.data.token);
          this.setRole(res.data.role);
          // store.commit('SET_ROLE', cookie.get('role'));
          // this.setToken(res.data.token);
          this.$toast.success({
            message: '登录成功, 将为您转到首页',
            duration: 1000,
          });
          setTimeout(() => {
            this.$router.push({
              name: 'index',
            });
          }, 1000);
          // window.location.href = 'http://localhost:8080/#/business/chat';
        } else {
          this.password = '';
          this.popup = {
            show: true,
            msg: res.errmsg,
          };
        }
      });
    },
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setRole: 'SET_ROLE',
    }),
  },
};

</script>
<style lang="scss" scoped>
  .container .header {
    background: #4294f9;
    color: #FFF;

    .is-left a,
      {
      color: #FFF;
    }
  }

  .login-bg {
    background: url('~static/images/common/banner.png'), linear-gradient(to bottom, #4294f9, #3d85b5);
    background-repeat: no-repeat, repeat;
    background-position: center;
    background-size: 60%, 100%;
    margin-top: -1px;
    width: 100%;
    height: 260px;
  }

  [class*=van-hairline]::after {
    display: none;
    content: ' ';
    position: absolute;
    pointer-events: none;
    box-sizing: border-box;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    -webkit-transform: scale(.5);
    transform: scale(.5);
    border: 0 solid #eee;
  }

  .van-cell {
    padding: 10px 0;
    line-height: 24px;
  }

  p.title {
    color: #333;
    font-size: rem(24);
    @extend font_bold;
    text-align: center;
    margin: 24px auto 120px;
  }

  .form-box {
    padding: 0 40px;
    margin-top: 30px;

    .input {
      font-size: rem(14);
      height: 44px;
      line-height: 44px;
      border-radius: 22px/50%;
      border: 1px solid #E0E0E0;
      padding: 0 rem(15);
      margin-bottom: 15px;

      input {
        text-align: left;
        margin-left: rem(10);
        font-size: rem(15);
        color: #666;
      }

      .icon {
        vertical-align: middle;
      }
    }

    .forget {
      color: $theme_color;
      font-size: rem(14);
    }

    .login_btn {
      height: 44px;
      line-height: 44px;
      margin: 15px auto;
      font-size: rem(15);
      background: linear-gradient(to right, #5BB1FE, #3688FC);
      color: #FFF;
      text-align: center;
      border-radius: 22px/50%;
    }
  }

  .loginby-social {
    text-align: center;

    p.title {
      font-size: rem(12);
      color: #c4c7d0;
      display: inline-block;
      margin: 0 auto 38px;
      position: relative;

      &::before,
      &::after {
        content: '';
        position: absolute;
        width: rem(90);
        height: 1px;
        transform: translateY(-50%) scaleY(0.5);
        background: #EEE;
        top: 50%;
      }

      &:before {
        right: rem(75);
      }

      &:after {
        left: rem(75);
      }
    }

    .social-icon {
      display: flex;
      align-items: center;
      justify-content: space-around;
      line-height: rem(50);

      span {
        width: rem(50);
        height: rem(50);
        overflow: hidden;

        img {
          width: rem(50);
          height: auto;
          border-radius: 50%;
        }
      }
    }
  }

  .popup {
    font-size: rem(18);
    line-height: 40px;
    background: $vice_color;
    color: #FFF;
    margin-block-start: 0;
    margin-block-end: 0;
    text-align: center;
  }

</style>
