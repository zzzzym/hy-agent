<template>
  <div>
    <el-dialog
      title="选择企业"
      :visible.sync="visible"
      width="60%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :before-close="beforeClose"
    >
      <div>
        <el-date-picker
          v-model="listQuery.creationTime"
          class="filter-item"
          type="daterange"
          range-separator="至"
          start-placeholder="备案日期开始"
          end-placeholder="备案日期结束"
        />
        <el-input
          v-model="listQuery.enterpriseName"
          placeholder="企业名称"
          style="width: 200px; margin-left: 10px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.recordNum"
          placeholder="备案编号"
          style="width: 200px; margin-left: 10px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>

      <div class="cgright">
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
          >查询</el-button
        >
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-refresh"
          @click="resetTemp"
          >重置</el-button
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
        @current-change="handleSelectionChange"
      >
        <el-table-column
          label=""
          align="center"
          width="55"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <el-radio class="radio" v-model="radio" :label="row.index"
              ><span></span
            ></el-radio>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="55" align="center" />

        <el-table-column label="备案编号" prop="id" align="center" width="80">
          <template slot-scope="{ row }">
            <span>{{ row.recordNum }}</span>
          </template>
        </el-table-column>

        <el-table-column label="企业名称" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.enterpriseName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="统一信用代码"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span>{{ row.unifiedCredit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="法人姓名" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="法人联系电话"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span>{{ row.phone }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="加工企业地址"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span>{{ row.enterpriseAddress }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">取消</el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </div>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.skip"
        :limit.sync="listQuery.take"
        @pagination="pagination"
    /></el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import waves from "@/directive/waves"; // waves directive
import { fetchList } from "@/api/enterprise";
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
      radio: "0",
      tableKey: 0,
      // table的数据数组
      list: null,
      // 分页总数
      total: 0,
      // 等待状态
      listLoading: false,
      // table选中的数据
      multipleSelection: [],
      // 弹出层
      formdisabled: false,
      // 弹出层 下拉框值域
      provinceOptions: [],
      cityOptions: [],
      countyOptions: [],

      // 表单数据对象
      temp: {},
      // 表单验证规则
      rules: {},
      // 查询数据
      listQuery: {
        creationTime: null,
        enterpriseName: "",
        recordNum: "",
        beginCreationTime: "",
        endCreationTime: "",
        skip: 0,
        take: 10,
        pageParams: {
          skip: 0,
          take: 10,
        },
      },
    };
  },
  created() {
    this.listQuery.pageParams = {
      skip: this.listQuery.skip,
      take: this.listQuery.take,
    };
    this.getList();
  },
  methods: {
    resetTemp() {
      this.listQuery = {
        creationTime: null,
        enterpriseName: "",
        recordNum: "",
        beginCreationTime: "",
        endCreationTime: "",
        skip: 0,
        take: 10,
        pageParams: {
          skip: 0,
          take: 10,
        },
      };
    },
    pagination(e) {
      this.listQuery.pageParams.skip = (e.page - 1) * e.limit;
      this.listQuery.pageParams.take = e.limit;
      this.getList();
    },
    ok() {
      const row = this.multipleSelection;
      this.$emit("getData", row);
      this.$emit("closeVisible");
    },
    beforeClose() {
      this.$emit("closeVisible");
    },
    // 表格选中事件
    handleSelectionChange(val) {
      this.radio = val.index;
      if (this.multipleSelection.length > 0) {
        if (this.multipleSelection[0].id == val.id) {
        } else {
          this.multipleSelection = [];
          this.multipleSelection.push(val);
        }
      } else {
        this.multipleSelection.push(val);
      }
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
    getList() {
      this.listLoading = true;

      if (this.listQuery.creationTime ) {
        this.listQuery.beginCreationTime = this.dateFormat(
          this.listQuery.creationTime[0]
        );
        this.listQuery.endCreationTime = this.dateFormat(
          this.listQuery.creationTime[1]
        );
      } else {
        this.listQuery.beginCreationTime = "";
        this.listQuery.endCreationTime = "";
      }
      fetchList(this.listQuery).then((response) => {
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
      this.listQuery.pageParams.skip = 0;
      this.getList();
    },
  },
};
</script>
