
<template>

    <div class="search-wrapper">

        <div class="search-controls">
            <label class="control-label">From:</label>
            <!--<input class="route-input" v-model="from"/>-->
            <v-select class="route-input" v-model="from" :options="cities"></v-select>
            <label class="control-label">To:</label>
            <!--<input class="route-input" v-model="to"/>-->
            <v-select class="route-input" v-model="to" :options="cities"></v-select>
            <button @click="searchRun()" class="btn btn-primary search-btn"><i class="fa fa-search"
                                                                               style="margin-right: 5px;"
                                                                               aria-hidden="true"></i> Search
            </button>
        </div>

        <div class="files-container" v-if="!loading">

            <div class="files-table-container" v-if="options.length > 0">
                <h2>Results:</h2>
                <div class="table-wrapper">
                    <table class="table">
                        <thead>
                        <tr>
                            <th>Forwarder</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Cost</th>
                            <th>State</th>
                        </tr>
                        </thead>
                        <tbody class="table-body">
                        <tr @click="selectLine(index)"
                            v-bind:class="{ trow: true , activerow: index === selectedOption }"
                            v-for="option, index in options">
                            <td>{{option.forwarderName}}</td>
                            <td>{{option.from}}</td>
                            <td>{{option.to}}</td>
                            <td>{{option.details}}</td>
                            <td v-bind:class="{ pausedtds: option['offerState'] === '0x01', runningtds: option['offerState'] === '0x02',
                         closedtds: option['offerState'] === '0x04'  }">{{getHumanState(option['offerState'])}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="!loading && options.length === 0 && showEmpty" class="empty-message">
                There is no any offer for your request :(
            </div>

            <div class="option-description" v-if="options[selectedOption]">
                <h4 class="order-params-header">Place for details of an offer</h4>
                <div v-if="options[selectedOption].offerState === '0x02'" style="display: flex">
                    <button @click="createOrderBtn()" class="btn btn-success order-btn">Order!</button>
                    <div v-if="orderLoading" class="order-loader"><i class="fa fa-spinner fa-spin"
                                                                     style="font-size:36px"></i></div>
                </div>

            </div>

        </div>

        <div v-if="loading" class="loader">
            <i class="fa fa-spinner fa-spin" style="font-size: 36px"></i>
        </div>


    </div>

</template>

<script type="text/babel">
  import {mapState, mapActions, mapGetters} from 'vuex';
  import cities from './cities';
  import axios from 'axios';
  export default {
    data () {
      return {
        options: [],
        forwarders: [],
        from: null,
        to: null,
        selectedOption: -1,
        loading: false,
        orderLoading: false,
        showEmpty: false,
        startBlockNum: null,
        cities: []
      }
    },
    components: {},
    props: {},
    computed: {
      ...mapGetters({}),
      ...mapState({
        privateKey: state => state.auth.privateKey
      })
    },
    methods: {
      ...mapActions({
        search: 'search',
        createOrder: 'createOrder',
        getRandomOffers: 'getRandomOffers'
      }),
      searchRun() {
        this.loading = true;
        this.selectedOption = -1;
        if (this.from && this.to)
          this.search({from: this.from.value, to: this.to.value}).then((offers) => {
            console.log("Got offers for search: ", offers);
            this.options = offers;
            this.loading = false;
            if (offers.length == 0) this.showEmpty = true;
            else this.showEmpty = false;
          });
      },
      selectLine(index) {
        this.selectedOption = index;
      },
      createOrderBtn() {
        this.orderLoading = true;
        this.createOrder(this.options[this.selectedOption].id).then(() => {
          this.orderLoading = false;
          this.$router.push({name: 'orders'});
        });
      },
      getHumanState(state) {
        if (state === '0x01') return "Paused";
        if (state === '0x02') return "Running";
        if (state === '0x04') return "Closed";
        if (state === '0x08') return "Interrupted";
      }
    },
    mounted () {

      this.cities = cities.map((city) => {
//            console.log(city.label.indexOf(', '));
        if (city.label.indexOf(', ') === -1) {
          if (city.country === "United States of America") city.country = 'USA'
          city.label = city.label + ", " + city.country;
          city.value = city.label;
        }
        return city;
      }).reverse();

      this.loading = true;
      this.getRandomOffers(10).then((offers) => {
        console.log("Got offers for search: ", offers);
        this.options = offers;
        this.loading = false;
        if (offers.length == 0) this.showEmpty = true;
        else this.showEmpty = false;
      });

      let account = web3.eth.accounts.privateKeyToAccount(this.privateKey);
      let offersregistry = getOffersRegistry(offersRegistryAddress, account);

      web3.eth.getBlockNumber().then((result) => {
        console.log("Current num: ", result);
        this.startBlockNum = parseInt(result);
        setInterval(() => {
          offersregistry.getPastEvents("LogNewOffer", {
            fromBlock: result - 4,
            toBlock: 'latest'
          }).then((events) => {
            if (events.length > 0) {
              for (let i in events) {
                let event = events[i];
                let eventOfferAddr = event.returnValues._offer;
                if (this.options.map(option => option.id).indexOf(eventOfferAddr) < 0 && !this.from && !this.to) {
//                  console.log("NEW OFFER!!!", event);

                  let account = web3.eth.accounts.privateKeyToAccount(this.privateKey);

                  getOffer(eventOfferAddr, account).methods.getData().call().then((res) => {

                    return {
                      id: eventOfferAddr,
                      forwarderAddress: res['0'],
                      details: res['1'],
                      from: res['2'],
                      to: res['3'],
                      offerState: res['4']
                    }
                  }).then((option) => {
                    let pubkeys = [option.forwarderAddress];
                    return axios.post('/auth/aboutkeys', {
                      pubkeys: pubkeys
                    }).then((res) => {
                      let forw = res.data.users[0];
                      if (forw) option.forwarderName = forw.id;
                      console.log("added new option from event: ", option);
                      this.options.unshift(option);
                    });
                  });
                }

              }
            }
          })
        }, 2000);

      });

    }
  }
</script>

<style>

    .search-wrapper {
        width: 100%;
        color: #fff;
    }

    .btn {
        cursor: pointer;
    }

    .trow {
        cursor: pointer;
    }

    .search-controls {
        margin-top: 30px;
        display: flex;
        width: 100%;
        justify-content: center;
    }

    .loader {
        text-align: center;
        width: 100%;
        margin-top: 20px;
    }

    .control-label {
        margin-left: 15px;
        margin-right: 15px;
        font-size: 1.3em;
    }

    .activerow {
        background-color: #3e5e7b;
    }

    .search-btn {
        margin-left: 10px;
        height: 2.55em;
        margin-top: -0.05em;
        background-color: #169FDF !important;
    }

    .files-container {
        margin-top: 40px;
        width: 100%;
        display: flex;
        height: 80%;
    }

    .filerow {
        cursor: pointer;
    }

    .option-description {
        display: flex;
        width: 45%;
        margin-left: 3%;
        flex-direction: column;
    }

    .selected {
        background-color: #2c3e50;
        color: white;
    }

    .order-loader {
        margin-left: 15px;
    }

    .files-table-container {
        width: 45%;
        margin-left: 5%;
    }

    .offer-description-container {
        display: flex;
        width: 45%;
        margin-left: 3%;
    }

    .table {
        margin-top: 20px;
    }

    .table-wrapper {
        height: 85%;
        overflow: auto;
    }

    .activerow {
        background-color: #3e5e7b;
    }

    .trow {
        cursor: pointer;
    }

    .file-description-container {
        height: 90%;
        overflow: auto;
    }

    .add-btn {
        cursor: pointer;
        margin-top: 5px;
    }

    .order-btn {
        height: 45px;
        width: 20%;
    }

    .order-params-header {
        height: 45px;
    }

    .route-input {
        /*height: 2.5em;*/
        /*color: #FFF !important;*/
        /*!*font-size: 15px !important;*!*/
        /*font-weight: 300 !important;*/
        /*background: none !important;*/
        /*border: none !important;*/
        /*border-bottom: 1px solid !important;*/
        /*padding: 10px 0 !important;*/
        /*margin: 0 0 20px !important;*/
        /*width: 180px;*/
        /*!*width: 100% !important;*!*/
        /*border-radius: 0 !important;*/
        /*outline: none;*/
        /*font-size: 1.2em;*/
        background-color: white;
        width: 20%;
        max-height: 2.5em;

    }

    .selected-tag {
        background-color: white !important;
        border: 0px !important;
    }

    .empty-message {
        text-align: center;
        width: 100%;
        font-size: 1.3em;
    }

    .state-btn {
        margin-right: 6px;
        cursor: pointer;
    }

    .loader-state-changing {

    }

    .pausedtds {
        color: rgba(77, 142, 218, 0.55);
    }

    .runningtds {
        color: #00d100;
    }

    .closedtds {
        color: rgba(77, 142, 218, 0.55);
    }

</style>
