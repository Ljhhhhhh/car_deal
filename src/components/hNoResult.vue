<template>
  <div class="no-result" v-if="show">
    <img src="~@/assets/images/car/no-result.png">
    <p>暂无相关车辆</p>
  </div>
</template>
<script>
export default {
  name: 'HNoResult',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};

</script>
<style lang="scss" scoped>
  .no-result {
    width: auto;
    height: auto;
    text-align: center;

    img {
      width: 150px;
      height: auto;
    }

    p {
      color: #666;
      font-size: rem(16);
    }
  }

</style>
