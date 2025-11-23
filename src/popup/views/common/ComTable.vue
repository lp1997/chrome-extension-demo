<template>
  <div class="table-com">
    <div class="table-cont">
      <h3 :class="[{ 'center': configData.titleCenter }]" v-if="extraData.title">{{ extraData.title }}</h3>
      <el-table :row-class-name="configData.tableRowClassName" scrollbar-always-on ref="listTable" class="table-list"
        :data="filterTableData" style="width: 100%" :max-height="configData.maxHeight" :height="configData.height">
        <el-table-column
          v-if="configData.needSearch || configData.needSwitch || configData.needShowLen || configData.tableTitle">
          <template #header>
            <div class="table-title" v-if="configData.tableTitle">{{ configData.tableTitle }}</div>
            <div v-else-if="configData.needShowLen" class="show-num">共{{ filterTableData.length }}个</div>
            <el-input v-if="configData.needSearch" v-model="search" size="small"
              :placeholder="extraData.searchPlaceholder" />
            <slot name="headBtn"></slot>
            <slot name="switchList"></slot>
          </template>
          <template v-for="(item, index) in extraData.headerList" :key="index">
            <i></i>
            <!-- 浮动按钮列表数据 -->
            <el-table-column v-if="item.type === 'fixedBtn'" fixed="right" :width="item.width" :label="item.label">
              <template #default="scope">
                <slot :name="item.slotName" :row="scope.row"></slot>
              </template>
            </el-table-column>
            <!-- 通用展示列表数据 -->
            <el-table-column v-else :width="item.width">
              <template #header>
                <span class="btn-sel" :class="{'is-sel': filterTableData.filter((el:any)=>!el.sel).length === 0}" v-if="index === 0 && configData.needSelect" @click.stop="selAll"></span>
                {{ item.label }}
              </template>
              <template #default="scope">
                <div class="table-show-item" :class="{ 'isLink': item.link && vailLink(scope.row[item.link]) }" @click="item.link && vailLink(scope.row[item.link]) ? pageGo(scope.row[item.link]) : ''" :title="scope.row[item.link] || scope.row[item.key]">
                  <span class="btn-sel" :class="{'is-sel': scope.row['sel'] && !scope.row['ifNotExport'], 'sel-disabled' : scope.row['ifNotExport']}" v-if="index === 0 && configData.needSelect" @click.stop="selItem(scope.row)"></span>
                  <img v-if="item.type === 'img'" class="show-img" :src="scope.row[item.key]">
                  <span :class="{'del': scope.row['showStyle'] === 'del'}" v-else v-html="JSON.parse(JSON.stringify(scope.row[item.key]).replace(/\\n/g, '<br/>'))"></span>
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table-column>
        <template v-else v-for="(item, index) in extraData.headerList" :key="index">
          <i></i>
          <!-- 浮动按钮列表数据 -->
          <el-table-column v-if="item.type === 'fixedBtn'" fixed="right" :width="item.width" :label="item.label">
            <template #default="scope">
              <slot :name="item.slotName" :row="scope.row"></slot>
            </template>
          </el-table-column>
          <!-- 通用展示列表数据 -->
          <el-table-column :width="item.width">
            <template #header>
              <span class="btn-sel" :class="{'is-sel': filterTableData.filter((el:any)=>!el.sel).length === 0}" v-if="index === 0 && configData.needSelect" @click.stop="selAll"></span>
              {{ item.label }}
            </template>
            <template #default="scope">
              <div class="table-show-item" :class="{ 'isLink': item.link && vailLink(scope.row[item.link]) }" @click="item.link && vailLink(scope.row[item.link]) ? pageGo(scope.row[item.link]) : ''" :title="scope.row[item.link] || scope.row[item.key]">
                <span class="btn-sel" :class="{'is-sel': scope.row['sel'] && !scope.row['ifNotExport'], 'sel-disabled' : scope.row['ifNotExport']}" v-if="index === 0 && configData.needSelect" @click.stop="selItem(scope.row)"></span>
                <img v-if="item.type === 'img'" class="show-img" :src="scope.row[item.key]">
                <span :class="{'del': scope.row['showStyle'] === 'del'}" v-else v-html="JSON.parse(JSON.stringify(scope.row[item.key]).replace(/\\n/g, '<br/>'))"></span>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, computed, watch, defineEmits, defineProps } from 'vue'
import { vailLink } from '@/utils/validate'
import { pageGo } from '@/utils/comUtils'
export default {
  name: 'ComTable'
}
</script>
<script lang="ts" setup>
/**
 * @description 数据
 */
interface Props {
  listData: any // 列表数据
  configData?: any // 列表配置数据
  extraData?: any // 列表额外数据
}
interface Emit {
  (ev: 'selUpdate', listData: any): void // 开关按钮数据
}
const emit = defineEmits<Emit>()

const props: any = defineProps<Props>()

const search = ref<string>('')

// 列表数据监听
const filterTableData = computed(() =>
  props.listData.value
    ? props.listData.value.filter(
      (data:any) => {
        return !search.value ||
        data[props.configData.searchKey].toLowerCase().includes(search.value.toLowerCase())
      }
    )
    : []
)
const selAll = () => { // 全选
  const isSelAll = filterTableData.value.filter((el:any) => !el.sel).length === 0
  emit('selUpdate', filterTableData.value.map((el:any) => {
    el.sel = !isSelAll
    return el
  }))
}
const selItem = (item:any) => { // 单选
  item.sel = !item.sel
  emit('selUpdate', filterTableData.value)
}
// console.log(123, filterTableData)
</script>

<style lang="stylus" scoped>
// .table-cont{
//   min-height: calc(100vh - 110px)
// }
h3{
  font-size: 20px
  font-weight: bold
  margin: 8px 0 12px
  &.center{
    text-align: center
    margin: 25px auto 5px
  }
}
:deep() .table-list{
  // margin-bottom: 20px
  .table-title{
    width: 100%
    font-size: 18px
    text-align: center
  }
  th{
    .cell{
      display: flex
      align-items: center
      .show-num{
        margin: 0 10px 0 5px
        min-width: 60px
        white-space: nowrap
      }
      .head-btn{
        margin-left: 20px
      }
      .switch-item{
        margin-left: 20px
        display: flex
        align-items: center
        white-space: nowrap
        .el-switch{
          margin-left: 8px
        }
      }
    }
  }
  .btn-sel{
    display: flex !important
    align-items: center
    justify-content: center
    width: 12px
    height: 12px
    margin-right: 8px
    display: block
    cursor: pointer
    border: 2px solid #6995e9
    flex-shrink: 0
    &.is-sel{
      &:after{
        content: ''
        // font-size: 12px
        // color: #6995e9
        // weight: bold
        background #6191e1
        width: 10px
        height: 10px
        display: block
        // background #6995e9
      }
    }
    &.sel-disabled{
      cursor: not-allowed
      border-color: #d1d1d1
      // &:after{
      //   content: ''
      //   width: 10px
      //   height: 10px
      //   display: block
      //   background #c1c1c1
      // }
    }
  }
  .show-img{
    max-width: 120px
    max-height: 60px
    display: block
    margin: 0 auto
  }
  .table-show-item{
    display: flex !important
    align-items: center
    max-height: 74px
    overflow: hidden
  }
  .del{
    text-decoration: line-through
    color: #aaa
  }
  .danger-row {
    --el-table-tr-bg-color: var(--el-color-danger-light-9);
  }
  .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
  }
  .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
  }
}
</style>
