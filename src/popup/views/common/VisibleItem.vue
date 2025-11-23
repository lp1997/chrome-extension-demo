<template>
  <div class="visible-item-container" :class="{'on': showFocus && isVisible, 'is-hidden': !isVisible}" @mouseover="onFocus" @mouseleave="onBlur">
    <template v-if="isVisible">
      <span class="btn-close" @click="toggleVisible(false)">隐藏</span>
      <slot v-if="isVisible"></slot>
    </template>
    <template v-else>
      <span class="btn-show" @click="toggleVisible(true)">展示{{props.name}}</span>
    </template>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue' // 移除 defineProps 的导入
import { localGet, localSet } from '@/utils/chromeUtils'
export default {
  name: 'VisibleItem'
}
</script>

<script setup lang="ts">
interface Props {
  name: string // 隐藏展示的模块名称
}
const props = defineProps<Props>()

const isVisible = ref<boolean>(false) // 是否显示
const showFocus = ref<boolean>(false) // 是否展示聚焦样式

let focusTimer: any = null // 聚焦定时器
let isFocus: boolean = false // 是否正在聚焦
let itemHiddenList: any = [] // 隐藏列表

const getData = () => { // 获取数据
  return new Promise((resolve) => {
    localGet(['itemHiddenList']).then((res: any) => { // 取设置缓存
      itemHiddenList = res.itemHiddenList ? JSON.parse(res.itemHiddenList) : []
      isVisible.value = itemHiddenList.find((el: any) => el.name === props.name)?.isHidden !== true
      resolve(true)
    })
  })
}
getData()

const onFocus = () => { // 聚焦
  if (isVisible.value && !isFocus) {
    isFocus = true
    clearTimeout(focusTimer)
    focusTimer = setTimeout(() => {
      showFocus.value = true
    }, 5e3)
  }
}
const onBlur = () => { // 失焦
  if (isVisible.value) {
    isFocus = false
    clearTimeout(focusTimer)
    showFocus.value = false
  }
}

const toggleVisible = async (flag: boolean) => { // 切换显示隐藏
  await getData()
  isVisible.value = flag
  if (flag) { // 展示
    showFocus.value = false
    isFocus = false
    clearTimeout(focusTimer)
  }
  const findItemIndex = itemHiddenList.findIndex((el: any) => el.name === props.name)
  console.log(flag, findItemIndex, props.name, itemHiddenList)

  if (findItemIndex > -1) { // 已存在则更新
    itemHiddenList = itemHiddenList.map((el: any) => {
      if (el.name === props.name) {
        return {
          ...el,
          isHidden: !flag
        }
      }
      return el
    })
  } else {
    itemHiddenList = [
      ...itemHiddenList,
      {
        name: props.name,
        isHidden: !flag
      }
    ]
  }
  console.log(itemHiddenList)

  localSet('itemHiddenList', JSON.stringify(itemHiddenList))
}
</script>

<style lang="stylus" scoped>
.visible-item-container{
  position: relative;
  transition: linear .3s;
  &.is-hidden{
    &:hover{
      box-shadow: 0 0 6px rgba(0,0,0,.3);
    }
  }
  &.on{
    box-shadow: 0 0 6px rgba(0,0,0,.3);
    .btn-close{
      height: 30px;
      top: -30px;
    }
  }
  .btn-close{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    cursor: pointer;
    font-size: 16px
    display: flex
    align-items: center
    justify-content: center
    color: #fff;
    background: #f89898;
    transition: linear .3s;
    z-index: 10
    overflow: hidden
    &:hover{
      background: #f56c6c;
    }
  }
  .btn-show{
    width: 100%;
    height: 30px;
    cursor: pointer;
    font-size: 16px
    display: flex
    align-items: center
    justify-content: center
    color: #666;
    margin: 5px 0
  }
}
</style>
