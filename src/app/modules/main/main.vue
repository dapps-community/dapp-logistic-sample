
<template>
  <div class='app-container'>
    <transition name="fade-router" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/babel">
  import { mapState, mapGetters, mapActions } from 'vuex';
  import Vue from 'vue';

  export default {
//    sockets:{
//      connect: function(){
//        console.log('socket connected');
//      },
//      refresh: function(){
//        console.log("socket calls refresh state");
//        this.syncState();
//        this.syncHistory();
//      }
//    },
    computed: {
      ...mapState({
      }),
      ...mapGetters({
      })
    },
    data() {
      return {
      };
    },
    methods: {
      ...mapActions({
          syncState: 'syncState',
          syncHistory: 'syncHistory'
      })
    },
    components: {
    },
    mounted() {

    }
  };
</script>

<style>
  html {
    height: 100%;
  }
  html body {
    margin: 0px;
    height: 100%;
    font-family: sans-serif;
    overflow: hidden;
  }

  .app-container {
    display: flex;
    height: 100%;
  }

  .fade-router-enter-active, .fade-router-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-router-enter, .fade-router-leave-to {
    opacity: 0;
  }

</style>
