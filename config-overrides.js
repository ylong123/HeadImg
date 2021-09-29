const { override, fixBabelImports } = require('customize-cra')

module.exports = override(
  // 按需引入
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    libraryDirectory: 'es/components',
    style: false
  })
)
