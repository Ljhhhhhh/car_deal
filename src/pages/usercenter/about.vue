<template>
  <div class="container">
    <mt-header title="关于人车人" ref="header" class="header">
      <a @click.stop="$router.back" slot="left">
        <mt-button icon="back"></mt-button>
      </a>
    </mt-header>
    <div class="logo_box">
      <div class="logo">
        <img src="~@/assets/images/common/app_logo.png">
        <p>人车人0.0.1</p>
      </div>
    </div>
    <van-cell-group class="cell_box">
      <van-cell title="功能介绍" is-link></van-cell>
      <van-cell title="服务协议" is-link></van-cell>
      <van-cell title="版权信息" is-link value="版本号0.01" ></van-cell>
    </van-cell-group>
    <p class="copyright">人车人汽车销售服务有限公司 版权所有</p>

  </div>
</template>
<script>
export default {
  name: 'usercenterAbout',
};

</script>
<style lang="scss" scoped>
.logo_box{
  width: 100%;
  height: 200px;
  box-sizing: border-box;
  padding-top: 90px;
  .logo{
    font-size: rem(14);
    color: #C4C7D0;
    text-align: center;
    img{
      width: 63px;
      height: 63px;
    }
  }
}
.cell_box{
  margin-top: 10px;
}
.copyright{
  position: fixed;
  text-align: center;
  font-size: rem(10);
  color: #999;
  bottom: 15px;
  width: 100%;
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>
