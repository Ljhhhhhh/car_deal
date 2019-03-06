<template>
  <div class='container'>
    <mt-header title="安全设置" ref="header" class="header">
      <a @click.stop="$router.back" slot="left">
        <mt-button icon="back"></mt-button>
      </a>
    </mt-header>
    <van-cell-group class="cell_box">
      <van-cell title="手机号" is-link :value="userinfo.mobile" @click="setMobile"/>
      <van-cell title="密码" value="修改密码" is-link  @click="setPwd"/>
    </van-cell-group>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: '',
  data() {
    return {
    };
  },
  methods: {
    setMobile() {
      this.$router.push({
        name: 'usercenterPhone',
      });
    },
    setPwd() {
      this.$router.push({
        name: 'usercenterPassword',
      });
    },
  },
  computed: {
    ...mapGetters([
      'userinfo',
    ]),
  },
};

</script>
<style lang="scss" scoped>
</style>
