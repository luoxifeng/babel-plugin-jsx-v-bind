'use strict'


module.exports = function (babel) {
    var t = babel.types

    return {
        inherits: require('babel-plugin-syntax-jsx'),
        visitor: {
            JSXOpeningElement: function JSXOpeningElement(path) {
                var bind = null;
                var bindAttribute = null;

                path.get('attributes').forEach(function (path) {
                    const name = path.node.name;
                    const value = path.node.value;
                    if (!name) {
                        return
                    }

                    console.log(path.node.value);
                    const _name = name.name
                    if (_name === 'v-bind' || _name === 'vBind') {
                        bindAttribute = path
                    } else {
                        return
                    }
                    
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
                        throw path.get('value').buildCodeFrameError('you should use JSX Expression with v-model')
                    }

                    bind = value.expression;
                })

                if (!bind) {
                    return
                }

                console.log(bindAttribute.replaceWith, 'replace')

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