<template>
    <div>
      <v-header></v-header>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{orderId}}</span>
              <span>Order total：{{orderTotal | currency('$')}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link class="btn btn--m" to="/cart">Cart List</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link class="btn btn--m" to="/">Goods List</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-footer></v-footer>
    </div>
</template>
<script>
   import Header from '@/components/Header'
   import Footer from '@/components/Footer'
   import {currency} from '@/util/currency'
   import axios from 'axios'
    export default{
      data(){
          return{
            orderTotal: 0,
            orderId: ''
          }
      },
      components: {
        'v-header': Header,
        'v-footer': Footer
      },
      filters: {
        currency: currency
      },
      mounted() {
        this.init();
      },
      methods: {
        init () {
          this.orderId = this.$route.query.orderId;
          axios.get('/users/orderDetail', {
            params: {
              orderId: this.orderId
            }
          }).then(response => {
            let res = response.data;
            if(res.status == '0') {
              this.orderTotal = res.result.orderTotal
            }
          })
        }
      }
    }
</script>
