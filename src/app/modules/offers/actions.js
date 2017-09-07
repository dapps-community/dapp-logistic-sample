export const SET_OFFERS = 'SET_OFFERS';
export const syncOffers = (store) => {
  const {commit} = store;
  let account = web3.eth.accounts.privateKeyToAccount(store.rootState.auth.privateKey);
  let offersregistry = getOffersRegistry(offersRegistryAddress, account);
  return offersregistry.getOffers().then((offerIds) => {
    console.log(offerIds);
    let offerPromises = offerIds.map(offerId => getOffer(offerId, account).methods.getData().call());
    return Promise.all(offerPromises).then((offersResults) => {
      console.log("Raw offers results: ", offersResults);
      let preparedOffers = offersResults.map((offerData, i) => {
        return {
          id: offerIds[i],
          forwarderAddress: offerData['0'],
          details: offerData['1'],
          from: offerData['2'],
          to: offerData['3'],
          state: offerData['4']
        }
      });
      commit(SET_OFFERS, preparedOffers);
      return preparedOffers;
    });
  });
};

export const ADD_OFFER = 'ADD_OFFER';
export const addOffer = (store, offer) => {
  console.log(offer);
  const {commit} = store;
  let account = web3.eth.accounts.privateKeyToAccount(store.rootState.auth.privateKey);
  let offersregistry = getOffersRegistry(offersRegistryAddress, account);
  return offersregistry.newOffer(offer.details, offer.from, offer.to).then((res) => {
    console.log('created offer res: ', res);
  });
};

export const runOffer = (store, offerId) => {
  let account = web3.eth.accounts.privateKeyToAccount(store.rootState.auth.privateKey);
  return getOffer(offerId, account).switchTo("0x02");
};

export const closeOffer = (store, offerId) => {
  let account = web3.eth.accounts.privateKeyToAccount(store.rootState.auth.privateKey);
  return getOffer(offerId, account).close();
};

export const pauseOffer = (store, offerId) => {
  let account = web3.eth.accounts.privateKeyToAccount(store.rootState.auth.privateKey);
  return getOffer(offerId, account).switchTo("0x01");
};