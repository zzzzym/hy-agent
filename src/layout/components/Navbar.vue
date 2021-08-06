<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!--
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

        <lang-select class="right-menu-item hover-effect" /> -->
        
          <!-- <el-button style="" class="right-menu-item" @click="changPassword"
            >修改密码</el-button
          > -->
        <el-button
          style=""
          type="error"
          class="right-menu-item"
          icon="el-icon-back"
          @click.native="logout"
          >退出登录</el-button
        >
      </template>

      <!-- <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      > -->
        <!-- <div class="avatar-wrapper">
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div> -->
        <!-- <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>
              {{ $t('navbar.profile') }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu> -->
      <!-- </el-dropdown> -->
      <el-dialog
        title="修改密码"
        :visible.sync="dialogFormVisible"
        width="60%"
        top="20px"
        :close-on-click-modal="false"
        destroy-on-close
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="100px"
          style="width: 100%"
          :disabled="formdisabled"
        >
          <el-col :span="11">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input
                v-model="temp.oldPassword"
                placeholder
                @input="change($event)"
              />
            </el-form-item> </el-col
          ><el-col :span="2" />
          <el-col :span="11">
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="temp.newPassword"
                placeholder
                @input="change($event)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="新密码确认" prop="newPasswordConfirm">
              <el-input
                v-model="temp.newPasswordConfirm"
                placeholder
                @input="change($event)"
              />
            </el-form-item>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{
            $t("table.cancel")
          }}</el-button>
          <el-button type="primary" @click="changPass">{{
            $t("table.confirm")
          }}</el-button>
        </div></el-dialog
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import LangSelect from '@/components/LangSelect'
// import Search from '@/components/HeaderSearch'
import { changePassword } from "@/api/oss";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    // ErrorLog,
    // Screenfull,
    // SizeSelect,
    // LangSelect,
    // Search,
  },
  data() {
    return {
      userName: "",
      dialogFormVisible: false,
      formdisabled: true,
      temp: {
        oldPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      },
      rules: {
        oldPassword: [
          { required: true, message: "请输入原密码", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
        ],
        newPasswordConfirm: [
          { required: true, message: "请确认新密码", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"]),
  },
  watch: {
    dialogFormVisible: function (val) {
      if (!val) {
        this.temp = {
          oldPassword: "",
          newPassword: "",
          newPasswordConfirm: "",
        };
      }
    },
  },
  created() {
    // this.userName = JSON.parse(localStorage.userInfo).userName;
  },
  methods: {
    change(e) {
      this.$forceUpdate();
    },
    changPass() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          changePassword(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$alert("请重新登录", " 修改密码成功", {
              confirmButtonText: "重新登录",
              callback: (action) => {
                this.logout();
              },
            });
            // this.$message({
            //   title: "成功",
            //   message: "修改密码成功,3秒后自动跳转重新登陆",
            //   type: "success",
            //   duration: 2000,
            // });
            // setTimeout(() => {
            //   this.logout();
            // }, 3000);
          });
        }
      });
    },
    changPassword() {
      this.dialogFormVisible = true;
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    closeWebPage() {
      if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
          window.opener = null;
          window.close();
        } else {
          window.open("", "_top");
          window.top.close();
        }
      } else if (navigator.userAgent.indexOf("Firefox") > 0) {
        window.location.href = "about:blank ";
      } else {
        window.opener = null;
        window.open("", "_self", "");
        window.close();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  position: relative;
  overflow: hidden;
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    float: left;
    height: 100%;
    line-height: 46px;
    transition: background .3s;
    cursor: pointer;

    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 70px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 35px;
      padding: 0 8px;
      color: #5a5e66;
      font-size: 18px;
      vertical-align: text-bottom;

      &.hover-effect {
        transition: background .3s;
        cursor: pointer;

        &:hover {
          background: rgba(0, 0, 0, .025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        margin-top: 5px;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          cursor: pointer;
        }

        .el-icon-caret-bottom {
          position: absolute;
          top: 25px;
          right: -20px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
