import $ from 'jquery'
export class PageBasic {
  private _createTimer:any
  private _removeTimer:any
  public pluginMainDom:any = $('#plugin-add-all')
  public tipsDom:any = $('#plugin-tips')

  finishTips (tips:string) { // 提示
    console.log(tips)
    if (this.tipsDom) {
      this.tipsDom.remove()
    }
    clearTimeout(this._createTimer)
    clearTimeout(this._removeTimer)
    this._createTimer = setTimeout(() => {
      this.pluginMainDom && this.pluginMainDom.append(`<div id="plugin-tips">${tips}</div>`)
      this._removeTimer = setTimeout(() => {
        this.tipsDom && this.tipsDom.remove()
      }, 2000)
    }, 50)
  }
}
