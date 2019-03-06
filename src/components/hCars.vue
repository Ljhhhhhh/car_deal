<template>
  <transition name="slide">
    <div class="sub container" ref="container">
      <mt-header title="所有车辆" ref="header" class="header">
    <a @click.stop="$router.back" slot="left">
      <mt-button icon="back"></mt-button>
    </a>
  </mt-header>
      <!-- <mt-header ref="header" :title="title">
      </mt-header> -->
      <div class="brand-content" ref="brandContent">
        <h-list-view :data="brandList" ref="list" @select="selectBrand"></h-list-view>
      </div>
      <transition name="slide">
        <div class="series-content" v-if="showStep>1" @click="changeStep(2)">
          <ul class="series-list">
            <li
              v-for="(item, index) in seriesList"
              :key="index"
              @click.stop="selectSeries(item)"
            >
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </transition>
      <transition name="slide">
        <div class="mode-content" v-if="showStep>2">
          <ul class="mode-list">
            <li
              v-for="(item, index) in modeList"
              :key="index"
              @click.stop="selectMode(item)"
            >
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
import hListView from '@/components/hListView';
import {
  fetchCarBrand,
  fetchCarSeries,
  fetchCarMode,
} from '@/api/car';
import { initScroll } from '@/utils/dom';
import BScroll from 'better-scroll';

export default {
  name: 'hCars',
  data() {
    return {
      showStep: 1,
      netBrandList: [],
      brandList: [],
      seriesList: [],
      modeList: [],
      title: '车辆选择',
      brand: {},
      series: {},
      from: '',
    };
  },
  beforeRouteEnter(to, from, next) {
    // console.log(from, 123456);
    // console.log(from.name);
    next((vm) => {
      vm.from = from.name;
    });
  },
  created() {
    this.getCarSeries();
  },
  methods: {
    changeStep() {
      this.showStep = 2;
    },
    selectMode(mode) {
      mode.brand = this.brand;
      mode.series = this.series;
      this.$emit('selectedMode', mode);
    },
    selectSeries(series) {
      this.showStep = this.showStep > 2 ? 2 : 3;
      fetchCarMode(series.id).then((res) => {
        this.series = {
          id: series.id,
          name: series.name,
        };
        this.modeList = res.data;
        const scroll = new BScroll('.mode-content', {
          probeType: 1,
          click: true,
        });
        console.log(scroll);
      });
    },
    selectBrand(brand) {
      this.showStep = this.showStep > 1 ? 1 : 2;
      fetchCarSeries(brand.id).then((res) => {
        this.brand = {
          id: brand.id,
          name: brand.name,
        };
        this.seriesList = res.data.rows;
        const scroll = new BScroll('.series-content', {
          probeType: 1,
          click: true,
        });
        console.log(scroll);
      });
    },
    getCarSeries() {
      fetchCarBrand().then((res) => {
        this.netBrandList = res.data.rows;
        initScroll(
          this.$refs.container,
          this.$refs.brandContent,
          this.$refs.header,
        );
        this._normalizeList(this.netBrandList);
      });
    },
    _normalizeList(list) {
      const map = {};
      list.forEach((item) => {
        const key = item.initial;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: [],
          };
        }
        map[key].items.push(item);
      });
      const ret = [];
      for (const key in map) {
        const val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        }
      }
      ret.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
      this.brandList = ret;
    },
  },
  components: {
    hListView,
  },
};
</script>
<style lang="scss" scoped>
.brand-content {
  overflow: hidden;
  position: relative;
}

.series-content,
.mode-content {
  position: absolute;
  top: 40px;
  right: 0;
  bottom: 0;
  overflow: hidden;
  box-shadow: rem(-3) 0px rem(4) #ccc;

  ul {
    li {
      line-height: 40px;
      padding: 0 rem(15);
      color: #111;
      font-size: rem(14);
      height: 40px;
      span {
        display: inline-block;
        width: 100%;
        line-height: 20px;
      }
    }
  }
}

.series-content {
  background: #fff;
  width: 80%;
  z-index: 3;
}

.mode-content {
  background: #fff;
  width: 60%;
  z-index: 4;
}
</style>
