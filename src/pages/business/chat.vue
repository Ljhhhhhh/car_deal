<template>
  <div class="container">
    <mt-header :title="title" ref="header" class="header fff">
      <a slot="left" @click.stop="$router.back">
        <mt-button icon="back"></mt-button>
      </a>
      <a href="" slot="right">
        <icon name="user" scale="2"></icon>
      </a>
    </mt-header>
    <div class="msg_box" ref="chat" id="msgBox">
      <p v-show="loadFlag" class="load-state">
        <icon name="loading" scale='2' color="#999" class="rotate" />
      </p>
      <div class="msg_wrap">
        <p class="no-more" v-show="loadOver">没有更多消息记录</p>
        <div class="msg_item" ref="msgItem" :class="msg.form_id === userinfo.id ? 'left' : 'right'" v-for="msg in msgList"
          :key="msg.id">
          <p class="msg_time">{{msg.date | formatTime}}</p>
          <div class="msg_info">
            <div class="avatar">
              <img :src="msg.fpho">
            </div>
            <p class="msg" v-if="msg.type === 'message'">{{msg.msg}}</p>
            <p class="msg" v-if="msg.type === 'photo'"><img @click="preview(msg.msg)" v-lazy="msg.msg"></p>
          </div>
        </div>
      </div>
    </div>
    <!-- </h-scroll-page> -->
    <!-- <van-uploader :after-read="onRead" ref="uploader" v-show="false"  multiple='mutiple' />  -->
    <input id="inputFile" name='inputFile' type='file' accept="image/*;capture=camera" style="display: none" @change="uploadImage">
    <div class="input_box" ref="input">
      <div class="photo_wrap">
        <icon name="photo" scale="3.5" @click.native="selectImage" />
      </div>
      <div class="emoji_wrap">
        <icon name="emoji" scale="3" @click.native="showEmoji" />
        <div class="emoji-content" v-show="getEmoji">
          <div class="emoji-tabs">
            <div class="emoji-container" ref="emoji">
              <div class="emoji-block" :style="{width: Math.ceil(emoji.people.length / 5) * 48 + 'px'}">
                <span v-for="(item, index) in emoji.people" :key="index">{{item}}</span>
              </div>
              <div class="emoji-block" :style="{width: Math.ceil(emoji.nature.length / 5) * 48 + 'px'}">
                <span v-for="(item, index) in emoji.nature" :key="index">{{item}}</span>
              </div>
              <div class="emoji-block" :style="{width: Math.ceil(emoji.items.length / 5) * 48 + 'px'}">
                <span v-for="(item, index) in emoji.items" :key="index">{{item}}</span>
              </div>
              <div class="emoji-block" :style="{width: Math.ceil(emoji.place.length / 5) * 48 + 'px'}">
                <span v-for="(item, index) in emoji.place" :key="index">{{item}}</span>
              </div>
              <div class="emoji-block" :style="{width: Math.ceil(emoji.single.length / 5) * 48 + 'px'}">
                <span v-for="(item, index) in emoji.single" :key="index">{{item}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <van-field v-model="msg" type="textarea" @keyup.enter="sendMsg()" autosize clearable placeholder="请输入……" />
      <div class="btn" @click="sendMsg()">发送</div>
    </div>
  </div>
</template>
<script>
import 'static/styles/business/index.scss';
import io from 'socket.io-client';
import emoji from '@/utils/emoji';
import {
  uploadMsgPhoto,
} from '@/api/common/uploadFile';
  // import { parseTime } from '@/utils/util';

import {
  initScroll,
} from '@/utils/dom';
import {
  messagesHistory,
} from '@/api/common';
import hScrollPage from '@/components/hScrollPage';
import {
  mapGetters,
} from 'vuex';
import {
  ImagePreview,
} from 'vant';

export default {

  name: 'BusinessChat',
  data() {
    return {
      getEmoji: false,
      emoji,
      toId: 3,
      msg: '',
      photoSrc: '',
      title: '卢洁辉',
      msgList: [],
      sendUserinfo: {},
      page: 1,
      msgBoxHeight: 0,
      loadFlag: false, // 是否加载中
      socket: null,
      loadOver: false, // 历史消息加载完成
    };
  },
  created() {
    const userId = this.userinfo.id;
    this.socket = io(`http://testerp.chetianyi.com:6789?userId=${userId}`);
    this.socket.on('connect', () => {
      console.log(this.socket.connected); // true
    });
    this.getHistory();
  },
  mounted() {
    this.socket.on('message_event', (data) => {
      if (Number(data.sourceClientId) !== this.userinfo.id) {
        this.msgList.push({
          date: Date.now(),
          del: 0,
          form_id: data.sourceClientId,
          id: Date.now(),
          msg: data.msg,
          to_id: data.targetClientId,
          zt: 0,
          type: data.type,
        });
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    });
    this.$nextTick(() => {
      const win = document.documentElement;
      const header = this.$refs.header;
      const input = this.$refs.input;
      const chat = this.$refs.chat;
      initScroll(win, chat, header, input);
      chat.style.overflow = 'auto';
      document.querySelector('.msg_box').addEventListener('scroll', (e) => {
        // console.log(e.target.scrollTop);
        if (e.target.scrollTop === 0) {
          this.getHistory(true);
        }
      });
      this.$refs.emoji.addEventListener('click', (e) => {
        const target = e.target || e.srcElement;
        if (!!target && target.tagName.toLowerCase() === 'span') {
          this.msg += target.innerHTML;
          this.getEmoji = false;
        }
        e.stopPropagation();
      });
    });
  },
  computed: {
    ...mapGetters([
      'userinfo',
    ]),
  },
  methods: {
    preview(src) {
      ImagePreview({
        images: [src],
        showIndex: false,
      });
    },
    uploadImage() {
      this.$toast.loading({
        message: '发送中……',
        duration: 0,
      });
      const file1 = document.getElementById('inputFile').files[0];
      if (file1) {
        const formdata = new window.FormData();
        formdata.append('file', file1);
        uploadMsgPhoto(formdata).then((res) => {
          console.log(res, 'this is uploader file');
          this.photoSrc = res.data.rows[0].url;
          this.sendMsg('photo');
          this.$toast.clear();
        });
      } else {
        console.log('必须有文件');
      }
    },
    selectImage() {
      // console.log(this.$refs.uploader);
      const uploader = document.getElementById('inputFile');
      uploader.click();
      // this.$refs.uploader.click();
      // uploadMsgPhoto().then((res) => {
      //   console.log(res);
      // });
    },
    showEmoji() {
      this.getEmoji = !this.getEmoji;
    },
    sendMsg(type = 'message') {
      console.log(type, 'type');
      let jsonObject = {};
      if (type === 'message') {
        if (!this.msg) {
          this.$toast.fail('内容不能为空');
          return;
        }
        jsonObject = {
          sourceClientId: this.userinfo.id,
          targetClientId: this.toId,
          msg: this.msg,
          type,
        };
      }

      if (type === 'photo') {
        jsonObject = {
          sourceClientId: this.userinfo.id,
          targetClientId: this.toId,
          msg: this.photoSrc,
          type,
        };
      }

      this.socket.emit('message_event', jsonObject);
      let msg;
      if (type === 'message') {
        msg = this.msg;
      } else if (type === 'photo') {
        msg = this.photoSrc;
      }
      this.msgList.push({
        type,
        date: Date.now(),
        del: 0,
        form_id: this.userinfo.id,
        id: Date.now(),
        msg,
        to_id: this.toId,
        zt: 0,
        fpho: this.userinfo.headpho,
      });
      setTimeout(() => {
        this.scrollToBottom();
      }, 200);
      this.msg = '';
    },
    getHistory(loadMore = false) {
      if (this.loadOver) {
        return;
      }
      if (loadMore) {
        this.page++;
        this.loadFlag = true;
      }
      messagesHistory({
        toId: this.toId,
        page: this.page,
      }).then((result) => {
        console.log(result, 'result');
        const list = result.data.rows;
        const msgTotal = result.data.total;
        const msgBox = document.getElementById('msgBox');
        const beforeHeight = document.querySelector('.msg_wrap').clientHeight;
        if (loadMore) {
          if (this.page * 20 >= msgTotal) {
            this.page--;
            this.loadOver = true;
            this.loadFlag = false;
            return;
          }
          this.msgList.unshift(...list.reverse());
          this.$nextTick(() => {
            const afterHeight = document.querySelector('.msg_wrap').clientHeight;
            msgBox.scrollTo(0, afterHeight - beforeHeight);
          });
        } else {
          this.msgList = list.reverse();
          setTimeout(() => {
            this.scrollToBottom();
          }, 50);
        }
        this.loadFlag = false;
      });
    },
    scrollToBottom() {
      const msgBox = document.getElementById('msgBox');
      const msgBoxHeight = msgBox.clientHeight;
      const beforeHeight = document.querySelector('.msg_wrap').clientHeight;
      console.log(beforeHeight - msgBoxHeight);
      msgBox.scrollTo(0, beforeHeight - msgBoxHeight);
    },
    loadMore() {
      this.getHistory(true);
    },
  },
  components: {
    hScrollPage,
  },
};

</script>
<style lang="scss">
  .input_box .van-field__control {
    flex: 1;
    height: 40px;
    line-height: 40px;
    text-align: left;
    font-size: 18px;
    text-indent: 0.5em;
    border-radius: rem(5);
    background: #f2f2f2;
    max-height: 40px;
  }

  .input_box .van-cell {
    padding: 0;
    padding-right: rem(15);
  }

  .input_box .van-cell:after {
    display: none;
  }

</style>
<style lang="scss" scoped>
  .container .header {
    background: #4294f9;
    color: #FFF;

    .is-left a,
      {
      color: #FFF;
    }
  }

  .no-more {
    text-align: center;
    margin: -10px auto 10px;
    color: #999;
  }

  .msg_box {
    font-size: rem(15);
    width: 100%;
    // display: flex;
    // flex-direction: column;
    position: relative;
    -webkit-overflow-scrolling: touch;
    -webkit-transform: translateZ(0px);

    .load-state {
      position: absolute;
      top: 5px;
      left: 0;
      text-align: center;
      width: 100%;
      line-height: 20px;

      .rotate {
        // position:a;
      }
    }

    .msg_wrap {
      padding: rem(15) rem(15);
      box-sizing: border-box;
    }

    .msg_item {
      // display: flex;
      max-width: 85%;
      margin-bottom: 40px;

      .msg_time {
        color: #999;
        margin-bottom: 5px;
      }

      &.left {
        // align-self: flex-end;
        // flex-direction: row-reverse;
        margin-left: 15%;

        .msg_info {
          display: flex;
          flex-direction: row-reverse;
        }

        .msg_time {
          text-align: right;
        }

        .avatar {
          margin-left: rem(20);
        }

        .msg {
          background: $theme_color;
          color: #FFF;

          &::after {
            background: $theme_color;
            right: -5px;
          }
        }
      }

      &.right {
        align-self: flex-start;

        .msg_info {
          display: flex;
          // flex-direction: row-reverse;
        }

        .avatar {
          margin-right: rem(20);
        }

        .msg:after {
          left: -5px;
        }
      }

      .avatar {
        min-width: 40px;
        min-height: 40px;
        max-width: 40px;
        max-height: 40px;
        vertical-align: top;

        img {
          width: 100%;
          min-width: 40px;
          min-height: 40px;
          max-width: 40px;
          max-height: 40px;
          border-radius: 50%;
          height: auto;
        }
      }

      p.msg {
        vertical-align: top;
        background: #FFF;
        border-radius: rem(5);
        padding: rem(10) rem(15);
        // transform: translateY(rem(15));
        min-height: 40px;
        box-sizing: border-box;
        position: relative;
        display: flex;
        align-items: center;

        &::after {
          position: absolute;
          content: '';
          width: 10px;
          height: 10px;
          top: 10px;
          background: #FFF;
          transform: rotate(45deg);
        }

        img {
          max-width: 200px;
          max-height: 200px;
        }
      }
    }
  }

  .input_box {
    font-size: 14px;
    height: 60px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 10px rem(15);
    padding-left: rem(10);
    background: #FFF;
    position: relative;

    .btn {
      height: 40px;
      min-width: 3em;
      font-size: rem(18);
      padding: 10px 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1em;
      color: #FFF;
      background: $theme_color;
      border-radius: rem(5);
    }
  }

  .rotate {
    animation: rotate 0.3s linear infinite;
  }

  .emoji_wrap {
    padding-right: rem(5);

    .emoji-content {
      position: absolute;
      bottom: 60px;
      left: 0;
      width: 100%;
      right: 0;
      height: 200px;
      border-top: 1px solid #f3f3f3;
      overflow: hidden;
      background-color: #fff;

      .emoji-container {
        width: 10000px;
      }

      .emoji-tabs {
        overflow: auto;

        .emoji-block {
          width: 1170px;
          height: 200px;
          float: left;

          span {
            display: inline-block;
            cursor: pointer;
            font-size: 26px;
            min-width: 48px;
            line-height: 39px;
            text-align: center;
            list-style: none;
          }
        }
      }
    }
  }

  .photo_wrap {
    padding-right: rem(5);
  }

</style>
