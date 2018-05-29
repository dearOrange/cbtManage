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
            this.registerInit();
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
        this.setTime = function(time,obj){
          _this.timeInter = window.setInterval(function(){
            var time_start = new Date(time).getTime();//设定开始时间 
            var time_end = new Date().getTime(); //设定结束时间(等于系统当前时间) 
            //计算时间差 
            var time_distance = time_end - time_start; 
            if(time_distance > 0){ 
            // 天时分秒换算 
            var int_day = Math.floor(time_distance/86400000) 
            time_distance -= int_day * 86400000; 
            
            var int_hour = Math.floor(time_distance/3600000) 
            time_distance -= int_hour * 3600000; 
            
            var int_minute = Math.floor(time_distance/60000) 
            time_distance -= int_minute * 60000; 
            
            var int_second = Math.floor(time_distance/1000) 
            // 时分秒为单数时、前面加零 
            if(int_day < 10){ 
            int_day = "0" + int_day; 
            } 
            if(int_hour < 10){ 
            int_hour = "0" + int_hour; 
            } 
            if(int_minute < 10){ 
            int_minute = "0" + int_minute; 
            } 
            if(int_second < 10){ 
            int_second = "0" + int_second; 
            } 
            // 显示时间 
            $(obj).html(int_day+"天"+int_hour+"时"+int_minute+"分"+int_second+"秒")
            }else{ 
            $(obj).html("00天00时00分00秒")
            }
          },1000)
        }
        this.clearTime = function(){
          clearInterval(_this.timeInter);
        }
       //任务录入
        this.taskProgramOne = function(){
           jh.utils.ajax.send({
            url: '/tree/flowDetail',
            data: {
              treeId: args.id,
              state:'issue'
            },
            done: function(returnData) {
             var createAt=returnData.data.createAt;
              var informalStr = jh.utils.template('task_programOne_template', returnData);
              $('#taskProgram').find('.itemList').eq(0).html(informalStr);
              var height=$('#taskProgram').find('.itemList').eq(0).find('.arrowCon').height();
              $('.arrowItem1').height(height);
              _this.clearTime();
              if(returnData.data.isComplete == 1){
               $('#roam-1').html(returnData.data.consumeTime);
               $('#state-1').html('流转完成');
                _this.taskProgramTwo();
                $('#button-1').css('color',"#ccc");
                $('#button-1').find('i').css('color',"#ccc");
              }else{
                $('#state-1').html('正在进行');
                _this.setTime(createAt,'#roam-1'); 
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
            var createAt=returnData.data.createAt;
              var informalStr = jh.utils.template('task_programTwo_template', returnData);
              $('#taskProgram').find('.itemList').eq(1).html(informalStr);
              $('.arrowItem.arrowItem2').addClass('listItemNum2');
              var list=$('#taskProgram').find('.itemList').eq(1).find('.conList');
              for(var i=0;i<list.length;i++){
                   $(list[i]).find('.headCon').css('background','#DFFFE8');
              }
              var height=$('#taskProgram').find('.itemList').eq(1).find('.arrowCon').height();
              $('.arrowItem2').height(height);
              _this.clearTime();
              if(returnData.data.isComplete == 1){
                $('#state-2').html('流转完成');
                $('#roam-2').html(returnData.data.consumeTime);
                _this.taskProgramThree();
                 $('#button-2').css('color',"#ccc");
                $('#button-2').find('i').css('color',"#ccc");
              }else{
                $('#state-2').html('正在进行');
                _this.setTime(createAt,'#roam-2');
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
               var createAt=returnData.data.createAt;
              var informalStr = jh.utils.template('task_programThree_template', returnData);
              $('#taskProgram').find('.itemList').eq(2).html(informalStr);
               $('.arrowItem.arrowItem3').addClass('listItemNum3');
              var list=$('#taskProgram').find('.itemList').eq(2).find('.conList');
              for(var i=0;i<list.length;i++){
                   $(list[i]).find('.headCon').css('background','#C9FFD8');
              }
               var height=$('#taskProgram').find('.itemList').eq(2).find('.arrowCon').height();
              $('.arrowItem3').height(height);
              _this.clearTime();
              if(returnData.data.isComplete == 1){
                $('#state-3').html('流转完成');
                $('#roam-3').html(returnData.data.consumeTime);
                _this.taskProgramFour();
                 $('#button-3').css('color',"#ccc");
                $('#button-3').find('i').css('color',"#ccc");
              }else{
                $('#state-3').html('正在进行');
                _this.setTime(createAt,'#roam-3'); 
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
               var createAt=returnData.data.createAt;
              var informalStr1 = jh.utils.template('task_programFour_template', returnData);
              $('#taskProgram').find('.itemList').eq(3).html(informalStr1);
              $('.arrowItem.arrowItem4').addClass('listItemNum4');
              var list=$('#taskProgram').find('.itemList').eq(3).find('.conList');
              for(var i=0;i<list.length;i++){
                   $(list[i]).find('.headCon').css('background','#BCFFCF');
              }
              var height=$('#taskProgram').find('.itemList').eq(3).find('.arrowCon').height();
              $('.arrowItem4').height(height);
              _this.clearTime();
              if(returnData.data.isComplete == 1){
                  $('#state-4').html('流转完成');
                  $('#roam-4').html(returnData.data.consumeTime);
                _this.taskProgramFive();
                 $('#button-4').css('color',"#ccc");
                 $('#button-4').find('i').css('color',"#ccc");
              }else{
                $('#state-4').html('正在进行');
                _this.setTime(createAt,'#roam-4'); 
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
               var createAt=returnData.data.createAt;
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
              _this.clearTime();
              if(returnData.data.isComplete == 1){
                  $('#state-5').html('流转完成');
                 $('#roam-5').html(returnData.data.consumeTime);
                _this.taskProgramSix();
                $('#button-5').css('color',"#ccc");
                $('#button-5').find('i').css('color',"#ccc");
              }else{
                $('#state-5').html('正在进行');
                _this.setTime(createAt,'#roam-5'); 
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
               var createAt=returnData.data.createAt;
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
              _this.clearTime();
              if(returnData.data.isComplete == 1){
                  $('#state-6').html('流转完成');
                $('#roam-6').html(returnData.data.consumeTime);
                _this.taskProgramSeven();
                 $('#button-6').css('color',"#ccc");
                $('#button-6').find('i').css('color',"#ccc");
              
              }else{
                $('#state-6').html('正在进行');
                _this.setTime(createAt,'#roam-6'); 
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
              var createAt=returnData.data.createAt;
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
              _this.clearTime();
             if(returnData.data.isComplete == 1){
                $('#state-7').html('流转完成');
                $('#roam-7').html(returnData.data.consumeTime);
                _this.taskProgramEight(); 
                 $('#button-7').css('color',"#ccc");
                $('#button-7').find('i').css('color',"#ccc");             
              }else{
                $('#state-7').html('正在进行');
                _this.setTime(createAt,'#roam-7'); 
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
            var createAt=returnData.data.createAt;
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
              _this.clearTime();
              if(returnData.data.isComplete == 1){
                  $('#state-8').html('流转完成');
                  $('#roam-8').html(returnData.data.consumeTime);
                 _this.taskProgramNine();
                  $('#button-8').css('color',"#ccc");
                $('#button-8').find('i').css('color',"#ccc");
              }else{
                $('#state-8').html('正在进行');
                _this.setTime(createAt,'#roam-8'); 
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
              var createAt=returnData.data.createAt;
              var informalStr = jh.utils.template('task_programNine_template', returnData);
              $('#taskProgram').find('.itemList').eq(8).html(informalStr);
              var list=$('#taskProgram').find('.itemList').eq(8).find('.conList');
              for(var i=0;i<list.length;i++){
                   $(list[i]).find('.headCon').css('background','#FF9090');
              }
              $('.arrowItem.arrowItem9').addClass('listItemNum9');
               var height=$('#taskProgram').find('.itemList').eq(8).find('.arrowCon').height();
              $('.arrowItem9').height(height);
              _this.clearTime();
             if(returnData.data.isComplete == 1){
              $('#state-9').html('流转完成');
              $('#roam-9').html(returnData.data.consumeTime);
              $('#comTip').css('display','block');
              $('#comTipTime').html(returnData.data.completeAt);
               $('#button-9').css('color',"#ccc");
                $('#button-9').find('i').css('color',"#ccc");
              }else{
                $('#state-9').html('正在进行');
                _this.setTime(createAt,'#roam-9'); 
              }
            }
          });  
        }
        this.registerInit = function(){
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
         //确认完成
         var flag=true;
           $('body').off('click','.sureCom').on('click','.sureCom',function(){
            var me=$(this);
             var treeState = $(this).data('state');
             if(flag){
              jh.utils.alert({
                  content:'<span style="margin:20px 0">是否确定此流程已经完成？</span>',
                  ok:function(){
                 jh.utils.ajax.send({
                  url:'/tree/complete', 
                  data:{treeId:args.id,state:treeState},
                   done:function(redData){
                     if(treeState=="issue"){
                       _this.taskProgramTwo();
                       _this.taskProgramOne();
                        flag=false;
                     }else if(treeState=="cluesifte"){
                       _this.taskProgramTwo();
                          _this.taskProgramThree();
                     }else if(treeState=="repairinfo"){
                       _this.taskProgramThree();
                        _this.taskProgramFour();
                     }else if(treeState=="scene"){
                       _this.taskProgramFour();
                        _this.taskProgramFive();
                     }else if(treeState=="lock"){
                       _this.taskProgramFive();
                        _this.taskProgramSix();
                     }else if(treeState=="allocation"){
                       _this.taskProgramSix();
                        _this.taskProgramSeven();
                     }else if(treeState=="execution"){
                       _this.taskProgramSeven();
                        _this.taskProgramEight();
                     }else if(treeState=="transport"){
                       _this.taskProgramEight();
                        _this.taskProgramNine();
                     }else if(treeState=="deliver"){
                        _this.taskProgramNine();
                      }
                   }
               });  
             },
             cancel: true

            })
              
           }
             
           })
        }    

    }
    module.exports = TaskFlowDetail;
});