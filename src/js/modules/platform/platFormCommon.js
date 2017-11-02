'use strict';
define(function(require, exports, module) {
    function PlatFormCommon() {
        this.autoCheckAll = function(parent, checkself, checkall) {
            var len = parent.find(checkself).length;
            var count = 0;
            parent.find(checkself).each(function() {
                if ($(this).find('input').prop('checked')) {
                    count++;
                }
            });
            if (count == len) {
                parent.find(checkall).find('input').prop('checked', true);
            } else {
                parent.find(checkall).find('input').prop('checked', false);
            }
        };
        this.checkall = function(parent, checkself, checkall) {
            if (checkall.find('input').prop('checked')) {
                parent.find(checkself).find('input').prop('checked', true);
            } else {
                parent.find(checkself).find('input').prop('checked', false);
            }
        };
        this.checkself = function(parent, checkself, checkall) {
            var count = 0;
            var $checkselfInput = parent.find(checkself).find('input');
            $checkselfInput.each(function() {
                if ($(this).prop('checked')) {
                    count++;
                }
            });
            if (count == $checkselfInput.length) {
                parent.find(checkall).find('input').prop('checked', true);
            } else {
                parent.find(checkall).find('input').prop('checked', false);
            }
        };
        this.tableRefresh = function(table, order) {
            var len = table.find('tbody').find('tr').length;
            for (var i = 0; i < len; i++) {
                table.find('tbody').find(order).eq(i).html(i + 1);
            }
        };
        $.extend({
            //复选框文字联动
            label: function(obj) {
                obj.on('click', 'a', function() {
                    var $ipt = $(this).siblings().children('input');
                    var state = $ipt.prop('checked');
                    $ipt.prop('checked', !state);
                });
            }
        });
    }
    module.exports = PlatFormCommon;
});