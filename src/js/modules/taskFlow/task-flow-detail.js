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
            this.surecom();
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
      var arr=['issue','cluesifte','repairinfo','scene','lock','allocation','execution','transport','deliver','complete'];
       //任务录入
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
        //违章初筛
        this.taskProgramTwo = function(){
           jh.utils.ajax.send({
            url: '/tree/flowDetail',
            data: {
              treeId: args.id,
              state:'cluesifte'
            },
            done: function(returnData) {
              returnData.switchTime = jh.utils.switchTime;
              var informalStr = jh.utils.template('task_programTwo_template', returnData);
              $('#taskProgram').html(informalStr);
            }
          });  
        }
        //信息修复
        this.taskProgramThree = function(){
           jh.utils.ajax.send({
            url: '/tree/flowDetail',
            data: {
              treeId: args.id,
              state:'repairinfo'
            },
            done: function(returnData) {
              returnData.switchTime = jh.utils.switchTime;
              var informalStr = jh.utils.template('task_programThree_template', returnData);
              $('#taskProgram').html(informalStr);
            }
          });  
        }
        //现场查找
        this.taskProgramFour = function(){
           jh.utils.ajax.send({
            url: '/tree/flowDetail',
            data: {
              treeId: args.id,
              state:'scene'
            },
            done: function(returnData) {
              returnData.switchTime = jh.utils.switchTime;
              var informalStr = jh.utils.template('task_programFour_template', returnData);
              $('#taskProgram').html(informalStr);
            }
          });  
        }
          //任务锁定
        this.taskProgramFive = function(){
           jh.utils.ajax.send({
            url: '/tree/flowDetail',
            data: {
              treeId: args.id,
              state:'lock'
            },
            done: function(returnData) {
              returnData.switchTime = jh.utils.switchTime;
              var informalStr = jh.utils.template('task_programFive_template', returnData);
              $('#taskProgram').html(informalStr);
            }
          });  
        }
         //执行任务分配
        this.taskProgramSix = function(){
           jh.utils.ajax.send({
            url: '/tree/flowDetail',
            data: {
              treeId: args.id,
              state:'allocation'
            },
            done: function(returnData) {
              returnData.switchTime = jh.utils.switchTime;
              var informalStr = jh.utils.template('task_programSix_template', returnData);
              $('#taskProgram').html(informalStr);
            }
          });  
        }
          //执行任务完成
        this.taskProgramSeven = function(){
           jh.utils.ajax.send({
            url: '/tree/flowDetail',
            data: {
              treeId: args.id,
              state:'execution'
            },
            done: function(returnData) {
              returnData.switchTime = jh.utils.switchTime;
              var informalStr = jh.utils.template('task_programSeven_template', returnData);
              $('#taskProgram').html(informalStr);
            }
          });  
        }
            //物流运输
        this.taskProgramEight = function(){
           jh.utils.ajax.send({
            url: '/tree/flowDetail',
            data: {
              treeId: args.id,
              state:'transport'
            },
            done: function(returnData) {
              returnData.switchTime = jh.utils.switchTime;
              var informalStr = jh.utils.template('task_programEight_template', returnData);
              $('#taskProgram').html(informalStr);
            }
          });  
        }
         //交付车辆
        this.taskProgramNine = function(){
           jh.utils.ajax.send({
            url: '/tree/flowDetail',
            data: {
              treeId: args.id,
              state:'deliver'
            },
            done: function(returnData) {
              returnData.switchTime = jh.utils.switchTime;
              var informalStr = jh.utils.template('task_programNine_template', returnData);
              $('#taskProgram').html(informalStr);
            }
          });  
        }

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
                      _this.taskProgramOne();
                    }
                  });
                },
                cancel: true
              }) 
            })
        };
        this.surecom=function(){
           $('body').off('click','.sureCom').on('click','.sureCom',function(){
            var me=$(this);
             var treeState = $(this).data('state');
              jh.utils.ajax.send({
                  url:'/tree/complete',
                  data:{treeId:args.id,state:treeState},
                   done:function(redData){
                    console.log(redData);
                        jh.utils.alert({
                          content:'<span style="margin:20px 0">是否确定此流程已经完成？</span>',
                          ok:function(){
                              $(this).find('button').css({disabled:'disabled'});
                              var index;
                                for(var i=0;i<arr.lenght;i++){
                                   if(arr[i]==treeState){

                                   }
                                }
                          }
                      })
                   }
              });
           })
             
             
        }

    }
    module.exports = TaskFlowDetail;
});