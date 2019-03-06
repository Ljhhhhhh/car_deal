<template>
<div class="container">
  <mt-header :title="title" ref="header" class="header">
    <a @click.stop="$router.back" slot="left">
      <mt-button icon="back"></mt-button>
    </a>
  </mt-header>
  <h-scrolls ref="scrollWrap" class="scroll-wrap">
    <div class="content">
    <van-cell-group>
      <template  v-for="item in columns">
        <van-field v-model="formData[item.tb_name]" @blur="verify(item)" :key="item.id" :error-message="item.logs" :label="item.tb_title" :placeholder="item.tips" input-align="right" v-if="item.type === 'mobile'">
          <van-icon name="fail" slot="icon" color="red" v-if="item.error" />
        </van-field>
        <van-field v-model="formData[item.tb_name]" @blur="verify(item)" :key="item.id" :error-message="item.logs" :label="item.tb_title" :placeholder="item.tips" input-align="right" v-if="item.type === 'text'" >
          <van-icon name="fail" slot="icon" color="red" v-if="item.error" />
        </van-field>
        <van-field v-model="formData[item.tb_name]" @blur="verify(item)" :key="item.id" :error-message="item.logs" :label="item.tb_title" :placeholder="item.tips" input-align="right" v-if="item.type === 'number'">
          <van-icon name="fail" slot="icon" color="red" v-if="item.error" />
        </van-field>
        <van-cell :title="item.tb_title" :key="item.id" v-if="(item.type==='radio' || item.type === 'select') && !!item.opt.length">
          <select v-model="formData[item.tb_name]">
            <option :value="undefined" selected disabled>请选择{{item.tb_title}}</option>
            <option v-for="option in item.opt" :key="option.value" :value="option.value">{{option.label}}</option>
          </select>
        </van-cell>
        <mt-field :label="item.tb_title" type="date" v-model="formData[item.tb_name]" :key="item.id" :error-message="item.logs" v-if="item.type === 'date'" disableClear class="van-hairline--bottom input"></mt-field>
        <div :key="item.id" v-if="item.type === 'document'" class="document van-hairline--bottom">
          <p class="title">{{item.tb_title}}</p>
          <ul class="list">
            <li v-for="(file, index) in formData[item.tb_name]" :key="index" @click="remove(item.tb_name, file)">
              <span>{{index + 1}}：</span>
              <icon name="file" scale="3" class="icon" />
              <span>{{file.name}}</span>
              <van-icon name="clear" class="icon" />
            </li>
          </ul>
          <van-uploader :after-read="onRead" accept="application/msword, application/vnd.ms-excel," @click.native="setOptions(item.tb_name)" multiple>
            <div class="btn">
              <van-icon name="photograph" size="2em" />
              <p>点击上传</p>
            </div>
          </van-uploader>
        </div>
        <div :key="item.id" v-if="item.type === 'audio'" class="document van-hairline--bottom">
          <p class="title">{{item.tb_title}}</p>
          <ul class="list">
            <li v-for="(file, index) in formData[item.tb_name]" :key="index" @click="remove(item.tb_name, file)">
              <span>{{index + 1}}：</span>
              <icon name="video" scale="3" class="icon" />
              <span>{{file.name}}</span>
              <van-icon name="clear" class="icon" />
            </li>
          </ul>
          <van-uploader :after-read="onRead" accept="audio/mpeg,audio/ogg,audio/mp3" @click.native="setOptions(item.tb_name)" multiple>
            <div class="btn">
              <van-icon name="photograph" size="2em" />
              <p>点击上传</p>
            </div>
          </van-uploader>
        </div>
        <div :key="item.id" v-if="item.type === 'image'" class="document van-hairline--bottom">
          <p class="title">{{item.tb_title}}</p>
          <div class="banner">
            <swiper :options="swiperConfig" ref="mySwiper">
              <swiper-slide v-for="(banner, index) in formData[item.tb_name]" :key="index" @click.native="remove(item.tb_name, banner)">
                <!-- <img :src="banner.url"> -->
                <img :src="banner">
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
          <van-uploader :after-read="onRead" @click.native="setOptions(item.tb_name)" multiple>
            <div class="btn">
              <van-icon name="photograph" size="2em" />
              <p>点击上传</p>
            </div>
          </van-uploader>
        </div>
        <!-- <div :key="item.id" v-if="item.type === 'cascader'"> -->
        <van-cell :title="item.tb_title" :key="item.id" v-if="item.type === 'cascader'">
          <div :id="item.tb_name" ref="picker">{{item.value || item.tb_title}}</div>
        </van-cell>
        <!-- </div> -->
      </template>
    </van-cell-group>
    <div class="btn">
      <van-button size="large" @click="submit" type="default">提交</van-button>
    </div>
    </div>
  </h-scrolls>
  <van-popup v-model="popup.show" position="top">
    <p class="popup">{{popup.msg}}</p>
  </van-popup>
</div>
</template>
<script>
import hScrolls from '@/components/hScrolls';
import { tablesDetail, handleBusiness } from '@/api/business';
import { initScroll } from '@/utils/dom';
import uploadFile from '@/api/common/uploadFile';
import { swiperConfig } from '@/pages/config';
import MobileSelect from 'mobile-select';
// eslint-disable-next-line
import 'swiper/dist/css/swiper.css';
import {
  swiper,
  swiperSlide,
} from 'vue-awesome-swiper';
import { getOptions } from '@/api/business/cascader';

export default {
  name: 'BusinessDetail',
  data() {
    return {
      swiperConfig,
      parentId: '',
      tradeId: '',
      table: '',
      formData: {},
      columns: [],
      currentName: '', // 当前提交文件的name
      picker: {},
      popup: {
        show: false,
        msg: '',
      },
    };
  },
  created() {
    const params = this.$route.params;
    this.parentId = params.parentId;
    this.tradeId = params.tradeId;
    this.title = params.title;
    this.table = params.table;
    window.document.title = this.title;
    if (!this.parentId || !this.tradeId) {
      this.$router.back();
      return;
    }
    this.getDetail();
  },
  mounted() {
    const win = document.documentElement;
    const header = this.$refs.header;
    const scroll = this.$refs.scrollWrap;
    initScroll(win, scroll, header);
  },
  methods: {
    verify(item) {
      // console.log(this.$refs.hello)
      // formData[item.tb_name], item.rule
      const value = this.formData[item.tb_name];
      const regStr = item.rule;
      const reg = new RegExp(regStr);
      // this.$refs.hello[0].error = true;
      // this.columns[0].error = true;
      let flag = false;
      if (!reg.test(value)) {
        flag = true;
      }
      this.columns.forEach((v) => {
        if (v.tb_name === item.tb_name) {
          v.error = flag;
        }
      });
    },
    getOptions(els) {
      const items = Array.from(els);
      const me = this;
      items.forEach((el) => {
        const id = el.id;
        let item;
        this.columns.forEach((d) => {
          if (d.tb_name === id) {
            item = d;
          }
        });
        let url;
        let apiLen = 0;
        let wheels;
        if (Array.isArray(item.opt)) {
          url = item.opt[0].api;
          apiLen = item.opt.length;
        } else {
          url = item.opt.api;
        }
        getOptions(url).then((res) => {
          const result = res.data.rows || res.data;
          result.unshift({
            id: null,
            name: '请选择',
          });
          if (!apiLen) {
            wheels = [
              { data: result },
            ];
          } else {
            const Arr = Array(apiLen);
            Arr.fill({ data: [] });
            Arr[0] = { data: result };
            wheels = Arr;
          }
          const picker = new MobileSelect({
            // https://github.com/onlyhom/mobileSelect.js/blob/master/docs/README-CN.md 参考文档
            trigger: `#${id}`,
            title: item.tb_title,
            wheels,
            keyMap: {
              id: 'id',
              value: 'name',
            },
            ensureBtnText: '确认', // 确认按钮文字
            cancelBtnText: ' ', // 取消按钮文字
            callback(indexArr, data) {
              console.log(indexArr);
              console.log(data);
              // this.formData[item.tb_title]
              const value = data[data.length - 1].name;
              console.log(item.tb_name);
              this.formData[item.tb_name] = value;
            },
            transitionEnd(indexArr, data) {
              let i;
              let position;
              if (Array.isArray(item.opt)) {
                if (!me.picker[item.tb_name]) {
                  position = 1;
                  i = data[0].id;
                  url = item.opt[1].api;
                } else {
                  for (let k = 0; k < me.picker[item.tb_name].length; k++) {
                    if (me.picker[item.tb_name][k] !== indexArr[k]) {
                      if (k < indexArr.length) {
                        position = k + 1; // 需要更新的轮子位置
                        i = data[k].id; // id
                        url = item.opt[position] ? item.opt[position].api : null;
                        break;
                      }
                    }
                  }
                }
              }
              me.$set(me.picker, item.tb_name, indexArr);
              // +++++++++++++++++
              position && url && i && getOptions(url, i).then((obj) => {
                const list = obj.data.rows || obj.data;
                list.unshift({
                  id: null,
                  name: '请选择',
                });
                for (let p = position; p < apiLen; p++) {
                  if (p === position) {
                    picker.updateWheel(position, list);
                    picker.locatePosition(position, 0);
                  } else {
                    picker.updateWheel(p, [{
                      id: null,
                      name: '请选择',
                    }]);
                    picker.locatePosition(p, 0);
                  }
                }
              });
              let value;
              if (!apiLen) {
                value = data[0].id;
              } else {
                const tempArr = [];
                data.forEach((a) => {
                  if (a) {
                    tempArr.push(a.id);
                  } else {
                    tempArr.push(null);
                  }
                });
                value = tempArr;
              }
              // const mode = data[data.length - 1].name;
              me.$set(me.formData, id, value);
              if (item.tb_name === 'car_mode') {
                me.$set(me.formData, id, data[data.length - 1].name);
              }
              if (item.tb_name === 'car_brand') {
                me.$set(me.formData, id, data[data.length - 1].name);
              }
            },
          });
        });
      });
    },
    remove(type, file) {
      console.log(type, file);
      console.log(this.formData[type]);
      this.formData[type].forEach((f, i) => {
        // if (file.id === f.id) {
        //   this.formData[type].splice(i, 1);
        // }
        if (file === f) {
          this.formData[type].splice(i, 1);
        }
      });
    },
    setOptions(name) {
      this.currentName = name;
    },
    onRead(r) {
      console.log(r, '11');
      const fileData = new FormData();
      if (Array.isArray(r) && r.length) {
        r.forEach((f, i) => {
          fileData.append(`${this.currentName}&${i}`, f.file);
        });
      } else {
        fileData.append(this.currentName, r.file);
      }
      uploadFile(this.currentName, fileData).then((res) => {
        const rows = res.data.rows;
        if (!this.formData[this.currentName]) {
          this.$set(this.formData, this.currentName, []);
        }
        const fileArr = this.formData[this.currentName];
        rows.forEach((f) => {
          // fileArr.push({
          //   id: f.id,
          //   url: f.url,
          //   del: 0,
          //   name: f.name,
          // });
          fileArr.push(f.url);
        });
        this.$set(this.formData, this.currentName, fileArr);
      });
    },
    submit() {
      const list = this.columns.filter(r => r.rule);
      let flag = true;
      for (const d of list) {
        console.log(d);
        const value = this.formData[d.tb_name];
        const regStr = d.rule;
        const reg = new RegExp(regStr);
        if (!reg.test(value)) {
          this.popup.msg = `请检查${d.tb_title}`;
          this.popup.show = true;
          flag = false;
          break;
        }
      }
      flag && handleBusiness(this.table, this.tradeId, this.formData).then((res) => {
        console.log(res, 'submit over');
        this.$toast.success('保存成功,即将返回');
        setTimeout(() => {
          this.$router.back();
        }, 2000);
      });
      return '';
    },
    getDetail() {
      tablesDetail(
        this.parentId,
        this.tradeId,
      ).then((res) => {
        console.log(res.data.columns);
        const data = res.data;
        const columns = data.columns;
        columns.forEach((item) => {
          if (item.opt) {
            item.opt = JSON.parse(item.opt);
          }
          if (item.rule) {
            item.error = false;
          }
          if (item.value) {
            if (typeof item.value === 'string' && item.value.startsWith('[') && item.value.endsWith(']')) {
              this.formData[item.tb_name] = JSON.parse(item.value);
            } else {
              this.formData[item.tb_name] = item.value;
            }
          }
        });
        this.columns = columns;
        if (this.$refs.picker) {
          this.$nextTick(() => {
            this.getOptions(this.$refs.picker);
          });
        }
      });
    },
  },
  components: {
    hScrolls,
    swiper,
    swiperSlide,
  },
};
</script>
<style lang="scss" scoped>
  .add-photo{
    font-size: rem(14);
  }
  .scroll-wrap{
    margin-top: rem(10);
  }
  .btn{
    width: 100%;
    height: auto;
    text-align: center;
    box-sizing: border-box;
    padding: 20px rem(15);
    font-size: 0;
  }
  .document{
    padding: 0 rem(15);
    font-size: rem(14);
    color: #333;
    .van-uploader{
      display: block;
    }
    .title{
      line-height: 30px;
    }
    .list{
      width: auto;
      padding-left: rem(10);
      li{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .icon{
          margin: 0 rem(5);
        }
      }
    }
    .btn{
      font-size: rem(14);
      margin: 0 auto;
    }
  }
  p.popup{
    color: #FFF;
    background: #f13d3d;
    font-size: rem(18);
    text-align: center;
    line-height: 40px;
    box-shadow: 0 0 5px #f13d3d;
  }
</style>
