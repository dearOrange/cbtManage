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
            name: 'yy债权方管理',
            icon: 'icon-region',
            module: '/src/modules/creditororder',
            url: '/creditor-manage',
            childrens: []
        }, {
            name: '债权方认证',
            icon: 'icon-region',
            module: '/src/modules/creditororder',
            url: '/creditor-identify',
            childrens: []
        }, {
            name: '捕头管理',
            icon: 'icon-region',
            module: '/src/modules/officermanage',
            url: '/officer-manage',
            childrens: []
        }, {
            name: 'xx凭证审核',
            icon: 'icon-supplier',
            module: '/src/modules/evidence',
            url: '/evidence-audit',
            childrens: []
        }, {
            name: '预估价格',
            icon: 'icon-supplier',
            module: '/src/modules/estimatedprice',
            url: '/estimated-price',
            name: '查账管理',
            icon: 'icon-supplier',
            module: '/src/modules/finance',
            url: '/finance-list',
            childrens: []
        }, {
            name: '发放提现申请',
            icon: 'icon-supplier',
            module: '/src/modules/sendMoney',
            url: '/sendMoney-list',
            childrens: []
        }, {
            name: 'xx任务分配',
            icon: 'icon-supplier',
            module: '/src/modules/distribution',
            url: '/distribution-list',
            childrens: []
        }, {
            name: 'xx出具价格',
            icon: 'icon-supplier',
            module: '/src/modules/restoration',
            url: '/restoration-list',
            childrens: []
        }]
    };
    module.exports = FINAL_MENU_DATA_JSON;
});