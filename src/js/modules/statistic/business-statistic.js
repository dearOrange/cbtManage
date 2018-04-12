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
        var pieCharts = null;
        var date = new Date();
        var now = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
        now.month = now.month.toString().length === 1 ? '0' + now.month : now.month; //月份两位数
        now.day = now.day.toString().length === 1 ? '0' + now.day : now.day; //日期两位数
//      扇形
        _this.businessName = [];
        _this.businessCount = [];
        
        
        _this.traceValue = '';
        _this.traceName = '';
        _this.traceId = '';
        
        this.init = function() {
            $('#infoTimeInput,#carRecoveryInput,#entrustTimeInput').val(now.year + '-' + now.month);
            $('#begin,#end').val(now.year + '-' + now.month + '-' + now.day);
            this.initHead();
            this.sectionTable();
            this.initSection();
//          window.initEntrustSort('2018-01-13', true);
            window.initContent('2018-01', true);
            window.initClear('2018-01', true);
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
                var businessCount = returnData.data;
                for (var a = 0; a < businessCount.length; a++) {
                  var businessobj = {};
                  _this.businessName.push(businessCount[a].name);
                  businessobj.value = businessCount[a].countEach;
                  businessobj.name = businessCount[a].name;
                  businessobj.id = businessCount[a].id;
                  _this.businessCount.push(businessobj);
                }
                _this.sectionTable();
              }
          });
//      商务发展债权方统计  
//      window.initEntrustSort = function(obj, isSearch) {
//        obj = typeof obj !== 'object' ? { y: now.year, M: now.month, d: now.day } : obj; //是否为第一次查询
//        obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数
//        obj.d = obj.d.toString().length === 1 ? '0' + obj.d : obj.d; //日期两位数
//          
//        jh.utils.ajax.send({
//            method: 'post',
//            url: '/statistics/business/recommendRatio',
//            contentType: 'application/json',
//            data: {
//              begin: obj.y + '-' + obj.M + '-' + obj.d,
//              end: obj.y + '-' + obj.M + '-' + obj.d
//            },
//            isSearch: isSearch,
//            done: function(returnData) {
//              var businessCount = returnData.data;
//              for (var a = 0; a < businessCount.length; a++) {
//                var businessobj = {};
//                _this.businessName.push(businessCount[a].name);
//                businessobj.value = businessCount[a].countEach;
//                businessobj.name = businessCount[a].name;
//                businessobj.id = businessCount[a].id;
//                _this.businessCount.push(businessobj);
//              }
//              _this.sectionTable();
//            }
//        });
//      };
          
//        商务经理
          jh.utils.ajax.send({
            url: '/operator/getAllBusiness',
            done: function(returnData) {
              var operateData = returnData.data;
              var operateStr = "";
              for (var i = 0; i < operateData.length; i++) {
                  operateStr += '<option value="' + operateData[i].name + '">' + operateData[i].name + '</option>';
              }
              $('#operateSta').append(operateStr);
              jh.utils.assignSelect('operateSta');
            }
          });
        };
//      商务列表
        this.initSection = function(isSearch) {
          var businessTwo = jh.utils.formToJson($('#business-list-form'));
          var page = new jh.ui.page({
            data_container: $('#business_list_container'),
            page_container: $('#page_clear_container'),
            method: 'post',
            url: '/statistics/business/recommendTaskList',
            contentType: 'application/json',
            data: businessTwo,
            isSearch: isSearch,
            callback: function(data) {
              return jh.utils.template('business_content_template', data);
            }
          });
          page.init();
        }
//      下线列表
        this.initOnline = function(id) {
          var online = jh.utils.formToJson($('#business-info-form'));
          online.id = id;
          var page = new jh.ui.page({
            data_container: $('#business_statistic_container'),
            page_container: $('#page_container'),
            method: 'post',
            url: '/statistics/business/recommendTaskList',
            contentType: 'application/json',
            data: online,
            callback: function(data) {
              return jh.utils.template('business_statistic_template', data);
            }
          });
          page.init();
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
                  data: _this.businessName
              },
              
              calculable : true,
              series : [
                  {
                      name:'访问来源',
                      type:'pie',
                      radius : '55%',
                      center: ['50%', '60%'],
                      data: _this.businessCount
                  }
              ]
          });
          pieCharts = mainCarNum;

        };
//      月度排名2
        window.initContent = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数

            var page = new jh.ui.page({
                data_container: $('#monthTwo_statistic_container'),
                page_container: $('#page_container_two'),
                method: 'post',
                url: '/statistics/business/recommendTaskSort',
                jump: false,
                show_page_number: 3,
                contentType: 'application/json',
                data: {
                    yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                callback: function(data) {
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
                page_container: $('#page_container_one'),
                method: 'post',
                url: '/statistics/business/recommendSort',
                contentType: 'application/json',
                data: {
                  yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                jump: false,
                show_page_number: 3,
                callback: function(data) {
                    return jh.utils.template('monthOne_content_template', data);
                }
            });
            page.init();
        };

        this.registerEvent = function() {
            
            pieCharts.on('click', function(p) {
//            console.log(p);//p为点击的地图对象，p.data为传入地图的data数据
              var showOnline = jh.utils.template('business_statistic_template');
              $('#showTable').html(showOnline);
              _this.initOnline(p.data.id);
            });
            
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
            
//          查看下线数
            $('body').off('click', '.find_develop_num').on('click', '.find_develop_num', function() {
              var developId = $(this).data('id');
              jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/upstream/recommendList',
                contentType: 'application/json',
                data: {
                  pageNum: 1,
                  pageSize: 10,
                  params: {
                    id: developId
                  }
                },
                done: function(data) {
                  var developNum = jh.utils.template('develop_statistic_template', data);
                  jh.utils.alert({
                    title: '发展下线',
                    content: developNum,
                    ok: true
                  });
                }
              })
            })
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
    /**
     * 线索统计begin
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
     * 线索统计end
     */
     
    module.exports = BusinessStatistic;
});