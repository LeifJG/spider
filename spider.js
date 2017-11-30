const url ='http://www.saskatchewan.ca/residents/moving-to-saskatchewan/immigrating-to-saskatchewan/saskatchewan-immigrant-nominee-program/maximum-number-of-sinp-applications';
const http = url.indexOf('http:')==-1&&url.indexOf('https:')!=-1?require('https'):require('http');
const cheerio=require('cheerio');
const nodemailer=require('nodemailer');
const user=''; //用于发送邮件的邮箱地址和密码
const pass='';
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

const mailOptions = {
    from: '', // 发送者
    to: '', // 接受者,可以同时发送多个,以逗号隔开
    subject: '爬虫测试邮件发送', // 标题
    text: '测试', // 文本
    //html:''
};

function getTarget(html) {//获取需要爬的内容
	// body...
	let $=cheerio.load(html);
	let now=new Date();
	let target=$('.general-content table').eq(0).find('tr').last().find('td').last().text();
	if(target>0){
		sendMail(target);
		return ;
	}
	console.log(`${now} 本次抓取结果为：${target}`);
}

function start() {//爬整个页面
	http.get(url,function (res) {
		let html = ''
		res.on('data', function (data) {
			html+=data;
		})

		res.on('end',function () {
			getTarget(html)
		})
		// body...
	}).on('error',function (err) {
		console.log('##error## '+err);
	})
}

function sendMail() {//发送邮件
	transporter.sendMail(mailOptions, function (err, info) {
	    if (err) {
	      console.log(err);
	      return;
	    }
	    console.log('发送成功');
	});
}

//start();
setInterval(start,1800000);//半小时一次。
