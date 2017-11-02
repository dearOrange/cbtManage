'use strict';
define(function(require, exports, module) {
    var option_menu = {
        companyType: [
            { 'id': 1, 'type': '私营' },
            { 'id': 2, 'type': '国企' },
            { 'id': 3, 'type': '外资' },
            { 'id': 4, 'type': '合营' }
        ],
        companyScale: [
            { 'id': 1, 'type': '20人以下' },
            { 'id': 2, 'type': '20-50人' },
            { 'id': 3, 'type': '50-99人' },
            { 'id': 4, 'type': '100-199人' },
            { 'id': 5, 'type': '200-499人' },
            { 'id': 6, 'type': '500人以上' }
        ],
        industryCategory: [
            { 'id': 1, 'type': '生产厂家' },
            { 'id': 2, 'type': '代理商' },
            { 'id': 3, 'type': '经销商' },
            { 'id': 4, 'type': '其他' }
        ]
    };
    module.exports = option_menu;
});
