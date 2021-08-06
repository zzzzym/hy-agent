<template>
  <div>
    <el-dialog
      title="选择互市商品"
      :visible.sync="visible"
      width="60%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :before-close="beforeClose"
    >
      <div>
        商品名称：
        <el-input
          v-model="listQuery.goodsName"
          placeholder="商品名称"
          style="width: 200px; margin-right: 20px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        规格：
        <el-input
          v-model="listQuery.specifications"
          placeholder="规格"
          style="width: 200px;margin-right: 20px"
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
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-refresh"
          @click="refresh"
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
          label="选择"
          align="center"
          width="80"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <el-radio class="radio" v-model="radio" :label="row.index">
              <span></span>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="55" align="center" />

        <el-table-column label="商品名称" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.goodsName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.specifications }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计量单位" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.measurement }}</span>
          </template>
        </el-table-column>
        <el-table-column label="重量" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.weight }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申报单价" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.customsPrice }}</span>
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
      />
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import waves from "@/directive/waves"; // waves directive
import { queryImportGoods } from "@/api/majorMaterial";
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
      radio:"0",
      tableKey: 0,
      // table的数据数组
      list: null,
      // 分页总数
      total: 0,
      // 等待状态
      listLoading: false,
      // table选中的数据
      multipleSelection: [],

      // 查询数据
      listQuery: {
        skip: 0,
        take: 10,
        pageParams: {
          skip: 0,
          take: 10,
        },
        goodsName: "",
        specifications: "",
      },
    };
  },
  mounted () {
    this.getList()
  },
  methods: {
    ok() {
      let row = this.multipleSelection;
      if (row.length != 1) {
        this.$message({
          title: "提示",
          message: "请选择一条记录",
          type: "warning",
          duration: 2000,
        });
        return false;
      } else {
        this.$emit("getData", row[0]);
        this.$emit("closeVisible");
      }
    },
    refresh() {
      this.listQuery = {
        skip: 0,
        take: 10,
        pageParams: {
          skip: 0,
          take: 10,
        },
        goodsName: "",
        specifications: "",
      };
    },
    beforeClose() {
      this.$emit("closeVisible");
    },
    pagination(e) {
      this.listQuery.pageParams.skip = (e.page - 1) * e.limit;
      this.listQuery.pageParams.take = e.limit;
      this.getList();
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
    // 按钮事件
    handleCreate() {},
    getList() {
      this.listLoading = true;
      const obj = {};
      obj.goodsName = this.listQuery.goodsName;
      obj.specifications = this.listQuery.specifications;
      obj.pageParams = this.listQuery.pageParams;
      queryImportGoods(obj).then((response) => {
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
