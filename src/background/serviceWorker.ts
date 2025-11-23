/**
 * @description 请求规则处理
 * 例如：重定向请求等
 */
import { updateDynamicRules } from '@/utils/chromeUtils'
const dynamicRules = [
  {
    id: 2, // 规则的唯一标识符（数字），用于添加/移除规则
    priority: 1, // 规则的优先级，数值越大优先级越高
    action: {
      type: 'redirect', // 动作类型，这里为重定向（redirect）
      redirect: {
        extensionPath: '/assets/icon128.png' // 重定向目标为扩展内的资源路径
      }
    },
    condition: {
      urlFilter: 'gravatar.com/avatar', // 匹配请求 URL 的过滤字符串
      resourceTypes: ['image'], // 应用规则的资源类型数组（如 image、script 等）
      initiatorDomains: ['gitlab.inter.wcansoft.com'] // 触发该请求的发起域名数组
    }
  }
]

// 工具：清除所有现有动态规则并添加新的
function replaceDynamicRules () {
  const removeRuleIds = dynamicRules.map((r: any) => r.id) // 先移除已有规则
  const addRules = dynamicRules // 然后添加新规则
  updateDynamicRules(
    { removeRuleIds, addRules },
    () => {}
  )
}
// replaceDynamicRules()
