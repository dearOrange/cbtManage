/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ActivityTwoDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        args.mailingAddress = decodeURIComponent(args.mailingAddress);
        this.init = function() {
            this.initContent();
        };
        this.initContent = function() {
          args.stateToString = function(state){
              var str = '';
              switch(state){
                  case '0':
                      str = '新许愿';
                      break;
                  case '1':
                      str = '未达成';
                      break;
                  case '2':
                      str = '已达成';
                      break;
                  case '3':
                      str = '审核未通过';
                      break;
                  case '4':
                      str = '已发放';
                      break;
              }
              return str;
          };
          var informalStr = jh.utils.template('activity_detail_template', {data: args});
          $('.wishDetailContent').html(informalStr);
        };
    }
    module.exports = ActivityTwoDetail;
});