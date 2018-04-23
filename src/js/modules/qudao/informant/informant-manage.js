/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function InformantManage() {
        var _this = this;
        _this.form = $('#informant-manage-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };

        this.initContent = function() {
            var page = new jh.ui.page({
                data_container: $('#informant_manage_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/downstreams/channel/informerlist',
                contentType: 'application/json',
                data: jh.utils.formToJson($('#informant-manage-form')),
                callback: function(data) {
                	data.officerClueState = jh.utils.officerClueState;
                  return jh.utils.template('informantManage_content_template', data);
                }
            });
            page.init();
        };

        this.registerEvent = function() {
            $('select').select2({
                minimumResultsForSearch: Infinity
            });

            //认证成为捕头
            $('body').off('click', '.changeOfficer').on('click', '.changeOfficer', function() {
            	var id = $(this).data('id');
                jh.utils.load('/src/modules/qudao/informant/informant-manage-detail', {
                    id: id
                });
            });
            
            //认证成为捕头
            $('body').off('click', '.editOfficer').on('click', '.editOfficer', function() {
              var info = $(this).data('info');
              var rolesName = info.role === 'type_A' ? '兼职线人' : '自有线人';
              var roles = info.role === 'type_A' ? 'type_C' : 'type_A';
              jh.utils.alert({
                title: '成为'+rolesName,
                content: '确定要成为' + rolesName,
                ok: function(){
                  jh.utils.ajax.send({
                    method: 'post',
                    url: '/downstreams/channel/switchRole',
                    data: {
                      downstreamId: info.id,
                      role: roles
                    },
                    done: function(returnData) {
                        jh.utils.alert({
                            content: '您已成为'+rolesName,
                            ok: function() {
                                _this.initContent();
                            }
                        })
                    }
                  });
                }
              })
            });
        };
    }
    module.exports = InformantManage;
});