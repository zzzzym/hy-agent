<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
body .el-table th.gutter {
  display: table-cell!important;
}

body .el-table colgroup.gutter {
  display: table-cell!important;
}

.cgright {
  float: right;
}
.el-col {
  border: 1px solid transparent;
}
.filter-item {
  vertical-align: 0 !important;
}
.el-input-number .el-input__inner {
  text-align: left;
}
/* 分隔线 */
.el-divider--horizontal {
  display: block;
  width: 100%;
  height: 1px;
  margin: 0 0 10px 0;
}
.el-form-item__label {
  width: 110px !important;
}
.el-form-item__content {
  margin-left: 110px !important;
}
.left1 .el-form-item__content {
  margin-left: 0 !important;
}
</style>