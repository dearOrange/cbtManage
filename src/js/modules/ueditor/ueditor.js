/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function Ueditor() {
        var _this = this;
        this.editor = null;


        this.init = function() {
            this.initUeditor();
        };
        this.initUeditor = function(isSearch) {
            var _this = this;
            _this.editor = new jh.utils.ueditor('editor');

            $('#getContent').on('click',function(){
                console.log(_this.editor.getContent());
            });


            jh.utils.validator.init({
                id: 'editorForm',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson($('#editorForm')); //表单数据
                    console.log(datas);
                    return false;
                }
            });
        };
    }
    module.exports = Ueditor;
});