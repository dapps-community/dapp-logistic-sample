import axios from 'axios';
export const search = (store, {from, to}) => {
    let account = web3.eth.accounts.privateKeyToAccount(store.rootState.auth.privateKey);
    let offersregistry = getOffersRegistry(offersRegistryAddress, account);
    return offersregistry.getByRoute(from, to).then(function (offerIds) {
        let offerPromises = offerIds.map(offerId => getOffer(offerId, account).methods.getData().call());
        return Promise.all(offerPromises).then((offersResults) => {
            console.log("Raw search results: ", offersResults);
            let preparedOffers = offersResults.map((offerData, i) => {
                return {
                    id: offerIds[i],
                    forwarderAddress: offerData['0'],
                    details: offerData['1'],
                    from: offerData['2'],
                    to: offerData['3'],
                  offerState: offerData['4']
                }
            });
            console.log("Prepared search results: ", preparedOffers);
            return preparedOffers;
        }).then((options) => {
            let pubkeys = options.map(option => option.forwarderAddress);
            return axios.post('/auth/aboutkeys', {
                pubkeys: pubkeys
            }).then((res) => {
                console.log(res);
                return options.map((option) => {
                    let forw = res.data.users.filter((user) => user.pubkey === option.forwarderAddress)[0];
                    if (forw) option.forwarderName = forw.id;
                    return option;
                });
            });
        });
    });
};

export const createOrder = (store, offerId) => {
  console.log(offerId);
    let account = web3.eth.accounts.privateKeyToAccount(store.rootState.auth.privateKey);
    let jobcontractregistry = getDealsRegistry(dealsRegistryAddress, account);
    return jobcontractregistry.newDeal(offerId).then((res) => {
        console.log(res);
    });
};

export const getRandomOffers = (store, num) => {
  let account = web3.eth.accounts.privateKeyToAccount(store.rootState.auth.privateKey);
  let offersregistry = getOffersRegistry(offersRegistryAddress, account);
  return offersregistry.peek(num).then(function (offerIds) {
    let offerPromises = offerIds.map(offerId => getOffer(offerId, account).methods.getData().call());
    return Promise.all(offerPromises).then((offersResults) => {
      console.log("Raw random search results: ", offersResults);
      let preparedOffers = offersResults.map((offerData, i) => {
        return {
          id: offerIds[i],
          forwarderAddress: offerData['0'],
          details: offerData['1'],
          from: offerData['2'],
          to: offerData['3'],
          offerState: offerData['4']
        }
      });
      console.log("Prepared random search results: ", preparedOffers);
      return preparedOffers;
    }).then((options) => {
      let pubkeys = options.map(option => option.forwarderAddress);
      return axios.post('/auth/aboutkeys', {
        pubkeys: pubkeys
      }).then((res) => {
        console.log(res);
        return options.map((option) => {
          let forw = res.data.users.filter((user) => user.pubkey === option.forwarderAddress)[0];
          if (forw) option.forwarderName = forw.id;
          return option;
        });
      });
    });
  });
}