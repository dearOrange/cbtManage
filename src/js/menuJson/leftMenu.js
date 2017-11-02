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
            childrens: [{
                name: '任务列表',
                flag: 'region',
                url: '/task-list'
            }]
        }, {
            name: '线人情报管理',
            icon: 'icon-operate',
            module: '/src/modules/informant',
            childrens: [{
                name: '线人情报列表',
                flag: 'news',
                url: '/informant-list'
            }]
        }, {
            name: '提现管理',
            icon: 'icon-supplier',
            module: '/src/modules/supplier',
            childrens: [{
                name: '待支付赏金',
                flag: 'category',
                url: '/supplierClassifyList'
            }, {
                name: '已支付账单',
                flag: 'supplier',
                url: '/supplierList'
            }]
        }, {
            name: '活动',
            icon: 'icon-message',
            module: '/src/modules/message',
            childrens: [{
                name: '待审查',
                flag: 'message',
                url: '/messageList'
            },{
                name: '已通过',
                flag: 'message',
                url: '/messageList1'
            }]
        }, {
            name: '客户管理',
            icon: 'icon-config',
            module: '/src/modules/platform',
            childrens: [{
                name: '待审查客户',
                flag: 'account',
                url: '/accountSetList'
            }, {
                name: '已认证客户',
                flag: 'role',
                url: '/roleSetList'
            }]
        }, {
            name: '线人管理',
            icon: 'icon-config',
            module: '/src/modules/platform',
            childrens: [{
                name: '线人列表',
                flag: 'account',
                url: '/accountSetList'
            }]
        }, {
            name: '发放账号',
            icon: 'icon-config',
            module: '/src/modules/platform',
            childrens: [{
                name: '创建账号',
                flag: 'account',
                url: '/accountSetList'
            }]
        }]
    };
    module.exports = FINAL_MENU_DATA_JSON;
});