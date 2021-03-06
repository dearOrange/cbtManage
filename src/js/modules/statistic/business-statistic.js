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
            pmonth: date.getMonth(),
            day: date.getDate()
        };
        now.month = now.month.toString().length === 1 ? '0' + now.month : now.month; //月份两位数
        now.day = now.day.toString().length === 1 ? '0' + now.day : now.day; //日期两位数
     
        _this.traceValue = '';
        _this.traceName = '';
        _this.traceId = '';
        
        this.init = function() {
          $('#infoTimeInput,#carRecoveryInput,#entrustTimeInput').val(now.year + '-' + now.month);
          $('.end-input').val(now.year + '-' + now.month + '-' + now.day);
          $('.begin-input').val(now.year + '-' + now.pmonth + '-' + now.day);
          this.initHead();
          this.sectionTable();
          this.initSection();
          window.initContent('2018-01', true);
          window.initClear('2018-01', true);
          this.registerEvent();
          setTimeout(function(){
            jh.utils.changeText($('#breadCrumb'),'首页 > 业务统计 > 商务统计');
          },0)
        };
        
        //      商务发展债权方统计  
        this.initHead = function(isSearch) {
          var businessOne = jh.utils.formToJson($('#business-info-form'));
          _this.businessName = [];
          _this.businessCount = [];
          _this.flag = true;
          if(businessOne.begin == '' && businessOne.end != '' || businessOne.begin != '' && businessOne.end == '') {
            jh.utils.alert({
              content: '请将日期填写完整',
              ok: true
            })
            return false;
          }
          jh.utils.ajax.send({
              method: 'post',
              url: '/statistics/business/recommendRatio',
              contentType: 'application/json',
              isSearch: isSearch,
              data: businessOne,
              done: function(returnData) {
                $('#showTable').html('');
                var businessCount = returnData.data;
                for (var a = 0; a < businessCount.length; a++) {
                  var businessobj = {};
                  _this.businessName.push(businessCount[a].name + ' （商务名称）');
                  businessobj.value = businessCount[a].countEach;
                  _this.value = businessCount[a].countEach;
                  businessobj.name = businessCount[a].name + ' （商务名称）';
                  businessobj.id = businessCount[a].id;
                  _this.businessCount.push(businessobj);
                  if (businessCount.length == 1 && businessobj.value == 0) {
                    _this.flag = false;
                  }else {
                    _this.flag = true;
                  }
                }
                _this.sectionTable();
              }
          });
          
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
          if(businessTwo.begin == '' && businessTwo.end != '' || businessTwo.begin != '' && businessTwo.end == '') {
            jh.utils.alert({
              content: '请将日期填写完整',
              ok: true
            })
            return false;
          }
          var page = new jh.ui.page({
            data_container: $('#business_list_container'),
            page_container: $('#page_business_container'),
            method: 'post',
            url: '/statistics/business/recommendTaskList',
            contentType: 'application/json',
            data: businessTwo,
            isSearch: isSearch,
            jump: false,
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
            url: '/statistics/business/recommendList',
            contentType: 'application/json',
            data: online,
            isSearch: true,
            callback: function(data) {
              return jh.utils.template('businessTr_statistic_template', data);
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
                selectedMode: false,
                data: _this.businessName
              },
              
              calculable : true,
              series : [
                  {
                    name:'发展债权方数量：' + _this.value,
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    stillShowZeroSum: _this.flag,
                    itemStyle : {
                      normal : {
                        label : {
                            show : _this.flag
                        },
                        labelLine : {
                            show : _this.flag
                        }
                      }
                    },
                    data: _this.businessCount
                  }
              ],
              noDataLoadingOption: {
                text: '暂无数据'
              }
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
                contentType: 'application/json',
                data: {
                    yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                jump: false,
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
            // 搜索
            jh.utils.validator.init({
                id: 'business-info-form',
                submitHandler: function(form) {
                    _this.initHead(true);
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
    module.exports = BusinessStatistic;
});