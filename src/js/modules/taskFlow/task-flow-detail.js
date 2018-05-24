/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function TaskFlowDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        this.init = function() {
            this.initContent();
            this.taskProgramOne();
//          this.taskProgramTwo();
            this.addRemark();
        };
        this.initContent = function(){
            jh.utils.ajax.send({
                url: '/tree/treeDetail',
                data: {
                    treeId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    var informalStr = jh.utils.template('task_flow_detail_template', returnData);
                    $('.flowDetailContent').html(informalStr);
                }
            });
        };
        this.taskProgramOne = function(){
          jh.utils.ajax.send({
            url: '/tree/flowDetail',
            data: {
              treeId: args.id,
              state:'issue'
            },
            done: function(returnData) {
              returnData.switchTime = jh.utils.switchTime;
              var informalStr = jh.utils.template('task_programOne_template', returnData);
              $('#taskProgram').html(informalStr);
            }
          });
        }
//      this.taskProgramTwo = function(){
//        jh.utils.ajax.send({
//          url: '/tree/flowDetail',
//          data: {
//            treeId: args.id,
//            state:'cluesifte'
//          },
//          done: function(returnData) {
//            returnData.switchTime = jh.utils.switchTime;
//            var informalStr = jh.utils.template('task_programOne_template', returnData);
//            $('#taskProgram').html(informalStr);
//          }
//        });
//      };
        this.addRemark=function(){
            // 添加备注
            $('body').off('click','.addCon').on('click','.addCon',function(){
              var index=$(this).index();
              var treeState = $(this).data('state');
              var alertContent=jh.utils.template('addRemark_template', {});
              jh.utils.alert({
                title: '添加备注',
                okValue:'保存',
                content:alertContent,
                ok:function(){
                  var remarkData = jh.utils.formToJson($('#remark-content-form'));
                  remarkData.treeId = args.id;
                  remarkData.state = treeState;
                  jh.utils.ajax.send({
                    method:'post',
                    url: '/tree/remark',
                    data: remarkData,
                    done: function(returnData) {
                      _this.initContent();
                    }
                  });
                },
                cancel: true
              }) 
            })
        };

    }
    module.exports = TaskFlowDetail;
});