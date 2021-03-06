//regular field access
var a = {"f":0, "test":1};
a.f = "str";
MJSA_TEST(a.f)
// FEATURE[StringOp] in :User_Program: eval(Object->STRING) => [a,[object Object]] ==> eval("str")

//array index field access
MJSA_TEST(a["f"])
// FEATURE[StringOp] in :User_Program: eval(Object->STRING) => [a,[object Object]] ==> eval("str")

//reference variable field access
var b = "f";
MJSA_TEST(a[b])
// FEATURE[StringOp] in :User_Program: eval(Object->STRING) => [a,[object Object]] ==> eval("str")

//multiple values for object field
var x={a:"str1", b:"str2", c:"str3"};
if (1>2){
	x.a = "b";
} else {
	x.a = "c";
}
MJSA_TEST(x.a);
// FEATURE[StringOp] in :User_Program: eval(Object->STRING) => [x,[object Object]] ==> eval("b")
// FEATURE[StringOp] in :User_Program: eval(Object->STRING) => [x,[object Object]] ==> eval("c")

//multiple values for field object
var x = {a:"a"};
if (1>2) {
	x = {b:"b1"};
} else {
	x = {b:"b2"};
}
MJSA_TEST(x.a);
MJSA_TEST(x.b);
// FEATURE[StringOp] in :User_Program: eval(Object->STRING) => [x,[object Object]] ==> eval("b1")
// FEATURE[StringOp] in :User_Program: eval(Object->STRING) => [x,[object Object]] ==> eval("b2")

// use array element as object field
var a = [1,"b",3];
var f = {b:2};
f[a[1]] = "str";
MJSA_TEST(f[a[1]]);
// FEATURE[FuncCallOnStringVariable] in :User_Program: eval(Object->STRING) => [f,[object Object]] ==> eval("str")

// array in object field
var f = {b:[1,"2"]};
MJSA_TEST(f.b[1]);
// FEATURE[FuncCallOnStringVariable] in :User_Program: eval(Object->STRING) => [f,[object Object],[object Object]] ==> eval("2")

// nested field objects
var f = {b:{c:"nf"}};
MJSA_TEST(f.b.c);
// FEATURE[FuncCallOnStringVariable] in :User_Program: eval(Object->STRING) => [f,[object Object],[object Object]] ==> eval("nf")

var f = {b:{c:{d:"d"}}, t:"c"};
MJSA_TEST(f["b"][f.t]["d"]);
// FEATURE[FuncCallOnStringVariable] in :User_Program: eval(Object->STRING) => [f,[object Object],[object Object],[object Object]] ==> eval("d")