<template>
  <div>
    <el-dialog
      title="选择主料"
      :visible.sync="visible"
      width="60%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :before-close="beforeClose"
    >
      <div>
        <el-input
          v-model="listQuery.materialId"
          placeholder="料件号"
          style="width: 200px; margin-left: 10px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.materialName"
          placeholder="料件名称"
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
        <el-table-column label="序号" prop="id" align="center" width="80">
          <template slot-scope="{ row }">
            <span>{{ row.index }}</span>
          </template>
        </el-table-column>

        <el-table-column label="料件号" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.superintendent }}</span>
          </template>
        </el-table-column>
        <el-table-column label="料件名称" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.telephoneNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格型号" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.unifiedSocialCreditCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计量单位" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.status }}</span>
          </template>
        </el-table-column>

        <el-table-column label="申报单价" align="center">
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
      /></el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive
import { fetchList } from '@/api/article'
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
      multipleSelection: [],
      // 弹出层
      formdisabled: false,
      // 弹出层 下拉框值域
      provinceOptions: [],
      cityOptions: [],
      countyOptions: [],

      // 表单数据对象
      temp: {
        countycode: '',
        citycode: '',
        provincecode: '',
        enterpriseName: '',
        // 企业名称

        superintendent: '',
        // 负责人

        address: '',
        // 地址

        telephoneNumber: '',
        // 电话

        unifiedSocialCreditCode: '',
        // 统一社会信用代码

        regionalismCode: '',
        // 行政区划代码

        note: '',
        // 备注

        createTime: new Date()
        // 创建时间
      },
      // 表单验证规则
      rules: {
        // provincecode: [
        //   {
        //     required: true,
        //     message: "请选择省",
        //     trigger: "change",
        //   },
        // ],
        // citycode: [{ required: true, message: "请选择市", trigger: "change" }],
        // unifiedSocialCreditCode: [
        //   { required: true, message: "请输入信用代码", trigger: "change" },
        // ],
        // enterpriseName: [
        //   { required: true, message: "请输入企业名称", trigger: "change" },
        // ],
        // superintendent: [
        //   { required: true, message: "请输入负责人", trigger: "change" },
        // ],
        // telephoneNumber: [
        //   { required: true, message: "请输入联系电话", trigger: "change" },
        // ],
        // countycode: [
        //   { required: true, message: "请选择区", trigger: "change" },
        // ],
      },
      // 查询数据
      listQuery: {
        page: 1,
        limit: 20,
        purchaseDate: '',
        materialName: '',
        materialId: ''
      }
    }
  },
  methods: {
    beforeClose() {
      this.$emit('closeVisible')
    },
    // 表格选中事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 按钮事件
    handleCreate() {},
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.skip = 1
      this.getList()
    }
  }
}
</script>
