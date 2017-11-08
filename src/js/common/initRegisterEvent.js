/**
 * @authors jiaguishan (http://tammylights.com)
 * @date    2017-04-01 14:54:43
 * @version 1.0
 */
define(function(require, exports, module) {
    function RegisterJQueryEvent() {
        this.init = function() {
            this.registerEvent();
        };

        this.registerEvent = function() {

            jh.utils.ajax.send({
                url: '/qiniu/getToken',
                done:function(returnData){
                    jh.arguments.uploadToken = returnData.data.uploadToken;
                }
            });

            /*菜单点击事件*/
            $('#leftMenu-box').on('click', 'li>a,li>ul>li>a', function() {
                var m = $(this);
                if (m.siblings('ul').length > 0) {
                    /**
                     * 第一层点击处理
                     */
                    var subMenu = m.siblings('ul');
                    var isActive = m.parent().hasClass('active');
                    m.parent().siblings().removeClass('active').children('ul').slideUp('normal');
                    var icon = m.find('i.fr');
                    m.parent().siblings().find('i.icon-top-arrow').removeClass('icon-top-arrow').addClass('icon-bottom-arrow');
                    if (isActive) {
                        m.parent().removeClass('active');
                        subMenu.slideUp('normal').addClass('hide');
                        icon.removeClass('icon-top-arrow');
                        icon.addClass('icon-bottom-arrow');
                    } else {
                        m.parent().addClass('active');
                        subMenu.removeClass('hide').slideDown('normal');
                        icon.removeClass('icon-bottom-arrow');
                        icon.addClass('icon-top-arrow');
                    }
                } else {
                    /**
                     * 第二层点击处理
                     */
                    m.parents('.sidebar-menu').find('li ul li').removeClass('active');
                    m.parent().addClass('active');
                    var currentUrl = m.data('url');
                    var moduleFlag = m.parents('ul').siblings('a').data('url');
                    jh.utils.load(moduleFlag + currentUrl);
                }
            });

            /*地址栏变化事件*/
            $(window).on('hashchange', function() {
                var currentHash = window.location.hash,
                    repHash = currentHash.replace(/^[#]$/ig, '');
                var moduleInfo = jh.utils.getURLValue();
                if (!currentHash || !repHash || !moduleInfo.module) {
                    $('#content-container').empty();
                    jh.utils.updateMenuBoxHeight();
                    return false;
                }
                jh.utils.showHTML(moduleInfo.module);
            });

            $('.sidebar-toggle').on('click', function() {
                var leftBox = $('.left-side');
                var rightBox = $('.left-side').next();
                if (rightBox.hasClass('right-side')) {
                    rightBox.removeClass('right-side');
                    leftBox.css('left', '-220px');
                } else {
                    rightBox.addClass('right-side');
                    leftBox.css('left', '0px');
                }
            });

            /*只能输入数字，并且小数点只能输入一个*/
            $('#content-container').on('keyup change', '.OnlyPrice', function() {
                this.value = this.value.replace(/[^\d.]/, ''); /*禁止输入非数字和小数点以外字符*/
                this.value = this.value.replace(/^\./, ''); /*禁止开头为‘.’*/
                this.value = this.value.replace(/[\u4e00-\u9fa5]/ig, ''); /*禁止输入汉字*/
                this.value = this.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.'); /*不允许两个及以上小数点*/
                this.value = this.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
            });

            /*高级查询切换*/
            $('#content-container').on('click', '.advanced_query_btn,.common_query_btn', function() {
                var m = $(this);
                m.parents('form').addClass('hide').siblings().removeClass('hide');
            });

            /*为密码框绑定事件，禁止复制，剪贴，粘贴，输入空格*/
            $('body').on('keyup', 'input:password,.pwd', function() {
                this.value = this.value.replace(/\s/, '');
            });

            $('body').on('copy paste cut', 'input:password', function() {
                return false;
            });

            /*返回事件*/
            $('#content-container').on('click', '.goBack', function() {
                window.history.go(-1);
            });

            $('.label_checkbox,.label_radio').iCheck({
                checkboxClass: 'icheckbox_flat-orange',
                radioClass: 'iradio_flat-orange',
                increaseArea: '20%'
            });


            $('.user-menu').on('click', function() {
                var me = $(this);
                me.find('ol').toggleClass('hide');
                me.find('.icon-black-top').toggleClass('hide');
            });

            $('.user-menu ol').on('mouseleave', function() {
                var me = $(this);
                me.addClass('hide');
                $('.user-menu').find('.icon-black-top').addClass('hide');
            });

            $('body').off('click', '.delete-img').on('click', '.delete-img', function() {
                var m = $(this);
                m.parent().remove(); //删除整个容器
            });

            $('body').off('click', '#exportFile').on('click', '#exportFile', function() {
                var m = $(this);
                var form = m.parents('form');
                var datas = form.serialize();
                var XToken = encodeURIComponent(jh.utils.cookie.get('X-Token'));
                window.location.href =  '/manager' + '/task/export' + '?' + datas+ '&XToken='+XToken;
            });

            $('body').off('click', '.img-preview img').on('click', '.img-preview img', function() {
                var m = $(this);
                var src = m.attr('src');
                var title = m.data('tips') ? m.data('tips') : '查看大图';
                src = src.replace(/imageView2\/0\/w\/100/,'imageslim');
                jh.utils.alert({
                    title: title,
                    content: '<img src="'+src+'"/>'
                });
            });

            $('#loginout').on('click', function() {
                var me = $(this);
                jh.utils.alert({
                    content: '确定要安全退出吗？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/operator/loginout',
                            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                            done: function() {
                                jh.utils.cookie.deleteCookie('username');
                                jh.utils.cookie.deleteCookie('X-Token');
                                window.location.href = jh.arguments.pageLogin;
                            },
                            fail: function() {
                                me.prop('disabled', false);
                            }
                        });
                    },
                    cancel: function() {}
                });
            });

            $('#editPass').on('click', function() {
                var me = $(this);
                me.attr('disabled', 'disabled');
                var username = jh.utils.cookie.get('username');
                var str = jh.utils.template('modify_pass_template', {
                    username: username
                });
                jh.utils.alert({
                    title: '修改密码',
                    content: str,
                    ok: function() {
                        $('#editPassForm').submit();
                        return false;
                    },
                    close: function() {
                        me.removeAttr('disabled');
                    },
                    cancel: function() {
                        me.removeAttr('disabled');
                    }
                });
                jh.utils.validator.init({
                    id: 'editPassForm',
                    submitHandler: function() {
                        var oldPass = $.trim($('#old_passwd').val());
                        var newPass = $.trim($('#new_passwd').val());
                        var key = jh.arguments.public_key;

                        var jsencrypt = new JSEncrypt();
                        jsencrypt.setPublicKey(key);
                        oldPass = jsencrypt.encrypt(oldPass);

                        var jsencrypt1 = new JSEncrypt();
                        jsencrypt1.setPublicKey(key);
                        newPass = jsencrypt1.encrypt(newPass);

                        jh.utils.ajax.send({
                            url: '/admin/user/update-passwd',
                            method: 'post',
                            data: {
                                old_passwd: oldPass,
                                new_passwd: newPass
                            },
                            done: function() {
                                jh.utils.alert({
                                    content: '密码修改成功,需要重新进行登录操作',
                                    ok:function(){
                                        window.location.href = jh.arguments.pageLogin;
                                    },
                                    cancel:false
                                });
                            }
                        });
                    }
                });
            });

            $('body').on('change', 'select', function() {
                $(this).parents('form').validate().element($(this));
            });

            $('.wrapper').off('click','.stateChange li').on('click','.stateChange li',function(){
                var me = $(this);
                var val = me.data('value');
                me.addClass('active').siblings().removeClass('active');
                me.siblings('input[type=hidden]').val(val);
                me.parents('form').submit();
            });

            var inputTimeoutId = null;
            var formChangeHandle =  function(form){
                clearInterval(inputTimeoutId);
                inputTimeoutId = window.setTimeout(function(){
                    form.submit();
                },600);
            };

            //输入框内容改变即刻搜索
            $('.wrapper').off('input propertychange','.search-input').on('input propertychange','.search-input',function(){
                var me = $(this);
                formChangeHandle(me.parents('form'));
            });

            //下拉菜单改变后即刻搜索
            $('.wrapper').off('change','.search-select').on('change','.search-select',function(){
                var me = $(this);
                formChangeHandle(me.parents('form'));
            });

        };
    }
    module.exports = RegisterJQueryEvent;
});