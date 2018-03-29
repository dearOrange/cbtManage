/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function HunterStatistic() {
        var _this = this;
        var date = new Date();
        var now = {
            year: date.getFullYear(),
            month: date.getMonth() + 1
        };
        now.month = now.month.toString().length === 1 ? '0' + now.month : now.month; //月份两位数

        _this.traceMonths = [];
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
            jh.utils.ajax.send({
                url: '/statistics/general',
                done: function(returnData) {
//                  var upstreamTrendList = returnData.data.upstream.trendList;
//                  var traceTrendList = returnData.data.trace.trendList;
//                  var downstreamTrendList = returnData.data.downstream.trendList;
//                  for (var a = 0; a < upstreamTrendList.length; a++) {
//                      _this.upstreamTrendMonths.push(upstreamTrendList[a].months);
//                      _this.upstreamTrendCount.push(upstreamTrendList[a].count);
//                  }
//                  for (var b = 0; b < traceTrendList.length; b++) {
//                      _this.traceTrendMonths.push(traceTrendList[b].months);
//                      _this.traceTrendCount.push(traceTrendList[b].count);
//                  }
//                  for (var c = 0; c < downstreamTrendList.length; c++) {
//                      _this.downstreamTrendMonths.push(downstreamTrendList[c].months);
//                      _this.downstreamTrendCount.push(downstreamTrendList[c].count);
//                  }
                    var dataFirst = jh.utils.template('statistic_first_template', returnData.data);
                    $('#clue-echarts-list').html(dataFirst);
                    
                }
            });
        };
        this.initSection = function() {
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/traceTrend',
                contentType: 'application/json',
                data: {
                    tabName: 'trace',
                    limit: '12'
                },
                done: function(returnData) {
                    var trace = returnData.data.trace;
                    for (var i = 0; i < trace.length; i++) {
                        _this.traceMonths.push(trace[i].months);
                        _this.traceCount.push(trace[i].count);
                    }
                    _this.sectionTable();
                }
            });
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/recoveryTrend',
                contentType: 'application/json',
                data: {
                    tabName: 'task',
                    limit: '12'
                },
                done: function(returnData) {
                    var carRecovery = returnData.data.task;
                    for (var j = 0; j < carRecovery.length; j++) {
                        _this.carRecoveryMonths.push(carRecovery[j].months);
                        _this.carRecoveryCount.push(carRecovery[j].count);
                    }
                    _this.sectionTable();
                }
            });
        }
        this.sectionTable = function() {
            var mainInformate = echarts.init(document.getElementById('mainInformate'));
            var mainCarNum = echarts.init(document.getElementById('mainCarNum'));
            var mainBarNum = echarts.init(document.getElementById('mainBarNum'));
            mainInformate.setOption({
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['合规线索','不合规线索']
                },
                calculable: true,
                xAxis: [
                    {
                        type : 'category',
                        data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                    }
                ],
                yAxis: [
                    {
                        type : 'value'
                    }
                ],
                series: [
                    {
                        name:'合规线索',
                        type:'bar',
                        data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        }
                    },
                    {
                        name:'不合规线索',
                        type:'bar',
                        data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                        markPoint : {
                            data : [
                                {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
                                {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                            ]
                        }
                    }
                ]
            });
            mainBarNum.setOption({
                title : {
                    text: '2011全国GDP（亿元）',
                    subtext: '数据来自国家统计局'
                },
                tooltip : {
                    trigger: 'item'
                },
            //  legend: {
            //      x:'right',
            //      selectedMode:false,
            //      data:['北京','上海','广东']
            //  },
                dataRange: {
                    orient: 'horizontal',
                    min: 0,
                    max: 55000,
                    text:['高','低'],           // 文本，默认为数值文本
                    splitNumber:0
                },
            //  toolbox: {
            //      show : true,
            //      orient: 'vertical',
            //      x:'right',
            //      y:'center',
            //      feature : {
            //          mark : {show: true},
            //          dataView : {show: true, readOnly: false}
            //      }
            //  },
                series : [
                    {
                        name: '2011全国GDP分布',
                        type: 'map',
                        mapType: 'china',
                        mapLocation: {
                            x: 'left'
                        },
                        selectedMode : 'multiple',
                        itemStyle:{
                            normal:{label:{show:true}},
                            emphasis:{label:{show:true}}
                        },
                        data:[
                            {name:'西藏', value:605.83},
                            {name:'青海', value:1670.44},
                            {name:'宁夏', value:2102.21},
                            {name:'海南', value:2522.66},
                            {name:'甘肃', value:5020.37},
                            {name:'贵州', value:5701.84},
                            {name:'新疆', value:6610.05},
                            {name:'云南', value:8893.12},
                            {name:'重庆', value:10011.37},
                            {name:'吉林', value:10568.83},
                            {name:'山西', value:11237.55},
                            {name:'天津', value:11307.28},
                            {name:'江西', value:11702.82},
                            {name:'广西', value:11720.87},
                            {name:'陕西', value:12512.3},
                            {name:'黑龙江', value:12582},
                            {name:'内蒙古', value:14359.88},
                            {name:'安徽', value:15300.65},
                            {name:'北京', value:16251.93, selected:true},
                            {name:'福建', value:17560.18},
                            {name:'上海', value:19195.69, selected:true},
                            {name:'湖北', value:19632.26},
                            {name:'湖南', value:19669.56},
                            {name:'四川', value:21026.68},
                            {name:'辽宁', value:22226.7},
                            {name:'河北', value:24515.76},
                            {name:'河南', value:26931.03},
                            {name:'浙江', value:32318.85},
                            {name:'山东', value:45361.85},
                            {name:'江苏', value:49110.27},
                            {name:'广东', value:53210.28, selected:true}
                        ]
                    },
            //      {
            //          name:'2011全国GDP对比',
            //          type:'pie',
            //          roseType : 'area',
            //          tooltip: {
            //              trigger: 'item',
            //              formatter: "{a} <br/>{b} : {c} ({d}%)"
            //          },
            //          center: [document.getElementById('mainBarNum').offsetWidth - 250, 225],
            //          radius: [30, 120],
            //          data:[
            //              {name: '北京', value: 16251.93},
            //              {name: '上海', value: 19195.69},
            //              {name: '广东', value: 53210.28}
            //          ]
            //      }
                ],
                animation: false
            }, true);
            mainCarNum.setOption({
              title : {
                  text: '某站点用户访问来源',
                  subtext: '纯属虚构',
                  x:'center'
              },
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
                      radius : '55%',
                      center: ['50%', '60%'],
                      data:[
                          {value:335, name:'直接访问'},
                          {value:310, name:'邮件营销'},
                          {value:234, name:'联盟广告'},
                          {value:135, name:'视频广告'},
                          {value:1548, name:'搜索引擎'}
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
                    for (var k = 0; k < entrust.length; k++) {
                        _this.countRate = entrust[k].countRate;
                        _this.pieContent(k, _this.countRate);
                    }

                }
            });
        };

        this.registerEvent = function() {

            $('select').select2({
                minimumResultsForSearch: Infinity
            });

        };
//      this.pieContent = function(k, countRate) {
//        radialIndicator('#pie' + k, {
//        showPercentage : false, // option
//        barColor: '#87CEEB',
//          barWidth: 10,
//          initValue: countRate,
//          roundCorner : true,
//          percentage: true
//    });
//    var aa = $('.channelDistance').width() * (k+1);
//    $('.channelInner').width(aa);
//    var cc = $('.channelInfo').width();
//    if(aa > cc) {
//          $('body').off('click', '.preBtn').on('click', '.preBtn', function() {
//            $('.channelInner').animate({marginLeft:"0px"}, 500, function() {
//              $(".channelInner dl").eq(k).prependTo($(".channelInner"));
//              $('.channelInner').css('marginLeft','-240px');
//            });
//          });
//          $('body').off('click', '.nextBtn').on('click', '.nextBtn', function() {
//            $('.channelInner').animate({marginLeft:"-240px"},500, function(){
//              $(".channelInner dl").eq(0).appendTo($(".channelInner"));
//              $('.channelInner').css('marginLeft','0px');
//            })
//          })
//        }
//      };
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

    module.exports = HunterStatistic;
});