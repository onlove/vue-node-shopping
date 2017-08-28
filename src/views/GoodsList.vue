<template>
  <div>
    <v-header></v-header>
    <v-bread>
      <span>Goods</span>
    </v-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd @click="setPriceFilter('all')"><a href="javascript:void(0)" :class="{'cur': priceChecked == 'all'}">All</a></dd>
              <dd v-for="(price, index) in pricesFilter"  @click="setPriceFilter(index)">
                <a href="javascript:void(0)" :class="{cur: priceChecked == index}">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/' + item.productImg" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.productPrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>

                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import Header from '@/components/Header'
  import Footer from '@/components/Footer'
  import Bread from '@/components/Bread'
  import axios from 'axios'
  export default {
    data () {
      return {
        priceChecked: 'all',
        goodsList: [],
        pricesFilter: [
          {
            startPrice: '0.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '2000.00'
          },
          {
            startPrice: '2000.00',
            endPrice: '3000.00'
          }
        ],
        filterBy: false,
        overLayFlag: false
      }
    },
    mounted () {
      this.getGoodsList()
    },
    methods: {
      getGoodsList () {
        axios.get('/api/goods').then(res => {
          this.goodsList = res.data.result;
          console.log(this.goodsList)
        })
      },
      showFilterPop () {
        this.filterBy = true;
        this.overLayFlag = true;
      },
      closePop () {
        this.filterBy = false;
        this.overLayFlag = false;
      },
      setPriceFilter (index) {
        this.priceChecked = index;
        this.closePop();
      }
    },
    components: {
      'v-header': Header,
      'v-footer': Footer,
      'v-bread': Bread
    }
  }
</script>

<style lang="css">
  @import "../assets/css/base.css";
  @import "../assets/css/login.css";
  @import "../assets/css/product.css";
</style>
