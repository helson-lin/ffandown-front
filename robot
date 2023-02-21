#!/usr/bin/env node
const params = process.argv.slice(2);
const childProcess = require('child_process');

const url = 'curl  https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=e54b29b3-f9cf-442c-a460-69a562bc0cd4 -H  \'Content-Type: application/json\' -d \'{\"msgtype\": \"markdown\" , \"markdown\": { \"content\": \"[CICD通知] \n项目: '
+ `\<font color=\\"warning\\">${params[0]},构建失败!</font>\n`
+ `>提交分支: \<font color=\\"info\\">${params[1]}</font>\n`
+ `>提交人: \<font color=\\"info\\">${params[2]}</font>\n`
+ `>提交内容: \<font color=\\"info\\">${params[3]}</font>` + '\", } }\'';

childProcess.exec(
    url,
    (error, stdout, stderr) => {
        console.log(stdout);
        console.log(error);
        console.log(stderr);
    },
);
