<template>
  <div class='container'>
    <mt-header title="个人资料" ref="header" class="header">
      <a @click.stop="$router.back" slot="left">
        <mt-button icon="back"></mt-button>
      </a>
    </mt-header>
    <div v-if="!cropperShow">
    <van-cell-group class="cell_box">
      <van-cell class="avatar_cell" title="头像" is-link>
      <van-uploader :after-read="onRead">
        <img :src="userinfo.headpho" class="avatar">
      </van-uploader>
      </van-cell>
      <van-cell title="真实姓名" is-link :value="userinfo.username" @click="showDialog"/>
      <van-cell title="账户名" :value="userinfo.account" />
      <van-cell title="公司名称" :value="userinfo.deptName" />
    </van-cell-group>
    </div>
    <div class="crop_wrap" v-else>
      <vue-cropper
        ref="cropper"
        :src="avatar"
        :guides="true"
        :view-mode="2"
        drag-mode="crop"
        :aspectRatio="1/1"
        :auto-crop-area="0.5"
        :min-container-width="50"
        :min-container-height="50"
        :rotatable="true"
        alt="Source Image"
      />
      <van-button @click="crop" size="large">确认</van-button>
      <img src="" alt="" width="100">
    </div>
    <img src="" width="100" alt="">
    <van-dialog
      v-model="dialogShow"
      show-cancel-button
      :before-close="beforeClose"
    >
      <van-field
        v-model="newName"
        label="真实姓名"
        placeholder="请输入真实姓名"
      />
    </van-dialog>
  </div>
</template>
<script>
import {
  mapGetters,
  mapMutations,
} from 'vuex';
import 'static/styles/usercenter/index.scss';
import { updateUsername, updateHeadpho } from '@/api/usercenter';
import { uploadHeadpho } from '@/api/common/uploadFile';
import VueCropper from 'vue-cropperjs';

export default {
  name: 'usercenterInfo',
  data() {
    return {
      dialogShow: false,
      newName: '',
      avatar: '',
      cropperShow: false,
      cropImage: '',
    };
  },
  computed: {
    ...mapGetters([
      'userinfo',
    ]),
  },
  methods: {
    crop() {
      this.avatar = this.$refs.cropper.getCroppedCanvas().toDataURL();
      uploadHeadpho(1, 'headpho', { file: this.avatar }).then((res) => {
        if (res.errno === 0) {
          updateHeadpho(res.data.rows.url).then((result) => {
            if (result.errno === 0) {
              const newInfo = Object.assign({}, this.userinfo, { headpho: res.data.rows.url });
              this.setUserinfo(newInfo);
              this.$toast.success('修改成功');
              this.cropperShow = false;
            } else {
              this.$toast.fail(result.errmsg);
            }
          });
        } else {
          this.$toast.fail(res.errmsg);
        }
      });
    },
    beforeClose(action, done) {
      if (action === 'confirm') {
        updateUsername(this.newName).then((res) => {
          console.log(res);
          if (res.errno === 0) {
            const newInfo = Object.assign({}, this.userinfo, { username: this.newName });
            this.setUserinfo(newInfo);
            this.$toast.success('修改成功');
          } else {
            this.$toast.fail(res.errmsg);
          }
          done();
        });
      } else {
        done();
      }
    },
    showDialog() {
      this.dialogShow = true;
    },
    ...mapMutations({
      setUserinfo: 'SET_USERINFO',
    }),
  },
  components: {
    VueCropper,
  },
};

</script>
<style lang="scss" scoped>
  .cell_box {
    margin: 10px 0;

    .van-cell {
      font-size: rem(15);
      padding-left: rem(15);
    }
  }

  /deep/ .avatar_cell {
    padding: 0 rem(15);

    .van-cell__title {
      line-height: 50px;
    }
    .van-cell__right-icon{
      line-height: 50px;
    }

    .avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      position: relative;
      top: 5px;
    }
  }
  .crop_btn{
    font-size: rem(24);
    text-align: center;
    color: $theme_color;
  }
</style>
