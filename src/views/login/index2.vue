<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ $t("login.title") }}</h3>
        <lang-select class="set-language" />
      </div>

      <el-form-item prop="username"  class="left1">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password" class="left1">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-form-item prop="verificationCode" class="left1">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="verificationCode"
          v-model="loginForm.verificationCode"
          :placeholder="$t('login.verificationCode')"
          name="verificationCode"
          type="text"
          tabindex="3"
          autocomplete="on"
          maxlength="4"
        />
        <div
          class="verificationCode"
          style="position: absolute; left: 360px; top: 2px"
        >
          <!-- <img
            :src="
              urlbase + 'api/Account/getVerifyCode?clientId=' +
                clientId
            "
            @click="changeCode"
          > -->
        </div>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >{{ $t("login.logIn") }}</el-button>

      <!-- <div style="position:relative">
        <div class="tips">
          <span>{{ $t('login.username') }} : admin</span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">
            {{ $t('login.username') }} : editor
          </span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>

        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
          {{ $t('login.thirdparty') }}
        </el-button>
      </div>-->
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog">
      {{ $t("login.thirdpartyTips") }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
// import { validUsername } from "@/utils/validate";
import LangSelect from '@/components/LangSelect'
import SocialSign from './components/SocialSignin'
// import { getCode } from "@/api/user";
export default {
  name: 'Login',
  components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      callback()
      // if (!validUsername(value)) {
      //   callback(new Error("请输入正确的用户名21"));
      // } else {
      //   callback();
      // }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('密码不能小于一位'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('验证码必须为4位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'test',
        password: 'test',
        verificationCode: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        verificationCode: [
          { required: true, trigger: 'blur', validator: validateCode }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      clientId: null,
      urlbase: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    this.mountebLogin();

    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.changeCode()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    changeCode() {
      // let me = this;

      const now = new Date()
      const month = now.getMonth() + 1
      const day = now.getDate()
      const hour = now.getHours()
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()

      const id =
        now.getFullYear().toString() +
        month.toString() +
        day +
        hour +
        minutes +
        seconds +
        Math.round(Math.random() * 23 + 100).toString()
      localStorage.setItem('clientId', id)
      localStorage.setItem('urlbase', process.env.VUE_APP_BASE_API)

      this.clientId = id
      this.urlbase = process.env.VUE_APP_BASE_API
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    mountebLogin() {
      this.$store
        .dispatch("user/login", { token: this.$route.query.token })
        .then(() => {
          this.$router.push({
            path: this.redirect || "/",
            query: this.otherQuery,
          });
          this.loading = false;
        })
        .catch(() => {
          this.changeCode();
          this.loading = false;
        });
      return;
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true

          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              })
              this.loading = false
            })
            .catch(() => {
              this.changeCode()
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    width: 85%;
    height: 47px;

    input {
      height: 47px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      background: transparent;
      border: 0;
      border-radius: 0;

      -webkit-appearance: none;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $bg inset !important;

        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    color: #454545;
    background: rgba(0, 0, 0, .1);
    border: 1px solid rgba(255, 255, 255, .1);
    border-radius: 5px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
