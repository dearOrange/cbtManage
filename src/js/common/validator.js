'use strict';
define(function(require, exports, module) {
    jQuery.validator.addMethod("cardNumType", function(value, element) {
        value = value.replace(/\s/g, '');
        var length = value.length;
        var regx = /^[1-9]\d{14,19}$/i;
        var bankType = $('#bankId').find('option:selected').attr('abbreviation');
        return this.optional(element) || (length >= 15 && length <= 50 && regx.test(value) && valiBankCar(value, element, bankType));
    }, "请填写正确的银行卡号");


    jQuery.validator.addMethod("passwordRepeat", function(value, element) {
        var length = value.length;
        if ($(element).hasClass('editAccountPwd') && value.length === 0) {
            return true;
        }
        var reg1 = /([0-9a-zA-Z])\1{2}/;//数字、字母不可连续3次及以上
        var reg2 = /([^0-9a-zA-Z])\1{2}/;//特殊字符不可连续3次及以上

        if (reg1.test(value) || reg2.test(value) ) {
            return false;
        }
        return true;
    }, "密码过于简单，请重新输入");

    jQuery.validator.addMethod("checkPassword", function(value, element) {
        var length = value.length,
            isPss = true;
        var regArr = [];
        regArr.push('^[a-z]+$');
        regArr.push('^[A-Z]+$');
        regArr.push('^[0-9]+$');
        regArr.push('^[^0-9a-zA-Z]+$');
        for (var i = 0, len = regArr.length; i < len; i++) {
            if (new RegExp(regArr[i]).test(value)) {
                isPss = false;
                break;
            }
        }
        if ($(element).hasClass('editAccountPwd') && value.length === 0) {
            return true;
        }
        if ( length > 16 || length < 6 || !isPss || value.match(/[^\x00-\xff]/ig) ) {
            return false;
        }
        return true;
    }, "请输入6~16位数字或字母、特殊，两组及以上组合的密码");

    jQuery.validator.addMethod("isEmail", function(value, element) {
        value = value.replace(/\s/g, '');
        var length = value.length;
        var regx = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/i;
        return this.optional(element) || (regx.test(value) && value.length <= 50);
    }, "请填写正确邮箱");
    jQuery.validator.addMethod("isIdCardNo", function(value, element) {
        var cardRegex1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
        var cardRegex2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
        value = value.replace(/\s/g, '');
        return this.optional(element) || (cardRegex1.test(value) || cardRegex2.test(value));
    }, "请输入正确的身份证号码");
    jQuery.validator.addMethod("isMobile", function(value, element) {
        var length = value.length;
        var mobile = /^1[3|4|5|6|7|8][0-9]{9}$/;
        return this.optional(element) || (length === 11 && mobile.test(value));
    }, "请填写正确的手机号码");
    jQuery.validator.addMethod("isPhoneOrEmail", function(value, element) {
        var mobile = /^1[3|4|5|6|7|8][0-9]{9}$/;
        var regx = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/i;
        return this.optional(element) || (regx.test(value) || mobile.test(value));
    }, "请填写正确的手机号码/邮箱");
    jQuery.validator.addMethod("isTelephone", function(value, element) {
        var length = value.length;
        var mobile1 = /^1[3|4|5|6|7|8][0-9]{9}$/;
        var mobile2 = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        var mobile3 = /^400-[0-9]{3}-[0-9]{4}$/;
        return this.optional(element) || (length === 11 && mobile1.test(value) || mobile2.test(value) || mobile3.test(value));
    }, "请填写正确的电话号码");

    jQuery.validator.addMethod("isMoney", function(value, element) {
        var regx = /^([1-9][\d]{0,8})$/;
        return this.optional(element) || regx.test(value);
    }, "请输入正确金额");
    jQuery.validator.addMethod("isLoanAmount", function(value, element) {
        var regx = /^\d+(?:\.\d{1,2})?$/;
        return this.optional(element) || regx.test(value);
    }, "正整数或1到两位小数");
    jQuery.validator.addMethod("onlyZeroNumber", function(value, element) {
        var regx = /^(0|\+?[1-9][0-9]*)$/;
        return this.optional(element) || regx.test(value);
    }, "只能输入0或正整数");
    jQuery.validator.addMethod("isPrice", function(value, element) {
        var regx = /^([1-9][\d]{0,6}|0)(\.[\d]{1,2})?$/;
        return this.optional(element) || regx.test(value);
    }, "金额输入不正确");
    jQuery.validator.addMethod("cnName", function(value, element) {
        var regx = /^[\u2E80-\u9FFF]+$/;
        return this.optional(element) || (regx.test(value));
    }, "请填写正确的企业名称");
    jQuery.validator.addMethod("cnNameLetter", function(value, element) {
        var regx = /^[\u2E80-\u9FFFa-zA-Z]+$/;
        return this.optional(element) || (regx.test(value));
    }, "只能输入中文和字母");
    jQuery.validator.addMethod("noSpecial", function(value, element) {
        var regx = /^[\u2E80-\u9FFFa-zA-Z0-9]+$/;
        return this.optional(element) || (regx.test(value));
    }, "只能输入中文、字母和数字");
    jQuery.validator.addMethod("letter", function(value, element) {
        var regx = /^[a-zA-Z]+$/;
        return this.optional(element) || (regx.test(value));
    }, "只能输入字母");
    jQuery.validator.addMethod("businessLiNo", function(value, element) {
        var regex1 = /^\d{13}$|^\d{18}|^[a-zA-Z]{18}|^[0-9a-zA-Z]{18}$/;
        var regex2 = /^\d{14}([0-9]|X|x)$/;
        var regex3 = /^\d{6}(N|n)(A|a|B|b)\d{6}(X|x)$/;
        var matchNum1 = regex1.test(value);
        var matchNum2 = regex2.test(value);
        var matchNum3 = regex3.test(value);
        return this.optional(element) || (matchNum1 || matchNum2 || matchNum3);
    }, "请填写正确的营业执照号");
    jQuery.validator.addMethod("diffOther", function(value, element, param) {
        var flag = true;
        var ary = [];
        var oo = 0;
        var i = 0;
        $('[diffOther="' + param + '"]').each(function() {
            if ($(this).val()) {
                ary[i] = $(this).val();
                i++;
            }
        });
        var nary = ary.sort();
        for (var j = 0; j < ary.length; j++) {
            if (nary[j] == value) {
                oo++;
                if (oo == 2) {
                    flag = false;
                    break;
                }
            }
        }
        return flag;
    }, "和其他所填项重复");
});