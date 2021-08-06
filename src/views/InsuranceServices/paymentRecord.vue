<template>
  <div class="app-container">
    <div class="filter-container">
      保险名称：
      <el-input
        v-model="listQuery.insuranceName"
        placeholder="保险名称"
        style="width: 200px; margin-right: 20px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      保险公司：
      <el-input
        v-model="listQuery.insuranceCompanyName"
        placeholder="保险公司"
        style="width: 200px; margin-right: 20px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
    </div>
    <div class="cgright" style="margin-bottom: 10px">
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >查询</el-button
      >
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-refresh"
        @click="refresh"
        >重置</el-button
      >

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="exportList"
        >导出</el-button
      >
    </div>
    <el-table
      :key="tableKey"
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="55" align="center" />
      <el-table-column
        label="保险名称"
        prop="insuranceName"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="保险公司"
        prop="insuranceCompanyName"
        align="center"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="保险金额"
        align="center"
        :show-overflow-tooltip="true"
        prop="realPrice"
      />

      <el-table-column
        label="交费时间"
        align="center"
        :show-overflow-tooltip="true"
        prop="payTime"
      />

      <el-table-column
        label="学校"
        align="center"
        :show-overflow-tooltip="true"
        prop="schName"
      />

      <el-table-column
        label="班级"
        align="center"
        :show-overflow-tooltip="true"
        prop="className"
      />

      <el-table-column
        label="学生姓名"
        align="center"
        :show-overflow-tooltip="true"
        prop="insurancePersonName"
      />
      <el-table-column
        label="投保人"
        align="center"
        :show-overflow-tooltip="true"
        prop="buyerName"
      />
      <el-table-column
        label="操作"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="details(row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!-- 弹出层 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      class="bloder"
      width="50%"
      top="20px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 100%"
        :disabled="formdisabled"
        ><el-row>
          <el-col :span="24"
            ><div
              class="bloder"
              style="height: 40px; line-height: 40px; font-size: 16px"
            >
              交费详情
            </div></el-col
          >
        </el-row>
        <el-divider />
        <el-row>
          <el-col :span="24">
            <el-form-item label="保险名称" prop="postalCode">
              <el-input v-model="temp.goodsName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="保险公司" prop="phone">
              <el-input v-model="temp.insuranceCompanyName" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="保险金额" prop="postalCode">
              <el-input v-model="temp.realPrice" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="支付时间" prop="phone">
              <el-input v-model="temp.payTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="投保人" prop="postalCode">
              <el-input v-model="temp.buyerName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="被保人" prop="phone">
              <el-input v-model="temp.insurancePersonName" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row
          ><el-col :span="24">
            <el-form-item label="被保人证件类型" prop="type">
              <el-input v-model="temp.idType" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="被保人证件号" prop="postalCode">
              <el-input v-model="temp.idCard" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="学校" prop="phone">
              <el-input v-model="temp.schName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="班级" prop="address">
              <el-input v-model="temp.className" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="被保人生日" prop="phone">
              <el-input v-model="temp.ppBirthday" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="保险起期" prop="phone">
              <el-input v-model="temp.insuranceTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="保险止期" prop="phone">
              <el-input v-model="temp.insuranceExpireTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="与被保人关系" prop="phone">
              <el-input v-model="temp.buyerRelation" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="被保人性别" prop="phone">
              <el-input v-model="temp.ppSex" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="投保人电话号码" prop="phone">
              <el-input v-model="temp.buyerTel" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="投保人证件类型" prop="phone">
              <el-input v-model="temp.buyerIdType" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="投保人证件号" prop="phone">
              <el-input v-model="temp.buyerIdCard" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="投保人生日" prop="phone">
              <el-input v-model="temp.buyerBirthday" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="投保人性别" prop="phone">
              <el-input v-model="temp.buyerSex" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="dialogFormVisible = false"
          style="margin-right: 10px"
          >{{ $t("table.cancel") }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import waves from "@/directive/waves"; // waves directive
import { query, querybyid } from "@/api/order";

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      // table的数据数组
      list: null,
      // 分页总数
      total: 0,
      // 等待状态
      listLoading: false,
      // 弹出层
      dialogFormVisible: false,
      formdisabled: false,
      dialogStatus: "",
      // 表单数据
      temp: {},
      // 查询数据
      listQuery: {
        page: 1,
        limit: 10,
        insuranceCompanyName: "",
        insuranceName: "",
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    details(row) {
      querybyid(row.orderInfoId).then((res) => {
        if (res.resCode === 200) {
          this.temp = { ...res.resData };
          this.temp.idType = "身份证";
          this.temp.buyerIdType = "身份证";
          this.temp.insuranceCompanyName = row.insuranceCompanyName;
          this.temp.goodPrice = row.goodPrice;
          this.dialogFormVisible = true;
        }
      });
    },
    // 导出
    exportList() {
      window.location.href = `${
        process.env.VUE_APP_EXPORT_BASE_API
      }/proxy/serviceinsuranceorderinfo/exportOrderInfo?goodsName=${
        this.listQuery.insuranceName
      }&insuranceCompanyName=${
        this.listQuery.insuranceCompanyName
      }&Authorization=${JSON.parse(localStorage.getItem("token"))}`;
    },
    // 按钮事件
    getList() {
      this.listLoading = true;
      query(this.listQuery).then((response) => {
        if (response.resCode === 200) {
          this.list = response.resData.records;
          this.list.map((item, index) => (item.index = index + 1));
          this.total = Number(response.resData.totalCount);
        } // Just to simulate the time of the request
        this.listLoading = false;
      });
    },
    refresh() {
      this.listQuery = {
        page: 1,
        limit: 10,
        insuranceCompanyName: "",
        insuranceName: "",
      };
    },
    handleFilter() {
      this.getList();
    },
  },
};
</script>
<style lang="css">
.el-dialog__body {
  padding-top: 0 !important;
  padding-left: 40px !important ;
  padding-right: 40px !important ;
  padding-bottom: 0px !important ;
}
label {
  font-weight: 400;
}
.bloder {
  font-weight: bolder;
}
</style>