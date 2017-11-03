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
            module: '/src/modules/withdraw',
            childrens: [{
                name: '提现申请列表',
                flag: 'category',
                url: '/withdraw-list'
            }]
        }, {
            name: '活动管理',
            icon: 'icon-message',
            module: '/src/modules/active',
            childrens: [{
                name: '活动列表',
                flag: 'message',
                url: '/active-list'
            }]
        }, {
            name: '客户管理',
            icon: 'icon-config',
            module: '/src/modules/upstreams',
            childrens: [{
                name: '客户列表',
                flag: 'account',
                url: '/upstreams-list'
            }]
        }, {
            name: '线人管理',
            icon: 'icon-config',
            module: '/src/modules/downstreams',
            childrens: [{
                name: '线人列表',
                flag: 'account',
                url: '/downstreams-list'
            }]
        }, {
            name: '发放账号',
            icon: 'icon-config',
            module: '/src/modules/downstreams',
            childrens: [{
                name: '创建账号',
                flag: 'account',
                url: '/downstreams-create'
            }]
        }]
    };
    module.exports = FINAL_MENU_DATA_JSON;
});