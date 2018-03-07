/**
 * DynamicList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function DynamicAdd() {
        var _this = this;

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function() {};

        this.registerEvent = function() {

            //富文本编辑器
            var ueditor = new jh.utils.ueditor('dynamicEditor');

            //上传按钮
            jh.utils.uploader.init({
                pick: {
                    id: '#image'
                },
                fileNumLimit:1
            });

            // 新增
            jh.utils.validator.init({
                id: 'addDynamic-form',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form);
                    var imageItems = $('#image').siblings('.upload-list.required').children('div');
                    if( imageItems.length === 0 ){
                        jh.utils.confirm({
                            content: '请上传配图'
                        });
                        return false;
                    }
                    if( !ueditor.getContent() ){
                        jh.utils.confirm({
                            content: '请填写详细内容'
                        });
                        return false;
                    }
                    jh.utils.ajax.send({
                        url: '/content/addNews',
                        method: 'post',
                        data: datas,
                        done: function(returnData) {
                            jh.utils.alert({
                                content: '新增成功！',
                                ok:function(){
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
    module.exports = DynamicAdd;
});