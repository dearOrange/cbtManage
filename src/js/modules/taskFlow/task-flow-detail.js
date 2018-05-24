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
        this.addRemark=function(){
            // 添加备注
         $('body').off('click','.addCon').on('click','.addCon',function(){
             var alertContent=jh.utils.template('addRemark', {});
             var list=jh.utils.template('addList', {});
                   jh.utils.alert({
                      title: '添加备注',
                      okValue:'保存',
                     content:alertContent,
                     ok:function(){
                         jh.utils.ajax.send({
                            url:'/tree/remark',
                            data:{treeId:args.id,remark:$('.remark').val(),state:$('.stateName').val()},
                            done:function(res){
                                console.log(1);
                            }
                         })
                     },
                     cancel: true

                   }) 
         })
        };
        // 点击确认
       $('body').off('click','.sureCom').on('click','.sureCom',function(){
             jh.utils.alert({
                     content:"<span style='margin:10x 0;display:block'>是否确认次任务流程已完成？</span>",
                     ok:function(){
                        // console.log(this);
                           // this.style.color="#000";
                           console.log(1);


                     },
                     cancel: true

                   }) 

       })

    }
    module.exports = TaskFlowDetail;
});