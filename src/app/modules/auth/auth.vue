<template>
    <transition name="auth-app">

        <div class="auth-container">
            <div class="home-logo-container">
                <a href="https://immla.io" class="header-logo logo-image">
                    <img src="/static/logo.png" width="167" height="44" class="main-logo" alt="immla">
                </a>
            </div>
            <div class="auth--logo">
                Immla DApp Prototype
            </div>

            <div class="error-message" v-if="(error && !registerMode)" >
                Incorrect login/password!
            </div>

            <div class="attention-message" v-if="registerMode" >
                Attention: Do not use your private passwords, this prototype is just for testing and does not garant enough security of personal data.
            </div>

            <div class="error-message" v-if="registerMode && errorRegister" >
                User already exists!
            </div>


            <div class="key-message" v-if="regFinishedMode">
                <p>Your key is: {{key}}. Save it!</p>
                <button class="auth--btn" @click="joinAfterReg()">Ok, done!</button>
            </div>

            <div class="auth" v-if="!regFinishedMode">

                <div class="radios" v-if="registerMode">
                    <input type="radio" id="one" value="client" v-model="type">
                    <label class="rad-label" for="one">Client</label>

                    <input class="rad-input" type="radio" id="two" value="forwarder" v-model="type">
                    <label class="rad-label" for="two">Forwarder</label>
                </div>

                <div class="auth--login">
                    <input type="text" autoFocus="autofocus" placeholder="Login"
                           v-model="login" v-on:keyup.enter="nextField('email')">
                </div>
                <div class="auth--login" v-if="registerMode">
                    <input type="text" autoFocus="autofocus" placeholder="Email"
                           v-model="email" v-on:keyup.enter="nextField('pass')" ref="email">
                </div>
                <div class="auth--login">
                    <input type="password" placeholder="Password" ref="pass"
                           v-model="password"
                           v-on:keyup.enter="nextField('rpass')">
                </div>
                <div class="auth--login" v-if="registerMode">
                    <input type="password" placeholder="Repeat" ref="rpass"
                           v-model="repPassword"
                           v-on:keyup.enter="registerMe()">
                </div>

                <div class="auth--login" v-if="!registerMode">
                    <input type="password" placeholder="Key" ref="key"
                           v-model="key"
                           v-on:keyup.enter="authMe()">
                </div>
            </div>

            <div class="auth--btn" v-if="!progress && !registerMode && !regFinishedMode" :class="{ 'auth--btn-error': error }" @click="authMe">
                SIGN IN
            </div>

            <div class="register--btn" v-if="!progress && registerMode && !regFinishedMode" :class="{ 'auth--btn-error': error }" @click="registerMe">
                SIGN UP
            </div>

            <div class="spinner" v-if="progress">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
            </div>

            <div class="or-message" v-if="!registerMode && !regFinishedMode">
                Have no account yet? <span class="sign-up-link" @click="setRegisterMode(true)">Sign up!</span>
            </div>

            <!--<div class="auth&#45;&#45;btn" v-if="!progress" @click="registerMe">-->
                <!--SIGN UP-->
            <!--</div>-->
        </div>
    </transition>
</template>

<script>
  import {mapState, mapActions, mapGetters} from 'vuex';
  export default {
    data () {
      return {
        login: null,
        password: null,
        repPassword: null,
        error: null,
        errorRegister: null,
        email: 'test@lala.com',
        progress: false,
        registerMode: false,
        type: 'client',
        regFinishedMode: false,
        key: null
      };
    },
    components: {},
    props: {},
    computed: {
      ...mapGetters({}),
      ...mapState({})
    },
    methods: {
      ...mapActions({
        auth: 'auth',
        register: 'register'
      }),
      nextField(ref) {
        if(ref == 'rpass' && !this.registerMode) {
            this.$refs['key'].focus()
        }
        else
            this.$refs[ref].focus();
      },
      registerMe() {
        if(this.login && this.login.length > 0 && this.repPassword && this.password && this.password.length > 0 && (this.password == this.repPassword)) {
          this.register({
            id: this.login, password: this.password, email: this.email, type: this.type
          }).then((res) => {
            console.log("Registered: ", res);
            if(res.data.success) {
              this.errorRegister = false;
              this.regFinishedMode = true;
              this.key = res.data.key;
            } else {
              this.errorRegister = true;
            }
          });
        }
        else {
          // todo  show error
        }
      },
      setRegisterMode (flag) {
        this.registerMode = flag;
        this.errorRegister = false;
      },
      joinAfterReg() {
        this.$router.push({name: 'form-page'});
      },
      authMe() {
        if (this.login && this.password) {
          this.progress = true;
          this.auth({login: this.login, password: this.password, key: this.key})
            .then((res) => {
              if (res.data.success)
                setTimeout(() => {
                  this.progress = false;
                  this.error = false;
                  this.$router.push({name: 'form-page'});
                }, 400);
              else {
                setTimeout(() => {
                  this.progress = false;
                  this.error = true;
                }, 400);
              }
            }).catch((err) => {
            setTimeout(() => {
              this.progress = false;
              this.error = err;
            }, 400);
          });
        }
      }
    }
  }
</script>

<style>

    .error-message {
        margin-bottom: 15px;
        color: #bd4141;
    }

    .key-message {
        font-size: 20px;
        color: white;
        text-align: center;
    }

    .radios {
        color: white;
        justify-content: center !important;
    }

    .rad-label {
        margin-left: 15px;
        height: 17px;
    }

    .rad-input {
        margin-left: 20px;
    }

    .or-message {
        margin-top: 17px;
        color: #fff;
    }

    .sign-up-link {
        text-decoration: underline;
        cursor: pointer;
    }

    .home-logo-container {
        position: absolute;
        top: 8%;
        left: 8%;
    }

    .main-logo {
        width: 162px;
        height: 50px;
        background-size: 100%;
        padding: 0;
        background-repeat: no-repeat;
    }

    .auth-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        /*background-color: #34495e;*/
        padding-bottom: 70px;
        background-image: url('/static/immla-bg.png');
    }

    .auth {
        display: flex;
        flex-direction: column;
        width: 20%;
    }

    .auth--logo {
        color: #ecf0f1;
        font-size: 26px;
        margin-bottom: 22px;
    }

    .auth > div {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin: 0 0 20px 0;
    }

    .auth > div input {
        border: none;
        background-color: transparent !important;
        color: #FFF !important;
        font-family: "Open Sans" !important;
        font-size: 16px !important;
        font-weight: 300 !important;
        outline: none;
        height: 30px;
        border-bottom: 2px solid white;
        transition: color .2s ease;
    }

    ::-webkit-input-placeholder {color: #c4c4c4; font-weight: 100;}
    ::-moz-placeholder          {color: #c4c4c4; font-weight: 100;}
    :-moz-placeholder           {color: #c4c4c4; font-weight: 100;}
    :-ms-input-placeholder      {color: #c4c4c4; font-weight: 100;}

    .auth > div input:focus {
        color: #ecf0f1;
        border-bottom: 2px solid #ecf0f1;
    }

    .auth > div input:hover {
        color: #ecf0f1;
        border-bottom: 2px solid #ecf0f1;
    }

    .auth--login input {
        flex-grow: 1;
    }

    .auth--password {
        margin-bottom: 10px !important;
    }

    .auth--password input {
        flex-grow: 1;
    }

    .auth--btn {
        color: #ecf0f1;
        border: 2px solid #169FDF;
        background-color: #169FDF !important;
        border-radius: 19px;
        font-weight: 400 !important;
        padding: 2px 8px 2px 8px;
        margin-top: 11px;
        font-size: 16px;
        cursor: pointer;
        height: 35px;
        width: 104px;
        box-sizing: border-box;
        text-align: center;
        padding-top: 5px;
    }

    .register--btn {
        color: #ecf0f1;
        border: 2px solid #169FDF;
        background-color: transparent !important;
        border-radius: 19px;
        font-weight: 400 !important;
        padding: 2px 8px 2px 8px;
        margin-top: 11px;
        font-size: 16px;
        cursor: pointer;
        height: 35px;
        width: 104px;
        box-sizing: border-box;
        text-align: center;
        padding-top: 5px;
    }

    .auth--btn:hover {
        /*color: #2ecc71;*/
        color: #169FDF;
        border: 2px solid #169FDF;
        background: none !important;
    }

    /*.auth--btn-error {*/
        /*color: #c0392b;*/
        /*border: 2px solid #c0392b;*/
    /*}*/

    .auth-app-enter-active, .auth-app-leave-active {
        transition: opacity 0.3s ease;
        opacity: 1;
    }

    .auth-app-enter, .auth-app-leave-to {
        opacity: 0;
    }

    .spinner {
        margin-top: 11px;
        width: 28px;
        height: 28px;
        cursor: pointer;
        position: relative;
    }

    .attention-message {
      color: white;
      font-size: 1.2em;
      margin-top: 10px;
      margin-bottom: 20px;
    }

    .double-bounce1, .double-bounce2 {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #169FDF;
        opacity: 0.6;
        position: absolute;
        top: 0;
        left: 0;
        -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
        animation: sk-bounce 2.0s infinite ease-in-out;
    }

    .double-bounce2 {
        -webkit-animation-delay: -1.0s;
        animation-delay: -1.0s;
    }

    @-webkit-keyframes sk-bounce {
        0%, 100% {
            -webkit-transform: scale(0);
        }
        50% {
            -webkit-transform: scale(1);
        }
    }

    @keyframes sk-bounce {
        0%, 100% {
            transform: scale(0);
            -webkit-transform: scale(0);
        }
        50% {
            transform: scale(1);
            -webkit-transform: scale(1);
        }
    }
</style>
