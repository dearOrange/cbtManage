/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function BusinessStatistic() {
        var _this = this;
        var date = new Date();
        var now = {
            year: date.getFullYear(),
            month: date.getMonth() + 1
        };
        now.month = now.month.toString().length === 1 ? '0' + now.month : now.month; //月份两位数

        _this.businessName = [];
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
            window.initEntrustSort('2018-01', true);
            this.registerEvent();
        };

        //开头数据
        this.initHead = function() {
          var businessOne = jh.utils.formToJson($('#business-info-form'));
          jh.utils.ajax.send({
              method: 'post',
              url: '/statistics/business/recommendRatio',
              contentType: 'application/json',
              data: businessOne,
              done: function(returnData) {
                var businessOne = returnData.data;
                var businessobj = {};
                for (var a = 0; a < businessOne.length; a++) {
                    businessobj.value = businessOne[a].countEach;
                    businessobj.name = businessOne[a].name;
                    businessobj.id = businessOne[a].id;
                }
                _this.businessName.push(businessobj);
                _this.sectionTable();
              }
          });
        };
        this.initSection = function(isSearch) {
          var businessTwo = jh.utils.formToJson($('#business-list-form'));
          var page = new jh.ui.page({
            data_container: $('#business_statistic_container'),
            page_container: $('#page_container'),
            method: 'post',
            url: '/statistics/business/recommendTaskList',
            contentType: 'application/json',
            data: businessTwo,
            isSearch: isSearch,
            callback: function(data) {
              console.log(data)
              return jh.utils.template('business_content_template', data);
            }
          });
          page.init();
        }
        this.sectionTable = function() {
            
            var mainCarNum = echarts.init(document.getElementById('mainCarNum'));
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
//      月度排名2
        window.initContent = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数

            var page = new jh.ui.page({
                data_container: $('#monthTwo_statistic_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/statistics/business/recommendTaskSort',
                showPageTotal: false,
                jump: false,
                show_page_number: 3,
                contentType: 'application/json',
                data: {
                    pageSize: 5,
                    yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                callback: function(data) {
                  console.log(data);
                  return jh.utils.template('monthTwo_content_template', data);
                }
            });
            page.init();
        };
//      月度排名1
        window.initClear = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数

            var page = new jh.ui.page({
                data_container: $('#monthOne_statistic_container'),
                page_container: $('#page_clear_container'),
                method: 'post',
                url: '/statistics/business/recommendTaskSort',
                contentType: 'application/json',
                data: {
                  pageSize: 5,
                  yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                show_page_number: 3,
                callback: function(data) {
                    return jh.utils.template('monthOne_content_template', data);
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
//                  var entrust = returnData.data;
//                  var noResultBox = $('#entrustNoResultBox');
//                  if (!entrust.length) {
//                      noResultBox.removeClass('hide');
//                      noResultBox.prev().addClass('hide');
//                      return false;
//                  } else {
//                      noResultBox.addClass('hide');
//                      noResultBox.prev().removeClass('hide');
//                  }
//                  var entrustContent = jh.utils.template('entrust_content_template', returnData);
//                  $('#entrustResultBox').html(entrustContent);
                    

                }
            });
        };

        this.registerEvent = function() {

            $('select').select2({
                minimumResultsForSearch: Infinity
            });
            
            // 搜索
            jh.utils.validator.init({
                id: 'business-list-form',
                submitHandler: function(form) {
                    _this.initSection(true);
                    return false;
                }
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

    module.exports = BusinessStatistic;
});