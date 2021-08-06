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
        <el-input
          v-model="listQuery.roleName"
          placeholder="角色名称"
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
        >查询</el-button>
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
        <el-table-column type="index" label="序号" width="55" />
        <el-table-column label="角色名称" prop="id" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.roleName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="备注" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.remarks }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.status }}</span>
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
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import { query } from '@/api/role'
export default {
  components: { Pagination },
  directives: { waves },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
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

      // 查询数据
      listQuery: {
        skip: 0,
        take: 10,
        roleName: ''
      }
    }
  },
  created() {
    this.listQuery.skip = 0
    this.getList()
  },
  methods: {
    ok() {
      const row = this.multipleSelection
      this.$emit('getData', row)
      this.$emit('closeVisible')
    },
    beforeClose() {
      this.$emit('closeVisible')
    },
    // 表格选中事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    pagination(e) {
      this.listQuery.skip = (e.page - 1) * e.limit
      this.listQuery.take = e.limit
      this.getList()
    },
    getList() {
      this.listLoading = true
      const obj = {}
      obj.roleName = this.listQuery.roleName
      obj.pageParams = { skip: this.listQuery.skip, take: this.listQuery.take }
      query(obj).then((response) => {
        this.list = response.content.items
        this.total = response.content.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.skip = 0;
      this.getList()
    }
  }
}
</script>
