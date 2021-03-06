/**
 * @authors jiaguishan (http://tammylights.com)
 * @date    2017-04-01 14:54:43
 * @version 1.0
 */
define(function(require, exports, module) {
    function RegisterJQueryEvent() {
        var _this = this;
        _this.roleType = sessionStorage.getItem('admin-roleType');

        this.init = function() {
            this.registerEvent();
        };

        this.getDirectUrlByType = function(type){
            var urlStr = '';
            switch( type ){
                case 1: 
                    urlStr = '/src/modules/xinxiyuan/clue/clue-manage';
                    break;
                case 2: 
                    urlStr = '/src/modules/sendMoney/sendMoney-list';
                    break;
                case 3: 
                    urlStr = '/src/modules/officermanage/officer-manage';
                    break;
                case 4: 
                    urlStr = '/src/modules/qudao/qd-distribution/qd-distribution-list';
                    break;
                case 5: 
                    urlStr = '/src/modules/logistics/logistics-list';
                    break;
                case 6: 
                    urlStr = '/src/modules/xinxiyuan/xx-distribution/xx-distribution-list';
                    break;
                case 7: 
                    urlStr = '/src/modules/yunying/task/task-audit';
                    break;
                case 8: 
                    urlStr = '/src/modules/xinxiyuan/evidence/evidence-audit';
                    break;
                case 9: 
                    urlStr = '/src/modules/customerManage/customer-manage';
                    break;
                case 10: 
                    urlStr = '/src/modules/qudao/informant/informant-manage';
                    break;
            }
            return urlStr;
        };

        this.registerEvent = function() {
            jh.utils.ajax.send({
                url: '/qiniu/getToken',
                done: function(returnData) {
                    sessionStorage.setItem('admin-uploadToken', returnData.data.uploadToken);
                }
            });
            
            /**
             * 菜单点击事件
             */
            $('#leftMenu-box').on('click', '.first-menu-item', function() {
                var m = $(this);
                var isActive = m.parent().hasClass('active');
                m.parent().siblings().removeClass('active');
                var icon = m.find('i.fr');
                if (isActive) {
                    m.parent().removeClass('active');
                } else {
                    m.parent().addClass('active');
                }
                var currentUrl = m.data('url');
                jh.utils.load(currentUrl);
            });
            $('#toggleMenu').click(function() {
                var me = $(this);
                var hea = $('article.wrapper');
                var menu = $('#menusBar');
                var leftMenu = $('#leftMenu-box .first-menu-item');
                if (me.hasClass('closeMenu')) {
                    hea.css('margin-left', '250px');
                    menu.animate({width:250});
                    //折叠按钮
                    me.addClass('icon-icon_closeMenu')
                        .removeClass('closeMenu')
                        .removeClass('icon-icon_openMenu')
                        .animate({left:250});
                    leftMenu.animate({padding:'0 50px'}).children('span').show();
                } else {
                    hea.css('margin-left', '40px');
                    menu.animate({width:40});
                    //折叠按钮
                    me.addClass('closeMenu icon-icon_openMenu')
                        .removeClass('icon-icon_closeMenu')
                        .animate({left:40});
                    leftMenu.animate({padding:'0 10px'}).children('span').hide();
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

            /*只能输入数字，并且小数点只能输入一个*/
            $('body').on('keyup change', '.OnlyPrice', function() {
                this.value = this.value.replace(/[^\d.,]/, ''); /*禁止输入非数字和小数点以外字符*/
                this.value = this.value.replace(/^\./, ''); /*禁止开头为‘.’*/
                this.value = this.value.replace(/[\u4e00-\u9fa5]/ig, ''); /*禁止输入汉字*/
                this.value = this.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.'); /*不允许两个及以上小数点*/
                this.value = this.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
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
                jh.utils.defaultPage();
            });

            $('#userCenterLink').on('click', function() {
                var me = $(this);
                jh.utils.load('/src/modules/person/person-file');
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
                var XToken = encodeURIComponent(sessionStorage.getItem('admin-X-Token'));
                window.location.href = REQUESTROOT + '/task/export' + '?' + datas + '&XToken=' + XToken;
            });

            $('body').off('click', '.preview-img').on('click', '.preview-img', function() {
                var m = $(this);
                var src = m.attr('src');
                var title = m.data('tips') ? m.data('tips') : '查看大图';
                src = src.replace(/\?imageMogr2\/auto-orient\/thumbnail\/100x100/, '');
                jh.utils.alert({
                    title: title,
                    content: '<img src="' + src + '"/>'
                });
            });

            $('body').off('click', '.seaMessageDetail').on('click', '.seaMessageDetail', function() {
                var m = $(this);
                var type =  m.data('type');
                var targetUrl = _this.getDirectUrlByType(type);
                jh.utils.load(targetUrl);

                m.parents('.new-message').remove();
            });

            $('body').off('click', '.newMessage_close').on('click', '.newMessage_close', function() {
                var m = $(this);
                m.parents('.new-message').animate({ bottom: '-193px' }, 'slow', 'swing', function() {
                    $(this).remove();
                });
            });

            $('#logoutLink').on('click', function() {
                var me = $(this);
                jh.utils.alert({
                    content: '确定要安全退出吗？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/operator/logout',
                            done: function() {
                                sessionStorage.removeItem('admin-X-Token');
                                sessionStorage.removeItem('admin-uploadToken');
                                sessionStorage.removeItem('admin-username');
                                window.location.href = jh.config.pageLogin;
                            },
                            fail: function() {
                                me.prop('disabled', false);
                            }
                        });
                    },
                    cancel: function() {}
                });
            });

            $('body').off('change', '#checkAll').on('click', '#checkAll', function() {
                var me = $(this);
                var state = me.is(':checked');
                var checkboxs = me.parents('table').find('input[type=checkbox]');
                if (state) {
                    checkboxs.prop('checked', true);
                } else {
                    checkboxs.prop('checked', false);
                }
            });

            //批量分配
            $('body').off('click', '.qd-distribution-tab li').on('click', '.qd-distribution-tab li', function() {
                var me = $(this);
                me.addClass('active').siblings().removeClass('active');
                var ind = me.index();
                $('#qd-distribution-tab' + ind).removeClass('hide').siblings().addClass('hide');
            });

            $('#ueditorExample').on('click',function(){
                jh.utils.load('/src/modules/ueditor/ueditor');
            });

            $(window).on('resize', function() {
                jh.utils.updateMenuBoxHeight();

                var h = $(window).height();
                $("#leftMenu-box").mCustomScrollbar({
                    setHeight: h,
                    theme: "minimal-dark"
                });
            });
//          捕头的窗口搜索
            $('body').on('keyup', '#keyword', function() {
              if ($("#keyword").val() == '') {
                  $(".datalist").show();
              }
              $(".datalist div:contains(" + $("#keyword").val().trim() + ")").show();
              $(".datalist div:not(:contains(" + $("#keyword").val().trim() + "))").hide();
            });
            
        };
    }
    module.exports = RegisterJQueryEvent;
});