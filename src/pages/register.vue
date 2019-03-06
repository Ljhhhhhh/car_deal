<template>
  <div class="container">
    <mt-header>
      <router-link to="/" @click.native="$router.go(-1)" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <span slot="right"><router-link to="/">登录</router-link></span>
    </mt-header>
    <p class="title">注册</p>
    <div class="form-box">
      <van-cell-group>
        <van-field
          v-model="registerData.phone"
          clearable label="手机号"
          placeholder="请输入手机号"
          input-align="right"
        />
        <van-field
          v-model="registerData.verify"
          label="验证码"
          placeholder="请输入验证码"
          input-align="right"
        >
          <van-button class="verify_btn" slot="button" size="small" type="default">
            发送验证码
          </van-button>
        </van-field>
        <van-field
          v-model="registerData.password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          input-align="right"
        />
        <van-field
          v-model="registerData.invitationCode"
          label="邀请码"
          placeholder="输入邀请码"
          input-align="right"
        />
      </van-cell-group>
      <van-button type="default" size="large" class="login_btn">注册/并立即登录</van-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Register',
  data() {
    return {
      registerData: {
        phone: 1324154,
        password: 1324154,
        verify: '',
        invitationCode: '',
      },
    };
  },
};

</script>
<style lang="scss" scoped>
  p.title{
    color: #333;
    font-size: rem(24);
    @extend font_bold;
    text-align: center;
    margin: 24px auto 120px;
  }
  .form-box{
    padding: 0 40px;
    .login_btn{
      height: 40px;
      line-height: 40px;
    }
  }
  .verify_btn{
    background: #C4C7D0;
    color: #F5F5F8;
    border-radius: rem(5);
  }
</style>
