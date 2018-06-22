/**
 * OpenDetail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CustomerTrackDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        args.upstreamName = decodeURIComponent(args.upstreamName);
        args.contacts = decodeURIComponent(args.contacts);
        this.init = function() {
            this.initDetail();
        };

        this.initDetail = function() {
            
          var html = jh.utils.template('admin-clueAuditDetail-template', args);
          $('#admin-clueAuditDetail-container').html(html);
          _this.searchIllegalInfo(); //查询违章信息
        };

        this.searchIllegalInfo = function() {
            var page = new jh.ui.page({
                data_container: $('#customer-trackDetail-container'),
                page_container: $('#page_container'),
                method: 'post',
                isSearch: true,
                url: '/record/upstreamTrackeList',
                contentType: 'application/json',
                data: {
                    upstreamName: args.upstreamName
                },
                callback: function(data) {
                    return jh.utils.template('customer-trackDetail-template', data);
                }
            });
            page.init();
        };
    }
    module.exports = CustomerTrackDetail;
});