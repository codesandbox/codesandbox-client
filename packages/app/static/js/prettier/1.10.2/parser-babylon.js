'use strict';

var babylon = function () {
	function unwrapExports(x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var parserBabylon_1 = createCommonjsModule(function (module) {
		"use strict";
		function createError(t, e) {
			var s = new SyntaxError(t + " (" + e.start.line + ":" + e.start.column + ")");return s.loc = e, s;
		}function unwrapExports$$1(t) {
			return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
		}function createCommonjsModule$$1(t, e) {
			return e = { exports: {} }, t(e, e.exports), e.exports;
		}function parse(t, e, s) {
			var i = lib,
			    r = { sourceType: "module", allowImportExportEverywhere: !0, allowReturnOutsideFunction: !0, plugins: ["jsx", "flow", "doExpressions", "objectRestSpread", "decorators", "classProperties", "exportDefaultFrom", "exportNamespaceFrom", "asyncGenerators", "functionBind", "functionSent", "dynamicImport", "numericSeparator", "importMeta", "optionalCatchBinding", "optionalChaining", "classPrivateProperties", "pipelineOperator", "nullishCoalescingOperator"] },
			    a = s && "json" === s.parser ? "parseExpression" : "parse";var n = void 0;try {
				n = i[a](t, r);
			} catch (e) {
				try {
					n = i[a](t, Object.assign({}, r, { strictMode: !1 }));
				} catch (t) {
					throw parserCreateError(e.message.replace(/ \(.*\)/, ""), { start: { line: e.loc.line, column: e.loc.column + 1 } });
				}
			}return delete n.tokens, n;
		}var parserCreateError = createError,
		    lib = createCommonjsModule$$1(function (t, e) {
			function s(t, e) {
				t.prototype = Object.create(e.prototype), t.prototype.constructor = t, t.__proto__ = e;
			}function i(t) {
				var e = {};for (var s in C) {
					e[s] = t && null != t[s] ? t[s] : C[s];
				}return e;
			}function r(t) {
				var e = t.split(" ");return function (t) {
					return e.indexOf(t) >= 0;
				};
			}function a(t, e) {
				for (var s = 65536, i = 0; i < e.length; i += 2) {
					if ((s += e[i]) > t) return !1;if ((s += e[i + 1]) >= t) return !0;
				}return !1;
			}function n(t) {
				return t < 65 ? 36 === t : t < 91 || (t < 97 ? 95 === t : t < 123 || (t <= 65535 ? t >= 170 && j.test(String.fromCharCode(t)) : a(t, B)));
			}function o(t) {
				return t < 48 ? 36 === t : t < 58 || !(t < 65) && (t < 91 || (t < 97 ? 95 === t : t < 123 || (t <= 65535 ? t >= 170 && F.test(String.fromCharCode(t)) : a(t, B) || a(t, q))));
			}function h(t) {
				return 10 === t || 13 === t || 8232 === t || 8233 === t;
			}function p(t, e) {
				for (var s = 1, i = 0;;) {
					U.lastIndex = i;var r = U.exec(t);if (!(r && r.index < e)) return new X(s, e - i);++s, i = r.index + r[0].length;
				}throw new Error("Unreachable");
			}function c(t) {
				return t[t.length - 1];
			}function l(t) {
				return t <= 65535 ? String.fromCharCode(t) : String.fromCharCode(55296 + (t - 65536 >> 10), 56320 + (t - 65536 & 1023));
			}function u(t) {
				for (var e = {}, s = 0; s < t.length; s++) {
					e[t[s]] = !0;
				}return e;
			}function d(t) {
				return null != t && "Property" === t.type && "init" === t.kind && !1 === t.method;
			}function f(t) {
				return "DeclareExportAllDeclaration" === t.type || "DeclareExportDeclaration" === t.type && (!t.declaration || "TypeAlias" !== t.declaration.type && "InterfaceDeclaration" !== t.declaration.type);
			}function m(t) {
				return "type" === t.importKind || "typeof" === t.importKind;
			}function y(t) {
				return (t.type === I.name || !!t.type.keyword) && "from" !== t.value;
			}function x(t, e) {
				for (var s = [], i = [], r = 0; r < t.length; r++) {
					(e(t[r], r, t) ? s : i).push(t[r]);
				}return [s, i];
			}function P(t) {
				return !!t && ("JSXOpeningFragment" === t.type || "JSXClosingFragment" === t.type);
			}function v(t) {
				if ("JSXIdentifier" === t.type) return t.name;if ("JSXNamespacedName" === t.type) return t.namespace.name + ":" + t.name.name;if ("JSXMemberExpression" === t.type) return v(t.object) + "." + v(t.property);throw new Error("Node had unexpected type: " + t.type);
			}function g(t) {
				if (null == t) throw new Error('Unexpected ' + t + ' value.');return t;
			}function b(t) {
				if (!t) throw new Error("Assert fail");
			}function T(t) {
				switch (t) {case "any":
						return "TSAnyKeyword";case "boolean":
						return "TSBooleanKeyword";case "never":
						return "TSNeverKeyword";case "number":
						return "TSNumberKeyword";case "object":
						return "TSObjectKeyword";case "string":
						return "TSStringKeyword";case "symbol":
						return "TSSymbolKeyword";case "undefined":
						return "TSUndefinedKeyword";default:
						return;}
			}function w(t, e) {
				return new (t && t.plugins ? A(t.plugins) : ot)(t, e);
			}function A(t) {
				if (t.indexOf("decorators") >= 0 && t.indexOf("decorators2") >= 0) throw new Error("Cannot use decorators and decorators2 plugin together");var e = t.filter(function (t) {
					return "estree" === t || "flow" === t || "jsx" === t || "typescript" === t;
				});if (e.indexOf("flow") >= 0 && (e = e.filter(function (t) {
					return "flow" !== t;
				})).push("flow"), e.indexOf("flow") >= 0 && e.indexOf("typescript") >= 0) throw new Error("Cannot combine flow and typescript plugins.");e.indexOf("typescript") >= 0 && (e = e.filter(function (t) {
					return "typescript" !== t;
				})).push("typescript"), e.indexOf("estree") >= 0 && (e = e.filter(function (t) {
					return "estree" !== t;
				})).unshift("estree");var s = e.join("/"),
				    i = dt[s];if (!i) {
					i = ot;for (var r = 0, a = e; r < a.length; r++) {
						var n = a[r];i = nt[n](i);
					}dt[s] = i;
				}return i;
			}function N(t) {
				return t.program.body.some(function (t) {
					return "ImportDeclaration" === t.type && (!t.importKind || "value" === t.importKind) || "ExportNamedDeclaration" === t.type && (!t.exportKind || "value" === t.exportKind) || "ExportAllDeclaration" === t.type && (!t.exportKind || "value" === t.exportKind) || "ExportDefaultDeclaration" === t.type;
				});
			}Object.defineProperty(e, "__esModule", { value: !0 });var C = { sourceType: "script", sourceFilename: void 0, startLine: 1, allowReturnOutsideFunction: !1, allowImportExportEverywhere: !1, allowSuperOutsideMethod: !1, plugins: [], strictMode: null, ranges: !1, tokens: !1 },
			    E = !0,
			    k = function k(t, e) {
				void 0 === e && (e = {}), this.label = t, this.keyword = e.keyword, this.beforeExpr = !!e.beforeExpr, this.startsExpr = !!e.startsExpr, this.rightAssociative = !!e.rightAssociative, this.isLoop = !!e.isLoop, this.isAssign = !!e.isAssign, this.prefix = !!e.prefix, this.postfix = !!e.postfix, this.binop = 0 === e.binop ? 0 : e.binop || null, this.updateContext = null;
			},
			    S = function (t) {
				function e(e, s) {
					return void 0 === s && (s = {}), s.keyword = e, t.call(this, e, s) || this;
				}return s(e, t), e;
			}(k),
			    L = function (t) {
				function e(e, s) {
					return t.call(this, e, { beforeExpr: E, binop: s }) || this;
				}return s(e, t), e;
			}(k),
			    I = { num: new k("num", { startsExpr: !0 }), bigint: new k("bigint", { startsExpr: !0 }), regexp: new k("regexp", { startsExpr: !0 }), string: new k("string", { startsExpr: !0 }), name: new k("name", { startsExpr: !0 }), eof: new k("eof"), bracketL: new k("[", { beforeExpr: E, startsExpr: !0 }), bracketR: new k("]"), braceL: new k("{", { beforeExpr: E, startsExpr: !0 }), braceBarL: new k("{|", { beforeExpr: E, startsExpr: !0 }), braceR: new k("}"), braceBarR: new k("|}"), parenL: new k("(", { beforeExpr: E, startsExpr: !0 }), parenR: new k(")"), comma: new k(",", { beforeExpr: E }), semi: new k(";", { beforeExpr: E }), colon: new k(":", { beforeExpr: E }), doubleColon: new k("::", { beforeExpr: E }), dot: new k("."), question: new k("?", { beforeExpr: E }), questionDot: new k("?."), arrow: new k("=>", { beforeExpr: E }), template: new k("template"), ellipsis: new k("...", { beforeExpr: E }), backQuote: new k("`", { startsExpr: !0 }), dollarBraceL: new k("${", { beforeExpr: E, startsExpr: !0 }), at: new k("@"), hash: new k("#"), eq: new k("=", { beforeExpr: E, isAssign: !0 }), assign: new k("_=", { beforeExpr: E, isAssign: !0 }), incDec: new k("++/--", { prefix: !0, postfix: !0, startsExpr: !0 }), bang: new k("!", { beforeExpr: E, prefix: !0, startsExpr: !0 }), tilde: new k("~", { beforeExpr: E, prefix: !0, startsExpr: !0 }), pipeline: new L("|>", 0), nullishCoalescing: new L("??", 1), logicalOR: new L("||", 1), logicalAND: new L("&&", 2), bitwiseOR: new L("|", 3), bitwiseXOR: new L("^", 4), bitwiseAND: new L("&", 5), equality: new L("==/!=", 6), relational: new L("</>", 7), bitShift: new L("<</>>", 8), plusMin: new k("+/-", { beforeExpr: E, binop: 9, prefix: !0, startsExpr: !0 }), modulo: new L("%", 10), star: new L("*", 10), slash: new L("/", 10), exponent: new k("**", { beforeExpr: E, binop: 11, rightAssociative: !0 }) },
			    M = { break: new S("break"), case: new S("case", { beforeExpr: E }), catch: new S("catch"), continue: new S("continue"), debugger: new S("debugger"), default: new S("default", { beforeExpr: E }), do: new S("do", { isLoop: !0, beforeExpr: E }), else: new S("else", { beforeExpr: E }), finally: new S("finally"), for: new S("for", { isLoop: !0 }), function: new S("function", { startsExpr: !0 }), if: new S("if"), return: new S("return", { beforeExpr: E }), switch: new S("switch"), throw: new S("throw", { beforeExpr: E, prefix: !0, startsExpr: !0 }), try: new S("try"), var: new S("var"), let: new S("let"), const: new S("const"), while: new S("while", { isLoop: !0 }), with: new S("with"), new: new S("new", { beforeExpr: E, startsExpr: !0 }), this: new S("this", { startsExpr: !0 }), super: new S("super", { startsExpr: !0 }), class: new S("class"), extends: new S("extends", { beforeExpr: E }), export: new S("export"), import: new S("import", { startsExpr: !0 }), yield: new S("yield", { beforeExpr: E, startsExpr: !0 }), null: new S("null", { startsExpr: !0 }), true: new S("true", { startsExpr: !0 }), false: new S("false", { startsExpr: !0 }), in: new S("in", { beforeExpr: E, binop: 7 }), instanceof: new S("instanceof", { beforeExpr: E, binop: 7 }), typeof: new S("typeof", { beforeExpr: E, prefix: !0, startsExpr: !0 }), void: new S("void", { beforeExpr: E, prefix: !0, startsExpr: !0 }), delete: new S("delete", { beforeExpr: E, prefix: !0, startsExpr: !0 }) };Object.keys(M).forEach(function (t) {
				I["_" + t] = M[t];
			});var D = { 6: r("enum await"), strict: r("implements interface let package private protected public static yield"), strictBind: r("eval arguments") },
			    O = r("break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this let const class extends export import yield super"),
			    R = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠ-ࢴࢶ-ࢽऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲈᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿕ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞮꞰ-ꞷꟷ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭥꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ",
			    _ = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࣔ-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఃా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ഁ-ഃാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ංඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ູົຼ່-ໍ໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜔ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠐-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭ᳲ-᳴᳸᳹᷀-᷵᷻-᷿‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱꤀-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿",
			    j = new RegExp("[" + R + "]"),
			    F = new RegExp("[" + R + _ + "]");R = _ = null;var B = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 17, 26, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 157, 310, 10, 21, 11, 7, 153, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 26, 45, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 785, 52, 76, 44, 33, 24, 27, 35, 42, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 54, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 86, 25, 391, 63, 32, 0, 449, 56, 264, 8, 2, 36, 18, 0, 50, 29, 881, 921, 103, 110, 18, 195, 2749, 1070, 4050, 582, 8634, 568, 8, 30, 114, 29, 19, 47, 17, 3, 32, 20, 6, 18, 881, 68, 12, 0, 67, 12, 65, 0, 32, 6124, 20, 754, 9486, 1, 3071, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 4149, 196, 60, 67, 1213, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42710, 42, 4148, 12, 221, 3, 5761, 10591, 541],
			    q = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 1306, 2, 54, 14, 32, 9, 16, 3, 46, 10, 54, 9, 7, 2, 37, 13, 2, 9, 52, 0, 13, 2, 49, 13, 10, 2, 4, 9, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 57, 0, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 87, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 423, 9, 838, 7, 2, 7, 17, 9, 57, 21, 2, 13, 19882, 9, 135, 4, 60, 6, 26, 9, 1016, 45, 17, 3, 19723, 1, 5319, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 2214, 6, 110, 6, 6, 9, 792487, 239],
			    V = /\r\n?|\n|\u2028|\u2029/,
			    U = new RegExp(V.source, "g"),
			    K = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/,
			    W = function W(t, e, s, i) {
				this.token = t, this.isExpr = !!e, this.preserveSpace = !!s, this.override = i;
			},
			    G = { braceStatement: new W("{", !1), braceExpression: new W("{", !0), templateQuasi: new W("${", !0), parenStatement: new W("(", !1), parenExpression: new W("(", !0), template: new W("`", !0, !0, function (t) {
					return t.readTmplToken();
				}), functionExpression: new W("function", !0) };I.parenR.updateContext = I.braceR.updateContext = function () {
				if (1 !== this.state.context.length) {
					var t = this.state.context.pop();t === G.braceStatement && this.curContext() === G.functionExpression ? (this.state.context.pop(), this.state.exprAllowed = !1) : t === G.templateQuasi ? this.state.exprAllowed = !0 : this.state.exprAllowed = !t.isExpr;
				} else this.state.exprAllowed = !0;
			}, I.name.updateContext = function (t) {
				"of" !== this.state.value || this.curContext() !== G.parenStatement ? (this.state.exprAllowed = !1, t !== I._let && t !== I._const && t !== I._var || V.test(this.input.slice(this.state.end)) && (this.state.exprAllowed = !0)) : this.state.exprAllowed = !t.beforeExpr;
			}, I.braceL.updateContext = function (t) {
				this.state.context.push(this.braceIsBlock(t) ? G.braceStatement : G.braceExpression), this.state.exprAllowed = !0;
			}, I.dollarBraceL.updateContext = function () {
				this.state.context.push(G.templateQuasi), this.state.exprAllowed = !0;
			}, I.parenL.updateContext = function (t) {
				var e = t === I._if || t === I._for || t === I._with || t === I._while;this.state.context.push(e ? G.parenStatement : G.parenExpression), this.state.exprAllowed = !0;
			}, I.incDec.updateContext = function () {}, I._function.updateContext = function () {
				this.curContext() !== G.braceStatement && this.state.context.push(G.functionExpression), this.state.exprAllowed = !1;
			}, I.backQuote.updateContext = function () {
				this.curContext() === G.template ? this.state.context.pop() : this.state.context.push(G.template), this.state.exprAllowed = !1;
			};var X = function X(t, e) {
				this.line = t, this.column = e;
			},
			    J = function J(t, e) {
				this.start = t, this.end = e;
			},
			    H = function (t) {
				function e() {
					return t.apply(this, arguments) || this;
				}return s(e, t), e.prototype.raise = function (t, e, s) {
					var i = p(this.input, t);e += ' (' + i.line + ':' + i.column + ')';var r = new SyntaxError(e);throw r.pos = t, r.loc = i, s && (r.missingPlugin = s), r;
				}, e;
			}(function (t) {
				function e() {
					return t.apply(this, arguments) || this;
				}s(e, t);var i = e.prototype;return i.addComment = function (t) {
					this.filename && (t.loc.filename = this.filename), this.state.trailingComments.push(t), this.state.leadingComments.push(t);
				}, i.processComment = function (t) {
					if (!("Program" === t.type && t.body.length > 0)) {
						var e,
						    s,
						    i,
						    r,
						    a,
						    n = this.state.commentStack;if (this.state.trailingComments.length > 0) this.state.trailingComments[0].start >= t.end ? (i = this.state.trailingComments, this.state.trailingComments = []) : this.state.trailingComments.length = 0;else if (n.length > 0) {
							var o = c(n);o.trailingComments && o.trailingComments[0].start >= t.end && (i = o.trailingComments, o.trailingComments = null);
						}for (n.length > 0 && c(n).start >= t.start && (e = n.pop()); n.length > 0 && c(n).start >= t.start;) {
							s = n.pop();
						}if (!s && e && (s = e), e && this.state.leadingComments.length > 0) {
							var h = c(this.state.leadingComments);if ("ObjectProperty" === e.type) {
								if (h.start >= t.start && this.state.commentPreviousNode) {
									for (a = 0; a < this.state.leadingComments.length; a++) {
										this.state.leadingComments[a].end < this.state.commentPreviousNode.end && (this.state.leadingComments.splice(a, 1), a--);
									}this.state.leadingComments.length > 0 && (e.trailingComments = this.state.leadingComments, this.state.leadingComments = []);
								}
							} else if ("CallExpression" === t.type && t.arguments && t.arguments.length) {
								var p = c(t.arguments);p && h.start >= p.start && h.end <= t.end && this.state.commentPreviousNode && this.state.leadingComments.length > 0 && (p.trailingComments = this.state.leadingComments, this.state.leadingComments = []);
							}
						}if (s) {
							if (s.leadingComments) if (s !== t && s.leadingComments.length > 0 && c(s.leadingComments).end <= t.start) t.leadingComments = s.leadingComments, s.leadingComments = null;else for (r = s.leadingComments.length - 2; r >= 0; --r) {
								if (s.leadingComments[r].end <= t.start) {
									t.leadingComments = s.leadingComments.splice(0, r + 1);break;
								}
							}
						} else if (this.state.leadingComments.length > 0) if (c(this.state.leadingComments).end <= t.start) {
							if (this.state.commentPreviousNode) for (a = 0; a < this.state.leadingComments.length; a++) {
								this.state.leadingComments[a].end < this.state.commentPreviousNode.end && (this.state.leadingComments.splice(a, 1), a--);
							}this.state.leadingComments.length > 0 && (t.leadingComments = this.state.leadingComments, this.state.leadingComments = []);
						} else {
							for (r = 0; r < this.state.leadingComments.length && !(this.state.leadingComments[r].end > t.start); r++) {}var l = this.state.leadingComments.slice(0, r);t.leadingComments = 0 === l.length ? null : l, 0 === (i = this.state.leadingComments.slice(r)).length && (i = null);
						}this.state.commentPreviousNode = t, i && (i.length && i[0].start >= t.start && c(i).end <= t.end ? t.innerComments = i : t.trailingComments = i), n.push(t);
					}
				}, e;
			}(function () {
				function t() {}var e = t.prototype;return e.isReservedWord = function (t) {
					return "await" === t ? this.inModule : D[6](t);
				}, e.hasPlugin = function (t) {
					return !!this.plugins[t];
				}, t;
			}())),
			    $ = function () {
				function t() {}var e = t.prototype;return e.init = function (t, e) {
					this.strict = !1 !== t.strictMode && "module" === t.sourceType, this.input = e, this.potentialArrowAt = -1, this.noArrowAt = [], this.noArrowParamsConversionAt = [], this.inMethod = this.inFunction = this.inParameters = this.maybeInArrowParameters = this.inGenerator = this.inAsync = this.inPropertyName = this.inType = this.inClassProperty = this.noAnonFunctionType = !1, this.classLevel = 0, this.labels = [], this.decoratorStack = [[]], this.yieldInPossibleArrowParameters = null, this.tokens = [], this.comments = [], this.trailingComments = [], this.leadingComments = [], this.commentStack = [], this.commentPreviousNode = null, this.pos = this.lineStart = 0, this.curLine = t.startLine, this.type = I.eof, this.value = null, this.start = this.end = this.pos, this.startLoc = this.endLoc = this.curPosition(), this.lastTokEndLoc = this.lastTokStartLoc = null, this.lastTokStart = this.lastTokEnd = this.pos, this.context = [G.braceStatement], this.exprAllowed = !0, this.containsEsc = this.containsOctal = !1, this.octalPosition = null, this.invalidTemplateEscapePosition = null, this.exportedIdentifiers = [];
				}, e.curPosition = function () {
					return new X(this.curLine, this.pos - this.lineStart);
				}, e.clone = function (e) {
					var s = this,
					    i = new t();return Object.keys(this).forEach(function (t) {
						var r = s[t];e && "context" !== t || !Array.isArray(r) || (r = r.slice()), i[t] = r;
					}), i;
				}, t;
			}(),
			    z = function z(t) {
				return t >= 48 && t <= 57;
			},
			    Q = { decBinOct: [46, 66, 69, 79, 95, 98, 101, 111], hex: [46, 88, 95, 120] },
			    Y = {};Y.bin = [48, 49], Y.oct = Y.bin.concat([50, 51, 52, 53, 54, 55]), Y.dec = Y.oct.concat([56, 57]), Y.hex = Y.dec.concat([65, 66, 67, 68, 69, 70, 97, 98, 99, 100, 101, 102]);var Z = function Z(t) {
				this.type = t.type, this.value = t.value, this.start = t.start, this.end = t.end, this.loc = new J(t.startLoc, t.endLoc);
			},
			    tt = function (t) {
				function e() {
					return t.apply(this, arguments) || this;
				}s(e, t);var i = e.prototype;return i.addExtra = function (t, e, s) {
					t && ((t.extra = t.extra || {})[e] = s);
				}, i.isRelational = function (t) {
					return this.match(I.relational) && this.state.value === t;
				}, i.expectRelational = function (t) {
					this.isRelational(t) ? this.next() : this.unexpected(null, I.relational);
				}, i.eatRelational = function (t) {
					return !!this.isRelational(t) && (this.next(), !0);
				}, i.isContextual = function (t) {
					return this.match(I.name) && this.state.value === t;
				}, i.isLookaheadContextual = function (t) {
					var e = this.lookahead();return e.type === I.name && e.value === t;
				}, i.eatContextual = function (t) {
					return this.state.value === t && this.eat(I.name);
				}, i.expectContextual = function (t, e) {
					this.eatContextual(t) || this.unexpected(null, e);
				}, i.canInsertSemicolon = function () {
					return this.match(I.eof) || this.match(I.braceR) || this.hasPrecedingLineBreak();
				}, i.hasPrecedingLineBreak = function () {
					return V.test(this.input.slice(this.state.lastTokEnd, this.state.start));
				}, i.isLineTerminator = function () {
					return this.eat(I.semi) || this.canInsertSemicolon();
				}, i.semicolon = function () {
					this.isLineTerminator() || this.unexpected(null, I.semi);
				}, i.expect = function (t, e) {
					this.eat(t) || this.unexpected(e, t);
				}, i.unexpected = function (t, e) {
					throw void 0 === e && (e = "Unexpected token"), "string" != typeof e && (e = 'Unexpected token, expected "' + e.label + '"'), this.raise(null != t ? t : this.state.start, e);
				}, i.expectPlugin = function (t, e) {
					if (!this.hasPlugin(t)) throw this.raise(null != e ? e : this.state.start, 'This experimental syntax requires enabling the parser plugin: \'' + t + '\'', [t]);return !0;
				}, i.expectOnePlugin = function (t, e) {
					var s = this;if (!t.some(function (t) {
						return s.hasPlugin(t);
					})) throw this.raise(null != e ? e : this.state.start, 'This experimental syntax requires enabling one of the following parser plugin(s): \'' + t.join(", ") + '\'', t);
				}, e;
			}(function (t) {
				function e(e, s) {
					var i;return i = t.call(this) || this, i.state = new $(), i.state.init(e, s), i.isLookahead = !1, i;
				}s(e, t);var i = e.prototype;return i.next = function () {
					this.options.tokens && !this.isLookahead && this.state.tokens.push(new Z(this.state)), this.state.lastTokEnd = this.state.end, this.state.lastTokStart = this.state.start, this.state.lastTokEndLoc = this.state.endLoc, this.state.lastTokStartLoc = this.state.startLoc, this.nextToken();
				}, i.eat = function (t) {
					return !!this.match(t) && (this.next(), !0);
				}, i.match = function (t) {
					return this.state.type === t;
				}, i.isKeyword = function (t) {
					return O(t);
				}, i.lookahead = function () {
					var t = this.state;this.state = t.clone(!0), this.isLookahead = !0, this.next(), this.isLookahead = !1;var e = this.state;return this.state = t, e;
				}, i.setStrict = function (t) {
					if (this.state.strict = t, this.match(I.num) || this.match(I.string)) {
						for (this.state.pos = this.state.start; this.state.pos < this.state.lineStart;) {
							this.state.lineStart = this.input.lastIndexOf("\n", this.state.lineStart - 2) + 1, --this.state.curLine;
						}this.nextToken();
					}
				}, i.curContext = function () {
					return this.state.context[this.state.context.length - 1];
				}, i.nextToken = function () {
					var t = this.curContext();t && t.preserveSpace || this.skipSpace(), this.state.containsOctal = !1, this.state.octalPosition = null, this.state.start = this.state.pos, this.state.startLoc = this.state.curPosition(), this.state.pos >= this.input.length ? this.finishToken(I.eof) : t.override ? t.override(this) : this.readToken(this.fullCharCodeAtPos());
				}, i.readToken = function (t) {
					n(t) || 92 === t ? this.readWord() : this.getTokenFromCode(t);
				}, i.fullCharCodeAtPos = function () {
					var t = this.input.charCodeAt(this.state.pos);return t <= 55295 || t >= 57344 ? t : (t << 10) + this.input.charCodeAt(this.state.pos + 1) - 56613888;
				}, i.pushComment = function (t, e, s, i, r, a) {
					var n = { type: t ? "CommentBlock" : "CommentLine", value: e, start: s, end: i, loc: new J(r, a) };this.isLookahead || (this.options.tokens && this.state.tokens.push(n), this.state.comments.push(n), this.addComment(n));
				}, i.skipBlockComment = function () {
					var t = this.state.curPosition(),
					    e = this.state.pos,
					    s = this.input.indexOf("*/", this.state.pos += 2);-1 === s && this.raise(this.state.pos - 2, "Unterminated comment"), this.state.pos = s + 2, U.lastIndex = e;for (var i; (i = U.exec(this.input)) && i.index < this.state.pos;) {
						++this.state.curLine, this.state.lineStart = i.index + i[0].length;
					}this.pushComment(!0, this.input.slice(e + 2, s), e, this.state.pos, t, this.state.curPosition());
				}, i.skipLineComment = function (t) {
					var e = this.state.pos,
					    s = this.state.curPosition(),
					    i = this.input.charCodeAt(this.state.pos += t);if (this.state.pos < this.input.length) for (; 10 !== i && 13 !== i && 8232 !== i && 8233 !== i && ++this.state.pos < this.input.length;) {
						i = this.input.charCodeAt(this.state.pos);
					}this.pushComment(!1, this.input.slice(e + t, this.state.pos), e, this.state.pos, s, this.state.curPosition());
				}, i.skipSpace = function () {
					t: for (; this.state.pos < this.input.length;) {
						var t = this.input.charCodeAt(this.state.pos);switch (t) {case 32:case 160:
								++this.state.pos;break;case 13:
								10 === this.input.charCodeAt(this.state.pos + 1) && ++this.state.pos;case 10:case 8232:case 8233:
								++this.state.pos, ++this.state.curLine, this.state.lineStart = this.state.pos;break;case 47:
								switch (this.input.charCodeAt(this.state.pos + 1)) {case 42:
										this.skipBlockComment();break;case 47:
										this.skipLineComment(2);break;default:
										break t;}break;default:
								if (!(t > 8 && t < 14 || t >= 5760 && K.test(String.fromCharCode(t)))) break t;++this.state.pos;}
					}
				}, i.finishToken = function (t, e) {
					this.state.end = this.state.pos, this.state.endLoc = this.state.curPosition();var s = this.state.type;this.state.type = t, this.state.value = e, this.updateContext(s);
				}, i.readToken_dot = function () {
					var t = this.input.charCodeAt(this.state.pos + 1);if (t >= 48 && t <= 57) this.readNumber(!0);else {
						var e = this.input.charCodeAt(this.state.pos + 2);46 === t && 46 === e ? (this.state.pos += 3, this.finishToken(I.ellipsis)) : (++this.state.pos, this.finishToken(I.dot));
					}
				}, i.readToken_slash = function () {
					if (this.state.exprAllowed) return ++this.state.pos, void this.readRegexp();61 === this.input.charCodeAt(this.state.pos + 1) ? this.finishOp(I.assign, 2) : this.finishOp(I.slash, 1);
				}, i.readToken_mult_modulo = function (t) {
					var e = 42 === t ? I.star : I.modulo,
					    s = 1,
					    i = this.input.charCodeAt(this.state.pos + 1),
					    r = this.state.exprAllowed;42 === t && 42 === i && (s++, i = this.input.charCodeAt(this.state.pos + 2), e = I.exponent), 61 !== i || r || (s++, e = I.assign), this.finishOp(e, s);
				}, i.readToken_pipe_amp = function (t) {
					var e = this.input.charCodeAt(this.state.pos + 1);if (e !== t) {
						if (124 === t) {
							if (62 === e) return void this.finishOp(I.pipeline, 2);if (125 === e && this.hasPlugin("flow")) return void this.finishOp(I.braceBarR, 2);
						}61 !== e ? this.finishOp(124 === t ? I.bitwiseOR : I.bitwiseAND, 1) : this.finishOp(I.assign, 2);
					} else this.finishOp(124 === t ? I.logicalOR : I.logicalAND, 2);
				}, i.readToken_caret = function () {
					61 === this.input.charCodeAt(this.state.pos + 1) ? this.finishOp(I.assign, 2) : this.finishOp(I.bitwiseXOR, 1);
				}, i.readToken_plus_min = function (t) {
					var e = this.input.charCodeAt(this.state.pos + 1);if (e === t) return 45 === e && !this.inModule && 62 === this.input.charCodeAt(this.state.pos + 2) && V.test(this.input.slice(this.state.lastTokEnd, this.state.pos)) ? (this.skipLineComment(3), this.skipSpace(), void this.nextToken()) : void this.finishOp(I.incDec, 2);61 === e ? this.finishOp(I.assign, 2) : this.finishOp(I.plusMin, 1);
				}, i.readToken_lt_gt = function (t) {
					var e = this.input.charCodeAt(this.state.pos + 1),
					    s = 1;return e === t ? (s = 62 === t && 62 === this.input.charCodeAt(this.state.pos + 2) ? 3 : 2, 61 === this.input.charCodeAt(this.state.pos + s) ? void this.finishOp(I.assign, s + 1) : void this.finishOp(I.bitShift, s)) : 33 !== e || 60 !== t || this.inModule || 45 !== this.input.charCodeAt(this.state.pos + 2) || 45 !== this.input.charCodeAt(this.state.pos + 3) ? (61 === e && (s = 2), void this.finishOp(I.relational, s)) : (this.skipLineComment(4), this.skipSpace(), void this.nextToken());
				}, i.readToken_eq_excl = function (t) {
					var e = this.input.charCodeAt(this.state.pos + 1);if (61 !== e) return 61 === t && 62 === e ? (this.state.pos += 2, void this.finishToken(I.arrow)) : void this.finishOp(61 === t ? I.eq : I.bang, 1);this.finishOp(I.equality, 61 === this.input.charCodeAt(this.state.pos + 2) ? 3 : 2);
				}, i.readToken_question = function () {
					var t = this.input.charCodeAt(this.state.pos + 1),
					    e = this.input.charCodeAt(this.state.pos + 2);63 === t ? this.finishOp(I.nullishCoalescing, 2) : 46 !== t || e >= 48 && e <= 57 ? (++this.state.pos, this.finishToken(I.question)) : (this.state.pos += 2, this.finishToken(I.questionDot));
				}, i.getTokenFromCode = function (t) {
					switch (t) {case 35:
							if ((this.hasPlugin("classPrivateProperties") || this.hasPlugin("classPrivateMethods")) && this.state.classLevel > 0) return ++this.state.pos, void this.finishToken(I.hash);this.raise(this.state.pos, 'Unexpected character \'' + l(t) + '\'');case 46:
							return void this.readToken_dot();case 40:
							return ++this.state.pos, void this.finishToken(I.parenL);case 41:
							return ++this.state.pos, void this.finishToken(I.parenR);case 59:
							return ++this.state.pos, void this.finishToken(I.semi);case 44:
							return ++this.state.pos, void this.finishToken(I.comma);case 91:
							return ++this.state.pos, void this.finishToken(I.bracketL);case 93:
							return ++this.state.pos, void this.finishToken(I.bracketR);case 123:
							return void (this.hasPlugin("flow") && 124 === this.input.charCodeAt(this.state.pos + 1) ? this.finishOp(I.braceBarL, 2) : (++this.state.pos, this.finishToken(I.braceL)));case 125:
							return ++this.state.pos, void this.finishToken(I.braceR);case 58:
							return void (this.hasPlugin("functionBind") && 58 === this.input.charCodeAt(this.state.pos + 1) ? this.finishOp(I.doubleColon, 2) : (++this.state.pos, this.finishToken(I.colon)));case 63:
							return void this.readToken_question();case 64:
							return ++this.state.pos, void this.finishToken(I.at);case 96:
							return ++this.state.pos, void this.finishToken(I.backQuote);case 48:
							var e = this.input.charCodeAt(this.state.pos + 1);if (120 === e || 88 === e) return void this.readRadixNumber(16);if (111 === e || 79 === e) return void this.readRadixNumber(8);if (98 === e || 66 === e) return void this.readRadixNumber(2);case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							return void this.readNumber(!1);case 34:case 39:
							return void this.readString(t);case 47:
							return void this.readToken_slash();case 37:case 42:
							return void this.readToken_mult_modulo(t);case 124:case 38:
							return void this.readToken_pipe_amp(t);case 94:
							return void this.readToken_caret();case 43:case 45:
							return void this.readToken_plus_min(t);case 60:case 62:
							return void this.readToken_lt_gt(t);case 61:case 33:
							return void this.readToken_eq_excl(t);case 126:
							return void this.finishOp(I.tilde, 1);}this.raise(this.state.pos, 'Unexpected character \'' + l(t) + '\'');
				}, i.finishOp = function (t, e) {
					var s = this.input.slice(this.state.pos, this.state.pos + e);this.state.pos += e, this.finishToken(t, s);
				}, i.readRegexp = function () {
					for (var t, e, s = this.state.pos;;) {
						this.state.pos >= this.input.length && this.raise(s, "Unterminated regular expression");var i = this.input.charAt(this.state.pos);if (V.test(i) && this.raise(s, "Unterminated regular expression"), t) t = !1;else {
							if ("[" === i) e = !0;else if ("]" === i && e) e = !1;else if ("/" === i && !e) break;t = "\\" === i;
						}++this.state.pos;
					}var r = this.input.slice(s, this.state.pos);++this.state.pos;var a = this.readWord1();a && (/^[gmsiyu]*$/.test(a) || this.raise(s, "Invalid regular expression flag")), this.finishToken(I.regexp, { pattern: r, flags: a });
				}, i.readInt = function (t, e) {
					for (var s = this.state.pos, i = 16 === t ? Q.hex : Q.decBinOct, r = 16 === t ? Y.hex : 10 === t ? Y.dec : 8 === t ? Y.oct : Y.bin, a = 0, n = 0, o = null == e ? 1 / 0 : e; n < o; ++n) {
						var h = this.input.charCodeAt(this.state.pos),
						    p = void 0;if (this.hasPlugin("numericSeparator")) {
							var c = this.input.charCodeAt(this.state.pos - 1),
							    l = this.input.charCodeAt(this.state.pos + 1);if (95 === h) {
								-1 === r.indexOf(l) && this.raise(this.state.pos, "Invalid or unexpected token"), (i.indexOf(c) > -1 || i.indexOf(l) > -1 || Number.isNaN(l)) && this.raise(this.state.pos, "Invalid or unexpected token"), ++this.state.pos;continue;
							}
						}if ((p = h >= 97 ? h - 97 + 10 : h >= 65 ? h - 65 + 10 : z(h) ? h - 48 : 1 / 0) >= t) break;++this.state.pos, a = a * t + p;
					}return this.state.pos === s || null != e && this.state.pos - s !== e ? null : a;
				}, i.readRadixNumber = function (t) {
					var e = this.state.pos,
					    s = !1;this.state.pos += 2;var i = this.readInt(t);if (null == i && this.raise(this.state.start + 2, "Expected number in radix " + t), this.hasPlugin("bigInt") && 110 === this.input.charCodeAt(this.state.pos) && (++this.state.pos, s = !0), n(this.fullCharCodeAtPos()) && this.raise(this.state.pos, "Identifier directly after number"), s) {
						var r = this.input.slice(e, this.state.pos).replace(/[_n]/g, "");this.finishToken(I.bigint, r);
					} else this.finishToken(I.num, i);
				}, i.readNumber = function (t) {
					var e = this.state.pos,
					    s = 48 === this.input.charCodeAt(e),
					    i = !1,
					    r = !1;t || null !== this.readInt(10) || this.raise(e, "Invalid number"), s && this.state.pos == e + 1 && (s = !1);var a = this.input.charCodeAt(this.state.pos);46 !== a || s || (++this.state.pos, this.readInt(10), i = !0, a = this.input.charCodeAt(this.state.pos)), 69 !== a && 101 !== a || s || (43 !== (a = this.input.charCodeAt(++this.state.pos)) && 45 !== a || ++this.state.pos, null === this.readInt(10) && this.raise(e, "Invalid number"), i = !0, a = this.input.charCodeAt(this.state.pos)), this.hasPlugin("bigInt") && 110 === a && ((i || s) && this.raise(e, "Invalid BigIntLiteral"), ++this.state.pos, r = !0), n(this.fullCharCodeAtPos()) && this.raise(this.state.pos, "Identifier directly after number");var o = this.input.slice(e, this.state.pos).replace(/[_n]/g, "");if (r) this.finishToken(I.bigint, o);else {
						var h;i ? h = parseFloat(o) : s && 1 !== o.length ? this.state.strict ? this.raise(e, "Invalid number") : h = /[89]/.test(o) ? parseInt(o, 10) : parseInt(o, 8) : h = parseInt(o, 10), this.finishToken(I.num, h);
					}
				}, i.readCodePoint = function (t) {
					var e;if (123 === this.input.charCodeAt(this.state.pos)) {
						var s = ++this.state.pos;if (e = this.readHexChar(this.input.indexOf("}", this.state.pos) - this.state.pos, t), ++this.state.pos, null === e) --this.state.invalidTemplateEscapePosition;else if (e > 1114111) {
							if (!t) return this.state.invalidTemplateEscapePosition = s - 2, null;this.raise(s, "Code point out of bounds");
						}
					} else e = this.readHexChar(4, t);return e;
				}, i.readString = function (t) {
					for (var e = "", s = ++this.state.pos;;) {
						this.state.pos >= this.input.length && this.raise(this.state.start, "Unterminated string constant");var i = this.input.charCodeAt(this.state.pos);if (i === t) break;92 === i ? (e += this.input.slice(s, this.state.pos), e += this.readEscapedChar(!1), s = this.state.pos) : (h(i) && this.raise(this.state.start, "Unterminated string constant"), ++this.state.pos);
					}e += this.input.slice(s, this.state.pos++), this.finishToken(I.string, e);
				}, i.readTmplToken = function () {
					for (var t = "", e = this.state.pos, s = !1;;) {
						this.state.pos >= this.input.length && this.raise(this.state.start, "Unterminated template");var i = this.input.charCodeAt(this.state.pos);if (96 === i || 36 === i && 123 === this.input.charCodeAt(this.state.pos + 1)) return this.state.pos === this.state.start && this.match(I.template) ? 36 === i ? (this.state.pos += 2, void this.finishToken(I.dollarBraceL)) : (++this.state.pos, void this.finishToken(I.backQuote)) : (t += this.input.slice(e, this.state.pos), void this.finishToken(I.template, s ? null : t));if (92 === i) {
							t += this.input.slice(e, this.state.pos);var r = this.readEscapedChar(!0);null === r ? s = !0 : t += r, e = this.state.pos;
						} else if (h(i)) {
							switch (t += this.input.slice(e, this.state.pos), ++this.state.pos, i) {case 13:
									10 === this.input.charCodeAt(this.state.pos) && ++this.state.pos;case 10:
									t += "\n";break;default:
									t += String.fromCharCode(i);}++this.state.curLine, this.state.lineStart = this.state.pos, e = this.state.pos;
						} else ++this.state.pos;
					}
				}, i.readEscapedChar = function (t) {
					var e = !t,
					    s = this.input.charCodeAt(++this.state.pos);switch (++this.state.pos, s) {case 110:
							return "\n";case 114:
							return "\r";case 120:
							var i = this.readHexChar(2, e);return null === i ? null : String.fromCharCode(i);case 117:
							var r = this.readCodePoint(e);return null === r ? null : l(r);case 116:
							return "\t";case 98:
							return "\b";case 118:
							return "\v";case 102:
							return "\f";case 13:
							10 === this.input.charCodeAt(this.state.pos) && ++this.state.pos;case 10:
							return this.state.lineStart = this.state.pos, ++this.state.curLine, "";default:
							if (s >= 48 && s <= 55) {
								var a = this.state.pos - 1,
								    n = this.input.substr(this.state.pos - 1, 3).match(/^[0-7]+/)[0],
								    o = parseInt(n, 8);if (o > 255 && (n = n.slice(0, -1), o = parseInt(n, 8)), o > 0) {
									if (t) return this.state.invalidTemplateEscapePosition = a, null;this.state.strict ? this.raise(a, "Octal literal in strict mode") : this.state.containsOctal || (this.state.containsOctal = !0, this.state.octalPosition = a);
								}return this.state.pos += n.length - 1, String.fromCharCode(o);
							}return String.fromCharCode(s);}
				}, i.readHexChar = function (t, e) {
					var s = this.state.pos,
					    i = this.readInt(16, t);return null === i && (e ? this.raise(s, "Bad character escape sequence") : (this.state.pos = s - 1, this.state.invalidTemplateEscapePosition = s - 1)), i;
				}, i.readWord1 = function () {
					this.state.containsEsc = !1;for (var t = "", e = !0, s = this.state.pos; this.state.pos < this.input.length;) {
						var i = this.fullCharCodeAtPos();if (o(i)) this.state.pos += i <= 65535 ? 1 : 2;else {
							if (92 !== i) break;this.state.containsEsc = !0, t += this.input.slice(s, this.state.pos);var r = this.state.pos;117 !== this.input.charCodeAt(++this.state.pos) && this.raise(this.state.pos, 'Expecting Unicode escape sequence \\uXXXX'), ++this.state.pos;var a = this.readCodePoint(!0);(e ? n : o)(a, !0) || this.raise(r, "Invalid Unicode escape"), t += l(a), s = this.state.pos;
						}e = !1;
					}return t + this.input.slice(s, this.state.pos);
				}, i.readWord = function () {
					var t = this.readWord1(),
					    e = I.name;this.isKeyword(t) && (this.state.containsEsc && this.raise(this.state.pos, 'Escape sequence in keyword ' + t), e = M[t]), this.finishToken(e, t);
				}, i.braceIsBlock = function (t) {
					if (t === I.colon) {
						var e = this.curContext();if (e === G.braceStatement || e === G.braceExpression) return !e.isExpr;
					}return t === I._return ? V.test(this.input.slice(this.state.lastTokEnd, this.state.start)) : t === I._else || t === I.semi || t === I.eof || t === I.parenR || (t === I.braceL ? this.curContext() === G.braceStatement : t === I.relational || !this.state.exprAllowed);
				}, i.updateContext = function (t) {
					var e,
					    s = this.state.type;!s.keyword || t !== I.dot && t !== I.questionDot ? (e = s.updateContext) ? e.call(this, t) : this.state.exprAllowed = s.beforeExpr : this.state.exprAllowed = !1;
				}, e;
			}(H)),
			    et = ["leadingComments", "trailingComments", "innerComments"],
			    st = function () {
				function t(t, e, s) {
					this.type = "", this.start = e, this.end = 0, this.loc = new J(s), t && t.options.ranges && (this.range = [e, 0]), t && t.filename && (this.loc.filename = t.filename);
				}return t.prototype.__clone = function () {
					var e = this,
					    s = new t();return Object.keys(this).forEach(function (t) {
						et.indexOf(t) < 0 && (s[t] = e[t]);
					}), s;
				}, t;
			}(),
			    it = [],
			    rt = { kind: "loop" },
			    at = { kind: "switch" },
			    nt = {},
			    ot = function (t) {
				function e(e, s) {
					var r;return e = i(e), r = t.call(this, e, s) || this, r.options = e, r.inModule = "module" === r.options.sourceType, r.input = s, r.plugins = u(r.options.plugins), r.filename = e.sourceFilename, 0 === r.state.pos && "#" === r.input[0] && "!" === r.input[1] && r.skipLineComment(2), r;
				}return s(e, t), e.prototype.parse = function () {
					var t = this.startNode(),
					    e = this.startNode();return this.nextToken(), this.parseTopLevel(t, e);
				}, e;
			}(function (t) {
				function e() {
					return t.apply(this, arguments) || this;
				}s(e, t);var i = e.prototype;return i.parseTopLevel = function (t, e) {
					return e.sourceType = this.options.sourceType, this.parseBlockBody(e, !0, !0, I.eof), t.program = this.finishNode(e, "Program"), t.comments = this.state.comments, this.options.tokens && (t.tokens = this.state.tokens), this.finishNode(t, "File");
				}, i.stmtToDirective = function (t) {
					var e = t.expression,
					    s = this.startNodeAt(e.start, e.loc.start),
					    i = this.startNodeAt(t.start, t.loc.start),
					    r = this.input.slice(e.start, e.end),
					    a = s.value = r.slice(1, -1);return this.addExtra(s, "raw", r), this.addExtra(s, "rawValue", a), i.value = this.finishNodeAt(s, "DirectiveLiteral", e.end, e.loc.end), this.finishNodeAt(i, "Directive", t.end, t.loc.end);
				}, i.parseStatement = function (t, e) {
					return this.match(I.at) && this.parseDecorators(!0), this.parseStatementContent(t, e);
				}, i.parseStatementContent = function (t, e) {
					var s = this.state.type,
					    i = this.startNode();switch (s) {case I._break:case I._continue:
							return this.parseBreakContinueStatement(i, s.keyword);case I._debugger:
							return this.parseDebuggerStatement(i);case I._do:
							return this.parseDoStatement(i);case I._for:
							return this.parseForStatement(i);case I._function:
							if (this.lookahead().type === I.dot) break;return t || this.unexpected(), this.parseFunctionStatement(i);case I._class:
							return t || this.unexpected(), this.parseClass(i, !0);case I._if:
							return this.parseIfStatement(i);case I._return:
							return this.parseReturnStatement(i);case I._switch:
							return this.parseSwitchStatement(i);case I._throw:
							return this.parseThrowStatement(i);case I._try:
							return this.parseTryStatement(i);case I._let:case I._const:
							t || this.unexpected();case I._var:
							return this.parseVarStatement(i, s);case I._while:
							return this.parseWhileStatement(i);case I._with:
							return this.parseWithStatement(i);case I.braceL:
							return this.parseBlock();case I.semi:
							return this.parseEmptyStatement(i);case I._export:case I._import:
							if (this.hasPlugin("dynamicImport") && this.lookahead().type === I.parenL || this.hasPlugin("importMeta") && this.lookahead().type === I.dot) break;this.options.allowImportExportEverywhere || e || this.raise(this.state.start, "'import' and 'export' may only appear at the top level"), this.next();var r;return r = s == I._import ? this.parseImport(i) : this.parseExport(i), this.assertModuleNodeAllowed(i), r;case I.name:
							if ("async" === this.state.value) {
								var a = this.state.clone();if (this.next(), this.match(I._function) && !this.canInsertSemicolon()) return this.expect(I._function), this.parseFunction(i, !0, !1, !0);this.state = a;
							}}var n = this.state.value,
					    o = this.parseExpression();return s === I.name && "Identifier" === o.type && this.eat(I.colon) ? this.parseLabeledStatement(i, n, o) : this.parseExpressionStatement(i, o);
				}, i.assertModuleNodeAllowed = function (t) {
					this.options.allowImportExportEverywhere || this.inModule || this.raise(t.start, '\'import\' and \'export\' may appear only with \'sourceType: "module"\'');
				}, i.takeDecorators = function (t) {
					var e = this.state.decoratorStack[this.state.decoratorStack.length - 1];e.length && (t.decorators = e, this.resetStartLocationFromNode(t, e[0]), this.state.decoratorStack[this.state.decoratorStack.length - 1] = []);
				}, i.parseDecorators = function (t) {
					this.hasPlugin("decorators2") && (t = !1);for (var e = this.state.decoratorStack[this.state.decoratorStack.length - 1]; this.match(I.at);) {
						var s = this.parseDecorator();e.push(s);
					}if (this.match(I._export)) {
						if (t) return;this.raise(this.state.start, "Using the export keyword between a decorator and a class is not allowed. Please use `export @dec class` instead");
					}this.match(I._class) || this.raise(this.state.start, "Leading decorators must be attached to a class declaration");
				}, i.parseDecorator = function () {
					this.expectOnePlugin(["decorators", "decorators2"]);var t = this.startNode();if (this.next(), this.hasPlugin("decorators2")) {
						for (var e = this.state.start, s = this.state.startLoc, i = this.parseIdentifier(!1); this.eat(I.dot);) {
							var r = this.startNodeAt(e, s);r.object = i, r.property = this.parseIdentifier(!0), r.computed = !1, i = this.finishNode(r, "MemberExpression");
						}if (this.eat(I.parenL)) {
							var a = this.startNodeAt(e, s);a.callee = i, this.state.decoratorStack.push([]), a.arguments = this.parseCallExpressionArguments(I.parenR, !1), this.state.decoratorStack.pop(), i = this.finishNode(a, "CallExpression"), this.toReferencedList(i.arguments);
						}t.expression = i;
					} else t.expression = this.parseMaybeAssign();return this.finishNode(t, "Decorator");
				}, i.parseBreakContinueStatement = function (t, e) {
					var s = "break" === e;this.next(), this.isLineTerminator() ? t.label = null : this.match(I.name) ? (t.label = this.parseIdentifier(), this.semicolon()) : this.unexpected();var i;for (i = 0; i < this.state.labels.length; ++i) {
						var r = this.state.labels[i];if (null == t.label || r.name === t.label.name) {
							if (null != r.kind && (s || "loop" === r.kind)) break;if (t.label && s) break;
						}
					}return i === this.state.labels.length && this.raise(t.start, "Unsyntactic " + e), this.finishNode(t, s ? "BreakStatement" : "ContinueStatement");
				}, i.parseDebuggerStatement = function (t) {
					return this.next(), this.semicolon(), this.finishNode(t, "DebuggerStatement");
				}, i.parseDoStatement = function (t) {
					return this.next(), this.state.labels.push(rt), t.body = this.parseStatement(!1), this.state.labels.pop(), this.expect(I._while), t.test = this.parseParenExpression(), this.eat(I.semi), this.finishNode(t, "DoWhileStatement");
				}, i.parseForStatement = function (t) {
					this.next(), this.state.labels.push(rt);var e = !1;if (this.state.inAsync && this.isContextual("await") && (this.expectPlugin("asyncGenerators"), e = !0, this.next()), this.expect(I.parenL), this.match(I.semi)) return e && this.unexpected(), this.parseFor(t, null);if (this.match(I._var) || this.match(I._let) || this.match(I._const)) {
						var s = this.startNode(),
						    i = this.state.type;return this.next(), this.parseVar(s, !0, i), this.finishNode(s, "VariableDeclaration"), !this.match(I._in) && !this.isContextual("of") || 1 !== s.declarations.length || s.declarations[0].init ? (e && this.unexpected(), this.parseFor(t, s)) : this.parseForIn(t, s, e);
					}var r = { start: 0 },
					    a = this.parseExpression(!0, r);if (this.match(I._in) || this.isContextual("of")) {
						var n = this.isContextual("of") ? "for-of statement" : "for-in statement";return this.toAssignable(a, void 0, n), this.checkLVal(a, void 0, void 0, n), this.parseForIn(t, a, e);
					}return r.start && this.unexpected(r.start), e && this.unexpected(), this.parseFor(t, a);
				}, i.parseFunctionStatement = function (t) {
					return this.next(), this.parseFunction(t, !0);
				}, i.parseIfStatement = function (t) {
					return this.next(), t.test = this.parseParenExpression(), t.consequent = this.parseStatement(!1), t.alternate = this.eat(I._else) ? this.parseStatement(!1) : null, this.finishNode(t, "IfStatement");
				}, i.parseReturnStatement = function (t) {
					return this.state.inFunction || this.options.allowReturnOutsideFunction || this.raise(this.state.start, "'return' outside of function"), this.next(), this.isLineTerminator() ? t.argument = null : (t.argument = this.parseExpression(), this.semicolon()), this.finishNode(t, "ReturnStatement");
				}, i.parseSwitchStatement = function (t) {
					this.next(), t.discriminant = this.parseParenExpression();var e = t.cases = [];this.expect(I.braceL), this.state.labels.push(at);for (var s, i; !this.match(I.braceR);) {
						if (this.match(I._case) || this.match(I._default)) {
							var r = this.match(I._case);s && this.finishNode(s, "SwitchCase"), e.push(s = this.startNode()), s.consequent = [], this.next(), r ? s.test = this.parseExpression() : (i && this.raise(this.state.lastTokStart, "Multiple default clauses"), i = !0, s.test = null), this.expect(I.colon);
						} else s ? s.consequent.push(this.parseStatement(!0)) : this.unexpected();
					}return s && this.finishNode(s, "SwitchCase"), this.next(), this.state.labels.pop(), this.finishNode(t, "SwitchStatement");
				}, i.parseThrowStatement = function (t) {
					return this.next(), V.test(this.input.slice(this.state.lastTokEnd, this.state.start)) && this.raise(this.state.lastTokEnd, "Illegal newline after throw"), t.argument = this.parseExpression(), this.semicolon(), this.finishNode(t, "ThrowStatement");
				}, i.parseTryStatement = function (t) {
					if (this.next(), t.block = this.parseBlock(), t.handler = null, this.match(I._catch)) {
						var e = this.startNode();if (this.next(), this.match(I.parenL)) {
							this.expect(I.parenL), e.param = this.parseBindingAtom();var s = Object.create(null);this.checkLVal(e.param, !0, s, "catch clause"), this.expect(I.parenR);
						} else this.expectPlugin("optionalCatchBinding"), e.param = null;e.body = this.parseBlock(), t.handler = this.finishNode(e, "CatchClause");
					}return t.guardedHandlers = it, t.finalizer = this.eat(I._finally) ? this.parseBlock() : null, t.handler || t.finalizer || this.raise(t.start, "Missing catch or finally clause"), this.finishNode(t, "TryStatement");
				}, i.parseVarStatement = function (t, e) {
					return this.next(), this.parseVar(t, !1, e), this.semicolon(), this.finishNode(t, "VariableDeclaration");
				}, i.parseWhileStatement = function (t) {
					return this.next(), t.test = this.parseParenExpression(), this.state.labels.push(rt), t.body = this.parseStatement(!1), this.state.labels.pop(), this.finishNode(t, "WhileStatement");
				}, i.parseWithStatement = function (t) {
					return this.state.strict && this.raise(this.state.start, "'with' in strict mode"), this.next(), t.object = this.parseParenExpression(), t.body = this.parseStatement(!1), this.finishNode(t, "WithStatement");
				}, i.parseEmptyStatement = function (t) {
					return this.next(), this.finishNode(t, "EmptyStatement");
				}, i.parseLabeledStatement = function (t, e, s) {
					for (var i = 0, r = this.state.labels; i < r.length; i++) {
						r[i].name === e && this.raise(s.start, 'Label \'' + e + '\' is already declared');
					}for (var a = this.state.type.isLoop ? "loop" : this.match(I._switch) ? "switch" : null, n = this.state.labels.length - 1; n >= 0; n--) {
						var o = this.state.labels[n];if (o.statementStart !== t.start) break;o.statementStart = this.state.start, o.kind = a;
					}return this.state.labels.push({ name: e, kind: a, statementStart: this.state.start }), t.body = this.parseStatement(!0), ("ClassDeclaration" == t.body.type || "VariableDeclaration" == t.body.type && "var" !== t.body.kind || "FunctionDeclaration" == t.body.type && (this.state.strict || t.body.generator || t.body.async)) && this.raise(t.body.start, "Invalid labeled declaration"), this.state.labels.pop(), t.label = s, this.finishNode(t, "LabeledStatement");
				}, i.parseExpressionStatement = function (t, e) {
					return t.expression = e, this.semicolon(), this.finishNode(t, "ExpressionStatement");
				}, i.parseBlock = function (t) {
					var e = this.startNode();return this.expect(I.braceL), this.parseBlockBody(e, t, !1, I.braceR), this.finishNode(e, "BlockStatement");
				}, i.isValidDirective = function (t) {
					return "ExpressionStatement" === t.type && "StringLiteral" === t.expression.type && !t.expression.extra.parenthesized;
				}, i.parseBlockBody = function (t, e, s, i) {
					var r = t.body = [],
					    a = t.directives = [];this.parseBlockOrModuleBlockBody(r, e ? a : void 0, s, i);
				}, i.parseBlockOrModuleBlockBody = function (t, e, s, i) {
					for (var r, a, n = !1; !this.eat(i);) {
						n || !this.state.containsOctal || a || (a = this.state.octalPosition);var o = this.parseStatement(!0, s);if (e && !n && this.isValidDirective(o)) {
							var h = this.stmtToDirective(o);e.push(h), void 0 === r && "use strict" === h.value.value && (r = this.state.strict, this.setStrict(!0), a && this.raise(a, "Octal literal in strict mode"));
						} else n = !0, t.push(o);
					}!1 === r && this.setStrict(!1);
				}, i.parseFor = function (t, e) {
					return t.init = e, this.expect(I.semi), t.test = this.match(I.semi) ? null : this.parseExpression(), this.expect(I.semi), t.update = this.match(I.parenR) ? null : this.parseExpression(), this.expect(I.parenR), t.body = this.parseStatement(!1), this.state.labels.pop(), this.finishNode(t, "ForStatement");
				}, i.parseForIn = function (t, e, s) {
					var i = this.match(I._in) ? "ForInStatement" : "ForOfStatement";return s ? this.eatContextual("of") : this.next(), "ForOfStatement" === i && (t.await = !!s), t.left = e, t.right = this.parseExpression(), this.expect(I.parenR), t.body = this.parseStatement(!1), this.state.labels.pop(), this.finishNode(t, i);
				}, i.parseVar = function (t, e, s) {
					var i = t.declarations = [];for (t.kind = s.keyword;;) {
						var r = this.startNode();if (this.parseVarHead(r), this.eat(I.eq) ? r.init = this.parseMaybeAssign(e) : (s !== I._const || this.match(I._in) || this.isContextual("of") ? "Identifier" === r.id.type || e && (this.match(I._in) || this.isContextual("of")) || this.raise(this.state.lastTokEnd, "Complex binding patterns require an initialization value") : this.hasPlugin("typescript") || this.unexpected(), r.init = null), i.push(this.finishNode(r, "VariableDeclarator")), !this.eat(I.comma)) break;
					}return t;
				}, i.parseVarHead = function (t) {
					t.id = this.parseBindingAtom(), this.checkLVal(t.id, !0, void 0, "variable declaration");
				}, i.parseFunction = function (t, e, s, i, r) {
					var a = this.state.inFunction,
					    n = this.state.inMethod,
					    o = this.state.inGenerator;return this.state.inFunction = !0, this.state.inMethod = !1, this.initFunction(t, i), this.match(I.star) && (t.async && this.expectPlugin("asyncGenerators"), t.generator = !0, this.next()), !e || r || this.match(I.name) || this.match(I._yield) || this.unexpected(), e || (this.state.inGenerator = t.generator), (this.match(I.name) || this.match(I._yield)) && (t.id = this.parseBindingIdentifier()), e && (this.state.inGenerator = t.generator), this.parseFunctionParams(t), this.parseFunctionBodyAndFinish(t, e ? "FunctionDeclaration" : "FunctionExpression", s), this.state.inFunction = a, this.state.inMethod = n, this.state.inGenerator = o, t;
				}, i.parseFunctionParams = function (t, e) {
					var s = this.state.inParameters;this.state.inParameters = !0, this.expect(I.parenL), t.params = this.parseBindingList(I.parenR, !1, e), this.state.inParameters = s;
				}, i.parseClass = function (t, e, s) {
					return this.next(), this.takeDecorators(t), this.parseClassId(t, e, s), this.parseClassSuper(t), this.parseClassBody(t), this.finishNode(t, e ? "ClassDeclaration" : "ClassExpression");
				}, i.isClassProperty = function () {
					return this.match(I.eq) || this.match(I.semi) || this.match(I.braceR);
				}, i.isClassMethod = function () {
					return this.match(I.parenL);
				}, i.isNonstaticConstructor = function (t) {
					return !(t.computed || t.static || "constructor" !== t.key.name && "constructor" !== t.key.value);
				}, i.parseClassBody = function (t) {
					var e = this.state.strict;this.state.strict = !0, this.state.classLevel++;var s = { hadConstructor: !1 },
					    i = [],
					    r = this.startNode();for (r.body = [], this.expect(I.braceL); !this.eat(I.braceR);) {
						if (this.eat(I.semi)) i.length > 0 && this.raise(this.state.lastTokEnd, "Decorators must not be followed by a semicolon");else if (this.match(I.at)) i.push(this.parseDecorator());else {
							var a = this.startNode();i.length && (a.decorators = i, this.resetStartLocationFromNode(a, i[0]), i = []), this.parseClassMember(r, a, s), this.hasPlugin("decorators2") && -1 === ["method", "get", "set"].indexOf(a.kind) && a.decorators && a.decorators.length > 0 && this.raise(a.start, "Stage 2 decorators may only be used with a class or a class method");
						}
					}i.length && this.raise(this.state.start, "You have trailing decorators with no method"), t.body = this.finishNode(r, "ClassBody"), this.state.classLevel--, this.state.strict = e;
				}, i.parseClassMember = function (t, e, s) {
					var i = !1;if (this.match(I.name) && "static" === this.state.value) {
						var r = this.parseIdentifier(!0);if (this.isClassMethod()) {
							var a = e;return a.kind = "method", a.computed = !1, a.key = r, a.static = !1, void this.pushClassMethod(t, a, !1, !1, !1);
						}if (this.isClassProperty()) {
							var n = e;return n.computed = !1, n.key = r, n.static = !1, void t.body.push(this.parseClassProperty(n));
						}i = !0;
					}this.parseClassMemberWithIsStatic(t, e, s, i);
				}, i.parseClassMemberWithIsStatic = function (t, e, s, i) {
					var r = e,
					    a = e,
					    n = e,
					    o = e,
					    h = r,
					    p = r;if (e.static = i, this.eat(I.star)) return h.kind = "method", this.parseClassPropertyName(h), "PrivateName" === h.key.type ? void this.pushClassPrivateMethod(t, a, !0, !1) : (this.isNonstaticConstructor(r) && this.raise(r.key.start, "Constructor can't be a generator"), void this.pushClassMethod(t, r, !0, !1, !1));var c = this.parseClassPropertyName(e),
					    l = "PrivateName" === c.type,
					    u = "Identifier" === c.type;if (this.parsePostMemberNameModifiers(p), this.isClassMethod()) {
						if (h.kind = "method", l) return void this.pushClassPrivateMethod(t, a, !1, !1);var d = this.isNonstaticConstructor(r);d && (r.kind = "constructor", r.decorators && this.raise(r.start, "You can't attach decorators to a class constructor"), s.hadConstructor && !this.hasPlugin("typescript") && this.raise(c.start, "Duplicate constructor in the same class"), s.hadConstructor = !0), this.pushClassMethod(t, r, !1, !1, d);
					} else if (this.isClassProperty()) l ? this.pushClassPrivateProperty(t, o) : this.pushClassProperty(t, n);else if (u && "async" === c.name && !this.isLineTerminator()) {
						var f = this.match(I.star);f && (this.expectPlugin("asyncGenerators"), this.next()), h.kind = "method", this.parseClassPropertyName(h), "PrivateName" === h.key.type ? this.pushClassPrivateMethod(t, a, f, !0) : (this.isNonstaticConstructor(r) && this.raise(r.key.start, "Constructor can't be an async function"), this.pushClassMethod(t, r, f, !0, !1));
					} else !u || "get" !== c.name && "set" !== c.name || this.isLineTerminator() && this.match(I.star) ? this.isLineTerminator() ? l ? this.pushClassPrivateProperty(t, o) : this.pushClassProperty(t, n) : this.unexpected() : (h.kind = c.name, this.parseClassPropertyName(r), "PrivateName" === h.key.type ? this.pushClassPrivateMethod(t, a, !1, !1) : (this.isNonstaticConstructor(r) && this.raise(r.key.start, "Constructor can't have get/set modifier"), this.pushClassMethod(t, r, !1, !1, !1)), this.checkGetterSetterParamCount(r));
				}, i.parseClassPropertyName = function (t) {
					var e = this.parsePropertyName(t);return t.computed || !t.static || "prototype" !== e.name && "prototype" !== e.value || this.raise(e.start, "Classes may not have static property named prototype"), "PrivateName" === e.type && "constructor" === e.id.name && this.raise(e.start, "Classes may not have a private field named '#constructor'"), e;
				}, i.pushClassProperty = function (t, e) {
					this.isNonstaticConstructor(e) && this.raise(e.key.start, "Classes may not have a non-static field named 'constructor'"), t.body.push(this.parseClassProperty(e));
				}, i.pushClassPrivateProperty = function (t, e) {
					this.expectPlugin("classPrivateProperties", e.key.start), t.body.push(this.parseClassPrivateProperty(e));
				}, i.pushClassMethod = function (t, e, s, i, r) {
					t.body.push(this.parseMethod(e, s, i, r, "ClassMethod"));
				}, i.pushClassPrivateMethod = function (t, e, s, i) {
					this.expectPlugin("classPrivateMethods", e.key.start), t.body.push(this.parseMethod(e, s, i, !1, "ClassPrivateMethod"));
				}, i.parsePostMemberNameModifiers = function (t) {}, i.parseAccessModifier = function () {}, i.parseClassPrivateProperty = function (t) {
					return this.state.inClassProperty = !0, t.value = this.eat(I.eq) ? this.parseMaybeAssign() : null, this.semicolon(), this.state.inClassProperty = !1, this.finishNode(t, "ClassPrivateProperty");
				}, i.parseClassProperty = function (t) {
					return t.typeAnnotation || this.expectPlugin("classProperties"), this.state.inClassProperty = !0, this.match(I.eq) ? (this.expectPlugin("classProperties"), this.next(), t.value = this.parseMaybeAssign()) : t.value = null, this.semicolon(), this.state.inClassProperty = !1, this.finishNode(t, "ClassProperty");
				}, i.parseClassId = function (t, e, s) {
					this.match(I.name) ? t.id = this.parseIdentifier() : s || !e ? t.id = null : this.unexpected(null, "A class name is required");
				}, i.parseClassSuper = function (t) {
					t.superClass = this.eat(I._extends) ? this.parseExprSubscripts() : null;
				}, i.parseExport = function (t) {
					if (this.shouldParseExportStar()) {
						if (this.parseExportStar(t), "ExportAllDeclaration" === t.type) return t;
					} else if (this.isExportDefaultSpecifier()) {
						this.expectPlugin("exportDefaultFrom");var e = this.startNode();e.exported = this.parseIdentifier(!0);var s = [this.finishNode(e, "ExportDefaultSpecifier")];if (t.specifiers = s, this.match(I.comma) && this.lookahead().type === I.star) {
							this.expect(I.comma);var i = this.startNode();this.expect(I.star), this.expectContextual("as"), i.exported = this.parseIdentifier(), s.push(this.finishNode(i, "ExportNamespaceSpecifier"));
						} else this.parseExportSpecifiersMaybe(t);this.parseExportFrom(t, !0);
					} else {
						if (this.eat(I._default)) {
							var r = this.startNode(),
							    a = !1;return this.eat(I._function) ? r = this.parseFunction(r, !0, !1, !1, !0) : this.isContextual("async") && this.lookahead().type === I._function ? (this.eatContextual("async"), this.eat(I._function), r = this.parseFunction(r, !0, !1, !0, !0)) : this.match(I._class) ? r = this.parseClass(r, !0, !0) : (a = !0, r = this.parseMaybeAssign()), t.declaration = r, a && this.semicolon(), this.checkExport(t, !0, !0), this.finishNode(t, "ExportDefaultDeclaration");
						}if (this.shouldParseExportDeclaration()) {
							if (this.isContextual("async")) {
								var n = this.lookahead();n.type !== I._function && this.unexpected(n.start, 'Unexpected token, expected "function"');
							}t.specifiers = [], t.source = null, t.declaration = this.parseExportDeclaration(t);
						} else t.declaration = null, t.specifiers = this.parseExportSpecifiers(), this.parseExportFrom(t);
					}return this.checkExport(t, !0), this.finishNode(t, "ExportNamedDeclaration");
				}, i.parseExportDeclaration = function (t) {
					return this.parseStatement(!0);
				}, i.isExportDefaultSpecifier = function () {
					if (this.match(I.name)) return "async" !== this.state.value;if (!this.match(I._default)) return !1;var t = this.lookahead();return t.type === I.comma || t.type === I.name && "from" === t.value;
				}, i.parseExportSpecifiersMaybe = function (t) {
					this.eat(I.comma) && (t.specifiers = t.specifiers.concat(this.parseExportSpecifiers()));
				}, i.parseExportFrom = function (t, e) {
					this.eatContextual("from") ? (t.source = this.match(I.string) ? this.parseExprAtom() : this.unexpected(), this.checkExport(t)) : e ? this.unexpected() : t.source = null, this.semicolon();
				}, i.shouldParseExportStar = function () {
					return this.match(I.star);
				}, i.parseExportStar = function (t) {
					this.expect(I.star), this.isContextual("as") ? this.parseExportNamespace(t) : (this.parseExportFrom(t, !0), this.finishNode(t, "ExportAllDeclaration"));
				}, i.parseExportNamespace = function (t) {
					this.expectPlugin("exportNamespaceFrom");var e = this.startNodeAt(this.state.lastTokStart, this.state.lastTokStartLoc);this.next(), e.exported = this.parseIdentifier(!0), t.specifiers = [this.finishNode(e, "ExportNamespaceSpecifier")], this.parseExportSpecifiersMaybe(t), this.parseExportFrom(t, !0);
				}, i.shouldParseExportDeclaration = function () {
					return "var" === this.state.type.keyword || "const" === this.state.type.keyword || "let" === this.state.type.keyword || "function" === this.state.type.keyword || "class" === this.state.type.keyword || this.isContextual("async") || this.match(I.at) && this.expectPlugin("decorators2");
				}, i.checkExport = function (t, e, s) {
					if (e) if (s) this.checkDuplicateExports(t, "default");else if (t.specifiers && t.specifiers.length) for (var i = 0, r = t.specifiers; i < r.length; i++) {
						var a = r[i];this.checkDuplicateExports(a, a.exported.name);
					} else if (t.declaration) if ("FunctionDeclaration" === t.declaration.type || "ClassDeclaration" === t.declaration.type) this.checkDuplicateExports(t, t.declaration.id.name);else if ("VariableDeclaration" === t.declaration.type) for (var n = 0, o = t.declaration.declarations; n < o.length; n++) {
						var h = o[n];this.checkDeclaration(h.id);
					}if (this.state.decoratorStack[this.state.decoratorStack.length - 1].length) {
						var p = t.declaration && ("ClassDeclaration" === t.declaration.type || "ClassExpression" === t.declaration.type);if (!t.declaration || !p) throw this.raise(t.start, "You can only use decorators on an export when exporting a class");this.takeDecorators(t.declaration);
					}
				}, i.checkDeclaration = function (t) {
					if ("ObjectPattern" === t.type) for (var e = 0, s = t.properties; e < s.length; e++) {
						var i = s[e];this.checkDeclaration(i);
					} else if ("ArrayPattern" === t.type) for (var r = 0, a = t.elements; r < a.length; r++) {
						var n = a[r];n && this.checkDeclaration(n);
					} else "ObjectProperty" === t.type ? this.checkDeclaration(t.value) : "RestElement" === t.type ? this.checkDeclaration(t.argument) : "Identifier" === t.type && this.checkDuplicateExports(t, t.name);
				}, i.checkDuplicateExports = function (t, e) {
					this.state.exportedIdentifiers.indexOf(e) > -1 && this.raiseDuplicateExportError(t, e), this.state.exportedIdentifiers.push(e);
				}, i.raiseDuplicateExportError = function (t, e) {
					throw this.raise(t.start, "default" === e ? "Only one default export allowed per module." : '`' + e + '` has already been exported. Exported identifiers must be unique.');
				}, i.parseExportSpecifiers = function () {
					var t,
					    e = [],
					    s = !0;for (this.expect(I.braceL); !this.eat(I.braceR);) {
						if (s) s = !1;else if (this.expect(I.comma), this.eat(I.braceR)) break;var i = this.match(I._default);i && !t && (t = !0);var r = this.startNode();r.local = this.parseIdentifier(i), r.exported = this.eatContextual("as") ? this.parseIdentifier(!0) : r.local.__clone(), e.push(this.finishNode(r, "ExportSpecifier"));
					}return t && !this.isContextual("from") && this.unexpected(), e;
				}, i.parseImport = function (t) {
					return this.match(I.string) ? (t.specifiers = [], t.source = this.parseExprAtom()) : (t.specifiers = [], this.parseImportSpecifiers(t), this.expectContextual("from"), t.source = this.match(I.string) ? this.parseExprAtom() : this.unexpected()), this.semicolon(), this.finishNode(t, "ImportDeclaration");
				}, i.shouldParseDefaultImport = function (t) {
					return this.match(I.name);
				}, i.parseImportSpecifierLocal = function (t, e, s, i) {
					e.local = this.parseIdentifier(), this.checkLVal(e.local, !0, void 0, i), t.specifiers.push(this.finishNode(e, s));
				}, i.parseImportSpecifiers = function (t) {
					var e = !0;if (!this.shouldParseDefaultImport(t) || (this.parseImportSpecifierLocal(t, this.startNode(), "ImportDefaultSpecifier", "default import specifier"), this.eat(I.comma))) {
						if (this.match(I.star)) {
							var s = this.startNode();return this.next(), this.expectContextual("as"), void this.parseImportSpecifierLocal(t, s, "ImportNamespaceSpecifier", "import namespace specifier");
						}for (this.expect(I.braceL); !this.eat(I.braceR);) {
							if (e) e = !1;else if (this.eat(I.colon) && this.unexpected(null, "ES2015 named imports do not destructure. Use another statement for destructuring after the import."), this.expect(I.comma), this.eat(I.braceR)) break;this.parseImportSpecifier(t);
						}
					}
				}, i.parseImportSpecifier = function (t) {
					var e = this.startNode();e.imported = this.parseIdentifier(!0), this.eatContextual("as") ? e.local = this.parseIdentifier() : (this.checkReservedWord(e.imported.name, e.start, !0, !0), e.local = e.imported.__clone()), this.checkLVal(e.local, !0, void 0, "import specifier"), t.specifiers.push(this.finishNode(e, "ImportSpecifier"));
				}, e;
			}(function (t) {
				function e() {
					return t.apply(this, arguments) || this;
				}s(e, t);var i = e.prototype;return i.checkPropClash = function (t, e) {
					if (!t.computed && !t.kind) {
						var s = t.key;"__proto__" === ("Identifier" === s.type ? s.name : String(s.value)) && (e.proto && this.raise(s.start, "Redefinition of __proto__ property"), e.proto = !0);
					}
				}, i.getExpression = function () {
					this.nextToken();var t = this.parseExpression();return this.match(I.eof) || this.unexpected(), t.comments = this.state.comments, t;
				}, i.parseExpression = function (t, e) {
					var s = this.state.start,
					    i = this.state.startLoc,
					    r = this.parseMaybeAssign(t, e);if (this.match(I.comma)) {
						var a = this.startNodeAt(s, i);for (a.expressions = [r]; this.eat(I.comma);) {
							a.expressions.push(this.parseMaybeAssign(t, e));
						}return this.toReferencedList(a.expressions), this.finishNode(a, "SequenceExpression");
					}return r;
				}, i.parseMaybeAssign = function (t, e, s, i) {
					var r = this.state.start,
					    a = this.state.startLoc;if (this.match(I._yield) && this.state.inGenerator) {
						var n = this.parseYield();return s && (n = s.call(this, n, r, a)), n;
					}var o;e ? o = !1 : (e = { start: 0 }, o = !0), (this.match(I.parenL) || this.match(I.name) || this.match(I._yield)) && (this.state.potentialArrowAt = this.state.start);var h = this.parseMaybeConditional(t, e, i);if (s && (h = s.call(this, h, r, a)), this.state.type.isAssign) {
						var p = this.startNodeAt(r, a);if (p.operator = this.state.value, p.left = this.match(I.eq) ? this.toAssignable(h, void 0, "assignment expression") : h, e.start = 0, this.checkLVal(h, void 0, void 0, "assignment expression"), h.extra && h.extra.parenthesized) {
							var c;"ObjectPattern" === h.type ? c = "`({a}) = 0` use `({a} = 0)`" : "ArrayPattern" === h.type && (c = "`([a]) = 0` use `([a] = 0)`"), c && this.raise(h.start, 'You\'re trying to assign to a parenthesized expression, eg. instead of ' + c);
						}return this.next(), p.right = this.parseMaybeAssign(t), this.finishNode(p, "AssignmentExpression");
					}return o && e.start && this.unexpected(e.start), h;
				}, i.parseMaybeConditional = function (t, e, s) {
					var i = this.state.start,
					    r = this.state.startLoc,
					    a = this.state.potentialArrowAt,
					    n = this.parseExprOps(t, e);return "ArrowFunctionExpression" === n.type && n.start === a ? n : e && e.start ? n : this.parseConditional(n, t, i, r, s);
				}, i.parseConditional = function (t, e, s, i, r) {
					if (this.eat(I.question)) {
						var a = this.startNodeAt(s, i);return a.test = t, a.consequent = this.parseMaybeAssign(), this.expect(I.colon), a.alternate = this.parseMaybeAssign(e), this.finishNode(a, "ConditionalExpression");
					}return t;
				}, i.parseExprOps = function (t, e) {
					var s = this.state.start,
					    i = this.state.startLoc,
					    r = this.state.potentialArrowAt,
					    a = this.parseMaybeUnary(e);return "ArrowFunctionExpression" === a.type && a.start === r ? a : e && e.start ? a : this.parseExprOp(a, s, i, -1, t);
				}, i.parseExprOp = function (t, e, s, i, r) {
					var a = this.state.type.binop;if (!(null == a || r && this.match(I._in)) && a > i) {
						var n = this.startNodeAt(e, s);n.left = t, n.operator = this.state.value, "**" !== n.operator || "UnaryExpression" !== t.type || !t.extra || t.extra.parenthesizedArgument || t.extra.parenthesized || this.raise(t.argument.start, "Illegal expression. Wrap left hand side or entire exponentiation in parentheses.");var o = this.state.type;this.next();var h = this.state.start,
						    p = this.state.startLoc;return "|>" === n.operator && (this.expectPlugin("pipelineOperator"), this.state.potentialArrowAt = h), "??" === n.operator && this.expectPlugin("nullishCoalescingOperator"), n.right = this.parseExprOp(this.parseMaybeUnary(), h, p, o.rightAssociative ? a - 1 : a, r), this.finishNode(n, o === I.logicalOR || o === I.logicalAND || o === I.nullishCoalescing ? "LogicalExpression" : "BinaryExpression"), this.parseExprOp(n, e, s, i, r);
					}return t;
				}, i.parseMaybeUnary = function (t) {
					if (this.state.type.prefix) {
						var e = this.startNode(),
						    s = this.match(I.incDec);e.operator = this.state.value, e.prefix = !0, "throw" === e.operator && this.expectPlugin("throwExpressions"), this.next();var i = this.state.type;if (e.argument = this.parseMaybeUnary(), this.addExtra(e, "parenthesizedArgument", !(i !== I.parenL || e.argument.extra && e.argument.extra.parenthesized)), t && t.start && this.unexpected(t.start), s) this.checkLVal(e.argument, void 0, void 0, "prefix operation");else if (this.state.strict && "delete" === e.operator) {
							var r = e.argument;"Identifier" === r.type ? this.raise(e.start, "Deleting local variable in strict mode") : "MemberExpression" === r.type && "PrivateName" === r.property.type && this.raise(e.start, "Deleting a private field is not allowed");
						}return this.finishNode(e, s ? "UpdateExpression" : "UnaryExpression");
					}var a = this.state.start,
					    n = this.state.startLoc,
					    o = this.parseExprSubscripts(t);if (t && t.start) return o;for (; this.state.type.postfix && !this.canInsertSemicolon();) {
						var h = this.startNodeAt(a, n);h.operator = this.state.value, h.prefix = !1, h.argument = o, this.checkLVal(o, void 0, void 0, "postfix operation"), this.next(), o = this.finishNode(h, "UpdateExpression");
					}return o;
				}, i.parseExprSubscripts = function (t) {
					var e = this.state.start,
					    s = this.state.startLoc,
					    i = this.state.potentialArrowAt,
					    r = this.parseExprAtom(t);return "ArrowFunctionExpression" === r.type && r.start === i ? r : t && t.start ? r : this.parseSubscripts(r, e, s);
				}, i.parseSubscripts = function (t, e, s, i) {
					var r = { stop: !1 };do {
						t = this.parseSubscript(t, e, s, i, r);
					} while (!r.stop);return t;
				}, i.parseSubscript = function (t, e, s, i, r) {
					if (!i && this.eat(I.doubleColon)) {
						var a = this.startNodeAt(e, s);return a.object = t, a.callee = this.parseNoCallExpr(), r.stop = !0, this.parseSubscripts(this.finishNode(a, "BindExpression"), e, s, i);
					}if (this.match(I.questionDot)) {
						if (this.expectPlugin("optionalChaining"), i && this.lookahead().type == I.parenL) return r.stop = !0, t;this.next();var n = this.startNodeAt(e, s);if (this.eat(I.bracketL)) return n.object = t, n.property = this.parseExpression(), n.computed = !0, n.optional = !0, this.expect(I.bracketR), this.finishNode(n, "MemberExpression");if (this.eat(I.parenL)) {
							var o = this.atPossibleAsync(t);return n.callee = t, n.arguments = this.parseCallExpressionArguments(I.parenR, o), n.optional = !0, this.finishNode(n, "CallExpression");
						}return n.object = t, n.property = this.parseIdentifier(!0), n.computed = !1, n.optional = !0, this.finishNode(n, "MemberExpression");
					}if (this.eat(I.dot)) {
						var h = this.startNodeAt(e, s);return h.object = t, h.property = this.parseMaybePrivateName(), h.computed = !1, this.finishNode(h, "MemberExpression");
					}if (this.eat(I.bracketL)) {
						var p = this.startNodeAt(e, s);return p.object = t, p.property = this.parseExpression(), p.computed = !0, this.expect(I.bracketR), this.finishNode(p, "MemberExpression");
					}if (!i && this.match(I.parenL)) {
						var c = this.atPossibleAsync(t);this.next();var l = this.startNodeAt(e, s);l.callee = t;var u = { start: -1 };return l.arguments = this.parseCallExpressionArguments(I.parenR, c, u), this.finishCallExpression(l), c && this.shouldParseAsyncArrow() ? (r.stop = !0, u.start > -1 && this.raise(u.start, "A trailing comma is not permitted after the rest element"), this.parseAsyncArrowFromCallExpression(this.startNodeAt(e, s), l)) : (this.toReferencedList(l.arguments), l);
					}if (this.match(I.backQuote)) {
						var d = this.startNodeAt(e, s);return d.tag = t, d.quasi = this.parseTemplate(!0), this.finishNode(d, "TaggedTemplateExpression");
					}return r.stop = !0, t;
				}, i.atPossibleAsync = function (t) {
					return this.state.potentialArrowAt === t.start && "Identifier" === t.type && "async" === t.name && !this.canInsertSemicolon();
				}, i.finishCallExpression = function (t) {
					if ("Import" === t.callee.type) {
						1 !== t.arguments.length && this.raise(t.start, "import() requires exactly one argument");var e = t.arguments[0];e && "SpreadElement" === e.type && this.raise(e.start, "... is not allowed in import()");
					}return this.finishNode(t, "CallExpression");
				}, i.parseCallExpressionArguments = function (t, e, s) {
					for (var i, r = [], a = !0; !this.eat(t);) {
						if (a) a = !1;else if (this.expect(I.comma), this.eat(t)) break;this.match(I.parenL) && !i && (i = this.state.start), r.push(this.parseExprListItem(!1, e ? { start: 0 } : void 0, e ? { start: 0 } : void 0, e ? s : void 0));
					}return e && i && this.shouldParseAsyncArrow() && this.unexpected(), r;
				}, i.shouldParseAsyncArrow = function () {
					return this.match(I.arrow);
				}, i.parseAsyncArrowFromCallExpression = function (t, e) {
					var s = this.state.yieldInPossibleArrowParameters;return this.state.yieldInPossibleArrowParameters = null, this.expect(I.arrow), this.parseArrowExpression(t, e.arguments, !0), this.state.yieldInPossibleArrowParameters = s, t;
				}, i.parseNoCallExpr = function () {
					var t = this.state.start,
					    e = this.state.startLoc;return this.parseSubscripts(this.parseExprAtom(), t, e, !0);
				}, i.parseExprAtom = function (t) {
					var e,
					    s = this.state.potentialArrowAt === this.state.start;switch (this.state.type) {case I._super:
							return this.state.inMethod || this.state.inClassProperty || this.options.allowSuperOutsideMethod || this.raise(this.state.start, "super is only allowed in object methods and classes"), e = this.startNode(), this.next(), this.match(I.parenL) || this.match(I.bracketL) || this.match(I.dot) || this.unexpected(), this.match(I.parenL) && "constructor" !== this.state.inMethod && !this.options.allowSuperOutsideMethod && this.raise(e.start, "super() is only valid inside a class constructor. Make sure the method name is spelled exactly as 'constructor'."), this.finishNode(e, "Super");case I._import:
							return this.lookahead().type === I.dot ? this.parseImportMetaProperty() : (this.expectPlugin("dynamicImport"), e = this.startNode(), this.next(), this.match(I.parenL) || this.unexpected(null, I.parenL), this.finishNode(e, "Import"));case I._this:
							return e = this.startNode(), this.next(), this.finishNode(e, "ThisExpression");case I._yield:
							this.state.inGenerator && this.unexpected();case I.name:
							e = this.startNode();var i = "await" === this.state.value && this.state.inAsync,
							    r = this.shouldAllowYieldIdentifier(),
							    a = this.parseIdentifier(i || r);if ("await" === a.name) {
								if (this.state.inAsync || this.inModule) return this.parseAwait(e);
							} else {
								if ("async" === a.name && this.match(I._function) && !this.canInsertSemicolon()) return this.next(), this.parseFunction(e, !1, !1, !0);if (s && "async" === a.name && this.match(I.name)) {
									var n = this.state.yieldInPossibleArrowParameters;this.state.yieldInPossibleArrowParameters = null;var o = [this.parseIdentifier()];return this.expect(I.arrow), this.parseArrowExpression(e, o, !0), this.state.yieldInPossibleArrowParameters = n, e;
								}
							}if (s && !this.canInsertSemicolon() && this.eat(I.arrow)) {
								var h = this.state.yieldInPossibleArrowParameters;return this.state.yieldInPossibleArrowParameters = null, this.parseArrowExpression(e, [a]), this.state.yieldInPossibleArrowParameters = h, e;
							}return a;case I._do:
							this.expectPlugin("doExpressions");var p = this.startNode();this.next();var c = this.state.inFunction,
							    l = this.state.labels;return this.state.labels = [], this.state.inFunction = !1, p.body = this.parseBlock(!1), this.state.inFunction = c, this.state.labels = l, this.finishNode(p, "DoExpression");case I.regexp:
							var u = this.state.value;return e = this.parseLiteral(u.value, "RegExpLiteral"), e.pattern = u.pattern, e.flags = u.flags, e;case I.num:
							return this.parseLiteral(this.state.value, "NumericLiteral");case I.bigint:
							return this.parseLiteral(this.state.value, "BigIntLiteral");case I.string:
							return this.parseLiteral(this.state.value, "StringLiteral");case I._null:
							return e = this.startNode(), this.next(), this.finishNode(e, "NullLiteral");case I._true:case I._false:
							return this.parseBooleanLiteral();case I.parenL:
							return this.parseParenAndDistinguishExpression(s);case I.bracketL:
							return e = this.startNode(), this.next(), e.elements = this.parseExprList(I.bracketR, !0, t), this.toReferencedList(e.elements), this.finishNode(e, "ArrayExpression");case I.braceL:
							return this.parseObj(!1, t);case I._function:
							return this.parseFunctionExpression();case I.at:
							this.parseDecorators();case I._class:
							return e = this.startNode(), this.takeDecorators(e), this.parseClass(e, !1);case I._new:
							return this.parseNew();case I.backQuote:
							return this.parseTemplate(!1);case I.doubleColon:
							e = this.startNode(), this.next(), e.object = null;var d = e.callee = this.parseNoCallExpr();if ("MemberExpression" === d.type) return this.finishNode(e, "BindExpression");throw this.raise(d.start, "Binding should be performed on object property.");default:
							throw this.unexpected();}
				}, i.parseBooleanLiteral = function () {
					var t = this.startNode();return t.value = this.match(I._true), this.next(), this.finishNode(t, "BooleanLiteral");
				}, i.parseMaybePrivateName = function () {
					if (this.match(I.hash)) {
						this.expectOnePlugin(["classPrivateProperties", "classPrivateMethods"]);var t = this.startNode();return this.next(), t.id = this.parseIdentifier(!0), this.finishNode(t, "PrivateName");
					}return this.parseIdentifier(!0);
				}, i.parseFunctionExpression = function () {
					var t = this.startNode(),
					    e = this.parseIdentifier(!0);return this.state.inGenerator && this.eat(I.dot) ? this.parseMetaProperty(t, e, "sent") : this.parseFunction(t, !1);
				}, i.parseMetaProperty = function (t, e, s) {
					return t.meta = e, "function" === e.name && "sent" === s && (this.isContextual(s) ? this.expectPlugin("functionSent") : this.hasPlugin("functionSent") || this.unexpected()), t.property = this.parseIdentifier(!0), t.property.name !== s && this.raise(t.property.start, 'The only valid meta property for ' + e.name + ' is ' + e.name + '.' + s), this.finishNode(t, "MetaProperty");
				}, i.parseImportMetaProperty = function () {
					var t = this.startNode(),
					    e = this.parseIdentifier(!0);return this.expect(I.dot), "import" === e.name && (this.isContextual("meta") ? this.expectPlugin("importMeta") : this.hasPlugin("importMeta") || this.raise(e.start, 'Dynamic imports require a parameter: import(\'a.js\').then')), this.inModule || this.raise(e.start, 'import.meta may appear only with \'sourceType: "module"\''), this.parseMetaProperty(t, e, "meta");
				}, i.parseLiteral = function (t, e, s, i) {
					s = s || this.state.start, i = i || this.state.startLoc;var r = this.startNodeAt(s, i);return this.addExtra(r, "rawValue", t), this.addExtra(r, "raw", this.input.slice(s, this.state.end)), r.value = t, this.next(), this.finishNode(r, e);
				}, i.parseParenExpression = function () {
					this.expect(I.parenL);var t = this.parseExpression();return this.expect(I.parenR), t;
				}, i.parseParenAndDistinguishExpression = function (t) {
					var e,
					    s = this.state.start,
					    i = this.state.startLoc;this.expect(I.parenL);var r = this.state.maybeInArrowParameters,
					    a = this.state.yieldInPossibleArrowParameters;this.state.maybeInArrowParameters = !0, this.state.yieldInPossibleArrowParameters = null;for (var n, o, h = this.state.start, p = this.state.startLoc, c = [], l = { start: 0 }, u = { start: 0 }, d = !0; !this.match(I.parenR);) {
						if (d) d = !1;else if (this.expect(I.comma, u.start || null), this.match(I.parenR)) {
							o = this.state.start;break;
						}if (this.match(I.ellipsis)) {
							var f = this.state.start,
							    m = this.state.startLoc;n = this.state.start, c.push(this.parseParenItem(this.parseRest(), f, m)), this.match(I.comma) && this.lookahead().type === I.parenR && this.raise(this.state.start, "A trailing comma is not permitted after the rest element");break;
						}c.push(this.parseMaybeAssign(!1, l, this.parseParenItem, u));
					}var y = this.state.start,
					    x = this.state.startLoc;this.expect(I.parenR), this.state.maybeInArrowParameters = r;var P = this.startNodeAt(s, i);if (t && this.shouldParseArrow() && (P = this.parseArrow(P))) {
						for (var v = 0; v < c.length; v++) {
							var g = c[v];g.extra && g.extra.parenthesized && this.unexpected(g.extra.parenStart);
						}return this.parseArrowExpression(P, c), this.state.yieldInPossibleArrowParameters = a, P;
					}return this.state.yieldInPossibleArrowParameters = a, c.length || this.unexpected(this.state.lastTokStart), o && this.unexpected(o), n && this.unexpected(n), l.start && this.unexpected(l.start), u.start && this.unexpected(u.start), c.length > 1 ? ((e = this.startNodeAt(h, p)).expressions = c, this.toReferencedList(e.expressions), this.finishNodeAt(e, "SequenceExpression", y, x)) : e = c[0], this.addExtra(e, "parenthesized", !0), this.addExtra(e, "parenStart", s), e;
				}, i.shouldParseArrow = function () {
					return !this.canInsertSemicolon();
				}, i.parseArrow = function (t) {
					if (this.eat(I.arrow)) return t;
				}, i.parseParenItem = function (t, e, s) {
					return t;
				}, i.parseNew = function () {
					var t = this.startNode(),
					    e = this.parseIdentifier(!0);if (this.eat(I.dot)) {
						var s = this.parseMetaProperty(t, e, "target");if (!this.state.inFunction && !this.state.inClassProperty) {
							var i = "new.target can only be used in functions";this.hasPlugin("classProperties") && (i += " or class properties"), this.raise(s.start, i);
						}return s;
					}return t.callee = this.parseNoCallExpr(), this.eat(I.questionDot) && (t.optional = !0), this.parseNewArguments(t), this.finishNode(t, "NewExpression");
				}, i.parseNewArguments = function (t) {
					if (this.eat(I.parenL)) {
						var e = this.parseExprList(I.parenR);this.toReferencedList(e), t.arguments = e;
					} else t.arguments = [];
				}, i.parseTemplateElement = function (t) {
					var e = this.startNode();return null === this.state.value && (t ? this.state.invalidTemplateEscapePosition = null : this.raise(this.state.invalidTemplateEscapePosition || 0, "Invalid escape sequence in template")), e.value = { raw: this.input.slice(this.state.start, this.state.end).replace(/\r\n?/g, "\n"), cooked: this.state.value }, this.next(), e.tail = this.match(I.backQuote), this.finishNode(e, "TemplateElement");
				}, i.parseTemplate = function (t) {
					var e = this.startNode();this.next(), e.expressions = [];var s = this.parseTemplateElement(t);for (e.quasis = [s]; !s.tail;) {
						this.expect(I.dollarBraceL), e.expressions.push(this.parseExpression()), this.expect(I.braceR), e.quasis.push(s = this.parseTemplateElement(t));
					}return this.next(), this.finishNode(e, "TemplateLiteral");
				}, i.parseObj = function (t, e) {
					var s = [],
					    i = Object.create(null),
					    r = !0,
					    a = this.startNode();a.properties = [], this.next();for (var n = null; !this.eat(I.braceR);) {
						if (r) r = !1;else if (this.expect(I.comma), this.eat(I.braceR)) break;if (this.match(I.at)) if (this.hasPlugin("decorators2")) this.raise(this.state.start, "Stage 2 decorators disallow object literal property decorators");else for (; this.match(I.at);) {
							s.push(this.parseDecorator());
						}var o = this.startNode(),
						    h = !1,
						    p = !1,
						    c = void 0,
						    l = void 0;if (s.length && (o.decorators = s, s = []), this.match(I.ellipsis)) {
							if (this.expectPlugin("objectRestSpread"), o = this.parseSpread(t ? { start: 0 } : void 0), t && this.toAssignable(o, !0, "object pattern"), a.properties.push(o), !t) continue;var u = this.state.start;if (null !== n) this.unexpected(n, "Cannot have multiple rest elements when destructuring");else {
								if (this.eat(I.braceR)) break;if (!this.match(I.comma) || this.lookahead().type !== I.braceR) {
									n = u;continue;
								}this.unexpected(u, "A trailing comma is not permitted after the rest element");
							}
						}if (o.method = !1, (t || e) && (c = this.state.start, l = this.state.startLoc), t || (h = this.eat(I.star)), !t && this.isContextual("async")) {
							h && this.unexpected();var d = this.parseIdentifier();this.match(I.colon) || this.match(I.parenL) || this.match(I.braceR) || this.match(I.eq) || this.match(I.comma) ? (o.key = d, o.computed = !1) : (p = !0, this.match(I.star) && (this.expectPlugin("asyncGenerators"), this.next(), h = !0), this.parsePropertyName(o));
						} else this.parsePropertyName(o);this.parseObjPropValue(o, c, l, h, p, t, e), this.checkPropClash(o, i), o.shorthand && this.addExtra(o, "shorthand", !0), a.properties.push(o);
					}return null !== n && this.unexpected(n, "The rest element has to be the last element when destructuring"), s.length && this.raise(this.state.start, "You have trailing decorators with no property"), this.finishNode(a, t ? "ObjectPattern" : "ObjectExpression");
				}, i.isGetterOrSetterMethod = function (t, e) {
					return !e && !t.computed && "Identifier" === t.key.type && ("get" === t.key.name || "set" === t.key.name) && (this.match(I.string) || this.match(I.num) || this.match(I.bracketL) || this.match(I.name) || !!this.state.type.keyword);
				}, i.checkGetterSetterParamCount = function (t) {
					var e = "get" === t.kind ? 0 : 1;if (t.params.length !== e) {
						var s = t.start;"get" === t.kind ? this.raise(s, "getter should have no params") : this.raise(s, "setter should have exactly one param");
					}
				}, i.parseObjectMethod = function (t, e, s, i) {
					return s || e || this.match(I.parenL) ? (i && this.unexpected(), t.kind = "method", t.method = !0, this.parseMethod(t, e, s, !1, "ObjectMethod")) : this.isGetterOrSetterMethod(t, i) ? ((e || s) && this.unexpected(), t.kind = t.key.name, this.parsePropertyName(t), this.parseMethod(t, !1, !1, !1, "ObjectMethod"), this.checkGetterSetterParamCount(t), t) : void 0;
				}, i.parseObjectProperty = function (t, e, s, i, r) {
					return t.shorthand = !1, this.eat(I.colon) ? (t.value = i ? this.parseMaybeDefault(this.state.start, this.state.startLoc) : this.parseMaybeAssign(!1, r), this.finishNode(t, "ObjectProperty")) : t.computed || "Identifier" !== t.key.type ? void 0 : (this.checkReservedWord(t.key.name, t.key.start, !0, !0), i ? t.value = this.parseMaybeDefault(e, s, t.key.__clone()) : this.match(I.eq) && r ? (r.start || (r.start = this.state.start), t.value = this.parseMaybeDefault(e, s, t.key.__clone())) : t.value = t.key.__clone(), t.shorthand = !0, this.finishNode(t, "ObjectProperty"));
				}, i.parseObjPropValue = function (t, e, s, i, r, a, n) {
					var o = this.parseObjectMethod(t, i, r, a) || this.parseObjectProperty(t, e, s, a, n);return o || this.unexpected(), o;
				}, i.parsePropertyName = function (t) {
					if (this.eat(I.bracketL)) t.computed = !0, t.key = this.parseMaybeAssign(), this.expect(I.bracketR);else {
						var e = this.state.inPropertyName;this.state.inPropertyName = !0, t.key = this.match(I.num) || this.match(I.string) ? this.parseExprAtom() : this.parseMaybePrivateName(), "PrivateName" !== t.key.type && (t.computed = !1), this.state.inPropertyName = e;
					}return t.key;
				}, i.initFunction = function (t, e) {
					t.id = null, t.generator = !1, t.async = !!e;
				}, i.parseMethod = function (t, e, s, i, r) {
					var a = this.state.inFunction,
					    n = this.state.inMethod,
					    o = this.state.inGenerator;this.state.inFunction = !0, this.state.inMethod = t.kind || !0, this.state.inGenerator = e, this.initFunction(t, s), t.generator = !!e;var h = i;return this.parseFunctionParams(t, h), this.parseFunctionBodyAndFinish(t, r), this.state.inFunction = a, this.state.inMethod = n, this.state.inGenerator = o, t;
				}, i.parseArrowExpression = function (t, e, s) {
					this.state.yieldInPossibleArrowParameters && this.raise(this.state.yieldInPossibleArrowParameters.start, "yield is not allowed in the parameters of an arrow function inside a generator");var i = this.state.inFunction;this.state.inFunction = !0, this.initFunction(t, s), e && this.setArrowFunctionParameters(t, e);var r = this.state.inGenerator,
					    a = this.state.maybeInArrowParameters;return this.state.inGenerator = !1, this.state.maybeInArrowParameters = !1, this.parseFunctionBody(t, !0), this.state.inGenerator = r, this.state.inFunction = i, this.state.maybeInArrowParameters = a, this.finishNode(t, "ArrowFunctionExpression");
				}, i.setArrowFunctionParameters = function (t, e) {
					t.params = this.toAssignableList(e, !0, "arrow function parameters");
				}, i.isStrictBody = function (t) {
					if ("BlockStatement" === t.body.type && t.body.directives.length) for (var e = 0, s = t.body.directives; e < s.length; e++) {
						if ("use strict" === s[e].value.value) return !0;
					}return !1;
				}, i.parseFunctionBodyAndFinish = function (t, e, s) {
					this.parseFunctionBody(t, s), this.finishNode(t, e);
				}, i.parseFunctionBody = function (t, e) {
					var s = e && !this.match(I.braceL),
					    i = this.state.inParameters,
					    r = this.state.inAsync;if (this.state.inParameters = !1, this.state.inAsync = t.async, s) t.body = this.parseMaybeAssign();else {
						var a = this.state.inGenerator,
						    n = this.state.inFunction,
						    o = this.state.labels;this.state.inGenerator = t.generator, this.state.inFunction = !0, this.state.labels = [], t.body = this.parseBlock(!0), this.state.inFunction = n, this.state.inGenerator = a, this.state.labels = o;
					}this.state.inAsync = r, this.checkFunctionNameAndParams(t, e), this.state.inParameters = i;
				}, i.checkFunctionNameAndParams = function (t, e) {
					var s = this.isStrictBody(t),
					    i = this.state.strict || s || e,
					    r = this.state.strict;if (s && (this.state.strict = s), t.id && this.checkReservedWord(t.id, t.start, !0, !0), i) {
						var a = Object.create(null);t.id && this.checkLVal(t.id, !0, void 0, "function name");for (var n = 0, o = t.params; n < o.length; n++) {
							var h = o[n];s && "Identifier" !== h.type && this.raise(h.start, "Non-simple parameter in strict mode"), this.checkLVal(h, !0, a, "function parameter list");
						}
					}this.state.strict = r;
				}, i.parseExprList = function (t, e, s) {
					for (var i = [], r = !0; !this.eat(t);) {
						if (r) r = !1;else if (this.expect(I.comma), this.eat(t)) break;i.push(this.parseExprListItem(e, s));
					}return i;
				}, i.parseExprListItem = function (t, e, s, i) {
					var r;return t && this.match(I.comma) ? r = null : this.match(I.ellipsis) ? (r = this.parseSpread(e), i && this.match(I.comma) && (i.start = this.state.start)) : r = this.parseMaybeAssign(!1, e, this.parseParenItem, s), r;
				}, i.parseIdentifier = function (t) {
					var e = this.startNode(),
					    s = this.parseIdentifierName(e.start, t);return e.name = s, e.loc.identifierName = s, this.finishNode(e, "Identifier");
				}, i.parseIdentifierName = function (t, e) {
					e || this.checkReservedWord(this.state.value, this.state.start, !!this.state.type.keyword, !1);var s;if (this.match(I.name)) s = this.state.value;else {
						if (!this.state.type.keyword) throw this.unexpected();s = this.state.type.keyword;
					}return !e && "await" === s && this.state.inAsync && this.raise(t, "invalid use of await inside of an async function"), this.next(), s;
				}, i.checkReservedWord = function (t, e, s, i) {
					this.state.strict && (D.strict(t) || i && D.strictBind(t)) && this.raise(e, t + " is a reserved word in strict mode"), this.state.inGenerator && "yield" === t && this.raise(e, "yield is a reserved word inside generator functions"), (this.isReservedWord(t) || s && this.isKeyword(t)) && this.raise(e, t + " is a reserved word");
				}, i.parseAwait = function (t) {
					return this.state.inAsync || this.unexpected(), this.match(I.star) && this.raise(t.start, "await* has been removed from the async functions proposal. Use Promise.all() instead."), t.argument = this.parseMaybeUnary(), this.finishNode(t, "AwaitExpression");
				}, i.parseYield = function () {
					var t = this.startNode();return this.state.inParameters && this.raise(t.start, "yield is not allowed in generator parameters"), this.state.maybeInArrowParameters && !this.state.yieldInPossibleArrowParameters && (this.state.yieldInPossibleArrowParameters = t), this.next(), this.match(I.semi) || this.canInsertSemicolon() || !this.match(I.star) && !this.state.type.startsExpr ? (t.delegate = !1, t.argument = null) : (t.delegate = this.eat(I.star), t.argument = this.parseMaybeAssign()), this.finishNode(t, "YieldExpression");
				}, e;
			}(function (t) {
				function e() {
					return t.apply(this, arguments) || this;
				}s(e, t);var i = e.prototype;return i.toAssignable = function (t, e, s) {
					if (t) switch (t.type) {case "Identifier":case "ObjectPattern":case "ArrayPattern":case "AssignmentPattern":
							break;case "ObjectExpression":
							t.type = "ObjectPattern";for (var i = 0; i < t.properties.length; i++) {
								var r = t.properties[i],
								    a = i === t.properties.length - 1;this.toAssignableObjectExpressionProp(r, e, a);
							}break;case "ObjectProperty":
							this.toAssignable(t.value, e, s);break;case "SpreadElement":
							this.checkToRestConversion(t), t.type = "RestElement";var n = t.argument;this.toAssignable(n, e, s);break;case "ArrayExpression":
							t.type = "ArrayPattern", this.toAssignableList(t.elements, e, s);break;case "AssignmentExpression":
							"=" === t.operator ? (t.type = "AssignmentPattern", delete t.operator) : this.raise(t.left.end, "Only '=' operator can be used for specifying default value.");break;case "MemberExpression":
							if (!e) break;default:
							var o = "Invalid left-hand side" + (s ? " in " + s : "expression");this.raise(t.start, o);}return t;
				}, i.toAssignableObjectExpressionProp = function (t, e, s) {
					if ("ObjectMethod" === t.type) {
						var i = "get" === t.kind || "set" === t.kind ? "Object pattern can't contain getter or setter" : "Object pattern can't contain methods";this.raise(t.key.start, i);
					} else "SpreadElement" !== t.type || s ? this.toAssignable(t, e, "object destructuring pattern") : this.raise(t.start, "The rest element has to be the last element when destructuring");
				}, i.toAssignableList = function (t, e, s) {
					var i = t.length;if (i) {
						var r = t[i - 1];if (r && "RestElement" === r.type) --i;else if (r && "SpreadElement" === r.type) {
							r.type = "RestElement";var a = r.argument;this.toAssignable(a, e, s), "Identifier" !== a.type && "MemberExpression" !== a.type && "ArrayPattern" !== a.type && this.unexpected(a.start), --i;
						}
					}for (var n = 0; n < i; n++) {
						var o = t[n];o && "SpreadElement" === o.type && this.raise(o.start, "The rest element has to be the last element when destructuring"), o && this.toAssignable(o, e, s);
					}return t;
				}, i.toReferencedList = function (t) {
					return t;
				}, i.parseSpread = function (t) {
					var e = this.startNode();return this.next(), e.argument = this.parseMaybeAssign(!1, t), this.finishNode(e, "SpreadElement");
				}, i.parseRest = function () {
					var t = this.startNode();return this.next(), t.argument = this.parseBindingAtom(), this.finishNode(t, "RestElement");
				}, i.shouldAllowYieldIdentifier = function () {
					return this.match(I._yield) && !this.state.strict && !this.state.inGenerator;
				}, i.parseBindingIdentifier = function () {
					return this.parseIdentifier(this.shouldAllowYieldIdentifier());
				}, i.parseBindingAtom = function () {
					switch (this.state.type) {case I._yield:case I.name:
							return this.parseBindingIdentifier();case I.bracketL:
							var t = this.startNode();return this.next(), t.elements = this.parseBindingList(I.bracketR, !0), this.finishNode(t, "ArrayPattern");case I.braceL:
							return this.parseObj(!0);default:
							throw this.unexpected();}
				}, i.parseBindingList = function (t, e, s) {
					for (var i = [], r = !0; !this.eat(t);) {
						if (r ? r = !1 : this.expect(I.comma), e && this.match(I.comma)) i.push(null);else {
							if (this.eat(t)) break;if (this.match(I.ellipsis)) {
								i.push(this.parseAssignableListItemTypes(this.parseRest())), this.expect(t);break;
							}var a = [];for (this.match(I.at) && this.hasPlugin("decorators2") && this.raise(this.state.start, "Stage 2 decorators cannot be used to decorate parameters"); this.match(I.at);) {
								a.push(this.parseDecorator());
							}i.push(this.parseAssignableListItem(s, a));
						}
					}return i;
				}, i.parseAssignableListItem = function (t, e) {
					var s = this.parseMaybeDefault();this.parseAssignableListItemTypes(s);var i = this.parseMaybeDefault(s.start, s.loc.start, s);return e.length && (s.decorators = e), i;
				}, i.parseAssignableListItemTypes = function (t) {
					return t;
				}, i.parseMaybeDefault = function (t, e, s) {
					if (e = e || this.state.startLoc, t = t || this.state.start, s = s || this.parseBindingAtom(), !this.eat(I.eq)) return s;var i = this.startNodeAt(t, e);return i.left = s, i.right = this.parseMaybeAssign(), this.finishNode(i, "AssignmentPattern");
				}, i.checkLVal = function (t, e, s, i) {
					switch (t.type) {case "Identifier":
							if (this.checkReservedWord(t.name, t.start, !1, !0), s) {
								var r = '_' + t.name;s[r] ? this.raise(t.start, "Argument name clash in strict mode") : s[r] = !0;
							}break;case "MemberExpression":
							e && this.raise(t.start, "Binding member expression");break;case "ObjectPattern":
							for (var a = 0, n = t.properties; a < n.length; a++) {
								var o = n[a];"ObjectProperty" === o.type && (o = o.value), this.checkLVal(o, e, s, "object destructuring pattern");
							}break;case "ArrayPattern":
							for (var h = 0, p = t.elements; h < p.length; h++) {
								var c = p[h];c && this.checkLVal(c, e, s, "array destructuring pattern");
							}break;case "AssignmentPattern":
							this.checkLVal(t.left, e, s, "assignment pattern");break;case "RestElement":
							this.checkLVal(t.argument, e, s, "rest element");break;default:
							var l = (e ? "Binding invalid" : "Invalid") + " left-hand side" + (i ? " in " + i : "expression");this.raise(t.start, l);}
				}, i.checkToRestConversion = function (t) {
					-1 === ["Identifier", "MemberExpression"].indexOf(t.argument.type) && this.raise(t.argument.start, "Invalid rest operator's argument");
				}, e;
			}(function (t) {
				function e() {
					return t.apply(this, arguments) || this;
				}s(e, t);var i = e.prototype;return i.startNode = function () {
					return new st(this, this.state.start, this.state.startLoc);
				}, i.startNodeAt = function (t, e) {
					return new st(this, t, e);
				}, i.startNodeAtNode = function (t) {
					return this.startNodeAt(t.start, t.loc.start);
				}, i.finishNode = function (t, e) {
					return this.finishNodeAt(t, e, this.state.lastTokEnd, this.state.lastTokEndLoc);
				}, i.finishNodeAt = function (t, e, s, i) {
					return t.type = e, t.end = s, t.loc.end = i, this.options.ranges && (t.range[1] = s), this.processComment(t), t;
				}, i.resetStartLocationFromNode = function (t, e) {
					t.start = e.start, t.loc.start = e.loc.start, this.options.ranges && (t.range[0] = e.range[0]);
				}, e;
			}(tt))))),
			    ht = ["any", "bool", "boolean", "empty", "false", "mixed", "null", "number", "static", "string", "true", "typeof", "void"],
			    pt = { const: "declare export var", let: "declare export var", type: "export type", interface: "export interface" },
			    ct = { quot: '"', amp: "&", apos: "'", lt: "<", gt: ">", nbsp: " ", iexcl: "¡", cent: "¢", pound: "£", curren: "¤", yen: "¥", brvbar: "¦", sect: "§", uml: "¨", copy: "©", ordf: "ª", laquo: "«", not: "¬", shy: "­", reg: "®", macr: "¯", deg: "°", plusmn: "±", sup2: "²", sup3: "³", acute: "´", micro: "µ", para: "¶", middot: "·", cedil: "¸", sup1: "¹", ordm: "º", raquo: "»", frac14: "¼", frac12: "½", frac34: "¾", iquest: "¿", Agrave: "À", Aacute: "Á", Acirc: "Â", Atilde: "Ã", Auml: "Ä", Aring: "Å", AElig: "Æ", Ccedil: "Ç", Egrave: "È", Eacute: "É", Ecirc: "Ê", Euml: "Ë", Igrave: "Ì", Iacute: "Í", Icirc: "Î", Iuml: "Ï", ETH: "Ð", Ntilde: "Ñ", Ograve: "Ò", Oacute: "Ó", Ocirc: "Ô", Otilde: "Õ", Ouml: "Ö", times: "×", Oslash: "Ø", Ugrave: "Ù", Uacute: "Ú", Ucirc: "Û", Uuml: "Ü", Yacute: "Ý", THORN: "Þ", szlig: "ß", agrave: "à", aacute: "á", acirc: "â", atilde: "ã", auml: "ä", aring: "å", aelig: "æ", ccedil: "ç", egrave: "è", eacute: "é", ecirc: "ê", euml: "ë", igrave: "ì", iacute: "í", icirc: "î", iuml: "ï", eth: "ð", ntilde: "ñ", ograve: "ò", oacute: "ó", ocirc: "ô", otilde: "õ", ouml: "ö", divide: "÷", oslash: "ø", ugrave: "ù", uacute: "ú", ucirc: "û", uuml: "ü", yacute: "ý", thorn: "þ", yuml: "ÿ", OElig: "Œ", oelig: "œ", Scaron: "Š", scaron: "š", Yuml: "Ÿ", fnof: "ƒ", circ: "ˆ", tilde: "˜", Alpha: "Α", Beta: "Β", Gamma: "Γ", Delta: "Δ", Epsilon: "Ε", Zeta: "Ζ", Eta: "Η", Theta: "Θ", Iota: "Ι", Kappa: "Κ", Lambda: "Λ", Mu: "Μ", Nu: "Ν", Xi: "Ξ", Omicron: "Ο", Pi: "Π", Rho: "Ρ", Sigma: "Σ", Tau: "Τ", Upsilon: "Υ", Phi: "Φ", Chi: "Χ", Psi: "Ψ", Omega: "Ω", alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", zeta: "ζ", eta: "η", theta: "θ", iota: "ι", kappa: "κ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", omicron: "ο", pi: "π", rho: "ρ", sigmaf: "ς", sigma: "σ", tau: "τ", upsilon: "υ", phi: "φ", chi: "χ", psi: "ψ", omega: "ω", thetasym: "ϑ", upsih: "ϒ", piv: "ϖ", ensp: " ", emsp: " ", thinsp: " ", zwnj: "‌", zwj: "‍", lrm: "‎", rlm: "‏", ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", sbquo: "‚", ldquo: "“", rdquo: "”", bdquo: "„", dagger: "†", Dagger: "‡", bull: "•", hellip: "…", permil: "‰", prime: "′", Prime: "″", lsaquo: "‹", rsaquo: "›", oline: "‾", frasl: "⁄", euro: "€", image: "ℑ", weierp: "℘", real: "ℜ", trade: "™", alefsym: "ℵ", larr: "←", uarr: "↑", rarr: "→", darr: "↓", harr: "↔", crarr: "↵", lArr: "⇐", uArr: "⇑", rArr: "⇒", dArr: "⇓", hArr: "⇔", forall: "∀", part: "∂", exist: "∃", empty: "∅", nabla: "∇", isin: "∈", notin: "∉", ni: "∋", prod: "∏", sum: "∑", minus: "−", lowast: "∗", radic: "√", prop: "∝", infin: "∞", ang: "∠", and: "∧", or: "∨", cap: "∩", cup: "∪", int: "∫", there4: "∴", sim: "∼", cong: "≅", asymp: "≈", ne: "≠", equiv: "≡", le: "≤", ge: "≥", sub: "⊂", sup: "⊃", nsub: "⊄", sube: "⊆", supe: "⊇", oplus: "⊕", otimes: "⊗", perp: "⊥", sdot: "⋅", lceil: "⌈", rceil: "⌉", lfloor: "⌊", rfloor: "⌋", lang: "〈", rang: "〉", loz: "◊", spades: "♠", clubs: "♣", hearts: "♥", diams: "♦" },
			    lt = /^[\da-fA-F]+$/,
			    ut = /^\d+$/;G.j_oTag = new W("<tag", !1), G.j_cTag = new W("</tag", !1), G.j_expr = new W("<tag>...</tag>", !0, !0), I.jsxName = new k("jsxName"), I.jsxText = new k("jsxText", { beforeExpr: !0 }), I.jsxTagStart = new k("jsxTagStart", { startsExpr: !0 }), I.jsxTagEnd = new k("jsxTagEnd"), I.jsxTagStart.updateContext = function () {
				this.state.context.push(G.j_expr), this.state.context.push(G.j_oTag), this.state.exprAllowed = !1;
			}, I.jsxTagEnd.updateContext = function (t) {
				var e = this.state.context.pop();e === G.j_oTag && t === I.slash || e === G.j_cTag ? (this.state.context.pop(), this.state.exprAllowed = this.curContext() === G.j_expr) : this.state.exprAllowed = !0;
			};nt.estree = function (t) {
				return function (t) {
					function e() {
						return t.apply(this, arguments) || this;
					}s(e, t);var i = e.prototype;return i.estreeParseRegExpLiteral = function (t) {
						var e = t.pattern,
						    s = t.flags,
						    i = null;try {
							i = new RegExp(e, s);
						} catch (t) {}var r = this.estreeParseLiteral(i);return r.regex = { pattern: e, flags: s }, r;
					}, i.estreeParseLiteral = function (t) {
						return this.parseLiteral(t, "Literal");
					}, i.directiveToStmt = function (t) {
						var e = t.value,
						    s = this.startNodeAt(t.start, t.loc.start),
						    i = this.startNodeAt(e.start, e.loc.start);return i.value = e.value, i.raw = e.extra.raw, s.expression = this.finishNodeAt(i, "Literal", e.end, e.loc.end), s.directive = e.extra.raw.slice(1, -1), this.finishNodeAt(s, "ExpressionStatement", t.end, t.loc.end);
					}, i.initFunction = function (e, s) {
						t.prototype.initFunction.call(this, e, s), e.expression = !1;
					}, i.checkDeclaration = function (e) {
						d(e) ? this.checkDeclaration(e.value) : t.prototype.checkDeclaration.call(this, e);
					}, i.checkGetterSetterParamCount = function (t) {
						var e = "get" === t.kind ? 0 : 1;if (t.value.params.length !== e) {
							var s = t.start;"get" === t.kind ? this.raise(s, "getter should have no params") : this.raise(s, "setter should have exactly one param");
						}
					}, i.checkLVal = function (e, s, i, r) {
						var a = this;switch (e.type) {case "ObjectPattern":
								e.properties.forEach(function (t) {
									a.checkLVal("Property" === t.type ? t.value : t, s, i, "object destructuring pattern");
								});break;default:
								t.prototype.checkLVal.call(this, e, s, i, r);}
					}, i.checkPropClash = function (t, e) {
						if (!t.computed && d(t)) {
							var s = t.key;"__proto__" === ("Identifier" === s.type ? s.name : String(s.value)) && (e.proto && this.raise(s.start, "Redefinition of __proto__ property"), e.proto = !0);
						}
					}, i.isStrictBody = function (t) {
						if ("BlockStatement" === t.body.type && t.body.body.length > 0) for (var e = 0, s = t.body.body; e < s.length; e++) {
							var i = s[e];if ("ExpressionStatement" !== i.type || "Literal" !== i.expression.type) break;if ("use strict" === i.expression.value) return !0;
						}return !1;
					}, i.isValidDirective = function (t) {
						return !("ExpressionStatement" !== t.type || "Literal" !== t.expression.type || "string" != typeof t.expression.value || t.expression.extra && t.expression.extra.parenthesized);
					}, i.stmtToDirective = function (e) {
						var s = t.prototype.stmtToDirective.call(this, e),
						    i = e.expression.value;return s.value.value = i, s;
					}, i.parseBlockBody = function (e, s, i, r) {
						var a = this;t.prototype.parseBlockBody.call(this, e, s, i, r);var n = e.directives.map(function (t) {
							return a.directiveToStmt(t);
						});e.body = n.concat(e.body), delete e.directives;
					}, i.pushClassMethod = function (t, e, s, i, r) {
						this.parseMethod(e, s, i, r, "MethodDefinition"), e.typeParameters && (e.value.typeParameters = e.typeParameters, delete e.typeParameters), t.body.push(e);
					}, i.parseExprAtom = function (e) {
						switch (this.state.type) {case I.regexp:
								return this.estreeParseRegExpLiteral(this.state.value);case I.num:case I.string:
								return this.estreeParseLiteral(this.state.value);case I._null:
								return this.estreeParseLiteral(null);case I._true:
								return this.estreeParseLiteral(!0);case I._false:
								return this.estreeParseLiteral(!1);default:
								return t.prototype.parseExprAtom.call(this, e);}
					}, i.parseLiteral = function (e, s, i, r) {
						var a = t.prototype.parseLiteral.call(this, e, s, i, r);return a.raw = a.extra.raw, delete a.extra, a;
					}, i.parseFunctionBody = function (e, s) {
						t.prototype.parseFunctionBody.call(this, e, s), e.expression = "BlockStatement" !== e.body.type;
					}, i.parseMethod = function (e, s, i, r, a) {
						var n = this.startNode();return n.kind = e.kind, n = t.prototype.parseMethod.call(this, n, s, i, r, "FunctionExpression"), delete n.kind, e.value = n, this.finishNode(e, a);
					}, i.parseObjectMethod = function (e, s, i, r) {
						var a = t.prototype.parseObjectMethod.call(this, e, s, i, r);return a && (a.type = "Property", "method" === a.kind && (a.kind = "init"), a.shorthand = !1), a;
					}, i.parseObjectProperty = function (e, s, i, r, a) {
						var n = t.prototype.parseObjectProperty.call(this, e, s, i, r, a);return n && (n.kind = "init", n.type = "Property"), n;
					}, i.toAssignable = function (e, s, i) {
						return d(e) ? (this.toAssignable(e.value, s, i), e) : t.prototype.toAssignable.call(this, e, s, i);
					}, i.toAssignableObjectExpressionProp = function (e, s, i) {
						"get" === e.kind || "set" === e.kind ? this.raise(e.key.start, "Object pattern can't contain getter or setter") : e.method ? this.raise(e.key.start, "Object pattern can't contain methods") : t.prototype.toAssignableObjectExpressionProp.call(this, e, s, i);
					}, e;
				}(t);
			}, nt.flow = function (t) {
				return function (t) {
					function e() {
						return t.apply(this, arguments) || this;
					}s(e, t);var i = e.prototype;return i.flowParseTypeInitialiser = function (t) {
						var e = this.state.inType;this.state.inType = !0, this.expect(t || I.colon);var s = this.flowParseType();return this.state.inType = e, s;
					}, i.flowParsePredicate = function () {
						var t = this.startNode(),
						    e = this.state.startLoc,
						    s = this.state.start;this.expect(I.modulo);var i = this.state.startLoc;return this.expectContextual("checks"), e.line === i.line && e.column === i.column - 1 || this.raise(s, "Spaces between ´%´ and ´checks´ are not allowed here."), this.eat(I.parenL) ? (t.value = this.parseExpression(), this.expect(I.parenR), this.finishNode(t, "DeclaredPredicate")) : this.finishNode(t, "InferredPredicate");
					}, i.flowParseTypeAndPredicateInitialiser = function () {
						var t = this.state.inType;this.state.inType = !0, this.expect(I.colon);var e = null,
						    s = null;return this.match(I.modulo) ? (this.state.inType = t, s = this.flowParsePredicate()) : (e = this.flowParseType(), this.state.inType = t, this.match(I.modulo) && (s = this.flowParsePredicate())), [e, s];
					}, i.flowParseDeclareClass = function (t) {
						return this.next(), this.flowParseInterfaceish(t, !0), this.finishNode(t, "DeclareClass");
					}, i.flowParseDeclareFunction = function (t) {
						this.next();var e = t.id = this.parseIdentifier(),
						    s = this.startNode(),
						    i = this.startNode();this.isRelational("<") ? s.typeParameters = this.flowParseTypeParameterDeclaration() : s.typeParameters = null, this.expect(I.parenL);var r = this.flowParseFunctionTypeParams();s.params = r.params, s.rest = r.rest, this.expect(I.parenR);var a = this.flowParseTypeAndPredicateInitialiser();return s.returnType = a[0], t.predicate = a[1], i.typeAnnotation = this.finishNode(s, "FunctionTypeAnnotation"), e.typeAnnotation = this.finishNode(i, "TypeAnnotation"), this.finishNode(e, e.type), this.semicolon(), this.finishNode(t, "DeclareFunction");
					}, i.flowParseDeclare = function (t, e) {
						if (this.match(I._class)) return this.flowParseDeclareClass(t);if (this.match(I._function)) return this.flowParseDeclareFunction(t);if (this.match(I._var)) return this.flowParseDeclareVariable(t);if (this.isContextual("module")) return this.lookahead().type === I.dot ? this.flowParseDeclareModuleExports(t) : (e && this.unexpected(null, "`declare module` cannot be used inside another `declare module`"), this.flowParseDeclareModule(t));if (this.isContextual("type")) return this.flowParseDeclareTypeAlias(t);if (this.isContextual("opaque")) return this.flowParseDeclareOpaqueType(t);if (this.isContextual("interface")) return this.flowParseDeclareInterface(t);if (this.match(I._export)) return this.flowParseDeclareExportDeclaration(t, e);throw this.unexpected();
					}, i.flowParseDeclareVariable = function (t) {
						return this.next(), t.id = this.flowParseTypeAnnotatableIdentifier(!0), this.semicolon(), this.finishNode(t, "DeclareVariable");
					}, i.flowParseDeclareModule = function (t) {
						var e = this;this.next(), this.match(I.string) ? t.id = this.parseExprAtom() : t.id = this.parseIdentifier();var s = t.body = this.startNode(),
						    i = s.body = [];for (this.expect(I.braceL); !this.match(I.braceR);) {
							var r = this.startNode();if (this.match(I._import)) {
								var a = this.lookahead();"type" !== a.value && "typeof" !== a.value && this.unexpected(null, "Imports within a `declare module` body must always be `import type` or `import typeof`"), this.next(), this.parseImport(r);
							} else this.expectContextual("declare", "Only declares and type imports are allowed inside declare module"), r = this.flowParseDeclare(r, !0);i.push(r);
						}this.expect(I.braceR), this.finishNode(s, "BlockStatement");var n = null,
						    o = !1,
						    h = "Found both `declare module.exports` and `declare export` in the same module. Modules can only have 1 since they are either an ES module or they are a CommonJS module";return i.forEach(function (t) {
							f(t) ? ("CommonJS" === n && e.unexpected(t.start, h), n = "ES") : "DeclareModuleExports" === t.type && (o && e.unexpected(t.start, "Duplicate `declare module.exports` statement"), "ES" === n && e.unexpected(t.start, h), n = "CommonJS", o = !0);
						}), t.kind = n || "CommonJS", this.finishNode(t, "DeclareModule");
					}, i.flowParseDeclareExportDeclaration = function (t, e) {
						if (this.expect(I._export), this.eat(I._default)) return this.match(I._function) || this.match(I._class) ? t.declaration = this.flowParseDeclare(this.startNode()) : (t.declaration = this.flowParseType(), this.semicolon()), t.default = !0, this.finishNode(t, "DeclareExportDeclaration");if (this.match(I._const) || this.match(I._let) || (this.isContextual("type") || this.isContextual("interface")) && !e) {
							var s = this.state.value,
							    i = pt[s];this.unexpected(this.state.start, '`declare export ' + s + '` is not supported. Use `' + i + '` instead');
						}if (this.match(I._var) || this.match(I._function) || this.match(I._class) || this.isContextual("opaque")) return t.declaration = this.flowParseDeclare(this.startNode()), t.default = !1, this.finishNode(t, "DeclareExportDeclaration");if (this.match(I.star) || this.match(I.braceL) || this.isContextual("interface") || this.isContextual("type") || this.isContextual("opaque")) return "ExportNamedDeclaration" === (t = this.parseExport(t)).type && (t.type = "ExportDeclaration", t.default = !1, delete t.exportKind), t.type = "Declare" + t.type, t;throw this.unexpected();
					}, i.flowParseDeclareModuleExports = function (t) {
						return this.expectContextual("module"), this.expect(I.dot), this.expectContextual("exports"), t.typeAnnotation = this.flowParseTypeAnnotation(), this.semicolon(), this.finishNode(t, "DeclareModuleExports");
					}, i.flowParseDeclareTypeAlias = function (t) {
						return this.next(), this.flowParseTypeAlias(t), this.finishNode(t, "DeclareTypeAlias");
					}, i.flowParseDeclareOpaqueType = function (t) {
						return this.next(), this.flowParseOpaqueType(t, !0), this.finishNode(t, "DeclareOpaqueType");
					}, i.flowParseDeclareInterface = function (t) {
						return this.next(), this.flowParseInterfaceish(t), this.finishNode(t, "DeclareInterface");
					}, i.flowParseInterfaceish = function (t, e) {
						if (t.id = this.flowParseRestrictedIdentifier(!e), this.isRelational("<") ? t.typeParameters = this.flowParseTypeParameterDeclaration() : t.typeParameters = null, t.extends = [], t.mixins = [], this.eat(I._extends)) do {
							t.extends.push(this.flowParseInterfaceExtends());
						} while (!e && this.eat(I.comma));if (this.isContextual("mixins")) {
							this.next();do {
								t.mixins.push(this.flowParseInterfaceExtends());
							} while (this.eat(I.comma));
						}t.body = this.flowParseObjectType(!0, !1, !1);
					}, i.flowParseInterfaceExtends = function () {
						var t = this.startNode();return t.id = this.flowParseQualifiedTypeIdentifier(), this.isRelational("<") ? t.typeParameters = this.flowParseTypeParameterInstantiation() : t.typeParameters = null, this.finishNode(t, "InterfaceExtends");
					}, i.flowParseInterface = function (t) {
						return this.flowParseInterfaceish(t), this.finishNode(t, "InterfaceDeclaration");
					}, i.checkReservedType = function (t, e) {
						ht.indexOf(t) > -1 && this.raise(e, 'Cannot overwrite primitive type ' + t);
					}, i.flowParseRestrictedIdentifier = function (t) {
						return this.checkReservedType(this.state.value, this.state.start), this.parseIdentifier(t);
					}, i.flowParseTypeAlias = function (t) {
						return t.id = this.flowParseRestrictedIdentifier(), this.isRelational("<") ? t.typeParameters = this.flowParseTypeParameterDeclaration() : t.typeParameters = null, t.right = this.flowParseTypeInitialiser(I.eq), this.semicolon(), this.finishNode(t, "TypeAlias");
					}, i.flowParseOpaqueType = function (t, e) {
						return this.expectContextual("type"), t.id = this.flowParseRestrictedIdentifier(!0), this.isRelational("<") ? t.typeParameters = this.flowParseTypeParameterDeclaration() : t.typeParameters = null, t.supertype = null, this.match(I.colon) && (t.supertype = this.flowParseTypeInitialiser(I.colon)), t.impltype = null, e || (t.impltype = this.flowParseTypeInitialiser(I.eq)), this.semicolon(), this.finishNode(t, "OpaqueType");
					}, i.flowParseTypeParameter = function () {
						var t = this.startNode(),
						    e = this.flowParseVariance(),
						    s = this.flowParseTypeAnnotatableIdentifier();return t.name = s.name, t.variance = e, t.bound = s.typeAnnotation, this.match(I.eq) && (this.eat(I.eq), t.default = this.flowParseType()), this.finishNode(t, "TypeParameter");
					}, i.flowParseTypeParameterDeclaration = function () {
						var t = this.state.inType,
						    e = this.startNode();e.params = [], this.state.inType = !0, this.isRelational("<") || this.match(I.jsxTagStart) ? this.next() : this.unexpected();do {
							e.params.push(this.flowParseTypeParameter()), this.isRelational(">") || this.expect(I.comma);
						} while (!this.isRelational(">"));return this.expectRelational(">"), this.state.inType = t, this.finishNode(e, "TypeParameterDeclaration");
					}, i.flowParseTypeParameterInstantiation = function () {
						var t = this.startNode(),
						    e = this.state.inType;for (t.params = [], this.state.inType = !0, this.expectRelational("<"); !this.isRelational(">");) {
							t.params.push(this.flowParseType()), this.isRelational(">") || this.expect(I.comma);
						}return this.expectRelational(">"), this.state.inType = e, this.finishNode(t, "TypeParameterInstantiation");
					}, i.flowParseObjectPropertyKey = function () {
						return this.match(I.num) || this.match(I.string) ? this.parseExprAtom() : this.parseIdentifier(!0);
					}, i.flowParseObjectTypeIndexer = function (t, e, s) {
						return t.static = e, this.expect(I.bracketL), this.lookahead().type === I.colon ? (t.id = this.flowParseObjectPropertyKey(), t.key = this.flowParseTypeInitialiser()) : (t.id = null, t.key = this.flowParseType()), this.expect(I.bracketR), t.value = this.flowParseTypeInitialiser(), t.variance = s, this.finishNode(t, "ObjectTypeIndexer");
					}, i.flowParseObjectTypeMethodish = function (t) {
						for (t.params = [], t.rest = null, t.typeParameters = null, this.isRelational("<") && (t.typeParameters = this.flowParseTypeParameterDeclaration()), this.expect(I.parenL); !this.match(I.parenR) && !this.match(I.ellipsis);) {
							t.params.push(this.flowParseFunctionTypeParam()), this.match(I.parenR) || this.expect(I.comma);
						}return this.eat(I.ellipsis) && (t.rest = this.flowParseFunctionTypeParam()), this.expect(I.parenR), t.returnType = this.flowParseTypeInitialiser(), this.finishNode(t, "FunctionTypeAnnotation");
					}, i.flowParseObjectTypeCallProperty = function (t, e) {
						var s = this.startNode();return t.static = e, t.value = this.flowParseObjectTypeMethodish(s), this.finishNode(t, "ObjectTypeCallProperty");
					}, i.flowParseObjectType = function (t, e, s) {
						var i = this.state.inType;this.state.inType = !0;var r = this.startNode();r.callProperties = [], r.properties = [], r.indexers = [];var a, n;for (e && this.match(I.braceBarL) ? (this.expect(I.braceBarL), a = I.braceBarR, n = !0) : (this.expect(I.braceL), a = I.braceR, n = !1), r.exact = n; !this.match(a);) {
							var o = !1,
							    h = this.startNode();t && this.isContextual("static") && this.lookahead().type !== I.colon && (this.next(), o = !0);var p = this.flowParseVariance();if (this.match(I.bracketL)) r.indexers.push(this.flowParseObjectTypeIndexer(h, o, p));else if (this.match(I.parenL) || this.isRelational("<")) p && this.unexpected(p.start), r.callProperties.push(this.flowParseObjectTypeCallProperty(h, o));else {
								var c = "init";if (this.isContextual("get") || this.isContextual("set")) {
									var l = this.lookahead();l.type !== I.name && l.type !== I.string && l.type !== I.num || (c = this.state.value, this.next());
								}r.properties.push(this.flowParseObjectTypeProperty(h, o, p, c, s));
							}this.flowObjectTypeSemicolon();
						}this.expect(a);var u = this.finishNode(r, "ObjectTypeAnnotation");return this.state.inType = i, u;
					}, i.flowParseObjectTypeProperty = function (t, e, s, i, r) {
						if (this.match(I.ellipsis)) return r || this.unexpected(null, "Spread operator cannot appear in class or interface definitions"), s && this.unexpected(s.start, "Spread properties cannot have variance"), this.expect(I.ellipsis), t.argument = this.flowParseType(), this.finishNode(t, "ObjectTypeSpreadProperty");t.key = this.flowParseObjectPropertyKey(), t.static = e, t.kind = i;var a = !1;return this.isRelational("<") || this.match(I.parenL) ? (s && this.unexpected(s.start), t.value = this.flowParseObjectTypeMethodish(this.startNodeAt(t.start, t.loc.start)), "get" !== i && "set" !== i || this.flowCheckGetterSetterParamCount(t)) : ("init" !== i && this.unexpected(), this.eat(I.question) && (a = !0), t.value = this.flowParseTypeInitialiser(), t.variance = s), t.optional = a, this.finishNode(t, "ObjectTypeProperty");
					}, i.flowCheckGetterSetterParamCount = function (t) {
						var e = "get" === t.kind ? 0 : 1;if (t.value.params.length !== e) {
							var s = t.start;"get" === t.kind ? this.raise(s, "getter should have no params") : this.raise(s, "setter should have exactly one param");
						}
					}, i.flowObjectTypeSemicolon = function () {
						this.eat(I.semi) || this.eat(I.comma) || this.match(I.braceR) || this.match(I.braceBarR) || this.unexpected();
					}, i.flowParseQualifiedTypeIdentifier = function (t, e, s) {
						t = t || this.state.start, e = e || this.state.startLoc;for (var i = s || this.parseIdentifier(); this.eat(I.dot);) {
							var r = this.startNodeAt(t, e);r.qualification = i, r.id = this.parseIdentifier(), i = this.finishNode(r, "QualifiedTypeIdentifier");
						}return i;
					}, i.flowParseGenericType = function (t, e, s) {
						var i = this.startNodeAt(t, e);return i.typeParameters = null, i.id = this.flowParseQualifiedTypeIdentifier(t, e, s), this.isRelational("<") && (i.typeParameters = this.flowParseTypeParameterInstantiation()), this.finishNode(i, "GenericTypeAnnotation");
					}, i.flowParseTypeofType = function () {
						var t = this.startNode();return this.expect(I._typeof), t.argument = this.flowParsePrimaryType(), this.finishNode(t, "TypeofTypeAnnotation");
					}, i.flowParseTupleType = function () {
						var t = this.startNode();for (t.types = [], this.expect(I.bracketL); this.state.pos < this.input.length && !this.match(I.bracketR) && (t.types.push(this.flowParseType()), !this.match(I.bracketR));) {
							this.expect(I.comma);
						}return this.expect(I.bracketR), this.finishNode(t, "TupleTypeAnnotation");
					}, i.flowParseFunctionTypeParam = function () {
						var t = null,
						    e = !1,
						    s = null,
						    i = this.startNode(),
						    r = this.lookahead();return r.type === I.colon || r.type === I.question ? (t = this.parseIdentifier(), this.eat(I.question) && (e = !0), s = this.flowParseTypeInitialiser()) : s = this.flowParseType(), i.name = t, i.optional = e, i.typeAnnotation = s, this.finishNode(i, "FunctionTypeParam");
					}, i.reinterpretTypeAsFunctionTypeParam = function (t) {
						var e = this.startNodeAt(t.start, t.loc.start);return e.name = null, e.optional = !1, e.typeAnnotation = t, this.finishNode(e, "FunctionTypeParam");
					}, i.flowParseFunctionTypeParams = function (t) {
						void 0 === t && (t = []);for (var e = null; !this.match(I.parenR) && !this.match(I.ellipsis);) {
							t.push(this.flowParseFunctionTypeParam()), this.match(I.parenR) || this.expect(I.comma);
						}return this.eat(I.ellipsis) && (e = this.flowParseFunctionTypeParam()), { params: t, rest: e };
					}, i.flowIdentToTypeAnnotation = function (t, e, s, i) {
						switch (i.name) {case "any":
								return this.finishNode(s, "AnyTypeAnnotation");case "void":
								return this.finishNode(s, "VoidTypeAnnotation");case "bool":case "boolean":
								return this.finishNode(s, "BooleanTypeAnnotation");case "mixed":
								return this.finishNode(s, "MixedTypeAnnotation");case "empty":
								return this.finishNode(s, "EmptyTypeAnnotation");case "number":
								return this.finishNode(s, "NumberTypeAnnotation");case "string":
								return this.finishNode(s, "StringTypeAnnotation");default:
								return this.flowParseGenericType(t, e, i);}
					}, i.flowParsePrimaryType = function () {
						var t,
						    e,
						    s = this.state.start,
						    i = this.state.startLoc,
						    r = this.startNode(),
						    a = !1,
						    n = this.state.noAnonFunctionType;switch (this.state.type) {case I.name:
								return this.flowIdentToTypeAnnotation(s, i, r, this.parseIdentifier());case I.braceL:
								return this.flowParseObjectType(!1, !1, !0);case I.braceBarL:
								return this.flowParseObjectType(!1, !0, !0);case I.bracketL:
								return this.flowParseTupleType();case I.relational:
								if ("<" === this.state.value) return r.typeParameters = this.flowParseTypeParameterDeclaration(), this.expect(I.parenL), t = this.flowParseFunctionTypeParams(), r.params = t.params, r.rest = t.rest, this.expect(I.parenR), this.expect(I.arrow), r.returnType = this.flowParseType(), this.finishNode(r, "FunctionTypeAnnotation");break;case I.parenL:
								if (this.next(), !this.match(I.parenR) && !this.match(I.ellipsis)) if (this.match(I.name)) {
									var o = this.lookahead().type;a = o !== I.question && o !== I.colon;
								} else a = !0;if (a) {
									if (this.state.noAnonFunctionType = !1, e = this.flowParseType(), this.state.noAnonFunctionType = n, this.state.noAnonFunctionType || !(this.match(I.comma) || this.match(I.parenR) && this.lookahead().type === I.arrow)) return this.expect(I.parenR), e;this.eat(I.comma);
								}return t = e ? this.flowParseFunctionTypeParams([this.reinterpretTypeAsFunctionTypeParam(e)]) : this.flowParseFunctionTypeParams(), r.params = t.params, r.rest = t.rest, this.expect(I.parenR), this.expect(I.arrow), r.returnType = this.flowParseType(), r.typeParameters = null, this.finishNode(r, "FunctionTypeAnnotation");case I.string:
								return this.parseLiteral(this.state.value, "StringLiteralTypeAnnotation");case I._true:case I._false:
								return r.value = this.match(I._true), this.next(), this.finishNode(r, "BooleanLiteralTypeAnnotation");case I.plusMin:
								if ("-" === this.state.value) return this.next(), this.match(I.num) || this.unexpected(null, 'Unexpected token, expected "number"'), this.parseLiteral(-this.state.value, "NumberLiteralTypeAnnotation", r.start, r.loc.start);this.unexpected();case I.num:
								return this.parseLiteral(this.state.value, "NumberLiteralTypeAnnotation");case I._null:
								return this.next(), this.finishNode(r, "NullLiteralTypeAnnotation");case I._this:
								return this.next(), this.finishNode(r, "ThisTypeAnnotation");case I.star:
								return this.next(), this.finishNode(r, "ExistsTypeAnnotation");default:
								if ("typeof" === this.state.type.keyword) return this.flowParseTypeofType();}throw this.unexpected();
					}, i.flowParsePostfixType = function () {
						for (var t = this.state.start, e = this.state.startLoc, s = this.flowParsePrimaryType(); !this.canInsertSemicolon() && this.match(I.bracketL);) {
							var i = this.startNodeAt(t, e);i.elementType = s, this.expect(I.bracketL), this.expect(I.bracketR), s = this.finishNode(i, "ArrayTypeAnnotation");
						}return s;
					}, i.flowParsePrefixType = function () {
						var t = this.startNode();return this.eat(I.question) ? (t.typeAnnotation = this.flowParsePrefixType(), this.finishNode(t, "NullableTypeAnnotation")) : this.flowParsePostfixType();
					}, i.flowParseAnonFunctionWithoutParens = function () {
						var t = this.flowParsePrefixType();if (!this.state.noAnonFunctionType && this.eat(I.arrow)) {
							var e = this.startNodeAt(t.start, t.loc.start);return e.params = [this.reinterpretTypeAsFunctionTypeParam(t)], e.rest = null, e.returnType = this.flowParseType(), e.typeParameters = null, this.finishNode(e, "FunctionTypeAnnotation");
						}return t;
					}, i.flowParseIntersectionType = function () {
						var t = this.startNode();this.eat(I.bitwiseAND);var e = this.flowParseAnonFunctionWithoutParens();for (t.types = [e]; this.eat(I.bitwiseAND);) {
							t.types.push(this.flowParseAnonFunctionWithoutParens());
						}return 1 === t.types.length ? e : this.finishNode(t, "IntersectionTypeAnnotation");
					}, i.flowParseUnionType = function () {
						var t = this.startNode();this.eat(I.bitwiseOR);var e = this.flowParseIntersectionType();for (t.types = [e]; this.eat(I.bitwiseOR);) {
							t.types.push(this.flowParseIntersectionType());
						}return 1 === t.types.length ? e : this.finishNode(t, "UnionTypeAnnotation");
					}, i.flowParseType = function () {
						var t = this.state.inType;this.state.inType = !0;var e = this.flowParseUnionType();return this.state.inType = t, this.state.exprAllowed = this.state.exprAllowed || this.state.noAnonFunctionType, e;
					}, i.flowParseTypeAnnotation = function () {
						var t = this.startNode();return t.typeAnnotation = this.flowParseTypeInitialiser(), this.finishNode(t, "TypeAnnotation");
					}, i.flowParseTypeAnnotatableIdentifier = function (t) {
						var e = t ? this.parseIdentifier() : this.flowParseRestrictedIdentifier();return this.match(I.colon) && (e.typeAnnotation = this.flowParseTypeAnnotation(), this.finishNode(e, e.type)), e;
					}, i.typeCastToParameter = function (t) {
						return t.expression.typeAnnotation = t.typeAnnotation, this.finishNodeAt(t.expression, t.expression.type, t.typeAnnotation.end, t.typeAnnotation.loc.end);
					}, i.flowParseVariance = function () {
						var t = null;return this.match(I.plusMin) && (t = this.startNode(), "+" === this.state.value ? t.kind = "plus" : t.kind = "minus", this.next(), this.finishNode(t, "Variance")), t;
					}, i.parseFunctionBody = function (e, s) {
						var i = this;return s ? this.forwardNoArrowParamsConversionAt(e, function () {
							return t.prototype.parseFunctionBody.call(i, e, !0);
						}) : t.prototype.parseFunctionBody.call(this, e, !1);
					}, i.parseFunctionBodyAndFinish = function (e, s, i) {
						if (!i && this.match(I.colon)) {
							var r = this.startNode(),
							    a = this.flowParseTypeAndPredicateInitialiser();r.typeAnnotation = a[0], e.predicate = a[1], e.returnType = r.typeAnnotation ? this.finishNode(r, "TypeAnnotation") : null;
						}t.prototype.parseFunctionBodyAndFinish.call(this, e, s, i);
					}, i.parseStatement = function (e, s) {
						if (this.state.strict && this.match(I.name) && "interface" === this.state.value) {
							var i = this.startNode();return this.next(), this.flowParseInterface(i);
						}return t.prototype.parseStatement.call(this, e, s);
					}, i.parseExpressionStatement = function (e, s) {
						if ("Identifier" === s.type) if ("declare" === s.name) {
							if (this.match(I._class) || this.match(I.name) || this.match(I._function) || this.match(I._var) || this.match(I._export)) return this.flowParseDeclare(e);
						} else if (this.match(I.name)) {
							if ("interface" === s.name) return this.flowParseInterface(e);if ("type" === s.name) return this.flowParseTypeAlias(e);if ("opaque" === s.name) return this.flowParseOpaqueType(e, !1);
						}return t.prototype.parseExpressionStatement.call(this, e, s);
					}, i.shouldParseExportDeclaration = function () {
						return this.isContextual("type") || this.isContextual("interface") || this.isContextual("opaque") || t.prototype.shouldParseExportDeclaration.call(this);
					}, i.isExportDefaultSpecifier = function () {
						return (!this.match(I.name) || "type" !== this.state.value && "interface" !== this.state.value && "opaque" != this.state.value) && t.prototype.isExportDefaultSpecifier.call(this);
					}, i.parseConditional = function (e, s, i, r, a) {
						var n = this;if (!this.match(I.question)) return e;if (a) {
							var o = this.state.clone();try {
								return t.prototype.parseConditional.call(this, e, s, i, r);
							} catch (t) {
								if (t instanceof SyntaxError) return this.state = o, a.start = t.pos || this.state.start, e;throw t;
							}
						}this.expect(I.question);var h = this.state.clone(),
						    p = this.state.noArrowAt,
						    c = this.startNodeAt(i, r),
						    l = this.tryParseConditionalConsequent(),
						    u = l.consequent,
						    d = l.failed,
						    f = this.getArrowLikeExpressions(u),
						    m = f[0],
						    y = f[1];if (d || y.length > 0) {
							var x = p.concat();if (y.length > 0) {
								this.state = h, this.state.noArrowAt = x;for (var P = 0; P < y.length; P++) {
									x.push(y[P].start);
								}var v = this.tryParseConditionalConsequent();u = v.consequent, d = v.failed;var g = this.getArrowLikeExpressions(u);m = g[0], y = g[1];
							}if (d && m.length > 1 && this.raise(h.start, "Ambiguous expression: wrap the arrow functions in parentheses to disambiguate."), d && 1 === m.length) {
								this.state = h, this.state.noArrowAt = x.concat(m[0].start);var b = this.tryParseConditionalConsequent();u = b.consequent, d = b.failed;
							}this.getArrowLikeExpressions(u, !0);
						}return this.state.noArrowAt = p, this.expect(I.colon), c.test = e, c.consequent = u, c.alternate = this.forwardNoArrowParamsConversionAt(c, function () {
							return n.parseMaybeAssign(s, void 0, void 0, void 0);
						}), this.finishNode(c, "ConditionalExpression");
					}, i.tryParseConditionalConsequent = function () {
						this.state.noArrowParamsConversionAt.push(this.state.start);var t = this.parseMaybeAssign(),
						    e = !this.match(I.colon);return this.state.noArrowParamsConversionAt.pop(), { consequent: t, failed: e };
					}, i.getArrowLikeExpressions = function (e, s) {
						for (var i = this, r = [e], a = []; 0 !== r.length;) {
							var n = r.pop();"ArrowFunctionExpression" === n.type ? (n.typeParameters || !n.returnType ? (this.toAssignableList(n.params, !0, "arrow function parameters"), t.prototype.checkFunctionNameAndParams.call(this, n, !0)) : a.push(n), r.push(n.body)) : "ConditionalExpression" === n.type && (r.push(n.consequent), r.push(n.alternate));
						}if (s) {
							for (var o = 0; o < a.length; o++) {
								this.toAssignableList(e.params, !0, "arrow function parameters");
							}return [a, []];
						}return x(a, function (t) {
							try {
								return i.toAssignableList(t.params, !0, "arrow function parameters"), !0;
							} catch (t) {
								return !1;
							}
						});
					}, i.forwardNoArrowParamsConversionAt = function (t, e) {
						var s;return -1 !== this.state.noArrowParamsConversionAt.indexOf(t.start) ? (this.state.noArrowParamsConversionAt.push(this.state.start), s = e(), this.state.noArrowParamsConversionAt.pop()) : s = e(), s;
					}, i.parseParenItem = function (e, s, i) {
						if (e = t.prototype.parseParenItem.call(this, e, s, i), this.eat(I.question) && (e.optional = !0), this.match(I.colon)) {
							var r = this.startNodeAt(s, i);return r.expression = e, r.typeAnnotation = this.flowParseTypeAnnotation(), this.finishNode(r, "TypeCastExpression");
						}return e;
					}, i.assertModuleNodeAllowed = function (e) {
						"ImportDeclaration" === e.type && ("type" === e.importKind || "typeof" === e.importKind) || "ExportNamedDeclaration" === e.type && "type" === e.exportKind || "ExportAllDeclaration" === e.type && "type" === e.exportKind || t.prototype.assertModuleNodeAllowed.call(this, e);
					}, i.parseExport = function (e) {
						return "ExportNamedDeclaration" !== (e = t.prototype.parseExport.call(this, e)).type && "ExportAllDeclaration" !== e.type || (e.exportKind = e.exportKind || "value"), e;
					}, i.parseExportDeclaration = function (e) {
						if (this.isContextual("type")) {
							e.exportKind = "type";var s = this.startNode();return this.next(), this.match(I.braceL) ? (e.specifiers = this.parseExportSpecifiers(), this.parseExportFrom(e), null) : this.flowParseTypeAlias(s);
						}if (this.isContextual("opaque")) {
							e.exportKind = "type";var i = this.startNode();return this.next(), this.flowParseOpaqueType(i, !1);
						}if (this.isContextual("interface")) {
							e.exportKind = "type";var r = this.startNode();return this.next(), this.flowParseInterface(r);
						}return t.prototype.parseExportDeclaration.call(this, e);
					}, i.shouldParseExportStar = function () {
						return t.prototype.shouldParseExportStar.call(this) || this.isContextual("type") && this.lookahead().type === I.star;
					}, i.parseExportStar = function (e) {
						return this.eatContextual("type") && (e.exportKind = "type"), t.prototype.parseExportStar.call(this, e);
					}, i.parseExportNamespace = function (e) {
						return "type" === e.exportKind && this.unexpected(), t.prototype.parseExportNamespace.call(this, e);
					}, i.parseClassId = function (e, s, i) {
						t.prototype.parseClassId.call(this, e, s, i), this.isRelational("<") && (e.typeParameters = this.flowParseTypeParameterDeclaration());
					}, i.isKeyword = function (e) {
						return (!this.state.inType || "void" !== e) && t.prototype.isKeyword.call(this, e);
					}, i.readToken = function (e) {
						return !this.state.inType || 62 !== e && 60 !== e ? t.prototype.readToken.call(this, e) : this.finishOp(I.relational, 1);
					}, i.toAssignable = function (e, s, i) {
						return "TypeCastExpression" === e.type ? t.prototype.toAssignable.call(this, this.typeCastToParameter(e), s, i) : t.prototype.toAssignable.call(this, e, s, i);
					}, i.toAssignableList = function (e, s, i) {
						for (var r = 0; r < e.length; r++) {
							var a = e[r];a && "TypeCastExpression" === a.type && (e[r] = this.typeCastToParameter(a));
						}return t.prototype.toAssignableList.call(this, e, s, i);
					}, i.toReferencedList = function (t) {
						for (var e = 0; e < t.length; e++) {
							var s = t[e];s && s._exprListItem && "TypeCastExpression" === s.type && this.raise(s.start, "Unexpected type cast");
						}return t;
					}, i.parseExprListItem = function (e, s, i) {
						var r = this.startNode(),
						    a = t.prototype.parseExprListItem.call(this, e, s, i);return this.match(I.colon) ? (r._exprListItem = !0, r.expression = a, r.typeAnnotation = this.flowParseTypeAnnotation(), this.finishNode(r, "TypeCastExpression")) : a;
					}, i.checkLVal = function (e, s, i, r) {
						if ("TypeCastExpression" !== e.type) return t.prototype.checkLVal.call(this, e, s, i, r);
					}, i.parseClassProperty = function (e) {
						return this.match(I.colon) && (e.typeAnnotation = this.flowParseTypeAnnotation()), t.prototype.parseClassProperty.call(this, e);
					}, i.isClassMethod = function () {
						return this.isRelational("<") || t.prototype.isClassMethod.call(this);
					}, i.isClassProperty = function () {
						return this.match(I.colon) || t.prototype.isClassProperty.call(this);
					}, i.isNonstaticConstructor = function (e) {
						return !this.match(I.colon) && t.prototype.isNonstaticConstructor.call(this, e);
					}, i.pushClassMethod = function (e, s, i, r, a) {
						s.variance && this.unexpected(s.variance.start), delete s.variance, this.isRelational("<") && (s.typeParameters = this.flowParseTypeParameterDeclaration()), t.prototype.pushClassMethod.call(this, e, s, i, r, a);
					}, i.pushClassPrivateMethod = function (e, s, i, r) {
						s.variance && this.unexpected(s.variance.start), delete s.variance, this.isRelational("<") && (s.typeParameters = this.flowParseTypeParameterDeclaration()), t.prototype.pushClassPrivateMethod.call(this, e, s, i, r);
					}, i.parseClassSuper = function (e) {
						if (t.prototype.parseClassSuper.call(this, e), e.superClass && this.isRelational("<") && (e.superTypeParameters = this.flowParseTypeParameterInstantiation()), this.isContextual("implements")) {
							this.next();var s = e.implements = [];do {
								var i = this.startNode();i.id = this.flowParseRestrictedIdentifier(!0), this.isRelational("<") ? i.typeParameters = this.flowParseTypeParameterInstantiation() : i.typeParameters = null, s.push(this.finishNode(i, "ClassImplements"));
							} while (this.eat(I.comma));
						}
					}, i.parsePropertyName = function (e) {
						var s = this.flowParseVariance(),
						    i = t.prototype.parsePropertyName.call(this, e);return e.variance = s, i;
					}, i.parseObjPropValue = function (e, s, i, r, a, n, o) {
						e.variance && this.unexpected(e.variance.start), delete e.variance;var h;this.isRelational("<") && (h = this.flowParseTypeParameterDeclaration(), this.match(I.parenL) || this.unexpected()), t.prototype.parseObjPropValue.call(this, e, s, i, r, a, n, o), h && ((e.value || e).typeParameters = h);
					}, i.parseAssignableListItemTypes = function (t) {
						if (this.eat(I.question)) {
							if ("Identifier" !== t.type) throw this.raise(t.start, "A binding pattern parameter cannot be optional in an implementation signature.");t.optional = !0;
						}return this.match(I.colon) && (t.typeAnnotation = this.flowParseTypeAnnotation()), this.finishNode(t, t.type), t;
					}, i.parseMaybeDefault = function (e, s, i) {
						var r = t.prototype.parseMaybeDefault.call(this, e, s, i);return "AssignmentPattern" === r.type && r.typeAnnotation && r.right.start < r.typeAnnotation.start && this.raise(r.typeAnnotation.start, "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`"), r;
					}, i.shouldParseDefaultImport = function (e) {
						return m(e) ? y(this.state) : t.prototype.shouldParseDefaultImport.call(this, e);
					}, i.parseImportSpecifierLocal = function (t, e, s, i) {
						e.local = m(t) ? this.flowParseRestrictedIdentifier(!0) : this.parseIdentifier(), this.checkLVal(e.local, !0, void 0, i), t.specifiers.push(this.finishNode(e, s));
					}, i.parseImportSpecifiers = function (e) {
						e.importKind = "value";var s = null;if (this.match(I._typeof) ? s = "typeof" : this.isContextual("type") && (s = "type"), s) {
							var i = this.lookahead();(y(i) || i.type === I.braceL || i.type === I.star) && (this.next(), e.importKind = s);
						}t.prototype.parseImportSpecifiers.call(this, e);
					}, i.parseImportSpecifier = function (t) {
						var e = this.startNode(),
						    s = this.state.start,
						    i = this.parseIdentifier(!0),
						    r = null;"type" === i.name ? r = "type" : "typeof" === i.name && (r = "typeof");var a = !1;if (this.isContextual("as") && !this.isLookaheadContextual("as")) {
							var n = this.parseIdentifier(!0);null === r || this.match(I.name) || this.state.type.keyword ? (e.imported = i, e.importKind = null, e.local = this.parseIdentifier()) : (e.imported = n, e.importKind = r, e.local = n.__clone());
						} else null !== r && (this.match(I.name) || this.state.type.keyword) ? (e.imported = this.parseIdentifier(!0), e.importKind = r, this.eatContextual("as") ? e.local = this.parseIdentifier() : (a = !0, e.local = e.imported.__clone())) : (a = !0, e.imported = i, e.importKind = null, e.local = e.imported.__clone());var o = m(t),
						    h = m(e);o && h && this.raise(s, "The `type` and `typeof` keywords on named imports can only be used on regular `import` statements. It cannot be used with `import type` or `import typeof` statements"), (o || h) && this.checkReservedType(e.local.name, e.local.start), !a || o || h || this.checkReservedWord(e.local.name, e.start, !0, !0), this.checkLVal(e.local, !0, void 0, "import specifier"), t.specifiers.push(this.finishNode(e, "ImportSpecifier"));
					}, i.parseFunctionParams = function (e) {
						var s = e.kind;"get" !== s && "set" !== s && this.isRelational("<") && (e.typeParameters = this.flowParseTypeParameterDeclaration()), t.prototype.parseFunctionParams.call(this, e);
					}, i.parseVarHead = function (e) {
						t.prototype.parseVarHead.call(this, e), this.match(I.colon) && (e.id.typeAnnotation = this.flowParseTypeAnnotation(), this.finishNode(e.id, e.id.type));
					}, i.parseAsyncArrowFromCallExpression = function (e, s) {
						if (this.match(I.colon)) {
							var i = this.state.noAnonFunctionType;this.state.noAnonFunctionType = !0, e.returnType = this.flowParseTypeAnnotation(), this.state.noAnonFunctionType = i;
						}return t.prototype.parseAsyncArrowFromCallExpression.call(this, e, s);
					}, i.shouldParseAsyncArrow = function () {
						return this.match(I.colon) || t.prototype.shouldParseAsyncArrow.call(this);
					}, i.parseMaybeAssign = function (e, s, i, r) {
						var a = this,
						    n = null;if (I.jsxTagStart && this.match(I.jsxTagStart)) {
							var o = this.state.clone();try {
								return t.prototype.parseMaybeAssign.call(this, e, s, i, r);
							} catch (t) {
								if (!(t instanceof SyntaxError)) throw t;this.state = o, this.state.context.length -= 2, n = t;
							}
						}if (null != n || this.isRelational("<")) {
							var h, p;try {
								p = this.flowParseTypeParameterDeclaration(), (h = this.forwardNoArrowParamsConversionAt(p, function () {
									return t.prototype.parseMaybeAssign.call(a, e, s, i, r);
								})).typeParameters = p, this.resetStartLocationFromNode(h, p);
							} catch (t) {
								throw n || t;
							}if ("ArrowFunctionExpression" === h.type) return h;if (null != n) throw n;this.raise(p.start, "Expected an arrow function after this type parameter declaration");
						}return t.prototype.parseMaybeAssign.call(this, e, s, i, r);
					}, i.parseArrow = function (e) {
						if (this.match(I.colon)) {
							var s = this.state.clone();try {
								var i = this.state.noAnonFunctionType;this.state.noAnonFunctionType = !0;var r = this.startNode(),
								    a = this.flowParseTypeAndPredicateInitialiser();r.typeAnnotation = a[0], e.predicate = a[1], this.state.noAnonFunctionType = i, this.canInsertSemicolon() && this.unexpected(), this.match(I.arrow) || this.unexpected(), e.returnType = r.typeAnnotation ? this.finishNode(r, "TypeAnnotation") : null;
							} catch (t) {
								if (!(t instanceof SyntaxError)) throw t;this.state = s;
							}
						}return t.prototype.parseArrow.call(this, e);
					}, i.shouldParseArrow = function () {
						return this.match(I.colon) || t.prototype.shouldParseArrow.call(this);
					}, i.setArrowFunctionParameters = function (e, s) {
						-1 !== this.state.noArrowParamsConversionAt.indexOf(e.start) ? e.params = s : t.prototype.setArrowFunctionParameters.call(this, e, s);
					}, i.checkFunctionNameAndParams = function (e, s) {
						if (!s || -1 === this.state.noArrowParamsConversionAt.indexOf(e.start)) return t.prototype.checkFunctionNameAndParams.call(this, e, s);
					}, i.parseParenAndDistinguishExpression = function (e) {
						return t.prototype.parseParenAndDistinguishExpression.call(this, e && -1 === this.state.noArrowAt.indexOf(this.state.start));
					}, i.parseSubscripts = function (e, s, i, r) {
						if ("Identifier" === e.type && "async" === e.name && -1 !== this.state.noArrowAt.indexOf(s)) {
							this.next();var a = this.startNodeAt(s, i);a.callee = e, a.arguments = this.parseCallExpressionArguments(I.parenR, !1), e = this.finishNode(a, "CallExpression");
						} else if ("Identifier" === e.type && "async" === e.name && this.isRelational("<")) {
							var n,
							    o = this.state.clone();try {
								var h = this.parseAsyncArrowWithTypeParameters(s, i);if (h) return h;
							} catch (t) {
								n = t;
							}this.state = o;try {
								return t.prototype.parseSubscripts.call(this, e, s, i, r);
							} catch (t) {
								throw n || t;
							}
						}return t.prototype.parseSubscripts.call(this, e, s, i, r);
					}, i.parseAsyncArrowWithTypeParameters = function (t, e) {
						var s = this.startNodeAt(t, e);if (this.parseFunctionParams(s), this.parseArrow(s)) return this.parseArrowExpression(s, void 0, !0);
					}, e;
				}(t);
			}, nt.jsx = function (t) {
				return function (t) {
					function e() {
						return t.apply(this, arguments) || this;
					}s(e, t);var i = e.prototype;return i.jsxReadToken = function () {
						for (var t = "", e = this.state.pos;;) {
							this.state.pos >= this.input.length && this.raise(this.state.start, "Unterminated JSX contents");var s = this.input.charCodeAt(this.state.pos);switch (s) {case 60:case 123:
									return this.state.pos === this.state.start ? 60 === s && this.state.exprAllowed ? (++this.state.pos, this.finishToken(I.jsxTagStart)) : this.getTokenFromCode(s) : (t += this.input.slice(e, this.state.pos), this.finishToken(I.jsxText, t));case 38:
									t += this.input.slice(e, this.state.pos), t += this.jsxReadEntity(), e = this.state.pos;break;default:
									h(s) ? (t += this.input.slice(e, this.state.pos), t += this.jsxReadNewLine(!0), e = this.state.pos) : ++this.state.pos;}
						}
					}, i.jsxReadNewLine = function (t) {
						var e,
						    s = this.input.charCodeAt(this.state.pos);return ++this.state.pos, 13 === s && 10 === this.input.charCodeAt(this.state.pos) ? (++this.state.pos, e = t ? "\n" : "\r\n") : e = String.fromCharCode(s), ++this.state.curLine, this.state.lineStart = this.state.pos, e;
					}, i.jsxReadString = function (t) {
						for (var e = "", s = ++this.state.pos;;) {
							this.state.pos >= this.input.length && this.raise(this.state.start, "Unterminated string constant");var i = this.input.charCodeAt(this.state.pos);if (i === t) break;38 === i ? (e += this.input.slice(s, this.state.pos), e += this.jsxReadEntity(), s = this.state.pos) : h(i) ? (e += this.input.slice(s, this.state.pos), e += this.jsxReadNewLine(!1), s = this.state.pos) : ++this.state.pos;
						}return e += this.input.slice(s, this.state.pos++), this.finishToken(I.string, e);
					}, i.jsxReadEntity = function () {
						for (var t, e = "", s = 0, i = this.input[this.state.pos], r = ++this.state.pos; this.state.pos < this.input.length && s++ < 10;) {
							if (";" === (i = this.input[this.state.pos++])) {
								"#" === e[0] ? "x" === e[1] ? (e = e.substr(2), lt.test(e) && (t = String.fromCodePoint(parseInt(e, 16)))) : (e = e.substr(1), ut.test(e) && (t = String.fromCodePoint(parseInt(e, 10)))) : t = ct[e];break;
							}e += i;
						}return t || (this.state.pos = r, "&");
					}, i.jsxReadWord = function () {
						var t,
						    e = this.state.pos;do {
							t = this.input.charCodeAt(++this.state.pos);
						} while (o(t) || 45 === t);return this.finishToken(I.jsxName, this.input.slice(e, this.state.pos));
					}, i.jsxParseIdentifier = function () {
						var t = this.startNode();return this.match(I.jsxName) ? t.name = this.state.value : this.state.type.keyword ? t.name = this.state.type.keyword : this.unexpected(), this.next(), this.finishNode(t, "JSXIdentifier");
					}, i.jsxParseNamespacedName = function () {
						var t = this.state.start,
						    e = this.state.startLoc,
						    s = this.jsxParseIdentifier();if (!this.eat(I.colon)) return s;var i = this.startNodeAt(t, e);return i.namespace = s, i.name = this.jsxParseIdentifier(), this.finishNode(i, "JSXNamespacedName");
					}, i.jsxParseElementName = function () {
						for (var t = this.state.start, e = this.state.startLoc, s = this.jsxParseNamespacedName(); this.eat(I.dot);) {
							var i = this.startNodeAt(t, e);i.object = s, i.property = this.jsxParseIdentifier(), s = this.finishNode(i, "JSXMemberExpression");
						}return s;
					}, i.jsxParseAttributeValue = function () {
						var t;switch (this.state.type) {case I.braceL:
								if ("JSXEmptyExpression" === (t = this.jsxParseExpressionContainer()).expression.type) throw this.raise(t.start, "JSX attributes must only be assigned a non-empty expression");return t;case I.jsxTagStart:case I.string:
								return this.parseExprAtom();default:
								throw this.raise(this.state.start, "JSX value should be either an expression or a quoted JSX text");}
					}, i.jsxParseEmptyExpression = function () {
						var t = this.startNodeAt(this.state.lastTokEnd, this.state.lastTokEndLoc);return this.finishNodeAt(t, "JSXEmptyExpression", this.state.start, this.state.startLoc);
					}, i.jsxParseSpreadChild = function () {
						var t = this.startNode();return this.expect(I.braceL), this.expect(I.ellipsis), t.expression = this.parseExpression(), this.expect(I.braceR), this.finishNode(t, "JSXSpreadChild");
					}, i.jsxParseExpressionContainer = function () {
						var t = this.startNode();return this.next(), this.match(I.braceR) ? t.expression = this.jsxParseEmptyExpression() : t.expression = this.parseExpression(), this.expect(I.braceR), this.finishNode(t, "JSXExpressionContainer");
					}, i.jsxParseAttribute = function () {
						var t = this.startNode();return this.eat(I.braceL) ? (this.expect(I.ellipsis), t.argument = this.parseMaybeAssign(), this.expect(I.braceR), this.finishNode(t, "JSXSpreadAttribute")) : (t.name = this.jsxParseNamespacedName(), t.value = this.eat(I.eq) ? this.jsxParseAttributeValue() : null, this.finishNode(t, "JSXAttribute"));
					}, i.jsxParseOpeningElementAt = function (t, e) {
						var s = this.startNodeAt(t, e);if (this.match(I.jsxTagEnd)) return this.expect(I.jsxTagEnd), this.finishNode(s, "JSXOpeningFragment");for (s.attributes = [], s.name = this.jsxParseElementName(); !this.match(I.slash) && !this.match(I.jsxTagEnd);) {
							s.attributes.push(this.jsxParseAttribute());
						}return s.selfClosing = this.eat(I.slash), this.expect(I.jsxTagEnd), this.finishNode(s, "JSXOpeningElement");
					}, i.jsxParseClosingElementAt = function (t, e) {
						var s = this.startNodeAt(t, e);return this.match(I.jsxTagEnd) ? (this.expect(I.jsxTagEnd), this.finishNode(s, "JSXClosingFragment")) : (s.name = this.jsxParseElementName(), this.expect(I.jsxTagEnd), this.finishNode(s, "JSXClosingElement"));
					}, i.jsxParseElementAt = function (t, e) {
						var s = this.startNodeAt(t, e),
						    i = [],
						    r = this.jsxParseOpeningElementAt(t, e),
						    a = null;if (!r.selfClosing) {
							t: for (;;) {
								switch (this.state.type) {case I.jsxTagStart:
										if (t = this.state.start, e = this.state.startLoc, this.next(), this.eat(I.slash)) {
											a = this.jsxParseClosingElementAt(t, e);break t;
										}i.push(this.jsxParseElementAt(t, e));break;case I.jsxText:
										i.push(this.parseExprAtom());break;case I.braceL:
										this.lookahead().type === I.ellipsis ? i.push(this.jsxParseSpreadChild()) : i.push(this.jsxParseExpressionContainer());break;default:
										throw this.unexpected();}
							}P(r) && !P(a) ? this.raise(a.start, "Expected corresponding JSX closing tag for <>") : !P(r) && P(a) ? this.raise(a.start, "Expected corresponding JSX closing tag for <" + v(r.name) + ">") : P(r) || P(a) || v(a.name) !== v(r.name) && this.raise(a.start, "Expected corresponding JSX closing tag for <" + v(r.name) + ">");
						}return P(r) ? (s.openingFragment = r, s.closingFragment = a) : (s.openingElement = r, s.closingElement = a), s.children = i, this.match(I.relational) && "<" === this.state.value && this.raise(this.state.start, "Adjacent JSX elements must be wrapped in an enclosing tag"), P(r) ? this.finishNode(s, "JSXFragment") : this.finishNode(s, "JSXElement");
					}, i.jsxParseElement = function () {
						var t = this.state.start,
						    e = this.state.startLoc;return this.next(), this.jsxParseElementAt(t, e);
					}, i.parseExprAtom = function (e) {
						return this.match(I.jsxText) ? this.parseLiteral(this.state.value, "JSXText") : this.match(I.jsxTagStart) ? this.jsxParseElement() : t.prototype.parseExprAtom.call(this, e);
					}, i.readToken = function (e) {
						if (this.state.inPropertyName) return t.prototype.readToken.call(this, e);var s = this.curContext();if (s === G.j_expr) return this.jsxReadToken();if (s === G.j_oTag || s === G.j_cTag) {
							if (n(e)) return this.jsxReadWord();if (62 === e) return ++this.state.pos, this.finishToken(I.jsxTagEnd);if ((34 === e || 39 === e) && s === G.j_oTag) return this.jsxReadString(e);
						}return 60 === e && this.state.exprAllowed ? (++this.state.pos, this.finishToken(I.jsxTagStart)) : t.prototype.readToken.call(this, e);
					}, i.updateContext = function (e) {
						if (this.match(I.braceL)) {
							var s = this.curContext();s === G.j_oTag ? this.state.context.push(G.braceExpression) : s === G.j_expr ? this.state.context.push(G.templateQuasi) : t.prototype.updateContext.call(this, e), this.state.exprAllowed = !0;
						} else {
							if (!this.match(I.slash) || e !== I.jsxTagStart) return t.prototype.updateContext.call(this, e);this.state.context.length -= 2, this.state.context.push(G.j_cTag), this.state.exprAllowed = !1;
						}
					}, e;
				}(t);
			}, nt.typescript = function (t) {
				return function (t) {
					function e() {
						return t.apply(this, arguments) || this;
					}s(e, t);var i = e.prototype;return i.tsIsIdentifier = function () {
						return this.match(I.name);
					}, i.tsNextTokenCanFollowModifier = function () {
						return this.next(), !(this.hasPrecedingLineBreak() || this.match(I.parenL) || this.match(I.colon) || this.match(I.eq) || this.match(I.question));
					}, i.tsParseModifier = function (t) {
						if (this.match(I.name)) {
							var e = this.state.value;return -1 !== t.indexOf(e) && this.tsTryParse(this.tsNextTokenCanFollowModifier.bind(this)) ? e : void 0;
						}
					}, i.tsIsListTerminator = function (t) {
						switch (t) {case "EnumMembers":case "TypeMembers":
								return this.match(I.braceR);case "HeritageClauseElement":
								return this.match(I.braceL);case "TupleElementTypes":
								return this.match(I.bracketR);case "TypeParametersOrArguments":
								return this.isRelational(">");}throw new Error("Unreachable");
					}, i.tsParseList = function (t, e) {
						for (var s = []; !this.tsIsListTerminator(t);) {
							s.push(e());
						}return s;
					}, i.tsParseDelimitedList = function (t, e) {
						return g(this.tsParseDelimitedListWorker(t, e, !0));
					}, i.tsTryParseDelimitedList = function (t, e) {
						return this.tsParseDelimitedListWorker(t, e, !1);
					}, i.tsParseDelimitedListWorker = function (t, e, s) {
						for (var i = []; !this.tsIsListTerminator(t);) {
							var r = e();if (null == r) return;if (i.push(r), !this.eat(I.comma)) {
								if (this.tsIsListTerminator(t)) break;return void (s && this.expect(I.comma));
							}
						}return i;
					}, i.tsParseBracketedList = function (t, e, s, i) {
						i || (s ? this.expect(I.bracketL) : this.expectRelational("<"));var r = this.tsParseDelimitedList(t, e);return s ? this.expect(I.bracketR) : this.expectRelational(">"), r;
					}, i.tsParseEntityName = function (t) {
						for (var e = this.parseIdentifier(); this.eat(I.dot);) {
							var s = this.startNodeAtNode(e);s.left = e, s.right = this.parseIdentifier(t), e = this.finishNode(s, "TSQualifiedName");
						}return e;
					}, i.tsParseTypeReference = function () {
						var t = this.startNode();return t.typeName = this.tsParseEntityName(!1), !this.hasPrecedingLineBreak() && this.isRelational("<") && (t.typeParameters = this.tsParseTypeArguments()), this.finishNode(t, "TSTypeReference");
					}, i.tsParseThisTypePredicate = function (t) {
						this.next();var e = this.startNode();return e.parameterName = t, e.typeAnnotation = this.tsParseTypeAnnotation(!1), this.finishNode(e, "TSTypePredicate");
					}, i.tsParseThisTypeNode = function () {
						var t = this.startNode();return this.next(), this.finishNode(t, "TSThisType");
					}, i.tsParseTypeQuery = function () {
						var t = this.startNode();return this.expect(I._typeof), t.exprName = this.tsParseEntityName(!0), this.finishNode(t, "TSTypeQuery");
					}, i.tsParseTypeParameter = function () {
						var t = this.startNode();return t.name = this.parseIdentifierName(t.start), this.eat(I._extends) && (t.constraint = this.tsParseType()), this.eat(I.eq) && (t.default = this.tsParseType()), this.finishNode(t, "TSTypeParameter");
					}, i.tsTryParseTypeParameters = function () {
						if (this.isRelational("<")) return this.tsParseTypeParameters();
					}, i.tsParseTypeParameters = function () {
						var t = this.startNode();return this.isRelational("<") || this.match(I.jsxTagStart) ? this.next() : this.unexpected(), t.params = this.tsParseBracketedList("TypeParametersOrArguments", this.tsParseTypeParameter.bind(this), !1, !0), this.finishNode(t, "TSTypeParameterDeclaration");
					}, i.tsFillSignature = function (t, e) {
						var s = t === I.arrow;e.typeParameters = this.tsTryParseTypeParameters(), this.expect(I.parenL), e.parameters = this.tsParseBindingListForSignature(), s ? e.typeAnnotation = this.tsParseTypeOrTypePredicateAnnotation(t) : this.match(t) && (e.typeAnnotation = this.tsParseTypeOrTypePredicateAnnotation(t));
					}, i.tsParseBindingListForSignature = function () {
						var t = this;return this.parseBindingList(I.parenR).map(function (e) {
							if ("Identifier" !== e.type && "RestElement" !== e.type) throw t.unexpected(e.start, "Name in a signature must be an Identifier.");return e;
						});
					}, i.tsParseTypeMemberSemicolon = function () {
						this.eat(I.comma) || this.semicolon();
					}, i.tsParseSignatureMember = function (t) {
						var e = this.startNode();return "TSConstructSignatureDeclaration" === t && this.expect(I._new), this.tsFillSignature(I.colon, e), this.tsParseTypeMemberSemicolon(), this.finishNode(e, t);
					}, i.tsIsUnambiguouslyIndexSignature = function () {
						return this.next(), this.eat(I.name) && this.match(I.colon);
					}, i.tsTryParseIndexSignature = function (t) {
						if (this.match(I.bracketL) && this.tsLookAhead(this.tsIsUnambiguouslyIndexSignature.bind(this))) {
							this.expect(I.bracketL);var e = this.parseIdentifier();this.expect(I.colon), e.typeAnnotation = this.tsParseTypeAnnotation(!1), this.expect(I.bracketR), t.parameters = [e];var s = this.tsTryParseTypeAnnotation();return s && (t.typeAnnotation = s), this.tsParseTypeMemberSemicolon(), this.finishNode(t, "TSIndexSignature");
						}
					}, i.tsParsePropertyOrMethodSignature = function (t, e) {
						this.parsePropertyName(t), this.eat(I.question) && (t.optional = !0);var s = t;if (e || !this.match(I.parenL) && !this.isRelational("<")) {
							var i = s;e && (i.readonly = !0);var r = this.tsTryParseTypeAnnotation();return r && (i.typeAnnotation = r), this.tsParseTypeMemberSemicolon(), this.finishNode(i, "TSPropertySignature");
						}var a = s;return this.tsFillSignature(I.colon, a), this.tsParseTypeMemberSemicolon(), this.finishNode(a, "TSMethodSignature");
					}, i.tsParseTypeMember = function () {
						if (this.match(I.parenL) || this.isRelational("<")) return this.tsParseSignatureMember("TSCallSignatureDeclaration");if (this.match(I._new) && this.tsLookAhead(this.tsIsStartOfConstructSignature.bind(this))) return this.tsParseSignatureMember("TSConstructSignatureDeclaration");var t = this.startNode(),
						    e = !!this.tsParseModifier(["readonly"]),
						    s = this.tsTryParseIndexSignature(t);return s ? (e && (t.readonly = !0), s) : this.tsParsePropertyOrMethodSignature(t, e);
					}, i.tsIsStartOfConstructSignature = function () {
						return this.next(), this.match(I.parenL) || this.isRelational("<");
					}, i.tsParseTypeLiteral = function () {
						var t = this.startNode();return t.members = this.tsParseObjectTypeMembers(), this.finishNode(t, "TSTypeLiteral");
					}, i.tsParseObjectTypeMembers = function () {
						this.expect(I.braceL);var t = this.tsParseList("TypeMembers", this.tsParseTypeMember.bind(this));return this.expect(I.braceR), t;
					}, i.tsIsStartOfMappedType = function () {
						return this.next(), this.isContextual("readonly") && this.next(), !!this.match(I.bracketL) && (this.next(), !!this.tsIsIdentifier() && (this.next(), this.match(I._in)));
					}, i.tsParseMappedTypeParameter = function () {
						var t = this.startNode();return t.name = this.parseIdentifierName(t.start), this.expect(I._in), t.constraint = this.tsParseType(), this.finishNode(t, "TSTypeParameter");
					}, i.tsParseMappedType = function () {
						var t = this.startNode();return this.expect(I.braceL), this.eatContextual("readonly") && (t.readonly = !0), this.expect(I.bracketL), t.typeParameter = this.tsParseMappedTypeParameter(), this.expect(I.bracketR), this.eat(I.question) && (t.optional = !0), t.typeAnnotation = this.tsTryParseType(), this.semicolon(), this.expect(I.braceR), this.finishNode(t, "TSMappedType");
					}, i.tsParseTupleType = function () {
						var t = this.startNode();return t.elementTypes = this.tsParseBracketedList("TupleElementTypes", this.tsParseType.bind(this), !0, !1), this.finishNode(t, "TSTupleType");
					}, i.tsParseParenthesizedType = function () {
						var t = this.startNode();return this.expect(I.parenL), t.typeAnnotation = this.tsParseType(), this.expect(I.parenR), this.finishNode(t, "TSParenthesizedType");
					}, i.tsParseFunctionOrConstructorType = function (t) {
						var e = this.startNode();return "TSConstructorType" === t && this.expect(I._new), this.tsFillSignature(I.arrow, e), this.finishNode(e, t);
					}, i.tsParseLiteralTypeNode = function () {
						var t = this,
						    e = this.startNode();return e.literal = function () {
							switch (t.state.type) {case I.num:
									return t.parseLiteral(t.state.value, "NumericLiteral");case I.string:
									return t.parseLiteral(t.state.value, "StringLiteral");case I._true:case I._false:
									return t.parseBooleanLiteral();default:
									throw t.unexpected();}
						}(), this.finishNode(e, "TSLiteralType");
					}, i.tsParseNonArrayType = function () {
						switch (this.state.type) {case I.name:case I._void:case I._null:
								var t = this.match(I._void) ? "TSVoidKeyword" : this.match(I._null) ? "TSNullKeyword" : T(this.state.value);if (void 0 !== t && this.lookahead().type !== I.dot) {
									var e = this.startNode();return this.next(), this.finishNode(e, t);
								}return this.tsParseTypeReference();case I.string:case I.num:case I._true:case I._false:
								return this.tsParseLiteralTypeNode();case I.plusMin:
								if ("-" === this.state.value) {
									var s = this.startNode();if (this.next(), !this.match(I.num)) throw this.unexpected();return s.literal = this.parseLiteral(-this.state.value, "NumericLiteral", s.start, s.loc.start), this.finishNode(s, "TSLiteralType");
								}break;case I._this:
								var i = this.tsParseThisTypeNode();return this.isContextual("is") && !this.hasPrecedingLineBreak() ? this.tsParseThisTypePredicate(i) : i;case I._typeof:
								return this.tsParseTypeQuery();case I.braceL:
								return this.tsLookAhead(this.tsIsStartOfMappedType.bind(this)) ? this.tsParseMappedType() : this.tsParseTypeLiteral();case I.bracketL:
								return this.tsParseTupleType();case I.parenL:
								return this.tsParseParenthesizedType();}throw this.unexpected();
					}, i.tsParseArrayTypeOrHigher = function () {
						for (var t = this.tsParseNonArrayType(); !this.hasPrecedingLineBreak() && this.eat(I.bracketL);) {
							if (this.match(I.bracketR)) {
								var e = this.startNodeAtNode(t);e.elementType = t, this.expect(I.bracketR), t = this.finishNode(e, "TSArrayType");
							} else {
								var s = this.startNodeAtNode(t);s.objectType = t, s.indexType = this.tsParseType(), this.expect(I.bracketR), t = this.finishNode(s, "TSIndexedAccessType");
							}
						}return t;
					}, i.tsParseTypeOperator = function (t) {
						var e = this.startNode();return this.expectContextual(t), e.operator = t, e.typeAnnotation = this.tsParseTypeOperatorOrHigher(), this.finishNode(e, "TSTypeOperator");
					}, i.tsParseTypeOperatorOrHigher = function () {
						return this.isContextual("keyof") ? this.tsParseTypeOperator("keyof") : this.tsParseArrayTypeOrHigher();
					}, i.tsParseUnionOrIntersectionType = function (t, e, s) {
						this.eat(s);var i = e();if (this.match(s)) {
							for (var r = [i]; this.eat(s);) {
								r.push(e());
							}var a = this.startNodeAtNode(i);a.types = r, i = this.finishNode(a, t);
						}return i;
					}, i.tsParseIntersectionTypeOrHigher = function () {
						return this.tsParseUnionOrIntersectionType("TSIntersectionType", this.tsParseTypeOperatorOrHigher.bind(this), I.bitwiseAND);
					}, i.tsParseUnionTypeOrHigher = function () {
						return this.tsParseUnionOrIntersectionType("TSUnionType", this.tsParseIntersectionTypeOrHigher.bind(this), I.bitwiseOR);
					}, i.tsIsStartOfFunctionType = function () {
						return !!this.isRelational("<") || this.match(I.parenL) && this.tsLookAhead(this.tsIsUnambiguouslyStartOfFunctionType.bind(this));
					}, i.tsSkipParameterStart = function () {
						return !(!this.match(I.name) && !this.match(I._this) || (this.next(), 0));
					}, i.tsIsUnambiguouslyStartOfFunctionType = function () {
						if (this.next(), this.match(I.parenR) || this.match(I.ellipsis)) return !0;if (this.tsSkipParameterStart()) {
							if (this.match(I.colon) || this.match(I.comma) || this.match(I.question) || this.match(I.eq)) return !0;if (this.match(I.parenR) && (this.next(), this.match(I.arrow))) return !0;
						}return !1;
					}, i.tsParseTypeOrTypePredicateAnnotation = function (t) {
						var e = this.startNode();this.expect(t);var s = this.tsIsIdentifier() && this.tsTryParse(this.tsParseTypePredicatePrefix.bind(this));if (!s) return this.tsParseTypeAnnotation(!1, e);var i = this.tsParseTypeAnnotation(!1),
						    r = this.startNodeAtNode(s);return r.parameterName = s, r.typeAnnotation = i, e.typeAnnotation = this.finishNode(r, "TSTypePredicate"), this.finishNode(e, "TSTypeAnnotation");
					}, i.tsTryParseTypeOrTypePredicateAnnotation = function () {
						return this.match(I.colon) ? this.tsParseTypeOrTypePredicateAnnotation(I.colon) : void 0;
					}, i.tsTryParseTypeAnnotation = function () {
						return this.match(I.colon) ? this.tsParseTypeAnnotation() : void 0;
					}, i.tsTryParseType = function () {
						return this.eat(I.colon) ? this.tsParseType() : void 0;
					}, i.tsParseTypePredicatePrefix = function () {
						var t = this.parseIdentifier();if (this.isContextual("is") && !this.hasPrecedingLineBreak()) return this.next(), t;
					}, i.tsParseTypeAnnotation = function (t, e) {
						return void 0 === t && (t = !0), void 0 === e && (e = this.startNode()), t && this.expect(I.colon), e.typeAnnotation = this.tsParseType(), this.finishNode(e, "TSTypeAnnotation");
					}, i.tsParseType = function () {
						var t = this.state.inType;this.state.inType = !0;try {
							return this.tsIsStartOfFunctionType() ? this.tsParseFunctionOrConstructorType("TSFunctionType") : this.match(I._new) ? this.tsParseFunctionOrConstructorType("TSConstructorType") : this.tsParseUnionTypeOrHigher();
						} finally {
							this.state.inType = t;
						}
					}, i.tsParseTypeAssertion = function () {
						var t = this.startNode();return t.typeAnnotation = this.tsParseType(), this.expectRelational(">"), t.expression = this.parseMaybeUnary(), this.finishNode(t, "TSTypeAssertion");
					}, i.tsTryParseTypeArgumentsInExpression = function () {
						var t = this;return this.tsTryParseAndCatch(function () {
							var e = t.startNode();t.expectRelational("<");var s = t.tsParseDelimitedList("TypeParametersOrArguments", t.tsParseType.bind(t));return t.expectRelational(">"), e.params = s, t.finishNode(e, "TSTypeParameterInstantiation"), t.expect(I.parenL), e;
						});
					}, i.tsParseHeritageClause = function () {
						return this.tsParseDelimitedList("HeritageClauseElement", this.tsParseExpressionWithTypeArguments.bind(this));
					}, i.tsParseExpressionWithTypeArguments = function () {
						var t = this.startNode();return t.expression = this.tsParseEntityName(!1), this.isRelational("<") && (t.typeParameters = this.tsParseTypeArguments()), this.finishNode(t, "TSExpressionWithTypeArguments");
					}, i.tsParseInterfaceDeclaration = function (t) {
						t.id = this.parseIdentifier(), t.typeParameters = this.tsTryParseTypeParameters(), this.eat(I._extends) && (t.extends = this.tsParseHeritageClause());var e = this.startNode();return e.body = this.tsParseObjectTypeMembers(), t.body = this.finishNode(e, "TSInterfaceBody"), this.finishNode(t, "TSInterfaceDeclaration");
					}, i.tsParseTypeAliasDeclaration = function (t) {
						return t.id = this.parseIdentifier(), t.typeParameters = this.tsTryParseTypeParameters(), this.expect(I.eq), t.typeAnnotation = this.tsParseType(), this.semicolon(), this.finishNode(t, "TSTypeAliasDeclaration");
					}, i.tsParseEnumMember = function () {
						var t = this.startNode();return t.id = this.match(I.string) ? this.parseLiteral(this.state.value, "StringLiteral") : this.parseIdentifier(!0), this.eat(I.eq) && (t.initializer = this.parseMaybeAssign()), this.finishNode(t, "TSEnumMember");
					}, i.tsParseEnumDeclaration = function (t, e) {
						return e && (t.const = !0), t.id = this.parseIdentifier(), this.expect(I.braceL), t.members = this.tsParseDelimitedList("EnumMembers", this.tsParseEnumMember.bind(this)), this.expect(I.braceR), this.finishNode(t, "TSEnumDeclaration");
					}, i.tsParseModuleBlock = function () {
						var t = this.startNode();return this.expect(I.braceL), this.parseBlockOrModuleBlockBody(t.body = [], void 0, !0, I.braceR), this.finishNode(t, "TSModuleBlock");
					}, i.tsParseModuleOrNamespaceDeclaration = function (t) {
						if (t.id = this.parseIdentifier(), this.eat(I.dot)) {
							var e = this.startNode();this.tsParseModuleOrNamespaceDeclaration(e), t.body = e;
						} else t.body = this.tsParseModuleBlock();return this.finishNode(t, "TSModuleDeclaration");
					}, i.tsParseAmbientExternalModuleDeclaration = function (t) {
						return this.isContextual("global") ? (t.global = !0, t.id = this.parseIdentifier()) : this.match(I.string) ? t.id = this.parseExprAtom() : this.unexpected(), this.match(I.braceL) ? t.body = this.tsParseModuleBlock() : this.semicolon(), this.finishNode(t, "TSModuleDeclaration");
					}, i.tsParseImportEqualsDeclaration = function (t, e) {
						return t.isExport = e || !1, t.id = this.parseIdentifier(), this.expect(I.eq), t.moduleReference = this.tsParseModuleReference(), this.semicolon(), this.finishNode(t, "TSImportEqualsDeclaration");
					}, i.tsIsExternalModuleReference = function () {
						return this.isContextual("require") && this.lookahead().type === I.parenL;
					}, i.tsParseModuleReference = function () {
						return this.tsIsExternalModuleReference() ? this.tsParseExternalModuleReference() : this.tsParseEntityName(!1);
					}, i.tsParseExternalModuleReference = function () {
						var t = this.startNode();if (this.expectContextual("require"), this.expect(I.parenL), !this.match(I.string)) throw this.unexpected();return t.expression = this.parseLiteral(this.state.value, "StringLiteral"), this.expect(I.parenR), this.finishNode(t, "TSExternalModuleReference");
					}, i.tsLookAhead = function (t) {
						var e = this.state.clone(),
						    s = t();return this.state = e, s;
					}, i.tsTryParseAndCatch = function (t) {
						var e = this.state.clone();try {
							return t();
						} catch (t) {
							if (t instanceof SyntaxError) return void (this.state = e);throw t;
						}
					}, i.tsTryParse = function (t) {
						var e = this.state.clone(),
						    s = t();return void 0 !== s && !1 !== s ? s : void (this.state = e);
					}, i.nodeWithSamePosition = function (t, e) {
						var s = this.startNodeAtNode(t);return s.type = e, s.end = t.end, s.loc.end = t.loc.end, t.leadingComments && (s.leadingComments = t.leadingComments), t.trailingComments && (s.trailingComments = t.trailingComments), t.innerComments && (s.innerComments = t.innerComments), s;
					}, i.tsTryParseDeclare = function (t) {
						switch (this.state.type) {case I._function:
								return this.next(), this.parseFunction(t, !0);case I._class:
								return this.parseClass(t, !0, !1);case I._const:
								if (this.match(I._const) && this.isLookaheadContextual("enum")) return this.expect(I._const), this.expectContextual("enum"), this.tsParseEnumDeclaration(t, !0);case I._var:case I._let:
								return this.parseVarStatement(t, this.state.type);case I.name:
								var e = this.state.value;return "global" === e ? this.tsParseAmbientExternalModuleDeclaration(t) : this.tsParseDeclaration(t, e, !0);}
					}, i.tsTryParseExportDeclaration = function () {
						return this.tsParseDeclaration(this.startNode(), this.state.value, !0);
					}, i.tsParseExpressionStatement = function (t, e) {
						switch (e.name) {case "declare":
								var s = this.tsTryParseDeclare(t);if (s) return s.declare = !0, s;break;case "global":
								if (this.match(I.braceL)) {
									var i = t;return i.global = !0, i.id = e, i.body = this.tsParseModuleBlock(), this.finishNode(i, "TSModuleDeclaration");
								}break;default:
								return this.tsParseDeclaration(t, e.name, !1);}
					}, i.tsParseDeclaration = function (t, e, s) {
						switch (e) {case "abstract":
								if (s || this.match(I._class)) {
									var i = t;return i.abstract = !0, s && this.next(), this.parseClass(i, !0, !1);
								}break;case "enum":
								if (s || this.match(I.name)) return s && this.next(), this.tsParseEnumDeclaration(t, !1);break;case "interface":
								if (s || this.match(I.name)) return s && this.next(), this.tsParseInterfaceDeclaration(t);break;case "module":
								if (s && this.next(), this.match(I.string)) return this.tsParseAmbientExternalModuleDeclaration(t);if (s || this.match(I.name)) return this.tsParseModuleOrNamespaceDeclaration(t);break;case "namespace":
								if (s || this.match(I.name)) return s && this.next(), this.tsParseModuleOrNamespaceDeclaration(t);break;case "type":
								if (s || this.match(I.name)) return s && this.next(), this.tsParseTypeAliasDeclaration(t);}
					}, i.tsTryParseGenericAsyncArrowFunction = function (e, s) {
						var i = this,
						    r = this.tsTryParseAndCatch(function () {
							var r = i.startNodeAt(e, s);return r.typeParameters = i.tsParseTypeParameters(), t.prototype.parseFunctionParams.call(i, r), r.returnType = i.tsTryParseTypeOrTypePredicateAnnotation(), i.expect(I.arrow), r;
						});if (r) return r.id = null, r.generator = !1, r.expression = !0, r.async = !0, this.parseFunctionBody(r, !0), this.finishNode(r, "ArrowFunctionExpression");
					}, i.tsParseTypeArguments = function () {
						var t = this.startNode();return this.expectRelational("<"), t.params = this.tsParseDelimitedList("TypeParametersOrArguments", this.tsParseType.bind(this)), this.expectRelational(">"), this.finishNode(t, "TSTypeParameterInstantiation");
					}, i.tsIsDeclarationStart = function () {
						if (this.match(I.name)) switch (this.state.value) {case "abstract":case "declare":case "enum":case "interface":case "module":case "namespace":case "type":
								return !0;}return !1;
					}, i.isExportDefaultSpecifier = function () {
						return !this.tsIsDeclarationStart() && t.prototype.isExportDefaultSpecifier.call(this);
					}, i.parseAssignableListItem = function (t, e) {
						var s,
						    i = !1;t && (s = this.parseAccessModifier(), i = !!this.tsParseModifier(["readonly"]));var r = this.parseMaybeDefault();this.parseAssignableListItemTypes(r);var a = this.parseMaybeDefault(r.start, r.loc.start, r);if (s || i) {
							var n = this.startNodeAtNode(a);if (e.length && (n.decorators = e), s && (n.accessibility = s), i && (n.readonly = i), "Identifier" !== a.type && "AssignmentPattern" !== a.type) throw this.raise(n.start, "A parameter property may not be declared using a binding pattern.");return n.parameter = a, this.finishNode(n, "TSParameterProperty");
						}return e.length && (r.decorators = e), a;
					}, i.parseFunctionBodyAndFinish = function (e, s, i) {
						!i && this.match(I.colon) && (e.returnType = this.tsParseTypeOrTypePredicateAnnotation(I.colon));var r = "FunctionDeclaration" === s ? "TSDeclareFunction" : "ClassMethod" === s ? "TSDeclareMethod" : void 0;r && !this.match(I.braceL) && this.isLineTerminator() ? this.finishNode(e, r) : t.prototype.parseFunctionBodyAndFinish.call(this, e, s, i);
					}, i.parseSubscript = function (e, s, i, r, a) {
						if (this.eat(I.bang)) {
							var n = this.startNodeAt(s, i);return n.expression = e, this.finishNode(n, "TSNonNullExpression");
						}if (!r && this.isRelational("<")) {
							if (this.atPossibleAsync(e)) {
								var o = this.tsTryParseGenericAsyncArrowFunction(s, i);if (o) return o;
							}var h = this.startNodeAt(s, i);h.callee = e;var p = this.tsTryParseTypeArgumentsInExpression();if (p) return h.arguments = this.parseCallExpressionArguments(I.parenR, !1), h.typeParameters = p, this.finishCallExpression(h);
						}return t.prototype.parseSubscript.call(this, e, s, i, r, a);
					}, i.parseNewArguments = function (e) {
						var s = this;if (this.isRelational("<")) {
							var i = this.tsTryParseAndCatch(function () {
								var t = s.tsParseTypeArguments();return s.match(I.parenL) || s.unexpected(), t;
							});i && (e.typeParameters = i);
						}t.prototype.parseNewArguments.call(this, e);
					}, i.parseExprOp = function (e, s, i, r, a) {
						if (g(I._in.binop) > r && !this.hasPrecedingLineBreak() && this.eatContextual("as")) {
							var n = this.startNodeAt(s, i);return n.expression = e, n.typeAnnotation = this.tsParseType(), this.finishNode(n, "TSAsExpression"), this.parseExprOp(n, s, i, r, a);
						}return t.prototype.parseExprOp.call(this, e, s, i, r, a);
					}, i.checkReservedWord = function (t, e, s, i) {}, i.checkDuplicateExports = function () {}, i.parseImport = function (e) {
						return this.match(I.name) && this.lookahead().type === I.eq ? this.tsParseImportEqualsDeclaration(e) : t.prototype.parseImport.call(this, e);
					}, i.parseExport = function (e) {
						if (this.match(I._import)) return this.expect(I._import), this.tsParseImportEqualsDeclaration(e, !0);if (this.eat(I.eq)) {
							var s = e;return s.expression = this.parseExpression(), this.semicolon(), this.finishNode(s, "TSExportAssignment");
						}if (this.eatContextual("as")) {
							var i = e;return this.expectContextual("namespace"), i.id = this.parseIdentifier(), this.semicolon(), this.finishNode(i, "TSNamespaceExportDeclaration");
						}return t.prototype.parseExport.call(this, e);
					}, i.parseStatementContent = function (e, s) {
						if (this.state.type === I._const) {
							var i = this.lookahead();if (i.type === I.name && "enum" === i.value) {
								var r = this.startNode();return this.expect(I._const), this.expectContextual("enum"), this.tsParseEnumDeclaration(r, !0);
							}
						}return t.prototype.parseStatementContent.call(this, e, s);
					}, i.parseAccessModifier = function () {
						return this.tsParseModifier(["public", "protected", "private"]);
					}, i.parseClassMember = function (e, s, i) {
						var r = this.parseAccessModifier();r && (s.accessibility = r), t.prototype.parseClassMember.call(this, e, s, i);
					}, i.parseClassMemberWithIsStatic = function (e, s, i, r) {
						var a = s,
						    n = s,
						    o = s,
						    h = !1,
						    p = !1;switch (this.tsParseModifier(["abstract", "readonly"])) {case "readonly":
								p = !0, h = !!this.tsParseModifier(["abstract"]);break;case "abstract":
								h = !0, p = !!this.tsParseModifier(["readonly"]);}if (h && (a.abstract = !0), p && (o.readonly = !0), !h && !r && !a.accessibility) {
							var c = this.tsTryParseIndexSignature(s);if (c) return void e.body.push(c);
						}if (p) return a.static = r, this.parseClassPropertyName(n), this.parsePostMemberNameModifiers(a), void this.pushClassProperty(e, n);t.prototype.parseClassMemberWithIsStatic.call(this, e, s, i, r);
					}, i.parsePostMemberNameModifiers = function (t) {
						this.eat(I.question) && (t.optional = !0);
					}, i.parseExpressionStatement = function (e, s) {
						return ("Identifier" === s.type ? this.tsParseExpressionStatement(e, s) : void 0) || t.prototype.parseExpressionStatement.call(this, e, s);
					}, i.shouldParseExportDeclaration = function () {
						return !!this.tsIsDeclarationStart() || t.prototype.shouldParseExportDeclaration.call(this);
					}, i.parseConditional = function (e, s, i, r, a) {
						if (!a || !this.match(I.question)) return t.prototype.parseConditional.call(this, e, s, i, r, a);var n = this.state.clone();try {
							return t.prototype.parseConditional.call(this, e, s, i, r);
						} catch (t) {
							if (!(t instanceof SyntaxError)) throw t;return this.state = n, a.start = t.pos || this.state.start, e;
						}
					}, i.parseParenItem = function (e, s, i) {
						if (e = t.prototype.parseParenItem.call(this, e, s, i), this.eat(I.question) && (e.optional = !0), this.match(I.colon)) {
							var r = this.startNodeAt(s, i);return r.expression = e, r.typeAnnotation = this.tsParseTypeAnnotation(), this.finishNode(r, "TSTypeCastExpression");
						}return e;
					}, i.parseExportDeclaration = function (e) {
						var s,
						    i = this.eatContextual("declare");return this.match(I.name) && (s = this.tsTryParseExportDeclaration()), s || (s = t.prototype.parseExportDeclaration.call(this, e)), s && i && (s.declare = !0), s;
					}, i.parseClassId = function (e, s, i) {
						var r;if (s && !i || !this.isContextual("implements")) {
							(r = t.prototype.parseClassId).call.apply(r, [this].concat(Array.prototype.slice.call(arguments)));var a = this.tsTryParseTypeParameters();a && (e.typeParameters = a);
						}
					}, i.parseClassProperty = function (e) {
						var s = this.tsTryParseTypeAnnotation();return s && (e.typeAnnotation = s), t.prototype.parseClassProperty.call(this, e);
					}, i.pushClassMethod = function (e, s, i, r, a) {
						var n = this.tsTryParseTypeParameters();n && (s.typeParameters = n), t.prototype.pushClassMethod.call(this, e, s, i, r, a);
					}, i.pushClassPrivateMethod = function (e, s, i, r) {
						var a = this.tsTryParseTypeParameters();a && (s.typeParameters = a), t.prototype.pushClassPrivateMethod.call(this, e, s, i, r);
					}, i.parseClassSuper = function (e) {
						t.prototype.parseClassSuper.call(this, e), e.superClass && this.isRelational("<") && (e.superTypeParameters = this.tsParseTypeArguments()), this.eatContextual("implements") && (e.implements = this.tsParseHeritageClause());
					}, i.parseObjPropValue = function (e) {
						var s;if (this.isRelational("<")) throw new Error("TODO");for (var i = arguments.length, r = new Array(i > 1 ? i - 1 : 0), a = 1; a < i; a++) {
							r[a - 1] = arguments[a];
						}(s = t.prototype.parseObjPropValue).call.apply(s, [this, e].concat(r));
					}, i.parseFunctionParams = function (e, s) {
						var i = this.tsTryParseTypeParameters();i && (e.typeParameters = i), t.prototype.parseFunctionParams.call(this, e, s);
					}, i.parseVarHead = function (e) {
						t.prototype.parseVarHead.call(this, e);var s = this.tsTryParseTypeAnnotation();s && (e.id.typeAnnotation = s, this.finishNode(e.id, e.id.type));
					}, i.parseAsyncArrowFromCallExpression = function (e, s) {
						return this.match(I.colon) && (e.returnType = this.tsParseTypeAnnotation()), t.prototype.parseAsyncArrowFromCallExpression.call(this, e, s);
					}, i.parseMaybeAssign = function () {
						for (var e, s = arguments.length, i = new Array(s), r = 0; r < s; r++) {
							i[r] = arguments[r];
						}if (this.match(I.jsxTagStart)) {
							b(this.curContext() === G.j_oTag), b(this.state.context[this.state.context.length - 2] === G.j_expr);var a = this.state.clone();try {
								var n;return (n = t.prototype.parseMaybeAssign).call.apply(n, [this].concat(i));
							} catch (t) {
								if (!(t instanceof SyntaxError)) throw t;this.state = a, b(this.curContext() === G.j_oTag), this.state.context.pop(), b(this.curContext() === G.j_expr), this.state.context.pop(), e = t;
							}
						}if (void 0 === e && !this.isRelational("<")) {
							var o;return (o = t.prototype.parseMaybeAssign).call.apply(o, [this].concat(i));
						}var h,
						    p,
						    c = this.state.clone();try {
							var l;p = this.tsParseTypeParameters(), "ArrowFunctionExpression" !== (h = (l = t.prototype.parseMaybeAssign).call.apply(l, [this].concat(i))).type && this.unexpected();
						} catch (s) {
							var u;if (!(s instanceof SyntaxError)) throw s;if (e) throw e;return b(!this.hasPlugin("jsx")), this.state = c, (u = t.prototype.parseMaybeAssign).call.apply(u, [this].concat(i));
						}return p && 0 !== p.params.length && this.resetStartLocationFromNode(h, p.params[0]), h.typeParameters = p, h;
					}, i.parseMaybeUnary = function (e) {
						return !this.hasPlugin("jsx") && this.eatRelational("<") ? this.tsParseTypeAssertion() : t.prototype.parseMaybeUnary.call(this, e);
					}, i.parseArrow = function (e) {
						if (this.match(I.colon)) {
							var s = this.state.clone();try {
								var i = this.tsParseTypeOrTypePredicateAnnotation(I.colon);this.canInsertSemicolon() && this.unexpected(), this.match(I.arrow) || this.unexpected(), e.returnType = i;
							} catch (t) {
								if (!(t instanceof SyntaxError)) throw t;this.state = s;
							}
						}return t.prototype.parseArrow.call(this, e);
					}, i.parseAssignableListItemTypes = function (t) {
						if (this.eat(I.question)) {
							if ("Identifier" !== t.type) throw this.raise(t.start, "A binding pattern parameter cannot be optional in an implementation signature.");t.optional = !0;
						}var e = this.tsTryParseTypeAnnotation();return e && (t.typeAnnotation = e), this.finishNode(t, t.type);
					}, i.toAssignable = function (e, s, i) {
						switch (e.type) {case "TSTypeCastExpression":
								return t.prototype.toAssignable.call(this, this.typeCastToParameter(e), s, i);case "TSParameterProperty":default:
								return t.prototype.toAssignable.call(this, e, s, i);}
					}, i.checkLVal = function (e, s, i, r) {
						switch (e.type) {case "TSTypeCastExpression":
								return;case "TSParameterProperty":
								return void this.checkLVal(e.parameter, s, i, "parameter property");default:
								return void t.prototype.checkLVal.call(this, e, s, i, r);}
					}, i.parseBindingAtom = function () {
						switch (this.state.type) {case I._this:
								return this.parseIdentifier(!0);default:
								return t.prototype.parseBindingAtom.call(this);}
					}, i.isClassMethod = function () {
						return this.isRelational("<") || t.prototype.isClassMethod.call(this);
					}, i.isClassProperty = function () {
						return this.match(I.colon) || t.prototype.isClassProperty.call(this);
					}, i.parseMaybeDefault = function () {
						for (var e, s = arguments.length, i = new Array(s), r = 0; r < s; r++) {
							i[r] = arguments[r];
						}var a = (e = t.prototype.parseMaybeDefault).call.apply(e, [this].concat(i));return "AssignmentPattern" === a.type && a.typeAnnotation && a.right.start < a.typeAnnotation.start && this.raise(a.typeAnnotation.start, "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`"), a;
					}, i.readToken = function (e) {
						return !this.state.inType || 62 !== e && 60 !== e ? t.prototype.readToken.call(this, e) : this.finishOp(I.relational, 1);
					}, i.toAssignableList = function (e, s, i) {
						for (var r = 0; r < e.length; r++) {
							var a = e[r];a && "TSTypeCastExpression" === a.type && (e[r] = this.typeCastToParameter(a));
						}return t.prototype.toAssignableList.call(this, e, s, i);
					}, i.typeCastToParameter = function (t) {
						return t.expression.typeAnnotation = t.typeAnnotation, this.finishNodeAt(t.expression, t.expression.type, t.typeAnnotation.end, t.typeAnnotation.loc.end);
					}, i.toReferencedList = function (t) {
						for (var e = 0; e < t.length; e++) {
							var s = t[e];s && s._exprListItem && "TsTypeCastExpression" === s.type && this.raise(s.start, "Did not expect a type annotation here.");
						}return t;
					}, i.shouldParseArrow = function () {
						return this.match(I.colon) || t.prototype.shouldParseArrow.call(this);
					}, i.shouldParseAsyncArrow = function () {
						return this.match(I.colon) || t.prototype.shouldParseAsyncArrow.call(this);
					}, e;
				}(t);
			};var dt = {};e.parse = function (t, e) {
				if (!e || "unambiguous" !== e.sourceType) return w(e, t).parse();e = Object.assign({}, e);try {
					e.sourceType = "module";var s = w(e, t).parse();return N(s) || (s.program.sourceType = "script"), s;
				} catch (s) {
					try {
						return e.sourceType = "script", w(e, t).parse();
					} catch (t) {}throw s;
				}
			}, e.parseExpression = function (t, e) {
				var s = w(e, t);return s.options.strictMode && (s.state.strict = !0), s.getExpression();
			}, e.tokTypes = I;
		});unwrapExports$$1(lib);var parserBabylon = parse;module.exports = parserBabylon;
	});

	var parserBabylon = unwrapExports(parserBabylon_1);

	return parserBabylon;
}();
