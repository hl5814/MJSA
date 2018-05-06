//================================Setup======================================
const HashMap = require('hashmap');					  // load hashmap
const esprima = require('esprima');					  // load esprima
const ASTUtils = require("esprima-ast-utils");		  // load esprima-ast-utils
const Functions = require('./functions'); 			  // load helper functions
const commandLineArgs = require('command-line-args'); // load command-line-args
const fs = require('fs');

//===================parse command line arguments============================
const optionDefinitions = [
  { name: 'verbose',      	alias: 'v', type: Number },
  { name: 'weight',	 	  	alias: 'w', type: Boolean},
  { name: 'src', 		  	alias: 's', type: String },
  { name: 'header',		   	alias: 'h', type: Boolean}
]

const options = commandLineArgs(optionDefinitions)
const calcualteWeight = options.weight; 
const verbose = (options.verbose === undefined) ? 0 : (options.verbose === null)? 1 : 2;
const showHeader = options.header;
const filePath = options.src;

//===============================MainProgram=================================
var init_varMap = new Functions.VariableMap(new HashMap());

var funcNames = ["eval", "unescape", "replace", "write", "document.write", "atob", "btoa",
				 "setTimeout", "setInterval", "toString", "String.fromCharCode", "fromCharCode",
				 "parseInt", "alert", "Array","charCodeAt" , "substr"];
for (var f in funcNames) {
	init_varMap.setVariable(funcNames[f], [{ type: 'pre_Function', value: funcNames[f] }] );
}
init_varMap.setVariable("String", [{ type: 'ObjectExpression', value: {"fromCharCode": [{type: 'pre_Function', value: "fromCharCode"}]} }] );
init_varMap.setVariable("document", [{ type: 'ObjectExpression', value: {"write": [{type: 'pre_Function', value: "write"}]} }] );



function listEqual(list1, list2) {
	if (list1.length != list2.length) return false;
	for (var i in list1) {
		if (list1[i].type != list2[i].type ||
			list1[i].value != list2[i].value)
			return false;  
	}
	return true;
}

Set.prototype.my_add=function(values){
	var hasSame = false;
	var toAddList = [];
	for (var v in values) {
		var exists = false;
		this.forEach(function(item) { 
			if (values[v].type == "ArrayExpression") {
				for (var val in values[v].value) {
					if (item[0].value[val] === undefined) continue;
					if (values[v].value[val][0] != item[0].value[val][0] ||
						values[v].value[val][1] != item[0].value[val][1]) {
						if (values[v].value[val][0] == item[0].value[val][0]) {
							item[0].value[val][1].push(values[v].value[val][1][0]);
						}
						exists = false;
						break;
					}
				}
				exists = true;
			} else if (values[v].type == "ObjectExpression") {
				for (var val in values[v].value) {
					if (item[0].value[val] === undefined) continue;
					if (values[v].value[val][0] != item[0].value[val][0]) {
						item[0].value[val].push(values[v].value[val][0]);
						exists = false;
						break;
					}
				}
				exists = true;
			} else if (values[v].type == item[0].type && values[v].value == item[0].value) {
				exists = true;
			}
		});

		if (!exists) {
			this.add([values[v]]);
		}
	}
}

var resultMap = new HashMap();

const features = [	"InitVariable",
					"AssignWithFuncCall",
					"AssignWithBitOperation",
					"PreFunctionObfuscation",
					"StringConcatation",
					"MaliciousFunctionCall",
					"FuncCallOnBinaryExpr",
					"FuncCallOnUnaryExpr",
					"FuncCallOnStringVariable",
					"FuncCallOnCallExpr",
					"NonLocalArrayAccess",
					"htmlCommentInScriptBlock"]

const scopes = [	"in_test",
					"in_main",
					"in_if",
					"in_loop",
					"in_function",
					"in_try",
					"in_switch",
					"in_return",
					"in_file"];

const KEYWORDS = [	"break", "case", "catch", "continue", "debugger", "default", 
					"delete", "do", "else", "finally", "for", "function", "if", 
					"in", "instanceof", "new", "return", "switch", "this", "throw",
					"try", "typeof", "var", "void", "while", "with"];

const PUNCTUATORS = [	"!","!=","!==","%","%=","&","&&","&=","(",")","*","*=","+",
						"++","+=",",","-","--","-=",".","/","/=",":",";","<","<<","<<=",
						"<=","=","==","===",">",">=",">>",">>=",">>>",">>>","?","[","]",
						"^","^=","{","|","|=","||","}","~"];

for (var k of KEYWORDS) {
	resultMap.set(k, 0);
}
for (var p of PUNCTUATORS) {
	resultMap.set(p, 0);
}

for (var f of features) {
	resultMap.set(f, 0);
}
for (var s of scopes) {
	resultMap.set(s, 0);
}



function updateResultMap(resultMap, featureType, scope) {
	var prevValue = resultMap.get(featureType);
	resultMap.set(featureType, prevValue+1);

	prevValue = resultMap.get(scope);
	resultMap.set(scope, prevValue+1);
}

function showResult(resultMap, codeLength) {
	var resultArray = [];
	resultMap.forEach(function(value, key){
		resultArray.push(value);
	});
	console.log(`"`+filePath+`",`+resultArray)
}

function printHeader(resultMap) {
	var header = [];
	resultMap.forEach(function(value, key){
		header.push(`"`+key+`"`);
	});
	console.log("header,"+header);
}

// static analysis fields
var numberOfTokens = 0;

function parseProgram(program, scope, coefficient, varMap, verbose){
	// TODO: check program === null, program == undefined
	if (program === null || program === undefined || program.replace(/\s+/g, "") == "") return varMap.toList();
	var ast = ASTUtils.parse(program);

	// parse main program tokens
	if (scope == "User_Program") {
		numberOfTokens = ast.tokens.length;
		for (const pt of ast.tokens) {
			if (pt.type == "Keyword") {
				var prevValue = resultMap.get(pt.value);
				if (prevValue === undefined) console.log("!!!!!!!!!!!", pt);
				resultMap.set(pt.value, prevValue+1);
			} else if (pt.type == "Punctuator") {
				var prevValue = resultMap.get(pt.value);
				if (prevValue === undefined) console.log("!!!!!!!!!!!", pt);
				resultMap.set(pt.value, prevValue+1);
			}
		}
	}

	// iterate through each AST node
	for (var i in ast.body){
		var astNode = new Functions.AST(ast);

		if (verbose>1 && (ast.body[i].type != "Line")) console.log("======================\n", ast.body[i],"\n======================\n");
		
		var stringConcat = astNode.checkStringConcatnation(i);
		if (stringConcat != "") {
			if (verbose>0) console.log("FEATURE[StringConcatation] :" + stringConcat);
			updateResultMap(resultMap, "StringConcatation", coefficient);
		}


		/* Variable Declaration */
		if (astNode.isVariableDeclaration(i)) {
			var declaration_blocks = astNode.getAllDeclarationBlocks(i);
			for (var block in declaration_blocks) {
				var variableName_Type = astNode.getVariableInitValue(i, declaration_blocks[block], varMap, verbose);
				var variableName_Types = variableName_Type[1];
				for (var v in variableName_Types) {
					if (variableName_Types[v].type == "ArrayExpression" || 
						variableName_Types[v].type == "NewExpression") {
						varMap.setVariable(variableName_Type[0], [variableName_Types[v]], verbose);
					} else if (variableName_Types[v].type == "pre_Function"){
						// e.g. var myVariable = eval;	
						if (verbose>0) console.log("FEATURE[PreFunctionObfuscation] :[", variableName_Type[0], "] -> [", variableName_Types[v].value, "]")
						updateResultMap(resultMap, "PreFunctionObfuscation", coefficient);
						varMap.setVariable(variableName_Type[0], [variableName_Types[v]], verbose);
					} else {
						if (astNode.hasFunctionExpression(i)) {
							//FunctionExpression
							ASTUtils.traverse(ast.body[i], function(node){
								if (node.type == "FunctionExpression"){
									if (verbose>0) console.log("FEATURE[InitVariable] in :" + scope + ", Init Variable by "+variableName_Types[v].type +":" + variableName_Type[0] + "=" +variableName_Types[v].value);
								
									var emptyVarMap = new Functions.VariableMap(varMap._varMap);
									// assume all function parameters might be String type when parsing function body
									astNode.updateFunctionParams(i, emptyVarMap);
									
									var returnStatement = astNode.getReturnInstructions(i, ast);
									astNode.removeJumpInstructions(i, ast);
									// parse function body
									parseProgram(ASTUtils.getCode(node.body).slice(1,-1), variableName_Types[v].value, "in_function", emptyVarMap, verbose);
									for (var returnS of returnStatement) {
										// parse return statement
										parseProgram(returnS, "ReturnStatement in " + variableName_Types[v].value, "in_return", emptyVarMap, verbose);
									}

									updateResultMap(resultMap, "InitVariable", coefficient);
								} 
							});
							varMap.setVariable(variableName_Type[0], [variableName_Types[v]], verbose);
						} else if (variableName_Types[v].type == "Expression") {
							if (verbose>0) console.log("FEATURE[InitVariable] in :" + scope + ", Init Variable by "+variableName_Types[v].type +":" + variableName_Type[0] + "=" +variableName_Types[v].value);
							updateResultMap(resultMap, "InitVariable", coefficient);
							varMap.setVariable(variableName_Type[0], [variableName_Types[v]], verbose);
						} else {
							varMap.setVariable(variableName_Type[0], [variableName_Types[v]], verbose);
						}
					}
				}
			}
		}
		else if (astNode.isExpressionStatement(i)) {
			if (astNode.isAssignmentExpression(i)) {
				var var_values = astNode.getAssignmentLeftRight(i, varMap, verbose);

				for (var v in var_values[1]){
					if (var_values[1][v].type == "BitwiseOperationExpression" ||
						var_values[1][v].type == "FunctionCall") {
						if (var_values[1][v].type == "BitwiseOperationExpression") {
							if (verbose>0) console.log("FEATURE[AssignWithBitOperation] in :" + scope + ", "+var_values[1][v].type +":" + var_values[0] + "=" +var_values[1][v].value);
							updateResultMap(resultMap, "AssignWithBitOperation", coefficient);
						} else {
							if (verbose>0) console.log("FEATURE[AssignWithFuncCall] in :" + scope + ", "+var_values[1][v].type +":" + var_values[0] + "=" +var_values[1][v].value);
							updateResultMap(resultMap, "AssignWithFuncCall", coefficient);
						}
						ASTUtils.traverse(ast.body[i], function(node){
							if (node.type == "CallExpression"){
								if (node.callee.type == "MemberExpression") {
									var callee = node.callee.property.name;
								} else {
									var callee = node.callee.name;
								}
								if (callee !== undefined ) {
									var types = varMap.get(callee);
									for (var t in types) {
										if (types[t].type == "pre_Function") {
											if (verbose>0) console.log("FEATURE[MaliciousFunctionCall] :", ASTUtils.getCode(node));
											updateResultMap(resultMap, "MaliciousFunctionCall", coefficient);
										}
									}
								}
							}
						});
						
					} else if (var_values[1][v].type == "FunctionExpression") {
						ASTUtils.traverse(ast.body[i], function(node){
							if (node.type == "FunctionExpression"){
								var emptyVarMap = new Functions.VariableMap(varMap._varMap);
								// assume all function parameters might be String type when parsing function body
								astNode.updateFunctionParams(i, emptyVarMap);
								
								var returnStatement = astNode.getReturnInstructions(i, ast);
								astNode.removeJumpInstructions(i, ast);

								// parse function body
								parseProgram(ASTUtils.getCode(node.body).slice(1,-1), var_values[1][v].value, "in_function", emptyVarMap, verbose);
								for (var returnS of returnStatement) {
									// parse return statement
									parseProgram(returnS, "ReturnStatement in " + var_values[1][v].value, "in_return", emptyVarMap, verbose);
								}
							} 
						});
					} else {
						ASTUtils.traverse(ast.body[i], function(node){
							if (node.type == "AssignmentExpression") {
								var var_value = astNode.checkStaticMemberFunctionCall(node, varMap);
								if (var_value !== undefined) {
									if (verbose>0) console.log("FEATURE[PreFunctionObfuscation] :[", var_value[0], "] -> [", var_value[1].value, "]")
									updateResultMap(resultMap, "PreFunctionObfuscation", coefficient);
								}
							}
							if (node.type == "CallExpression"){
								// TODO: parse body?
								// x += String.fromCharCode(0);
								// console.log(">>", ASTUtils.getCode(node))
								parseProgram(ASTUtils.getCode(node), "CallExpression", "in_function", varMap, verbose);

								if (node.type == "CallExpression"){
									if (node.callee.type == "MemberExpression") {
										var callee = node.callee.property.name;
									} else {
										var callee = node.callee.name;
									}
									if (callee !== undefined ) {
										var types = varMap.get(callee);
										for (var t in types) {
											if (types[t].type == "pre_Function") {
												if (verbose>0) console.log("FEATURE[MaliciousFunctionCall] :", ASTUtils.getCode(node));
												updateResultMap(resultMap, "MaliciousFunctionCall", coefficient);
											}
										}
									}
								}
							}
						});
					}
				}

				varMap.updateVariable(var_values[0], var_values[1], verbose);

			} else if (astNode.isUpdateExpression(i)) {
				var var_value = astNode.getUpdateExpression(i, varMap, verbose);
				// ++, --, etc.
			} else {
				// single identifier expressions, (e.g. x;) skip to next expression
				if (astNode._node.body[i].expression.type == "Identifier") {
					var var_values = varMap.get(astNode._node.body[i].expression.name);
					if (var_values === undefined) {
						varMap.updateVariable(astNode._node.body[i].expression.name, [{ type: 'undefined', value: 'undefined' }]);
					}
					continue;
				}


				var funcName = "";
				// if expression is function call
				if (astNode._node.body[i].expression.callee) {
					funcName = astNode.getCalleeName(i, varMap);
				}
				
				var funcNames = varMap.get(funcName);
				// if (var_values === undefined) {
				// 	ASTUtils.traverse(ast.body[i], function(node){
				// 		if (node.type == "CallExpression"){
				// 			var callee = node.callee.name;
				// 			if (node.callee.name !== undefined && varMap.get(callee) === undefined) {
				// 				if (verbose>0) console.log("FEATURE[UndefinedFunction] in :" + scope + ":" + callee);
				// 				updateResultMap(resultMap, "UndefinedFunction", coefficient);
				// 			}
				// 		}
				// 	});
				// }

				for (var f in funcNames) {
					if (funcNames[f].type != "pre_Function" && funcNames[f].type != "user_Function" ) {
						continue; 
					}

					var user_defined_funName = "";

					if (funcNames[f] != undefined && funcNames[f].value != funcName && funcNames[f].type == "pre_Function"){
						user_defined_funName = funcNames[f].value;
					}

					if (funcNames[f].type == "pre_Function" || funcNames[f].type == "user_Function") {
						var args = astNode.getFunctionArguments(i, varMap);

						// JS will ignore extra parameters, if function is defined with only one parameter
						// Attacker might add more unuse d parameters to confuse the detector
						if (args.length >= 1) {
							if (args[0].type == "String") {
								if (verbose>0) console.log("FEATURE[FuncCallOnStringVariable] in :" + scope + ": " + funcNames[f].type + ":" + funcName + "(STRING) => " + funcNames[f].value + "(" + args[0].value + ")");
								updateResultMap(resultMap, "FuncCallOnStringVariable", coefficient);
							} else if (args[0].type == "Identifier" ||
									   args[0].type == "ArrayMemberExpression" || 
									   args[0].type == "FieldMemberExpression" ) {
								// pre-processing 
								if (args[0].type == "ArrayMemberExpression") {
									var object  = args[0].value[0];
									var indices = args[0].value[1];
									var r_vs;

									if (object instanceof Array) {
										var indx = [];
										while (object instanceof Array) {
											var obj = varMap.get(object[0]);
											if (obj == undefined) {
												if (verbose>0) console.log("FEATURE[NonLocalArrayAccess] in :" + scope + ": Accessing non-local array object: " + ASTUtils.getCode(astNode._node.body[i]));
												updateResultMap(resultMap, "NonLocalArrayAccess", coefficient);
											}
											indx = indx.concat(object[1]);
											object = object[0];
										}
										for (var ii = indx.length-1; ii >=0;ii--){
											var objIndex = indx[ii].value;
											if (obj !== undefined) obj = obj[0].value[objIndex][1];
										}
										r_vs = obj;
									} else {
										r_vs = varMap.get(object);
										if (r_vs === undefined) { 
											if (verbose>0) console.log("FEATURE[NonLocalArrayAccess] in :" + scope + ": Accessing non-local array object: " + ASTUtils.getCode(astNode._node.body[i]));
											updateResultMap(resultMap, "NonLocalArrayAccess", coefficient);
										}
									}
									
									var ref_values = [];

									for (var inx in indices){
										// skip " when handling object field access aka o["f"] => o.f
										// indices will be `"f"` instead of [{type:"Numeric", value:2}]
										if (indices[inx] == "") continue;

										index = indices[inx].value;
										for (var r in r_vs){
											var array_values = r_vs[r];
											if (r_vs[r].type == "ObjectExpression") {
												const field = r_vs[r].value[index.replace(/"/g,"")];
												if (field !== undefined) {
													ref_values = ref_values.concat(field);
												} 
												continue;
											}
											
											if (r_vs[r].type == "ArrayExpression" || r_vs[r].type == "NewExpression") {
												if (index !== undefined) {
													ref_values = ref_values.concat(r_vs[r].value[index][1]);
												} 
											}
										}
									}

								} else if (args[0].type == "FieldMemberExpression") {
									const object = args[0].value[0];
									const fields = args[0].value[1];
									const r_vs = varMap.get(object);

									var ref_values = [];

									for (var f in fields) {
										const field = fields[f];
										for (var r in r_vs){
											if (r_vs[r].type == "ObjectExpression" && field !== undefined) {
												ref_values = ref_values.concat(r_vs[r].value[field.value]);
											}
										}
									}
								} else {
									/* args[0].type == "Identifier" 
									 * we assume the parameter passed in can be type String */
									var ref_values = varMap.get(args[0].value, verbose);
									if (ref_values === undefined) {
										ref_values = [ { type: 'String', value: 'UNKNOWN' } ];
									}
								}

								if (ref_values.length == 0)  {
									console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", args[0])
									continue;
								}

								// ref_values are all possible values for one variable, e.g. {key:a, value:["Str1",0,"Str2"]}
								for (var ref in ref_values) {
									if (ref_values[ref] && ref_values[ref].type == "String") {
										if (verbose>0) console.log("FEATURE[FuncCallOnStringVariable] in :" + scope + ": "+funcName+"(Object->STRING) => [" + args[0].value + "] ==> "+funcName+"(" + ref_values[ref].value + ")");
										updateResultMap(resultMap, "FuncCallOnStringVariable", coefficient);
									} else if (ref_values[ref] && ref_values[ref].type == "Expression") {
										if (verbose>0) console.log("FEATURE[FuncCallOnStringVariable] in :" + scope + ": "+funcName+"(Expr) => [" + args[0].value + "] ==> "+funcName+"(" + ref_values[ref].value + ")");
										updateResultMap(resultMap, "FuncCallOnStringVariable", coefficient);
									}
								}							
							} else if (args[0].type == "BinaryExpression") {
								if (verbose>0) console.log("FEATURE[FuncCallOnBinaryExpr] in :" + scope + ": "+funcName+"(" + args[0].type + ") => "+funcName+"(" + args[0].value + ")");
								updateResultMap(resultMap, "FuncCallOnBinaryExpr", coefficient);
							} else if (args[0].type == "UnaryExpression") {
								if (verbose>0) console.log("FEATURE[FuncCallOnUnaryExpr] in :" + scope + ": "+funcName+"(" + args[0].type + ") => "+funcName+"(" + args[0].value + ")");
								updateResultMap(resultMap, "FuncCallOnUnaryExpr", coefficient);
							} else if (args[0].type == "CallExpression") {
								if (verbose>0) console.log("FEATURE[FuncCallOnCallExpr] in :" + scope + ": "+funcName+"(" + args[0].type + ") => "+funcName+"(" + args[0].value + ")");
								updateResultMap(resultMap, "FuncCallOnCallExpr", coefficient);
							} else {
								// args[0].type == "Numeric"
							}
						}
					}
					
				}
			} 
		} else if (astNode.isFunctionDeclaration(i)) {
			// if node type is FunctionDeclaration, it must has function Name
			funcName = astNode.getFunctionName(i);
			varMap.setVariable(funcName, [{ type: 'user_Function', value: funcName }]);
			var emptyVarMap = new Functions.VariableMap(varMap._varMap);

			// assume all function parameters might be String type when parsing function body
			astNode.updateFunctionParams(i, emptyVarMap);
			var returnStatement = astNode.getReturnInstructions(i, ast);
			astNode.removeJumpInstructions(i, ast);
			// parse function body
			parseProgram(ASTUtils.getCode(ast.body[i].body).slice(1, -1), funcName, "in_function", emptyVarMap, verbose);
			for (var returnS of returnStatement) {
				// parse return statement
				parseProgram(returnS, "ReturnStatement in " + funcName, "in_return", emptyVarMap, verbose);
			}
		} else if (astNode.isIfElseStatement(i)) {
			astNode.removeJumpInstructions(i, ast);
			
			const branchExprs = astNode.parseIfStatement(i, varMap, verbose);
			var diffMap = new Functions.VariableMap(new HashMap());
			// varMap.printMap();
			for (var b in branchExprs){
				var eVarMap = new Functions.VariableMap(varMap._varMap);
				const ifbranchVarMapList = parseProgram(branchExprs[b], "if_statements", "in_if", eVarMap, verbose);

				ifbranchVarMapList.forEach(function(val1) {
					// variable in @varMap
					var var_values = varMap.get(val1.key);

					// value updated in if-branch OR new value created in if-branche
					// console.log (listEqual(var_values, val1.value))
					for (var v in var_values) {
						if (var_values[v] != val1.value) {
							var prevValues = diffMap.get(val1.key);
							
							// check if value already in @diffMap
							if (prevValues) { 
								prevValues.my_add(val1.value);
								diffMap.setVariable(val1.key, prevValues);
							} else {
								var typeSet = new Set();
								typeSet.my_add(val1.value);
								diffMap.setVariable(val1.key, typeSet);
							}
						} 
					}
					
				});
			}

			diffMap.multipleUpdate(varMap);

		}else if (astNode.isIfStatement(i)) {
			astNode.removeJumpInstructions(i, ast);

			const branchExprs = astNode.parseIfStatement(i, varMap, verbose);
			var diffMap = new Functions.VariableMap(new HashMap());

			for (var b in branchExprs){
				var eVarMap = new Functions.VariableMap(varMap._varMap);
				const ifbranchVarMapList = parseProgram(branchExprs[b], "if_statements", "in_if", eVarMap, verbose);

				ifbranchVarMapList.forEach(function(val1) {
					var prevBranch = diffMap.get(val1.key);

					// check if value already in @diffMap
					if (prevBranch) {
						prevBranch.my_add(val1.value);
						diffMap.setVariable(val1.key, prevBranch);
					} else {
						const prevValues = varMap.get(val1.key);
						var typeSet = new Set();

						// if variable exists in main program and been updated in if-branch, add the prev_value
						if (prevValues && !listEqual(prevValues, val1.value)) typeSet.my_add(prevValues);

						typeSet.my_add(val1.value);
						diffMap.setVariable(val1.key, typeSet);
					}
				});
			}
			diffMap.multipleUpdate(varMap);

		} else if (astNode.isForStatement(i) || astNode.isForInStatement(i)) {
			astNode.removeJumpInstructions(i, ast);

			const bodyExprs = astNode.parseForStatement(i, varMap, verbose);
			var diffMap = new Functions.VariableMap(new HashMap());

			// parse for condition
			const subVarMapList1 = parseProgram(bodyExprs[0], "for_statements", "in_loop", varMap, verbose);
			subVarMapList1.forEach(function(val1) {
				var typeSet = new Set();
				if (astNode.isForInStatement(i)) {
					typeSet.my_add([ { type: 'Numeric', value: '0' } ]);
				} else if (astNode.isForStatement(i) && val1.value.length > 0){
					if (val1.value[0].type == "undefined" && val1.value[0].value == "undefined") {
						typeSet.my_add(varMap.get(val1.key));
					} else {
						typeSet.my_add(val1.value);
					}
				} 
				diffMap.setVariable(val1.key, typeSet);
			});
			diffMap.multipleUpdate(varMap);

			// parse for body with current varMap
			var eVarMap = new Functions.VariableMap(varMap._varMap);

			const subVarMapList2 = parseProgram(bodyExprs[1], "for_statements", "in_loop", eVarMap, verbose);
			subVarMapList2.forEach(function(val1) {
				var prevValues = varMap.get(val1.key);
				var typeSet = new Set();

				// if variable exists in main program and been updated in for-body, add the prev_value
				if (prevValues && prevValues != val1.value) typeSet.my_add(prevValues);

				typeSet.my_add(val1.value);
				diffMap.setVariable(val1.key, typeSet);
			});
			diffMap.multipleUpdate(varMap);

		} else if (astNode.isWhileStatement(i)) {
			astNode.removeJumpInstructions(i, ast);

			const bodyExprs = astNode.parseWhileStatement(i, varMap, verbose);
			var diffMap = new Functions.VariableMap(new HashMap());
			var eVarMap = new Functions.VariableMap(varMap._varMap);

			const subVarMapList = parseProgram(bodyExprs[0], "while_statements", "in_loop", eVarMap, verbose);
			subVarMapList.forEach(function(val1) {
				const prevValues = varMap.get(val1.key);
				var typeSet = new Set();

				// if variable exists in main program and been updated in while-body, add the prev_value
				if (prevValues && prevValues != val1.value) typeSet.my_add(prevValues);

				typeSet.my_add(val1.value);
				diffMap.setVariable(val1.key, typeSet);
			});
			diffMap.multipleUpdate(varMap);

		} else if (astNode.isDoWhileStatement(i)) {
			astNode.removeJumpInstructions(i, ast);

			const bodyExprs = astNode.parseWhileStatement(i, varMap, verbose);
			// update varMap directly since the body code will always be executed at least once in do-while
			parseProgram(bodyExprs[0], "while_statements", "in_loop", varMap, verbose);
		} else if (astNode.isTryStatement(i)) {
			astNode.removeJumpInstructions(i, ast);

			const bodyExprs = astNode.parseTryStatement(i, varMap, verbose);

			var eVarMap1 = new Functions.VariableMap(varMap._varMap);
			var eVarMap2 = new Functions.VariableMap(varMap._varMap);

			const tryVarMapList   = parseProgram(bodyExprs[0], "Try_statements",   "in_try", eVarMap1, verbose);
			const catchVarMapList = parseProgram(bodyExprs[1], "Catch_statements", "in_try", eVarMap2, verbose);
			
			var diffMap = new Functions.VariableMap(new HashMap());

			//check variables exists in try branch
			tryVarMapList.forEach(function(val1) {
				var changedInCatchBranch = false;
				catchVarMapList.forEach(function(val2){
					// variable exists in both try/catch branches with different values
					if (val2.key == val1.key && val2.value != val1.value) {
						var typeSet = new Set();
						typeSet.my_add(val1.value);
						typeSet.my_add(val2.value);
						diffMap.setVariable(val1.key, typeSet);
						changedInCatchBranch = true;
					}
				});

				// this variable only exists in try branch but NOT in catch branch
				if (!changedInCatchBranch) {
					var prevValues = varMap.get(val1.key);
					var typeSet = new Set();
					// if variable exists in main program, add the prev_value
					if (prevValues && prevValues != val1.value) {
						typeSet.my_add(prevValues);
					} 
					typeSet.my_add(val1.value);
					diffMap.setVariable(val1.key, typeSet);
				}
			});

			// check variables only exists in catch branch but NOT in try branch
			catchVarMapList.forEach(function(val1){
				// if varible exists in try branch must be in diffMap
				// i.e. all keys that didn't exists in diffMap are new variables
				if (diffMap.get(val1.key) === undefined) {
					var prevValues = varMap.get(val1.key);
					var typeSet = new Set();
					// if variable exists in main program, add the prev_value
					if (prevValues && prevValues.value != val1.value) {
							typeSet.my_add(prevValues);
					} 
					typeSet.my_add(val1.value);
					diffMap.setVariable(val1.key, typeSet);
				}
			});

			// check if there exists finally block
			if (bodyExprs.length == 3) {
				//finally branch
				var eVarMap3 = new Functions.VariableMap(new HashMap());
				
				// use empty varMap to parse finally block
				// @finallyVarMapList : contains all new declaried variable in finally block
				const finallyVarMapList = parseProgram(bodyExprs[2], "test", "in_test", eVarMap3, false);
				
				// copy variables from @diffMap, parse finally block for detecting malicious patterns
				diffMap.multipleUpdate(eVarMap3);
				parseProgram(bodyExprs[2], "Finally_statements", "in_try", eVarMap3, verbose);

				// for all @val in @finallyVarMapList, added to @diffMap regradless their previous value
				finallyVarMapList.forEach(function(val1){
					var typeSet = new Set();
					typeSet.my_add(val1.value);
					diffMap.setVariable(val1.key, typeSet);
				});

				// copy @diffMap values to @varMap
				diffMap.multipleUpdate(varMap);
			} else {
				diffMap.multipleUpdate(varMap);
			}
		} else if (astNode.isSwitchStatement(i)) {
			// astNode.removeJumpInstructions(i, ast);

			const bodyExprs_defaultCaseIndex = astNode.parseSwitchStatement(ast, i, varMap, verbose);
			const bodyExprs = bodyExprs_defaultCaseIndex[0];
			const default_case = bodyExprs_defaultCaseIndex[1];

			var diffMap = new Functions.VariableMap(new HashMap());


			if (default_case != -1) {
				// parse default case first, this case will be executed if non-of the cases matched,
				// i.e. will override main scope values anyway
				parseProgram(bodyExprs[default_case], "switch_statements", "in_switch", varMap, false);
			}

			for (var b = 0; b < bodyExprs.length; b++){
				// skip the default case
				if (b == default_case) continue;

				var eVarMap = new Functions.VariableMap(varMap._varMap);
				const switchBranchVarMapList = parseProgram(bodyExprs[b], "switch_statements", "in_switch", eVarMap, verbose);

				switchBranchVarMapList.forEach(function(val1) {
					var prevBranch = diffMap.get(val1.key);

					// check if value already in @diffMap
					if (prevBranch) {
						prevBranch.my_add(val1.value);
						diffMap.setVariable(val1.key, prevBranch);
					} else {
						const prevValues = varMap.get(val1.key);
						var typeSet = new Set();

						// if variable exists in main program and been updated in if-branch, add the prev_value
						if (prevValues && !listEqual(prevValues, val1.value)) typeSet.my_add(prevValues);

						typeSet.my_add(val1.value);
						diffMap.setVariable(val1.key, typeSet);
					}
				});
			}
			diffMap.multipleUpdate(varMap);
		}
	}
	if (verbose>1 && scope == "User_Program") varMap.printMap();
	return varMap.toList();
}

//===================check input source============================
if (showHeader) {
	printHeader(resultMap)
} else if (filePath !== undefined && filePath !== null) {
	var sourcefile = fs.readFileSync(filePath, "utf8");

	// extract all scattered <script>blocks</script>
	var match = sourcefile.match('<[Ss][Cc][Rr][Ii][Pp][Tt][^>]*>(?:[^<]+|<(?!/[Ss][Cc][Rr][Ii][Pp][Tt]>))+');

	var scriptCodes = "";
	if (match !== null) {
		while (match !== null) {
			const matchLength = match[0].length;
			const scriptBlock = match[0].substring(match[0].indexOf(">")+1,match[0].length);

			var htmlCommentInScriptBlock = scriptBlock.match(/<!--[\s\S]*?-->/g, "");
			if (htmlCommentInScriptBlock !== null) {
				if (verbose>0) console.log("FEATURE[htmlCommentInScriptBlock]");
				updateResultMap(resultMap, "htmlCommentInScriptBlock", "in_file");
			}

			scriptCodes = scriptCodes + scriptBlock;
			sourcefile = sourcefile.substring(matchLength+1, sourcefile.length);
			match = sourcefile.match('<[Ss][Cc][Rr][Ii][Pp][Tt][^>]*>(?:[^<]+|<(?!/[Ss][Cc][Rr][Ii][Pp][Tt]>))+');
		}
	} else {
		scriptCodes = sourcefile;
	}
	parseProgram(scriptCodes, "User_Program", "in_main", init_varMap, verbose);
	// if (calcualteWeight && resultMap.size > 0) showResult(resultMap, scriptCodes.length);
	if (calcualteWeight && resultMap.size > 0) showResult(resultMap, scriptCodes.length);
} 

