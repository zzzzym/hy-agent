<template>
  <div>
    <el-dialog
      title="选择加工信息"
      :visible.sync="visible"
      width="60%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :before-close="beforeClose"
    >
      <div class="filter-container">
       
        <el-input
          v-model="listQuery.cooperativeName"
          placeholder="原材料"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.recordNum"
          placeholder="成品"
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
        <!-- <el-table-column label="序号" prop="id" align="center" width="80">
          <template slot-scope="{ row }">
            <span>{{ row.index }}</span>
          </template>
        </el-table-column> -->

        <el-table-column label="原材料" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.superintendent }}</span>
          </template>
        </el-table-column>
        <el-table-column label="加工方式" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.telephoneNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产能" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.unifiedSocialCreditCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计量单位" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.status }}</span>
          </template>
        </el-table-column>

        <el-table-column label="成品" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="加工增值率（%）" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.createTime }}</span>
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
import { fetchList } from "@/api/article";
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
      // 等待状态
      listLoading: false,
      // table选中的数据
      multipleSelection: null,
      // 弹出层
      formdisabled: false,

      // 查询数据
      listQuery: {
        recordNum: "",
        cooperativeName: "",
        createTimeBegin: "",
        createTimeEnd: "",
        pageParams: { skip: 0, take: 10 },
      },
    };
  },
  methods: {
    ok() {
      this.$emit("getData", 123);
      this.$emit("closeVisible");
    },
    beforeClose() {
      this.$emit("closeVisible");
    },
    // 表格选中事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 按钮事件
    handleCreate() {},
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;

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
