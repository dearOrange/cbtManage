/**
 * 
 * @authors jiaguishan (jiaguishan@gmail.com)
 * @date    2017-04-18 13:53:39
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    var FINAL_MENU_DATA_JSON = {
        menus: [{
            name: '任务管理',
            icon: 'icon-region',
            module: '/src/modules/task',
            url: '/task-list',
            childrens: []
        }, {
            name: '任务审核',
            icon: 'icon-operate',
            module: '/src/modules/task',
            url: '/task-audit',
            childrens: []
        }, {
            name: '线索审核',
            icon: 'icon-supplier',
            module: '/src/modules/clueaudit',
            url: '/clue-audit',
            childrens: []
        }, {
            name: '线索反馈',
            icon: 'icon-message',
            module: '/src/modules/clueaudit',
            url: '/clue-back',
            childrens: []
        }, {
            name: '债权方已确定订单',
            icon: 'icon-config',
            module: '/src/modules/creditororder',
            url: '/creditor-order',
            childrens: []
        }, {
            name: '债权方管理',
            icon: 'icon-region',
            module: '/src/modules/creditororder',
            url: '/creditor-manage',
            childrens: []
        }, {
            name: '捕头管理',
            icon: 'icon-region',
            module: '/src/modules/officermanage',
            url: '/officer-manage',
            childrens: []
        }, {
            name: '凭证审核',
            icon: 'icon-supplier',
            module: '/src/modules/evidence',
            url: '/evidence-audit',
            childrens: []
        }]
    };
    module.exports = FINAL_MENU_DATA_JSON;
});