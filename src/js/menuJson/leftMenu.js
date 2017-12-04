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
            name: '运营任务待审核',
            icon: 'icon-operate',
            module: '/src/modules/yunying/task',
            url: '/task-audit',
            childrens: []
        }, {
            name: '线索审核',
            icon: 'icon-supplier',
            module: '/src/modules/clueaudit',
            url: '/clue-audit',
            childrens: []
        }, {
            name: '运营线索反馈',
            icon: 'icon-message',
            module: '/src/modules/yunying/clue',
            url: '/clue-back',
            childrens: []
        }, {
            name: '债权方已确定订单',
            icon: 'icon-config',
            module: '/src/modules/creditororder',
            url: '/creditor-order',
            childrens: []
        }, {
            name: '运营债权方管理',
            icon: 'icon-region',
            module: '/src/modules/yunying/creditor',
            url: '/creditor-manage',
            childrens: []
        }, {
            name: '信息债权方认证',
            icon: 'icon-region',
            module: '/src/modules/xinxiyuan/creditor',
            url: '/creditor-identify',
            childrens: []
        }, {
            name: '捕头管理',
            icon: 'icon-region',
            module: '/src/modules/officermanage',
            url: '/officer-manage',
            childrens: []
        }, {
            name: '信息凭证审核',
            icon: 'icon-supplier',
            module: '/src/modules/xinxiyuan/evidence',
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
            name: '信息任务分配',
            icon: 'icon-supplier',
            module: '/src/modules/xinxiyuan/xx-distribution',
            url: '/xx-distribution-list',
            childrens: []
        }, {
            name: '渠道任务分配',
            icon: 'icon-supplier',
            module: '/src/modules/qudao/qd-distribution',
            url: '/qd-distribution-list',
            childrens: []
        }, {
            name: '信息出具价格',
            icon: 'icon-supplier',
            module: '/src/modules/xinxiyuan/restoration',
            url: '/restoration-list',
            childrens: []
        }]
    };
    module.exports = FINAL_MENU_DATA_JSON;
});