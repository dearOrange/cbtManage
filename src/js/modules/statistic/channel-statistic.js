/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ChannelStatistic() {
        var _this = this;
        var date = new Date();
        var now = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDay()
        };
        now.month = now.month.toString().length === 1 ? '0' + now.month : now.month; //月份两位数

        _this.channelName = [];
        _this.traceCount = [];
        _this.carRecoveryMonths = [];
        _this.carRecoveryCount = [];
        _this.upstreamTrendMonths = [];
        _this.traceTrendMonths = [];
        _this.downstreamTrendMonths = [];
        _this.upstreamTrendCount = [];
        _this.traceTrendCount = [];
        _this.downstreamTrendCount = [];
        _this.countRate = 0;

        this.init = function() {
            $('#infoTimeInput,#carRecoveryInput,#entrustTimeInput').val(now.year + '-' + now.month);
            this.initHead();
            this.sectionTable();
            this.initSection();
            window.initContent('2018-01', true);
            window.initClear('2018-01', true);
//          window.initEntrustSort('2018-01', true);
            this.registerEvent();
        };

        //开头数据
        this.initHead = function() {
            var channelOne = jh.utils.formToJson($('#channel-list-form'));
            console.log(channelOne)
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/channel/recommendRatio',
                contentType: 'application/json',
                data: channelOne,
                done: function(returnData) {
                  console.log(returnData.data);
                  var channelOne = returnData.data;
                  var channelobj = {};
                  for (var a = 0; a < channelOne.length; a++) {
                      channelobj.value = channelOne[a].countEach;
                      channelobj.name = channelOne[a].name;
                  }
                  _this.channelName.push(channelobj);
                  console.log(_this.channelName);
//                for (var b = 0; b < traceTwo.length; b++) {
//                    _this.trendCountTwo.push(trace[a].count);
//                }
                  _this.sectionTable();
                }
            });
        };
        this.initSection = function() {
            
        }
        this.sectionTable = function() {
            
            var mainCarNum = echarts.init(document.getElementById('mainCarNum'));
            mainCarNum.setOption({
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient : 'vertical',
                    x : 'left',
                    data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                },
                calculable : true,
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius : ['50%', '70%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : true,
                                    position : 'center',
                                    textStyle : {
                                        fontSize : '30',
                                        fontWeight : 'bold'
                                    }
                                }
                            }
                        },
                        data:[
                            {value:335, name:'直接访问', id:1},
                            {value:310, name:'邮件营销', id:2},
                            {value:234, name:'联盟广告', id:3},
                            {value:135, name:'视频广告', id:4},
                            {value:1548, name:'搜索引擎', id:5}
                        ]
                    }
                ]
            });

        };

        window.initContent = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数

            var page = new jh.ui.page({
                data_container: $('#statistic_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/statistics/traceSort',
                showPageTotal: false,
                jump: false,
                show_page_number: 3,
                contentType: 'application/json',
                data: {
                    type: 'trace',
                    pageSize: 5,
                    yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('statistic_content_template', data);
                }
            });
            page.init();
        };

        window.initClear = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数

            var page = new jh.ui.page({
                data_container: $('#clear_info_container'),
                page_container: $('#page_clear_container'),
                method: 'post',
                url: '/statistics/recoverySort',
                contentType: 'application/json',
                data: {
                  pageSize: 5,
                    type: 'carRecovery',
                    yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                show_page_number: 3,
                callback: function(data) {
                    return jh.utils.template('clear_content_template', data);
                }
            });
            page.init();
        };

        window.initEntrustSort = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/entrust',
                contentType: 'application/json',
                data: {
                    yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                done: function(returnData) {
                    var entrust = returnData.data;
                    var noResultBox = $('#entrustNoResultBox');
                    if (!entrust.length) {
                        noResultBox.removeClass('hide');
                        noResultBox.prev().addClass('hide');
                        return false;
                    } else {
                        noResultBox.addClass('hide');
                        noResultBox.prev().removeClass('hide');
                    }
                    var entrustContent = jh.utils.template('entrust_content_template', returnData);
                    $('#entrustResultBox').html(entrustContent);
                    

                }
            });
        };

        this.registerEvent = function() {

            $('select').select2({
                minimumResultsForSearch: Infinity
            });
        };
    }
    /**
     * 情报begin
     */
    window.statisticTraceMonthing = function() {
        var obj = $dp.cal.newdate;
        window.initContent(obj, true);
    };
    window.statisticTraceYearing = function() {
        var obj = $dp.cal.newdate;
        window.initContent(obj, true);
    };
    /**
     * 情报end
     */

    /**
     * 渠道委托begin
     */
    window.statisticEntrustMonthing = function() {
        var obj = $dp.cal.newdate;
        window.initEntrustSort(obj, true);
    };
    window.statisticEntrustYearing = function() {
        var obj = $dp.cal.newdate;
        window.initEntrustSort(obj, true);
    };
    /**
     * 渠道委托end
     */

    /**
     * 车辆清收begin
     */
    window.statisticRecoveryMonthing = function() {
        var obj = $dp.cal.newdate;
        window.initClear(obj, true);
    };
    window.statisticRecoveryYearing = function() {
        var obj = $dp.cal.newdate;
        window.initClear(obj, true);
    };
    /**
     * 车辆清收end
     */

    module.exports = ChannelStatistic;
});