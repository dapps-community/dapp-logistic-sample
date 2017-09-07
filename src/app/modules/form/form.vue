
<template>
    <div class='form'>

        <!--<div class="form__header">-->
        <!--<div class="form__header&#45;&#45;user">-->
        <!--<div class="form__header&#45;&#45;title">-->
        <!--<div class="title__name">{{ name }}</div>-->
        <!--<div class="title__icons"-->
        <!--v-on:click="logoutClick">-->
        <!--<avatar class="logout-btn" imkey="logout"-->
        <!--link="http://cdn2.iconfinder.com/data/icons/picons-essentials/57/logout-512.png"-->
        <!--:size="20"-->
        <!--&gt;</avatar>-->

        <!--</div>-->
        <!--</div>-->

        <!--<avatar imkey="avatar" :size="45"></avatar>-->
        <!--</div>-->
        <!--</div>-->

        <div class="form__panel">

            <!--<div class="home-logo-container">-->
                <a href="https://immla.io" class="header-logo logo-image">
                    <img src="/static/logo.png" width="167" height="44" class="main-logo" alt="immla">
                </a>
            <!--</div>-->

            <div v-if="type == 'forwarder'" class="form__panel--create"
                 :class="{ 'activated': $router.currentRoute.name == 'offers' }" @click="showOffers()">
                <i class="fa fa-list" style="margin-right: 5px;" aria-hidden="true"></i>
                My Offers
            </div>
            <div v-if="type == 'client'" class="form__panel--create"
                 :class="{ 'activated': $router.currentRoute.name == 'search' }" @click="showSearch()">
                <i class="fa fa-search" style="margin-right: 5px;" aria-hidden="true"></i>
                Search
            </div>
            <div class="form__panel--create" :class="{ 'activated': $router.currentRoute.name == 'orders' }"
                 @click="showOrders()">
                <i class="fa fa-truck" style="margin-right: 5px;" aria-hidden="true"></i>
                My Orders
            </div>
            <div class="form__panel--create" :class="{ 'activated': $router.currentRoute.name == 'profile' }"
                 @click="showProfile()">
                <i class="fa fa-user" style="margin-right: 5px;" aria-hidden="true"></i>
                My Profile
            </div>

            <div class="user-block">
                <div class="title__icons">
                    {{ name }}
                    <i class="fa fa-sign-out logout-btn" aria-hidden="true" v-on:click="logoutClick"></i>
                </div>
            </div>

        </div>


        <div class="form__content">
            <transition name="fade-router" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>

    </div>
</template>

<script type="text/babel">
    import avatar from './avatar.vue'
    import {mapState, mapGetters, mapActions} from 'vuex'
    import Vue from 'vue'

    export default {
        components: {
            avatar
        },
        computed: {
            ...mapState({
                name: state => state.auth.name,
                type: state => state.auth.type
            }),
            ...mapGetters({})
        },
        data() {
            return {
//        activated: ''
            }
        },
        methods: {
            ...mapActions({
                logOff: 'logOff',
                getInfo: 'getInfo'
            }),
            logoutClick() {
                this.logOff();
                this.$router.push({name: 'auth-page'});
            },
            showOffers() {
                this.$router.push({name: 'offers'});
            },
            showOrders() {
                console.log(this.$router);
                this.$router.push({name: 'orders'});
            },
            showSearch() {
                this.$router.push({name: 'search'});
            },
            showProfile() {
                this.$router.push({name: 'profile'});
            }
        },
        mounted() {
            this.getInfo().then((res) => {
                if (this.type === 'client')
                    this.showSearch();
                else
                    this.showOffers();
            });
        }
    }
</script>

<style>
    .form {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        background-image: url(/static/immla-bg.png);
    }

    .form__header {
        flex-shrink: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        height: 55px;
    }

    .form__header--title {
        display: flex;
        flex-direction: column;
        margin-right: 10px;
        padding-top: 10px;
        font-size: 18px;
    }

    .form__header--title .title__icons {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    .form__header--title .title__icons .logout-btn {
        cursor: pointer;
    }

    .form__header--user {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 5px;
    }

    .form__panel {
        flex-shrink: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        height: 75px;
        /*background: #2c3e50;*/
        /*background-image: url('/static/immla-bg.png');*/
    }

    .form__panel--create {
        /*margin-top: 10px;*/
        margin-top: 10px;
        margin-right: 5px;
        font-size: 1.1em;
        user-select: none;
        border-radius: 5px;
        display: flex;
        align-items: center;
        /*margin: 5px;*/
        height: 55px;
        padding: 8px;
        background-color: transparent;
        transition: background-color .3s ease;
        cursor: pointer;
        /*color: white;*/
        color: #D5D5D5;
    }

    .form__panel--create.activated {
        background-color: #169FDF;
        color: white;
    }

    .form__panel--create:hover {
        background-color: #169FDF;
        color:white;
    }

    .main-logo {
        margin-top: 5px;
        width: 162px;
        height: 50px;
        background-size: 100%;
        padding: 0;
        top: 2%;
        background-repeat: no-repeat;
        position: absolute;
        left: 4%;
        cursor: pointer;
    }

    .form__panel--current {
        user-select: none;
        display: flex;
        align-items: center;
        margin: 5px;
        padding: 8px;
        background-color: transparent;
        transition: background-color .3s ease;
        color: white;
        cursor: pointer;
    }

    .form__panel--current.activated {
        background-color: #405a75;
    }

    .form__panel--current:hover {
        background-color: #405a75;
    }


    .logo-image {
        margin-top: 5px;
    }
    .form__content {
        display: flex;
        flex-grow: 1;
        justify-content: center;
    }

    .fade-router-enter-active, .fade-router-leave-active {
        transition: opacity 0.3s ease;
    }

    .fade-router-enter, .fade-router-leave-to {
        opacity: 0;
    }

    .luxoft-logo {
        position: absolute;
        background-repeat: no-repeat;
        bottom: 24%;
        height: 100px;
        left: 48%;
        width: 100px;
    }

    .user-block {
        color: white;
        font-size: 1.4em;
        padding-top: 20px;
        position: absolute;
        right: 3%;
    }

    .logout-btn {
        color:white;
        cursor: pointer;
        margin-left: 7px;
    }

</style>
