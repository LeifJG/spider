const url ='http://www.saskatchewan.ca/residents/moving-to-saskatchewan/immigrating-to-saskatchewan/saskatchewan-immigrant-nominee-program/maximum-number-of-sinp-applications';
const http = url.indexOf('http:')==-1&&url.indexOf('https:')!=-1?require('https'):require('http');
const cheerio=require('cheerio');
const nodemailer=require('nodemailer');
const user='ljg@meiyi.ai'; //用于发送邮件的邮箱地址和密码
const pass='cMP8X7z69EKYYkBe';
// const opt={
// 	host:this.host||'220.249.185.178',
// 	port:this.port||9999,
// 	method:'get',
// 	path:url,
// 	headers:{
// 		//'Access-Control-Allow-Origin': '*',
// 		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
// 	}
// }

// http.createServer(function(req, res) {

// }).listen(3000);

const transporter=nodemailer.createTransport({  //邮件服务器的设置。
	host:'smtp.exmail.qq.com',
	port:465,
	//secureConnection: true, // 使用 SSL
	auth:{
		user,
		pass
	}
});

function start() {//爬整个页面
	let now=new Date();
	console.log(`${now} 开始执行`);
	http.get(url,function (res) {
		let html = '';
		res.on('data', function (data) {
			html+=data;
		});

		res.on('end',function () {
			getTarget(html);
		});
	}).on('error',function (err) {
		console.log('##error## '+err);
		console.log('重新执行中');
		eval('start()');
	});
}

function getTarget(html) {//获取需要爬的内容
	// body...
	let now=new Date();
	console.log(`${now} 抓取目标数据中`);
	let $=cheerio.load(html);
	let target=[];
	target.push({ //获取目标数据。
		name:'Express Entry	:',
		text:$('.general-content table').eq(0).find('tr').eq(-2).find('td').last().text()
	});
	target.push({ //获取目标数据。
		name:'Occupations In-Demand	:',
		text:$('.general-content table').eq(0).find('tr').last().find('td').last().text()
	});
	now=new Date();
	console.log(`${now} 抓取成功`);

	if(target[0]>0||target[1]>0){
		sendMail(target);
	};
}

function sendMail(target) {//发送邮件
	let now=new Date();
	console.log(`${now} 正在发送邮件`);
	let result=`<p>目标URL:<a href="${url}">${url}</a></p>`;
	target.forEach(function(item){
		result+=`<p>${item.name} ${item.text}</p>`;
	});
	const mailOptions = {
	    from: 'ljg@meiyi.ai,', // 发送者
	    to: 'ljg@meiyi.ai', // 接受者,可以同时发送多个,以逗号隔开 ,alex@meiyi.ai,joyce@meiyi.ai
	    subject: `目标内容发生变化。`, // 标题
	    //text: '抓取内容符合条件,当前抓取内容为：${target} \n asd \r 1231', // 文本
	    html:result
	};
	transporter.sendMail(mailOptions, function (err, info) {
	    if (err) {
	      console.log(err);
	      start();
	      return;
	    }
	    now=new Date();
	    console.log(`${now} 发送成功`);
	});
}

start();
setInterval(start,3600000);//一小时一次。ra