<template>
  <div class="page-desc">
    <ComTable
      :configData="{
        maxHeight: '400',
        tableTitle: '版本记录',
        tableRowClassName: tableRowClassName,
      }"
      :listData="tableData"
      :extraData="{
        headerList: [
          {
            key: 'title',
            label: '时间',
          },
          {
            key: 'version',
            link: 'link',
            label: '版本',
          },
        ]
      }"
    >
    </ComTable>
  </div>
</template>
<script lang="ts">
import { reactive } from 'vue'
import { versionList } from '@popup/data'
export default {
  name: 'pageDescInfo'
}
</script>

<script lang="ts" setup>
const tableData = reactive<any>([])
tableData.value = versionList
const tableRowClassName = ({
  row
}:{row:{type:string}}) => {
  if (row.type === 'bigUpgrade') {
    return 'type-important'
  }
}
</script>

<style lang="stylus" scoped>
.head{
  font-size: 18px
}
:deep().el-table{
  // .type-mr{
  //   --el-table-tr-bg-color: var(--el-color-info-light-9);
  // }
  // .type-yj{
  //   --el-table-tr-bg-color: var(--el-color-warning-light-9);
  // }
  .type-important{
    --el-table-tr-bg-color: var(--el-color-success-light-9);
  }
  .go-link{
    text-decoration: underline
    cursor: pointer
  }
}
</style>
