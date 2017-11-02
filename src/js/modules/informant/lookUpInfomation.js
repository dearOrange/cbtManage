'use strict';
define(function(require, exports, module) {
    function LookUpInfomation() {
        this.init = function() {
            this.initContent();
        };
        this.initContent = function() {
            var urls = jh.utils.getURLValue().args;
            var id = parseInt(urls.id);
            jh.utils.ajax.send({
                url: '/admin/news/view',
                method: 'get',
                data: {
                    id: id
                },
                done: function(data, status, xhr) {
                    data.response.main_pic = jh.arguments.viewImgRoot + data.response.main_pic;
                    data.response.tag = data.response.tag || '暂无标签';
                    var contentHTML = jh.utils.template('lookUp_content_template', data);
                    $('.lookUpContent').html(contentHTML);
                    $('.lookUpContent .content').append($(data.response.content));
                },
                fail: function(xhr, errorType, error) {}
            });
        };
    }
    module.exports = LookUpInfomation;
});