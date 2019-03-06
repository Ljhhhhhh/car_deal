<template>
  <div class='container'>
    <mt-header title="密码修改" ref="header" class="header">
      <a @click.stop="$router.back" slot="left">
        <mt-button icon="back"></mt-button>
      </a>
    </mt-header>
    <div class="set-content">
      <template v-if="handle === 'fromOld'">
        <van-field v-model="oldPwd" placeholder="请输入旧密码" type="password" clearable input-align="left"/>
      </template>
      <template v-else>
        <van-field v-model="phone" placeholder="请输入手机号码" clearable input-align="left" :error-message="phoneError" />
        <van-field v-model="mycode" center clearable placeholder="请输入短信验证码">
          <van-button slot="button" size="small" :disabled="!codeAllow"  @click.native="getCode">{{codeMsg}}</van-button>
        </van-field>
      </template>
      <van-field v-model="newPwd" placeholder="请输入新密码" type="password" clearable input-align="left" :error-message="newPwdHint" />
      <van-field v-model="newPwdRepeat" placeholder="请确认新密码" type="password" clearable input-align="left" :error-message="newPwdRepeatHint" />
      <div class="submit">
      <van-button :disabled="submitAllow" type="default" size="large" @click.native="updatePwd">提交</van-button>
      <p class="forget" @click="changeFrom">{{handle === 'fromOld'? '忘记密码？' : '我知道原密码'}}</p>
      </div>
      <!-- <p class="no-code">收不到验证码？</p> -->
    </div>
  </div>
</template>
<script>
import { updatePassword, getCode, updatePasswordFromMobile } from '@/api/usercenter';
import cookie from 'js-cookie';
import {
  mapMutations,
} from 'vuex';
import 'static/styles/usercenter/index.scss';

export default {
  name: '',
  data() {
    return {
      oldPwd: '',
      newPwd: '',
      newPwdRepeat: '',
      phone: '',
      mycode: '',
      netResCode: '',
      codeMsg: '发送验证码',
      timer: null,
      handle: 'fromOld',
    };
  },
  computed: {
    phoneError() {
      const reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
      if (!reg.test(this.phone)) {
        return '请输入您的手机号码';
      }
      return '';
    },
    codeAllow() {
      return !this.phoneError && this.codeMsg === '发送验证码';
    },
    newPwdHint() {
      if ((`${this.newPwd}`).length < 6 || (`${this.newPwd}`).length > 8) {
        return '密码长度必须是6到8位';
      }
      return '';
    },
    newPwdRepeatHint() {
      if (this.newPwd !== this.newPwdRepeat) {
        return '两次密码输入不一致';
      }
      return '';
    },
    submitAllow() {
      if (this.handle === 'fromOld') {
        if (this.oldPwd && !this.newPwdHint && !this.newPwdRepeatHint) {
          return false;
        }
        return true;
      }
      if (this.handle === 'fromPhone') {
        if (this.mycode === this.netResCode && !this.newPwdHint && !this.newPwdRepeatHint) {
          return false;
        }
        return true;
      }
      return true;
    },
  },
  watch: {
    codeMsg(val) {
      if (val !== '发送验证码') {
        if (val === '1S') {
          this.timer = setTimeout(() => {
            this.codeMsg = '发送验证码';
          }, 1000);
        } else {
          const now = Number(val.substr(0, val.length - 1));
          this.timer = setTimeout(() => {
            this.codeMsg = `${now - 1}S`;
          }, 1000);
        }
      }
    },
  },
  methods: {
    getCode() {
      getCode(this.phone).then((res) => {
        console.log(res);
        if (res.errno === 0) {
          this.codeMsg = '60S';
          this.netResCode = res.data.code;
        } else {
          this.$toast.fail(res.errmsg);
        }
      });
    },
    changeFrom() {
      if (this.handle === 'fromOld') {
        this.handle = 'fromPhone';
      } else {
        this.handle = 'fromOld';
      }
    },
    updatePwd() {
      if (this.handle === 'fromOld') {
        updatePassword(this.oldPwd, this.newPwd).then((res) => {
          console.log(res);
          if (res.errno === 0) {
            this.logout();
          } else {
            this.$toast.fail(res.errmsg);
          }
        });
      }
      if (this.handle === 'fromPhone') {
        updatePasswordFromMobile(this.phone, this.mycode, this.newPwd).then((res) => {
          console.log(res);
          if (res.errno === 0) {
            this.logout();
          } else {
            this.$toast.fail(res.errmsg);
          }
        });
      }
    },
    logout() {
      this.$toast.success({
        message: '修改成功，请重新登录',
        duration: 1000,
      });
      setTimeout(() => {
        cookie.remove('token');
        cookie.remove('role');
        this.removeUserinfo(null);
        this.removeToken(null);
        this.removeRole(null);
        this.$router.push({
          name: 'Login',
        });
      }, 1000);
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
.set-content{
    margin-top: 10px;
    .submit{
      height: 44px;
      line-height: 44px;
      text-align: center;
      border-radius: rem(5);
      font-size: rem(20);
      margin: 100px auto 0;
      padding: 0 rem(15);
      width: 100%;
      box-sizing: border-box;
    }
    .forget{
      font-size: rem(12);
      margin-top: 10px;
      text-align: left;
      color: $theme_color;
      line-height: 20px;
    }

  }
</style>
