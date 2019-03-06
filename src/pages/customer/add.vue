<template>
  <div class="container">
    <div class="header">
      <mt-header title="新增客户" ref="header">
        <router-link to="/client" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
    </div>
    <div class="content">
      <h-scrolls id="scrollWrap" ref="scrollWrap">
        <div class="form">
          <van-cell-group>
            <van-cell required clearable title="类型：" placeholder="请选择" is-link input-align="right">
              <select name="" id="">
                <option value="0">个人</option>
                <option value="1">公司</option>
              </select>
            </van-cell>
            <van-field required clearable label="姓名：" placeholder="上传行驶证后点击识别" input-align="right" />
            <van-field required clearable label="身份证号：" placeholder="上传行驶证后点击识别" input-align="right" />
            <van-field required clearable label="家庭住址：" placeholder="上传行驶证后点击识别" input-align="right" />
            <van-field required clearable label="手机号：" placeholder="请输入手机号" input-align="right" />
          </van-cell-group>
          <van-cell-group style="margin-top:10px;">
            <van-cell required clearable title="性别：" placeholder="请选择" is-link input-align="right">
              <select name="" id="">
                <option value="0">男</option>
                <option value="1">女</option>
              </select>
            </van-cell>
            <van-field required clearable label="紧急联系人：" placeholder="请输入紧急联系人" input-align="right" />
            <van-field class="w105" clearable label="紧急联系号码：" placeholder="请输入紧急联系号码" input-align="right" />
            <van-field required clearable label="备注：" :autosize="{maxHeight:200,minHeight:100}" type="textarea" placeholder="请输入"/>
          </van-cell-group>
          <p class="submit_box">
            <van-button type="default" size="large" class="submit_btn">确认添加</van-button>
          </p>
        </div>
      </h-scrolls>
    </div>
  </div>
</template>
<script>
import hScrolls from '@/components/hScrolls';
import { initScroll } from '@/utils/dom';

export default {
  components: {
    hScrolls,
    formObj: [],
  },
  mounted() {
    const win = window.document.documentElement;
    const scrollWrap = this.$refs.scrollWrap;
    const header = this.$refs.header;
    this.$nextTick(() => {
      initScroll(win, scrollWrap, header);
    });
  },
  methods: {

  },
};
</script>
<style lang="scss" scoped>
  .van-cell {
    color: #999999;
    font-size: rem(15);
  }
  .w105 {
    .van-cell__title {
      max-width: 105px;
    }
  }
  .submit_box {
    font-size: 0;
    padding: 20px rem(15);
    margin-bottom: 20px;

    .submit_btn {
      font-size: rem(20);
    }
  }
</style>
