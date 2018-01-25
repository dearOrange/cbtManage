/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function StatisticInfo() {
        var _this = this;
//      _this.form = $('#user-manage-form');

        this.init = function() {
//          this.initContent();
            this.registerEvent();
            $('select').select2({
            	minimumResultsForSearch:Infinity
            });
        };
//      this.initContent = function(isSearch) {
//          var page = new jh.ui.page({
//              data_container: $('#user_manage_container'),
//              page_container: $('#page_container'),
//              method: 'post',
//              url: '/operator/list',
//              contentType: 'application/json',
//              data: jh.utils.formToJson(_this.form),
//              isSearch: isSearch,
//              callback: function(data) {
//                  return jh.utils.template('userManage_content_template', data);
//              }
//          });
//          page.init();
//      };
        
        this.registerEvent = function() {
            // 搜索
//          var myChart = echarts.init(document.getElementById('main'));

//			var option = {
//			    color: ['#3398DB'],
//			    tooltip : {
//			        trigger: 'axis',
//			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
//			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
//			        }
//			    },
//			    grid: {
//			        left: '3%',
//			        right: '4%',
//			        bottom: '3%',
//			        containLabel: true
//			    },
//			    xAxis : [
//			        {
//			            type : 'category',
//			            data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//			            axisTick: {
//			                alignWithLabel: true
//			            }
//			        }
//			    ],
//			    yAxis : [
//			        {
//			            type : 'value'
//			        }
//			    ],
//			    series : [
//			        {
//			            name:'直接访问',
//			            type:'bar',
//			            barWidth: '60%',
//			            data:[10, 52, 200, 334, 390, 330, 220]
//			        }
//			    ]
//			};
//			myChart.setOption(option);
	 
        };
    }
    module.exports = StatisticInfo;
});