
<template>

    <div class="files-container">

        <div class="files-table-container">
            <h2>My Orders:</h2>
            <div class="table-wrapper" v-if="!loading && orders.length > 0">
                <table class="table">
                    <thead>
                    <tr>
                        <th>Offer</th>
                        <th v-if="type === 'client'">Forwarder</th>
                        <th v-if="type !== 'client'">Client</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody class="table-body">
                    <tr @click="selectLine(index)" v-bind:class="{ trow: true , activerow: index === selected }"
                        v-for="order, index in orders">
                        <td>{{order.from}} -> {{order.to}}</td>
                        <td v-if="type === 'client'">{{order.forwarderName}}</td>
                        <td v-if="type !== 'client'">{{order.ownerName}}</td>
                        <td v-if="closeState(order['status']) === 'appr'" style="color: rgb(255, 216, 23); font-weight: 600;">Needs for your confirmation!</td>
                        <td v-if="closeState(order['status']) === 'wait'" style="color: #aca561;">Waiting for another side confirmation</td>
                        <td v-if="closeState(order['status']) === 'done'" style="color: rgb(5, 175, 74); font-weight: 600;">Done</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div class="empty-offers" v-if="orders.length === 0">
                You have no orders now
            </div>

            <div v-if="loading" class="order-loader-or"><i class="fa fa-spinner fa-spin" style="font-size:36px"></i></div>
        </div>

        <div class="offer-description-container">
            <!--<file-uploader v-if="uploadMode"></file-uploader>-->
            <div v-if="orders[selected]">
                <h2>{{orders[selected].from}} -> {{orders[selected].to}}</h2>
                <p class="label label-default">{{orders[selected].ownerName}}</p>

                <h5>Place for order details...</h5>

                <div class="status-cont" v-if="closeState(orders[selected]['status']) === 'appr'">
                    <h5>Confirmation:</h5>
                    <span>If job is done successfully, press button</span>
                    <br>
                    <div style="display: flex">
                    <button @click="approveOrder(orders[selected].id)" class=" appr-btn btn btn-success">Confirm!
                    </button>
                    <div class="loader-wrapper" v-if="confirmLoading">
                        <i class="fa fa-spinner fa-spin" style="font-size:36px"></i>
                    </div>
                    </div>
                </div>

                <div class="status-cont" v-if="closeState(orders[selected]['status']) === 'wait'">
                    <h5>Status:</h5>
                    <span>Job's waiting for confirmation from another side</span>
                </div>

                <div class="status-cont" v-if="closeState(orders[selected]['status']) === 'done'">
                    <h5>Status:</h5>
                    <span>Job is done and confirmed by both sides!</span>
                </div>

            </div>
        </div>

    </div>

</template>

<script type="text/babel">
    import {mapState, mapActions, mapGetters} from 'vuex';
    export default {
        data () {
            return {
                orders: [],
                selected: -1,
                confirmLoading: false,
                loading: false
            }
        },
        components: {},
        props: {},
        computed: {
            ...mapGetters({}),
            ...mapState({
                type: (state) => state.auth.type,
                offers: (state) => state.offers.offers
            })
        },
        methods: {
            ...mapActions({
                syncOrders: 'syncOrders',
                closeOrder: 'closeOrder',
                syncOffers: 'syncOffers'
            }),
            selectLine(index) {
                this.addMode = false;
                this.selected = index;
            },
            closeState(status) {
                if (status === "0x00") return "appr";
                if (status === "0x01" && this.type === 'forwarder') return "wait";
                if (status === "0x02" && this.type === 'forwarder') return "appr";
                if (status === "0x01" && this.type === 'client') return "appr";
                if (status === "0x02" && this.type === 'client') return "wait";
                if (status === "0x03") return "done";
            },
            approveOrder(orderId) {
                this.confirmLoading = true;
                this.closeOrder(orderId).then((res) => {
                    console.log(res);
                    return this.syncOrders();
                }).then((orders) => {
                    console.log(orders);
                    this.orders = orders;
                    this.confirmLoading = false;
                });
            }
        },
        mounted () {
            this.loading = true;
            this.syncOrders().then((orders) => {
                this.orders = orders;
                this.loading = false;
            });
        }
    }
</script>
<style>

    .files-container {
        color: white;
    }

    .appr-btn {
        margin-top: 10px;
    }

    .status-cont {
        margin-top: 16px;
    }

    .btn {
        cursor: pointer;
    }
    .files-container {
        margin-top: 40px;
        width: 100%;
        display: flex;
    }

    .filerow {
        cursor: pointer;
    }

    .loader-wrapper {

        margin-left: 20px;
        margin-top: 15px;
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
        cursor: pointer;
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

    .order-loader-or {
        margin-top: 15px;
    }
</style>
