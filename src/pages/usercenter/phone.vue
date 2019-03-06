<template>
  <div class='container'>
    <mt-header title="修改手机号" ref="header" class="header">
      <a @click.stop="stepBack" slot="left">
        <mt-button icon="back"></mt-button>
      </a>
    </mt-header>
    <div class="content" v-if="step === 1">
      <img src="~@/assets/images/usercenter/phone.png" class="phone_img">
      <p class="phonenumber">您的手机号码:{{userinfo.mobile || '暂未绑定'}}</p>
      <p class="reminder">更新手机号码后,登录手机号和企业通讯录号码均改变</p>
      <div class="btn" @click="step = 2">更换手机号码 </div>
    </div>
    <div class="set-content" v-if="step === 2">
      <van-field v-model="phone" placeholder="请输入新号码" clearable input-align="left" :error-message="phoneError" />
      <van-field v-model="mycode" center clearable placeholder="请输入短信验证码">
        <van-button slot="button" size="small" :disabled="codeAllow"  @click.native="getCode">{{codeMsg}}</van-button>
      </van-field>
      <div class="submit">
      <van-button :disabled="!submitAllow" type="default" size="large" @click.native="updateMobile">提交</van-button>
      </div>
      <!-- <p class="no-code">收不到验证码？</p> -->
    </div>
    <div class="success-content" v-if="step === 3">
      <img src="~@/assets/images/usercenter/phone.png" class="phone_img">
      <p class="phonenumber">绑定成功</p>
      <p class="reminder">请使用新手机号码进行登录!</p>
      <div class="btn" @click="logout">重新登录</div>
    </div>
  </div>
</template>
<script>
import {
  mapGetters,
  mapMutations,
} from 'vuex';
import { getCode, updateMobile } from '@/api/usercenter';
import cookie from 'js-cookie';
import 'static/styles/usercenter/index.scss';

export default {
  name: 'usercenterPhone',
  data() {
    return {
      step: 2,
      phone: '',
      mycode: '',
      netResCode: '',
      codeMsg: '发送验证码',
      timer: null,
    };
  },
  created() {
    this.phone = this.userinfo.mobile;
  },
  computed: {
    phoneError() {
      const reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
      if (!reg.test(this.phone)) {
        return '请输入您的手机号码';
      }
      return '';
    },
    submitAllow() {
      return !this.phoneError && !!this.mycode;
    },
    codeAllow() {
      return !this.phoneError && this.codeMsg !== '发送验证码';
    },
    ...mapGetters([
      'userinfo',
    ]),
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
    updateMobile() {
      if (this.mycode !== this.netResCode) {
        this.$toast.fail('验证码错误');
        return;
      }
      updateMobile(this.phone, this.mycode).then((res) => {
        console.log(res);
        if (res.errno === 0) {
          this.step = 3;
        } else {
          this.$toast.fail(res.errmsg);
        }
      });
    },
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
    stepBack() {
      if (this.step === 3) {
        this.logout();
      }
      if (this.step === 2) {
        this.step--;
      }
      if (this.step === 1) {
        this.$router.back();
      }
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
  .content, .success-content {
    padding: 90px rem(15) 0;
    text-align: center;

    img.phone_img {
      width: rem(64);
      height: rem(64);
    }

    p.phonenumber {
      font-size: rem(15);
      margin-top: 20px;
    }

    p.reminder {
      color: #999;
      font-size: rem(12);
      margin-top: 10px;
    }

    .btn {
      font-size: rem(20);
      color: #FFF;
      background: $theme_color;
      border-radius: rem(5);
      line-height: 44px;
      height: 44px;
      margin-top: 40px;
    }
  }
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
    .no-code{
      font-size: rem(12);
      color: $theme_color;
      margin-top: 15px;
      text-align: center;
      width: 100%；
    }
  }
</style>
