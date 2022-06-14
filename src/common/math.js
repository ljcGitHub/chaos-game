/**
 * 两数相加
 * @param num1 数1
 * @param num2 数2
 * @returns num1 + num2
 */
export const add = function (num1, num2) {
  return Math.floor(num1 * 1000 + num2 * 1000) / 1000
}

/**
* 两数相减
* @param num1 数1
* @param num2 数2
* @returns num1 - num2
*/
export const sub = function (num1, num2) {
  return Math.floor(num1 * 1000 - num2 * 1000) / 1000
}

/**
* 两数相乘
* @param num1 数1
* @param num2 数2
* @returns num1 * num2
*/
export const mul = function (num1, num2) {
  return Math.floor((num1 * 1000) * (num2 * 1000)) / 1000000
}

/**
* 两数相除
* @param num1 数1
* @param num2 数2
* @returns num1 / num2
*/
export const div = function (num1, num2) {
  return Math.floor((num1 * 1000) / (num2 * 1000))
}

export const seed = 999 // 随机数种子
export const max = 100000 // 随机数种子
/**
 * 随机数
 * @param max 最大数
 * @returns 0 ~ max
 */
export const random = function () {
  this.seed = (this.seed * 9301 + 49297) % 233280
  let seed_ = this.seed / 233280.0
  let value = seed_ * max
  return value
}

/**
 * 指定范围随机数
 * @param min 最小数
 * @param max 最大数
 * @returns min ~ max
 */
export const randomRange = function (min, max) {
  let value = this.random(max - min) + min
  return value
}
