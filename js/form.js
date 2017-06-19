var count = Math.ceil(Math.random() * 10);

var myForm = $('#my-form');
var child = '';
for(var i = 0; i < count; i++) {
	child += `<div id="single-form">
					<label>姓名：<input type="text" class='name' onfocus='getF(${i},"name")'/></label><br />
					<label>手机号：<input type="text" class='phone' onfocus='getF(${i},"phone")'/></label><br />
					<label><span>性别</span>：<input type="radio" value="男" name="sex${i}" class='male' onfocus='getF(${i},"sex")'/>男
					     <input type="radio" value="女" name="sex${i}" class='female' onfocus='getF(${i},"sex")'/>女</label>
				</div>
	`
}
myForm.html(child);

function getF(n,flag){
	var node = $('form').children('div')[n];
	if(flag === 'name'){
		$(node).find('label>input.name').removeClass('red-border');
	}else if(flag === 'phone') {
		$(node).find('label>input.phone').removeClass('red-border');
	}else if(flag === 'sex') {
		$(node).find('label>span').removeClass('red-text');
	}
}

$('#submit').click(function() {
	var nodes = $('form').children('div');
	var formList = [];
	var flag = false;
	for(var i = 0; i < nodes.length; i++) {
		var name = $(nodes[i]).find('label>input.name').val().trim() || "";
		var phone = $(nodes[i]).find('label>input.phone').val().trim() || "";
		var checked1 = $(nodes[i]).find('label>input.female').is(":checked");
		var checked2 = $(nodes[i]).find('label>input.male').is(":checked");
		var sex = '';
		if(checked1) {
			sex = $(nodes[i]).find('label>input.female').val().trim() || "";
		} else if(checked2) {
			sex = $(nodes[i]).find('label>input.male').val().trim() || "";
		} else {
			sex = '';
		}
		var flag1 = false;
		if(sex !== '' && phone !== '' && name !== '') {
			flag1 = true;
			flag = true;
		} else if(sex === '' && phone === '' && name === '') {
			flag1 = false;
			flag = true;
		} else {
			if(phone === ''){
				$(nodes[i]).find('label>input.phone').addClass('red-border');
			}
			if(name === ''){
				$(nodes[i]).find('label>input.name').addClass('red-border');
			}
			if(sex === '') {
				$(nodes[i]).find('label>span').addClass('red-text');
			}
			flag1 = false;
			flag = false;
			break;
		}
		if(flag1) {
			var obj = {
				name: name,
				phone: phone,
				sex: sex
			}

			formList.push(obj);
		}

	}
	if(flag){
		alert(JSON.stringify(formList));
	}else {
		alert('请补全信息');
	}
});