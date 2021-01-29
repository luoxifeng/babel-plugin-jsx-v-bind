'use strict'

module.exports = function (babel) {
  var t = babel.types

  return { // 最新使用@vue/babel-plugin
    inherits: require('babel-plugin-syntax-jsx'),
    visitor: {
      JSXOpeningElement: function JSXOpeningElement(path) {
        var bind = null;
        var bindAttribute = null;

        /**
         * 遍历开始标签上面左右的属性节点
         * 找到v-bind
         */
        path.get('attributes')
          .forEach(function (path) {
            const name = path.node.name;
            const value = path.node.value;
            if (!name) return

            const _name = name.name
            if (['vBind', 'v-bind'].indexOf(_name) < 0) return
            bindAttribute = path

            /**
             * 一个节点上不能使用多次v-bind
             */
            if (bind) {
              throw path.buildCodeFrameError('you can not have multiple v-bind directives on a single element')
            }

            /**
             * 必须使用jsx表达式
             * 不能使用vBind="foo" 这种字符串形式
             */
            if (!t.isJSXExpressionContainer(value)) {
              throw path.get('value').buildCodeFrameError('you should use JSX Expression with v-bind')
            }

            bind = value.expression;
          })

        if (!bind) return

        bindAttribute.replaceWith(
          t.JSXAttribute(
            t.JSXIdentifier('attrs'),
            t.JSXExpressionContainer(bind)
          )
        )
      }
    }
  }
}
