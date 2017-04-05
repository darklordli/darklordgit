// 这个 getter 函数会返回 count 的值
// 在 ES6 里你可以写成：
// export const getTags = state => state.selectTableData

export function getTags (state) {
  return state.selectTableData
}
