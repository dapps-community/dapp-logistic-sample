import axios from 'axios';

export const CHANGE_TOKEN = 'CHANGE_TOKEN';
export const SET_KEY = 'SET_KEY';
export const auth = (store, {login, password, key}) => {
    const {commit} = store;
    return axios.post('/auth/login', {
        id: login,
        password
    }).then((res) => {
        console.log(res.data);
        if (res.data.success) {
            window.localStorage.setItem('immla-front-token', res.data.token);
            window.localStorage.setItem('immla-network-key', key);
            commit(CHANGE_TOKEN, res.data.token);
            commit(SET_KEY, key);
        }
        return res;
    });
};

export const register = (store, {id, password, email, type}) => {
    const {commit} = store;
    let account = web3.eth.accounts.create();
    return axios.post('/auth/register', {
        id,
        password,
        email,
        type,
        pubkey: account.address
    }).then((res) => {
        web3.eth.sendTransaction({from:"0x64665166273237b3b74838863dd9f0ff61960300", to: account.address,
            value: web3.utils.toWei(5)}).then(console.log);
        console.log(res);
        if (res.data.success) {
            window.localStorage.setItem('immla-front-token', res.data.token);
            res.data.key = account.privateKey;
            window.localStorage.setItem('immla-network-key', res.data.key);
            commit(SET_KEY, res.data.key);
        }
        return res;
    });
};

export const LOG_OFF = 'LOG_OFF';
export const logOff = (store) => {
    const {commit} = store;
    window.localStorage.setItem('immla-front-token', null);
    window.localStorage.setItem('immla-network-key', null);
    return commit(LOG_OFF);
};

export const getUserInfo = () => {
    const token = window.localStorage.getItem('immla-front-token');
    return axios.get('/auth/check?token=' + token);
};

export const GET_USER_INFO = 'GET_USER_INFO';
export const getInfo = (store) => {
    return getUserInfo().then(res => {
        if (!res.data.success)
            store.commit(LOG_OFF);
        else store.commit(GET_USER_INFO, res.data.user);
        return res;
    });
};
