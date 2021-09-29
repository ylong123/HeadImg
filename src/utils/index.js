/**
 * 防抖（debounce）
 * @param {Function} func 回调函数
 * @param {Integer} delay 延时
 * @returns
 */
export function Debounce (func, delay = 1000) {
  let timer
  return function (args) {
    timer && clearTimeout(timer)
    let callNow = !timer
    timer = setTimeout(() => {
      timer = null
    }, delay)
    callNow && func.call(this, args)
  }
}
/**
 * 节流（throttle）s
 * @param {Function} func 回调函数
 * @param {Integer} wait 延时
 * @returns
 */
export function Throttle (func, wait = 200) {
  let timer
  return function (args) {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        func.call(this, args)
      }, wait)
    }
  }
}
