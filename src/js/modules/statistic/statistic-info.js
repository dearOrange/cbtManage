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
        
        this.init = function() {
          this.initHead();
        };

        //开头数据
        this.initHead = function() {
            $('.taskInfoOne').click(function() {
              jh.utils.load('/src/modules/statistic/task-statistic', {});
            });
            $('.taskInfoTwo').click(function() {
              jh.utils.load('/src/modules/statistic/clue-statistic', {});
            });
            $('.taskInfoThree').click(function() {
              jh.utils.load('/src/modules/statistic/channel-statistic', {});
            });
            $('.taskInfoFour').click(function() {
              jh.utils.load('/src/modules/statistic/business-statistic', {});
            });
            $('.taskInfoFive').click(function() {
              jh.utils.load('/src/modules/statistic/informer-statistic', {});
            });
            $('.taskInfoSix').click(function() {
              jh.utils.load('/src/modules/statistic/hunter-statistic', {});
            })
        };
    }
    module.exports = StatisticInfo;
});