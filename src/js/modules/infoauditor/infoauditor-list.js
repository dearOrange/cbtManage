/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function InfoauditorList() {
        var _this = this;
        _this.form = $('#infoauditor-list-form');
        $('select').select2({
            minimumResultsForSearch: Infinity
        });

        $('.public_price').blur(function() {
            var minprice = $('#minprice').val();
            var maxprice = $('#maxprice').val();
            if (maxprice && minprice) {
                if (minprice > maxprice) {
                    jh.utils.alert({
                        content: '最小值不能比最大值大！！！',
                        ok: function() {
                            maxprice;
                        }
                    })
                }
            }
        })

        this.init = function() {
            this.initTaskTotalCount();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#infoauditor_list_container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                method: 'post',
                show_page_number:3,
                url: '/task/taskList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    data.passState = $('#state').val();
                    return jh.utils.template('infoauditorList_content_template', data);
                }
            });
            page.init();
        };
        this.initTaskTotalCount = function() {
            jh.utils.ajax.send({
                url: '/task/count',
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
        this.registerEvent = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'infoauditor-list-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.taskList-detail').on('click', '.taskList-detail', function() {
                var id = $(this).data('id');
                var state = $('#state').val();
                if (state === '1') {
                    jh.utils.load("/src/modules/infoauditor/infoauditor-list-detail", {
                        id: id
                    });
                } else if (state === '2') {
                    jh.utils.load("/src/modules/xinxiyuan/task/task-list-detailTrcaing", {
                        id: id
                    });
                } else if (state === '3' || state === '4') {
                    jh.utils.load("/src/modules/xinxiyuan/task/task-list-list-detailFinished", {
                        id: id
                    });
                }
            });

            //切换状态
            $('body').off('click', '.taskState').on('click', '.taskState', function() {
                var mine = $(this);
                var state = mine.data('state');
                $(this).addClass("active").siblings().removeClass("active");
                _this.form[0].reset();
                var arr = [{
                    val: 'unarrange',
                    name: "渠道经理未分配",
                    flag: 'trcaing'
                }, {
                    val: 'tracing',
                    name: "线索未提交",
                    flag: 'open,trcaing'
                }, {
                    val: 'clueChecking',
                    name: "线索审核中",
                    flag: 'open,trcaing'
                }, {
                    val: 'unvaluation',
                    name: "待估价",
                    flag: 'trcaing'
                }, {
                    val: 'unconfirmed',
                    name: "待债权方确认",
                    flag: 'trcaing'
                }, {
                    val: 'voucherChecking',
                    name: "凭证审核中",
                    flag: 'trcaing'
                }, {
                    val: 'hunterUnreceive',
                    name: "捕头未接受",
                    flag: 'trcaing'
                }, {
                    val: 'hunterReceive',
                    name: "捕头已接受",
                    flag: 'trcaing'
                }, {
                    val: 'platReceive',
                    name: "平台已收车",
                    flag: ''
                }, {
                    val: 'upstreamReceive',
                    name: "债权方已收车",
                    flag: ''
                }, {
                    val: 'closed',
                    name: "已失效",
                    flag: ''
                }];

                var optionArr = [];
                for (var i = 0; i < arr.length; i++) {
                    var item = arr[i];
                    if (state === 'all') {
                        optionArr.push(item);
                        continue;
                    }
                    if (item.flag.indexOf(state) !== -1) {
                        optionArr.push(item);
                    }
                }
                var str = '<option value="">全部</option>';
                for (var j = 0; j < optionArr.length; j++) {
                    var temp = optionArr[j];
                    str += '<option value="' + temp.val + '">' + temp.name + '</option>';
                }
                $("#selectCheck").html(str);


                $('select').select2({
                    minimumResultsForSearch: Infinity
                });
                $('#state').val(mine.data('value'))
            })


        };




    }
    module.exports = InfoauditorList;
});