<template class="container">
<div>
  <p><router-link class="a" to="/car">车辆管理</router-link></p>
  <p><router-link class="a" to="/business">业务管理</router-link></p>
  <p><router-link class="a" to="/product">商品管理</router-link></p>
</div>
</template>
<script>

export default {
  data() {
    return {
      form: {
        page: 1,
        size: 5,
      },
      list: [],
      total: 0,
      load: {
        noMore: false,
        state: 'loading',
      },
    };
  },
  created() {
  },
  mounted() {
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped>
  p{
    font-size: rem(16);
    .a{
      color: $theme_color;
      font-size: rem(16);
    }
  }
</style>
