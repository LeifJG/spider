# spider

用途：用来处理目前需要监控的一个网站，有变化了会发邮件给设置好的邮箱。

## 依赖

1. http模块，用来发get请求。
2. cheerio，用来处理get请求爬取到的html代码，可以跟jquery一样选择目标元素，很方便的一个工具。
3. nodemailer，用来发邮件。
