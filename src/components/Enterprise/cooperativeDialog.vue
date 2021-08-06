<template>
  <div>
    <el-dialog
      title="选择合作社"
      :visible.sync="visible"
      width="60%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :before-close="beforeClose"
    >
      <div class="filter-container">
        <el-date-picker
          class="filter-item"
          v-model="listQuery.createTime"
          type="daterange"
          range-separator="至"
          start-placeholder="备案日期开始"
          end-placeholder="备案日期结束"
        ></el-date-picker>
        <el-input
          v-model="listQuery.cooperativeName"
          placeholder="合作社（互助组）名称"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.recordNum"
          placeholder="备案编号"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <div class="cgright">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
            >查询</el-button
          >
        </div>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" prop="id" align="center" width="80">
          <template slot-scope="{ row }">
            <span>{{ row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备案编号" prop="id" align="center" min-width="150">
          <template slot-scope="{ row }">
            <span>{{ row.recordNum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="边民合作社(互助组)(村委会或社区)名称"
          prop="id"
          align="center"
          width="400"
        >
          <template slot-scope="{ row }">
            <span>{{ row.cooperativeName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="类型" width="150" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮政编码" width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.postalCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="乡镇街道" width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人姓名" width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="负责人电话号码" width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成员总数(人)" width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.persons }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成员出资总额(万元)" width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.totalInvestment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责采购的互市进口商品种类" width="250px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.products }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.skip"
        :limit.sync="listQuery.take"
        @pagination="getList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">{{ $t("table.cancel") }}</el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import waves from "@/directive/waves"; // waves directive
import { query } from "@/api/cooperative";
import { validUsername } from "@/utils/validate";

export default {
  components: { Pagination },
  directives: { waves },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tableKey: 0,
      // table的数据数组
      list: null,
      // 分页总数
      total: 0,
      skip: 0,
      take: 10,
      // 等待状态
      listLoading: false,
      // table选中的数据
      multipleSelection: [],
      // 弹出层
      formdisabled: false,

      // 查询数据
      listQuery: {
        recordNum: "",
        cooperativeName: "",
        beginCreationTime: "",
        endCreationTime: "",

        createTime: null,
        skip: 0,
        take: 10,
      },
    };
  },
  watch: {
    visible: function (val) {
      if (val) {
        this.resetTemp();
        this.getList();
      }
    },
  },
  created() {
    this.getList();
  },
  methods: {
    resetTemp() {
      this.listQuery = {
        recordNum: "",
        cooperativeName: "",
        beginCreationTime: "",
        endCreationTime: "",

        createTime: null,
        skip: 0,
        take: 10,
      };
    },
    ok() {
      let row = this.multipleSelection;
      this.$emit("getData", row);
      this.$emit("closeVisible");
    },
    beforeClose() {
      this.$emit("closeVisible");
    },
    // 表格选中事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dateFormat(dateData) {
      var date = new Date(dateData);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      const time = y + "-" + m + "-" + d;
      return time;
    },
    // 按钮事件
    handleCreate() {},
    getList() {
      if (this.listQuery.skip < 1) {
        this.listQuery.skip = 1;
      }
      this.listQuery.pageParams = {
        skip: (this.listQuery.skip - 1) * this.listQuery.take,
        take: this.listQuery.take,
      };
      this.listLoading = true;
      if (this.listQuery.createTime != null) {
        this.listQuery.beginCreationTime = this.dateFormat(this.listQuery.createTime[0]);
        this.listQuery.endCreationTime = this.dateFormat(this.listQuery.createTime[1]);
      } else {
        this.listQuery.beginCreationTime = "";
        this.listQuery.endCreationTime = "";
      }
      query(this.listQuery).then((response) => {
        this.list = response.content.items;
        this.total = response.content.total;
        this.list.map((item, index) => (item.index = index + 1));
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.getList();
    },
  },
};
</script>
