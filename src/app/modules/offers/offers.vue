

<template>


    <div class="files-container">

        <div class="files-table-container">
            <h2>My Offers:</h2>
            <button @click="addClicked()" class="add-btn btn btn-primary"><i class="fa fa-plus" aria-hidden="true"></i>
                Add offer
            </button>
            <div class="table-wrapper" v-if="offers.length > 0">
                <table class="table">
                    <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Cost</th>
                        <th>State</th>
                    </tr>
                    </thead>
                    <tbody class="table-body">
                    <tr @click="selectLine(index)" v-bind:class="{ trow: true , activerow: index === selected }"
                        v-for="offer, index in offers">
                        <td>{{offer['from']}}</td>
                        <td>{{offer['to']}}</td>
                        <td>{{offer['details']}}</td>
                        <td v-bind:class="{ pausedtd: offer['state'] === '0x01', runningtd: offer['state'] === '0x02',
                         closedtd: offer['state'] === '0x04'  }">{{getHumanState(offer['state'])}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="empty-offers" v-if="offers.length === 0">
                You have no offers now. Maybe it's time to add something?
            </div>
        </div>

        <div class="offer-description-container">

            <!--<file-uploader v-if="uploadMode"></file-uploader>-->

            <div class="inputs" v-if="addMode">

                <h3>New Offer:</h3>

                <div class="form-group">
                    <!--<label>From:</label>-->
                    <!--<input placeholder="From..." class="field-input form-control" v-model="fromField"/>-->
                    <v-select class="field-input-tt" placeholder="From..." v-model="fromField"
                              :options="cities"></v-select>
                </div>

                <div class="form-group">
                    <!--<label>To:</label>-->
                    <v-select class="field-input-tt" placeholder="To..." v-model="toField" :options="cities"></v-select>
                </div>


                <div class="form-group">
                    <!--<label>Details:</label>-->
                    <input placeholder="Сost..." type="number" class="field-input-tt form-control" v-model="detailsField"/>
                </div>

                <div style="display: flex">
                    <button @click="fireOffer()" class="btn add-btn-2 btn-primary">Add!</button>

                    <div class="loader-wrapper-creation" v-if="createLoading">
                        <i class="fa fa-spinner fa-spin" style="font-size:36px"></i>
                    </div>
                </div>

            </div>

            <div v-if="offers[selected] && !addMode">
                <h2>{{offers[selected]['from']}} -> {{offers[selected]['to']}}</h2>
                <!--<span class="label label-default">{{offers[selected]['to']}}</span>-->
                <label>Cost: </label>
                <span class="label label-default">{{offers[selected]['details']}}</span>

                <h4>Place for different details of an offer</h4>

                <div class="state-controls">

                    <div v-if="offers[selected]['state'] === '0x01'">
                        <button @click="runOffer()" class="state-btn btn btn-success"><i class="fa fa-play btn-icon" aria-hidden="true"></i>Run</button>
                        <button @click="closeOffer()" class="state-btn btn btn-default"><i class="fa fa-times btn-icon" aria-hidden="true"></i>Close</button>
                    </div>

                    <div v-if="offers[selected]['state'] === '0x02'">
                        <button @click="pauseOffer()" class="state-btn btn btn-primary"><i class="fa fa-pause btn-icon" aria-hidden="true"></i>Pause</button>
                    </div>

                    <div class="loader-state-changing" v-if="stateChangeLoading">
                        <i class="fa fa-spinner fa-spin" style="font-size:36px"></i>
                    </div>

                </div>

                <!--<div class="offer-controls">-->
                <!--<button class="btn"></button>-->
                <!--</div>-->
            </div>
        </div>

    </div>

</template>

<script type="text/babel">
  import {mapState, mapActions, mapGetters} from 'vuex';
  import cities from '../search/cities';
  export default {
    data () {
      return {
        selected: -1,
        addMode: false,
        offers: [],
        fromField: null,
        toField: null,
        detailsField: null,
        createLoading: false,
        cities: [],
        stateChangeLoading: false
      }
    },
    components: {},
    props: {},
    computed: {
      ...mapGetters({}),
      ...mapState({})
    },
    methods: {
      ...mapActions({
        syncOffers: 'syncOffers',
        addOffer: 'addOffer',
        runOfferAction: 'runOffer',
        pauseOfferAction: 'pauseOffer',
        closeOfferAction: 'closeOffer'
      }),
      selectLine(index) {
        this.addMode = false;
        this.selected = index;
      },
      addClicked() {
        this.fromField = null;
        this.toField = null;
        this.detailsField = null;
        this.addMode = true;
      },
      fireOffer() {
        if (this.fromField && this.toField && this.detailsField && parseInt(this.detailsField)) {
          this.createLoading = true;
          this.addOffer({
            details: this.detailsField,
            from: this.fromField.value,
            to: this.toField.value
          }).then((res) => {
            console.log("Result of offer creation:", res);
            return this.syncOffers();
          }).then((offers) => {
            console.log("Synced offers: ", offers);
            this.offers = offers;
            this.createLoading = false;
          });
        }
      },
      getHumanState(state) {
        if(state === '0x01') return "Paused";
        if(state === '0x02') return "Running";
        if(state === '0x04') return "Closed";
        if(state === '0x08') return "Interrupted";
      },
      runOffer() {
        this.stateChangeLoading = true;
        this.runOfferAction(this.offers[this.selected].id).then(() => {
          this.offers[this.selected].state = "0x02";
          this.stateChangeLoading = false;
        });
      },
      pauseOffer() {
        this.stateChangeLoading = true;
        this.pauseOfferAction(this.offers[this.selected].id).then(() => {
          this.offers[this.selected].state = "0x01";
          this.stateChangeLoading = false;
        });
      },
      closeOffer() {
        this.stateChangeLoading = true;
        this.closeOfferAction(this.offers[this.selected].id).then((res) => {
          this.offers[this.selected].state = "0x04";
          console.log(res);
          this.stateChangeLoading = false;
        });
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

      this.syncOffers().then((offers) => {
        console.log("Got your offers: ", offers);
        this.offers = offers;
      });
//      this.addOffer({
//        details: "nice",
//        from: "mw22",
//        to: "sp"
//      });
    }
  }
</script>

<style>

    .files-container {
        margin-top: 40px;
        width: 100%;
        display: flex;
        color: white;
    }

    .filerow {
        cursor: pointer;
    }

    .selected {
        background-color: #2c3e50;
        color: white;
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
        background-color: #3f7aaf !important;
    }

    .add-btn-2 {
        cursor: pointer;
        margin-top: 5px;
        background-color: #169FDF !important;

    }

    .empty-offers {
        margin-top: 14px;
        font-size: 1.2em;
    }

    .field-input-tt {
        /*height: 1.5em;*/
        /*color: #FFF !important;*/
        /*!*font-size: 15px !important;*!*/
        /*font-weight: 300 !important;*/
        /*background: none !important;*/
        /*border: none !important;*/
        /*border-bottom: 1px solid !important;*/
        /*padding: 10px 0 !important;*/
        /*margin: 10px 0 20px !important;*/
        /*width: 280px;*/
        /*!*width: 100% !important;*!*/
        /*border-radius: 0 !important;*/
        /*outline: none;*/
        /*font-size: 1.1em;*/
        background-color: white;
        width: 50% !important;
        margin-top: 2%;
    }

    .inputs {
        margin-top: 10px;
        width: 100%;
    }

    .loader-wrapper-creation {
        margin-left: 15px;
        margin-top: 4px;
    }

    .btn-icon {
        margin-right: 10px;
    }

    .state-controls {
        margin-top: 20px;
        display: flex;
    }

    .state-btn {
        margin-right: 6px;
        cursor: pointer;
    }

    .loader-state-changing {

    }

    .pausedtd {
        color: aqua;
    }

    .runningtd {
        color: green;
    }

    .closedtd {
        color: #b1c3ff;
    }

</style>
