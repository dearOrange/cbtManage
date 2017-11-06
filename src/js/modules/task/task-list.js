/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function TaskList() {
        var _this = this;
        _this.form = $('#task-list-form');

        this.init = function() {
            this.initContent();
            this.initTaskTotalCount();
            this.initUpstreamsList();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            Mock.mock('/trace/list', {
                code: 'SUCCESS',
                msg: '请求成功',
                data: {
                    total: 65,
                    'list|10': [{
                        'id|+1': 1,
                        'carNumber': /[浙川沪][A-Z][a-zA-Z0-9]{5}/,
                        'carPrice|1-3.1-2':1,
                        'chuzhi|1-2.1-2':1,  
                        'carColor': /[白黑灰色*红]/,
                        'carId': Mock.Random.word(),
                        'engineId': Mock.Random.word(),
                        'carBrand': /(众泰|宝马|吉利汽车|奔驰|奥迪)/,
                        'carSeries': /(众泰SR7|奔驰S级|A4L|宝马X6)/,
                        'carModel': /(2016款 1.5T CVT魔方之门版 国IV|2010款 2.0L EX|2013款 Boxster 2.7L|2008款 S 600 L)/,
                        'companyName': Mock.Random.ctitle(6, 18),
                        'contactPhone': /1[34578]\d{9}/,
                        'createAt': Mock.Random.now('yyyy-MM-dd HH:mm:ss'),
                        'fingerprint': Mock.Random.county(true),
                        'ipCity': Mock.Random.county(true),
                        'lastUpdateAt': Mock.Random.now('yyyy-MM-dd HH:mm:ss'),
                        'location': Mock.Random.city()
                    }]
                }
            });

            var page = new jh.ui.page({
                data_container: $('#order_list_container'),
                page_container: $('#page_container'),
                method: 'post',
                ident: 'news',
                url: '/trace/list',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    var contentHtml = jh.utils.template('taskList_content_template', data);
                    return contentHtml;
                }
            });
            page.init();
            $('#upstreamId').select2({
                placeholder: '债权人选择',
                allowClear: true
            });
        };
        this.initUpstreamsList = function() {
            var returnData = {
                "action": 1,
                "code": "SUCCESS",
                "data": {
                    "list": [{
                            "companyName": "华享担保有限公司",
                            "id": 3
                        },
                        {
                            "companyName": "金华汪",
                            "id": 4
                        },
                        {
                            "companyName": "金华董",
                            "id": 5
                        },
                        {
                            "companyName": "浙江知本担保有限公司",
                            "id": 6
                        },
                        {
                            "companyName": "汇本担保",
                            "id": 7
                        },
                        {
                            "companyName": "名朝担保",
                            "id": 8
                        },
                        {
                            "companyName": "金华徐",
                            "id": 9
                        },
                        {
                            "companyName": "雪通担保",
                            "id": 10
                        },
                        {
                            "companyName": "张闯",
                            "id": 11
                        },
                        {
                            "companyName": "义乌振东",
                            "id": 12
                        }
                    ],
                    "pageNum": 1,
                    "pageSize": 10,
                    "pages": 15,
                    "size": 10,
                    "total": 144
                },
                "msg": "请求成功"
            }
            // jh.utils.ajax.send({
            //     url: '/upstreams/list',
            //     done: function(returnData) {
            var selectBox = $('#upstreamId');
            var optionStr = '<option value="">请选择债权人</option>';
            for (var i = 0; i < returnData.data.list.length; i++) {
                optionStr += '<option value="' + returnData.data.list[i].id + '">' + returnData.data.list[i].companyName + '</option>';
            }
            selectBox.html(optionStr);
            selectBox.select2({
                placeholder: '选择债权人',
                allowClear: true
            });
            //     }
            // });
        };
        this.initTaskTotalCount = function() {

            var returnData = {
                code: "SUCCESS",
                msg: "请求成功",
                data: {
                    "all": 3828,
                    "closed": 0,
                    "entrusted": 0,
                    "finished": 3,
                    "located": 17,
                    "locked": 0,
                    "tracing": 0
                }
            };

            // jh.utils.ajax.send({
            //     url: '/task/count',
            //     done:function(returnData){
            var olBox = $('#taskState');

            for (var item in returnData.data) {
                var sup = $('<sup></sup>');
                sup.text(returnData.data[item]);
                olBox.find('[data-value="' + item + '"]').append(sup);
            }
            var sup = $('<sup></sup>');
            sup.text(returnData.data.all);
            olBox.find('li').last().append(sup);
            //     }
            // });
        };
        this.registerEvent = function() {

            // 搜索
            jh.utils.validator.init({
                id: 'task-list-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //通过
            $('.dataShow').off('click', '.detail').on('click', '.detail', function() {
                var me = $(this);
                var infos = me.data('infos');
                // jh.utils.ajax.send({
                //     url: '/trace/matchedTrace',
                //     data: {
                //         taskId: infos.id
                //     },
                //     done: function(data, status, xhr) {
                var returnData = {
                    "action": "测试内容6fff",
                    "code": "SUCCESS",
                    "data": [{
                        "carNumber": "浙A4AF98",
                        "carPhoto": "a7513bb487cf41a098f492b184347c5e.jpg",
                        "city": "济南",
                        "contactPhone": "15012295060",
                        "createAt": '2017-01-02 15:22:11',
                        "downstreamId": 195,
                        "downstreamName": "欧阳雯君",
                        "downstreamPhone": "测试内容lc75",
                        "fingerprint": "117.1732,36.9712",
                        "id": 2836,
                        "ipCity": "天津",
                        "isActivity": true,
                        "isResult": true,
                        "lastUpdateAt": 1501229542000,
                        "location": "山东",
                        "photoCity": "测试内容4g4n",
                        "state": "located",
                        "tag": "",
                        "taskId": 12
                    }],
                    "msg": "请求成功"
                };
                infos.informantList = returnData.data;
                var alertStr = jh.utils.template('task_detail_template', {item:infos});
                jh.utils.alert({
                    content: alertStr,
                });
                //     }
                // });

            });

            //拒绝
            $('.dataShow').off('click', '.pass').on('click', '.pass', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.alert({
                    content: '是否确认拒绝？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/trace/refuse',
                            data: {
                                traceId: id
                            },
                            done: function(data, status, xhr) {
                                _this.initContent();
                            }
                        });
                    },
                    cancel: function() {}
                });
            });

            //采纳情报
            $('body').off('click','#agreementTrace').on('click',function(){
                var me = $(this);
                var id = me.data('id');
                // jh.utils.ajax.send({
                //     url:'/trace/adopt',
                //     type:'post',
                //     data:{
                //         traceId: id
                //     },
                //     done:function(returnData){
                //         jh.utils.alert({
                //             content:'采纳成功',
                //             ok:function(){
                //                 jh.utils.alert
                //             }
                //         });
                //     }
                // });
            });

        };
    }
    module.exports = TaskList;
});