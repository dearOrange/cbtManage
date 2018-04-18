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
        _this.role = 'type_A';
        _this.name = '发展线人数量';
        _this.flag = true;
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
      
        this.init = function() {
            $('#infoTimeInput,#carRecoveryInput,#entrustTimeInput').val(now.year + '-' + now.month);
            $('.end-input').val(now.year + '-' + now.month + '-' + now.day);
            $('.begin-input').val(now.year + '-' + now.pmonth + '-' + now.day);
            this.initHead();
            this.sectionTable();
            this.initSection();
            window.initContent('2018-01', true);
            this.registerEvent();
            setTimeout(function(){
              jh.utils.changeText($('#breadCrumb'),'首页>业务统计>渠道统计');
            },0)
        };

        //开头数据
        this.initHead = function(isSearch) {
          _this.channelInformerName = [];
          _this.channelInformerCount = [];
          var channelOne = jh.utils.formToJson($('#channel-list-form'));
          if(channelOne.begin == '' && channelOne.end != '' || channelOne.begin != '' && channelOne.end == '') {
            jh.utils.alert({
              content: '请将日期填写完整',
              ok: true
            })
            return false;
          };
          jh.utils.ajax.send({
              method: 'post',
              url: '/statistics/channel/recommendRatio',
              contentType: 'application/json',
              data: channelOne,
              isSearch: isSearch,
              done: function(returnData) {
                $('#showTable').html('');
                var channelOne = returnData.data;
                for (var a = 0; a < channelOne.length; a++) {
                  var channelobj = {};
                  _this.channelInformerName.push(channelOne[a].name + '(渠道名称)');
                  channelobj.value = channelOne[a].countEach;
                  channelobj.name = channelOne[a].name + '(渠道名称)';
                  channelobj.id = channelOne[a].id;
                  _this.channelInformerCount.push(channelobj);
                  if (channelOne.length == 1 && channelobj.value == 0) {
                    _this.flag = false;
                  }else {
                    _this.flag = true;
                  }
                }
                _this.sectionTable();
              }
          });
        };
        
//      清收统计
        this.initSection = function(isSearch) {
          var channelTwo = jh.utils.formToJson($('#channel-info-form'));
          if(channelTwo.begin == '' && channelTwo.end != '' || channelTwo.begin != '' && channelTwo.end == '') {
            jh.utils.alert({
              content: '请将日期填写完整',
              ok: true
            })
            return false;
          }
          var page = new jh.ui.page({
            data_container: $('#channel_statistic_container'),
            page_container: $('#page_clear_container1'),
            method: 'post',
            url: '/statistics/channel/recoveryList',
            contentType: 'application/json',
            jump: false,
            show_page_number: 3,
            data: channelTwo,
            isSearch: isSearch,
            callback: function(data) {
              return jh.utils.template('channel_content_template', data);
            }
          });
          page.init();
        }
        
//      下线列表
        this.initOnline = function(id) {
          var online = jh.utils.formToJson($('#channel-list-form'));
          online.id = id;
          online.role = _this.role;
          var page = new jh.ui.page({
            data_container: $('#channelDown_statistic_container'),
            page_container: $('#page_container'),
            method: 'post',
            url: '/statistics/channel/recommendList',
            contentType: 'application/json',
            data: online,
            isSearch: true,
            callback: function(data) {
              return jh.utils.template('channelDown_content_template', data);
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
                  data:_this.channelInformerName
              },
              calculable : true,
              series : [
                  {
                      name:_this.name,
                      type:'pie',
                      radius : ['50%', '70%'],
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
                      itemStyle : {
                          normal : {
                              label : {
                                  show : _this.flag
                              },
                              labelLine : {
                                  show : _this.flag
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
                      data:_this.channelInformerCount
                  }
              ]
          });
          pieCharts = mainCarNum;

        };
        
//      月度排名
        window.initContent = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数

            var page = new jh.ui.page({
                data_container: $('#rank_statistic_container'),
                page_container: $('#page_container2'),
                method: 'post',
                url: '/statistics/channel/recommendSort',
                jump: false,
                show_page_number: 3,
                contentType: 'application/json',
                data: {
                    role: _this.role,
                    yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('rank_content_template', data);
                }
            });
            page.init();
        };

        this.registerEvent = function() {

            $('select').select2({
                minimumResultsForSearch: Infinity
            });
            //切换状态
            $('body').off('click', '.channelState').on('click', '.channelState', function(event, param) {
              $(this).addClass("active").siblings().removeClass("active");
              $('#state').val($(this).data('value'));
              $('#stateInput').val($(this).data('value'));
              _this.role = $(this).data('value');
              _this.channelInformerName=[];
              _this.channelInformerCount=[];
              $('#showTable').html('');
              window.initContent('2018-01', true);
              if (param && param === 'autoClick') {
      
              } else {
                _this.initHead('tab');
              }
              if(_this.role === 'type_A') {
                _this.name = "发展线人数量";
                $('.developPeople').html('发展线人数月度排名');
              }else {
                _this.name = "发展捕头数量";
                $('.developPeople').html('发展捕头数月度排名');
              }
            })
            pieCharts.on('click', function(p) {
//            console.log(p);//p为点击的地图对象，p.data为传入地图的data数据
              var showOnline = jh.utils.template('channel_statistic_template', {roles: _this.role});
              $('#showTable').html(showOnline);
              _this.initOnline(p.data.id);
            });
            // 搜索
            jh.utils.validator.init({
                id: 'channel-info-form',
                submitHandler: function(form) {
                    _this.initSection(true);
                    return false;
                }
            });
            // 搜索
            jh.utils.validator.init({
              id: 'channel-list-form',
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
                url: '/statistics/downstream/recommendList',
                contentType: 'application/json',
                data: {
                  pageNum: 1,
                  pageSize: 10,
                  params: {
                    id: 259//developId
                  }
                },
                done: function(data) {
                  data.role = _this.role;
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
     * 排名begin
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
     * 排名end
     */

    module.exports = ChannelStatistic;
});