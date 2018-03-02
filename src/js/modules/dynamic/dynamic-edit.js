/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function DynamicEidt() {
        var _this = this;
        var args = jh.utils.getURLValue().args;

        this.init = function() {
            this.getDynamicInfo();
            this.registerEvent();
        };
        this.getDynamicInfo = function() {
            jh.utils.ajax.send({
                url: '/content/news/' + args.id,
                done: function(returnData) {
                    _this.initContent(returnData);

                    //富文本编辑器
                    var ueditor = new jh.utils.ueditor('dynamicEditor');

                    //上传按钮
                    jh.utils.uploader.init({
                        pick: {
                            id: '#image'
                        },
                        fileNumLimit: 1
                    });
                }

            });
        };

        this.initContent = function(returnData) {
            returnData.viewImgRoot = jh.config.viewImgRoot;
            returnData.imageScale = jh.config.imageScale;
            var html = jh.utils.template('dynamic_edit_template',returnData);
            $('#dynamic-box').html(html);
        };

        this.registerEvent = function() {

            // 修改
            jh.utils.validator.init({
                id: 'editDynamic-form',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form);
                    jh.utils.ajax.send({
                        url: '/content/updateNews',
                        method: 'post',
                        data: datas,
                        done: function(returnData) {
                            jh.utils.alert({
                                content: '编辑成功！',
                                ok: function() {
                                    jh.utils.load('/src/modules/dynamic/dynamic-list');
                                }
                            });
                        }
                    });
                    return false;
                }
            });
        };
    }
    module.exports = DynamicEidt;
});