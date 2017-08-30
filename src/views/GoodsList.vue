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
          <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
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
                    <a href="#"><img v-lazy="'/static/' + item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">￥ {{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>

                </li>
              </ul>
            </div>
            <div class="view-more-normal" v-infinite-scroll="loadMore" infinite-scroll-distance="20" infinite-scroll-disabled="busy">
              <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">
        请先登录,否则无法加入到购物车中!
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
      </div>
    </modal>
    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成!</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
        <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import Header from '@/components/Header'
  import Footer from '@/components/Footer'
  import Bread from '@/components/Bread'
  import Modal from '@/components/Modal'
  import axios from 'axios'
  export default {
    data () {
      return {
        priceChecked: 'all',
        goodsList: [],
        pricesFilter: [
          {
            startPrice: '0.00',
            endPrice: '100.00'
          },
          {
            startPrice: '100.00',
            endPrice: '200.00'
          },
          {
            startPrice: '300.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '5000.00'
          }
        ],
        filterBy: false,
        overLayFlag: false,
        sortFlag: true,
        page: 1,
        pageSize: 8,
        loading:false,
        busy:true,
        mdShow:false,
        mdShowCart:false
      }
    },
    mounted () {
      this.getGoodsList()
    },
    methods: {
      getGoodsList (flag) {
        let parmas = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
          priceLevel: this.priceChecked
        };

        this.loading = true;

        axios.get('/goods', {
          params: parmas
        }).then(response => {
          var res = response.data;
          this.loading = false;
          if(res.status=="0"){
            if(flag){
              this.goodsList = this.goodsList.concat(res.result.list);

              if(res.result.count==0){
                this.busy = true;
              }else{
                this.busy = false;
              }
            }else{
              this.goodsList = res.result.list;
              this.busy = false;
            }
          }else{
            this.goodsList = [];
          }
        })
      },
      sortGoods () {
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
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
        this.page = 1;
        this.closePop();
        this.getGoodsList();
      },
      loadMore(){
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 1000);
      },
      addCart (productId) {
        axios.post('/goods/addCart', {
          productId: productId
        }).then((res) => {
          var res = res.data;
          if(res.status==0){
            this.mdShowCart = true;
          }else{
            this.mdShow = true;
          }
        })
      },
      closeModal(){
        this.mdShow = false;
        this.mdShowCart = false;
      }
    },
    components: {
      'v-header': Header,
      'v-footer': Footer,
      'v-bread': Bread,
      Modal
    }
  }
</script>
