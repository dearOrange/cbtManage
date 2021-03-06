/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function QDDistributionList() {
        var _this = this;
        _this.form = $('#qd-distributionList-form');

        this.init = function() {
            this.initContent();
            this.initAllButou();
            this.registerEvent();
        };

        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#admin-qDDistributionList-container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                method: 'post',
                url: '/task/channelTaskList',
                contentType: 'application/json',
                data: jh.utils.formToJson('#qd-distributionList-form'),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('admin-qDDistributionList-template', data);
                }
            });
            page.init();
        };

        this.initAllButou = function() {
            var opt = {
                url: '/task/downStreamListByChannel',
                done: function(returnData) {
                    var str = '<option value="">全部</option>';
                    $.each(returnData.data, function(index, item) {
                        str += '<option value="' + item.id + '">' + item.name + '</option>';
                    });
                    $('#qd-distributionList-downstreamId').html(str);
                    jh.utils.assignSelect('qd-distributionList-downstreamId');
                }
            };
            jh.utils.ajax.send(opt);
        };
        this.initSheriff = function(taskId) {
            jh.utils.ajax.send({
                url: '/task/downstreamByTaskChannel',
                data: {
                    taskId: taskId
                },
                done: function(returnData) {
                    var str = _this.distributionSheriff(returnData.data.alldownstream);
                    jh.utils.alert({
                        content: str,
                        ok: function() {
                            var ids = jh.utils.getCheckboxValue('distribution_public_form', 'value'),
                                obj = {};
                            if (!ids) {
                                jh.utils.alert({
                                    content: '请选择捕头！',
                                    ok: true,
                                    cancel: false
                                });
                                return false;
                            }
                            obj.downstreamlist = ids;
                            obj.taskId = taskId;
                            _this.distribution(obj);
                        },
                        cancel: true
                    });

                    //标识拒绝和已分配
                    _this.sheriffDownstream(returnData.data.downstream);
                    _this.sheriffRefuse(returnData.data.refuseList);
                }
            });
        };
        
        this.initMoreSheriff = function(taskId) {
            jh.utils.ajax.send({
                url: '/task/downStreamListByChannel',
                data: {
                    taskId: taskId
                },
                done: function(returnData) {
                    var str = _this.distributionSheriff(returnData.data);
                    jh.utils.alert({
                        content: str,
                        ok: function() {
                            var ids = jh.utils.getCheckboxValue('distribution_public_form', 'value'),
                                obj = {};
                            if (!ids) {
                                jh.utils.alert({
                                    content: '请选择捕头！',
                                    ok: true,
                                    cancel: false
                                });
                                return false;
                            }
                            obj.downstreamlist = ids;
                            obj.taskIds = taskId;
                            _this.moredistribution(obj);
                        },
                        cancel: true
                    });
                }
            });
        };
        
        //已分配
        this.sheriffDownstream = function(arr){
            var inputs = $('#distribution_public_form').find(':checkbox');
            for(var i = 0;i<inputs.length;i++){
                var item = inputs.eq(i);
                var iid = item.val();
                for(var j=0;j<arr.length;j++){
                    var temp = arr[j];
                    var tid = temp.id;
                    if(tid == iid){
                        item.attr('checked','checked');
                    }
                }
            }
        };
        //拒绝分配
        this.sheriffRefuse = function(arr){
            var inputs = $('#distribution_public_form').find(':checkbox');
            for(var i = 0;i<inputs.length;i++){
                var item = inputs.eq(i);
                var iid = item.val();
                for(var j=0;j<arr.length;j++){
                    var temp = arr[j];
                    var tid = temp.id;
                    if(tid == iid){
                        item.siblings('.isRefuse').html('-拒');
                    }
                }
            }
        };
        
        this.distributionSheriff = function(arr) {
            var source = jh.utils.getSheriffHtml();
            var render = jh.utils.template.compile(source);
            var menuState = function(state) {
                switch (state) {
                    case "all":
                        state = "可找车可拖车";
                        break;
                    case "trace":
                        state = "只找车";
                        break;
                    case "recycle":
                        state = "只拖车";
                        break;
                    case "tracerecycle":
                        state = "找车+拖车一体";
                        break;
                }
                return state;
            }
            var str = render({ list: arr, stateToString: menuState });
            return str;
        };

        this.distribution = function(obj) {
            var opt = {
            	method: 'post',
                url: '/task/allotDownStream',
                data:obj,
                done: function(returnData) {
                    jh.utils.alert({
                        content: '任务分配成功！',
                        ok: function(){
                            _this.initContent();
                        },
                        cancel: false
                    });
                }
            };
            jh.utils.ajax.send(opt);
        };
        
        this.moredistribution = function(obj) {
            var opt = {
              method: 'post',
                url: '/task/batchAllotDownStream',
                data:obj,
                done: function(returnData) {
                    jh.utils.alert({
                        content: '任务分配成功！',
                        ok: function(){
                            _this.initContent();
                        },
                        cancel: false
                    });
                }
            };
            jh.utils.ajax.send(opt);
        };
        this.registerEvent = function() {
            //查询
            jh.utils.validator.init({
                id: 'qd-distributionList-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });
            
            //查看任务详情
            $('.dataShow').off('click', '.detail').on('click', '.detail', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.load('/src/modules/qudao/qd-distribution/qd-distribution-detail', {
                    id: id
                });
            });
            //分配
            $('body').off('click', '.distribution').on('click', '.distribution', function() {
                var me = $(this);
                var taskId = me.data('id');
                _this.initSheriff(taskId);
            });
            
            //批量分配
            $('body').off('click', '#qd_distributeTask').on('click', '#qd_distributeTask', function() {
              var me = $(this);
              var taskIds = jh.utils.getCheckboxValue('admin-qDDistributionList-container');
              if (!taskIds) {
                jh.utils.alert({
                  content: '请选择任务！',
                  ok: true
                });
                return false;
              }
              _this.initMoreSheriff(taskIds);
            });
            
        };
    }
    module.exports = QDDistributionList;
});