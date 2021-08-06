<template>
  <div>
    <!-- 料件信息弹出层 -->
    <el-dialog
      title="审核"
      :visible.sync="visible"
      width="60%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :before-close="close"
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
        <el-form-item label="审核结果" prop="examineStatus">
          <el-radio-group v-model="temp.examineStatus">
            <el-radio label="通过" />
            <el-radio label="驳回" />
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="审核时间"
          prop="examineTime"
        ><el-date-picker
          v-model="temp.examineTime"
          type="datetime"
          placeholder="选择日期时间"
        /></el-form-item>
        <el-form-item
          :rules="
            temp.examineStatus !== '通过'
              ? rules.examineResult
              : [{ required: false }]
          "
          label="审核意见"
          prop="examineResult"
        >
          <el-input
            v-model="temp.examineResult"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" style="margin-right:20px" @click="add">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        examineStatus: [
          { required: true, message: '请选择审核结果', trigger: 'blur' }
        ],
        examineTime: [
          { required: true, message: '请选择审核时间', trigger: 'blur' }
        ],
        examineResult: [
          { required: true, message: '请输入审核意见', trigger: 'blur' }
        ]
      },
      temp: {
        examineStatus: '',
        examineTime: new Date(),
        examineResult: ''
      },
      formdisabled: false
    }
  },
  watch: {
    visible: function(newval) {
      if (!newval) {
        this.temp = {
          examineStatus: '',
          examineTime: new Date(),
          examineResult: ''
        }
      }
    }
  },
  methods: {
    time(time) {
      var date = new Date(time)
      const Y = date.getFullYear() + '-'
      const M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      const D = date.getDate() + ' '
      const h = date.getHours() + ':'
      const m = date.getMinutes() + ':'
      const s = date.getSeconds()
      const a = Y + M + D + h + m + s
      return a
    },
    add() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.examineStatus === '通过') {
            this.temp.examineStatus = '已审核'
          }
          this.temp.examineTime = this.time(this.temp.examineTime)
          this.$emit('add', this.temp)
          this.$emit('update:visible', false)
        } else {
          return false
        }
      })
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
