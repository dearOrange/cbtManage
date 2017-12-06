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
            name: '信息-任务分配',
            icon: 'icon-supplier',
            module: '/src/modules/xinxiyuan/xx-distribution',
            url: '/xx-distribution-list',
            childrens: []
        }, {
            name: '信息-出具价格',
            icon: 'icon-supplier',
            module: '/src/modules/xinxiyuan/restoration',
            url: '/restoration-list',
            childrens: []
        }, {
            name: '信息-凭证审核',
            icon: 'icon-supplier',
            module: '/src/modules/xinxiyuan/evidence',
            url: '/evidence-audit',
            childrens: []
        },{
            name: '信息-任务管理',
            icon: 'icon-region',
            module: '/src/modules/xinxiyuan/task',
            url: '/task-list',
            childrens: []
        }, {
            name: '信息-线索管理',
            icon: 'icon-supplier',
            module: '/src/modules/xinxiyuan/clue',
            url: '/clue-manage',
            childrens: []
        }, {
            name: '信息-债权方认证',
            icon: 'icon-region',
            module: '/src/modules/xinxiyuan/creditor',
            url: '/creditor-identify',
            childrens: []
        }, {
            name: '运营-待审核任务',
            icon: 'icon-operate',
            module: '/src/modules/yunying/task',
            url: '/task-audit',
            childrens: []
        }, {
            name: '运营-线索反馈',
            icon: 'icon-message',
            module: '/src/modules/yunying/clue',
            url: '/clue-back',
            childrens: []
        }, {
            name: '运营-债权方管理',
            icon: 'icon-region',
            module: '/src/modules/yunying/creditor',
            url: '/creditor-manage',
            childrens: []
        }, {
            name: '渠道-任务分配',
            icon: 'icon-supplier',
            module: '/src/modules/qudao/qd-distribution',
            url: '/qd-distribution-list',
            childrens: []
        }, {
            name: '渠道-拖车单分配',
            icon: 'icon-supplier',
            module: '/src/modules/qudao/qd-trailer',
            url: '/qd-trailer-list',
            childrens: []
        }, {
            name: '渠道-线索审核',
            icon: 'icon-supplier',
            module: '/src/modules/clueaudit',
            url: '/clue-audit',
            childrens: []
        }, {
            name: '渠道-债权方已确定',
            icon: 'icon-config',
            module: '/src/modules/qudao/creditor',
            url: '/creditor-order',
            childrens: []
        }, {
            name: '渠道-捕头管理',
            icon: 'icon-region',
            module: '/src/modules/officermanage',
            url: '/officer-manage',
            childrens: []
        }, {
            name: '财务-查账管理',
            icon: 'icon-supplier',
            module: '/src/modules/finance',
            url: '/finance-list',
            childrens: []
        }, {
            name: '财务-发放提现申请',
            icon: 'icon-supplier',
            module: '/src/modules/sendMoney',
            url: '/sendMoney-list',
            childrens: []
        }, {
            name: '用户中心',
            icon: 'icon-supplier',
            module: '/src/modules/xinxiyuan/clue',
            url: '/clue-manage',
            childrens: []
        }]
    };
    module.exports = FINAL_MENU_DATA_JSON;
});