<template>
  <div class="page-memorandum">
    <div class="table-cont">
      <ComTable
        :configData="{
          height: '350',
          needSearch: 1,
          searchKey: 'name'
        }"
        :listData="filterTableData"
        :extraData="{
          searchPlaceholder: '备忘搜索',
          headerList: [
            {
              key: 'name',
              link: 'name',
              label: '备忘内容',
            },
            {
              key: 'time',
              label: '提醒时间',
              width: '170px'
            },
            {
              label: '操作',
              slotName: 'event',
              type: 'fixedBtn',
              width: '120px'
            },
          ]
        }"
      >
        <template #event="scope">
          <el-button
            type="primary"
            :icon="Edit"
            title="修改"
            circle
            @click.prevent=" editItem(scope.row)"
          >
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            title="删除"
            circle
            @click.prevent="quesDelItem(scope.row)"
          >
          </el-button>
        </template>
      </ComTable>
    </div>
    <el-button class="mt-4" style="width: 100%" @click="addItem"
      >增加</el-button
    >
    <el-dialog class="pop-set-tips" v-model="showPop" :width="450">
      <el-form
        ref="formRef"
        :label-position="'right'"
        label-width="100px"
        :model="addItemForm[0]"
        :rules="validateRules"
        :validate-trigger="'onSubmit'"
        style="max-width: 460px"
      >
        <el-form-item prop="name" label="备忘内容">
          <el-input
            v-model="addItemForm[0].name"
            :autosize="{ minRows: 3, maxRows: 6 }"
            type="textarea"
          />
        </el-form-item>
        <el-form-item prop="time" label="提醒时间">
          <el-date-picker
            v-model="addItemForm[0].time"
            type="datetime"
            title="选择时间"
            :editable="false"
            :default-time="new Date()"
            :teleported="false"
            value-format="YYYY-MM-DD HH:mm:ss"
            @cancel="showPop = false"
          />
        </el-form-item>
      </el-form>
      <div class="add-btn-cont flex">
        <el-button type="info" style="width: 50%" @click="onCancel(formRef)"
          >取消</el-button
        >
        <el-button type="primary" style="width: 50%" @click="popType === 'edit' ? onEditItem(formRef) : onAddItem(formRef)"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 禅道提醒配置 -->
    <el-dialog v-model="showZenTaoSettingPop" :width="450">
      <div class="git-settings-cont">
        <div class="setting-item">
          <span>Bug提醒：</span>
          <el-tooltip
            effect="dark"
            content="工作日的10、14、17点查询并提醒禅道BUG数量"
            placement="bottom"
          >
            <el-switch
              v-model="zenTaoSetting.bugSwitch"
              :active-value="true"
              :inactive-value="false"
              @change="localSet('zenTaoSetting', JSON.stringify(zenTaoSetting))"
            />
          </el-tooltip>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { localGet, localSet, sendData } from '@/utils/chromeUtils'
import { computed, reactive, ref } from 'vue'
import { listItemType } from '@popup/typeList'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Delete, Edit, Bell
} from '@element-plus/icons-vue'
export default {
  name: 'pageMemorandum'
}
</script>

<script lang="ts" setup>
const addItemForm = ref<any>([{}])
const showPop = ref<boolean>(false)
const tableData = ref<any>([])
const search = ref<string>('')
const formRef = ref<HTMLFormElement>()
const popType = ref<string>('')
const filterTableData = reactive<any>([])
const showZenTaoSettingPop = ref<boolean>(false) // 显示禅道设置弹窗
const zenTaoSetting = ref({
  bugSwitch: false // 禅道bug提醒开关
})

// 表单定义校验规则
const validateRules = reactive({
  name: [{ required: true, message: '请输入内容' }],
  time: [{ required: true, message: '请选择提醒时间' }]
})

// 从存储中拿到列表
localGet(['wordListStorage', 'zenTaoSetting']).then((res:any) => {
  if (res.wordListStorage) {
    tableData.value = JSON.parse(res.wordListStorage) || []
  }
  if (res.zenTaoSetting) {
    zenTaoSetting.value = JSON.parse(res.zenTaoSetting) || {}
  }
})
// 列表数据监听
filterTableData.value = computed(() => {
  const data = tableData.value.filter(
    (data:{name:string}) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
  return [
    ...data.filter((el:any) => el.showStyle !== 'del').sort((a:any, b:any) => Date.parse(a.time) - Date.parse(b.time)),
    ...data.filter((el:any) => el.showStyle === 'del').sort((a:any, b:any) => Date.parse(b.time) - Date.parse(a.time))
  ]
}
)

// 备忘提醒处理
const setRemindList = () => {
  sendData({ dataType: 'doRemind', data: filterTableData.value })
}

// // 置顶
// const setToTop = (item:listItemType) => {
//   tableData.value = [item, ...tableData.value.filter((el:listItemType) => {
//     return el.id !== item.id
//   })]
//   localSet('wordListStorage', JSON.stringify(tableData.value))
// }
// 修改
const editItem = (data:any) => {
  addItemForm.value[0] = { ...data }
  showPop.value = true
  popType.value = 'edit'
}
// 删除
const delItem = (item:listItemType) => {
  tableData.value = tableData.value.filter((el:listItemType) => {
    return el.id !== item.id
  })
  localSet('wordListStorage', JSON.stringify(tableData.value))
  setRemindList()
}
// 是否删除
const quesDelItem = (item:listItemType) => {
  ElMessageBox.confirm(
    '是否确认删除',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      delItem(item)
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    })
}
// 增加
const addItem = () => {
  addItemForm.value = [{}]
  showPop.value = true
  popType.value = 'add'
}
// 添加一条数据
const onAddItem = (formEl:HTMLFormElement) => {
  if (!formEl) return
  formEl.validate((valid:boolean, fields:any) => {
    if (valid) {
      showPop.value = false
      addItemForm.value[0].id = tableData.value.length + 1
      localSet('wordListStorage', JSON.stringify([...tableData.value, ...[addItemForm.value[0]]]))
      localGet(['wordListStorage']).then((res:any) => {
        tableData.value = JSON.parse(res.wordListStorage)
        setRemindList()
      })
      formEl.resetFields()
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 修改一条数据
const onEditItem = (formEl:HTMLFormElement) => {
  if (!formEl) return
  formEl.validate((valid:boolean, fields:any) => {
    if (valid) {
      tableData.value.forEach((el:{id:number, name:string, time:string, hasShow?:number|boolean, showStyle?:string}) => {
        if (el.id === addItemForm.value[0].id) {
          el.name = addItemForm.value[0].name
          el.time = addItemForm.value[0].time
          if (Date.parse(addItemForm.value[0].time) > Date.now()) { // 时间改为当前时间之后的,则重置弹窗提醒状态
            el.hasShow = 0
            el.showStyle = ''
          } else { // 时间改为当前时间之前的,则改为已提醒状态
            el.hasShow = 1
            el.showStyle = 'del'
          }
        }
      })
      localSet('wordListStorage', JSON.stringify(tableData.value))
      localGet(['wordListStorage']).then((res:any) => {
        tableData.value = JSON.parse(res.wordListStorage)
        setRemindList()
      })
      formEl.resetFields()
      showPop.value = false
      addItemForm.value = [{}]
    } else {
      console.log('error submit!', fields)
    }
  })
}
const onCancel = (formEl:HTMLFormElement) => {
  showPop.value = false
  formEl.resetFields()
  addItemForm.value = [{}]
}
</script>

<style lang="stylus" scoped>
.table-cont{
  // min-height: calc(100vh - 120px)
  margin-bottom: 10px
}
:deep().el-date-editor.el-input{
  width: 100%
}
:deep().pop-set-tips{
  margin: 10px auto 0
}
.commonly-list{
  margin-bottom: 20px
}
</style>
