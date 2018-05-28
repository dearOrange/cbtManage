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
        var brr=[];
        var args = jh.utils.getURLValue().args;
        this.init = function() {
            this.initContent();
            this.taskProgramOne();
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
              $('#taskProgram').find('.itemList').eq(0).html(informalStr);
              var height=$('#taskProgram').find('.itemList').eq(0).find('.arrowCon').height();
              $('.arrowItem1').height(height);
              $('#roam-1').html(_this.switchTime(returnData.data.createAt));
              if(returnData.data.isComplete == 1){
                _this.taskProgramTwo();
                $('#roam-1').html(returnData.data.consumeTime);
              }
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
              $('#taskProgram').find('.itemList').eq(1).html(informalStr);
              $('.arrowItem.arrowItem2').addClass('listItemNum2');
              var list=$('#taskProgram').find('.itemList').eq(1).find('.conList');
              for(var i=0;i<list.length;i++){
                   $(list[i]).find('.headCon').css('background','#DFFFE8');
              }
              var height=$('#taskProgram').find('.itemList').eq(1).find('.arrowCon').height();
              $('.arrowItem2').height(height);
               
              if(returnData.data.isComplete == 1){
                _this.taskProgramThree();
                 $('#roam-2').html(returnData.data.consumeTime);
              }
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
              $('#taskProgram').find('.itemList').eq(2).html(informalStr);
               $('.arrowItem.arrowItem3').addClass('listItemNum3');
              var list=$('#taskProgram').find('.itemList').eq(2).find('.conList');
              for(var i=0;i<list.length;i++){
                   $(list[i]).find('.headCon').css('background','#C9FFD8');
              }
               var height=$('#taskProgram').find('.itemList').eq(2).find('.arrowCon').height();
              $('.arrowItem3').height(height);
                $('#roam-3').html(_this.switchTime(returnData.data.createAt));
              if(returnData.data.isComplete == 1){
                _this.taskProgramFour();
                  $('#roam-3').html(returnData.data.consumeTime);
              }
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
              var informalStr1 = jh.utils.template('task_programFour_template', returnData);
              $('#taskProgram').find('.itemList').eq(3).html(informalStr1);
              $('.arrowItem.arrowItem4').addClass('listItemNum4');
              var list=$('#taskProgram').find('.itemList').eq(3).find('.conList');
              for(var i=0;i<list.length;i++){
                   $(list[i]).find('.headCon').css('background','#BCFFCF');
              }
                var height=$('#taskProgram').find('.itemList').eq(3).find('.arrowCon').height();
              $('.arrowItem4').height(height);
               $('#roam-4').html(_this.switchTime(returnData.data.createAt));
              if(returnData.data.isComplete == 1){
                _this.taskProgramFive();
                 $('#roam-4').html(returnData.data.consumeTime);
              }
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
              $('#taskProgram').find('.itemList').eq(4).html(informalStr);
               // $('.headCon').eq(4).css('background','#96FFB3');
               var list=$('#taskProgram').find('.itemList').eq(4).find('.conList');
              for(var i=0;i<list.length;i++){
                   $(list[i]).find('.headCon').css('background','#96FFB3');
              }
               $('.arrowItem.arrowItem5').addClass('listItemNum5');
               var height=$('#taskProgram').find('.itemList').eq(4).find('.arrowCon').height();
              $('.arrowItem5').height(height);
                $('#roam-5').html(_this.switchTime(returnData.data.createAt));
              if(returnData.data.isComplete == 1){
                _this.taskProgramSix();
                  $('#roam-5').html(returnData.data.consumeTime);
              }
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
              $('#taskProgram').find('.itemList').eq(5).html(informalStr);
              // $('.headCon').eq(5).css('background','#FEFFBA');
                var list=$('#taskProgram').find('.itemList').eq(5).find('.conList');
              for(var i=0;i<list.length;i++){
                   $(list[i]).find('.headCon').css('background','#FEFFBA');
              }
              $('.arrowItem.arrowItem6').addClass('listItemNum6');
                var height=$('#taskProgram').find('.itemList').eq(5).find('.arrowCon').height();
              $('.arrowItem6').height(height);
               $('#roam-6').html(_this.switchTime(returnData.data.createAt));
              if(returnData.data.isComplete == 1){
                _this.taskProgramSeven();
              $('#roam-6').html(returnData.data.consumeTime);
              }
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
             $('#taskProgram').find('.itemList').eq(6).html(informalStr);
             // $('.headCon').eq(6).css('background','#FFED86');
            var list=$('#taskProgram').find('.itemList').eq(6).find('.conList');
              for(var i=0;i<list.length;i++){
                   $(list[i]).find('.headCon').css('background','#FFED86');
              }
             $('.arrowItem.arrowItem7').addClass('listItemNum7');
              var height=$('#taskProgram').find('.itemList').eq(6).find('.arrowCon').height();
              $('.arrowItem7').height(height);
              $('#roam-7').html(_this.switchTime(returnData.data.createAt));
             if(returnData.data.isComplete == 1){
                _this.taskProgramEight();
                 $('#roam-7').html(returnData.data.consumeTime);
              }
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
              $('#taskProgram').find('.itemList').eq(7).html(informalStr);
               // $('.headCon').eq(7).css('background','#FFB8B8');
               var list=$('#taskProgram').find('.itemList').eq(7).find('.conList');
              for(var i=0;i<list.length;i++){
                   $(list[i]).find('.headCon').css('background','#FFB8B8');
              }
              $('.arrowItem.arrowItem8').addClass('listItemNum8');
               var height=$('#taskProgram').find('.itemList').eq(7).find('.arrowCon').height();
              $('.arrowItem8').height(height);
               $('#roam-8').html(_this.switchTime(returnData.data.createAt));
              if(returnData.data.isComplete == 1){
                _this.taskProgramNine();
                $('#roam-8').html(returnData.data.consumeTime);
              }
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
             $('#taskProgram').find('.itemList').eq(8).html(informalStr);
             var list=$('#taskProgram').find('.itemList').eq(8).find('.conList');
              for(var i=0;i<list.length;i++){
                   $(list[i]).find('.headCon').css('background','#FF9090');
              }
              $('.arrowItem.arrowItem9').addClass('listItemNum9');
               var height=$('#taskProgram').find('.itemList').eq(8).find('.arrowCon').height();
              $('.arrowItem9').height(height);
              $('#roam-9').html(_this.switchTime(returnData.data.createAt));
             if(returnData.data.isComplete == 1){
              $('#roam-9').html(returnData.data.consumeTime);
              }
            }
          });  
        }

        this.addRemark=function(){
            // 添加备注
            $('body').off('click','.addCon').on('click','.addCon',function(){
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
                       if(treeState=="issue"){
                           _this.taskProgramOne();
                       }else if(treeState=="cluesifte"){
                            _this.taskProgramTwo();
                       }else if(treeState=="repairinfo"){
                          _this.taskProgramThree();
                       }else if(treeState=="scene"){
                          _this.taskProgramFour();
                       }else if(treeState=="lock"){
                          _this.taskProgramFive();
                       }else if(treeState=="allocation"){
                          _this.taskProgramSix();
                       }else if(treeState=="execution"){
                          _this.taskProgramSeven();
                       }else if(treeState=="transport"){
                          _this.taskProgramEight();
                       }else if(treeState=="deliver"){
                          _this.taskProgramNine();
                       }
                    }
                  });
                },
                cancel: true
              }) 
            })
        };
        //确认完成
        this.surecom=function(){
           $('body').off('click','.sureCom').on('click','.sureCom',function(){
            var me=$(this);
             var treeState = $(this).data('state');
              jh.utils.ajax.send({
                  url:'/tree/complete',
                  data:{treeId:args.id,state:treeState},
                   done:function(redData){
                    $(this).find('button').css('disabled',"disabled");
                        jh.utils.alert({
                          content:'<span style="margin:20px 0">是否确定此流程已经完成？</span>',
                          ok:function(){
                       if(treeState=="issue"){
                           _this.taskProgramTwo();
                       }else if(treeState=="cluesifte"){
                            _this.taskProgramThree();
                       }else if(treeState=="repairinfo"){
                          _this.taskProgramFour();
                       }else if(treeState=="scene"){
                          _this.taskProgramFive();
                       }else if(treeState=="lock"){
                          _this.taskProgramSix();
                       }else if(treeState=="allocation"){
                          _this.taskProgramSeven();
                       }else if(treeState=="execution"){
                          _this.taskProgramEight();
                       }else if(treeState=="transport"){
                          _this.taskProgramNine();
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