import axios from 'axios';

export const syncOrders = (store) => {
  const {commit} = store;
  let account = web3.eth.accounts.privateKeyToAccount(store.rootState.auth.privateKey);
  let jobcontractregistry = getDealsRegistry(dealsRegistryAddress, account);
  if (store.rootState.auth.type === 'client')
    return jobcontractregistry.getMyOwnedDeals().then((jobIds) => {
      let jobsPromises = jobIds.map(jobId => getDeal(jobId, account).methods.getData().call());
      return Promise.all(jobsPromises).then((jobResults) => {
        console.log("Raw job results: ", jobResults);
        let preparedOrders = jobResults.map((job, i) => {
          return {
            id: jobIds[i],
            offerId: job['0'],
            owner: job['1'],
            completed: job['2'],
            status: job['3']
          }
        });

        let offerIds = preparedOrders.map(order => order.offerId);
        let offerPromises = offerIds.map(offerId => getOffer(offerId, account).methods.getData().call());
        let preparedOffers;
        return Promise.all(offerPromises).then((offersResults) => {
          console.log("Raw offers results: ", offersResults);
          preparedOffers = offersResults.map((offerData, i) => {
            return {
              id: offerIds[i],
              forwarderAddress: offerData['0'],
              details: offerData['1'],
              from: offerData['2'],
              to: offerData['3'],
              offerState: offerData['4']
            }
          });
          console.log("Prepared offers results: ", preparedOffers);
          return preparedOffers;
        }).then((offers) => {
          return preparedOrders.map((order) => {
            let offer = offers.filter(offer => offer.id === order.offerId)[0];
            order.from = offer.from;
            order.to = offer.to;
            order.details = offer.details;
            order.forwarderAddress = offer.forwarderAddress;
            order.offerState = offer.offerState;
            return order;
          });
        }).then((orders) => {
          let forwAddresses = orders.map(order => order.forwarderAddress);
          const {commit} = store;
          return axios.post('/auth/aboutkeys', {
            pubkeys: forwAddresses
          }).then((res) => {
            return orders.map((order) => {
              order.forwarderName = res.data.users.filter(owner => order.forwarderAddress === owner.pubkey)[0].id;
              return order;
            });
          });
        });;
      });
    });
  else
    return jobcontractregistry.getMySupplyingDeals().then((jobIds) => {
      let jobsPromises = jobIds.map(jobId => getDeal(jobId, account).methods.getData().call());
      return Promise.all(jobsPromises).then((jobResults) => {
        console.log("Raw job results: ", jobResults);
        let preparedOrders = jobResults.map((job, i) => {
          return {
            id: jobIds[i],
            offerId: job['0'],
            owner: job['1'],
            completed: job['2'],
            status: job['3']
          }
        });
        let offerIds = preparedOrders.map(order => order.offerId);
        let offerPromises = offerIds.map(offerId => getOffer(offerId, account).methods.getData().call());
        let preparedOffers;
        return Promise.all(offerPromises).then((offersResults) => {
          console.log("Raw offers results: ", offersResults);
          preparedOffers = offersResults.map((offerData, i) => {
            return {
              id: offerIds[i],
              forwarderAddress: offerData['0'],
              details: offerData['1'],
              from: offerData['2'],
              to: offerData['3'],
              offerState: offerData['4']
            }
          });
          return preparedOffers;
        }).then((offers) => {
          return preparedOrders.map((order) => {
            let offer = offers.filter(offer => offer.id === order.offerId)[0];
            order.from = offer.from;
            order.to = offer.to;
            order.details = offer.details;
            order.forwarderAddress = offer.forwarderAddress;
            order.offerState = offer.offerState;
            return order;
          });
        }).then((orders) => {
          let ownerAddresses = orders.map(order => order.owner);
          let ownersResults;
          const {commit} = store;
          return axios.post('/auth/aboutkeys', {
            pubkeys: ownerAddresses
          }).then((res) => {
            ownersResults = res.data.users;
            return orders.map((order) => {
              console.log(ownersResults.filter(owner => order.owner === owner.pubkey)[0]);
              order.ownerName = ownersResults.filter(owner => order.owner === owner.pubkey)[0].id;
              return order;
            });
          });
        });
      });
    });
};

export const closeOrder = (store, orderId) => {
  let account = web3.eth.accounts.privateKeyToAccount(store.rootState.auth.privateKey);
  if (store.rootState.auth.type === 'client')
    return getDeal(orderId, account).confirm();
  else
    return getDeal(orderId, account).compete();
};