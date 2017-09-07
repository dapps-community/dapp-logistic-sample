import Vue from 'vue';
import store from './app/store';
import Router from './app/router';
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import vSelect from './app/select/comp/Select.vue';
Vue.component('v-select', vSelect);


let ethRpcUrl = "http://91.239.26.64:18545";
window.web3 = new Web3(new Web3.providers.HttpProvider(ethRpcUrl));

window.Vue = Vue;
// Vue.prototype.$mysock = new sock('http://localhost:8080');
// var vueUI = require('vue-ui');

// Vue.use(vueUI);

// import VueSocketio from 'vue-socket.io';
// Vue.use(VueSocketio, 'http://localhost:8000');

new Vue({
    el: '#app',
    store,
    router: Router,
    render: h => h(App)
});

Vue.use(BootstrapVue);

window.offersRegistryAddress = "0x627f558d7f1a4c461e7e0126166395b9e63403db";
window.dealsRegistryAddress = "0xf8609f2bedd2f263c28d8084e5c27eab0dfdaeb6";
window.gasLimit = 3000000;

window.getOffersRegistry = (address, account) => {
  var contract = new web3.eth.Contract(
    [{"constant":true,"inputs":[],"name":"getOffers","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_supplier","type":"address"}],"name":"getBySupplier","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_maxDepth","type":"uint256"}],"name":"peek","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"string"},{"name":"_to","type":"string"}],"name":"getByRoute","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"peekTop","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MAX_DEPTH","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_details","type":"string"},{"name":"_from","type":"string"},{"name":"_to","type":"string"}],"name":"newOffer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_offer","type":"address"}],"name":"LogNewOffer","type":"event"}]
    , address, {"from": account.address});

  contract.getOffers = function () {
    return this.methods.getOffers().call();
  }

  contract.getByRoute = function (_from, _to) {
    return this.methods.getByRoute(_from,_to).call();
  }

  contract.peek = function (depth) {
    return this.methods.peek(depth).call();
  }

  contract.newOffer = function (_details, _from, _to) {
    return account.signTransaction({"to": contract._address, "data":this.methods.newOffer(_details, _from, _to).encodeABI(), "gas":gasLimit}).then(function (res){
      return web3.eth.sendSignedTransaction(res.rawTransaction);
    })
  }

  return contract;
}

window.getOffer = (address, account) => {
  var contract = new web3.eth.Contract(
    [{"constant":true,"inputs":[],"name":"to","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isRunning","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getData","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"bytes1"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_details","type":"string"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"details","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_manager","type":"address"}],"name":"changeManager","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"bytes1"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"recall","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getManager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"from","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_state","type":"bytes1"}],"name":"switchTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_supplier","type":"address"},{"name":"_manager","type":"address"},{"name":"_details","type":"string"},{"name":"_from","type":"string"},{"name":"_to","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_who","type":"address"},{"indexed":false,"name":"_what","type":"string"}],"name":"LogUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"bytes1"},{"indexed":false,"name":"_to","type":"bytes1"}],"name":"LogChangeState","type":"event"}]
    , address, {"from": account.address});

  contract.switchTo = function (_state) {
    return account.signTransaction({"to": contract._address, "data":this.methods.switchTo(_state).encodeABI(), "gas":gasLimit}).then(function (res){
      return web3.eth.sendSignedTransaction(res.rawTransaction);
    })
  }

  contract.close = function () {
    return account.signTransaction({"to": contract._address, "data":this.methods.recall().encodeABI(), "gas":gasLimit}).then(function (res){
      return web3.eth.sendSignedTransaction(res.rawTransaction);
    })
  }

  return contract;
};


window.getDealsRegistry = (address, account) => {
  var contract = new web3.eth.Contract(
    [{"constant":true,"inputs":[{"name":"_pos","type":"uint256"}],"name":"getMyOwnedDeal","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMySupplyingDealCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_pos","type":"uint256"}],"name":"getMySupplyingDeal","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyOwnedDealCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_offer","type":"address"}],"name":"newDeal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMySupplyingDeals","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyOwnedDeals","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
    , address, {"from": account.address});

  contract.getMySupplyingDeals = function () {
    return this.methods.getMySupplyingDeals().call();
  }

  contract.getMyOwnedDeals = function () {
    return this.methods.getMyOwnedDeals().call();
  }

  contract.newDeal = function (_offerAddress) {
    return account.signTransaction({"to": contract._address, "data":this.methods.newDeal(_offerAddress).encodeABI(), "gas":gasLimit}).then(function (res){
      return web3.eth.sendSignedTransaction(res.rawTransaction);
    })
  }

  return contract;
}

window.getDeal = (address, account) => {
  var contract = new web3.eth.Contract(
    [{"constant":true,"inputs":[],"name":"status","outputs":[{"name":"","type":"bytes1"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isRunning","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"customer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getData","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"bool"},{"name":"","type":"bytes1"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getRecallClaim","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"compete","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirm","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"CLIENT","outputs":[{"name":"","type":"bytes1"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"offer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"bytes1"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recallClaim","type":"address"}],"name":"recall","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_state","type":"bytes1"}],"name":"switchTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"SUPPLIER","outputs":[{"name":"","type":"bytes1"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isCompleted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_customer","type":"address"},{"name":"_offer","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"bytes1"},{"indexed":false,"name":"_to","type":"bytes1"}],"name":"LogChangeState","type":"event"}]
    , address, {"from": account.address});

  contract.compete = function () {
    return account.signTransaction({"to": contract._address, "data":this.methods.compete().encodeABI(), "gas":gasLimit}).then(function (res){
      return web3.eth.sendSignedTransaction(res.rawTransaction);
    })
  }

  contract.confirm = function () {
    return account.signTransaction({"to": contract._address, "data":this.methods.confirm().encodeABI(), "gas":gasLimit}).then(function (res){
      return web3.eth.sendSignedTransaction(res.rawTransaction);
    })
  }

  return contract;
}
