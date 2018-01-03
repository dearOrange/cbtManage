/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ClueManage() {
        var _this = this;
        _this.form = $('#clue-manage-form');

        this.init = function() {
            this.initContent();
            this.initTaskTotalCount();
            this.registerEvent();
            $('select').select2({
                minimumResultsForSearch: Infinity
            });
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#clue_manage_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/trace/traceList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    data.passState = $('#state').val();
                    data.viewImgRoot = jh.config.viewImgRoot;
                    if (data.passState == 0) {
                        $('.clueMatch').css("display", "none");
                    } else {
                        $('.clueMatch').css("display", "");
                    }
                    return jh.utils.template('clue-manage-template', data);

                }
            });
            page.init();
        };
        this.initTaskTotalCount = function() {
            jh.utils.ajax.send({
                url: '/trace/count',
                done: function(returnData) {
                    var olBox = $('#taskState');
                    for (var item in returnData.data) {
                        var sup = $('<sup></sup>');
                        sup.text(returnData.data[item]);
                        olBox.find('[data-state="' + item + '"]').append(sup);
                    }
                    var sup = $('<sup></sup>');
                }
            });
        };

        this.traceOperator = function(ids, state) {
            if (!ids) {
                jh.utils.confirm({
                    content: '请选择线索后操作！'
                });
                return false;
            }
            var tip = state === 1 ? '通过' : '拒绝';
            jh.utils.alert({
                content: '确定' + tip + '吗？',
                ok: function() {
                    jh.utils.ajax.send({
                        url: '/trace/check',
                        data: {
                            traceIds: ids,
                            validState: state
                        },
                        done: function(returnData) {
                            _this.initContent();
                        }
                    });
                },
                cancel: true
            });
        };

        this.registerEvent = function() {

            // 搜索
            jh.utils.validator.init({
                id: 'clue-manage-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.clueManage-detail').on('click', '.clueManage-detail', function() {
                var id = $(this).data('id');
                var state = $(this).data('state');
                jh.utils.load("/src/modules/xinxiyuan/clue/clue-manage-detail", {
                    id: id,
                    state: state
                })
            });

            //切换状态
            $('body').off('click', '.taskState').on('click', '.taskState', function() {
                $(this).addClass("active").siblings().removeClass("active");
                _this.form[0].reset();
                $('select').select2();
                $('#state').val($(this).data('value'))
                _this.initContent();
            })

            //批量通过
            $('body').off('click', '#batchPass').on('click', '#batchPass', function() {
                var me = $(this);
                var ids = jh.utils.getCheckboxValue('clue_manage_container');
                _this.traceOperator(ids, 1);
            })

            //批量拒绝
            $('body').off('click', '#batchRefuse').on('click', '#batchRefuse', function() {
                var me = $(this);
                var ids = jh.utils.getCheckboxValue('clue_manage_container');
                _this.traceOperator(ids, 2);
            })

            //通过
            $('body').off('click', '.agreement').on('click', '.agreement', function() {
                var traceIds = $(this).data('id');
                _this.traceOperator(traceIds, 1);
            })
            //拒绝
            $('body').off('click', '.pass').on('click', '.pass', function() {
                var traceIds = $(this).data('id');
                _this.traceOperator(traceIds, 2);
            })
        };
    }
    module.exports = ClueManage;
});