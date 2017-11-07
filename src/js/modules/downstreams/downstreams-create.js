'use strict';
define(function(require, exports, module) {
    function DownstreamsCreate() {
        var _this = this;
        _this.form = $('#downstreams-create-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            jh.utils.mapSelect('downstreamsCreate', function() {
                $('select').select2();
            });
        };
        this.registerEvent = function() {

            $('#role').on('change', function() {
                var me = $(this);
                var ind = me.find('option:selected').index();
                var isCaptain = ind ? 0 : 1;
                $('#isCaptain').val(isCaptain);
            });

            // 搜索
            jh.utils.validator.init({
                id: 'downstreams-create-form',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form);
                    jh.utils.ajax.send({
                        url: '/downstreams/create',
                        data: datas,
                        done: function(returnData) {
                            if (returnData.code === 'SUCCESS') {
                                jh.utils.alert({
                                    content: '账号创建成功！'
                                });
                            }
                        }

                    });
                    return false;
                }
            });

            //重置
            _this.form.find('input[type="reset"]').on('click', function() {
                //重置事件先完成，之后再执行还原和美化
                window.setTimeout(function() {
                    $('#isCaptain').val('1');
                    $('select').select2();
                }, 0)

            });
        };
    }
    module.exports = DownstreamsCreate;
});