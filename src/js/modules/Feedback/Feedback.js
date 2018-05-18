/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function Feedback() {
    var _this = this;
    _this.form = $('#Feedback-list-form');
    var searchType = 'loaner';
    this.init = function() {
      this.initContent();
      this.registerEvent();
    };
    this.initContent = function(isSearch) {
      var page = new jh.ui.page({
        data_container: $('#Feedback_list_container'),
        page_container: $('#page_container'),
        form_container: _this.form,
        method: 'post',
        url: '/workorder/list',
        contentType: 'application/json',
        data: jh.utils.formToJson(_this.form),
        isSearch: isSearch,
        callback: function(data) {
          return jh.utils.template('Feedback-list-template', data);
        }
      });
      page.init();
    };
    this.registerEvent = function() {
           
    };
  }
  module.exports = Feedback;
});