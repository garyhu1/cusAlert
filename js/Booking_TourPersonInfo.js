/**
 * @邮轮下单-优惠信息
 * @author xm10859
 */

var createTourPersonInfoBoxModule = function (root) {
    var tourPersonInfoBox = new root.Module(root, 'tourPersonInfoBox');
    var moduleRoot = tourPersonInfoBox;

    moduleRoot.config = {
        obj:{
            total: 0,
            totalAdult: 0,
            totalChild: 0,
            roomList: []
        },
        memeberList:[],
        memberId:0
    };
    moduleRoot.events = {
        "#tourPersonInfo-form&.checkInPerson-list input[type='radio']":{
           'click': function () {
                var domName = $(this).attr('name');//获取当前单选框控件name 属性值   
                var checkedState = $(this).attr('checked');//记录当前选中状态  
                $("input:radio[name='" + domName + "']").attr('checked',false);//1.  
                $(this).attr('checked',true);
                $(this).siblings("label").removeClass("addAfter")
                if(checkedState == 'checked'){  
                    $(this).next().removeClass("addAfter");
                    $(this).attr('checked',false);
                }else{
                    $(this).next().addClass("addAfter");
                    $(this).attr('checked',true); 
                }
            }
        },
        "#tourPersonInfo-form&.checkInPerson-list input[type='text']":{
            "focus": function () {
                 $(this).removeClass("errorInput");
            },
            "blur": function () {
                var o = $(this),
                    cellReg = /^1[34578]\d{9}$/,
                    identReg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
                    inputId = $(this).parent().attr('id'),
                    value = $(this).val().trim() ;
                //验证手机号
                if (o.parent().hasClass("visitorPhoneNum")) {
                    if (value != '' && !cellReg.test(value)) {
                        $.fn.eTip.show(`#${inputId}`, `手机号码格式不正确`);
                        return false;
                    }
                    return true;
                };
                //验证证件号
                if (o.parent().hasClass("identNum")) {
                    var radioInput = $(this).parents(".checkInPerson-list-item").find(".Type").find('.addAfter').prev().val();
                    if (radioInput == 1 && value != '') {
                        if(!identReg.test(value)){
                            $.fn.eTip.show(`#${inputId}`, `身份证格式不正确`);
                            return false;
                        }else{
                            var born = value.substring(6,10) + '-' + value.substring(10,12) + '-' +value.substring(12,14),
                                num = $(this).parents('.checkInPerson-list-item').attr('data-linum');
                            $(`#cusBirthday${num}`).find('input').val(born);
                        }
                    }
                    return true;
                };
                if(o.parents('.eui-form-item-control').attr('data-ajaxname') == 'Name'){
                    if(value != '' && moduleRoot.config.memeberList.length > 0){
                        moduleRoot.config.memeberList.forEach(function(item,index){
                            if(item.linkerName == value){
                                moduleRoot.handles.setMemberContactList(o.parents('.checkInPerson-list-item'),item);
                            }
                        })
                    }
                }
            }
        },
        '#tourPersonInfo-form&.checkInPerson-list .laydate-icon': {
            'focus': function(){
                $(this).removeClass("errorInput");
            }
        },
        ".eee":{
            'click': function () {
                var FormObj = moduleRoot.handles.getSubmitInfo($(".checkInPerson-list-item"))
                // console.log(FormObj)
            }
        }
    };
    moduleRoot.handles = {
        getMemberContactList:function(){
            $.ajax({
                url:`/sell/product/Common/GetMemberContactList?MemberId=${moduleRoot.config.memberId}`,
                type:'post',
                dataType:'json',
                timeout:20000,
                beforeSend: function() {},
                success:function(data){
                    if (!data.ResCode == 200 || data.Data==null || !data.Data.data.success) {
                        return;
                    }
                    moduleRoot.config.memeberList = data.Data.data.values || [];
                }
            })
        },
        setMemberContactList:function(ele,list){
            var liEle = $(ele),
                creList = list.listNos[0];//证件信息默认取第一个
            liEle.find('.eui-form-item-control').each(function(item,index){
                var type = $(this).attr('data-type'),
                    id = $(this).attr('id'),
                    ajaxPara = $(this).attr('data-ajaxname');
                switch(ajaxPara){
                    case 'Name':{
                        $(this).find('input').val(list.linkerName);
                        break;
                    }
                    case 'Phone':{
                        $(this).find('input').val(list.mobile);
                        break;
                    }
                    case 'Gender':{
                        $(this).find('input').each(function(rItem,iIndex){
                            if($(this).val() == list.sex){
                                $(this).attr('checked',true).siblings('input').attr('checked',false);
                                $(this).siblings("label").removeClass("addAfter");
                                $(this).next().addClass('addAfter');
                            }
                        })
                        break;
                    }
                    case 'Type':{
                        $(this).find('input').each(function(rItem,iIndex){
                            if($(this).val() == creList.certType){
                                $(this).attr('checked',true).siblings('input').attr('checked',false);
                                $(this).siblings("label").removeClass("addAfter");
                                $(this).next().addClass('addAfter');
                            }
                        })
                        break;
                    }
                    case 'CertificateNum':{
                        $(this).find('input').val(creList.certNo);
                        break;
                    }
                    case 'Birthday':{
                        $(this).find('input').val(list.birthday);
                        break;
                    }
                }
            })
        },
        getLiList: function(listLi,i){
            var ulLi = '';
            for(var j = 0; j < listLi; j++){
                    ulLi += `<li class="checkInPerson-list-item" data-liNum="${i}${j}">
                                <div class="eui-form-item">
                                    <div class="eui-form-item-caption">
                                        <label>出游人${j+1}姓名</label>
                                    </div>
                                    <div class="eui-form-item-control visitorName" data-type="text" data-ajaxName="Name" id="cusName${i}${j}">
                                        <input type="text" class="eui-input">
                                    </div>
                                </div>  
                                <div class="eui-form-item">
                                    <div class="eui-form-item-caption">
                                        <label>手机号码</label>
                                    </div>
                                    <div class="eui-form-item-control visitorPhoneNum" data-type="text" data-ajaxName="Phone" id="cusPhone${i}${j}">
                                        <input type="text" class="eui-input" maxlength="11">
                                    </div>
                                </div>  
                                <div class="eui-form-item">
                                    <div class="eui-form-item-caption">
                                        <label for="">性别</label>
                                    </div>
                                    <div class="eui-form-item-control Gender" data-type="radio" data-ajaxName="Gender" id="cusSex${i}${j}">
                                        <input type="radio" id="sex-woman${j}${i}" name="sex${j}${i}" class="eui-radio" value="0">
                                        <label for="sex-woman${j}${i}">女</label>
                                        <input type="radio" id="sex-man${j}${i}" name="sex${j}${i}" value="1" class="eui-radio">
                                        <label for="sex-man${j}${i}">男</label>
                                    </div>
                                </div>
                                <div class="eui-form-item">
                                    <div class="eui-form-item-caption">
                                        <label for="">游客属性</label>
                                    </div>
                                    <div class="eui-form-item-control CertificateType" data-type="radio" data-ajaxName="CertificateType" id="cusCertificate${i}${j}">
                                        <input type="radio" id="adult${j}${i}" name="visitor-attr${j}${i}" class="eui-radio" value="1">
                                        <label for="adult${j}${i}">成人</label>
                                        <input type="radio" id="child${j}${i}" name="visitor-attr${j}${i}" class="eui-radio" value="2">
                                        <label for="child${j}${i}">儿童</label>
                                        <input type="radio" id="foreign${j}${i}" name="visitor-attr${j}${i}" class="eui-radio" value="3">
                                        <label for="foreign${j}${i}">婴儿</label>
                                    </div>
                                </div>
                                <div class="eui-form-item">
                                    <div class="eui-form-item-caption">
                                        <label for="">证件类型</label>
                                    </div>
                                    <div class="eui-form-item-control Type" data-type="radio" data-ajaxName="Type" id="cusType${i}${j}">
                                        <input type="radio" id="type1${j}${i}" name="document-type${j}${i}" class="eui-radio" value="1">
                                        <label for="type1${j}${i}">身份证</label>
                                        <input type="radio" id="type2${j}${i}" name="document-type${j}${i}" class="eui-radio" value="2">
                                        <label for="type2${j}${i}">护照</label>
                                        <input type="radio" id="type3${j}${i}" name="document-type${j}${i}" class="eui-radio" value="3">
                                        <label for="type3${j}${i}">军官证</label>
                                        <input type="radio" id="type4${j}${i}" name="document-type${j}${i}" class="eui-radio" value="4">
                                        <label for="type4${j}${i}">台胞证</label>
                                        <input type="radio" id="type5${j}${i}" name="document-type${j}${i}" class="eui-radio" value="5">
                                        <label for="type5${j}${i}">港澳通行证</label>
                                        <input type="radio" id="type6${j}${i}" name="document-type${j}${i}" class="eui-radio" value="6">
                                        <label for="type6${j}${i}">回乡证</label>
                                        <input type="radio" id="type7${j}${i}" name="document-type${j}${i}" class="eui-radio" value="7">
                                        <label for="type7${j}${i}">台湾通行证</label>
                                        <input type="radio" id="type8${j}${i}" name="document-type${j}${i}" class="eui-radio" value="10">
                                        <label for="type8${j}${i}">稍后提供</label>
                                    </div>
                                </div>
                                <div class="eui-form-item">
                                    <div class="eui-form-item-caption">
                                        <label>证件号码</label>
                                    </div>
                                    <div class="eui-form-item-control identNum" data-type="text" data-ajaxName="CertificateNum" id="cusCertificateNum${i}${j}">
                                        <input type="text" class="eui-input">
                                    </div>
                                </div>
                                <div class="eui-form-item">
                                    <div class="eui-form-item-caption">
                                        <label>出生日期</label>
                                    </div>
                                    <div class="eui-form-item-control birthdayNum" data-type="text" data-ajaxName="Birthday" id="cusBirthday${i}${j}">
                                        <input class="eui-input laydate-icon" onclick="laydate()" readonly="true" style="width:185px;height:31px;">
                                    </div>
                                </div>
                            </li>`
            }
            return ulLi;
        },
        renderList: function () {
            $('#tourPersonInfo').addClass('none');
            var data = moduleRoot.config.obj;
            var dataArr = data.roomList;
            var title = '';
            var list = '';
            if(data.total == 0){
                return;
            }
            $('#tourPersonInfo').removeClass('none');
            for(var i = 0; i< dataArr.length; i++){
                var str = moduleRoot.handles.getLiList(dataArr[i].person,i);
                title += `<li>${dataArr[i].name}</li>`
                list += ` <div class="content-box">
                            <h2 class="cont-title-bar" title-num=${i}>${dataArr[i].name}</h2>
                            <div class="cont">
                                <ul class="checkInPerson-list">
                                    ${str}
                                </ul>
                            </div>
                        </div>`
            }
            $('#tourPersonInfo').find(".scroll-tab").html(title);
            $('#tourPersonInfo').find(".scroll-content").html(list)
        },
        getFormItemObj:function(formItem){
            var item = $(formItem);
            var control = item.find('.eui-form-item-control');
            var caption = item.find('.eui-form-item-caption');
            var id = control.attr('id');
            var ajaxPara = control.attr('data-ajaxname');
            var type = control.attr('data-type');
            var value, text, labelName;
            labelName = caption.find('label').text();
            switch(type){
                case 'text':{
                    value = control.find('input').val().trim();
                    text = value;
                    break;
                }
                case 'radio':{
                    value = control.find('.addAfter').prev().val() || '';
                    text = control.find('.addAfter').text();
                    break;
                }
            }
            return {
                id: id,
                type: type,
                ajaxPara: ajaxPara,
                value: value,
                text: text,
                labelName: labelName
            };
        },
        getSubmitInfo: function() {
            // console.log(itemObj)
            var FormObj = {
                verifySuccess:false,
                ajaxSendData:{
                    TouristList:[]
                }
            },
                listArr = [],
                listObj = {},
                flag = false,
                phoneList=[];
            if(!$('#tourPersonInfo').hasClass('none')){
                $('#tourPersonInfo-form').find('.checkInPerson-list-item').each(function(index,item){
                    var liArr = [],
                        liObjLength = 0,
                        liObj = {};
                    $(this).find('.eui-form-item').each(function(subIndex,subItem){
                        var itemObj = moduleRoot.handles.getFormItemObj(subItem);
                        if(itemObj.text != undefined && itemObj.text != ''){
                            liObjLength += 1;
                        }
                        if(itemObj.ajaxPara == 'Phone' && itemObj.text != undefined && itemObj.text != ''){
                            var phoneObj ={};
                            phoneObj.phone = itemObj.text;
                            phoneObj.count = 0;
                            if(phoneList.length > 0){
                                var phoneFlag = false;
                                phoneList.forEach(function(phoneItem,phoneIndex){
                                    if(phoneItem.phone == itemObj.text){
                                        phoneFlag = true;
                                    }
                                })
                                if(!phoneFlag){
                                    phoneList.push(phoneObj);
                                }
                            }else{
                                phoneList.push(phoneObj);
                            }
                        }
                        liArr.push(itemObj);
                    })
                    if(liObjLength > 0){
                        liObj.dataArray = liArr;
                        if(liObjLength < 7){
                            liObj.isError = true;
                        }else{
                            liObj.isError = false;
                        }
                        liObj.indexNum = $(this).attr('data-liNum');
                        listArr.push(liObj);
                    }
                })
                var CertificateReg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
                if(listArr.length > 0){
                    listArr.forEach(function(item,index){
                        flag = item.isError;
                        var dataArr =item.dataArray;
                        if(item.isError){
                            dataArr.forEach(function(dataItem,dataIndex){
                                if(dataItem.text == undefined || dataItem.text == ''){
                                    $.fn.eTip.show(`#${dataItem.id}`, `${dataItem.labelName}不能为空`);
                                }
                            })
                        }else{
                            dataArr.forEach(function(dataItem,dataIndex){
                                if(dataItem.ajaxPara == 'CertificateNum'){
                                    if($(`#cusType${item.indexNum}`).find('.addAfter').prev().val() == 1 ){
                                        if(!CertificateReg.test(dataItem.text)){
                                            $.fn.eTip.show(`#${dataItem.id}`, `${dataItem.labelName}格式错误`);
                                            flag = true;
                                        }else{
                                            var born = dataItem.value.substring(6,14), 
                                                bornInput = $(`#cusBirthday${item.indexNum}`).find('input').val().replace(/-/g,'');
                                            if(born != bornInput){
                                                $.fn.eTip.show(`#cusBirthday${item.indexNum}`, `出生日期与身份证不符`);
                                                flag = true;
                                            }
                                        }
                                    }
                                }
                                if(dataItem.ajaxPara == 'Phone'){
                                    if(phoneList.length > 0){
                                        phoneList.forEach(function(pItem,pIndex){
                                            if(pItem.phone == dataItem.text){
                                                pItem.count += 1;
                                            }
                                            if(pItem.count > 4){
                                                $.fn.eTip.show(`#${dataItem.id}`, `该${dataItem.labelName}此单已被4人使用，其他出游人不可继续使用`);
                                                flag = true;
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
                if(!flag){
                    FormObj.verifySuccess = true;
                    if(listArr.length > 0){
                        listArr.forEach(function(item,index){
                            var obj = {};
                            item.dataArray.forEach(function(subItem,subIndex){
                                obj[subItem.ajaxPara] = subItem.value;
                            })
                            FormObj.ajaxSendData.TouristList.push(obj);
                        })
                    }
                }
            }
            return FormObj;
        },
    };
    moduleRoot.pubsub.on('tourPersonInfoBox.init', 'tourPersonInfoBox', function () {
        // cruiseBooking.handles.greet();
        //初始化滚动
        $('#tourPersonInfo-form').initScrollTab();
        // moduleRoot.handles.renderList();

    });

    // root.pubsub.on('record.get', 'tourPersonInfoBox', function (data) {
    //     console.log('tourPersonInfoBox:' + data);
    // });
    root.pubsub.on('selectedRoom.get','tourPersonInfoBox',function(data){
        if(!data){
            return;
        }
        moduleRoot.config.obj.total = data.totalPerson;
        moduleRoot.config.obj.totalAdult = data.totalAdult;
        moduleRoot.config.obj.totalChild = data.totalChild;
        moduleRoot.config.obj.roomList = data.roomList;
        moduleRoot.handles.renderList();
    })
    root.pubsub.on('memberInfo.get','tourPersonInfoBox',function(data){
        moduleRoot.config.memberId = data.memberId;
        moduleRoot.handles.getMemberContactList();
        // console.log(data);
    })

    return tourPersonInfoBox;
};