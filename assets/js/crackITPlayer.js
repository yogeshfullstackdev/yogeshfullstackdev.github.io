"use strict";
function _toConsumableArray(a) {
    if (Array.isArray(a)) {
        for (var b = 0, c = Array(a.length); b < a.length; b++) c[b] = a[b];
        return c;
    }
    return Array.from(a);
}
function _possibleConstructorReturn(a, b) {
    if (!a) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !b || ("object" != typeof b && "function" != typeof b) ? a : b;
}
function _inherits(a, b) {
    if ("function" != typeof b && null !== b) throw new TypeError("Super expression must either be null or a function, not " + typeof b);
    (a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } })), b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : (a.__proto__ = b));
}
function _classCallCheck(a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
}
function isAndroidApp() {
    try {
        if (AndroidApp) return !0;
    } catch (a) {
        return !1;
    }
}
function fixPoints(a, b) {
    for (var c = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2], d = [], e = -1, f = 1920, g = 1080, h = a; h < b.length; h++) {
        var i = b[h].a;
        if (
            ("start" == i && ((e = h), (d = []), d.push([parseFloat(b[h].p.x) * f, parseFloat(b[h].p.y) * g, parseFloat(b[h].t)])),
            "move" == i && (e == -1 && ((e = h), (d = [])), d.push([parseFloat(b[h].p.x) * f, parseFloat(b[h].p.y) * g, parseFloat(b[h].t)])),
            "end" == i)
        ) {
            if (e == -1) {
                if (c) break;
                continue;
            }
            d.push([parseFloat(b[h].p.x) * f, parseFloat(b[h].p.y) * g, parseFloat(b[h].t)]);
            for (var j = fitCurve(d, 100), k = j.m, l = 0, m = e; m <= h; m++)
                if ("start" == b[m].a || "end" == b[m].a || "move" == b[m].a) {
                    var n = k[l];
                    (b[m].p.x = n.x / f), (b[m].p.y = n.y / g), l++;
                }
            if (((e = -1), c)) break;
        }
    }
    return c ? h : b;
}
function fitCurve(a, b, c) {
    var d = a.length,
        e = createTangent(a[1], a[0]),
        f = createTangent(a[d - 2], a[d - 1]);
    return fitCubic(a, e, f, b, c);
}
function fitCubic(a, b, c, d, e) {
    var f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p,
        q,
        r,
        s = 20;
    if (2 === a.length)
        return (
            (p = maths.vectorLen(maths.subtract(a[0], a[1])) / 3),
            (f = [a[0], maths.addArrays(a[0], maths.mulItems(b, p)), maths.addArrays(a[1], maths.mulItems(c, p)), a[1]]),
            (r = []),
            r.push({ x: a[0][0], y: a[0][1], t: a[0][2] }),
            r.push({ x: a[1][0], y: a[1][1], t: a[1][2] }),
            { b: [f], m: r }
        );
    if (((g = chordLengthParameterize(a)), (x = generateAndReport(a, g, g, b, c, e)), (f = x[0]), (i = x[1]), (k = x[2]), (r = x[3]), i < d)) return { b: [f], m: r };
    if (i < d * d)
        for (h = g, j = i, l = k, q = 0; q < s; q++) {
            if (((h = reparameterize(f, a, h)), (y = generateAndReport(a, g, h, b, c, e)), (f = y[0]), (i = y[1]), (k = y[2]), (r = y[3]), i < d)) return { b: [f], m: r };
            if (k === l) {
                var t = i / j;
                if (t > 0.9999 && t < 1.0001) break;
            }
            (j = i), (l = k);
        }
    o = [];
    var u = getSplitTangents(a, k);
    (m = u[0]), (n = u[1]);
    var v = fitCubic(a.slice(0, k + 1), b, m, d, e),
        w = fitCubic(a.slice(k), n, c, d, e);
    return (o = o.concat(v.b)), (o = o.concat(w.b)), (r = []), v.m.pop(), (r = r.concat(v.m)), (r = r.concat(w.m)), { b: o, m: r };
    var x, y;
}
function getSplitTangents(a, b) {
    var c = maths.subtract(a[b - 1], a[b + 1]);
    0 === c[0] && 0 === c[1] && ((c = maths.subtract(a[b - 1], a[b]).reverse()), (c[0] = -c[0]));
    var d = maths.normalize(c),
        e = maths.mulItems(d, -1);
    return [d, e];
}
function getSplitTangentsFromPoints(a) {
    var b = maths.subtract(a[0], a[2]);
    0 === b[0] && 0 === b[1] && ((b = maths.subtract(a[0], a[1]).reverse()), (b[0] = -b[0]));
    var c = maths.normalize(b),
        d = maths.mulItems(c, -1);
    return [c, d];
}
function generateAndReport(a, b, c, d, e, f) {
    var g, h, i, j;
    return (g = generateBezier(a, c, d, e)), (k = computeMaxError(a, g, b)), (h = k[0]), (i = k[1]), (j = k[2]), f && f({ bez: g, points: a, params: b, maxErr: h, maxPoint: i }), [g, h, i, j];
    var k;
}
function generateBezier(a, b, c, d) {
    var e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p,
        q,
        r,
        s,
        t,
        u,
        v = a[0],
        w = a[a.length - 1];
    for (e = [v, null, null, w], f = maths.zeros_Xx2x2(b.length), q = 0, r = b.length; q < r; q++) (t = b[q]), (u = 1 - t), (g = f[q]), (g[0] = maths.mulItems(c, 3 * t * (u * u))), (g[1] = maths.mulItems(d, 3 * u * (t * t)));
    for (
        h = [
            [0, 0],
            [0, 0],
        ],
            i = [0, 0],
            q = 0,
            r = a.length;
        q < r;
        q++
    )
        (t = b[q]),
            (g = f[q]),
            (h[0][0] += maths.dot(g[0], g[0])),
            (h[0][1] += maths.dot(g[0], g[1])),
            (h[1][0] += maths.dot(g[0], g[1])),
            (h[1][1] += maths.dot(g[1], g[1])),
            (s = maths.subtract(a[q], bezier.q([v, v, w, w], t))),
            (i[0] += maths.dot(g[0], s)),
            (i[1] += maths.dot(g[1], s));
    return (
        (j = h[0][0] * h[1][1] - h[1][0] * h[0][1]),
        (k = h[0][0] * i[1] - h[1][0] * i[0]),
        (l = i[0] * h[1][1] - i[1] * h[0][1]),
        (m = 0 === j ? 0 : l / j),
        (n = 0 === j ? 0 : k / j),
        (p = maths.vectorLen(maths.subtract(v, w))),
        (o = 1e-6 * p),
        m < o || n < o
            ? ((e[1] = maths.addArrays(v, maths.mulItems(c, p / 3))), (e[2] = maths.addArrays(w, maths.mulItems(d, p / 3))))
            : ((e[1] = maths.addArrays(v, maths.mulItems(c, m))), (e[2] = maths.addArrays(w, maths.mulItems(d, n)))),
        e
    );
}
function reparameterize(a, b, c) {
    return c.map(function (c, d) {
        return newtonRaphsonRootFind(a, b[d], c);
    });
}
function newtonRaphsonRootFind(a, b, c) {
    var d = maths.subtract(bezier.q(a, c), b),
        e = bezier.qprime(a, c),
        f = maths.mulMatrix(d, e),
        g = maths.sum(maths.addItems(maths.squareItems(e), maths.mulMatrix(d, bezier.qprimeprime(a, c))));
    return 0 === g ? c : c - f / g;
}
function chordLengthParameterize(a) {
    var b,
        c,
        d,
        e = [];
    return (
        a.forEach(function (a, f) {
            (b = f ? c + maths.vectorLen(maths.subtract(a, d)) : 0), e.push(b), (c = b), (d = a);
        }),
        (e = e.map(function (a) {
            return a / c;
        }))
    );
}
function computeMaxError(a, b, c) {
    var d, e, f, g, h, i, j, k;
    (e = 0), (f = a.length / 2);
    var l = [];
    for (h = 0, i = a.length; h < i; h++) {
        (j = a[h]), (k = find_t(b, c[h]));
        var m = bezier.q(b, k);
        l.push({ x: m[0], y: m[1], t: j[2] }), (g = maths.subtract(m, j)), (d = g[0] * g[0] + g[1] * g[1]), d > e && ((e = d), (f = h));
    }
    return [e, f, l];
}
function find_t(a, b) {
    if (b <= 0) return 0;
    if (b >= 1) return 1;
    var c,
        d,
        e,
        f,
        g,
        h = 10;
    a.__map_t_p =
        a.__map_t_p ||
        (function () {
            for (var b, c = [0], d = a[0], e = 0, f = 1; f <= h; f++) (b = bezier.q(a, f / h)), (e += maths.vectorLen(maths.subtract(b, d))), c.push(e), (d = b);
            return (c = c.map(function (a) {
                return a / e;
            }));
        })();
    for (var i = a.__map_t_p, j = 1; j <= h; j++)
        if (b <= i[j]) {
            (f = (j - 1) / h), (e = j / h), (d = i[j - 1]), (c = i[j]), (g = ((b - d) / (c - d)) * (e - f) + f);
            break;
        }
    return g;
}
function createTangent(a, b) {
    var c = maths.normalize(maths.subtract(a, b));
    return isNaN(c[0]) || isNaN(c[1]) ? [0, 0] : c;
}
function getHiddenProp() {
    var a = ["webkit", "moz", "ms", "o"];
    if ("hidden" in document) return "hidden";
    for (var b = 0; b < a.length; b++) if (a[b] + "Hidden" in document) return a[b] + "Hidden";
    return null;
}
function isHidden() {
    var a = getHiddenProp();
    return !!a && document[a];
}
function isFlex() {
    if (!/Android/gi.test(navigator.userAgent)) return !0;
    try {
        var a = "flex",
            b = document.createElement("b");
        return (b.style.display = a), b.style.display == a;
    } catch (b) {
        return !0;
    }
}
function requestFullScreen(a) {
    var b = a.requestFullScreen || a.webkitRequestFullScreen || a.mozRequestFullScreen || a.msRequestFullScreen;
    if (b) b.call(a);
    else {
        if ("undefined" == typeof window.ActiveXObject) return !1;
        var c = new ActiveXObject("WScript.Shell");
        null !== c && c.SendKeys("{F11}");
    }
    return !0;
}
function exitFullScreen() {
    document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen();
}
function requestLandscape() {
    try {
        var a = screen.orientation || screen.mozOrientation || screen.msOrientation;
        a && a.lock("landscape");
    } catch (b) {
        return !1;
    }
    return !0;
}
function unlockOrientation() {
    var a = screen.unlockOrientation || screen.mozUnlockOrientation || screen.msUnlockOrientation;
    try {
        if (a) return a();
        screen.orientation && screen.orientation.unlock();
    } catch (b) {
        return !1;
    }
}
function is_touch_device() {
    return "ontouchstart" in window || navigator.maxTouchPoints;
}
function getFromArray(a, b) {
    if (b <= a[0]) return a[0];
    var c = a.binarySearch(b, function (a, b) {
        return a - b;
    });
    return b == a[c] ? b : (c++, (c = Math.min(c, a.length - 1)), a[c]);
}
function canUseWebP() {
    try {
        var a = document.createElement("canvas");
        return !(!a.getContext || !a.getContext("2d")) && 0 == a.toDataURL("image/webp").indexOf("data:image/webp");
    } catch (b) {
        return !1;
    }
}
function addMultipleParameter(a, b) {
    for (var c in b) a = addParameter(a, c, b[c]);
    return a;
}
function addParameter(a, b, c) {
    var d = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
        e = !0,
        f = "";
    if (a.indexOf("#") > 0) {
        var g = a.indexOf("#");
        f = a.substring(a.indexOf("#"), a.length);
    } else (f = ""), (g = a.length);
    var h = a.substring(0, g),
        i = h.split("?"),
        j = "";
    if (i.length > 1)
        for (var k = i[1].split("&"), l = 0; l < k.length; l++) {
            var m = k[l].split("=");
            (e && m[0] == b) || ("" == j ? (j = "?") : (j += "&"), (j += m[0] + "=" + (m[1] ? m[1] : "")));
        }
    return "" == j && (j = "?"), d ? (j = "?" + b + "=" + c + (j.length > 1 ? "&" + j.substring(1) : "")) : ("" !== j && "?" != j && (j += "&"), (j += b + "=" + (c ? c : ""))), i[0] + j + f;
}
var _get = function a(b, c, d) {
        null === b && (b = Function.prototype);
        var e = Object.getOwnPropertyDescriptor(b, c);
        if (void 0 === e) {
            var f = Object.getPrototypeOf(b);
            return null === f ? void 0 : a(f, c, d);
        }
        if ("value" in e) return e.value;
        var g = e.get;
        if (void 0 !== g) return g.call(d);
    },
    _createClass = (function () {
        function a(a, b) {
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                (d.enumerable = d.enumerable || !1), (d.configurable = !0), "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d);
            }
        }
        return function (b, c, d) {
            return c && a(b.prototype, c), d && a(b, d), b;
        };
    })(),
    _typeof =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (a) {
                  return typeof a;
              }
            : function (a) {
                  return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
              };
!(function (a) {
    function b() {}
    function c(a, b) {
        return function () {
            a.apply(b, arguments);
        };
    }
    function d(a) {
        if ("object" != _typeof(this)) throw new TypeError("Promises must be constructed via new");
        if ("function" != typeof a) throw new TypeError("not a function");
        (this._state = 0), (this._handled = !1), (this._value = void 0), (this._deferreds = []), j(a, this);
    }
    function e(a, b) {
        for (; 3 === a._state; ) a = a._value;
        return 0 === a._state
            ? void a._deferreds.push(b)
            : ((a._handled = !0),
              void d._immediateFn(function () {
                  var c = 1 === a._state ? b.onFulfilled : b.onRejected;
                  if (null === c) return void (1 === a._state ? f : g)(b.promise, a._value);
                  var d;
                  try {
                      d = c(a._value);
                  } catch (e) {
                      return void g(b.promise, e);
                  }
                  f(b.promise, d);
              }));
    }
    function f(a, b) {
        try {
            if (b === a) throw new TypeError("A promise cannot be resolved with itself.");
            if (b && ("object" == ("undefined" == typeof b ? "undefined" : _typeof(b)) || "function" == typeof b)) {
                var e = b.then;
                if (b instanceof d) return (a._state = 3), (a._value = b), void h(a);
                if ("function" == typeof e) return void j(c(e, b), a);
            }
            (a._state = 1), (a._value = b), h(a);
        } catch (f) {
            g(a, f);
        }
    }
    function g(a, b) {
        (a._state = 2), (a._value = b), h(a);
    }
    function h(a) {
        2 === a._state &&
            0 === a._deferreds.length &&
            d._immediateFn(function () {
                a._handled || d._unhandledRejectionFn(a._value);
            });
        for (var b = 0, c = a._deferreds.length; b < c; b++) e(a, a._deferreds[b]);
        a._deferreds = null;
    }
    function i(a, b, c) {
        (this.onFulfilled = "function" == typeof a ? a : null), (this.onRejected = "function" == typeof b ? b : null), (this.promise = c);
    }
    function j(a, b) {
        var c = !1;
        try {
            a(
                function (a) {
                    c || ((c = !0), f(b, a));
                },
                function (a) {
                    c || ((c = !0), g(b, a));
                }
            );
        } catch (d) {
            if (c) return;
            (c = !0), g(b, d);
        }
    }
    var k = setTimeout;
    (d.prototype["catch"] = function (a) {
        return this.then(null, a);
    }),
        (d.prototype.then = function (a, c) {
            var d = new this.constructor(b);
            return e(this, new i(a, c, d)), d;
        }),
        (d.all = function (a) {
            var b = Array.prototype.slice.call(a);
            return new d(function (a, c) {
                function d(f, g) {
                    try {
                        if (g && ("object" == ("undefined" == typeof g ? "undefined" : _typeof(g)) || "function" == typeof g)) {
                            var h = g.then;
                            if ("function" == typeof h)
                                return void h.call(
                                    g,
                                    function (a) {
                                        d(f, a);
                                    },
                                    c
                                );
                        }
                        (b[f] = g), 0 === --e && a(b);
                    } catch (i) {
                        c(i);
                    }
                }
                if (0 === b.length) return a([]);
                for (var e = b.length, f = 0; f < b.length; f++) d(f, b[f]);
            });
        }),
        (d.resolve = function (a) {
            return a && "object" == ("undefined" == typeof a ? "undefined" : _typeof(a)) && a.constructor === d
                ? a
                : new d(function (b) {
                      b(a);
                  });
        }),
        (d.reject = function (a) {
            return new d(function (b, c) {
                c(a);
            });
        }),
        (d.race = function (a) {
            return new d(function (b, c) {
                for (var d = 0, e = a.length; d < e; d++) a[d].then(b, c);
            });
        }),
        (d._immediateFn =
            ("function" == typeof setImmediate &&
                function (a) {
                    setImmediate(a);
                }) ||
            function (a) {
                k(a, 0);
            }),
        (d._unhandledRejectionFn = function (a) {
            "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", a);
        }),
        (d._setImmediateFn = function (a) {
            d._immediateFn = a;
        }),
        (d._setUnhandledRejectionFn = function (a) {
            d._unhandledRejectionFn = a;
        }),
        "undefined" != typeof module && module.exports ? (module.exports = d) : a.Promise || (a.Promise = d);
})(document),
    !(function (a, b) {
        "object" == ("undefined" == typeof module ? "undefined" : _typeof(module)) && "object" == _typeof(module.exports)
            ? (module.exports = a.document
                  ? b(a, !0)
                  : function (a) {
                        if (!a.document) throw new Error("jQuery requires a window with a document");
                        return b(a);
                    })
            : b(a);
    })("undefined" != typeof window ? window : void 0, function (a, b) {
        function c(a) {
            var b = !!a && "length" in a && a.length,
                c = oa.type(a);
            return "function" !== c && !oa.isWindow(a) && ("array" === c || 0 === b || ("number" == typeof b && b > 0 && b - 1 in a));
        }
        function d(a, b, c) {
            if (oa.isFunction(b))
                return oa.grep(a, function (a, d) {
                    return !!b.call(a, d, a) !== c;
                });
            if (b.nodeType)
                return oa.grep(a, function (a) {
                    return (a === b) !== c;
                });
            if ("string" == typeof b) {
                if (ya.test(b)) return oa.filter(b, a, c);
                b = oa.filter(b, a);
            }
            return oa.grep(a, function (a) {
                return oa.inArray(a, b) > -1 !== c;
            });
        }
        function e(a, b) {
            do a = a[b];
            while (a && 1 !== a.nodeType);
            return a;
        }
        function f(a) {
            var b = {};
            return (
                oa.each(a.match(Ea) || [], function (a, c) {
                    b[c] = !0;
                }),
                b
            );
        }
        function g() {
            ea.addEventListener ? (ea.removeEventListener("DOMContentLoaded", h), a.removeEventListener("load", h)) : (ea.detachEvent("onreadystatechange", h), a.detachEvent("onload", h));
        }
        function h() {
            (ea.addEventListener || "load" === a.event.type || "complete" === ea.readyState) && (g(), oa.ready());
        }
        function i(a, b, c) {
            if (void 0 === c && 1 === a.nodeType) {
                var d = "data-" + b.replace(Ja, "-$1").toLowerCase();
                if (((c = a.getAttribute(d)), "string" == typeof c)) {
                    try {
                        c = "true" === c || ("false" !== c && ("null" === c ? null : +c + "" === c ? +c : Ia.test(c) ? oa.parseJSON(c) : c));
                    } catch (e) {}
                    oa.data(a, b, c);
                } else c = void 0;
            }
            return c;
        }
        function j(a) {
            var b;
            for (b in a) if (("data" !== b || !oa.isEmptyObject(a[b])) && "toJSON" !== b) return !1;
            return !0;
        }
        function k(a, b, c, d) {
            if (Ha(a)) {
                var e,
                    f,
                    g = oa.expando,
                    h = a.nodeType,
                    i = h ? oa.cache : a,
                    j = h ? a[g] : a[g] && g;
                if ((j && i[j] && (d || i[j].data)) || void 0 !== c || "string" != typeof b)
                    return (
                        j || (j = h ? (a[g] = da.pop() || oa.guid++) : g),
                        i[j] || (i[j] = h ? {} : { toJSON: oa.noop }),
                        ("object" != ("undefined" == typeof b ? "undefined" : _typeof(b)) && "function" != typeof b) || (d ? (i[j] = oa.extend(i[j], b)) : (i[j].data = oa.extend(i[j].data, b))),
                        (f = i[j]),
                        d || (f.data || (f.data = {}), (f = f.data)),
                        void 0 !== c && (f[oa.camelCase(b)] = c),
                        "string" == typeof b ? ((e = f[b]), null == e && (e = f[oa.camelCase(b)])) : (e = f),
                        e
                    );
            }
        }
        function l(a, b, c) {
            if (Ha(a)) {
                var d,
                    e,
                    f = a.nodeType,
                    g = f ? oa.cache : a,
                    h = f ? a[oa.expando] : oa.expando;
                if (g[h]) {
                    if (b && (d = c ? g[h] : g[h].data)) {
                        oa.isArray(b) ? (b = b.concat(oa.map(b, oa.camelCase))) : b in d ? (b = [b]) : ((b = oa.camelCase(b)), (b = b in d ? [b] : b.split(" "))), (e = b.length);
                        for (; e--; ) delete d[b[e]];
                        if (c ? !j(d) : !oa.isEmptyObject(d)) return;
                    }
                    (c || (delete g[h].data, j(g[h]))) && (f ? oa.cleanData([a], !0) : ma.deleteExpando || g != g.window ? delete g[h] : (g[h] = void 0));
                }
            }
        }
        function m(a, b, c, d) {
            var e,
                f = 1,
                g = 20,
                h = d
                    ? function () {
                          return d.cur();
                      }
                    : function () {
                          return oa.css(a, b, "");
                      },
                i = h(),
                j = (c && c[3]) || (oa.cssNumber[b] ? "" : "px"),
                k = (oa.cssNumber[b] || ("px" !== j && +i)) && La.exec(oa.css(a, b));
            if (k && k[3] !== j) {
                (j = j || k[3]), (c = c || []), (k = +i || 1);
                do (f = f || ".5"), (k /= f), oa.style(a, b, k + j);
                while (f !== (f = h() / i) && 1 !== f && --g);
            }
            return c && ((k = +k || +i || 0), (e = c[1] ? k + (c[1] + 1) * c[2] : +c[2]), d && ((d.unit = j), (d.start = k), (d.end = e))), e;
        }
        function n(a) {
            var b = Sa.split("|"),
                c = a.createDocumentFragment();
            if (c.createElement) for (; b.length; ) c.createElement(b.pop());
            return c;
        }
        function o(a, b) {
            var c,
                d,
                e = 0,
                f = "undefined" != typeof a.getElementsByTagName ? a.getElementsByTagName(b || "*") : "undefined" != typeof a.querySelectorAll ? a.querySelectorAll(b || "*") : void 0;
            if (!f) for (f = [], c = a.childNodes || a; null != (d = c[e]); e++) !b || oa.nodeName(d, b) ? f.push(d) : oa.merge(f, o(d, b));
            return void 0 === b || (b && oa.nodeName(a, b)) ? oa.merge([a], f) : f;
        }
        function p(a, b) {
            for (var c, d = 0; null != (c = a[d]); d++) oa._data(c, "globalEval", !b || oa._data(b[d], "globalEval"));
        }
        function q(a) {
            Pa.test(a.type) && (a.defaultChecked = a.checked);
        }
        function r(a, b, c, d, e) {
            for (var f, g, h, i, j, k, l, m = a.length, r = n(b), s = [], t = 0; m > t; t++)
                if (((g = a[t]), g || 0 === g))
                    if ("object" === oa.type(g)) oa.merge(s, g.nodeType ? [g] : g);
                    else if (Ua.test(g)) {
                        for (i = i || r.appendChild(b.createElement("div")), j = ($.exec(g) || ["", ""])[1].toLowerCase(), l = Ta[j] || Ta._default, i.innerHTML = l[1] + oa.htmlPrefilter(g) + l[2], f = l[0]; f--; ) i = i.lastChild;
                        if ((!ma.leadingWhitespace && Ra.test(g) && s.push(b.createTextNode(Ra.exec(g)[0])), !ma.tbody))
                            for (g = "table" !== j || Va.test(g) ? ("<table>" !== l[1] || Va.test(g) ? 0 : i) : i.firstChild, f = g && g.childNodes.length; f--; )
                                oa.nodeName((k = g.childNodes[f]), "tbody") && !k.childNodes.length && g.removeChild(k);
                        for (oa.merge(s, i.childNodes), i.textContent = ""; i.firstChild; ) i.removeChild(i.firstChild);
                        i = r.lastChild;
                    } else s.push(b.createTextNode(g));
            for (i && r.removeChild(i), ma.appendChecked || oa.grep(o(s, "input"), q), t = 0; (g = s[t++]); )
                if (d && oa.inArray(g, d) > -1) e && e.push(g);
                else if (((h = oa.contains(g.ownerDocument, g)), (i = o(r.appendChild(g), "script")), h && p(i), c)) for (f = 0; (g = i[f++]); ) Qa.test(g.type || "") && c.push(g);
            return (i = null), r;
        }
        function s() {
            return !0;
        }
        function t() {
            return !1;
        }
        function u() {
            try {
                return ea.activeElement;
            } catch (a) {}
        }
        function v(a, b, c, d, e, f) {
            var g, h;
            if ("object" == ("undefined" == typeof b ? "undefined" : _typeof(b))) {
                "string" != typeof c && ((d = d || c), (c = void 0));
                for (h in b) v(a, h, c, d, b[h], f);
                return a;
            }
            if ((null == d && null == e ? ((e = c), (d = c = void 0)) : null == e && ("string" == typeof c ? ((e = d), (d = void 0)) : ((e = d), (d = c), (c = void 0))), e === !1)) e = t;
            else if (!e) return a;
            return (
                1 === f &&
                    ((g = e),
                    (e = function (a) {
                        return oa().off(a), g.apply(this, arguments);
                    }),
                    (e.guid = g.guid || (g.guid = oa.guid++))),
                a.each(function () {
                    oa.event.add(this, b, e, d, c);
                })
            );
        }
        function w(a, b) {
            return oa.nodeName(a, "table") && oa.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a;
        }
        function x(a) {
            return (a.type = (null !== oa.find.attr(a, "type")) + "/" + a.type), a;
        }
        function y(a) {
            var b = eb.exec(a.type);
            return b ? (a.type = b[1]) : a.removeAttribute("type"), a;
        }
        function z(a, b) {
            if (1 === b.nodeType && oa.hasData(a)) {
                var c,
                    d,
                    e,
                    f = oa._data(a),
                    g = oa._data(b, f),
                    h = f.events;
                if (h) {
                    delete g.handle, (g.events = {});
                    for (c in h) for (d = 0, e = h[c].length; e > d; d++) oa.event.add(b, c, h[c][d]);
                }
                g.data && (g.data = oa.extend({}, g.data));
            }
        }
        function A(a, b) {
            var c, d, e;
            if (1 === b.nodeType) {
                if (((c = b.nodeName.toLowerCase()), !ma.noCloneEvent && b[oa.expando])) {
                    e = oa._data(b);
                    for (d in e.events) oa.removeEvent(b, d, e.handle);
                    b.removeAttribute(oa.expando);
                }
                "script" === c && b.text !== a.text
                    ? ((x(b).text = a.text), y(b))
                    : "object" === c
                    ? (b.parentNode && (b.outerHTML = a.outerHTML), ma.html5Clone && a.innerHTML && !oa.trim(b.innerHTML) && (b.innerHTML = a.innerHTML))
                    : "input" === c && Pa.test(a.type)
                    ? ((b.defaultChecked = b.checked = a.checked), b.value !== a.value && (b.value = a.value))
                    : "option" === c
                    ? (b.defaultSelected = b.selected = a.defaultSelected)
                    : ("input" !== c && "textarea" !== c) || (b.defaultValue = a.defaultValue);
            }
        }
        function B(a, b, c, d) {
            b = ga.apply([], b);
            var e,
                f,
                g,
                h,
                i,
                j,
                k = 0,
                l = a.length,
                m = l - 1,
                n = b[0],
                p = oa.isFunction(n);
            if (p || (l > 1 && "string" == typeof n && !ma.checkClone && db.test(n)))
                return a.each(function (e) {
                    var f = a.eq(e);
                    p && (b[0] = n.call(this, e, f.html())), B(f, b, c, d);
                });
            if (l && ((j = r(b, a[0].ownerDocument, !1, a, d)), (e = j.firstChild), 1 === j.childNodes.length && (j = e), e || d)) {
                for (h = oa.map(o(j, "script"), x), g = h.length; l > k; k++) (f = j), k !== m && ((f = oa.clone(f, !0, !0)), g && oa.merge(h, o(f, "script"))), c.call(a[k], f, k);
                if (g)
                    for (i = h[h.length - 1].ownerDocument, oa.map(h, y), k = 0; g > k; k++)
                        (f = h[k]), Qa.test(f.type || "") && !oa._data(f, "globalEval") && oa.contains(i, f) && (f.src ? oa._evalUrl && oa._evalUrl(f.src) : oa.globalEval((f.text || f.textContent || f.innerHTML || "").replace(fb, "")));
                j = e = null;
            }
            return a;
        }
        function C(a, b, c) {
            for (var d, e = b ? oa.filter(b, a) : a, f = 0; null != (d = e[f]); f++) c || 1 !== d.nodeType || oa.cleanData(o(d)), d.parentNode && (c && oa.contains(d.ownerDocument, d) && p(o(d, "script")), d.parentNode.removeChild(d));
            return a;
        }
        function D(a, b) {
            var c = oa(b.createElement(a)).appendTo(b.body),
                d = oa.css(c[0], "display");
            return c.detach(), d;
        }
        function E(a) {
            var b = ea,
                c = jb[a];
            return (
                c ||
                    ((c = D(a, b)),
                    ("none" !== c && c) ||
                        ((ib = (ib || oa("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement)), (b = (ib[0].contentWindow || ib[0].contentDocument).document), b.write(), b.close(), (c = D(a, b)), ib.detach()),
                    (jb[a] = c)),
                c
            );
        }
        function F(a, b) {
            return {
                get: function () {
                    return a() ? void delete this.get : (this.get = b).apply(this, arguments);
                },
            };
        }
        function G(a) {
            if (a in yb) return a;
            for (var b = a.charAt(0).toUpperCase() + a.slice(1), c = xb.length; c--; ) if (((a = xb[c] + b), a in yb)) return a;
        }
        function H(a, b) {
            for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++)
                (d = a[g]),
                    d.style &&
                        ((f[g] = oa._data(d, "olddisplay")),
                        (c = d.style.display),
                        b
                            ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && Na(d) && (f[g] = oa._data(d, "olddisplay", E(d.nodeName))))
                            : ((e = Na(d)), ((c && "none" !== c) || !e) && oa._data(d, "olddisplay", e ? c : oa.css(d, "display"))));
            for (g = 0; h > g; g++) (d = a[g]), d.style && ((b && "none" !== d.style.display && "" !== d.style.display) || (d.style.display = b ? f[g] || "" : "none"));
            return a;
        }
        function I(a, b, c) {
            var d = ub.exec(b);
            return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b;
        }
        function J(a, b, c, d, e) {
            for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2)
                "margin" === c && (g += oa.css(a, c + Ma[f], !0, e)),
                    d
                        ? ("content" === c && (g -= oa.css(a, "padding" + Ma[f], !0, e)), "margin" !== c && (g -= oa.css(a, "border" + Ma[f] + "Width", !0, e)))
                        : ((g += oa.css(a, "padding" + Ma[f], !0, e)), "padding" !== c && (g += oa.css(a, "border" + Ma[f] + "Width", !0, e)));
            return g;
        }
        function K(b, c, d) {
            var e = !0,
                f = "width" === c ? b.offsetWidth : b.offsetHeight,
                g = ob(b),
                h = ma.boxSizing && "border-box" === oa.css(b, "boxSizing", !1, g);
            if ((ea.msFullscreenElement && a.top !== a && b.getClientRects().length && (f = Math.round(100 * b.getBoundingClientRect()[c])), 0 >= f || null == f)) {
                if (((f = pb(b, c, g)), (0 > f || null == f) && (f = b.style[c]), lb.test(f))) return f;
                (e = h && (ma.boxSizingReliable() || f === b.style[c])), (f = parseFloat(f) || 0);
            }
            return f + J(b, c, d || (h ? "border" : "content"), e, g) + "px";
        }
        function L(a, b, c, d, e) {
            return new L.prototype.init(a, b, c, d, e);
        }
        function M() {
            return (
                a.setTimeout(function () {
                    zb = void 0;
                }),
                (zb = oa.now())
            );
        }
        function N(a, b) {
            var c,
                d = { height: a },
                e = 0;
            for (b = b ? 1 : 0; 4 > e; e += 2 - b) (c = Ma[e]), (d["margin" + c] = d["padding" + c] = a);
            return b && (d.opacity = d.width = a), d;
        }
        function O(a, b, c) {
            for (var d, e = (R.tweeners[b] || []).concat(R.tweeners["*"]), f = 0, g = e.length; g > f; f++) if ((d = e[f].call(c, b, a))) return d;
        }
        function P(a, b, c) {
            var d,
                e,
                f,
                g,
                h,
                i,
                j,
                k,
                l = this,
                m = {},
                n = a.style,
                o = a.nodeType && Na(a),
                p = oa._data(a, "fxshow");
            c.queue ||
                ((h = oa._queueHooks(a, "fx")),
                null == h.unqueued &&
                    ((h.unqueued = 0),
                    (i = h.empty.fire),
                    (h.empty.fire = function () {
                        h.unqueued || i();
                    })),
                h.unqueued++,
                l.always(function () {
                    l.always(function () {
                        h.unqueued--, oa.queue(a, "fx").length || h.empty.fire();
                    });
                })),
                1 === a.nodeType &&
                    ("height" in b || "width" in b) &&
                    ((c.overflow = [n.overflow, n.overflowX, n.overflowY]),
                    (j = oa.css(a, "display")),
                    (k = "none" === j ? oa._data(a, "olddisplay") || E(a.nodeName) : j),
                    "inline" === k && "none" === oa.css(a, "float") && (ma.inlineBlockNeedsLayout && "inline" !== E(a.nodeName) ? (n.zoom = 1) : (n.display = "inline-block"))),
                c.overflow &&
                    ((n.overflow = "hidden"),
                    ma.shrinkWrapBlocks() ||
                        l.always(function () {
                            (n.overflow = c.overflow[0]), (n.overflowX = c.overflow[1]), (n.overflowY = c.overflow[2]);
                        }));
            for (d in b)
                if (((e = b[d]), Bb.exec(e))) {
                    if ((delete b[d], (f = f || "toggle" === e), e === (o ? "hide" : "show"))) {
                        if ("show" !== e || !p || void 0 === p[d]) continue;
                        o = !0;
                    }
                    m[d] = (p && p[d]) || oa.style(a, d);
                } else j = void 0;
            if (oa.isEmptyObject(m)) "inline" === ("none" === j ? E(a.nodeName) : j) && (n.display = j);
            else {
                p ? "hidden" in p && (o = p.hidden) : (p = oa._data(a, "fxshow", {})),
                    f && (p.hidden = !o),
                    o
                        ? oa(a).show()
                        : l.done(function () {
                              oa(a).hide();
                          }),
                    l.done(function () {
                        var b;
                        oa._removeData(a, "fxshow");
                        for (b in m) oa.style(a, b, m[b]);
                    });
                for (d in m) (g = O(o ? p[d] : 0, d, l)), d in p || ((p[d] = g.start), o && ((g.end = g.start), (g.start = "width" === d || "height" === d ? 1 : 0)));
            }
        }
        function Q(a, b) {
            var c, d, e, f, g;
            for (c in a)
                if (((d = oa.camelCase(c)), (e = b[d]), (f = a[c]), oa.isArray(f) && ((e = f[1]), (f = a[c] = f[0])), c !== d && ((a[d] = f), delete a[c]), (g = oa.cssHooks[d]), g && "expand" in g)) {
                    (f = g.expand(f)), delete a[d];
                    for (c in f) c in a || ((a[c] = f[c]), (b[c] = e));
                } else b[d] = e;
        }
        function R(a, b, c) {
            var d,
                e,
                f = 0,
                g = R.prefilters.length,
                h = oa.Deferred().always(function () {
                    delete i.elem;
                }),
                i = function l() {
                    if (e) return !1;
                    for (var b = zb || M(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, l = j.tweens.length; l > g; g++) j.tweens[g].run(f);
                    return h.notifyWith(a, [j, f, c]), 1 > f && l ? c : (h.resolveWith(a, [j]), !1);
                },
                j = h.promise({
                    elem: a,
                    props: oa.extend({}, b),
                    opts: oa.extend(!0, { specialEasing: {}, easing: oa.easing._default }, c),
                    originalProperties: b,
                    originalOptions: c,
                    startTime: zb || M(),
                    duration: c.duration,
                    tweens: [],
                    createTween: function (b, c) {
                        var d = oa.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                        return j.tweens.push(d), d;
                    },
                    stop: function (b) {
                        var c = 0,
                            d = b ? j.tweens.length : 0;
                        if (e) return this;
                        for (e = !0; d > c; c++) j.tweens[c].run(1);
                        return b ? (h.notifyWith(a, [j, 1, 0]), h.resolveWith(a, [j, b])) : h.rejectWith(a, [j, b]), this;
                    },
                }),
                k = j.props;
            for (Q(k, j.opts.specialEasing); g > f; f++) if ((d = R.prefilters[f].call(j, a, k, j.opts))) return oa.isFunction(d.stop) && (oa._queueHooks(j.elem, j.opts.queue).stop = oa.proxy(d.stop, d)), d;
            return (
                oa.map(k, O, j),
                oa.isFunction(j.opts.start) && j.opts.start.call(a, j),
                oa.fx.fpsTimer(oa.extend(i, { elem: a, anim: j, queue: j.opts.queue })),
                j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
            );
        }
        function S(a) {
            return oa.attr(a, "class") || "";
        }
        function T(a) {
            return function (b, c) {
                "string" != typeof b && ((c = b), (b = "*"));
                var d,
                    e = 0,
                    f = b.toLowerCase().match(Ea) || [];
                if (oa.isFunction(c)) for (; (d = f[e++]); ) "+" === d.charAt(0) ? ((d = d.slice(1) || "*"), (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c);
            };
        }
        function U(a, b, c, d) {
            function e(h) {
                var i;
                return (
                    (f[h] = !0),
                    oa.each(a[h] || [], function (a, h) {
                        var j = h(b, c, d);
                        return "string" != typeof j || g || f[j] ? (g ? !(i = j) : void 0) : (b.dataTypes.unshift(j), e(j), !1);
                    }),
                    i
                );
            }
            var f = {},
                g = a === $b;
            return e(b.dataTypes[0]) || (!f["*"] && e("*"));
        }
        function V(a, b) {
            var c,
                d,
                e = oa.ajaxSettings.flatOptions || {};
            for (d in b) void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
            return c && oa.extend(!0, a, c), a;
        }
        function W(a, b, c) {
            for (var d, e, f, g, h = a.contents, i = a.dataTypes; "*" === i[0]; ) i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
            if (e)
                for (g in h)
                    if (h[g] && h[g].test(e)) {
                        i.unshift(g);
                        break;
                    }
            if (i[0] in c) f = i[0];
            else {
                for (g in c) {
                    if (!i[0] || a.converters[g + " " + i[0]]) {
                        f = g;
                        break;
                    }
                    d || (d = g);
                }
                f = f || d;
            }
            return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0;
        }
        function X(a, b, c, d) {
            var e,
                f,
                g,
                h,
                i,
                j = {},
                k = a.dataTypes.slice();
            if (k[1]) for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
            for (f = k.shift(); f; )
                if ((a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), (i = f), (f = k.shift())))
                    if ("*" === f) f = i;
                    else if ("*" !== i && i !== f) {
                        if (((g = j[i + " " + f] || j["* " + f]), !g))
                            for (e in j)
                                if (((h = e.split(" ")), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]]))) {
                                    g === !0 ? (g = j[e]) : j[e] !== !0 && ((f = h[0]), k.unshift(h[1]));
                                    break;
                                }
                        if (g !== !0)
                            if (g && a["throws"]) b = g(b);
                            else
                                try {
                                    b = g(b);
                                } catch (l) {
                                    return { state: "parsererror", error: g ? l : "No conversion from " + i + " to " + f };
                                }
                    }
            return { state: "success", data: b };
        }
        function Y(a) {
            return (a.style && a.style.display) || oa.css(a, "display");
        }
        function Z(a) {
            for (; a && 1 === a.nodeType; ) {
                if ("none" === Y(a) || "hidden" === a.type) return !0;
                a = a.parentNode;
            }
            return !1;
        }
        function _(a, b, c, d) {
            var e;
            if (oa.isArray(b))
                oa.each(b, function (b, e) {
                    c || dc.test(a) ? d(a, e) : _(a + "[" + ("object" == ("undefined" == typeof e ? "undefined" : _typeof(e)) && null != e ? b : "") + "]", e, c, d);
                });
            else if (c || "object" !== oa.type(b)) d(a, b);
            else for (e in b) _(a + "[" + e + "]", b[e], c, d);
        }
        function aa() {
            try {
                return new a.XMLHttpRequest();
            } catch (b) {}
        }
        function ba() {
            try {
                return new a.ActiveXObject("Microsoft.XMLHTTP");
            } catch (b) {}
        }
        function ca(a) {
            return oa.isWindow(a) ? a : 9 === a.nodeType && (a.defaultView || a.parentWindow);
        }
        var da = [],
            ea = a.document,
            fa = da.slice,
            ga = da.concat,
            ha = da.push,
            ia = da.indexOf,
            ja = {},
            ka = ja.toString,
            la = ja.hasOwnProperty,
            ma = {},
            na = "1.12.2",
            oa = function pc(a, b) {
                return new pc.fn.init(a, b);
            },
            pa = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            qa = /^-ms-/,
            ra = /-([\da-z])/gi,
            sa = function (a, b) {
                return b.toUpperCase();
            };
        (oa.fn = oa.prototype = {
            jquery: na,
            constructor: oa,
            selector: "",
            length: 0,
            toArray: function () {
                return fa.call(this);
            },
            get: function (a) {
                return null != a ? (0 > a ? this[a + this.length] : this[a]) : fa.call(this);
            },
            pushStack: function (a) {
                var b = oa.merge(this.constructor(), a);
                return (b.prevObject = this), (b.context = this.context), b;
            },
            each: function (a) {
                return oa.each(this, a);
            },
            map: function (a) {
                return this.pushStack(
                    oa.map(this, function (b, c) {
                        return a.call(b, c, b);
                    })
                );
            },
            slice: function () {
                return this.pushStack(fa.apply(this, arguments));
            },
            first: function () {
                return this.eq(0);
            },
            last: function () {
                return this.eq(-1);
            },
            eq: function (a) {
                var b = this.length,
                    c = +a + (0 > a ? b : 0);
                return this.pushStack(c >= 0 && b > c ? [this[c]] : []);
            },
            end: function () {
                return this.prevObject || this.constructor();
            },
            push: ha,
            sort: da.sort,
            splice: da.splice,
        }),
            (oa.extend = oa.fn.extend = function () {
                var a,
                    b,
                    c,
                    d,
                    e,
                    f,
                    g = arguments[0] || {},
                    h = 1,
                    i = arguments.length,
                    j = !1;
                for ("boolean" == typeof g && ((j = g), (g = arguments[h] || {}), h++), "object" == ("undefined" == typeof g ? "undefined" : _typeof(g)) || oa.isFunction(g) || (g = {}), h === i && ((g = this), h--); i > h; h++)
                    if (null != (e = arguments[h]))
                        for (d in e)
                            (a = g[d]),
                                (c = e[d]),
                                g !== c &&
                                    (j && c && (oa.isPlainObject(c) || (b = oa.isArray(c)))
                                        ? (b ? ((b = !1), (f = a && oa.isArray(a) ? a : [])) : (f = a && oa.isPlainObject(a) ? a : {}), (g[d] = oa.extend(j, f, c)))
                                        : void 0 !== c && (g[d] = c));
                return g;
            }),
            oa.extend({
                expando: "jQuery" + (na + Math.random()).replace(/\D/g, ""),
                isReady: !0,
                error: function (a) {
                    throw new Error(a);
                },
                noop: function () {},
                isFunction: function (a) {
                    return "function" === oa.type(a);
                },
                isArray:
                    Array.isArray ||
                    function (a) {
                        return "array" === oa.type(a);
                    },
                isWindow: function (a) {
                    return null != a && a == a.window;
                },
                isNumeric: function (a) {
                    var b = a && a.toString();
                    return !oa.isArray(a) && b - parseFloat(b) + 1 >= 0;
                },
                isEmptyObject: function (a) {
                    var b;
                    for (b in a) return !1;
                    return !0;
                },
                isPlainObject: function (a) {
                    var b;
                    if (!a || "object" !== oa.type(a) || a.nodeType || oa.isWindow(a)) return !1;
                    try {
                        if (a.constructor && !la.call(a, "constructor") && !la.call(a.constructor.prototype, "isPrototypeOf")) return !1;
                    } catch (c) {
                        return !1;
                    }
                    if (!ma.ownFirst) for (b in a) return la.call(a, b);
                    for (b in a);
                    return void 0 === b || la.call(a, b);
                },
                type: function (a) {
                    return null == a ? a + "" : "object" == ("undefined" == typeof a ? "undefined" : _typeof(a)) || "function" == typeof a ? ja[ka.call(a)] || "object" : "undefined" == typeof a ? "undefined" : _typeof(a);
                },
                globalEval: function (b) {
                    b &&
                        oa.trim(b) &&
                        (
                            a.execScript ||
                            function (b) {
                                a.eval.call(a, b);
                            }
                        )(b);
                },
                camelCase: function (a) {
                    return a.replace(qa, "ms-").replace(ra, sa);
                },
                nodeName: function (a, b) {
                    return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase();
                },
                each: function (a, b) {
                    var d,
                        e = 0;
                    if (c(a)) for (d = a.length; d > e && b.call(a[e], e, a[e]) !== !1; e++);
                    else for (e in a) if (b.call(a[e], e, a[e]) === !1) break;
                    return a;
                },
                trim: function (a) {
                    return null == a ? "" : (a + "").replace(pa, "");
                },
                makeArray: function (a, b) {
                    var d = b || [];
                    return null != a && (c(Object(a)) ? oa.merge(d, "string" == typeof a ? [a] : a) : ha.call(d, a)), d;
                },
                inArray: function (a, b, c) {
                    var d;
                    if (b) {
                        if (ia) return ia.call(b, a, c);
                        for (d = b.length, c = c ? (0 > c ? Math.max(0, d + c) : c) : 0; d > c; c++) if (c in b && b[c] === a) return c;
                    }
                    return -1;
                },
                merge: function (a, b) {
                    for (var c = +b.length, d = 0, e = a.length; c > d; ) a[e++] = b[d++];
                    if (c !== c) for (; void 0 !== b[d]; ) a[e++] = b[d++];
                    return (a.length = e), a;
                },
                grep: function (a, b, c) {
                    for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) (d = !b(a[f], f)), d !== h && e.push(a[f]);
                    return e;
                },
                map: function (a, b, d) {
                    var e,
                        f,
                        g = 0,
                        h = [];
                    if (c(a)) for (e = a.length; e > g; g++) (f = b(a[g], g, d)), null != f && h.push(f);
                    else for (g in a) (f = b(a[g], g, d)), null != f && h.push(f);
                    return ga.apply([], h);
                },
                guid: 1,
                proxy: function (a, b) {
                    var c, d, e;
                    return (
                        "string" == typeof b && ((e = a[b]), (b = a), (a = e)),
                        oa.isFunction(a)
                            ? ((c = fa.call(arguments, 2)),
                              (d = function () {
                                  return a.apply(b || this, c.concat(fa.call(arguments)));
                              }),
                              (d.guid = a.guid = a.guid || oa.guid++),
                              d)
                            : void 0
                    );
                },
                now: function () {
                    return +new Date();
                },
                support: ma,
            }),
            "function" == typeof Symbol && (oa.fn[Symbol.iterator] = da[Symbol.iterator]),
            oa.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (a, b) {
                ja["[object " + b + "]"] = b.toLowerCase();
            });
        var ta = (function (a) {
            function b(a, b, c, d) {
                var e,
                    f,
                    g,
                    h,
                    i,
                    j,
                    l,
                    n,
                    o = b && b.ownerDocument,
                    p = b ? b.nodeType : 9;
                if (((c = c || []), "string" != typeof a || !a || (1 !== p && 9 !== p && 11 !== p))) return c;
                if (!d && ((b ? b.ownerDocument || b : O) !== G && F(b), (b = b || G), I)) {
                    if (11 !== p && (j = $.exec(a)))
                        if ((e = j[1])) {
                            if (9 === p) {
                                if (!(g = b.getElementById(e))) return c;
                                if (g.id === e) return c.push(g), c;
                            } else if (o && (g = o.getElementById(e)) && M(b, g) && g.id === e) return c.push(g), c;
                        } else {
                            if (j[2]) return _.apply(c, b.getElementsByTagName(a)), c;
                            if ((e = j[3]) && v.getElementsByClassName && b.getElementsByClassName) return _.apply(c, b.getElementsByClassName(e)), c;
                        }
                    if (v.qsa && !T[a + " "] && (!J || !J.test(a))) {
                        if (1 !== p) (o = b), (n = a);
                        else if ("object" !== b.nodeName.toLowerCase()) {
                            for ((h = b.getAttribute("id")) ? (h = h.replace(ta, "\\$&")) : b.setAttribute("id", (h = N)), l = z(a), f = l.length, i = na.test(h) ? "#" + h : "[id='" + h + "']"; f--; ) l[f] = i + " " + m(l[f]);
                            (n = l.join(",")), (o = (sa.test(a) && k(b.parentNode)) || b);
                        }
                        if (n)
                            try {
                                return _.apply(c, o.querySelectorAll(n)), c;
                            } catch (q) {
                            } finally {
                                h === N && b.removeAttribute("id");
                            }
                    }
                }
                return B(a.replace(ia, "$1"), b, c, d);
            }
            function c() {
                function a(c, d) {
                    return b.push(c + " ") > w.cacheLength && delete a[b.shift()], (a[c + " "] = d);
                }
                var b = [];
                return a;
            }
            function d(a) {
                return (a[N] = !0), a;
            }
            function e(a) {
                var b = G.createElement("div");
                try {
                    return !!a(b);
                } catch (c) {
                    return !1;
                } finally {
                    b.parentNode && b.parentNode.removeChild(b), (b = null);
                }
            }
            function f(a, b) {
                for (var c = a.split("|"), d = c.length; d--; ) w.attrHandle[c[d]] = b;
            }
            function g(a, b) {
                var c = b && a,
                    d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || V) - (~a.sourceIndex || V);
                if (d) return d;
                if (c) for (; (c = c.nextSibling); ) if (c === b) return -1;
                return a ? 1 : -1;
            }
            function h(a) {
                return function (b) {
                    var c = b.nodeName.toLowerCase();
                    return "input" === c && b.type === a;
                };
            }
            function i(a) {
                return function (b) {
                    var c = b.nodeName.toLowerCase();
                    return ("input" === c || "button" === c) && b.type === a;
                };
            }
            function j(a) {
                return d(function (b) {
                    return (
                        (b = +b),
                        d(function (c, d) {
                            for (var e, f = a([], c.length, b), g = f.length; g--; ) c[(e = f[g])] && (c[e] = !(d[e] = c[e]));
                        })
                    );
                });
            }
            function k(a) {
                return a && "undefined" != typeof a.getElementsByTagName && a;
            }
            function l() {}
            function m(a) {
                for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value;
                return d;
            }
            function n(a, b, c) {
                var d = b.dir,
                    e = c && "parentNode" === d,
                    f = Q++;
                return b.first
                    ? function (b, c, f) {
                          for (; (b = b[d]); ) if (1 === b.nodeType || e) return a(b, c, f);
                      }
                    : function (b, c, g) {
                          var h,
                              i,
                              j,
                              k = [P, f];
                          if (g) {
                              for (; (b = b[d]); ) if ((1 === b.nodeType || e) && a(b, c, g)) return !0;
                          } else
                              for (; (b = b[d]); )
                                  if (1 === b.nodeType || e) {
                                      if (((j = b[N] || (b[N] = {})), (i = j[b.uniqueID] || (j[b.uniqueID] = {})), (h = i[d]) && h[0] === P && h[1] === f)) return (k[2] = h[2]);
                                      if (((i[d] = k), (k[2] = a(b, c, g)))) return !0;
                                  }
                      };
            }
            function o(a) {
                return a.length > 1
                    ? function (b, c, d) {
                          for (var e = a.length; e--; ) if (!a[e](b, c, d)) return !1;
                          return !0;
                      }
                    : a[0];
            }
            function p(a, c, d) {
                for (var e = 0, f = c.length; f > e; e++) b(a, c[e], d);
                return d;
            }
            function q(a, b, c, d, e) {
                for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++) (f = a[h]) && ((c && !c(f, d, e)) || (g.push(f), j && b.push(h)));
                return g;
            }
            function r(a, b, c, e, f, g) {
                return (
                    e && !e[N] && (e = r(e)),
                    f && !f[N] && (f = r(f, g)),
                    d(function (d, g, h, i) {
                        var j,
                            k,
                            l,
                            m = [],
                            n = [],
                            o = g.length,
                            r = d || p(b || "*", h.nodeType ? [h] : h, []),
                            s = !a || (!d && b) ? r : q(r, m, a, h, i),
                            t = c ? (f || (d ? a : o || e) ? [] : g) : s;
                        if ((c && c(s, t, h, i), e)) for (j = q(t, n), e(j, [], h, i), k = j.length; k--; ) (l = j[k]) && (t[n[k]] = !(s[n[k]] = l));
                        if (d) {
                            if (f || a) {
                                if (f) {
                                    for (j = [], k = t.length; k--; ) (l = t[k]) && j.push((s[k] = l));
                                    f(null, (t = []), j, i);
                                }
                                for (k = t.length; k--; ) (l = t[k]) && (j = f ? ba(d, l) : m[k]) > -1 && (d[j] = !(g[j] = l));
                            }
                        } else (t = q(t === g ? t.splice(o, t.length) : t)), f ? f(null, g, t, i) : _.apply(g, t);
                    })
                );
            }
            function s(a) {
                for (
                    var b,
                        c,
                        d,
                        e = a.length,
                        f = w.relative[a[0].type],
                        g = f || w.relative[" "],
                        h = f ? 1 : 0,
                        i = n(
                            function (a) {
                                return a === b;
                            },
                            g,
                            !0
                        ),
                        j = n(
                            function (a) {
                                return ba(b, a) > -1;
                            },
                            g,
                            !0
                        ),
                        k = [
                            function (a, c, d) {
                                var e = (!f && (d || c !== C)) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d));
                                return (b = null), e;
                            },
                        ];
                    e > h;
                    h++
                )
                    if ((c = w.relative[a[h].type])) k = [n(o(k), c)];
                    else {
                        if (((c = w.filter[a[h].type].apply(null, a[h].matches)), c[N])) {
                            for (d = ++h; e > d && !w.relative[a[d].type]; d++);
                            return r(h > 1 && o(k), h > 1 && m(a.slice(0, h - 1).concat({ value: " " === a[h - 2].type ? "*" : "" })).replace(ia, "$1"), c, d > h && s(a.slice(h, d)), e > d && s((a = a.slice(d))), e > d && m(a));
                        }
                        k.push(c);
                    }
                return o(k);
            }
            function t(a, c) {
                var e = c.length > 0,
                    f = a.length > 0,
                    g = function (d, g, h, i, j) {
                        var k,
                            l,
                            m,
                            n = 0,
                            o = "0",
                            p = d && [],
                            r = [],
                            s = C,
                            t = d || (f && w.find.TAG("*", j)),
                            u = (P += null == s ? 1 : Math.random() || 0.1),
                            v = t.length;
                        for (j && (C = g === G || g || j); o !== v && null != (k = t[o]); o++) {
                            if (f && k) {
                                for (l = 0, g || k.ownerDocument === G || (F(k), (h = !I)); (m = a[l++]); )
                                    if (m(k, g || G, h)) {
                                        i.push(k);
                                        break;
                                    }
                                j && (P = u);
                            }
                            e && ((k = !m && k) && n--, d && p.push(k));
                        }
                        if (((n += o), e && o !== n)) {
                            for (l = 0; (m = c[l++]); ) m(p, r, g, h);
                            if (d) {
                                if (n > 0) for (; o--; ) p[o] || r[o] || (r[o] = Y.call(i));
                                r = q(r);
                            }
                            _.apply(i, r), j && !d && r.length > 0 && n + c.length > 1 && b.uniqueSort(i);
                        }
                        return j && ((P = u), (C = s)), p;
                    };
                return e ? d(g) : g;
            }
            var u,
                v,
                w,
                x,
                y,
                z,
                A,
                B,
                C,
                D,
                E,
                F,
                G,
                H,
                I,
                J,
                K,
                L,
                M,
                N = "sizzle" + 1 * new Date(),
                O = a.document,
                P = 0,
                Q = 0,
                R = c(),
                S = c(),
                T = c(),
                U = function (a, b) {
                    return a === b && (E = !0), 0;
                },
                V = 1 << 31,
                W = {}.hasOwnProperty,
                X = [],
                Y = X.pop,
                Z = X.push,
                _ = X.push,
                aa = X.slice,
                ba = function (a, b) {
                    for (var c = 0, d = a.length; d > c; c++) if (a[c] === b) return c;
                    return -1;
                },
                ca = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                da = "[\\x20\\t\\r\\n\\f]",
                ea = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                fa = "\\[" + da + "*(" + ea + ")(?:" + da + "*([*^$|!~]?=)" + da + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ea + "))|)" + da + "*\\]",
                ga = ":(" + ea + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + fa + ")*)|.*)\\)|)",
                ha = new RegExp(da + "+", "g"),
                ia = new RegExp("^" + da + "+|((?:^|[^\\\\])(?:\\\\.)*)" + da + "+$", "g"),
                ja = new RegExp("^" + da + "*," + da + "*"),
                ka = new RegExp("^" + da + "*([>+~]|" + da + ")" + da + "*"),
                la = new RegExp("=" + da + "*([^\\]'\"]*?)" + da + "*\\]", "g"),
                ma = new RegExp(ga),
                na = new RegExp("^" + ea + "$"),
                oa = {
                    ID: new RegExp("^#(" + ea + ")"),
                    CLASS: new RegExp("^\\.(" + ea + ")"),
                    TAG: new RegExp("^(" + ea + "|[*])"),
                    ATTR: new RegExp("^" + fa),
                    PSEUDO: new RegExp("^" + ga),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + da + "*(even|odd|(([+-]|)(\\d*)n|)" + da + "*(?:([+-]|)" + da + "*(\\d+)|))" + da + "*\\)|)", "i"),
                    bool: new RegExp("^(?:" + ca + ")$", "i"),
                    needsContext: new RegExp("^" + da + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + da + "*((?:-\\d)?\\d*)" + da + "*\\)|)(?=[^-]|$)", "i"),
                },
                pa = /^(?:input|select|textarea|button)$/i,
                qa = /^h\d$/i,
                ra = /^[^{]+\{\s*\[native \w/,
                $ = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                sa = /[+~]/,
                ta = /'|\\/g,
                ua = new RegExp("\\\\([\\da-f]{1,6}" + da + "?|(" + da + ")|.)", "ig"),
                va = function (a, b, c) {
                    var d = "0x" + b - 65536;
                    return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode((d >> 10) | 55296, (1023 & d) | 56320);
                },
                wa = function () {
                    F();
                };
            try {
                _.apply((X = aa.call(O.childNodes)), O.childNodes), X[O.childNodes.length].nodeType;
            } catch (xa) {
                _ = {
                    apply: X.length
                        ? function (a, b) {
                              Z.apply(a, aa.call(b));
                          }
                        : function (a, b) {
                              for (var c = a.length, d = 0; (a[c++] = b[d++]); );
                              a.length = c - 1;
                          },
                };
            }
            (v = b.support = {}),
                (y = b.isXML = function (a) {
                    var b = a && (a.ownerDocument || a).documentElement;
                    return !!b && "HTML" !== b.nodeName;
                }),
                (F = b.setDocument = function (a) {
                    var b,
                        c,
                        d = a ? a.ownerDocument || a : O;
                    return d !== G && 9 === d.nodeType && d.documentElement
                        ? ((G = d),
                          (H = G.documentElement),
                          (I = !y(G)),
                          (c = G.defaultView) && c.top !== c && (c.addEventListener ? c.addEventListener("unload", wa, !1) : c.attachEvent && c.attachEvent("onunload", wa)),
                          (v.attributes = e(function (a) {
                              return (a.className = "i"), !a.getAttribute("className");
                          })),
                          (v.getElementsByTagName = e(function (a) {
                              return a.appendChild(G.createComment("")), !a.getElementsByTagName("*").length;
                          })),
                          (v.getElementsByClassName = ra.test(G.getElementsByClassName)),
                          (v.getById = e(function (a) {
                              return (H.appendChild(a).id = N), !G.getElementsByName || !G.getElementsByName(N).length;
                          })),
                          v.getById
                              ? ((w.find.ID = function (a, b) {
                                    if ("undefined" != typeof b.getElementById && I) {
                                        var c = b.getElementById(a);
                                        return c ? [c] : [];
                                    }
                                }),
                                (w.filter.ID = function (a) {
                                    var b = a.replace(ua, va);
                                    return function (a) {
                                        return a.getAttribute("id") === b;
                                    };
                                }))
                              : (delete w.find.ID,
                                (w.filter.ID = function (a) {
                                    var b = a.replace(ua, va);
                                    return function (a) {
                                        var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                                        return c && c.value === b;
                                    };
                                })),
                          (w.find.TAG = v.getElementsByTagName
                              ? function (a, b) {
                                    return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : v.qsa ? b.querySelectorAll(a) : void 0;
                                }
                              : function (a, b) {
                                    var c,
                                        d = [],
                                        e = 0,
                                        f = b.getElementsByTagName(a);
                                    if ("*" === a) {
                                        for (; (c = f[e++]); ) 1 === c.nodeType && d.push(c);
                                        return d;
                                    }
                                    return f;
                                }),
                          (w.find.CLASS =
                              v.getElementsByClassName &&
                              function (a, b) {
                                  return "undefined" != typeof b.getElementsByClassName && I ? b.getElementsByClassName(a) : void 0;
                              }),
                          (K = []),
                          (J = []),
                          (v.qsa = ra.test(G.querySelectorAll)) &&
                              (e(function (a) {
                                  (H.appendChild(a).innerHTML = "<a id='" + N + "'></a><select id='" + N + "-\r\\' msallowcapture=''><option selected=''></option></select>"),
                                      a.querySelectorAll("[msallowcapture^='']").length && J.push("[*^$]=" + da + "*(?:''|\"\")"),
                                      a.querySelectorAll("[selected]").length || J.push("\\[" + da + "*(?:value|" + ca + ")"),
                                      a.querySelectorAll("[id~=" + N + "-]").length || J.push("~="),
                                      a.querySelectorAll(":checked").length || J.push(":checked"),
                                      a.querySelectorAll("a#" + N + "+*").length || J.push(".#.+[+~]");
                              }),
                              e(function (a) {
                                  var b = G.createElement("input");
                                  b.setAttribute("type", "hidden"),
                                      a.appendChild(b).setAttribute("name", "D"),
                                      a.querySelectorAll("[name=d]").length && J.push("name" + da + "*[*^$|!~]?="),
                                      a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"),
                                      a.querySelectorAll("*,:x"),
                                      J.push(",.*:");
                              })),
                          (v.matchesSelector = ra.test((L = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector))) &&
                              e(function (a) {
                                  (v.disconnectedMatch = L.call(a, "div")), L.call(a, "[s!='']:x"), K.push("!=", ga);
                              }),
                          (J = J.length && new RegExp(J.join("|"))),
                          (K = K.length && new RegExp(K.join("|"))),
                          (b = ra.test(H.compareDocumentPosition)),
                          (M =
                              b || ra.test(H.contains)
                                  ? function (a, b) {
                                        var c = 9 === a.nodeType ? a.documentElement : a,
                                            d = b && b.parentNode;
                                        return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)));
                                    }
                                  : function (a, b) {
                                        if (b) for (; (b = b.parentNode); ) if (b === a) return !0;
                                        return !1;
                                    }),
                          (U = b
                              ? function (a, b) {
                                    if (a === b) return (E = !0), 0;
                                    var c = !a.compareDocumentPosition - !b.compareDocumentPosition;
                                    return c
                                        ? c
                                        : ((c = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1),
                                          1 & c || (!v.sortDetached && b.compareDocumentPosition(a) === c)
                                              ? a === G || (a.ownerDocument === O && M(O, a))
                                                  ? -1
                                                  : b === G || (b.ownerDocument === O && M(O, b))
                                                  ? 1
                                                  : D
                                                  ? ba(D, a) - ba(D, b)
                                                  : 0
                                              : 4 & c
                                              ? -1
                                              : 1);
                                }
                              : function (a, b) {
                                    if (a === b) return (E = !0), 0;
                                    var c,
                                        d = 0,
                                        e = a.parentNode,
                                        f = b.parentNode,
                                        h = [a],
                                        i = [b];
                                    if (!e || !f) return a === G ? -1 : b === G ? 1 : e ? -1 : f ? 1 : D ? ba(D, a) - ba(D, b) : 0;
                                    if (e === f) return g(a, b);
                                    for (c = a; (c = c.parentNode); ) h.unshift(c);
                                    for (c = b; (c = c.parentNode); ) i.unshift(c);
                                    for (; h[d] === i[d]; ) d++;
                                    return d ? g(h[d], i[d]) : h[d] === O ? -1 : i[d] === O ? 1 : 0;
                                }),
                          G)
                        : G;
                }),
                (b.matches = function (a, c) {
                    return b(a, null, null, c);
                }),
                (b.matchesSelector = function (a, c) {
                    if (((a.ownerDocument || a) !== G && F(a), (c = c.replace(la, "='$1']")), v.matchesSelector && I && !T[c + " "] && (!K || !K.test(c)) && (!J || !J.test(c))))
                        try {
                            var d = L.call(a, c);
                            if (d || v.disconnectedMatch || (a.document && 11 !== a.document.nodeType)) return d;
                        } catch (e) {}
                    return b(c, G, null, [a]).length > 0;
                }),
                (b.contains = function (a, b) {
                    return (a.ownerDocument || a) !== G && F(a), M(a, b);
                }),
                (b.attr = function (a, b) {
                    (a.ownerDocument || a) !== G && F(a);
                    var c = w.attrHandle[b.toLowerCase()],
                        d = c && W.call(w.attrHandle, b.toLowerCase()) ? c(a, b, !I) : void 0;
                    return void 0 !== d ? d : v.attributes || !I ? a.getAttribute(b) : (d = a.getAttributeNode(b)) && d.specified ? d.value : null;
                }),
                (b.error = function (a) {
                    throw new Error("Syntax error, unrecognized expression: " + a);
                }),
                (b.uniqueSort = function (a) {
                    var b,
                        c = [],
                        d = 0,
                        e = 0;
                    if (((E = !v.detectDuplicates), (D = !v.sortStable && a.slice(0)), a.sort(U), E)) {
                        for (; (b = a[e++]); ) b === a[e] && (d = c.push(e));
                        for (; d--; ) a.splice(c[d], 1);
                    }
                    return (D = null), a;
                }),
                (x = b.getText = function (a) {
                    var b,
                        c = "",
                        d = 0,
                        e = a.nodeType;
                    if (e) {
                        if (1 === e || 9 === e || 11 === e) {
                            if ("string" == typeof a.textContent) return a.textContent;
                            for (a = a.firstChild; a; a = a.nextSibling) c += x(a);
                        } else if (3 === e || 4 === e) return a.nodeValue;
                    } else for (; (b = a[d++]); ) c += x(b);
                    return c;
                }),
                (w = b.selectors = {
                    cacheLength: 50,
                    createPseudo: d,
                    match: oa,
                    attrHandle: {},
                    find: {},
                    relative: { ">": { dir: "parentNode", first: !0 }, " ": { dir: "parentNode" }, "+": { dir: "previousSibling", first: !0 }, "~": { dir: "previousSibling" } },
                    preFilter: {
                        ATTR: function (a) {
                            return (a[1] = a[1].replace(ua, va)), (a[3] = (a[3] || a[4] || a[5] || "").replace(ua, va)), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4);
                        },
                        CHILD: function (a) {
                            return (
                                (a[1] = a[1].toLowerCase()),
                                "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]), (a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3]))), (a[5] = +(a[7] + a[8] || "odd" === a[3]))) : a[3] && b.error(a[0]),
                                a
                            );
                        },
                        PSEUDO: function (a) {
                            var b,
                                c = !a[6] && a[2];
                            return oa.CHILD.test(a[0])
                                ? null
                                : (a[3] ? (a[2] = a[4] || a[5] || "") : c && ma.test(c) && (b = z(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && ((a[0] = a[0].slice(0, b)), (a[2] = c.slice(0, b))), a.slice(0, 3));
                        },
                    },
                    filter: {
                        TAG: function (a) {
                            var b = a.replace(ua, va).toLowerCase();
                            return "*" === a
                                ? function () {
                                      return !0;
                                  }
                                : function (a) {
                                      return a.nodeName && a.nodeName.toLowerCase() === b;
                                  };
                        },
                        CLASS: function (a) {
                            var b = R[a + " "];
                            return (
                                b ||
                                ((b = new RegExp("(^|" + da + ")" + a + "(" + da + "|$)")) &&
                                    R(a, function (a) {
                                        return b.test(("string" == typeof a.className && a.className) || ("undefined" != typeof a.getAttribute && a.getAttribute("class")) || "");
                                    }))
                            );
                        },
                        ATTR: function (a, c, d) {
                            return function (e) {
                                var f = b.attr(e, a);
                                return null == f
                                    ? "!=" === c
                                    : !c ||
                                          ((f += ""),
                                          "=" === c
                                              ? f === d
                                              : "!=" === c
                                              ? f !== d
                                              : "^=" === c
                                              ? d && 0 === f.indexOf(d)
                                              : "*=" === c
                                              ? d && f.indexOf(d) > -1
                                              : "$=" === c
                                              ? d && f.slice(-d.length) === d
                                              : "~=" === c
                                              ? (" " + f.replace(ha, " ") + " ").indexOf(d) > -1
                                              : "|=" === c && (f === d || f.slice(0, d.length + 1) === d + "-"));
                            };
                        },
                        CHILD: function (a, b, c, d, e) {
                            var f = "nth" !== a.slice(0, 3),
                                g = "last" !== a.slice(-4),
                                h = "of-type" === b;
                            return 1 === d && 0 === e
                                ? function (a) {
                                      return !!a.parentNode;
                                  }
                                : function (b, c, i) {
                                      var j,
                                          k,
                                          l,
                                          m,
                                          n,
                                          o,
                                          p = f !== g ? "nextSibling" : "previousSibling",
                                          q = b.parentNode,
                                          r = h && b.nodeName.toLowerCase(),
                                          s = !i && !h,
                                          t = !1;
                                      if (q) {
                                          if (f) {
                                              for (; p; ) {
                                                  for (m = b; (m = m[p]); ) if (h ? m.nodeName.toLowerCase() === r : 1 === m.nodeType) return !1;
                                                  o = p = "only" === a && !o && "nextSibling";
                                              }
                                              return !0;
                                          }
                                          if (((o = [g ? q.firstChild : q.lastChild]), g && s)) {
                                              for (
                                                  m = q, l = m[N] || (m[N] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), j = k[a] || [], n = j[0] === P && j[1], t = n && j[2], m = n && q.childNodes[n];
                                                  (m = (++n && m && m[p]) || (t = n = 0) || o.pop());

                                              )
                                                  if (1 === m.nodeType && ++t && m === b) {
                                                      k[a] = [P, n, t];
                                                      break;
                                                  }
                                          } else if ((s && ((m = b), (l = m[N] || (m[N] = {})), (k = l[m.uniqueID] || (l[m.uniqueID] = {})), (j = k[a] || []), (n = j[0] === P && j[1]), (t = n)), t === !1))
                                              for (
                                                  ;
                                                  (m = (++n && m && m[p]) || (t = n = 0) || o.pop()) &&
                                                  ((h ? m.nodeName.toLowerCase() !== r : 1 !== m.nodeType) || !++t || (s && ((l = m[N] || (m[N] = {})), (k = l[m.uniqueID] || (l[m.uniqueID] = {})), (k[a] = [P, t])), m !== b));

                                              );
                                          return (t -= e), t === d || (t % d === 0 && t / d >= 0);
                                      }
                                  };
                        },
                        PSEUDO: function (a, c) {
                            var e,
                                f = w.pseudos[a] || w.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
                            return f[N]
                                ? f(c)
                                : f.length > 1
                                ? ((e = [a, a, "", c]),
                                  w.setFilters.hasOwnProperty(a.toLowerCase())
                                      ? d(function (a, b) {
                                            for (var d, e = f(a, c), g = e.length; g--; ) (d = ba(a, e[g])), (a[d] = !(b[d] = e[g]));
                                        })
                                      : function (a) {
                                            return f(a, 0, e);
                                        })
                                : f;
                        },
                    },
                    pseudos: {
                        not: d(function (a) {
                            var b = [],
                                c = [],
                                e = A(a.replace(ia, "$1"));
                            return e[N]
                                ? d(function (a, b, c, d) {
                                      for (var f, g = e(a, null, d, []), h = a.length; h--; ) (f = g[h]) && (a[h] = !(b[h] = f));
                                  })
                                : function (a, d, f) {
                                      return (b[0] = a), e(b, null, f, c), (b[0] = null), !c.pop();
                                  };
                        }),
                        has: d(function (a) {
                            return function (c) {
                                return b(a, c).length > 0;
                            };
                        }),
                        contains: d(function (a) {
                            return (
                                (a = a.replace(ua, va)),
                                function (b) {
                                    return (b.textContent || b.innerText || x(b)).indexOf(a) > -1;
                                }
                            );
                        }),
                        lang: d(function (a) {
                            return (
                                na.test(a || "") || b.error("unsupported lang: " + a),
                                (a = a.replace(ua, va).toLowerCase()),
                                function (b) {
                                    var c;
                                    do if ((c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))) return (c = c.toLowerCase()), c === a || 0 === c.indexOf(a + "-");
                                    while ((b = b.parentNode) && 1 === b.nodeType);
                                    return !1;
                                }
                            );
                        }),
                        target: function (b) {
                            var c = a.location && a.location.hash;
                            return c && c.slice(1) === b.id;
                        },
                        root: function (a) {
                            return a === H;
                        },
                        focus: function (a) {
                            return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex);
                        },
                        enabled: function (a) {
                            return a.disabled === !1;
                        },
                        disabled: function (a) {
                            return a.disabled === !0;
                        },
                        checked: function (a) {
                            var b = a.nodeName.toLowerCase();
                            return ("input" === b && !!a.checked) || ("option" === b && !!a.selected);
                        },
                        selected: function (a) {
                            return a.parentNode && a.parentNode.selectedIndex, a.selected === !0;
                        },
                        empty: function (a) {
                            for (a = a.firstChild; a; a = a.nextSibling) if (a.nodeType < 6) return !1;
                            return !0;
                        },
                        parent: function (a) {
                            return !w.pseudos.empty(a);
                        },
                        header: function (a) {
                            return qa.test(a.nodeName);
                        },
                        input: function (a) {
                            return pa.test(a.nodeName);
                        },
                        button: function (a) {
                            var b = a.nodeName.toLowerCase();
                            return ("input" === b && "button" === a.type) || "button" === b;
                        },
                        text: function (a) {
                            var b;
                            return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase());
                        },
                        first: j(function () {
                            return [0];
                        }),
                        last: j(function (a, b) {
                            return [b - 1];
                        }),
                        eq: j(function (a, b, c) {
                            return [0 > c ? c + b : c];
                        }),
                        even: j(function (a, b) {
                            for (var c = 0; b > c; c += 2) a.push(c);
                            return a;
                        }),
                        odd: j(function (a, b) {
                            for (var c = 1; b > c; c += 2) a.push(c);
                            return a;
                        }),
                        lt: j(function (a, b, c) {
                            for (var d = 0 > c ? c + b : c; --d >= 0; ) a.push(d);
                            return a;
                        }),
                        gt: j(function (a, b, c) {
                            for (var d = 0 > c ? c + b : c; ++d < b; ) a.push(d);
                            return a;
                        }),
                    },
                }),
                (w.pseudos.nth = w.pseudos.eq);
            for (u in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }) w.pseudos[u] = h(u);
            for (u in { submit: !0, reset: !0 }) w.pseudos[u] = i(u);
            return (
                (l.prototype = w.filters = w.pseudos),
                (w.setFilters = new l()),
                (z = b.tokenize = function (a, c) {
                    var d,
                        e,
                        f,
                        g,
                        h,
                        i,
                        j,
                        k = S[a + " "];
                    if (k) return c ? 0 : k.slice(0);
                    for (h = a, i = [], j = w.preFilter; h; ) {
                        (d && !(e = ja.exec(h))) || (e && (h = h.slice(e[0].length) || h), i.push((f = []))), (d = !1), (e = ka.exec(h)) && ((d = e.shift()), f.push({ value: d, type: e[0].replace(ia, " ") }), (h = h.slice(d.length)));
                        for (g in w.filter) !(e = oa[g].exec(h)) || (j[g] && !(e = j[g](e))) || ((d = e.shift()), f.push({ value: d, type: g, matches: e }), (h = h.slice(d.length)));
                        if (!d) break;
                    }
                    return c ? h.length : h ? b.error(a) : S(a, i).slice(0);
                }),
                (A = b.compile = function (a, b) {
                    var c,
                        d = [],
                        e = [],
                        f = T[a + " "];
                    if (!f) {
                        for (b || (b = z(a)), c = b.length; c--; ) (f = s(b[c])), f[N] ? d.push(f) : e.push(f);
                        (f = T(a, t(e, d))), (f.selector = a);
                    }
                    return f;
                }),
                (B = b.select = function (a, b, c, d) {
                    var e,
                        f,
                        g,
                        h,
                        i,
                        j = "function" == typeof a && a,
                        l = !d && z((a = j.selector || a));
                    if (((c = c || []), 1 === l.length)) {
                        if (((f = l[0] = l[0].slice(0)), f.length > 2 && "ID" === (g = f[0]).type && v.getById && 9 === b.nodeType && I && w.relative[f[1].type])) {
                            if (((b = (w.find.ID(g.matches[0].replace(ua, va), b) || [])[0]), !b)) return c;
                            j && (b = b.parentNode), (a = a.slice(f.shift().value.length));
                        }
                        for (e = oa.needsContext.test(a) ? 0 : f.length; e-- && ((g = f[e]), !w.relative[(h = g.type)]); )
                            if ((i = w.find[h]) && (d = i(g.matches[0].replace(ua, va), (sa.test(f[0].type) && k(b.parentNode)) || b))) {
                                if ((f.splice(e, 1), (a = d.length && m(f)), !a)) return _.apply(c, d), c;
                                break;
                            }
                    }
                    return (j || A(a, l))(d, b, !I, c, !b || (sa.test(a) && k(b.parentNode)) || b), c;
                }),
                (v.sortStable = N.split("").sort(U).join("") === N),
                (v.detectDuplicates = !!E),
                F(),
                (v.sortDetached = e(function (a) {
                    return 1 & a.compareDocumentPosition(G.createElement("div"));
                })),
                e(function (a) {
                    return (a.innerHTML = "<a href='#'></a>"), "#" === a.firstChild.getAttribute("href");
                }) ||
                    f("type|href|height|width", function (a, b, c) {
                        return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2);
                    }),
                (v.attributes &&
                    e(function (a) {
                        return (a.innerHTML = "<input/>"), a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value");
                    })) ||
                    f("value", function (a, b, c) {
                        return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue;
                    }),
                e(function (a) {
                    return null == a.getAttribute("disabled");
                }) ||
                    f(ca, function (a, b, c) {
                        var d;
                        return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null;
                    }),
                b
            );
        })(a);
        (oa.find = ta), (oa.expr = ta.selectors), (oa.expr[":"] = oa.expr.pseudos), (oa.uniqueSort = oa.unique = ta.uniqueSort), (oa.text = ta.getText), (oa.isXMLDoc = ta.isXML), (oa.contains = ta.contains);
        var ua = function (a, b, c) {
                for (var d = [], e = void 0 !== c; (a = a[b]) && 9 !== a.nodeType; )
                    if (1 === a.nodeType) {
                        if (e && oa(a).is(c)) break;
                        d.push(a);
                    }
                return d;
            },
            va = function (a, b) {
                for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
                return c;
            },
            wa = oa.expr.match.needsContext,
            xa = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
            ya = /^.[^:#\[\.,]*$/;
        (oa.filter = function (a, b, c) {
            var d = b[0];
            return (
                c && (a = ":not(" + a + ")"),
                1 === b.length && 1 === d.nodeType
                    ? oa.find.matchesSelector(d, a)
                        ? [d]
                        : []
                    : oa.find.matches(
                          a,
                          oa.grep(b, function (a) {
                              return 1 === a.nodeType;
                          })
                      )
            );
        }),
            oa.fn.extend({
                find: function (a) {
                    var b,
                        c = [],
                        d = this,
                        e = d.length;
                    if ("string" != typeof a)
                        return this.pushStack(
                            oa(a).filter(function () {
                                for (b = 0; e > b; b++) if (oa.contains(d[b], this)) return !0;
                            })
                        );
                    for (b = 0; e > b; b++) oa.find(a, d[b], c);
                    return (c = this.pushStack(e > 1 ? oa.unique(c) : c)), (c.selector = this.selector ? this.selector + " " + a : a), c;
                },
                filter: function (a) {
                    return this.pushStack(d(this, a || [], !1));
                },
                not: function (a) {
                    return this.pushStack(d(this, a || [], !0));
                },
                is: function (a) {
                    return !!d(this, "string" == typeof a && wa.test(a) ? oa(a) : a || [], !1).length;
                },
            });
        var za,
            Aa = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
            Ba = (oa.fn.init = function (a, b, c) {
                var d, e;
                if (!a) return this;
                if (((c = c || za), "string" == typeof a)) {
                    if (((d = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : Aa.exec(a)), !d || (!d[1] && b))) return !b || b.jquery ? (b || c).find(a) : this.constructor(b).find(a);
                    if (d[1]) {
                        if (((b = b instanceof oa ? b[0] : b), oa.merge(this, oa.parseHTML(d[1], b && b.nodeType ? b.ownerDocument || b : ea, !0)), xa.test(d[1]) && oa.isPlainObject(b)))
                            for (d in b) oa.isFunction(this[d]) ? this[d](b[d]) : this.attr(d, b[d]);
                        return this;
                    }
                    if (((e = ea.getElementById(d[2])), e && e.parentNode)) {
                        if (e.id !== d[2]) return za.find(a);
                        (this.length = 1), (this[0] = e);
                    }
                    return (this.context = ea), (this.selector = a), this;
                }
                return a.nodeType
                    ? ((this.context = this[0] = a), (this.length = 1), this)
                    : oa.isFunction(a)
                    ? "undefined" != typeof c.ready
                        ? c.ready(a)
                        : a(oa)
                    : (void 0 !== a.selector && ((this.selector = a.selector), (this.context = a.context)), oa.makeArray(a, this));
            });
        (Ba.prototype = oa.fn), (za = oa(ea));
        var Ca = /^(?:parents|prev(?:Until|All))/,
            Da = { children: !0, contents: !0, next: !0, prev: !0 };
        oa.fn.extend({
            has: function (a) {
                var b,
                    c = oa(a, this),
                    d = c.length;
                return this.filter(function () {
                    for (b = 0; d > b; b++) if (oa.contains(this, c[b])) return !0;
                });
            },
            closest: function (a, b) {
                for (var c, d = 0, e = this.length, f = [], g = wa.test(a) || "string" != typeof a ? oa(a, b || this.context) : 0; e > d; d++)
                    for (c = this[d]; c && c !== b; c = c.parentNode)
                        if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && oa.find.matchesSelector(c, a))) {
                            f.push(c);
                            break;
                        }
                return this.pushStack(f.length > 1 ? oa.uniqueSort(f) : f);
            },
            index: function (a) {
                return a ? ("string" == typeof a ? oa.inArray(this[0], oa(a)) : oa.inArray(a.jquery ? a[0] : a, this)) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            },
            add: function (a, b) {
                return this.pushStack(oa.uniqueSort(oa.merge(this.get(), oa(a, b))));
            },
            addBack: function (a) {
                return this.add(null == a ? this.prevObject : this.prevObject.filter(a));
            },
        }),
            oa.each(
                {
                    parent: function (a) {
                        var b = a.parentNode;
                        return b && 11 !== b.nodeType ? b : null;
                    },
                    parents: function (a) {
                        return ua(a, "parentNode");
                    },
                    parentsUntil: function (a, b, c) {
                        return ua(a, "parentNode", c);
                    },
                    next: function (a) {
                        return e(a, "nextSibling");
                    },
                    prev: function (a) {
                        return e(a, "previousSibling");
                    },
                    nextAll: function (a) {
                        return ua(a, "nextSibling");
                    },
                    prevAll: function (a) {
                        return ua(a, "previousSibling");
                    },
                    nextUntil: function (a, b, c) {
                        return ua(a, "nextSibling", c);
                    },
                    prevUntil: function (a, b, c) {
                        return ua(a, "previousSibling", c);
                    },
                    siblings: function (a) {
                        return va((a.parentNode || {}).firstChild, a);
                    },
                    children: function (a) {
                        return va(a.firstChild);
                    },
                    contents: function (a) {
                        return oa.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : oa.merge([], a.childNodes);
                    },
                },
                function (a, b) {
                    oa.fn[a] = function (c, d) {
                        var e = oa.map(this, b, c);
                        return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = oa.filter(d, e)), this.length > 1 && (Da[a] || (e = oa.uniqueSort(e)), Ca.test(a) && (e = e.reverse())), this.pushStack(e);
                    };
                }
            );
        var Ea = /\S+/g;
        (oa.Callbacks = function (a) {
            a = "string" == typeof a ? f(a) : oa.extend({}, a);
            var b,
                c,
                d,
                e,
                g = [],
                h = [],
                i = -1,
                j = function () {
                    for (e = a.once, d = b = !0; h.length; i = -1) for (c = h.shift(); ++i < g.length; ) g[i].apply(c[0], c[1]) === !1 && a.stopOnFalse && ((i = g.length), (c = !1));
                    a.memory || (c = !1), (b = !1), e && (g = c ? [] : "");
                },
                k = {
                    add: function () {
                        return (
                            g &&
                                (c && !b && ((i = g.length - 1), h.push(c)),
                                (function d(b) {
                                    oa.each(b, function (b, c) {
                                        oa.isFunction(c) ? (a.unique && k.has(c)) || g.push(c) : c && c.length && "string" !== oa.type(c) && d(c);
                                    });
                                })(arguments),
                                c && !b && j()),
                            this
                        );
                    },
                    remove: function () {
                        return (
                            oa.each(arguments, function (a, b) {
                                for (var c; (c = oa.inArray(b, g, c)) > -1; ) g.splice(c, 1), i >= c && i--;
                            }),
                            this
                        );
                    },
                    has: function (a) {
                        return a ? oa.inArray(a, g) > -1 : g.length > 0;
                    },
                    empty: function () {
                        return g && (g = []), this;
                    },
                    disable: function () {
                        return (e = h = []), (g = c = ""), this;
                    },
                    disabled: function () {
                        return !g;
                    },
                    lock: function () {
                        return (e = !0), c || k.disable(), this;
                    },
                    locked: function () {
                        return !!e;
                    },
                    fireWith: function (a, c) {
                        return e || ((c = c || []), (c = [a, c.slice ? c.slice() : c]), h.push(c), b || j()), this;
                    },
                    fire: function () {
                        return k.fireWith(this, arguments), this;
                    },
                    fired: function () {
                        return !!d;
                    },
                };
            return k;
        }),
            oa.extend({
                Deferred: function (a) {
                    var b = [
                            ["resolve", "done", oa.Callbacks("once memory"), "resolved"],
                            ["reject", "fail", oa.Callbacks("once memory"), "rejected"],
                            ["notify", "progress", oa.Callbacks("memory")],
                        ],
                        c = "pending",
                        d = {
                            state: function () {
                                return c;
                            },
                            always: function () {
                                return e.done(arguments).fail(arguments), this;
                            },
                            then: function () {
                                var a = arguments;
                                return oa
                                    .Deferred(function (c) {
                                        oa.each(b, function (b, f) {
                                            var g = oa.isFunction(a[b]) && a[b];
                                            e[f[1]](function () {
                                                var a = g && g.apply(this, arguments);
                                                a && oa.isFunction(a.promise) ? a.promise().progress(c.notify).done(c.resolve).fail(c.reject) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments);
                                            });
                                        }),
                                            (a = null);
                                    })
                                    .promise();
                            },
                            promise: function (a) {
                                return null != a ? oa.extend(a, d) : d;
                            },
                        },
                        e = {};
                    return (
                        (d.pipe = d.then),
                        oa.each(b, function (a, f) {
                            var g = f[2],
                                h = f[3];
                            (d[f[1]] = g.add),
                                h &&
                                    g.add(
                                        function () {
                                            c = h;
                                        },
                                        b[1 ^ a][2].disable,
                                        b[2][2].lock
                                    ),
                                (e[f[0]] = function () {
                                    return e[f[0] + "With"](this === e ? d : this, arguments), this;
                                }),
                                (e[f[0] + "With"] = g.fireWith);
                        }),
                        d.promise(e),
                        a && a.call(e, e),
                        e
                    );
                },
                when: function (a) {
                    var b,
                        c,
                        d,
                        e = 0,
                        f = fa.call(arguments),
                        g = f.length,
                        h = 1 !== g || (a && oa.isFunction(a.promise)) ? g : 0,
                        i = 1 === h ? a : oa.Deferred(),
                        j = function (a, c, d) {
                            return function (e) {
                                (c[a] = this), (d[a] = arguments.length > 1 ? fa.call(arguments) : e), d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d);
                            };
                        };
                    if (g > 1) for (b = new Array(g), c = new Array(g), d = new Array(g); g > e; e++) f[e] && oa.isFunction(f[e].promise) ? f[e].promise().progress(j(e, c, b)).done(j(e, d, f)).fail(i.reject) : --h;
                    return h || i.resolveWith(d, f), i.promise();
                },
            });
        var Fa;
        (oa.fn.ready = function (a) {
            return oa.ready.promise().done(a), this;
        }),
            oa.extend({
                isReady: !1,
                readyWait: 1,
                holdReady: function (a) {
                    a ? oa.readyWait++ : oa.ready(!0);
                },
                ready: function (a) {
                    (a === !0 ? --oa.readyWait : oa.isReady) || ((oa.isReady = !0), (a !== !0 && --oa.readyWait > 0) || (Fa.resolveWith(ea, [oa]), oa.fn.triggerHandler && (oa(ea).triggerHandler("ready"), oa(ea).off("ready"))));
                },
            }),
            (oa.ready.promise = function (b) {
                if (!Fa)
                    if (((Fa = oa.Deferred()), "complete" === ea.readyState || ("loading" !== ea.readyState && !ea.documentElement.doScroll))) a.setTimeout(oa.ready);
                    else if (ea.addEventListener) ea.addEventListener("DOMContentLoaded", h), a.addEventListener("load", h);
                    else {
                        ea.attachEvent("onreadystatechange", h), a.attachEvent("onload", h);
                        var c = !1;
                        try {
                            c = null == a.frameElement && ea.documentElement;
                        } catch (d) {}
                        c &&
                            c.doScroll &&
                            !(function e() {
                                if (!oa.isReady) {
                                    try {
                                        c.doScroll("left");
                                    } catch (b) {
                                        return a.setTimeout(e, 50);
                                    }
                                    g(), oa.ready();
                                }
                            })();
                    }
                return Fa.promise(b);
            }),
            oa.ready.promise();
        var Ga;
        for (Ga in oa(ma)) break;
        (ma.ownFirst = "0" === Ga),
            (ma.inlineBlockNeedsLayout = !1),
            oa(function () {
                var a, b, c, d;
                (c = ea.getElementsByTagName("body")[0]),
                    c &&
                        c.style &&
                        ((b = ea.createElement("div")),
                        (d = ea.createElement("div")),
                        (d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px"),
                        c.appendChild(d).appendChild(b),
                        "undefined" != typeof b.style.zoom && ((b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1"), (ma.inlineBlockNeedsLayout = a = 3 === b.offsetWidth), a && (c.style.zoom = 1)),
                        c.removeChild(d));
            }),
            (function () {
                var a = ea.createElement("div");
                ma.deleteExpando = !0;
                try {
                    delete a.test;
                } catch (b) {
                    ma.deleteExpando = !1;
                }
                a = null;
            })();
        var Ha = function (a) {
                var b = oa.noData[(a.nodeName + " ").toLowerCase()],
                    c = +a.nodeType || 1;
                return (1 === c || 9 === c) && (!b || (b !== !0 && a.getAttribute("classid") === b));
            },
            Ia = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            Ja = /([A-Z])/g;
        oa.extend({
            cache: {},
            noData: { "applet ": !0, "embed ": !0, "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" },
            hasData: function (a) {
                return (a = a.nodeType ? oa.cache[a[oa.expando]] : a[oa.expando]), !!a && !j(a);
            },
            data: function (a, b, c) {
                return k(a, b, c);
            },
            removeData: function (a, b) {
                return l(a, b);
            },
            _data: function (a, b, c) {
                return k(a, b, c, !0);
            },
            _removeData: function (a, b) {
                return l(a, b, !0);
            },
        }),
            oa.fn.extend({
                data: function (a, b) {
                    var c,
                        d,
                        e,
                        f = this[0],
                        g = f && f.attributes;
                    if (void 0 === a) {
                        if (this.length && ((e = oa.data(f)), 1 === f.nodeType && !oa._data(f, "parsedAttrs"))) {
                            for (c = g.length; c--; ) g[c] && ((d = g[c].name), 0 === d.indexOf("data-") && ((d = oa.camelCase(d.slice(5))), i(f, d, e[d])));
                            oa._data(f, "parsedAttrs", !0);
                        }
                        return e;
                    }
                    return "object" == ("undefined" == typeof a ? "undefined" : _typeof(a))
                        ? this.each(function () {
                              oa.data(this, a);
                          })
                        : arguments.length > 1
                        ? this.each(function () {
                              oa.data(this, a, b);
                          })
                        : f
                        ? i(f, a, oa.data(f, a))
                        : void 0;
                },
                removeData: function (a) {
                    return this.each(function () {
                        oa.removeData(this, a);
                    });
                },
            }),
            oa.extend({
                queue: function (a, b, c) {
                    var d;
                    return a ? ((b = (b || "fx") + "queue"), (d = oa._data(a, b)), c && (!d || oa.isArray(c) ? (d = oa._data(a, b, oa.makeArray(c))) : d.push(c)), d || []) : void 0;
                },
                dequeue: function (a, b) {
                    b = b || "fx";
                    var c = oa.queue(a, b),
                        d = c.length,
                        e = c.shift(),
                        f = oa._queueHooks(a, b),
                        g = function () {
                            oa.dequeue(a, b);
                        };
                    "inprogress" === e && ((e = c.shift()), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire();
                },
                _queueHooks: function (a, b) {
                    var c = b + "queueHooks";
                    return (
                        oa._data(a, c) ||
                        oa._data(a, c, {
                            empty: oa.Callbacks("once memory").add(function () {
                                oa._removeData(a, b + "queue"), oa._removeData(a, c);
                            }),
                        })
                    );
                },
            }),
            oa.fn.extend({
                queue: function (a, b) {
                    var c = 2;
                    return (
                        "string" != typeof a && ((b = a), (a = "fx"), c--),
                        arguments.length < c
                            ? oa.queue(this[0], a)
                            : void 0 === b
                            ? this
                            : this.each(function () {
                                  var c = oa.queue(this, a, b);
                                  oa._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && oa.dequeue(this, a);
                              })
                    );
                },
                dequeue: function (a) {
                    return this.each(function () {
                        oa.dequeue(this, a);
                    });
                },
                clearQueue: function (a) {
                    return this.queue(a || "fx", []);
                },
                promise: function (a, b) {
                    var c,
                        d = 1,
                        e = oa.Deferred(),
                        f = this,
                        g = this.length,
                        h = function () {
                            --d || e.resolveWith(f, [f]);
                        };
                    for ("string" != typeof a && ((b = a), (a = void 0)), a = a || "fx"; g--; ) (c = oa._data(f[g], a + "queueHooks")), c && c.empty && (d++, c.empty.add(h));
                    return h(), e.promise(b);
                },
            }),
            (function () {
                var a;
                ma.shrinkWrapBlocks = function () {
                    if (null != a) return a;
                    a = !1;
                    var b, c, d;
                    return (
                        (c = ea.getElementsByTagName("body")[0]),
                        c && c.style
                            ? ((b = ea.createElement("div")),
                              (d = ea.createElement("div")),
                              (d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px"),
                              c.appendChild(d).appendChild(b),
                              "undefined" != typeof b.style.zoom &&
                                  ((b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1"),
                                  (b.appendChild(ea.createElement("div")).style.width = "5px"),
                                  (a = 3 !== b.offsetWidth)),
                              c.removeChild(d),
                              a)
                            : void 0
                    );
                };
            })();
        var Ka = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            La = new RegExp("^(?:([+-])=|)(" + Ka + ")([a-z%]*)$", "i"),
            Ma = ["Top", "Right", "Bottom", "Left"],
            Na = function (a, b) {
                return (a = b || a), "none" === oa.css(a, "display") || !oa.contains(a.ownerDocument, a);
            },
            Oa = function qc(a, b, c, d, e, f, g) {
                var h = 0,
                    i = a.length,
                    j = null == c;
                if ("object" === oa.type(c)) {
                    e = !0;
                    for (h in c) qc(a, b, h, c[h], !0, f, g);
                } else if (
                    void 0 !== d &&
                    ((e = !0),
                    oa.isFunction(d) || (g = !0),
                    j &&
                        (g
                            ? (b.call(a, d), (b = null))
                            : ((j = b),
                              (b = function (a, b, c) {
                                  return j.call(oa(a), c);
                              }))),
                    b)
                )
                    for (; i > h; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
                return e ? a : j ? b.call(a) : i ? b(a[0], c) : f;
            },
            Pa = /^(?:checkbox|radio)$/i,
            $ = /<([\w:-]+)/,
            Qa = /^$|\/(?:java|ecma)script/i,
            Ra = /^\s+/,
            Sa = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
        !(function () {
            var a = ea.createElement("div"),
                b = ea.createDocumentFragment(),
                c = ea.createElement("input");
            (a.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
                (ma.leadingWhitespace = 3 === a.firstChild.nodeType),
                (ma.tbody = !a.getElementsByTagName("tbody").length),
                (ma.htmlSerialize = !!a.getElementsByTagName("link").length),
                (ma.html5Clone = "<:nav></:nav>" !== ea.createElement("nav").cloneNode(!0).outerHTML),
                (c.type = "checkbox"),
                (c.checked = !0),
                b.appendChild(c),
                (ma.appendChecked = c.checked),
                (a.innerHTML = "<textarea>x</textarea>"),
                (ma.noCloneChecked = !!a.cloneNode(!0).lastChild.defaultValue),
                b.appendChild(a),
                (c = ea.createElement("input")),
                c.setAttribute("type", "radio"),
                c.setAttribute("checked", "checked"),
                c.setAttribute("name", "t"),
                a.appendChild(c),
                (ma.checkClone = a.cloneNode(!0).cloneNode(!0).lastChild.checked),
                (ma.noCloneEvent = !!a.addEventListener),
                (a[oa.expando] = 1),
                (ma.attributes = !a.getAttribute(oa.expando));
        })();
        var Ta = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: ma.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"],
        };
        (Ta.optgroup = Ta.option), (Ta.tbody = Ta.tfoot = Ta.colgroup = Ta.caption = Ta.thead), (Ta.th = Ta.td);
        var Ua = /<|&#?\w+;/,
            Va = /<tbody/i;
        !(function () {
            var b,
                c,
                d = ea.createElement("div");
            for (b in { submit: !0, change: !0, focusin: !0 }) (c = "on" + b), (ma[b] = c in a) || (d.setAttribute(c, "t"), (ma[b] = d.attributes[c].expando === !1));
            d = null;
        })();
        var Wa = /^(?:input|select|textarea)$/i,
            Xa = /^key/,
            Ya = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
            Za = /^(?:focusinfocus|focusoutblur)$/,
            $a = /^([^.]*)(?:\.(.+)|)/;
        (oa.event = {
            global: {},
            add: function (a, b, c, d, e) {
                var f,
                    g,
                    h,
                    i,
                    j,
                    k,
                    l,
                    m,
                    n,
                    o,
                    p,
                    q = oa._data(a);
                if (q) {
                    for (
                        c.handler && ((i = c), (c = i.handler), (e = i.selector)),
                            c.guid || (c.guid = oa.guid++),
                            (g = q.events) || (g = q.events = {}),
                            (k = q.handle) ||
                                ((k = q.handle = function (a) {
                                    return "undefined" == typeof oa || (a && oa.event.triggered === a.type) ? void 0 : oa.event.dispatch.apply(k.elem, arguments);
                                }),
                                (k.elem = a)),
                            b = (b || "").match(Ea) || [""],
                            h = b.length;
                        h--;

                    )
                        (f = $a.exec(b[h]) || []),
                            (n = p = f[1]),
                            (o = (f[2] || "").split(".").sort()),
                            n &&
                                ((j = oa.event.special[n] || {}),
                                (n = (e ? j.delegateType : j.bindType) || n),
                                (j = oa.event.special[n] || {}),
                                (l = oa.extend({ type: n, origType: p, data: d, handler: c, guid: c.guid, selector: e, needsContext: e && oa.expr.match.needsContext.test(e), namespace: o.join(".") }, i)),
                                (m = g[n]) || ((m = g[n] = []), (m.delegateCount = 0), (j.setup && j.setup.call(a, d, o, k) !== !1) || (a.addEventListener ? a.addEventListener(n, k, !1) : a.attachEvent && a.attachEvent("on" + n, k))),
                                j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)),
                                e ? m.splice(m.delegateCount++, 0, l) : m.push(l),
                                (oa.event.global[n] = !0));
                    a = null;
                }
            },
            remove: function (a, b, c, d, e) {
                var f,
                    g,
                    h,
                    i,
                    j,
                    k,
                    l,
                    m,
                    n,
                    o,
                    p,
                    q = oa.hasData(a) && oa._data(a);
                if (q && (k = q.events)) {
                    for (b = (b || "").match(Ea) || [""], j = b.length; j--; )
                        if (((h = $a.exec(b[j]) || []), (n = p = h[1]), (o = (h[2] || "").split(".").sort()), n)) {
                            for (l = oa.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, m = k[n] || [], h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = f = m.length; f--; )
                                (g = m[f]),
                                    (!e && p !== g.origType) ||
                                        (c && c.guid !== g.guid) ||
                                        (h && !h.test(g.namespace)) ||
                                        (d && d !== g.selector && ("**" !== d || !g.selector)) ||
                                        (m.splice(f, 1), g.selector && m.delegateCount--, l.remove && l.remove.call(a, g));
                            i && !m.length && ((l.teardown && l.teardown.call(a, o, q.handle) !== !1) || oa.removeEvent(a, n, q.handle), delete k[n]);
                        } else for (n in k) oa.event.remove(a, n + b[j], c, d, !0);
                    oa.isEmptyObject(k) && (delete q.handle, oa._removeData(a, "events"));
                }
            },
            trigger: function (b, c, d, e) {
                var f,
                    g,
                    h,
                    i,
                    j,
                    k,
                    l,
                    m = [d || ea],
                    n = la.call(b, "type") ? b.type : b,
                    o = la.call(b, "namespace") ? b.namespace.split(".") : [];
                if (
                    ((h = k = d = d || ea),
                    3 !== d.nodeType &&
                        8 !== d.nodeType &&
                        !Za.test(n + oa.event.triggered) &&
                        (n.indexOf(".") > -1 && ((o = n.split(".")), (n = o.shift()), o.sort()),
                        (g = n.indexOf(":") < 0 && "on" + n),
                        (b = b[oa.expando] ? b : new oa.Event(n, "object" == ("undefined" == typeof b ? "undefined" : _typeof(b)) && b)),
                        (b.isTrigger = e ? 2 : 3),
                        (b.namespace = o.join(".")),
                        (b.rnamespace = b.namespace ? new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)") : null),
                        (b.result = void 0),
                        b.target || (b.target = d),
                        (c = null == c ? [b] : oa.makeArray(c, [b])),
                        (j = oa.event.special[n] || {}),
                        e || !j.trigger || j.trigger.apply(d, c) !== !1))
                ) {
                    if (!e && !j.noBubble && !oa.isWindow(d)) {
                        for (i = j.delegateType || n, Za.test(i + n) || (h = h.parentNode); h; h = h.parentNode) m.push(h), (k = h);
                        k === (d.ownerDocument || ea) && m.push(k.defaultView || k.parentWindow || a);
                    }
                    for (l = 0; (h = m[l++]) && !b.isPropagationStopped(); )
                        (b.type = l > 1 ? i : j.bindType || n),
                            (f = (oa._data(h, "events") || {})[b.type] && oa._data(h, "handle")),
                            f && f.apply(h, c),
                            (f = g && h[g]),
                            f && f.apply && Ha(h) && ((b.result = f.apply(h, c)), b.result === !1 && b.preventDefault());
                    if (((b.type = n), !e && !b.isDefaultPrevented() && (!j._default || j._default.apply(m.pop(), c) === !1) && Ha(d) && g && d[n] && !oa.isWindow(d))) {
                        (k = d[g]), k && (d[g] = null), (oa.event.triggered = n);
                        try {
                            d[n]();
                        } catch (p) {}
                        (oa.event.triggered = void 0), k && (d[g] = k);
                    }
                    return b.result;
                }
            },
            dispatch: function (a) {
                a = oa.event.fix(a);
                var b,
                    c,
                    d,
                    e,
                    f,
                    g = [],
                    h = fa.call(arguments),
                    i = (oa._data(this, "events") || {})[a.type] || [],
                    j = oa.event.special[a.type] || {};
                if (((h[0] = a), (a.delegateTarget = this), !j.preDispatch || j.preDispatch.call(this, a) !== !1)) {
                    for (g = oa.event.handlers.call(this, a, i), b = 0; (e = g[b++]) && !a.isPropagationStopped(); )
                        for (a.currentTarget = e.elem, c = 0; (f = e.handlers[c++]) && !a.isImmediatePropagationStopped(); )
                            (a.rnamespace && !a.rnamespace.test(f.namespace)) ||
                                ((a.handleObj = f), (a.data = f.data), (d = ((oa.event.special[f.origType] || {}).handle || f.handler).apply(e.elem, h)), void 0 !== d && (a.result = d) === !1 && (a.preventDefault(), a.stopPropagation()));
                    return j.postDispatch && j.postDispatch.call(this, a), a.result;
                }
            },
            handlers: function (a, b) {
                var c,
                    d,
                    e,
                    f,
                    g = [],
                    h = b.delegateCount,
                    i = a.target;
                if (h && i.nodeType && ("click" !== a.type || isNaN(a.button) || a.button < 1))
                    for (; i != this; i = i.parentNode || this)
                        if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                            for (d = [], c = 0; h > c; c++) (f = b[c]), (e = f.selector + " "), void 0 === d[e] && (d[e] = f.needsContext ? oa(e, this).index(i) > -1 : oa.find(e, this, null, [i]).length), d[e] && d.push(f);
                            d.length && g.push({ elem: i, handlers: d });
                        }
                return h < b.length && g.push({ elem: this, handlers: b.slice(h) }), g;
            },
            fix: function (a) {
                if (a[oa.expando]) return a;
                var b,
                    c,
                    d,
                    e = a.type,
                    f = a,
                    g = this.fixHooks[e];
                for (g || (this.fixHooks[e] = g = Ya.test(e) ? this.mouseHooks : Xa.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new oa.Event(f), b = d.length; b--; ) (c = d[b]), (a[c] = f[c]);
                return a.target || (a.target = f.srcElement || ea), 3 === a.target.nodeType && (a.target = a.target.parentNode), (a.metaKey = !!a.metaKey), g.filter ? g.filter(a, f) : a;
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function (a, b) {
                    return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a;
                },
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function (a, b) {
                    var c,
                        d,
                        e,
                        f = b.button,
                        g = b.fromElement;
                    return (
                        null == a.pageX &&
                            null != b.clientX &&
                            ((d = a.target.ownerDocument || ea),
                            (e = d.documentElement),
                            (c = d.body),
                            (a.pageX = b.clientX + ((e && e.scrollLeft) || (c && c.scrollLeft) || 0) - ((e && e.clientLeft) || (c && c.clientLeft) || 0)),
                            (a.pageY = b.clientY + ((e && e.scrollTop) || (c && c.scrollTop) || 0) - ((e && e.clientTop) || (c && c.clientTop) || 0))),
                        !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g),
                        a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0),
                        a
                    );
                },
            },
            special: {
                load: { noBubble: !0 },
                focus: {
                    trigger: function () {
                        if (this !== u() && this.focus)
                            try {
                                return this.focus(), !1;
                            } catch (a) {}
                    },
                    delegateType: "focusin",
                },
                blur: {
                    trigger: function () {
                        return this === u() && this.blur ? (this.blur(), !1) : void 0;
                    },
                    delegateType: "focusout",
                },
                click: {
                    trigger: function () {
                        return oa.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0;
                    },
                    _default: function (a) {
                        return oa.nodeName(a.target, "a");
                    },
                },
                beforeunload: {
                    postDispatch: function (a) {
                        void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result);
                    },
                },
            },
            simulate: function (a, b, c) {
                var d = oa.extend(new oa.Event(), c, { type: a, isSimulated: !0 });
                oa.event.trigger(d, null, b), d.isDefaultPrevented() && c.preventDefault();
            },
        }),
            (oa.removeEvent = ea.removeEventListener
                ? function (a, b, c) {
                      a.removeEventListener && a.removeEventListener(b, c);
                  }
                : function (a, b, c) {
                      var d = "on" + b;
                      a.detachEvent && ("undefined" == typeof a[d] && (a[d] = null), a.detachEvent(d, c));
                  }),
            (oa.Event = function (a, b) {
                return this instanceof oa.Event
                    ? (a && a.type ? ((this.originalEvent = a), (this.type = a.type), (this.isDefaultPrevented = a.defaultPrevented || (void 0 === a.defaultPrevented && a.returnValue === !1) ? s : t)) : (this.type = a),
                      b && oa.extend(this, b),
                      (this.timeStamp = (a && a.timeStamp) || oa.now()),
                      void (this[oa.expando] = !0))
                    : new oa.Event(a, b);
            }),
            (oa.Event.prototype = {
                constructor: oa.Event,
                isDefaultPrevented: t,
                isPropagationStopped: t,
                isImmediatePropagationStopped: t,
                preventDefault: function () {
                    var a = this.originalEvent;
                    (this.isDefaultPrevented = s), a && (a.preventDefault ? a.preventDefault() : (a.returnValue = !1));
                },
                stopPropagation: function () {
                    var a = this.originalEvent;
                    (this.isPropagationStopped = s), a && !this.isSimulated && (a.stopPropagation && a.stopPropagation(), (a.cancelBubble = !0));
                },
                stopImmediatePropagation: function () {
                    var a = this.originalEvent;
                    (this.isImmediatePropagationStopped = s), a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation();
                },
            }),
            oa.each({ mouseenter: "mouseover", mouseleave: "mouseout", pointerenter: "pointerover", pointerleave: "pointerout" }, function (a, b) {
                oa.event.special[a] = {
                    delegateType: b,
                    bindType: b,
                    handle: function (a) {
                        var c,
                            d = this,
                            e = a.relatedTarget,
                            f = a.handleObj;
                        return (e && (e === d || oa.contains(d, e))) || ((a.type = f.origType), (c = f.handler.apply(this, arguments)), (a.type = b)), c;
                    },
                };
            }),
            ma.submit ||
                (oa.event.special.submit = {
                    setup: function () {
                        return (
                            !oa.nodeName(this, "form") &&
                            void oa.event.add(this, "click._submit keypress._submit", function (a) {
                                var b = a.target,
                                    c = oa.nodeName(b, "input") || oa.nodeName(b, "button") ? oa.prop(b, "form") : void 0;
                                c &&
                                    !oa._data(c, "submit") &&
                                    (oa.event.add(c, "submit._submit", function (a) {
                                        a._submitBubble = !0;
                                    }),
                                    oa._data(c, "submit", !0));
                            })
                        );
                    },
                    postDispatch: function (a) {
                        a._submitBubble && (delete a._submitBubble, this.parentNode && !a.isTrigger && oa.event.simulate("submit", this.parentNode, a));
                    },
                    teardown: function () {
                        return !oa.nodeName(this, "form") && void oa.event.remove(this, "._submit");
                    },
                }),
            ma.change ||
                (oa.event.special.change = {
                    setup: function () {
                        return Wa.test(this.nodeName)
                            ? (("checkbox" !== this.type && "radio" !== this.type) ||
                                  (oa.event.add(this, "propertychange._change", function (a) {
                                      "checked" === a.originalEvent.propertyName && (this._justChanged = !0);
                                  }),
                                  oa.event.add(this, "click._change", function (a) {
                                      this._justChanged && !a.isTrigger && (this._justChanged = !1), oa.event.simulate("change", this, a);
                                  })),
                              !1)
                            : void oa.event.add(this, "beforeactivate._change", function (a) {
                                  var b = a.target;
                                  Wa.test(b.nodeName) &&
                                      !oa._data(b, "change") &&
                                      (oa.event.add(b, "change._change", function (a) {
                                          !this.parentNode || a.isSimulated || a.isTrigger || oa.event.simulate("change", this.parentNode, a);
                                      }),
                                      oa._data(b, "change", !0));
                              });
                    },
                    handle: function (a) {
                        var b = a.target;
                        return this !== b || a.isSimulated || a.isTrigger || ("radio" !== b.type && "checkbox" !== b.type) ? a.handleObj.handler.apply(this, arguments) : void 0;
                    },
                    teardown: function () {
                        return oa.event.remove(this, "._change"), !Wa.test(this.nodeName);
                    },
                }),
            ma.focusin ||
                oa.each({ focus: "focusin", blur: "focusout" }, function (a, b) {
                    var c = function (a) {
                        oa.event.simulate(b, a.target, oa.event.fix(a));
                    };
                    oa.event.special[b] = {
                        setup: function () {
                            var d = this.ownerDocument || this,
                                e = oa._data(d, b);
                            e || d.addEventListener(a, c, !0), oa._data(d, b, (e || 0) + 1);
                        },
                        teardown: function () {
                            var d = this.ownerDocument || this,
                                e = oa._data(d, b) - 1;
                            e ? oa._data(d, b, e) : (d.removeEventListener(a, c, !0), oa._removeData(d, b));
                        },
                    };
                }),
            oa.fn.extend({
                on: function (a, b, c, d) {
                    return v(this, a, b, c, d);
                },
                one: function (a, b, c, d) {
                    return v(this, a, b, c, d, 1);
                },
                off: function (a, b, c) {
                    var d, e;
                    if (a && a.preventDefault && a.handleObj) return (d = a.handleObj), oa(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
                    if ("object" == ("undefined" == typeof a ? "undefined" : _typeof(a))) {
                        for (e in a) this.off(e, b, a[e]);
                        return this;
                    }
                    return (
                        (b !== !1 && "function" != typeof b) || ((c = b), (b = void 0)),
                        c === !1 && (c = t),
                        this.each(function () {
                            oa.event.remove(this, a, c, b);
                        })
                    );
                },
                trigger: function (a, b) {
                    return this.each(function () {
                        oa.event.trigger(a, b, this);
                    });
                },
                triggerHandler: function (a, b) {
                    var c = this[0];
                    return c ? oa.event.trigger(a, b, c, !0) : void 0;
                },
            });
        var _a = / jQuery\d+="(?:null|\d+)"/g,
            ab = new RegExp("<(?:" + Sa + ")[\\s/>]", "i"),
            bb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
            cb = /<script|<style|<link/i,
            db = /checked\s*(?:[^=]|=\s*.checked.)/i,
            eb = /^true\/(.*)/,
            fb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
            gb = n(ea),
            hb = gb.appendChild(ea.createElement("div"));
        oa.extend({
            htmlPrefilter: function (a) {
                return a.replace(bb, "<$1></$2>");
            },
            clone: function (a, b, c) {
                var d,
                    e,
                    f,
                    g,
                    h,
                    i = oa.contains(a.ownerDocument, a);
                if (
                    (ma.html5Clone || oa.isXMLDoc(a) || !ab.test("<" + a.nodeName + ">") ? (f = a.cloneNode(!0)) : ((hb.innerHTML = a.outerHTML), hb.removeChild((f = hb.firstChild))),
                    !((ma.noCloneEvent && ma.noCloneChecked) || (1 !== a.nodeType && 11 !== a.nodeType) || oa.isXMLDoc(a)))
                )
                    for (d = o(f), h = o(a), g = 0; null != (e = h[g]); ++g) d[g] && A(e, d[g]);
                if (b)
                    if (c) for (h = h || o(a), d = d || o(f), g = 0; null != (e = h[g]); g++) z(e, d[g]);
                    else z(a, f);
                return (d = o(f, "script")), d.length > 0 && p(d, !i && o(a, "script")), (d = h = e = null), f;
            },
            cleanData: function (a, b) {
                for (var c, d, e, f, g = 0, h = oa.expando, i = oa.cache, j = ma.attributes, k = oa.event.special; null != (c = a[g]); g++)
                    if ((b || Ha(c)) && ((e = c[h]), (f = e && i[e]))) {
                        if (f.events) for (d in f.events) k[d] ? oa.event.remove(c, d) : oa.removeEvent(c, d, f.handle);
                        i[e] && (delete i[e], j || "undefined" == typeof c.removeAttribute ? (c[h] = void 0) : c.removeAttribute(h), da.push(e));
                    }
            },
        }),
            oa.fn.extend({
                domManip: B,
                detach: function (a) {
                    return C(this, a, !0);
                },
                remove: function (a) {
                    return C(this, a);
                },
                text: function (a) {
                    return Oa(
                        this,
                        function (a) {
                            return void 0 === a ? oa.text(this) : this.empty().append(((this[0] && this[0].ownerDocument) || ea).createTextNode(a));
                        },
                        null,
                        a,
                        arguments.length
                    );
                },
                append: function () {
                    return B(this, arguments, function (a) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var b = w(this, a);
                            b.appendChild(a);
                        }
                    });
                },
                prepend: function () {
                    return B(this, arguments, function (a) {
                        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                            var b = w(this, a);
                            b.insertBefore(a, b.firstChild);
                        }
                    });
                },
                before: function () {
                    return B(this, arguments, function (a) {
                        this.parentNode && this.parentNode.insertBefore(a, this);
                    });
                },
                after: function () {
                    return B(this, arguments, function (a) {
                        this.parentNode && this.parentNode.insertBefore(a, this.nextSibling);
                    });
                },
                empty: function () {
                    for (var a, b = 0; null != (a = this[b]); b++) {
                        for (1 === a.nodeType && oa.cleanData(o(a, !1)); a.firstChild; ) a.removeChild(a.firstChild);
                        a.options && oa.nodeName(a, "select") && (a.options.length = 0);
                    }
                    return this;
                },
                clone: function (a, b) {
                    return (
                        (a = null != a && a),
                        (b = null == b ? a : b),
                        this.map(function () {
                            return oa.clone(this, a, b);
                        })
                    );
                },
                html: function (a) {
                    return Oa(
                        this,
                        function (a) {
                            var b = this[0] || {},
                                c = 0,
                                d = this.length;
                            if (void 0 === a) return 1 === b.nodeType ? b.innerHTML.replace(_a, "") : void 0;
                            if ("string" == typeof a && !cb.test(a) && (ma.htmlSerialize || !ab.test(a)) && (ma.leadingWhitespace || !Ra.test(a)) && !Ta[($.exec(a) || ["", ""])[1].toLowerCase()]) {
                                a = oa.htmlPrefilter(a);
                                try {
                                    for (; d > c; c++) (b = this[c] || {}), 1 === b.nodeType && (oa.cleanData(o(b, !1)), (b.innerHTML = a));
                                    b = 0;
                                } catch (e) {}
                            }
                            b && this.empty().append(a);
                        },
                        null,
                        a,
                        arguments.length
                    );
                },
                replaceWith: function () {
                    var a = [];
                    return B(
                        this,
                        arguments,
                        function (b) {
                            var c = this.parentNode;
                            oa.inArray(this, a) < 0 && (oa.cleanData(o(this)), c && c.replaceChild(b, this));
                        },
                        a
                    );
                },
            }),
            oa.each({ appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith" }, function (a, b) {
                oa.fn[a] = function (a) {
                    for (var c, d = 0, e = [], f = oa(a), g = f.length - 1; g >= d; d++) (c = d === g ? this : this.clone(!0)), oa(f[d])[b](c), ha.apply(e, c.get());
                    return this.pushStack(e);
                };
            });
        var ib,
            jb = { HTML: "block", BODY: "block" },
            kb = /^margin/,
            lb = new RegExp("^(" + Ka + ")(?!px)[a-z%]+$", "i"),
            mb = function (a, b, c, d) {
                var e,
                    f,
                    g = {};
                for (f in b) (g[f] = a.style[f]), (a.style[f] = b[f]);
                e = c.apply(a, d || []);
                for (f in b) a.style[f] = g[f];
                return e;
            },
            nb = ea.documentElement;
        !(function () {
            var b,
                c,
                d,
                e,
                f,
                g,
                h = ea.createElement("div"),
                i = ea.createElement("div");
            if (i.style) {
                var j = function () {
                    var j,
                        k,
                        l = ea.documentElement;
                    l.appendChild(h),
                        (i.style.cssText = "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%"),
                        (b = d = g = !1),
                        (c = f = !0),
                        a.getComputedStyle &&
                            ((k = a.getComputedStyle(i)),
                            (b = "1%" !== (k || {}).top),
                            (g = "2px" === (k || {}).marginLeft),
                            (d = "4px" === (k || { width: "4px" }).width),
                            (i.style.marginRight = "50%"),
                            (c = "4px" === (k || { marginRight: "4px" }).marginRight),
                            (j = i.appendChild(ea.createElement("div"))),
                            (j.style.cssText = i.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0"),
                            (j.style.marginRight = j.style.width = "0"),
                            (i.style.width = "1px"),
                            (f = !parseFloat((a.getComputedStyle(j) || {}).marginRight)),
                            i.removeChild(j)),
                        (i.style.display = "none"),
                        (e = 0 === i.getClientRects().length),
                        e &&
                            ((i.style.display = ""),
                            (i.innerHTML = "<table><tr><td></td><td>t</td></tr></table>"),
                            (j = i.getElementsByTagName("td")),
                            (j[0].style.cssText = "margin:0;border:0;padding:0;display:none"),
                            (e = 0 === j[0].offsetHeight),
                            e && ((j[0].style.display = ""), (j[1].style.display = "none"), (e = 0 === j[0].offsetHeight))),
                        l.removeChild(h);
                };
                (i.style.cssText = "float:left;opacity:.5"),
                    (ma.opacity = "0.5" === i.style.opacity),
                    (ma.cssFloat = !!i.style.cssFloat),
                    (i.style.backgroundClip = "content-box"),
                    (i.cloneNode(!0).style.backgroundClip = ""),
                    (ma.clearCloneStyle = "content-box" === i.style.backgroundClip),
                    (h = ea.createElement("div")),
                    (h.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute"),
                    (i.innerHTML = ""),
                    h.appendChild(i),
                    (ma.boxSizing = "" === i.style.boxSizing || "" === i.style.MozBoxSizing || "" === i.style.WebkitBoxSizing),
                    oa.extend(ma, {
                        reliableHiddenOffsets: function () {
                            return null == b && j(), e;
                        },
                        boxSizingReliable: function () {
                            return null == b && j(), d;
                        },
                        pixelMarginRight: function () {
                            return null == b && j(), c;
                        },
                        pixelPosition: function () {
                            return null == b && j(), b;
                        },
                        reliableMarginRight: function () {
                            return null == b && j(), f;
                        },
                        reliableMarginLeft: function () {
                            return null == b && j(), g;
                        },
                    });
            }
        })();
        var ob,
            pb,
            qb = /^(top|right|bottom|left)$/;
        a.getComputedStyle
            ? ((ob = function (b) {
                  var c = b.ownerDocument.defaultView;
                  return (c && c.opener) || (c = a), c.getComputedStyle(b);
              }),
              (pb = function (a, b, c) {
                  var d,
                      e,
                      f,
                      g,
                      h = a.style;
                  return (
                      (c = c || ob(a)),
                      (g = c ? c.getPropertyValue(b) || c[b] : void 0),
                      ("" !== g && void 0 !== g) || oa.contains(a.ownerDocument, a) || (g = oa.style(a, b)),
                      c && !ma.pixelMarginRight() && lb.test(g) && kb.test(b) && ((d = h.width), (e = h.minWidth), (f = h.maxWidth), (h.minWidth = h.maxWidth = h.width = g), (g = c.width), (h.width = d), (h.minWidth = e), (h.maxWidth = f)),
                      void 0 === g ? g : g + ""
                  );
              }))
            : nb.currentStyle &&
              ((ob = function (a) {
                  return a.currentStyle;
              }),
              (pb = function (a, b, c) {
                  var d,
                      e,
                      f,
                      g,
                      h = a.style;
                  return (
                      (c = c || ob(a)),
                      (g = c ? c[b] : void 0),
                      null == g && h && h[b] && (g = h[b]),
                      lb.test(g) &&
                          !qb.test(b) &&
                          ((d = h.left), (e = a.runtimeStyle), (f = e && e.left), f && (e.left = a.currentStyle.left), (h.left = "fontSize" === b ? "1em" : g), (g = h.pixelLeft + "px"), (h.left = d), f && (e.left = f)),
                      void 0 === g ? g : g + "" || "auto"
                  );
              }));
        var rb = /alpha\([^)]*\)/i,
            sb = /opacity\s*=\s*([^)]*)/i,
            tb = /^(none|table(?!-c[ea]).+)/,
            ub = new RegExp("^(" + Ka + ")(.*)$", "i"),
            vb = { position: "absolute", visibility: "hidden", display: "block" },
            wb = { letterSpacing: "0", fontWeight: "400" },
            xb = ["Webkit", "O", "Moz", "ms"],
            yb = ea.createElement("div").style;
        oa.extend({
            cssHooks: {
                opacity: {
                    get: function (a, b) {
                        if (b) {
                            var c = pb(a, "opacity");
                            return "" === c ? "1" : c;
                        }
                    },
                },
            },
            cssNumber: { animationIterationCount: !0, columnCount: !0, fillOpacity: !0, flexGrow: !0, flexShrink: !0, fontWeight: !0, lineHeight: !0, opacity: !0, order: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0 },
            cssProps: { float: ma.cssFloat ? "cssFloat" : "styleFloat" },
            style: function (a, b, c, d) {
                if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                    var e,
                        f,
                        g,
                        h = oa.camelCase(b),
                        i = a.style;
                    if (((b = oa.cssProps[h] || (oa.cssProps[h] = G(h) || h)), (g = oa.cssHooks[b] || oa.cssHooks[h]), void 0 === c)) return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                    if (
                        ((f = "undefined" == typeof c ? "undefined" : _typeof(c)),
                        "string" === f && (e = La.exec(c)) && e[1] && ((c = m(a, b, e)), (f = "number")),
                        null != c &&
                            c === c &&
                            ("number" === f && (c += (e && e[3]) || (oa.cssNumber[h] ? "" : "px")),
                            ma.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"),
                            !(g && "set" in g && void 0 === (c = g.set(a, c, d)))))
                    )
                        try {
                            i[b] = c;
                        } catch (j) {}
                }
            },
            css: function (a, b, c, d) {
                var e,
                    f,
                    g,
                    h = oa.camelCase(b);
                return (
                    (b = oa.cssProps[h] || (oa.cssProps[h] = G(h) || h)),
                    (g = oa.cssHooks[b] || oa.cssHooks[h]),
                    g && "get" in g && (f = g.get(a, !0, c)),
                    void 0 === f && (f = pb(a, b, d)),
                    "normal" === f && b in wb && (f = wb[b]),
                    "" === c || c ? ((e = parseFloat(f)), c === !0 || isFinite(e) ? e || 0 : f) : f
                );
            },
        }),
            oa.each(["height", "width"], function (a, b) {
                oa.cssHooks[b] = {
                    get: function (a, c, d) {
                        return c
                            ? tb.test(oa.css(a, "display")) && 0 === a.offsetWidth
                                ? mb(a, vb, function () {
                                      return K(a, b, d);
                                  })
                                : K(a, b, d)
                            : void 0;
                    },
                    set: function (a, c, d) {
                        var e = d && ob(a);
                        return I(a, c, d ? J(a, b, d, ma.boxSizing && "border-box" === oa.css(a, "boxSizing", !1, e), e) : 0);
                    },
                };
            }),
            ma.opacity ||
                (oa.cssHooks.opacity = {
                    get: function (a, b) {
                        return sb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : b ? "1" : "";
                    },
                    set: function (a, b) {
                        var c = a.style,
                            d = a.currentStyle,
                            e = oa.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "",
                            f = (d && d.filter) || c.filter || "";
                        (c.zoom = 1),
                            ((b >= 1 || "" === b) && "" === oa.trim(f.replace(rb, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || (d && !d.filter))) || (c.filter = rb.test(f) ? f.replace(rb, e) : f + " " + e);
                    },
                }),
            (oa.cssHooks.marginRight = F(ma.reliableMarginRight, function (a, b) {
                return b ? mb(a, { display: "inline-block" }, pb, [a, "marginRight"]) : void 0;
            })),
            (oa.cssHooks.marginLeft = F(ma.reliableMarginLeft, function (a, b) {
                return b
                    ? (parseFloat(pb(a, "marginLeft")) ||
                          (oa.contains(a.ownerDocument, a)
                              ? a.getBoundingClientRect().left -
                                mb(a, { marginLeft: 0 }, function () {
                                    return a.getBoundingClientRect().left;
                                })
                              : 0)) + "px"
                    : void 0;
            })),
            oa.each({ margin: "", padding: "", border: "Width" }, function (a, b) {
                (oa.cssHooks[a + b] = {
                    expand: function (c) {
                        for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) e[a + Ma[d] + b] = f[d] || f[d - 2] || f[0];
                        return e;
                    },
                }),
                    kb.test(a) || (oa.cssHooks[a + b].set = I);
            }),
            oa.fn.extend({
                css: function (a, b) {
                    return Oa(
                        this,
                        function (a, b, c) {
                            var d,
                                e,
                                f = {},
                                g = 0;
                            if (oa.isArray(b)) {
                                for (d = ob(a), e = b.length; e > g; g++) f[b[g]] = oa.css(a, b[g], !1, d);
                                return f;
                            }
                            return void 0 !== c ? oa.style(a, b, c) : oa.css(a, b);
                        },
                        a,
                        b,
                        arguments.length > 1
                    );
                },
                show: function () {
                    return H(this, !0);
                },
                hide: function () {
                    return H(this);
                },
                toggle: function (a) {
                    return "boolean" == typeof a
                        ? a
                            ? this.show()
                            : this.hide()
                        : this.each(function () {
                              Na(this) ? oa(this).show() : oa(this).hide();
                          });
                },
            }),
            (oa.Tween = L),
            (L.prototype = {
                constructor: L,
                init: function (a, b, c, d, e, f) {
                    (this.elem = a), (this.prop = c), (this.easing = e || oa.easing._default), (this.options = b), (this.start = this.now = this.cur()), (this.end = d), (this.unit = f || (oa.cssNumber[c] ? "" : "px"));
                },
                cur: function () {
                    var a = L.propHooks[this.prop];
                    return a && a.get ? a.get(this) : L.propHooks._default.get(this);
                },
                run: function (a) {
                    var b,
                        c = L.propHooks[this.prop];
                    return (
                        this.options.duration ? (this.pos = b = oa.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration)) : (this.pos = b = a),
                        (this.now = (this.end - this.start) * b + this.start),
                        this.options.step && this.options.step.call(this.elem, this.now, this),
                        c && c.set ? c.set(this) : L.propHooks._default.set(this),
                        this
                    );
                },
            }),
            (L.prototype.init.prototype = L.prototype),
            (L.propHooks = {
                _default: {
                    get: function (a) {
                        var b;
                        return 1 !== a.elem.nodeType || (null != a.elem[a.prop] && null == a.elem.style[a.prop]) ? a.elem[a.prop] : ((b = oa.css(a.elem, a.prop, "")), b && "auto" !== b ? b : 0);
                    },
                    set: function (a) {
                        oa.fx.step[a.prop] ? oa.fx.step[a.prop](a) : 1 !== a.elem.nodeType || (null == a.elem.style[oa.cssProps[a.prop]] && !oa.cssHooks[a.prop]) ? (a.elem[a.prop] = a.now) : oa.style(a.elem, a.prop, a.now + a.unit);
                    },
                },
            }),
            (L.propHooks.scrollTop = L.propHooks.scrollLeft = {
                set: function (a) {
                    a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now);
                },
            }),
            (oa.easing = {
                linear: function (a) {
                    return a;
                },
                swing: function (a) {
                    return 0.5 - Math.cos(a * Math.PI) / 2;
                },
                _default: "swing",
            }),
            (oa.fx = L.prototype.init),
            (oa.fx.step = {});
        var zb,
            Ab,
            Bb = /^(?:toggle|show|hide)$/,
            Cb = /queueHooks$/;
        (oa.Animation = oa.extend(R, {
            tweeners: {
                "*": [
                    function (a, b) {
                        var c = this.createTween(a, b);
                        return m(c.elem, a, La.exec(b), c), c;
                    },
                ],
            },
            tweener: function (a, b) {
                oa.isFunction(a) ? ((b = a), (a = ["*"])) : (a = a.match(Ea));
                for (var c, d = 0, e = a.length; e > d; d++) (c = a[d]), (R.tweeners[c] = R.tweeners[c] || []), R.tweeners[c].unshift(b);
            },
            prefilters: [P],
            prefilter: function (a, b) {
                b ? R.prefilters.unshift(a) : R.prefilters.push(a);
            },
        })),
            (oa.speed = function (a, b, c) {
                var d = a && "object" == ("undefined" == typeof a ? "undefined" : _typeof(a)) ? oa.extend({}, a) : { complete: c || (!c && b) || (oa.isFunction(a) && a), duration: a, easing: (c && b) || (b && !oa.isFunction(b) && b) };
                return (
                    (d.duration = oa.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in oa.fx.speeds ? oa.fx.speeds[d.duration] : oa.fx.speeds._default),
                    (null != d.queue && d.queue !== !0) || (d.queue = "fx"),
                    (d.old = d.complete),
                    (d.complete = function () {
                        oa.isFunction(d.old) && d.old.call(this), d.queue && oa.dequeue(this, d.queue);
                    }),
                    d
                );
            }),
            oa.fn.extend({
                fadeTo: function (a, b, c, d) {
                    return this.filter(Na).css("opacity", 0).show().end().animate({ opacity: b }, a, c, d);
                },
                animate: function (a, b, c, d) {
                    var e = oa.isEmptyObject(a),
                        f = oa.speed(b, c, d),
                        g = function () {
                            var b = R(this, oa.extend({}, a), f);
                            (e || oa._data(this, "finish")) && b.stop(!0);
                        };
                    return (g.finish = g), e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g);
                },
                stop: function (a, b, c) {
                    var d = function (a) {
                        var b = a.stop;
                        delete a.stop, b(c);
                    };
                    return (
                        "string" != typeof a && ((c = b), (b = a), (a = void 0)),
                        b && a !== !1 && this.queue(a || "fx", []),
                        this.each(function () {
                            var b = !0,
                                e = null != a && a + "queueHooks",
                                f = oa.timers,
                                g = oa._data(this);
                            if (e) g[e] && g[e].stop && d(g[e]);
                            else for (e in g) g[e] && g[e].stop && Cb.test(e) && d(g[e]);
                            for (e = f.length; e--; ) f[e].elem !== this || (null != a && f[e].queue !== a) || (f[e].anim.stop(c), (b = !1), f.splice(e, 1));
                            (!b && c) || oa.dequeue(this, a);
                        })
                    );
                },
                finish: function (a) {
                    return (
                        a !== !1 && (a = a || "fx"),
                        this.each(function () {
                            var b,
                                c = oa._data(this),
                                d = c[a + "queue"],
                                e = c[a + "queueHooks"],
                                f = oa.timers,
                                g = d ? d.length : 0;
                            for (c.finish = !0, oa.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--; ) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
                            for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this);
                            delete c.finish;
                        })
                    );
                },
            }),
            oa.each(["toggle", "show", "hide"], function (a, b) {
                var c = oa.fn[b];
                oa.fn[b] = function (a, d, e) {
                    return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(N(b, !0), a, d, e);
                };
            }),
            oa.each({ slideDown: N("show"), slideUp: N("hide"), slideToggle: N("toggle"), fadeIn: { opacity: "show" }, fadeOut: { opacity: "hide" }, fadeToggle: { opacity: "toggle" } }, function (a, b) {
                oa.fn[a] = function (a, c, d) {
                    return this.animate(b, a, c, d);
                };
            }),
            (oa.timers = []),
            (oa.fx.tick = function () {
                var a,
                    b = oa.timers,
                    c = 0;
                for (zb = oa.now(); c < b.length; c++) (a = b[c]), a() || b[c] !== a || b.splice(c--, 1);
                b.length || oa.fx.stop(), (zb = void 0);
            }),
            (oa.fx.fpsTimer = function (a) {
                oa.timers.push(a), a() ? oa.fx.start() : oa.timers.pop();
            }),
            (oa.fx.interval = 13),
            (oa.fx.start = function () {
                Ab || (Ab = a.setInterval(oa.fx.tick, oa.fx.interval));
            }),
            (oa.fx.stop = function () {
                a.clearInterval(Ab), (Ab = null);
            }),
            (oa.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
            (oa.fn.delay = function (b, c) {
                return (
                    (b = oa.fx ? oa.fx.speeds[b] || b : b),
                    (c = c || "fx"),
                    this.queue(c, function (c, d) {
                        var e = a.setTimeout(c, b);
                        d.stop = function () {
                            a.clearTimeout(e);
                        };
                    })
                );
            }),
            (function () {
                var a,
                    b = ea.createElement("input"),
                    c = ea.createElement("div"),
                    d = ea.createElement("select"),
                    e = d.appendChild(ea.createElement("option"));
                (c = ea.createElement("div")),
                    c.setAttribute("className", "t"),
                    (c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
                    (a = c.getElementsByTagName("a")[0]),
                    b.setAttribute("type", "checkbox"),
                    c.appendChild(b),
                    (a = c.getElementsByTagName("a")[0]),
                    (a.style.cssText = "top:1px"),
                    (ma.getSetAttribute = "t" !== c.className),
                    (ma.style = /top/.test(a.getAttribute("style"))),
                    (ma.hrefNormalized = "/a" === a.getAttribute("href")),
                    (ma.checkOn = !!b.value),
                    (ma.optSelected = e.selected),
                    (ma.enctype = !!ea.createElement("form").enctype),
                    (d.disabled = !0),
                    (ma.optDisabled = !e.disabled),
                    (b = ea.createElement("input")),
                    b.setAttribute("value", ""),
                    (ma.input = "" === b.getAttribute("value")),
                    (b.value = "t"),
                    b.setAttribute("type", "radio"),
                    (ma.radioValue = "t" === b.value);
            })();
        var Db = /\r/g,
            Eb = /[\x20\t\r\n\f]+/g;
        oa.fn.extend({
            val: function (a) {
                var b,
                    c,
                    d,
                    e = this[0];
                return arguments.length
                    ? ((d = oa.isFunction(a)),
                      this.each(function (c) {
                          var e;
                          1 === this.nodeType &&
                              ((e = d ? a.call(this, c, oa(this).val()) : a),
                              null == e
                                  ? (e = "")
                                  : "number" == typeof e
                                  ? (e += "")
                                  : oa.isArray(e) &&
                                    (e = oa.map(e, function (a) {
                                        return null == a ? "" : a + "";
                                    })),
                              (b = oa.valHooks[this.type] || oa.valHooks[this.nodeName.toLowerCase()]),
                              (b && "set" in b && void 0 !== b.set(this, e, "value")) || (this.value = e));
                      }))
                    : e
                    ? ((b = oa.valHooks[e.type] || oa.valHooks[e.nodeName.toLowerCase()]), b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : ((c = e.value), "string" == typeof c ? c.replace(Db, "") : null == c ? "" : c))
                    : void 0;
            },
        }),
            oa.extend({
                valHooks: {
                    option: {
                        get: function (a) {
                            var b = oa.find.attr(a, "value");
                            return null != b ? b : oa.trim(oa.text(a)).replace(Eb, " ");
                        },
                    },
                    select: {
                        get: function (a) {
                            for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
                                if (((c = d[i]), (c.selected || i === e) && (ma.optDisabled ? !c.disabled : null === c.getAttribute("disabled")) && (!c.parentNode.disabled || !oa.nodeName(c.parentNode, "optgroup")))) {
                                    if (((b = oa(c).val()), f)) return b;
                                    g.push(b);
                                }
                            return g;
                        },
                        set: function (a, b) {
                            for (var c, d, e = a.options, f = oa.makeArray(b), g = e.length; g--; )
                                if (((d = e[g]), oa.inArray(oa.valHooks.option.get(d), f) > -1))
                                    try {
                                        d.selected = c = !0;
                                    } catch (h) {
                                        d.scrollHeight;
                                    }
                                else d.selected = !1;
                            return c || (a.selectedIndex = -1), e;
                        },
                    },
                },
            }),
            oa.each(["radio", "checkbox"], function () {
                (oa.valHooks[this] = {
                    set: function (a, b) {
                        return oa.isArray(b) ? (a.checked = oa.inArray(oa(a).val(), b) > -1) : void 0;
                    },
                }),
                    ma.checkOn ||
                        (oa.valHooks[this].get = function (a) {
                            return null === a.getAttribute("value") ? "on" : a.value;
                        });
            });
        var Fb,
            Gb,
            Hb = oa.expr.attrHandle,
            Ib = /^(?:checked|selected)$/i,
            Jb = ma.getSetAttribute,
            Kb = ma.input;
        oa.fn.extend({
            attr: function (a, b) {
                return Oa(this, oa.attr, a, b, arguments.length > 1);
            },
            removeAttr: function (a) {
                return this.each(function () {
                    oa.removeAttr(this, a);
                });
            },
        }),
            oa.extend({
                attr: function (a, b, c) {
                    var d,
                        e,
                        f = a.nodeType;
                    if (3 !== f && 8 !== f && 2 !== f)
                        return "undefined" == typeof a.getAttribute
                            ? oa.prop(a, b, c)
                            : ((1 === f && oa.isXMLDoc(a)) || ((b = b.toLowerCase()), (e = oa.attrHooks[b] || (oa.expr.match.bool.test(b) ? Gb : Fb))),
                              void 0 !== c
                                  ? null === c
                                      ? void oa.removeAttr(a, b)
                                      : e && "set" in e && void 0 !== (d = e.set(a, c, b))
                                      ? d
                                      : (a.setAttribute(b, c + ""), c)
                                  : e && "get" in e && null !== (d = e.get(a, b))
                                  ? d
                                  : ((d = oa.find.attr(a, b)), null == d ? void 0 : d));
                },
                attrHooks: {
                    type: {
                        set: function (a, b) {
                            if (!ma.radioValue && "radio" === b && oa.nodeName(a, "input")) {
                                var c = a.value;
                                return a.setAttribute("type", b), c && (a.value = c), b;
                            }
                        },
                    },
                },
                removeAttr: function (a, b) {
                    var c,
                        d,
                        e = 0,
                        f = b && b.match(Ea);
                    if (f && 1 === a.nodeType)
                        for (; (c = f[e++]); )
                            (d = oa.propFix[c] || c), oa.expr.match.bool.test(c) ? ((Kb && Jb) || !Ib.test(c) ? (a[d] = !1) : (a[oa.camelCase("default-" + c)] = a[d] = !1)) : oa.attr(a, c, ""), a.removeAttribute(Jb ? c : d);
                },
            }),
            (Gb = {
                set: function (a, b, c) {
                    return b === !1 ? oa.removeAttr(a, c) : (Kb && Jb) || !Ib.test(c) ? a.setAttribute((!Jb && oa.propFix[c]) || c, c) : (a[oa.camelCase("default-" + c)] = a[c] = !0), c;
                },
            }),
            oa.each(oa.expr.match.bool.source.match(/\w+/g), function (a, b) {
                var c = Hb[b] || oa.find.attr;
                (Kb && Jb) || !Ib.test(b)
                    ? (Hb[b] = function (a, b, d) {
                          var e, f;
                          return d || ((f = Hb[b]), (Hb[b] = e), (e = null != c(a, b, d) ? b.toLowerCase() : null), (Hb[b] = f)), e;
                      })
                    : (Hb[b] = function (a, b, c) {
                          return c ? void 0 : a[oa.camelCase("default-" + b)] ? b.toLowerCase() : null;
                      });
            }),
            (Kb && Jb) ||
                (oa.attrHooks.value = {
                    set: function (a, b, c) {
                        return oa.nodeName(a, "input") ? void (a.defaultValue = b) : Fb && Fb.set(a, b, c);
                    },
                }),
            Jb ||
                ((Fb = {
                    set: function (a, b, c) {
                        var d = a.getAttributeNode(c);
                        return d || a.setAttributeNode((d = a.ownerDocument.createAttribute(c))), (d.value = b += ""), "value" === c || b === a.getAttribute(c) ? b : void 0;
                    },
                }),
                (Hb.id = Hb.name = Hb.coords = function (a, b, c) {
                    var d;
                    return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null;
                }),
                (oa.valHooks.button = {
                    get: function (a, b) {
                        var c = a.getAttributeNode(b);
                        return c && c.specified ? c.value : void 0;
                    },
                    set: Fb.set,
                }),
                (oa.attrHooks.contenteditable = {
                    set: function (a, b, c) {
                        Fb.set(a, "" !== b && b, c);
                    },
                }),
                oa.each(["width", "height"], function (a, b) {
                    oa.attrHooks[b] = {
                        set: function (a, c) {
                            return "" === c ? (a.setAttribute(b, "auto"), c) : void 0;
                        },
                    };
                })),
            ma.style ||
                (oa.attrHooks.style = {
                    get: function (a) {
                        return a.style.cssText || void 0;
                    },
                    set: function (a, b) {
                        return (a.style.cssText = b + "");
                    },
                });
        var Lb = /^(?:input|select|textarea|button|object)$/i,
            Mb = /^(?:a|area)$/i;
        oa.fn.extend({
            prop: function (a, b) {
                return Oa(this, oa.prop, a, b, arguments.length > 1);
            },
            removeProp: function (a) {
                return (
                    (a = oa.propFix[a] || a),
                    this.each(function () {
                        try {
                            (this[a] = void 0), delete this[a];
                        } catch (b) {}
                    })
                );
            },
        }),
            oa.extend({
                prop: function (a, b, c) {
                    var d,
                        e,
                        f = a.nodeType;
                    if (3 !== f && 8 !== f && 2 !== f)
                        return (
                            (1 === f && oa.isXMLDoc(a)) || ((b = oa.propFix[b] || b), (e = oa.propHooks[b])),
                            void 0 !== c ? (e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : (a[b] = c)) : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
                        );
                },
                propHooks: {
                    tabIndex: {
                        get: function (a) {
                            var b = oa.find.attr(a, "tabindex");
                            return b ? parseInt(b, 10) : Lb.test(a.nodeName) || (Mb.test(a.nodeName) && a.href) ? 0 : -1;
                        },
                    },
                },
                propFix: { for: "htmlFor", class: "className" },
            }),
            ma.hrefNormalized ||
                oa.each(["href", "src"], function (a, b) {
                    oa.propHooks[b] = {
                        get: function (a) {
                            return a.getAttribute(b, 4);
                        },
                    };
                }),
            ma.optSelected ||
                (oa.propHooks.selected = {
                    get: function (a) {
                        var b = a.parentNode;
                        return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null;
                    },
                    set: function (a) {
                        var b = a.parentNode;
                        b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex);
                    },
                }),
            oa.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
                oa.propFix[this.toLowerCase()] = this;
            }),
            ma.enctype || (oa.propFix.enctype = "encoding");
        var Nb = /[\t\r\n\f]/g;
        oa.fn.extend({
            addClass: function (a) {
                var b,
                    c,
                    d,
                    e,
                    f,
                    g,
                    h,
                    i = 0;
                if (oa.isFunction(a))
                    return this.each(function (b) {
                        oa(this).addClass(a.call(this, b, S(this)));
                    });
                if ("string" == typeof a && a)
                    for (b = a.match(Ea) || []; (c = this[i++]); )
                        if (((e = S(c)), (d = 1 === c.nodeType && (" " + e + " ").replace(Nb, " ")))) {
                            for (g = 0; (f = b[g++]); ) d.indexOf(" " + f + " ") < 0 && (d += f + " ");
                            (h = oa.trim(d)), e !== h && oa.attr(c, "class", h);
                        }
                return this;
            },
            removeClass: function (a) {
                var b,
                    c,
                    d,
                    e,
                    f,
                    g,
                    h,
                    i = 0;
                if (oa.isFunction(a))
                    return this.each(function (b) {
                        oa(this).removeClass(a.call(this, b, S(this)));
                    });
                if (!arguments.length) return this.attr("class", "");
                if ("string" == typeof a && a)
                    for (b = a.match(Ea) || []; (c = this[i++]); )
                        if (((e = S(c)), (d = 1 === c.nodeType && (" " + e + " ").replace(Nb, " ")))) {
                            for (g = 0; (f = b[g++]); ) for (; d.indexOf(" " + f + " ") > -1; ) d = d.replace(" " + f + " ", " ");
                            (h = oa.trim(d)), e !== h && oa.attr(c, "class", h);
                        }
                return this;
            },
            toggleClass: function (a, b) {
                var c = "undefined" == typeof a ? "undefined" : _typeof(a);
                return "boolean" == typeof b && "string" === c
                    ? b
                        ? this.addClass(a)
                        : this.removeClass(a)
                    : oa.isFunction(a)
                    ? this.each(function (c) {
                          oa(this).toggleClass(a.call(this, c, S(this), b), b);
                      })
                    : this.each(function () {
                          var b, d, e, f;
                          if ("string" === c) for (d = 0, e = oa(this), f = a.match(Ea) || []; (b = f[d++]); ) e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
                          else (void 0 !== a && "boolean" !== c) || ((b = S(this)), b && oa._data(this, "__className__", b), oa.attr(this, "class", b || a === !1 ? "" : oa._data(this, "__className__") || ""));
                      });
            },
            hasClass: function (a) {
                var b,
                    c,
                    d = 0;
                for (b = " " + a + " "; (c = this[d++]); ) if (1 === c.nodeType && (" " + S(c) + " ").replace(Nb, " ").indexOf(b) > -1) return !0;
                return !1;
            },
        }),
            oa.each(
                "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),
                function (a, b) {
                    oa.fn[b] = function (a, c) {
                        return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b);
                    };
                }
            ),
            oa.fn.extend({
                hover: function (a, b) {
                    return this.mouseenter(a).mouseleave(b || a);
                },
            });
        var Ob = a.location,
            Pb = oa.now(),
            Qb = /\?/,
            Rb = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
        (oa.parseJSON = function (b) {
            if (a.JSON && a.JSON.parse) return a.JSON.parse(b + "");
            var c,
                d = null,
                e = oa.trim(b + "");
            return e &&
                !oa.trim(
                    e.replace(Rb, function (a, b, e, f) {
                        return c && b && (d = 0), 0 === d ? a : ((c = e || b), (d += !f - !e), "");
                    })
                )
                ? Function("return " + e)()
                : oa.error("Invalid JSON: " + b);
        }),
            (oa.parseXML = function (b) {
                var c, d;
                if (!b || "string" != typeof b) return null;
                try {
                    a.DOMParser ? ((d = new a.DOMParser()), (c = d.parseFromString(b, "text/xml"))) : ((c = new a.ActiveXObject("Microsoft.XMLDOM")), (c.async = "false"), c.loadXML(b));
                } catch (e) {
                    c = void 0;
                }
                return (c && c.documentElement && !c.getElementsByTagName("parsererror").length) || oa.error("Invalid XML: " + b), c;
            });
        var Sb = /#.*$/,
            Tb = /([?&])_=[^&]*/,
            Ub = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
            Vb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            Wb = /^(?:GET|HEAD)$/,
            Xb = /^\/\//,
            Yb = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
            Zb = {},
            $b = {},
            _b = "*/".concat("*"),
            ac = Ob.href,
            bc = Yb.exec(ac.toLowerCase()) || [];
        oa.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: ac,
                type: "GET",
                isLocal: Vb.test(bc[1]),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: { "*": _b, text: "text/plain", html: "text/html", xml: "application/xml, text/xml", json: "application/json, text/javascript" },
                contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ },
                responseFields: { xml: "responseXML", text: "responseText", json: "responseJSON" },
                converters: { "* text": String, "text html": !0, "text json": oa.parseJSON, "text xml": oa.parseXML },
                flatOptions: { url: !0, context: !0 },
            },
            ajaxSetup: function (a, b) {
                return b ? V(V(a, oa.ajaxSettings), b) : V(oa.ajaxSettings, a);
            },
            ajaxPrefilter: T(Zb),
            ajaxTransport: T($b),
            ajax: function (b, c) {
                function d(b, c, d, e) {
                    var f,
                        l,
                        s,
                        t,
                        v,
                        x = c;
                    2 !== u &&
                        ((u = 2),
                        i && a.clearTimeout(i),
                        (k = void 0),
                        (h = e || ""),
                        (w.readyState = b > 0 ? 4 : 0),
                        (f = (b >= 200 && 300 > b) || 304 === b),
                        d && (t = W(m, w, d)),
                        (t = X(m, t, w, f)),
                        f
                            ? (m.ifModified && ((v = w.getResponseHeader("Last-Modified")), v && (oa.lastModified[g] = v), (v = w.getResponseHeader("etag")), v && (oa.etag[g] = v)),
                              204 === b || "HEAD" === m.type ? (x = "nocontent") : 304 === b ? (x = "notmodified") : ((x = t.state), (l = t.data), (s = t.error), (f = !s)))
                            : ((s = x), (!b && x) || ((x = "error"), 0 > b && (b = 0))),
                        (w.status = b),
                        (w.statusText = (c || x) + ""),
                        f ? p.resolveWith(n, [l, x, w]) : p.rejectWith(n, [w, x, s]),
                        w.statusCode(r),
                        (r = void 0),
                        j && o.trigger(f ? "ajaxSuccess" : "ajaxError", [w, m, f ? l : s]),
                        q.fireWith(n, [w, x]),
                        j && (o.trigger("ajaxComplete", [w, m]), --oa.active || oa.event.trigger("ajaxStop")));
                }
                "object" == ("undefined" == typeof b ? "undefined" : _typeof(b)) && ((c = b), (b = void 0)), (c = c || {});
                var e,
                    f,
                    g,
                    h,
                    i,
                    j,
                    k,
                    l,
                    m = oa.ajaxSetup({}, c),
                    n = m.context || m,
                    o = m.context && (n.nodeType || n.jquery) ? oa(n) : oa.event,
                    p = oa.Deferred(),
                    q = oa.Callbacks("once memory"),
                    r = m.statusCode || {},
                    s = {},
                    t = {},
                    u = 0,
                    v = "canceled",
                    w = {
                        readyState: 0,
                        getResponseHeader: function (a) {
                            var b;
                            if (2 === u) {
                                if (!l) for (l = {}; (b = Ub.exec(h)); ) l[b[1].toLowerCase()] = b[2];
                                b = l[a.toLowerCase()];
                            }
                            return null == b ? null : b;
                        },
                        getAllResponseHeaders: function () {
                            return 2 === u ? h : null;
                        },
                        setRequestHeader: function (a, b) {
                            var c = a.toLowerCase();
                            return u || ((a = t[c] = t[c] || a), (s[a] = b)), this;
                        },
                        overrideMimeType: function (a) {
                            return u || (m.mimeType = a), this;
                        },
                        statusCode: function (a) {
                            var b;
                            if (a)
                                if (2 > u) for (b in a) r[b] = [r[b], a[b]];
                                else w.always(a[w.status]);
                            return this;
                        },
                        abort: function (a) {
                            var b = a || v;
                            return k && k.abort(b), d(0, b), this;
                        },
                    };
                if (
                    ((p.promise(w).complete = q.add),
                    (w.success = w.done),
                    (w.error = w.fail),
                    (m.url = ((b || m.url || ac) + "").replace(Sb, "").replace(Xb, bc[1] + "//")),
                    (m.type = c.method || c.type || m.method || m.type),
                    (m.dataTypes = oa
                        .trim(m.dataType || "*")
                        .toLowerCase()
                        .match(Ea) || [""]),
                    null == m.crossDomain &&
                        ((e = Yb.exec(m.url.toLowerCase())), (m.crossDomain = !(!e || (e[1] === bc[1] && e[2] === bc[2] && (e[3] || ("http:" === e[1] ? "80" : "443")) === (bc[3] || ("http:" === bc[1] ? "80" : "443")))))),
                    m.data && m.processData && "string" != typeof m.data && (m.data = oa.param(m.data, m.traditional)),
                    U(Zb, m, c, w),
                    2 === u)
                )
                    return w;
                (j = oa.event && m.global),
                    j && 0 === oa.active++ && oa.event.trigger("ajaxStart"),
                    (m.type = m.type.toUpperCase()),
                    (m.hasContent = !Wb.test(m.type)),
                    (g = m.url),
                    m.hasContent || (m.data && ((g = m.url += (Qb.test(g) ? "&" : "?") + m.data), delete m.data), m.cache === !1 && (m.url = Tb.test(g) ? g.replace(Tb, "$1_=" + Pb++) : g + (Qb.test(g) ? "&" : "?") + "_=" + Pb++)),
                    m.ifModified && (oa.lastModified[g] && w.setRequestHeader("If-Modified-Since", oa.lastModified[g]), oa.etag[g] && w.setRequestHeader("If-None-Match", oa.etag[g])),
                    ((m.data && m.hasContent && m.contentType !== !1) || c.contentType) && w.setRequestHeader("Content-Type", m.contentType),
                    w.setRequestHeader("Accept", m.dataTypes[0] && m.accepts[m.dataTypes[0]] ? m.accepts[m.dataTypes[0]] + ("*" !== m.dataTypes[0] ? ", " + _b + "; q=0.01" : "") : m.accepts["*"]);
                for (f in m.headers) w.setRequestHeader(f, m.headers[f]);
                if (m.beforeSend && (m.beforeSend.call(n, w, m) === !1 || 2 === u)) return w.abort();
                v = "abort";
                for (f in { success: 1, error: 1, complete: 1 }) w[f](m[f]);
                if ((k = U($b, m, c, w))) {
                    if (((w.readyState = 1), j && o.trigger("ajaxSend", [w, m]), 2 === u)) return w;
                    m.async &&
                        m.timeout > 0 &&
                        (i = a.setTimeout(function () {
                            w.abort("timeout");
                        }, m.timeout));
                    try {
                        (u = 1), k.send(s, d);
                    } catch (x) {
                        if (!(2 > u)) throw x;
                        d(-1, x);
                    }
                } else d(-1, "No Transport");
                return w;
            },
            getJSON: function (a, b, c) {
                return oa.get(a, b, c, "json");
            },
            getScript: function (a, b) {
                return oa.get(a, void 0, b, "script");
            },
        }),
            oa.each(["get", "post"], function (a, b) {
                oa[b] = function (a, c, d, e) {
                    return oa.isFunction(c) && ((e = e || d), (d = c), (c = void 0)), oa.ajax(oa.extend({ url: a, type: b, dataType: e, data: c, success: d }, oa.isPlainObject(a) && a));
                };
            }),
            (oa._evalUrl = function (a) {
                return oa.ajax({ url: a, type: "GET", dataType: "script", cache: !0, async: !1, global: !1, throws: !0 });
            }),
            oa.fn.extend({
                wrapAll: function (a) {
                    if (oa.isFunction(a))
                        return this.each(function (b) {
                            oa(this).wrapAll(a.call(this, b));
                        });
                    if (this[0]) {
                        var b = oa(a, this[0].ownerDocument).eq(0).clone(!0);
                        this[0].parentNode && b.insertBefore(this[0]),
                            b
                                .map(function () {
                                    for (var a = this; a.firstChild && 1 === a.firstChild.nodeType; ) a = a.firstChild;
                                    return a;
                                })
                                .append(this);
                    }
                    return this;
                },
                wrapInner: function (a) {
                    return oa.isFunction(a)
                        ? this.each(function (b) {
                              oa(this).wrapInner(a.call(this, b));
                          })
                        : this.each(function () {
                              var b = oa(this),
                                  c = b.contents();
                              c.length ? c.wrapAll(a) : b.append(a);
                          });
                },
                wrap: function (a) {
                    var b = oa.isFunction(a);
                    return this.each(function (c) {
                        oa(this).wrapAll(b ? a.call(this, c) : a);
                    });
                },
                unwrap: function () {
                    return this.parent()
                        .each(function () {
                            oa.nodeName(this, "body") || oa(this).replaceWith(this.childNodes);
                        })
                        .end();
                },
            }),
            (oa.expr.filters.hidden = function (a) {
                return ma.reliableHiddenOffsets() ? a.offsetWidth <= 0 && a.offsetHeight <= 0 && !a.getClientRects().length : Z(a);
            }),
            (oa.expr.filters.visible = function (a) {
                return !oa.expr.filters.hidden(a);
            });
        var cc = /%20/g,
            dc = /\[\]$/,
            ec = /\r?\n/g,
            fc = /^(?:submit|button|image|reset|file)$/i,
            gc = /^(?:input|select|textarea|keygen)/i;
        (oa.param = function (a, b) {
            var c,
                d = [],
                e = function (a, b) {
                    (b = oa.isFunction(b) ? b() : null == b ? "" : b), (d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b));
                };
            if ((void 0 === b && (b = oa.ajaxSettings && oa.ajaxSettings.traditional), oa.isArray(a) || (a.jquery && !oa.isPlainObject(a))))
                oa.each(a, function () {
                    e(this.name, this.value);
                });
            else for (c in a) _(c, a[c], b, e);
            return d.join("&").replace(cc, "+");
        }),
            oa.fn.extend({
                serialize: function () {
                    return oa.param(this.serializeArray());
                },
                serializeArray: function () {
                    return this.map(function () {
                        var a = oa.prop(this, "elements");
                        return a ? oa.makeArray(a) : this;
                    })
                        .filter(function () {
                            var a = this.type;
                            return this.name && !oa(this).is(":disabled") && gc.test(this.nodeName) && !fc.test(a) && (this.checked || !Pa.test(a));
                        })
                        .map(function (a, b) {
                            var c = oa(this).val();
                            return null == c
                                ? null
                                : oa.isArray(c)
                                ? oa.map(c, function (a) {
                                      return { name: b.name, value: a.replace(ec, "\r\n") };
                                  })
                                : { name: b.name, value: c.replace(ec, "\r\n") };
                        })
                        .get();
                },
            }),
            (oa.ajaxSettings.xhr =
                void 0 !== a.ActiveXObject
                    ? function () {
                          return this.isLocal ? ba() : ea.documentMode > 8 ? aa() : (/^(get|post|head|put|delete|options)$/i.test(this.type) && aa()) || ba();
                      }
                    : aa);
        var hc = 0,
            ic = {},
            jc = oa.ajaxSettings.xhr();
        a.attachEvent &&
            a.attachEvent("onunload", function () {
                for (var a in ic) ic[a](void 0, !0);
            }),
            (ma.cors = !!jc && "withCredentials" in jc),
            (jc = ma.ajax = !!jc),
            jc &&
                oa.ajaxTransport(function (b) {
                    if (!b.crossDomain || ma.cors) {
                        var c;
                        return {
                            send: function (d, e) {
                                var f,
                                    g = b.xhr(),
                                    h = ++hc;
                                if ((g.open(b.type, b.url, b.async, b.username, b.password), b.xhrFields)) for (f in b.xhrFields) g[f] = b.xhrFields[f];
                                b.mimeType && g.overrideMimeType && g.overrideMimeType(b.mimeType), b.crossDomain || d["X-Requested-With"] || (d["X-Requested-With"] = "XMLHttpRequest");
                                for (f in d) void 0 !== d[f] && g.setRequestHeader(f, d[f] + "");
                                g.send((b.hasContent && b.data) || null),
                                    (c = function (a, d) {
                                        var f, i, j;
                                        if (c && (d || 4 === g.readyState))
                                            if ((delete ic[h], (c = void 0), (g.onreadystatechange = oa.noop), d)) 4 !== g.readyState && g.abort();
                                            else {
                                                (j = {}), (f = g.status), "string" == typeof g.responseText && (j.text = g.responseText);
                                                try {
                                                    i = g.statusText;
                                                } catch (k) {
                                                    i = "";
                                                }
                                                f || !b.isLocal || b.crossDomain ? 1223 === f && (f = 204) : (f = j.text ? 200 : 404);
                                            }
                                        j && e(f, i, j, g.getAllResponseHeaders());
                                    }),
                                    b.async ? (4 === g.readyState ? a.setTimeout(c) : (g.onreadystatechange = ic[h] = c)) : c();
                            },
                            abort: function () {
                                c && c(void 0, !0);
                            },
                        };
                    }
                }),
            oa.ajaxPrefilter(function (a) {
                a.crossDomain && (a.contents.script = !1);
            }),
            oa.ajaxSetup({
                accepts: { script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" },
                contents: { script: /\b(?:java|ecma)script\b/ },
                converters: {
                    "text script": function (a) {
                        return oa.globalEval(a), a;
                    },
                },
            }),
            oa.ajaxPrefilter("script", function (a) {
                void 0 === a.cache && (a.cache = !1), a.crossDomain && ((a.type = "GET"), (a.global = !1));
            }),
            oa.ajaxTransport("script", function (a) {
                if (a.crossDomain) {
                    var b,
                        c = ea.head || oa("head")[0] || ea.documentElement;
                    return {
                        send: function (d, e) {
                            (b = ea.createElement("script")),
                                (b.async = !0),
                                a.scriptCharset && (b.charset = a.scriptCharset),
                                (b.src = a.url),
                                (b.onload = b.onreadystatechange = function (a, c) {
                                    (c || !b.readyState || /loaded|complete/.test(b.readyState)) && ((b.onload = b.onreadystatechange = null), b.parentNode && b.parentNode.removeChild(b), (b = null), c || e(200, "success"));
                                }),
                                c.insertBefore(b, c.firstChild);
                        },
                        abort: function () {
                            b && b.onload(void 0, !0);
                        },
                    };
                }
            });
        var kc = [],
            lc = /(=)\?(?=&|$)|\?\?/;
        oa.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function () {
                var a = kc.pop() || oa.expando + "_" + Pb++;
                return (this[a] = !0), a;
            },
        }),
            oa.ajaxPrefilter("json jsonp", function (b, c, d) {
                var e,
                    f,
                    g,
                    h = b.jsonp !== !1 && (lc.test(b.url) ? "url" : "string" == typeof b.data && 0 === (b.contentType || "").indexOf("application/x-www-form-urlencoded") && lc.test(b.data) && "data");
                return h || "jsonp" === b.dataTypes[0]
                    ? ((e = b.jsonpCallback = oa.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback),
                      h ? (b[h] = b[h].replace(lc, "$1" + e)) : b.jsonp !== !1 && (b.url += (Qb.test(b.url) ? "&" : "?") + b.jsonp + "=" + e),
                      (b.converters["script json"] = function () {
                          return g || oa.error(e + " was not called"), g[0];
                      }),
                      (b.dataTypes[0] = "json"),
                      (f = a[e]),
                      (a[e] = function () {
                          g = arguments;
                      }),
                      d.always(function () {
                          void 0 === f ? oa(a).removeProp(e) : (a[e] = f), b[e] && ((b.jsonpCallback = c.jsonpCallback), kc.push(e)), g && oa.isFunction(f) && f(g[0]), (g = f = void 0);
                      }),
                      "script")
                    : void 0;
            }),
            (oa.parseHTML = function (a, b, c) {
                if (!a || "string" != typeof a) return null;
                "boolean" == typeof b && ((c = b), (b = !1)), (b = b || ea);
                var d = xa.exec(a),
                    e = !c && [];
                return d ? [b.createElement(d[1])] : ((d = r([a], b, e)), e && e.length && oa(e).remove(), oa.merge([], d.childNodes));
            });
        var mc = oa.fn.load;
        (oa.fn.load = function (a, b, c) {
            if ("string" != typeof a && mc) return mc.apply(this, arguments);
            var d,
                e,
                f,
                g = this,
                h = a.indexOf(" ");
            return (
                h > -1 && ((d = oa.trim(a.slice(h, a.length))), (a = a.slice(0, h))),
                oa.isFunction(b) ? ((c = b), (b = void 0)) : b && "object" == ("undefined" == typeof b ? "undefined" : _typeof(b)) && (e = "POST"),
                g.length > 0 &&
                    oa
                        .ajax({ url: a, type: e || "GET", dataType: "html", data: b })
                        .done(function (a) {
                            (f = arguments), g.html(d ? oa("<div>").append(oa.parseHTML(a)).find(d) : a);
                        })
                        .always(
                            c &&
                                function (a, b) {
                                    g.each(function () {
                                        c.apply(g, f || [a.responseText, b, a]);
                                    });
                                }
                        ),
                this
            );
        }),
            oa.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (a, b) {
                oa.fn[b] = function (a) {
                    return this.on(b, a);
                };
            }),
            (oa.expr.filters.animated = function (a) {
                return oa.grep(oa.timers, function (b) {
                    return a === b.elem;
                }).length;
            }),
            (oa.offset = {
                setOffset: function (a, b, c) {
                    var d,
                        e,
                        f,
                        g,
                        h,
                        i,
                        j,
                        k = oa.css(a, "position"),
                        l = oa(a),
                        m = {};
                    "static" === k && (a.style.position = "relative"),
                        (h = l.offset()),
                        (f = oa.css(a, "top")),
                        (i = oa.css(a, "left")),
                        (j = ("absolute" === k || "fixed" === k) && oa.inArray("auto", [f, i]) > -1),
                        j ? ((d = l.position()), (g = d.top), (e = d.left)) : ((g = parseFloat(f) || 0), (e = parseFloat(i) || 0)),
                        oa.isFunction(b) && (b = b.call(a, c, oa.extend({}, h))),
                        null != b.top && (m.top = b.top - h.top + g),
                        null != b.left && (m.left = b.left - h.left + e),
                        "using" in b ? b.using.call(a, m) : l.css(m);
                },
            }),
            oa.fn.extend({
                offset: function (a) {
                    if (arguments.length)
                        return void 0 === a
                            ? this
                            : this.each(function (b) {
                                  oa.offset.setOffset(this, a, b);
                              });
                    var b,
                        c,
                        d = { top: 0, left: 0 },
                        e = this[0],
                        f = e && e.ownerDocument;
                    return f
                        ? ((b = f.documentElement),
                          oa.contains(b, e)
                              ? ("undefined" != typeof e.getBoundingClientRect && (d = e.getBoundingClientRect()),
                                (c = ca(f)),
                                { top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0), left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0) })
                              : d)
                        : void 0;
                },
                position: function () {
                    if (this[0]) {
                        var a,
                            b,
                            c = { top: 0, left: 0 },
                            d = this[0];
                        return (
                            "fixed" === oa.css(d, "position")
                                ? (b = d.getBoundingClientRect())
                                : ((a = this.offsetParent()), (b = this.offset()), oa.nodeName(a[0], "html") || (c = a.offset()), (c.top += oa.css(a[0], "borderTopWidth", !0)), (c.left += oa.css(a[0], "borderLeftWidth", !0))),
                            { top: b.top - c.top - oa.css(d, "marginTop", !0), left: b.left - c.left - oa.css(d, "marginLeft", !0) }
                        );
                    }
                },
                offsetParent: function () {
                    return this.map(function () {
                        for (var a = this.offsetParent; a && !oa.nodeName(a, "html") && "static" === oa.css(a, "position"); ) a = a.offsetParent;
                        return a || nb;
                    });
                },
            }),
            oa.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (a, b) {
                var c = /Y/.test(b);
                oa.fn[a] = function (d) {
                    return Oa(
                        this,
                        function (a, d, e) {
                            var f = ca(a);
                            return void 0 === e ? (f ? (b in f ? f[b] : f.document.documentElement[d]) : a[d]) : void (f ? f.scrollTo(c ? oa(f).scrollLeft() : e, c ? e : oa(f).scrollTop()) : (a[d] = e));
                        },
                        a,
                        d,
                        arguments.length,
                        null
                    );
                };
            }),
            oa.each(["top", "left"], function (a, b) {
                oa.cssHooks[b] = F(ma.pixelPosition, function (a, c) {
                    return c ? ((c = pb(a, b)), lb.test(c) ? oa(a).position()[b] + "px" : c) : void 0;
                });
            }),
            oa.each({ Height: "height", Width: "width" }, function (a, b) {
                oa.each({ padding: "inner" + a, content: b, "": "outer" + a }, function (c, d) {
                    oa.fn[d] = function (d, e) {
                        var f = arguments.length && (c || "boolean" != typeof d),
                            g = c || (d === !0 || e === !0 ? "margin" : "border");
                        return Oa(
                            this,
                            function (b, c, d) {
                                var e;
                                return oa.isWindow(b)
                                    ? b.document.documentElement["client" + a]
                                    : 9 === b.nodeType
                                    ? ((e = b.documentElement), Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a]))
                                    : void 0 === d
                                    ? oa.css(b, c, g)
                                    : oa.style(b, c, d, g);
                            },
                            b,
                            f ? d : void 0,
                            f,
                            null
                        );
                    };
                });
            }),
            oa.fn.extend({
                bind: function (a, b, c) {
                    return this.on(a, null, b, c);
                },
                unbind: function (a, b) {
                    return this.off(a, null, b);
                },
                delegate: function (a, b, c, d) {
                    return this.on(b, a, c, d);
                },
                undelegate: function (a, b, c) {
                    return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c);
                },
            }),
            (oa.fn.size = function () {
                return this.length;
            }),
            (oa.fn.andSelf = oa.fn.addBack),
            "function" == typeof define &&
                define.amd &&
                define("jquery", [], function () {
                    return oa;
                });
        var nc = a.jQuery,
            oc = a.$;
        return (
            (oa.noConflict = function (b) {
                return a.$ === oa && (a.$ = oc), b && a.jQuery === oa && (a.jQuery = nc), oa;
            }),
            b || (a.jQuery = a.$ = oa),
            oa
        );
    });
var LOCAL = !1,
    BETA = !1,
    AUDIO_NONE_STATE = 0,
    AUDIO_PLAY_STATE = 1,
    AUDIO_PAUSE_STATE = 2,
    NOT_STARTED = 0,
    PAUSED = 1,
    ENDED = 2,
    PLAYING = 3,
    ERROR = 4,
    NO_INDEX = 101,
    PLAY_MP4 = "play_mp4",
    BASE_LINK = "unacademy.link";
    BASE_LINK = window.location && window.location.href && window.location.href.indexOf(BASE_LINK) >= 0 ? "unacademy.link" : "uacdn.net";
    var DEFAULT_BASE_URL = "https://player." + BASE_LINK + "/lesson-raw/",
    HTTP_DEFAULT_BASE_URL = "http://player." + BASE_LINK + "/lesson-raw/",
    AUDIO_URL_BASE = "https://edge." + BASE_LINK + "/",
    HTTP_AUDIO_URL_BASE = "http://edge." + BASE_LINK + "/",
    HTTPS_HLS_AUDIO_URL_BASE = "https://streaming." + BASE_LINK + "/",
    HTTP_HLS_AUDIO_URL_BASE = "http://streaming." + BASE_LINK + "/",
    HLS_AUDIO_URL_BASE = HTTPS_HLS_AUDIO_URL_BASE,
    IMAGE_URL_BASE = "https://edge." + BASE_LINK + "/",
    HTTP_IMAGE_URL_BASE = "http://edge." + BASE_LINK + "/",
    IMAGE_BACKUP_URL_BASE = IMAGE_URL_BASE,
    SLASH = "/",
    META_FILE_NAME = "meta.json";
    "https:" != window.location.protocol &&
    ((DEFAULT_BASE_URL = HTTP_DEFAULT_BASE_URL), (AUDIO_URL_BASE = HTTP_AUDIO_URL_BASE), (IMAGE_URL_BASE = HTTP_IMAGE_URL_BASE), (IMAGE_BACKUP_URL_BASE = IMAGE_URL_BASE), (HLS_AUDIO_URL_BASE = HTTP_HLS_AUDIO_URL_BASE)),
    LOCAL && (DEFAULT_BASE_URL = "./"),
    BETA && ((DEFAULT_BASE_URL = "https://d5vb3dmm3qfja.cloudfront.net/"), (IMAGE_BACKUP_URL_BASE = DEFAULT_BASE_URL), (IMAGE_URL_BASE = DEFAULT_BASE_URL), (AUDIO_URL_BASE = DEFAULT_BASE_URL));
    var PLAYER_MODE = { PLAYER: "player", SLIDE: "slide" },
    EVENTS = {
        ERROR: "ERROR",
        VOLUME_CHANGE: "VOLUME_CHANGE",
        INITIALIZED: "INITIALIZED",
        META_LOADED: "META_LOADED",
        EVENTS_LOADED: "EVENTS_LOADED",
        END: "END",
        WATCHED: "WATCHED",
        LOADING: "LOADING",
        LOADED: "LOADED",
        PLAY: "PLAY",
        LOADING_TIME: "LOADING_TIME",
        PAUSE: "PAUSE",
        SEEK: "SEEK",
        ENTER_FULLSCRREN: "ENTER_FULLSCRREN",
        EXIT_FULLSCREEN: "EXIT_FULLSCREEN",
        FULLSCREEN_REQUEST: "FULLSCREEN_REQUEST",
        STATE_CHANGE: "STATE_CHANGE",
        USER_AGENT: "USER_AGENT",
        PLAYBACK_RATE_CHANGE: "PLAYBACK_RATE_CHANGE",
        BROWSER_ID: "BROWSER_ID",
        SLIDE_MODE_ENTER: "SLIDE_MODE_ENTER",
        SLIDE_MODE_EXIT: "SLIDE_MODE_EXIT",
        SLIDE_MODE_CHANGED: "SLIDE_MODE_CHANGED",
        WATCH_START: "WATCH_START",
        WATCH_END: "WATCH_END",
        WATCH_PER_SEC: "WATCH_PER_SEC",
    },
    maths = (function () {
        function a() {}
        return (
            (a.zeros_Xx2x2 = function (a) {
                for (var b = []; a--; ) b.push([0, 0]);
                return b;
            }),
            (a.mulItems = function (a, b) {
                return [a[0] * b, a[1] * b];
            }),
            (a.mulMatrix = function (a, b) {
                return a[0] * b[0] + a[1] * b[1];
            }),
            (a.subtract = function (a, b) {
                return [a[0] - b[0], a[1] - b[1]];
            }),
            (a.addArrays = function (a, b) {
                return isNaN(a[0]) || isNaN(a[1]), [a[0] + b[0], a[1] + b[1]];
            }),
            (a.addItems = function (a, b) {
                return [a[0] + b, a[1] + b];
            }),
            (a.sum = function (a) {
                return a.reduce(function (a, b) {
                    return a + b;
                });
            }),
            (a.dot = function (b, c) {
                return a.mulMatrix(b, c);
            }),
            (a.vectorLen = function (a) {
                var b = a[0],
                    c = a[1];
                return Math.sqrt(b * b + c * c);
            }),
            (a.divItems = function (a, b) {
                return [a[0] / b, a[1] / b];
            }),
            (a.squareItems = function (a) {
                var b = a[0],
                    c = a[1];
                return [b * b, c * c];
            }),
            (a.normalize = function (a) {
                return this.divItems(a, this.vectorLen(a));
            }),
            a
        );
    })(),
    bezier = (function () {
        function a() {}
        return (
            (a.q = function (a, b) {
                var c = 1 - b,
                    d = maths.mulItems(a[0], c * c * c),
                    e = maths.mulItems(a[1], 3 * c * c * b),
                    f = maths.mulItems(a[2], 3 * c * b * b),
                    g = maths.mulItems(a[3], b * b * b);
                return maths.addArrays(maths.addArrays(d, e), maths.addArrays(f, g));
            }),
            (a.qprime = function (a, b) {
                var c = 1 - b,
                    d = maths.mulItems(maths.subtract(a[1], a[0]), 3 * c * c),
                    e = maths.mulItems(maths.subtract(a[2], a[1]), 6 * c * b),
                    f = maths.mulItems(maths.subtract(a[3], a[2]), 3 * b * b);
                return maths.addArrays(maths.addArrays(d, e), f);
            }),
            (a.qprimeprime = function (a, b) {
                return maths.addArrays(maths.mulItems(maths.addArrays(maths.subtract(a[2], maths.mulItems(a[1], 2)), a[0]), 6 * (1 - b)), maths.mulItems(maths.addArrays(maths.subtract(a[3], maths.mulItems(a[2], 2)), a[1]), 6 * b));
            }),
            a
        );
    })();
!(function () {
    function a(a, b) {
        var c = a.x - b.x,
            d = a.y - b.y;
        return c * c + d * d;
    }
    function b(a, b, c) {
        var d = b.x,
            e = b.y,
            f = c.x - d,
            g = c.y - e;
        if (0 !== f || 0 !== g) {
            var h = ((a.x - d) * f + (a.y - e) * g) / (f * f + g * g);
            h > 1 ? ((d = c.x), (e = c.y)) : h > 0 && ((d += f * h), (e += g * h));
        }
        return (f = a.x - d), (g = a.y - e), f * f + g * g;
    }
    function c(b, c) {
        for (var d, e = b[0], f = [e], g = 1, h = b.length; g < h; g++) (d = b[g]), a(d, e) > c && (f.push(d), (e = d));
        return e !== d && f.push(d), f;
    }
    function d(a, c, e, f, g) {
        for (var h, i = f, j = c + 1; j < e; j++) {
            var k = b(a[j], a[c], a[e]);
            k > i && ((h = j), (i = k));
        }
        i > f && (h - c > 1 && d(a, c, h, f, g), g.push(a[h]), e - h > 1 && d(a, h, e, f, g));
    }
    function e(a, b) {
        var c = a.length - 1,
            e = [a[0]];
        return d(a, 0, c, b, e), e.push(a[c]), e;
    }
    function f(a, b, d) {
        if (a.length <= 2) return a;
        var f = void 0 !== b ? b * b : 1;
        return (a = d ? a : c(a, f)), (a = e(a, f));
    }
    "function" == typeof define && define.amd
        ? define(function () {
              return f;
          })
        : "undefined" != typeof module
        ? (module.exports = f)
        : "undefined" != typeof self
        ? (self.simplify = f)
        : (window.simplify = f);
})(),
    window.Promise || (window.Promise = document.Promise),
    $.fn.extend({
        animateCss: function (a) {
            var b = this,
                c = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "none",
                d = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend oAnimationEnd animationEnd";
            return (
                $(this).hide(),
                $(this).removeClass("animated " + a),
                setTimeout(function () {
                    $(b).attr("state", c),
                        $(b).show(),
                        $(b)
                            .addClass("animated " + a)
                            .one(d, function () {
                                $(this).hide(), $(this).removeClass("animated " + a);
                            });
                }, 1),
                setTimeout(function () {
                    $(b).is(":visible") && $(b).hide();
                }, 1e3)
            );
        },
    }),
    (window.requestAnimationFrame = (function () {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function (a) {
                return window.setTimeout(a, 1e3 / 60);
            }
        );
    })()),
    (window.cancelAnimationFrame =
        window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        function (a) {
            window.clearTimeout(a);
        }),
    (Array.prototype.binarySearch = function (a, b) {
        for (var c = 0, d = this.length - 1, e = void 0; c <= d; ) {
            e = parseInt((c + d) / 2);
            var f = b(this[e], a);
            if (f < 0) c = e + 1;
            else {
                if (!(f > 0)) return e;
                d = e - 1;
            }
        }
        return c - 1 >= 0 ? c - 1 : 0;
    }),
    (function ($) {
        $.event.special.doubletap = {
            bindType: "touchend",
            delegateType: "touchend",
            handle: function (a) {
                var b = a.handleObj,
                    c = jQuery.data(a.target),
                    d = new Date().getTime(),
                    e = c.lastTouch ? d - c.lastTouch : 0,
                    f = null == f ? 300 : f;
                e < f && e > 30
                    ? ((c.lastTouch = null),
                      (a.type = b.origType),
                      ["clientX", "clientY", "pageX", "pageY"].forEach(function (b) {
                          a[b] = a.originalEvent.changedTouches[0][b];
                      }),
                      b.handler.apply(this, arguments))
                    : (c.lastTouch = d);
            },
        };
    })(jQuery);
var LocalStorage = (function () {
        function a() {
            _classCallCheck(this, a);
        }
        return (
            _createClass(a, [
                {
                    key: "lsTest",
                    value: function () {
                        var a = "test";
                        try {
                            return localStorage.setItem(a, a), localStorage.removeItem(a), !0;
                        } catch (b) {
                            return !1;
                        }
                    },
                },
                {
                    key: "getItem",
                    value: function (a) {
                        try {
                            return localStorage.getItem(a);
                        } catch (b) {
                            return console.log("localStorage not available."), null;
                        }
                    },
                },
                {
                    key: "setItem",
                    value: function (a, b) {
                        try {
                            localStorage.setItem(a, b);
                        } catch (c) {
                            return console.log("localStorage not available."), null;
                        }
                    },
                },
                {
                    key: "clearItem",
                    value: function (a) {
                        try {
                            delete localStorage[a];
                        } catch (b) {
                            console.log("localStorage not available.");
                        }
                    },
                },
                {
                    key: "setItemWithExpiry",
                    value: function (a, b, c) {
                        try {
                            localStorage.setItem(a, JSON.stringify({ val: b, time: new Date().getTime() + c }));
                        } catch (d) {
                            return console.log("localStorage not available."), null;
                        }
                    },
                },
                {
                    key: "getItemWithExpiry",
                    value: function (a) {
                        try {
                            var b = JSON.parse(localStorage.getItem(a));
                            return !b.time || new Date().getTime() - b.time >= 0 ? (localStorage.removeItem(a), null) : b.val;
                        } catch (c) {
                            return console.log("localStorage not available."), null;
                        }
                    },
                },
            ]),
            a
        );
    })(),
    UserAgent = (function () {
        function a() {
            _classCallCheck(this, a),
                (this.browser = a._browserSniff()),
                (this.ua = {
                    Android: /Android/gi.test(navigator.userAgent),
                    iOS: /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent),
                    oldIE: "IE" === this.browser.BROWSER_NAME && this.browser.BROWSER_VERSION <= 9,
                });
        }
        return (
            _createClass(a, null, [
                {
                    key: "_browserSniff",
                    value: function () {
                        var a,
                            b,
                            c,
                            d = navigator.userAgent,
                            e = navigator.appName,
                            f = "" + parseFloat(navigator.appVersion),
                            g = parseInt(navigator.appVersion, 10);
                        return (
                            navigator.appVersion.indexOf("Windows NT") !== -1 && navigator.appVersion.indexOf("rv:11") !== -1
                                ? ((e = "IE"), (f = "11;"))
                                : (b = d.indexOf("MSIE")) !== -1
                                ? ((e = "IE"), (f = d.substring(b + 5)))
                                : (b = d.indexOf("Opera")) !== -1
                                ? ((e = "Opera"), (f = d.substring(b + 7)), (b = d.indexOf("Version")) !== -1 && (f = d.substring(b + 8)))
                                : (b = d.indexOf("Opera Mini")) !== -1
                                ? ((e = "OperaMini"), (f = d.substring(b + 7)), (b = d.indexOf("Version")) !== -1 && (f = d.substring(b + 8)))
                                : (b = d.indexOf("UCBrowser")) !== -1
                                ? ((e = "UCBrowser"), (f = d.substring(b + 7)), (b = d.indexOf("Version")) !== -1 && (f = d.substring(b + 8)))
                                : (b = d.indexOf("Chrome")) !== -1
                                ? ((e = "Chrome"), (f = d.substring(b + 7)))
                                : (b = d.indexOf("Safari")) !== -1
                                ? ((e = "Safari"), (f = d.substring(b + 7)), (b = d.indexOf("Version")) !== -1 && (f = d.substring(b + 8)))
                                : (b = d.indexOf("Firefox")) !== -1
                                ? ((e = "Firefox"), (f = d.substring(b + 8)))
                                : (a = d.lastIndexOf(" ") + 1) < (b = d.lastIndexOf("/")) && ((e = d.substring(a, b)), (f = d.substring(b + 1)), e.toLowerCase() == e.toUpperCase() && (e = navigator.appName)),
                            (c = f.indexOf(";")) !== -1 && (f = f.substring(0, c)),
                            (c = f.indexOf(" ")) !== -1 && (f = f.substring(0, c)),
                            (g = parseInt("" + f, 10)),
                            isNaN(g) && ((f = "" + parseFloat(navigator.appVersion)), (g = parseInt(navigator.appVersion, 10))),
                            {
                                BROWSER_NAME: e,
                                BROWSER_VERSION: g,
                                IS_SAFARI_GTE_10: navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1 && navigator.userAgent.indexOf("Android") == -1 && g > 10,
                                IS_SAFARI: navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1 && navigator.userAgent.indexOf("Android") == -1,
                                IS_IOS: /(iPad|iPhone|iPod)/g.test(navigator.platform),
                                IOS_VERSION: parseFloat(("" + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ""])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", "")) || !1,
                                IS_TOUCH: "ontouchstart" in document.documentElement,
                                IS_ANDROID: /Android/gi.test(navigator.userAgent),
                                IS_MIUI: navigator.userAgent.indexOf("MiuiBrowser") != -1,
                                IS_MOBILE: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                            }
                        );
                    },
                },
            ]),
            a
        );
    })(),
    SvgPath = (function () {
        function a() {
            _classCallCheck(this, a), this.init();
        }
        return (
            _createClass(
                a,
                [
                    {
                        key: "init",
                        value: function () {
                            (this.playSvgPath = "M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"),
                                (this.pauseSvgPath = "M 12,26 16.33,26 16.33,10 12,10 z M 20.66,26 25,26 25,10 20.66,10 z"),
                                (this.forwardSvgPath =
                                    "m 10,19 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 h -2 c 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 0,-3.3 2.7,-6 6,-6 v 4 l 5,-5 -5,-5 v 4 c -4.4,0 -8,3.6 -8,8 z m 6.7,.9 .2,-2.2 h 2.4 v .7 h -1.7 l -0.1,.9 c 0,0 .1,0 .1,-0.1 0,-0.1 .1,0 .1,-0.1 0,-0.1 .1,0 .2,0 h .2 c .2,0 .4,0 .5,.1 .1,.1 .3,.2 .4,.3 .1,.1 .2,.3 .3,.5 .1,.2 .1,.4 .1,.6 0,.2 0,.4 -0.1,.5 -0.1,.1 -0.1,.3 -0.3,.5 -0.2,.2 -0.3,.2 -0.5,.3 C 18.3,22 18.1,22 17.9,22 17.7,22 17.5,22 17.4,21.9 17.3,21.8 17.1,21.8 16.9,21.7 16.7,21.6 16.7,21.5 16.6,21.3 16.5,21.1 16.5,21 16.5,20.8 h .8 c 0,.2 .1,.3 .2,.4 .1,.1 .2,.1 .4,.1 .1,0 .2,0 .3,-0.1 L 18.4,21 c 0,0 .1,-0.2 .1,-0.3 v -0.6 l -0.1,-0.2 -0.2,-0.2 c 0,0 -0.2,-0.1 -0.3,-0.1 h -0.2 c 0,0 -0.1,0 -0.2,.1 -0.1,.1 -0.1,0 -0.1,.1 0,.1 -0.1,.1 -0.1,.1 h -0.6 z"),
                                (this.volumeUpSvgPath =
                                    "m 18.77,10.20 0,1.83 c 2.56,.76 4.44,3.14 4.44,5.96 0,2.81 -1.87,5.2 -4.44,5.96 l 0,1.83 C 22.34,24.98 25,21.80 25,18.00 25,14.19 22.34,11.01 18.77,10.20 z m 0,4.21 0,7.15 C 20.09,20.92 21,19.57 21,18.00 21,16.42 20.09,15.07 18.77,14.41 z M 9,15.33 l 0,5.33 3.55,0 L 17,25.11 17,10.88 12.55,15.33 9,15.33 z"),
                                (this.volumeDownSvgPath = "m 9,15.37 0,5.25 3.58,0 4.48,4.37 0,-14 -4.48,4.37 L 9,15.37 z m 9.86,-0.90 0,7.04 c 1.32,-0.63 2.24,-1.96 2.24,-3.51 0,-1.54 -0.91,-2.87 -2.24,-3.52 z"),
                                (this.backWardSvgPath =
                                    "M 18,11 V 7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z m -1.3,8.9 .2,-2.2 h 2.4 v .7 h -1.7 l -0.1,.9 c 0,0 .1,0 .1,-0.1 0,-0.1 .1,0 .1,-0.1 0,-0.1 .1,0 .2,0 h .2 c .2,0 .4,0 .5,.1 .1,.1 .3,.2 .4,.3 .1,.1 .2,.3 .3,.5 .1,.2 .1,.4 .1,.6 0,.2 0,.4 -0.1,.5 -0.1,.1 -0.1,.3 -0.3,.5 -0.2,.2 -0.3,.2 -0.4,.3 C 18.5,22 18.2,22 18,22 17.8,22 17.6,22 17.5,21.9 17.4,21.8 17.2,21.8 17,21.7 16.8,21.6 16.8,21.5 16.7,21.3 16.6,21.1 16.6,21 16.6,20.8 h .8 c 0,.2 .1,.3 .2,.4 .1,.1 .2,.1 .4,.1 .1,0 .2,0 .3,-0.1 L 18.5,21 c 0,0 .1,-0.2 .1,-0.3 v -0.6 l -0.1,-0.2 -0.2,-0.2 c 0,0 -0.2,-0.1 -0.3,-0.1 h -0.2 c 0,0 -0.1,0 -0.2,.1 -0.1,.1 -0.1,0 -0.1,.1 0,.1 -0.1,.1 -0.1,.1 h -0.7 z"),
                                (this.state = {
                                    play: this.playSvgPath,
                                    pause: this.pauseSvgPath,
                                    volumeup: this.volumeUpSvgPath,
                                    volumedown: this.volumeDownSvgPath,
                                    forward: this.forwardSvgPath,
                                    backward: this.backWardSvgPath,
                                    none: this.pauseSvgPath,
                                });
                        },
                    },
                ],
                [
                    {
                        key: "getSvgPathElement",
                        value: function (a) {
                            var b = document.createElementNS("http://www.w3.org/1999/svg", "path");
                            return b.setAttributeNS(null, "d", a), b.setAttributeNS(null, "stroke", "white"), b.setAttributeNS(null, "fill", "white"), b.setAttributeNS(null, "id", "player-svg"), b;
                        },
                    },
                ]
            ),
            a
        );
    })(),
    PreventSleep = (function () {
        function a() {
            _classCallCheck(this, a),
                (this.userAgent = new UserAgent()),
                (this.media = {
                    MP4:
                        "data:video/mp4;base64, AAAAHGZ0eXBNNFYgAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAGF21kYXTeBAAAbGliZmFhYyAxLjI4AABCAJMgBDIARwAAArEGBf//rdxF6b3m2Ui3lizYINkj7u94MjY0IC0gY29yZSAxNDIgcjIgOTU2YzhkOCAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTQgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0wIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDE6MHgxMTEgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz02IGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MCB3ZWlnaHRwPTAga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCB2YnZfbWF4cmF0ZT03NjggdmJ2X2J1ZnNpemU9MzAwMCBjcmZfbWF4PTAuMCBuYWxfaHJkPW5vbmUgZmlsbGVyPTAgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAFZliIQL8mKAAKvMnJycnJycnJycnXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXiEASZACGQAjgCEASZACGQAjgAAAAAdBmjgX4GSAIQBJkAIZACOAAAAAB0GaVAX4GSAhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGagC/AySEASZACGQAjgAAAAAZBmqAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZrAL8DJIQBJkAIZACOAAAAABkGa4C/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmwAvwMkhAEmQAhkAI4AAAAAGQZsgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGbQC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm2AvwMkhAEmQAhkAI4AAAAAGQZuAL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGboC/AySEASZACGQAjgAAAAAZBm8AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZvgL8DJIQBJkAIZACOAAAAABkGaAC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmiAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZpAL8DJIQBJkAIZACOAAAAABkGaYC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBmoAvwMkhAEmQAhkAI4AAAAAGQZqgL8DJIQBJkAIZACOAIQBJkAIZACOAAAAABkGawC/AySEASZACGQAjgAAAAAZBmuAvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZsAL8DJIQBJkAIZACOAAAAABkGbIC/AySEASZACGQAjgCEASZACGQAjgAAAAAZBm0AvwMkhAEmQAhkAI4AhAEmQAhkAI4AAAAAGQZtgL8DJIQBJkAIZACOAAAAABkGbgCvAySEASZACGQAjgCEASZACGQAjgAAAAAZBm6AnwMkhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAhkAI4AhAEmQAhkAI4AAAAhubW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAABDcAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAzB0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAA+kAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAALAAAACQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAPpAAAAAAABAAAAAAKobWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAB1MAAAdU5VxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAACU21pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAhNzdGJsAAAAr3N0c2QAAAAAAAAAAQAAAJ9hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAALAAkABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAALWF2Y0MBQsAN/+EAFWdCwA3ZAsTsBEAAAPpAADqYA8UKkgEABWjLg8sgAAAAHHV1aWRraEDyXyRPxbo5pRvPAyPzAAAAAAAAABhzdHRzAAAAAAAAAAEAAAAeAAAD6QAAABRzdHNzAAAAAAAAAAEAAAABAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAAIxzdHN6AAAAAAAAAAAAAAAeAAADDwAAAAsAAAALAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAAiHN0Y28AAAAAAAAAHgAAAEYAAANnAAADewAAA5gAAAO0AAADxwAAA+MAAAP2AAAEEgAABCUAAARBAAAEXQAABHAAAASMAAAEnwAABLsAAATOAAAE6gAABQYAAAUZAAAFNQAABUgAAAVkAAAFdwAABZMAAAWmAAAFwgAABd4AAAXxAAAGDQAABGh0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAACAAAAAAAABDcAAAAAAAAAAAAAAAEBAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAQkAAADcAABAAAAAAPgbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAC7gAAAykBVxAAAAAAALWhkbHIAAAAAAAAAAHNvdW4AAAAAAAAAAAAAAABTb3VuZEhhbmRsZXIAAAADi21pbmYAAAAQc21oZAAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAADT3N0YmwAAABnc3RzZAAAAAAAAAABAAAAV21wNGEAAAAAAAAAAQAAAAAAAAAAAAIAEAAAAAC7gAAAAAAAM2VzZHMAAAAAA4CAgCIAAgAEgICAFEAVBbjYAAu4AAAADcoFgICAAhGQBoCAgAECAAAAIHN0dHMAAAAAAAAAAgAAADIAAAQAAAAAAQAAAkAAAAFUc3RzYwAAAAAAAAAbAAAAAQAAAAEAAAABAAAAAgAAAAIAAAABAAAAAwAAAAEAAAABAAAABAAAAAIAAAABAAAABgAAAAEAAAABAAAABwAAAAIAAAABAAAACAAAAAEAAAABAAAACQAAAAIAAAABAAAACgAAAAEAAAABAAAACwAAAAIAAAABAAAADQAAAAEAAAABAAAADgAAAAIAAAABAAAADwAAAAEAAAABAAAAEAAAAAIAAAABAAAAEQAAAAEAAAABAAAAEgAAAAIAAAABAAAAFAAAAAEAAAABAAAAFQAAAAIAAAABAAAAFgAAAAEAAAABAAAAFwAAAAIAAAABAAAAGAAAAAEAAAABAAAAGQAAAAIAAAABAAAAGgAAAAEAAAABAAAAGwAAAAIAAAABAAAAHQAAAAEAAAABAAAAHgAAAAIAAAABAAAAHwAAAAQAAAABAAAA4HN0c3oAAAAAAAAAAAAAADMAAAAaAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAAAJAAAACQAAAAkAAACMc3RjbwAAAAAAAAAfAAAALAAAA1UAAANyAAADhgAAA6IAAAO+AAAD0QAAA+0AAAQAAAAEHAAABC8AAARLAAAEZwAABHoAAASWAAAEqQAABMUAAATYAAAE9AAABRAAAAUjAAAFPwAABVIAAAVuAAAFgQAABZ0AAAWwAAAFzAAABegAAAX7AAAGFwAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNTUuMzMuMTAw",
                    WebM:
                        "data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA=",
                }),
                (this.preventSleepVideo = void 0),
                (this.isEnable = !1),
                (this.pauseListener = void 0),
                this.init();
        }
        return (
            _createClass(a, [
                {
                    key: "setPauseListener",
                    value: function (a) {
                        this.pauseListener = a;
                    },
                },
                {
                    key: "removePauseListener",
                    value: function () {
                        this.pauseListener = void 0;
                    },
                },
                {
                    key: "pluginSupported",
                    value: function () {
                        return this.userAgent.browser.IS_ANDROID && !this.userAgent.browser.IS_MIUI && "Chrome" == this.userAgent.browser.BROWSER_NAME && this.userAgent.browser.BROWSER_VERSION > 46;
                    },
                },
                {
                    key: "init",
                    value: function () {
                        var a = this;
                        this.pluginSupported() &&
                            ((this.preventSleepVideo = document.createElement("video")),
                            this.preventSleepVideo.setAttribute("loop", ""),
                            (this.preventSleepVideo.onpause = function () {
                                a.isEnable && a.pauseListener && a.pauseListener();
                            }),
                            this.addSourceToVideo(this.preventSleepVideo, "webm", this.media.WebM),
                            this.addSourceToVideo(this.preventSleepVideo, "mp4", this.media.MP4));
                    },
                },
                {
                    key: "addSourceToVideo",
                    value: function (a, b, c) {
                        var d = document.createElement("source");
                        (d.src = c), (d.type = "video/" + b), a.appendChild(d);
                    },
                },
                {
                    key: "enable",
                    value: function () {
                        this.pluginSupported() && ((this.isEnable = !0), this.preventSleepVideo.play());
                    },
                },
                {
                    key: "disable",
                    value: function () {
                        this.pluginSupported() && ((this.isEnable = !1), this.preventSleepVideo.pause());
                    },
                },
            ]),
            a
        );
    })(),
    ScrollManager = (function () {
        function a(b) {
            _classCallCheck(this, a), (this.player = b);
        }
        return (
            _createClass(a, [
                {
                    key: "setScrollEvents",
                    value: function (a, b) {
                        (this.scrollEvents = a), (this.switchImageTime = b), (this.player.canvas.height = 4 * this.player.height);
                    },
                },
                {
                    key: "timeUpdate",
                    value: function (a) {
                        if (this.scrollEvents) {
                            var b = this.scrollEvents[
                                this.scrollEvents.binarySearch(a, function (a, b) {
                                    return a.time - b;
                                })
                            ];
                            if (b) {
                                var c = this.switchImageTime[
                                    this.switchImageTime.binarySearch(a, function (a, b) {
                                        return a.time - b;
                                    })
                                ];
                                a >= b.time && b.time >= c.time ? (this.player.canvas.style.top = -(player.height * b.dy)) : (this.player.canvas.style.top = 0);
                            }
                        }
                    },
                },
            ]),
            a
        );
    })(),
    Timer = (function () {
        function a() {
            _classCallCheck(this, a), this.reset();
        }
        return (
            _createClass(a, [
                {
                    key: "tick",
                    value: function () {
                        this.count++;
                    },
                },
                {
                    key: "reset",
                    value: function () {
                        (this.time = new Date().getTime()), (this.count = 0);
                    },
                },
                {
                    key: "fps",
                    value: function b() {
                        var b = parseInt((1e3 * this.count) / (new Date().getTime() - this.time)) + "fps";
                        return this.reset(), b;
                    },
                },
            ]),
            a
        );
    })(),
    Point = (function () {
        function a(b, c) {
            _classCallCheck(this, a), (this.x = b), (this.y = c);
        }
        return (
            _createClass(a, [
                {
                    key: "equals",
                    value: function (a) {
                        return this.x === a.x && this.y === a.y;
                    },
                },
                {
                    key: "distance",
                    value: function (a) {
                        var b = this.x - a.x,
                            c = this.y - a.y;
                        return Math.sqrt(b * b + c * c);
                    },
                },
            ]),
            a
        );
    })(),
    LineSegment = (function () {
        function a(b, c) {
            _classCallCheck(this, a), (this.start = b), (this.end = c);
        }
        return (
            _createClass(a, [
                {
                    key: "length",
                    value: function () {
                        var a = this.start.x - this.end.x,
                            b = this.start.y - this.end.y;
                        return Math.sqrt(a * a + b * b);
                    },
                },
                {
                    key: "angle",
                    value: function () {
                        var a = this.start.x - this.end.x,
                            b = this.start.y - this.end.y,
                            c = Math.atan2(b, a);
                        return c;
                    },
                },
                {
                    key: "centerX",
                    value: function () {
                        return (this.start.x + this.end.x) / 2;
                    },
                },
                {
                    key: "centerY",
                    value: function () {
                        return (this.start.y + this.end.y) / 2;
                    },
                },
            ]),
            a
        );
    })(),
    PointerDrawing = (function () {
        function a(b) {
            var c = this;
            _classCallCheck(this, a),
                (this.currentPoint = void 0),
                (this.ctx = b.ctx),
                (this.player = b),
                (this.previousPoint = void 0),
                (this.radius = 12),
                (this.colorSwitchTime = void 0),
                this.setCursorColor("#EF0F1B"),
                (this.img = new Image()),
                (this.img.src = "./images/pointer.png"),
                (this.imgLoaded = !1),
                (this.img.onload = function () {
                    c.imgLoaded = !0;
                });
        }
        return (
            _createClass(a, [
                { key: "clearPath", value: function () {} },
                { key: "onWindowResize", value: function () {} },
                {
                    key: "seekTo",
                    value: function (a) {
                        this.clearPath(), this.erase();
                    },
                },
                {
                    key: "setSlideDrawEvents",
                    value: function (a) {
                        this.slideDrawEvents = a;
                    },
                },
                {
                    key: "setCursorColor",
                    value: function (a) {
                        this.cursorColor = Drawing.hexToR(a) + ", " + Drawing.hexToG(a) + ", " + Drawing.hexToB(a);
                    },
                },
                {
                    key: "findxy",
                    value: function (a, b, c, d) {
                        switch (((b *= this.player.width), (c *= this.player.height), (this.previousPoint = this.currentPoint), a)) {
                            case "down":
                            case "start":
                                this.currentPoint = new Point(b, c);
                                break;
                            case "up":
                            case "out":
                            case "end":
                                this.currentPoint = void 0;
                                break;
                            case "move":
                                this.currentPoint = new Point(b, c);
                        }
                    },
                },
                {
                    key: "setColorSwitchTime",
                    value: function (a) {
                        this.colorSwitchTime = a;
                    },
                },
                {
                    key: "erase",
                    value: function () {
                        this.ctx.clearRect(0, 0, this.player.width, this.player.height), (this.previousPoint = void 0);
                    },
                },
                {
                    key: "erasePoint",
                    value: function (a) {
                        a && this.ctx.clearRect(a.x - this.radius / 2, a.y - this.radius / 2, a.x + this.radius / 2, a.y + this.radius / 2);
                    },
                },
                {
                    key: "render",
                    value: function (a) {
                        if (this.previousPoint && (this.erase(), this.currentPoint)) {
                            var b = this.radius * (this.player.width / 1980);
                            this.imgLoaded
                                ? this.ctx.drawImage(this.img, this.currentPoint.x, this.currentPoint.y)
                                : (this.ctx.beginPath(), (this.ctx.fillStyle = "rgba(" + this.cursorColor + ", 0.8)"), this.ctx.arc(this.currentPoint.x, this.currentPoint.y, b, 0, 2 * Math.PI), this.ctx.fill());
                        }
                    },
                },
            ]),
            a
        );
    })(),
    Drawing = (function () {
        function a(b) {
            _classCallCheck(this, a),
                (this.cursorColor = "19, 128, 208"),
                (this.flag = !1),
                (this.points = [0, 0, 0]),
                (this.threeLines = []),
                (this.currentPointIndex = 0),
                (this.lastPoint = void 0),
                (this.paths = []),
                (this.player = b),
                (this.ctx = b.ctx),
                (this.currentIndex = 0),
                (this.colorSwitchTime = []),
                (this.FUDGE_MIN = 0.00768049155145929),
                (this.FUDGE_MAX = 0.1514439324116743),
                (this.offset = 400),
                (this.fadeTimeout = 1e3),
                (this.drawPoints = []),
                (this.plines = []);
        }
        return (
            _createClass(
                a,
                [
                    { key: "onWindowResize", value: function () {} },
                    {
                        key: "getWidth",
                        value: function () {
                            return this.player.width > 768 ? 768 : this.player.width;
                        },
                    },
                    {
                        key: "getFudge",
                        value: function () {
                            return this.FUDGE_MIN * this.getWidth();
                        },
                    },
                    {
                        key: "getMinWidth",
                        value: function () {
                            return this.getFudge() / 5;
                        },
                    },
                    {
                        key: "getMaxWidth",
                        value: function () {
                            return this.FUDGE_MAX * this.getWidth();
                        },
                    },
                    {
                        key: "seekTo",
                        value: function (a) {
                            var b = this.colorSwitchTime.binarySearch(a, function (a, b) {
                                return a.time - b;
                            });
                            this.colorSwitchTime.length > 0 && this.colorSwitchTime[b] && this.setCursorColor(this.colorSwitchTime[b].color), this.clearPath(), this.erase();
                        },
                    },
                    {
                        key: "clearPath",
                        value: function () {
                            (this.paths = []), (this.currentIndex = 0);
                        },
                    },
                    {
                        key: "setCursorColor",
                        value: function (b) {
                            this.clearPath(), (this.cursorColor = a.hexToR(b) + ", " + a.hexToG(b) + ", " + a.hexToB(b));
                        },
                    },
                    {
                        key: "findxy",
                        value: function (a, b, c, d) {
                            (b *= this.player.width),
                                (c *= this.player.height),
                                ("down" !== a && "start" !== a) || this.touchBegan(b, c, d),
                                ("up" !== a && "out" !== a && "end" !== a) || this.touchEnd(b, c, d),
                                "move" === a && this.touchMove(b, c, d);
                        },
                    },
                    {
                        key: "next",
                        value: function () {
                            return (this.currentPointIndex = (this.currentPointIndex + 1) % 3), this.threeLines[this.currentPointIndex];
                        },
                    },
                    {
                        key: "setNext",
                        value: function (a) {
                            (this.currentPointIndex = (this.currentPointIndex + 1) % 3), (this.threeLines[this.currentPointIndex] = a);
                        },
                    },
                    {
                        key: "touchBegan",
                        value: function (a, b) {
                            (this.currentPointIndex = 0),
                                (this.currentPoint = new Point(a, b)),
                                (this.lastPoint = this.currentPoint),
                                this.setNext(new LineSegment(this.currentPoint, this.currentPoint)),
                                this.setNext(new LineSegment(this.currentPoint, this.currentPoint)),
                                this.drawPoints.push(this.currentPoint),
                                this.plines.push(new LineSegment(this.currentPoint, this.currentPoint)),
                                (this.drawPoints = []),
                                (this.plines = []);
                        },
                    },
                    {
                        key: "touchMove",
                        value: function (a, b, c) {
                            return void 0 == this.lastPoint
                                ? void this.touchBegan(a, b, c)
                                : ((this.currentPoint = new Point(a, b)),
                                  void (this.lastPoint.equals(this.currentPoint) || (this.drawPoints.push(this.currentPoint), this.getPerpendicularLineAndInsertSagment(c), (this.lastPoint = this.currentPoint))));
                        },
                    },
                    {
                        key: "getPerpendicularLineAndInsertSagment",
                        value: function (a) {
                            var b = this.lineSegmentPerpendicularTo(new LineSegment(this.lastPoint, this.currentPoint));
                            this.plines.push(b), this.setNext(b), this.insertSegment(a);
                        },
                    },
                    {
                        key: "touchEnd",
                        value: function (a, b, c) {
                            this.touchMove(a, b, c), this.getPerpendicularLineAndInsertSagment(c), this.paths.push({ points: void 0, time: 1e3 * c });
                        },
                    },
                    {
                        key: "getAlphaColor",
                        value: function (a) {
                            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : -1;
                            if (a < this.offset) return 1;
                            var b = 1 - (a - this.offset) / this.fadeTimeout;
                            return b > 0 ? b : 0;
                        },
                    },
                    {
                        key: "setColorSwitchTime",
                        value: function (a) {
                            this.colorSwitchTime = a;
                        },
                    },
                    {
                        key: "clamp",
                        value: function (a) {
                            var b = this.getMinWidth();
                            if (a < b) return b;
                            var c = this.getMaxWidth();
                            return a > c ? c : a;
                        },
                    },
                    {
                        key: "lineSegmentPerpendicularTo",
                        value: function (b) {
                            var c, d, e, f, g, h, i, j, k, l, m, n, o;
                            return (
                                (e = this.getFudge() / this.clamp(a.lenSeq(b.start, b.end))),
                                (h = b.start.x),
                                (l = b.start.y),
                                (i = b.end.x),
                                (m = b.end.y),
                                (c = i - h),
                                (d = m - l),
                                (f = (e / 2) * c),
                                (g = (e / 2) * d),
                                (j = i + g),
                                (n = m - f),
                                (k = i - g),
                                (o = m + f),
                                new LineSegment(new Point(j, n), new Point(k, o))
                            );
                        },
                    },
                    {
                        key: "insertSegment",
                        value: function (b) {
                            for (var c, d = [], e = 0; e < 3; e++) d.push(this.next());
                            (c = []), c.push(a.midpoint(d[0].start, d[1].start)), c.push(a.midpoint(d[1].start, d[2].start)), c.push(a.midpoint(d[1].end, d[2].end)), c.push(a.midpoint(d[0].end, d[1].end));
                            var f = [c[0].x, c[0].y, d[1].start.x, d[1].start.y, c[1].x, c[1].y, c[2].x, c[2].y, d[1].end.x, d[1].end.y, c[3].x, c[3].y];
                            this.paths.push({ points: f, time: 1e3 * b });
                        },
                    },
                    {
                        key: "erase",
                        value: function () {
                            this.ctx.clearRect(0, 0, this.player.width, this.player.height);
                        },
                    },
                    {
                        key: "setCurrentIndex",
                        value: function (a) {
                            for (var b = this.paths.length; this.currentIndex < b && a - this.paths[this.currentIndex].time > this.fadeTimeout + this.offset - 50; ) this.currentIndex++;
                        },
                    },
                    {
                        key: "getGradientAlphaMultiplier",
                        value: function (a, b) {
                            return a > 1e3 ? 0.3 : 1 - a / 1200;
                        },
                    },
                    {
                        key: "setFillColor",
                        value: function (a, b, c, d) {
                            var e = void 0,
                                f = void 0,
                                g = void 0,
                                h = void 0;
                            return (
                                (f = b.points),
                                (e = this.getAlphaColor(a - b.time, c - d)),
                                (g = (a - b.time) / 80),
                                (g = g > e ? e : g),
                                d < c - 1 && (g = this.paths[d + 1].points ? this.getAlphaColor(a - this.paths[d + 1].time, c - d) : e),
                                (h = this.ctx.createLinearGradient(f[0], f[1], f[4], f[5])),
                                h.addColorStop(0, "rgba(" + this.cursorColor + ", " + parseFloat(e).toFixed(2) + ")"),
                                h.addColorStop(1, "rgba(" + this.cursorColor + ", " + parseFloat(g).toFixed(2) + ")"),
                                (this.ctx.fillStyle = h),
                                [e, g]
                            );
                        },
                    },
                    {
                        key: "setStrokeColor",
                        value: function (a, b, c, d, e) {
                            var f = void 0,
                                g = void 0,
                                h = void 0,
                                i = void 0;
                            g = c.points;
                            var j = this.getGradientAlphaMultiplier(b - c.time, d - e);
                            (f = a[0] * j),
                                (h = a[1] * j),
                                (i = this.ctx.createLinearGradient(g[0], g[1], g[4], g[5])),
                                i.addColorStop(0, "rgba(" + this.cursorColor + ", " + parseFloat(f).toFixed(2) + ")"),
                                i.addColorStop(1, "rgba(" + this.cursorColor + ", " + parseFloat(h).toFixed(2) + ")"),
                                (this.ctx.strokeStyle = i);
                        },
                    },
                    {
                        key: "render",
                        value: function (a) {
                            var b = void 0,
                                c = void 0,
                                d = void 0,
                                e = this.paths.length,
                                f = 1e3 * a;
                            for (
                                this.setCurrentIndex(f),
                                    this.currentIndex > 200 && ((this.paths = this.paths.slice(this.currentIndex)), (this.currentIndex = 0), (e = this.paths.length)),
                                    this.erase(),
                                    this.ctx.lineJoin = "round",
                                    this.ctx.lineCap = "round",
                                    this.ctx.shadowOffsetX = 1,
                                    this.ctx.shadowOffsetY = 1,
                                    this.ctx.shadowBlur = 5,
                                    b = this.currentIndex;
                                b < e && ((c = this.paths[b]), (d = c.points), d) && !(c.time > f);
                                b++
                            ) {
                                var g = this.setFillColor(f, c, e, b);
                                this.setStrokeColor(g, f, c, e, b),
                                    (this.ctx.shadowColor = "rgba(" + this.cursorColor + ", " + parseFloat(g[1]).toFixed(2) + ")"),
                                    this.ctx.beginPath(),
                                    this.ctx.moveTo(d[0], d[1]),
                                    this.ctx.quadraticCurveTo(d[2], d[3], d[4], d[5]),
                                    this.ctx.lineTo(d[6], d[7]),
                                    this.ctx.quadraticCurveTo(d[8], d[9], d[10], d[11]),
                                    this.ctx.fill(),
                                    this.ctx.stroke();
                            }
                            if (this.plines.length > 1) {
                                this.ctx.beginPath();
                                var h = this.plines[this.plines.length - 2],
                                    i = h.length() / 3,
                                    j = h.angle();
                                this.ctx.arc(h.centerX(), h.centerY(), i, j, j + Math.PI, !1), this.ctx.fill();
                            }
                        },
                    },
                    {
                        key: "printPathPoint",
                        value: function (a) {
                            (this.ctx.fillStyle = "black"), this.ctx.fillRect(a[0], a[1], 1, 1), this.ctx.fillRect(a[4], a[5], 1, 1), this.ctx.fillRect(a[6], a[7], 1, 1), this.ctx.fillRect(a[10], a[11], 1, 1);
                        },
                    },
                    {
                        key: "printDebugPoint",
                        value: function () {
                            for (var a = 0; a < this.drawPoints.length; a++) (this.ctx.fillStyle = "green"), this.ctx.fillRect(this.drawPoints[a].x, this.drawPoints[a].y, 1, 1);
                            for (var b = 0; b < this.plines.length; b++)
                                (this.ctx.strokeStyle = "red"), this.ctx.beginPath(), this.ctx.moveTo(this.plines[b].start.x, this.plines[b].start.y), this.ctx.lineTo(this.plines[b].end.x, this.plines[b].end.y), this.ctx.stroke();
                        },
                    },
                ],
                [
                    {
                        key: "midpoint",
                        value: function (a, b) {
                            return new Point((a.x + b.x) / 2, (a.y + b.y) / 2);
                        },
                    },
                    {
                        key: "lenSeq",
                        value: function (a, b) {
                            var c = void 0,
                                d = void 0;
                            return (c = b.x - a.x), (d = b.y - a.y), Math.sqrt(c * c + d * d);
                        },
                    },
                    {
                        key: "hexToR",
                        value: function (b) {
                            return parseInt(a.cutHex(b).substring(0, 2), 16);
                        },
                    },
                    {
                        key: "hexToG",
                        value: function (b) {
                            return parseInt(a.cutHex(b).substring(2, 4), 16);
                        },
                    },
                    {
                        key: "hexToB",
                        value: function (b) {
                            return parseInt(a.cutHex(b).substring(4, 6), 16);
                        },
                    },
                    {
                        key: "cutHex",
                        value: function (a) {
                            return "#" == a.charAt(0) ? a.substring(1, 7) : a;
                        },
                    },
                ]
            ),
            a
        );
    })(),
    ACTIONS = { START: "start", END: "end", NEW_POINT: "move" },
    BrushPoint = (function () {
        function a(b, c, d, e, f) {
            _classCallCheck(this, a), (this.x = c), (this.y = d), (this.action = e), (this.time = b), (this.color = f);
        }
        return (
            _createClass(a, [
                {
                    key: "getX",
                    value: function () {
                        return x;
                    },
                },
                {
                    key: "getY",
                    value: function () {
                        return y;
                    },
                },
            ]),
            a
        );
    })(),
    Brush = (function () {
        function a() {
            _classCallCheck(this, a), (this.width = 0), (this.height = 0), (this.movementPoints = void 0), (this.smoothEnabled = !0), (this.cursorColor = this.setCursorColor("#EF0F1B"));
        }
        return (
            _createClass(
                a,
                [
                    {
                        key: "setSmoothEnabled",
                        value: function (a) {
                            this.smoothEnabled = a;
                        },
                    },
                    {
                        key: "setMovementPoints",
                        value: function (a) {
                            this.movementPoints = a;
                        },
                    },
                    {
                        key: "getCurrentPathPoints",
                        value: function (a) {
                            for (
                                var b = this.movementPoints.binarySearch(a, function (a, b) {
                                        return a.t - b;
                                    }),
                                    c = [];
                                b < this.movementPoints.length && this.movementPoints[b].a != ACTIONS.END;

                            )
                                c.push(new BrushPoint(this.movementPoints[b].t, this.movementPoints[b].x, this.movementPoints[b].y, this.movementPoints[b].a)), b++;
                            return c;
                        },
                    },
                    { key: "reset", value: function () {} },
                    { key: "newPoint", value: function (a) {} },
                    {
                        key: "onSet",
                        value: function (a) {
                            a && ((a.shadowOffsetX = 0), (a.shadowOffsetY = 0), (a.shadowBlur = 0), (a.lineWidth = 1), (a.lineJoin = "round"), (a.lineCap = "round"));
                        },
                    },
                    {
                        key: "setCursorColor",
                        value: function (b) {
                            b && (this.cursorColor = a.hexToR(b) + ", " + a.hexToG(b) + ", " + a.hexToB(b));
                        },
                    },
                    { key: "draw", value: function (a, b) {} },
                    {
                        key: "setColor",
                        value: function (a) {
                            this.cursorColor = this.setCursorColor(a);
                        },
                    },
                    {
                        key: "onResize",
                        value: function (a, b) {
                            (this.width = a), (this.height = b);
                        },
                    },
                ],
                [
                    {
                        key: "cutHex",
                        value: function (a) {
                            return "#" == a.charAt(0) ? a.substring(1, 7) : a;
                        },
                    },
                    {
                        key: "hexToR",
                        value: function (b) {
                            return parseInt(a.cutHex(b).substring(0, 2), 16);
                        },
                    },
                    {
                        key: "hexToG",
                        value: function (b) {
                            return parseInt(a.cutHex(b).substring(2, 4), 16);
                        },
                    },
                    {
                        key: "hexToB",
                        value: function (b) {
                            return parseInt(a.cutHex(b).substring(4, 6), 16);
                        },
                    },
                ]
            ),
            a
        );
    })(),
    PointerBrush = (function (a) {
        function b() {
            _classCallCheck(this, b);
            var a = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this));
            return (
                (a.currentPoint = void 0),
                (a.previousPoint = void 0),
                (a.radius = 12),
                (a.img = new Image()),
                (a.img.src = "./images/pointer.png"),
                (a.imgLoaded = !1),
                (a.img.onload = function () {
                    a.imgLoaded = !0;
                }),
                a
            );
        }
        return (
            _inherits(b, a),
            _createClass(b, [
                {
                    key: "reset",
                    value: function () {
                        (this.currentPoint = void 0), (this.previousPoint = void 0);
                    },
                },
                {
                    key: "newPoint",
                    value: function (a) {
                        (this.previousPoint = this.currentPoint), (this.currentPoint = new Point(a.x, a.y));
                    },
                },
                {
                    key: "erase",
                    value: function (a) {
                        a.clearRect(0, 0, this.width, this.height), (this.previousPoint = void 0);
                    },
                },
                {
                    key: "draw",
                    value: function (a, b) {
                        if (this.previousPoint && (this.erase(a), this.currentPoint)) {
                            var c = this.radius * (this.width / 1980);
                            a.beginPath(),
                                this.imgLoaded
                                    ? a.drawImage(this.img, this.currentPoint.x, this.currentPoint.y)
                                    : ((a.fillStyle = "rgba(" + this.cursorColor + ", 0.8)"), a.arc(this.currentPoint.x, this.currentPoint.y, c, 0, 2 * Math.PI), a.fill());
                        }
                    },
                },
            ]),
            b
        );
    })(Brush),
    VariableWidthBrush = (function (a) {
        function b() {
            _classCallCheck(this, b);
            var a = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this));
            return (
                (a.flag = !1),
                (a.points = [0, 0, 0]),
                (a.threeLines = []),
                (a.currentPointIndex = 0),
                (a.lastDrawPoint = void 0),
                (a.paths = []),
                (a.currentIndex = 0),
                (a.colorSwitchTime = []),
                (a.FUDGE_MIN = 0.00768049155145929),
                (a.FUDGE_MAX = 0.1514439324116743),
                (a.offset = 0.4),
                (a.fadeTimeout = 1),
                (a.drawPoints = []),
                (a.plines = []),
                (a.canvasInvalidated = !0),
                (a.ended = !1),
                (a.alphaCutoff = 0.07),
                (a.maxPathLength = 100),
                (a.splitAt = 120),
                (a.minPathLengthWithFullOpacity = 50),
                (a.maxWidthForBrushWidth = 768),
                a
            );
        }
        return (
            _inherits(b, a),
            _createClass(
                b,
                [
                    {
                        key: "reset",
                        value: function () {
                            (this.currentPointIndex = 0), (this.drawPoints = []), (this.paths = []), (this.currentIndex = 0), (this.canvasInvalidated = !0), (this.plines = []), (this.ended = !1);
                        },
                    },
                    {
                        key: "onResize",
                        value: function (a, c) {
                            _get(b.prototype.__proto__ || Object.getPrototypeOf(b.prototype), "onResize", this).call(this, a, c), (this.canvasInvalidated = !0);
                        },
                    },
                    {
                        key: "next",
                        value: function () {
                            return (this.currentPointIndex = (this.currentPointIndex + 1) % 3), this.threeLines[this.currentPointIndex];
                        },
                    },
                    {
                        key: "setNext",
                        value: function (a) {
                            (this.currentPointIndex = (this.currentPointIndex + 1) % 3), (this.threeLines[this.currentPointIndex] = a);
                        },
                    },
                    {
                        key: "getPerpendicularLineAndInsertSagment",
                        value: function (a) {
                            var b = this.lineSegmentPerpendicularTo(new LineSegment(this.lastDrawPoint, this.currentPoint));
                            this.plines.push(b), this.setNext(b), this.insertSegment(a);
                        },
                    },
                    {
                        key: "setColorSwitchTime",
                        value: function (a) {
                            this.colorSwitchTime = a;
                        },
                    },
                    {
                        key: "clamp",
                        value: function (a) {
                            var b = this.getMinWidth();
                            if (a < b) return b;
                            var c = this.getMaxWidth();
                            return a > c ? c : a;
                        },
                    },
                    {
                        key: "lineSegmentPerpendicularTo",
                        value: function (a) {
                            var b, c, d, e, f, g, h, i, j, k, l, m, n;
                            return (
                                (d = this.getFudge() / this.clamp(Drawing.lenSeq(a.start, a.end))),
                                (g = a.start.x),
                                (k = a.start.y),
                                (h = a.end.x),
                                (l = a.end.y),
                                (b = h - g),
                                (c = l - k),
                                (e = (d / 2) * b),
                                (f = (d / 2) * c),
                                (i = h + f),
                                (m = l - e),
                                (j = h - f),
                                (n = l + e),
                                new LineSegment(new Point(i, m), new Point(j, n))
                            );
                        },
                    },
                    {
                        key: "insertSegment",
                        value: function (a) {
                            for (var b, c = [], d = 0; d < 3; d++) c.push(this.next());
                            (b = []), b.push(Drawing.midpoint(c[0].start, c[1].start)), b.push(Drawing.midpoint(c[1].start, c[2].start)), b.push(Drawing.midpoint(c[1].end, c[2].end)), b.push(Drawing.midpoint(c[0].end, c[1].end));
                            var e = [b[0], new Point(c[1].start.x, c[1].start.y), b[1], b[2], new Point(c[1].end.x, c[1].end.y), b[3]];
                            this.paths.push({ points: e, time: a });
                        },
                    },
                    {
                        key: "setCurrentIndex_old",
                        value: function (a) {
                            for (var b = this.paths.length; this.currentIndex < b && a - this.paths[this.currentIndex].time > this.fadeTimeout + this.offset - 0.5; ) this.currentIndex++;
                        },
                    },
                    {
                        key: "getGradientAlphaMultiplier_old",
                        value: function (a, b) {
                            return a > 1 ? 0.3 : 1 - a / 1.2;
                        },
                    },
                    {
                        key: "getAlphaColor_old",
                        value: function (a) {
                            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : -1;
                            if (a < this.offset) return 1;
                            var b = 1 - (a - this.offset) / this.fadeTimeout;
                            return b > 0 ? b : 0;
                        },
                    },
                    {
                        key: "setCurrentIndex",
                        value: function (a) {
                            for (var b = this.paths.length; this.currentIndex < b - this.maxPathLength; ) this.currentIndex++;
                        },
                    },
                    {
                        key: "getGradientAlphaMultiplier",
                        value: function (a, b) {
                            return b > this.minPathLengthWithFullOpacity && b <= this.maxPathLength ? 1 - (0.9 * (b - this.minPathLengthWithFullOpacity)) / (this.minPathLengthWithFullOpacity - 8) : b > this.maxPathLength || 0 == b ? 0 : 1;
                        },
                    },
                    {
                        key: "getAlphaColor",
                        value: function (a) {
                            var b = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : -1;
                            return b < this.minPathLengthWithFullOpacity ? 1 : 1 - (b - this.minPathLengthWithFullOpacity) / this.minPathLengthWithFullOpacity;
                        },
                    },
                    {
                        key: "setFillColor",
                        value: function (a, b, c, d, e) {
                            var f = void 0,
                                g = void 0,
                                h = void 0,
                                i = void 0;
                            return (
                                (g = b.points),
                                (f = this.getAlphaColor(a - b.time, c - d)),
                                (h = 1),
                                (h = h > f ? f : h),
                                d < c - 1 && (h = this.getAlphaColor(a - this.paths[d + 1].time, c - d - 1)),
                                f == h
                                    ? (e.fillStyle = "rgba(" + this.cursorColor + ", " + parseFloat(f).toFixed(2) + ")")
                                    : ((i = e.createLinearGradient(g[0].x, g[0].y, g[2].x, g[2].y)),
                                      i.addColorStop(0, "rgba(" + this.cursorColor + ", " + parseFloat(f).toFixed(2) + ")"),
                                      i.addColorStop(1, "rgba(" + this.cursorColor + ", " + parseFloat(h).toFixed(2) + ")"),
                                      (e.fillStyle = i)),
                                [f, h]
                            );
                        },
                    },
                    {
                        key: "setStrokeColor",
                        value: function (a, b, c, d, e, f) {
                            var g = void 0,
                                h = void 0,
                                i = void 0,
                                j = void 0;
                            h = c.points;
                            var k = this.getGradientAlphaMultiplier(b - c.time, d - e);
                            (g = a[0] * k),
                                (i = a[1] * k),
                                g == i
                                    ? (f.strokeStyle = "rgba(" + this.cursorColor + ", " + parseFloat(g).toFixed(2) + ")")
                                    : ((j = f.createLinearGradient(h[0].x, h[0].y, h[2].x, h[2].y)),
                                      j.addColorStop(1, "rgba(" + this.cursorColor + ", " + parseFloat(g).toFixed(2) + ")"),
                                      j.addColorStop(0, "rgba(" + this.cursorColor + ", " + parseFloat(i).toFixed(2) + ")"),
                                      (f.strokeStyle = j));
                        },
                    },
                    {
                        key: "getWidth",
                        value: function () {
                            return this.width > this.maxWidthForBrushWidth ? this.maxWidthForBrushWidth : this.width;
                        },
                    },
                    {
                        key: "getFudge",
                        value: function () {
                            return this.FUDGE_MIN * this.getWidth();
                        },
                    },
                    {
                        key: "getMinWidth",
                        value: function () {
                            return this.getFudge() / 5;
                        },
                    },
                    {
                        key: "getMaxWidth",
                        value: function () {
                            return this.FUDGE_MAX * this.getWidth();
                        },
                    },
                    {
                        key: "newPoint",
                        value: function (a, b) {
                            (this.canvasInvalidated = !0), (this.ended = !1);
                            var c = a.x,
                                d = a.y;
                            a.time;
                            (this.currentPoint = new Point(c, d)),
                                a.action == ACTIONS.START &&
                                    (this.reset(),
                                    (this.lastDrawPoint = this.currentPoint),
                                    this.setNext(new LineSegment(this.currentPoint, this.currentPoint)),
                                    this.setNext(new LineSegment(this.currentPoint, this.currentPoint)),
                                    this.drawPoints.push(this.currentPoint),
                                    this.plines.push(new LineSegment(this.currentPoint, this.currentPoint)),
                                    (this.plines = []),
                                    this.movementPoints.length > b + 1 &&
                                        this.movementPoints[b + 1].a == ACTIONS.NEW_POINT &&
                                        ((this.currentPoint = new Point(this.movementPoints[b + 1].p.x * this.width, this.movementPoints[b + 1].p.y * this.height)),
                                        this.drawPoints.push(this.currentPoint),
                                        this.getPerpendicularLineAndInsertSagment(this.movementPoints[b + 1].t)),
                                    (this.lastDrawPoint = this.currentPoint)),
                                a.action == ACTIONS.END
                                    ? ((this.lastDrawPoint = this.currentPoint), (this.ended = !0))
                                    : a.action == ACTIONS.NEW_POINT &&
                                      this.movementPoints.length > b + 1 &&
                                      (this.movementPoints[b + 1].a == ACTIONS.NEW_POINT || this.movementPoints[b + 1].a == ACTIONS.END) &&
                                      ((this.currentPoint = new Point(this.movementPoints[b + 1].p.x * this.width, this.movementPoints[b + 1].p.y * this.height)),
                                      this.currentPoint.distance(this.lastDrawPoint) > (4 * this.maxWidthForBrushWidth) / this.width &&
                                          (this.drawPoints.push(this.currentPoint), this.getPerpendicularLineAndInsertSagment(this.movementPoints[b + 1].t), (this.lastDrawPoint = this.currentPoint)));
                        },
                    },
                    {
                        key: "erase",
                        value: function (a) {
                            a.clearRect(0, 0, this.width, this.height);
                        },
                    },
                    {
                        key: "printPathPoint",
                        value: function (a, b) {
                            (b.fillStyle = "black"),
                                b.fillRect(a[0].x, a[0].y, 1, 1),
                                b.fillRect(a[2].x, a[2].y, 1, 1),
                                b.fillRect(a[3].x, a[3].y, 1, 1),
                                b.fillRect(a[5].x, a[5].y, 1, 1),
                                (b.fillStyle = "pink"),
                                b.fillRect(a[1].x, a[1].y, 1, 1),
                                b.fillRect(a[4].x, a[4].y, 1, 1);
                        },
                    },
                    {
                        key: "printDebugPoint",
                        value: function (a) {
                            for (var b = 0; b < this.drawPoints.length; b++) (a.fillStyle = "green"), a.fillRect(this.drawPoints[b].x, this.drawPoints[b].y, 1, 1);
                            for (var c = 0; c < this.plines.length; c++) (a.strokeStyle = "red"), a.beginPath(), a.moveTo(this.plines[c].start.x, this.plines[c].start.y), a.lineTo(this.plines[c].end.x, this.plines[c].end.y), a.stroke();
                        },
                    },
                    {
                        key: "draw",
                        value: function (a, c) {
                            if (this.canvasInvalidated) {
                                this.ended && (this.canvasInvalidated = !1);
                                var d = void 0,
                                    e = void 0,
                                    f = void 0,
                                    g = this.paths.length;
                                if (!(g <= 0)) {
                                    var h = c;
                                    this.setCurrentIndex(h),
                                        this.currentIndex > this.splitAt && ((this.paths = this.paths.slice(this.currentIndex)), (this.currentIndex = 0), (g = this.paths.length)),
                                        this.erase(a),
                                        this.smoothEnabled && ((a.lineJoin = "round"), (a.lineCap = "round"), (a.shadowOffsetX = 1), (a.shadowOffsetY = 1), (a.shadowBlur = 5));
                                    var i = void 0,
                                        j = g - 1;
                                    if ((this.paths[j] && c >= this.paths[j].time && (j = g), !(j < this.currentIndex))) {
                                        var k = 0;
                                        for (d = this.currentIndex; d < j && ((e = this.paths[d]), (f = e.points), f); d++) {
                                            var l = this.setFillColor(h, e, g, d, a);
                                            if ((this.setStrokeColor(l, h, e, g, d, a), !(l[0] < this.alphaCutoff))) {
                                                this.smoothEnabled && (a.shadowColor = "rgba(" + this.cursorColor + ", " + parseFloat(l[1]).toFixed(2) + ")"),
                                                    a.beginPath(),
                                                    l[0] > this.alphaCutoff && k < this.alphaCutoff
                                                        ? (a.moveTo((f[0].x + f[5].x) / 2, (f[0].y + f[5].y) / 2),
                                                          a.quadraticCurveTo(f[1].x, f[1].y, f[2].x, f[2].y),
                                                          a.lineTo(f[3].x, f[3].y),
                                                          a.quadraticCurveTo(f[4].x, f[4].y, (f[0].x + f[5].x) / 2, (f[0].y + f[5].y) / 2),
                                                          a.fill(),
                                                          a.stroke())
                                                        : l[0] > 0.07 &&
                                                          (a.moveTo(f[0].x, f[0].y), a.quadraticCurveTo(f[1].x, f[1].y, f[2].x, f[2].y), a.lineTo(f[3].x, f[3].y), a.quadraticCurveTo(f[4].x, f[4].y, f[5].x, f[5].y), a.fill(), a.stroke()),
                                                    (k = l[0]);
                                                var m = new Point(f[2].x, f[2].y),
                                                    n = new Point(f[3].x, f[3].y);
                                                i = new LineSegment(m, n);
                                            }
                                        }
                                        if (((e = this.paths[d]), !e || !this.paths[d - 1] || c >= e.time)) return void this.draw_half_circle(a, i);
                                        (f = e.points), a.beginPath(), a.moveTo(f[0].x, f[0].y);
                                        var o = 1 - (e.time - c) / (e.time - this.paths[d - 1].time),
                                            p = b.bezierPoint(f[1].x, f[1].y, f[0].x, f[0].y, f[2].x, f[2].y, o),
                                            q = (f[0].x + p[0]) / 2,
                                            r = (f[0].y + p[1]) / 2;
                                        a.quadraticCurveTo(q, r, p[0], p[1]);
                                        var s = b.bezierPoint(f[4].x, f[4].y, f[5].x, f[5].y, f[3].x, f[3].y, o);
                                        a.lineTo(s[0], s[1]),
                                            (q = (f[5].x + s[0]) / 2),
                                            (r = (f[5].y + s[1]) / 2),
                                            a.quadraticCurveTo(q, r, f[5].x, f[5].y),
                                            a.closePath(),
                                            a.fill(),
                                            a.stroke(),
                                            (i = new LineSegment(new Point(p[0], p[1]), new Point(s[0], s[1]))),
                                            this.draw_half_circle(a, i);
                                    }
                                }
                            }
                        },
                    },
                    {
                        key: "draw_half_circle",
                        value: function (a, b) {
                            if (b) {
                                a.beginPath();
                                var c = b.length() / 2,
                                    d = b.angle();
                                a.arc(b.centerX(), b.centerY(), c, d, d + Math.PI, !1), a.fill();
                            }
                        },
                    },
                ],
                [
                    {
                        key: "midpoint",
                        value: function (a, b) {
                            return new Point((a.x + b.x) / 2, (a.y + b.y) / 2);
                        },
                    },
                    {
                        key: "lenSeq",
                        value: function (a, b) {
                            var c = void 0,
                                d = void 0;
                            return (c = b.x - a.x), (d = b.y - a.y), Math.sqrt(c * c + d * d);
                        },
                    },
                    {
                        key: "drawBetweenPointAccordingToTime",
                        value: function (a, c, d, e, f, g) {
                            var h = 1 - (e.time - c) / (e.time - d.time);
                            if (isFinite(h)) {
                                h > 1 && (h = 1);
                                var i = b.bezierPoint(d.x, d.y, f, g, e.x, e.y, h);
                                a.quadraticCurveTo(d.x, d.y, i[0], i[1]);
                            }
                        },
                    },
                    {
                        key: "bezierPoint",
                        value: function (a, b, c, d, e, f, g) {
                            var h = g * g,
                                i = 1 - g,
                                j = i * i,
                                k = j * c;
                            (k += 2 * i * g * a), (k += h * e);
                            var l = j * d;
                            return (l += 2 * i * g * b), (l += h * f), [k, l];
                        },
                    },
                ]
            ),
            b
        );
    })(Brush),
    HighlighterBrush = (function (a) {
        function b() {
            _classCallCheck(this, b);
            var a = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this));
            return (a.currentPoint = void 0), (a.drawPoints = []), (a.lastDrawPoints = []), (a.lastDrawPointsTime = 0), (a.alpha = 0.5), (a.lineWidth = 50), (a.nextPoint = void 0), (a.showOldDrawTill = 0.1), (a.canvasInvalidated = !0), a;
        }
        return (
            _inherits(b, a),
            _createClass(
                b,
                [
                    {
                        key: "onResize",
                        value: function (a, c) {
                            _get(b.prototype.__proto__ || Object.getPrototypeOf(b.prototype), "onResize", this).call(this, a, c), (this.lineWidth = parseInt(38 + (a / 1920) * 12)), (this.canvasInvalidated = !0), (this.nextPoint = void 0);
                        },
                    },
                    {
                        key: "reset",
                        value: function () {
                            (this.canvasInvalidated = !0), (this.currentPoint = void 0), (this.drawPoints = []), (this.lastDrawPoints = []), (this.nextPoint = void 0);
                        },
                    },
                    {
                        key: "newPoint",
                        value: function (a, b) {
                            var c = b + 1;
                            if (((this.canvasInvalidated = !0), (this.ended = !1), a.action == ACTIONS.START)) {
                                if (this.drawPoints.length > 1) {
                                    var d;
                                    (this.lastDrawPoints = []), (d = this.lastDrawPoints).push.apply(d, _toConsumableArray(this.drawPoints)), (this.lastDrawPointsTime = a.time);
                                }
                                this.drawPoints = [];
                            }
                            a.action == ACTIONS.END && (this.ended = !0),
                                (this.currentPoint = a),
                                !this.ended && this.movementPoints.length > c && this.movementPoints[c].p
                                    ? (this.nextPoint = new BrushPoint(this.movementPoints[c].t, this.movementPoints[c].p.x * this.width, this.movementPoints[c].p.y * this.height, this.movementPoints[c].a))
                                    : (this.nextPoint = void 0),
                                this.drawPoints.push(this.currentPoint);
                        },
                    },
                    {
                        key: "erase",
                        value: function (a) {
                            a.clearRect(0, 0, this.width, this.height);
                        },
                    },
                    {
                        key: "draw_point_internal",
                        value: function (a, c, d, e, f) {
                            if (!(d.length <= 0)) {
                                if (
                                    ((a.lineWidth = parseInt(this.lineWidth * (this.width / 1280))),
                                    (a.lineJoin = "round"),
                                    (a.lineCap = "round"),
                                    (a.strokeStyle = "rgba(" + this.cursorColor + ", " + parseFloat(f).toFixed(2) + ")"),
                                    (a.fillStyle = "rgba(" + this.cursorColor + ", " + parseFloat(f).toFixed(2) + ")"),
                                    1 == d.length)
                                ) {
                                    if (!e) return;
                                    d[0];
                                    a.beginPath(), a.moveTo(d[0].x, d[0].y);
                                    var g = (d[0].x + e.x) / 2,
                                        h = (d[0].y + e.y) / 2,
                                        i = new BrushPoint(e.time, g, h, e.action);
                                    return b.drawBetweenPointAccordingToTime(a, c, d[0], i, d[0].x, d[0].y), void a.stroke();
                                }
                                a.beginPath(), a.moveTo(d[0].x, d[0].y);
                                var j = d.length - 1,
                                    k = d[0].x,
                                    l = d[0].y,
                                    m = 1;
                                if (2 != d.length)
                                    for (; m < j; m++) {
                                        var n = (d[m].x + d[m + 1].x) / 2,
                                            o = (d[m].y + d[m + 1].y) / 2;
                                        a.quadraticCurveTo(d[m].x, d[m].y, n, o), (k = n), (l = o);
                                    }
                                else {
                                    var p = (d[m].x + d[0].x) / 2,
                                        q = (d[m].y + d[0].y) / 2;
                                    a.quadraticCurveTo(p, q, d[m].x, d[m].y), (k = d[m].x), (l = d[m].y);
                                }
                                if (e) {
                                    var r = (d[m].x + e.x) / 2,
                                        s = (d[m].y + e.y) / 2,
                                        t = new BrushPoint(e.time, r, s, e.action);
                                    b.drawBetweenPointAccordingToTime(a, c, d[m], t, k, l);
                                } else b.drawBetweenPointAccordingToTime(a, c, d[m - 1], d[m], k, l);
                                a.stroke();
                            }
                        },
                    },
                    {
                        key: "draw",
                        value: function (a, b) {
                            if (this.canvasInvalidated || !(b - this.lastDrawPointsTime > this.showOldDrawTill)) {
                                if ((this.erase(a), this.lastDrawPoints && this.lastDrawPoints.length > 0 && b - this.lastDrawPointsTime < this.showOldDrawTill)) {
                                    var c = this.alpha * (1 - (b - this.lastDrawPointsTime) / this.showOldDrawTill);
                                    this.draw_point_internal(a, b, this.lastDrawPoints, this.lastDrawPoints[this.lastDrawPoints.length - 1], c);
                                }
                                this.draw_point_internal(a, b, this.drawPoints, this.nextPoint, this.alpha), this.ended && (this.canvasInvalidated = !1);
                            }
                        },
                    },
                ],
                [
                    {
                        key: "drawBetweenPointAccordingToTime",
                        value: function (a, c, d, e, f, g) {
                            var h = 1 - (e.time - c) / (e.time - d.time);
                            if (isFinite(h)) {
                                h > 1 && (h = 1);
                                var i = b.bezierPoint(d.x, d.y, f, g, e.x, e.y, h);
                                a.quadraticCurveTo(d.x, d.y, i[0], i[1]);
                            }
                        },
                    },
                    {
                        key: "bezierPoint",
                        value: function (a, b, c, d, e, f, g) {
                            var h = g * g,
                                i = 1 - g,
                                j = i * i,
                                k = j * c;
                            (k += 2 * i * g * a), (k += h * e);
                            var l = j * d;
                            return (l += 2 * i * g * b), (l += h * f), [k, l];
                        },
                    },
                ]
            ),
            b
        );
    })(Brush),
    VariableWidthOptimizedBrush = (function (a) {
        function b() {
            _classCallCheck(this, b);
            var a = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this));
            return (
                (a.currentPoint = void 0),
                (a.drawPoints = []),
                (a.lastDrawPoints = []),
                (a.lastDrawPointsTime = 0),
                (a.alpha = 1),
                (a.lineWidth = 20),
                (a.nextPoint = void 0),
                (a.showOldDrawTill = 0.1),
                (a.canvasInvalidated = !0),
                (a.startPoint = 0),
                a
            );
        }
        return (
            _inherits(b, a),
            _createClass(b, [
                {
                    key: "onResize",
                    value: function (a, c) {
                        _get(b.prototype.__proto__ || Object.getPrototypeOf(b.prototype), "onResize", this).call(this, a, c),
                            (this.lineWidth = 9 + ((a < 960 ? 960 : a) / 1920) * 4),
                            (this.canvasInvalidated = !0),
                            (this.nextPoint = void 0),
                            (this.startPoint = 0);
                    },
                },
                {
                    key: "reset",
                    value: function () {
                        (this.canvasInvalidated = !0), (this.currentPoint = void 0), (this.drawPoints = []), (this.lastDrawPoints = []), (this.nextPoint = void 0), (this.startPoint = 0);
                    },
                },
                {
                    key: "newPoint",
                    value: function (a, b, c) {
                        var d = b + 1;
                        if (((this.canvasInvalidated = !0), (this.ended = !1), (this.isStartPoint = !1), a.action == ACTIONS.START)) {
                            if (this.drawPoints.length > 1) {
                                var e;
                                (this.lastDrawPoints = []), (e = this.lastDrawPoints).push.apply(e, _toConsumableArray(this.drawPoints)), (this.lastDrawPointsTime = a.time);
                            }
                            (this.drawPoints = []), (this.startPoint = 0), this.erase(c), (this.lastDrawPoints = void 0);
                        }
                        a.action == ACTIONS.END && (this.ended = !0),
                            (this.currentPoint = a),
                            !this.ended && this.movementPoints.length > d && this.movementPoints[d].p
                                ? (this.nextPoint = new BrushPoint(this.movementPoints[d].t, this.movementPoints[d].p.x * this.width, this.movementPoints[d].p.y * this.height, this.movementPoints[d].a))
                                : (this.nextPoint = void 0),
                            this.drawPoints.push(this.currentPoint);
                    },
                },
                {
                    key: "erase",
                    value: function (a) {
                        a.clearRect(0, 0, this.width, this.height);
                    },
                },
                {
                    key: "draw_point_internal",
                    value: function (a, b, c, d, e) {
                        if (!(c.length <= 0)) {
                            if (
                                ((a.lineWidth = parseInt(this.lineWidth * (this.width / 1280))),
                                (a.lineJoin = "round"),
                                (a.lineCap = "round"),
                                (a.strokeStyle = "rgba(" + this.cursorColor + ", " + parseFloat(e).toFixed(2) + ")"),
                                (a.fillStyle = "rgba(" + this.cursorColor + ", " + parseFloat(e).toFixed(2) + ")"),
                                1 == c.length)
                            ) {
                                if (!d) return;
                                c[0];
                                a.beginPath(), a.moveTo(c[0].x, c[0].y);
                                var f = (c[0].x + d.x) / 2,
                                    g = (c[0].y + d.y) / 2;
                                return a.beginPath(), a.moveTo(c[0].x, c[0].y), a.quadraticCurveTo(f, g, d.x, d.y), void a.stroke();
                            }
                            var h = c.length - 2;
                            if (!(this.startPoint >= h)) {
                                a.beginPath(), this.lastDrawPoints ? a.moveTo(this.lastDrawPoints.x, this.lastDrawPoints.y) : a.moveTo(c[this.startPoint].x, c[this.startPoint].y);
                                for (var i = this.startPoint; i < h; i++) {
                                    var j = (c[i].x + c[i + 1].x) / 2,
                                        k = (c[i].y + c[i + 1].y) / 2;
                                    a.quadraticCurveTo(c[i].x, c[i].y, j, k), (this.lastDrawPoints = new Point(j, k));
                                }
                                a.stroke(), (this.startPoint = h - 1);
                            }
                        }
                    },
                },
                {
                    key: "draw",
                    value: function (a, b) {
                        this.canvasInvalidated && this.draw_point_internal(a, b, this.drawPoints, this.nextPoint, this.alpha);
                    },
                },
            ]),
            b
        );
    })(Brush),
    BrushController = (function () {
        function a() {
            var b = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
            _classCallCheck(this, a), (this.current_brush = void 0), (this.brush_map = {}), (this.optimize = b), this.add_all_brush(), this.set_current_brush_by_id(0, void 0), (this.movementPoints = void 0);
        }
        return (
            _createClass(a, [
                {
                    key: "add_all_brush",
                    value: function () {
                        this.optimize ? (this.brush_map[0] = new VariableWidthOptimizedBrush()) : (this.brush_map[0] = new VariableWidthBrush()),
                            (this.brush_map[1] = new PointerBrush()),
                            this.optimize ? (this.brush_map[2] = new VariableWidthOptimizedBrush()) : (this.brush_map[2] = new VariableWidthBrush()),
                            (this.brush_map[3] = new HighlighterBrush()),
                            (this.brush_map[4] = new PenBrush());
                    },
                },
                {
                    key: "disableSmoothing",
                    value: function () {
                        for (var a in this.brush_map) this.brush_map[a].setSmoothEnabled(!1);
                    },
                },
                {
                    key: "setSize",
                    value: function (a, b) {
                        for (var c in this.brush_map) this.brush_map[c].onResize(a, b);
                    },
                },
                {
                    key: "setMovementPoints",
                    value: function (a) {
                        this.movementPoints = a;
                        for (var b in this.brush_map) this.brush_map[b].setMovementPoints(a);
                    },
                },
                {
                    key: "get_current_brush",
                    value: function () {
                        return this.current_brush;
                    },
                },
                {
                    key: "set_current_brush",
                    value: function (a, b) {
                        void 0 != this.current_brush && this.current_brush.reset(), console.log("brush_id:" + a), (this.current_brush = a), this.current_brush.onSet(b);
                    },
                },
                {
                    key: "set_current_brush_by_id",
                    value: function (a, b) {
                        console.log("brush_id:" + a), this.set_current_brush(this.brush_map[parseInt(a)], b);
                    },
                },
                {
                    key: "reset_all_brush",
                    value: function () {
                        for (var a in this.brush_map) this.brush_map[a].reset();
                    },
                },
            ]),
            a
        );
    })(),
    PenBrush = (function (a) {
        function b() {
            _classCallCheck(this, b);
            var a = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this));
            return (a.ppts = []), (a.currentIndex = -1), (a.lineWidth = 2), (a.canvasInvalidated = !0), (a.lastevent = "s"), a;
        }
        return (
            _inherits(b, a),
            _createClass(b, [
                {
                    key: "onResize",
                    value: function (a, c) {
                        _get(b.prototype.__proto__ || Object.getPrototypeOf(b.prototype), "onResize", this).call(this, a, c), (this.lineWidth = 2), (this.canvasInvalidated = !0);
                    },
                },
                {
                    key: "reset",
                    value: function () {
                        (this.canvasInvalidated = !0), (this.currentIndex = -1), (this.ppts = []);
                    },
                },
                {
                    key: "newPoint",
                    value: function (a, b) {
                        if (
                            ((this.canvasInvalidated = !0),
                            a.action == ACTIONS.START && ((this.rejectPoint = !0), (this.lastevent = "s"), (this.isDrawing = !0), this.currentIndex++, (this.ppts[this.currentIndex] = []), this.ppts[this.currentIndex].push(a)),
                            a.action == ACTIONS.END)
                        ) {
                            if (((this.isDrawing = !1), "s" == this.lastevent)) return;
                            (this.lastevent = "e"), this.ppts[this.currentIndex].push(a);
                        }
                        a.action == ACTIONS.NEW_POINT && ((this.lastevent = "m"), (this.rejectPoint = !1), this.ppts[this.currentIndex].push(a));
                    },
                },
                {
                    key: "getcolor",
                    value: function (a) {
                        return Brush.hexToR(a) + ", " + Brush.hexToG(a) + ", " + Brush.hexToB(a);
                    },
                },
                {
                    key: "drawPointsonCanvas",
                    value: function (a, b) {
                        for (var c = 0; c < b.length; c++) {
                            var d = b[c];
                            if (1 != d.length) {
                                var e = this.cursorColor;
                                if ((d[0].color && (e = this.getcolor(d[0].color)), (a.strokeStyle = "rgba(" + e + ", " + parseFloat(1).toFixed(2) + ")"), (a.fillStyle = "rgba(" + e + ", " + parseFloat(1).toFixed(2) + ")"), d.length < 3)) {
                                    var f = d[0];
                                    a.beginPath(), a.arc(f.x, f.y, this.lineWidth / 2, 0, 2 * Math.PI, !0), a.fill(), a.closePath();
                                } else {
                                    a.beginPath(), a.moveTo(d[0].x, d[0].y);
                                    for (var g = 1; g < d.length - 2; g++) {
                                        var h = (d[g].x + d[g + 1].x) / 2,
                                            i = (d[g].y + d[g + 1].y) / 2;
                                        a.quadraticCurveTo(d[g].x, d[g].y, h, i);
                                    }
                                    a.quadraticCurveTo(d[g].x, d[g].y, d[g + 1].x, d[g + 1].y), a.stroke();
                                }
                            }
                        }
                    },
                },
                {
                    key: "undo",
                    value: function () {
                        this.ppts.length > 0 && (this.ppts.pop(), this.currentIndex--, (this.canvasInvalidated = !0));
                    },
                },
                {
                    key: "drawMultiPoints",
                    value: function (a) {
                        (a.lineJoin = "round"), (a.globalCompositeOperation = "source-over"), (a.lineWidth = this.lineWidth), this.drawPointsonCanvas(a, this.ppts);
                    },
                },
                {
                    key: "erase",
                    value: function (a) {
                        (a.fillStyle = "white"), a.clearRect(0, 0, this.width, 4 * this.height), a.fillRect(0, 0, this.width, 4 * this.height);
                    },
                },
                {
                    key: "draw",
                    value: function (a, b) {
                        this.canvasInvalidated && (this.erase(a), this.drawMultiPoints(a));
                    },
                },
            ]),
            b
        );
    })(Brush),
    MultiDrawing = (function () {
        function a(b) {
            var c = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            _classCallCheck(this, a),
                (this.colorSwitchTime = []),
                (this.brushSwitchTime = []),
                (this.player = b),
                (this.optimize = c),
                (this.ctx = b.ctx),
                (this.brushController = new BrushController(this.optimize)),
                this.brushController.setSize(b.width, b.height),
                (this.lastPoint = void 0),
                (this.currentPoint = void 0),
                (this.movementPoints = void 0),
                this.brushController.disableSmoothing();
        }
        return (
            _createClass(a, [
                {
                    key: "onWindowResize",
                    value: function () {
                        this.clearPath(),
                            this.brushController.get_current_brush().onResize(this.player.width, this.player.height),
                            this.player.canPlay() && (this.setPreviousPointsAfterResize(this.player.time), this.render(this.player.time));
                    },
                },
                {
                    key: "setMovementPoints",
                    value: function (a) {
                        (this.movementPoints = a), this.brushController.setMovementPoints(a);
                    },
                },
                {
                    key: "setSlideDrawEvents",
                    value: function (a) {
                        this.slideDrawEvents = a;
                    },
                },
                {
                    key: "erase",
                    value: function () {
                        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                    },
                },
                {
                    key: "setPreviousPointsAfterResize",
                    value: function (a) {
                        var b = Math.min(this.player.imageManager.getSwitchImageTimeForLastImage(a), a),
                            c = this.player.imageManager.getImageAt(a);
                        this.colorChange = this.colorSwitchTime[
                            this.colorSwitchTime.binarySearch(b, function (a, b) {
                                return a.time - b;
                            })
                        ];
                        var d = 0;
                        if (this.slideDrawEvents[c])
                            for (; d < this.slideDrawEvents[c].length - 1 && this.slideDrawEvents[c][d].t <= a; ) {
                                var e = this.slideDrawEvents[c][d],
                                    f = e.a;
                                if ("start" === f || "move" === f || "end" === f) {
                                    var g = e.p.x,
                                        h = e.p.y;
                                    this.findxy(f, parseFloat(g), parseFloat(h), parseFloat(e.t), e.globalIndex, this.colorChange);
                                } else "brush_change" == f ? this.setBrush(e.b) : "color_change" == f ? (this.colorChange = e.c) : "undo" == f && this.undo();
                                d++;
                            }
                    },
                },
                {
                    key: "seekTo",
                    value: function (a) {
                        this.brushController.reset_all_brush();
                        var b = this.brushSwitchTime.binarySearch(a, function (a, b) {
                            return a.time - b;
                        });
                        this.brushSwitchTime.length > 0 && this.brushSwitchTime[b] && this.setBrush(this.brushSwitchTime[b].brush);
                        var c = this.colorSwitchTime.binarySearch(a, function (a, b) {
                            return a.time - b;
                        });
                        this.colorSwitchTime.length > 0 && this.colorSwitchTime[c] && this.setCursorColor(this.colorSwitchTime[c].color), this.clearPath(), this.erase(), this.setPreviousPointsAfterResize(a), this.render(a);
                    },
                },
                {
                    key: "clearPath",
                    value: function () {
                        this.brushController.get_current_brush().reset();
                    },
                },
                {
                    key: "setCursorColor",
                    value: function (a) {
                        this.brushController.get_current_brush().setCursorColor(a);
                    },
                },
                {
                    key: "setBrush",
                    value: function (a) {
                        this.brushController.set_current_brush_by_id(a, this.ctx), this.brushController.get_current_brush().onResize(this.player.width, this.player.height);
                    },
                },
                {
                    key: "findxy",
                    value: function (a, b, c, d, e, f) {
                        (b *= this.player.width),
                            (c *= this.player.height),
                            ("down" !== a && "start" !== a) || this.touchBegan(b, c, d, e, f),
                            ("up" !== a && "out" !== a && "end" !== a) || this.touchEnd(b, c, d, e),
                            "move" === a && this.touchMove(b, c, d, e);
                    },
                },
                {
                    key: "touchBegan",
                    value: function (a, b, c, d, e) {
                        (this.currentPoint = new Point(a, b)), this.brushController.get_current_brush().newPoint(new BrushPoint(c, a, b, ACTIONS.START, e), d, this.ctx), (this.lastPoint = this.currentPoint);
                    },
                },
                {
                    key: "touchMove",
                    value: function (a, b, c, d) {
                        return void 0 == this.lastPoint
                            ? void this.touchBegan(a, b, c)
                            : ((this.currentPoint = new Point(a, b)),
                              void (this.lastPoint.equals(this.currentPoint) || (this.brushController.get_current_brush().newPoint(new BrushPoint(c, a, b, ACTIONS.NEW_POINT), d), (this.lastPoint = this.currentPoint))));
                    },
                },
                {
                    key: "touchEnd",
                    value: function (a, b, c, d) {
                        (this.currentPoint = new Point(a, b)), this.brushController.get_current_brush().newPoint(new BrushPoint(c, a, b, ACTIONS.END), d), (this.lastPoint = void 0);
                    },
                },
                {
                    key: "setColorSwitchTime",
                    value: function (a) {
                        this.colorSwitchTime = a;
                    },
                },
                {
                    key: "setBrushSwitchTime",
                    value: function (a) {
                        this.brushSwitchTime = a;
                    },
                },
                {
                    key: "undo",
                    value: function () {
                        this.brushController.get_current_brush().undo && this.brushController.get_current_brush().undo();
                    },
                },
                {
                    key: "render",
                    value: function (a) {
                        this.player.isSlideMode() || this.brushController.get_current_brush().draw(this.ctx, a);
                    },
                },
            ]),
            a
        );
    })(),
    VELOCITY_FILTER_WEIGHT = 10,
    LocalPoint = (function () {
        function a(b, c, d) {
            _classCallCheck(this, a), (this.x = b), (this.y = c), (this.time = d);
        }
        return (
            _createClass(a, [
                {
                    key: "distanceTo",
                    value: function (a) {
                        var b = this.x - a.x,
                            c = this.y - a.y;
                        return Math.sqrt(b * b + c * c);
                    },
                },
                {
                    key: "velocityFrom",
                    value: function (a) {
                        return this.distanceTo(a) / (this.time - a.time);
                    },
                },
            ]),
            a
        );
    })(),
    Bezier = (function () {
        function a(b, c, d, e) {
            _classCallCheck(this, a), (this.point1 = b), (this.point2 = c), (this.c1 = d), (this.c2 = e), (this.lastWidth = 0), (this.newWidth = 0);
        }
        return (
            _createClass(a, [
                {
                    key: "setWidths",
                    value: function (a, b) {
                        (this.lastWidth = a), (this.newWidth = b);
                    },
                },
            ]),
            a
        );
    })(),
    DrawingV3 = (function (a) {
        function b(a) {
            _classCallCheck(this, b);
            var c = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, a));
            return (c.isCanvasInvalidated = !1), (c.curves = []), (c.points = []), (c.initialVelocity = 10), (c.intialStrokeWidth = 5), (c.lastVelocity = c.initialVelocity), (c.lastWidth = c.intialStrokeWidth), c;
        }
        return (
            _inherits(b, a),
            _createClass(b, [
                {
                    key: "findxy",
                    value: function (a, c, d, e) {
                        (this.isCanvasInvalidated = !0), _get(b.prototype.__proto__ || Object.getPrototypeOf(b.prototype), "findxy", this).call(this, a, c, d, e);
                    },
                },
                {
                    key: "onWindowResize",
                    value: function () {
                        (this.isCanvasInvalidated = !0), _get(b.prototype.__proto__ || Object.getPrototypeOf(b.prototype), "onWindowResize", this).call(this);
                    },
                },
                {
                    key: "touchBegan",
                    value: function (a, c) {
                        this.clearPath(), this.erase(), _get(b.prototype.__proto__ || Object.getPrototypeOf(b.prototype), "touchBegan", this).call(this, a, c);
                    },
                },
                {
                    key: "render",
                    value: function (a) {
                        this.isCanvasInvalidated && (_get(b.prototype.__proto__ || Object.getPrototypeOf(b.prototype), "render", this).call(this, a), (this.isCanvasInvalidated = !0));
                    },
                },
                {
                    key: "setCurrentIndex",
                    value: function (a) {
                        for (var b = this.paths.length; this.currentIndex < b - 40; ) this.currentIndex++;
                    },
                },
                {
                    key: "getGradientAlphaMultiplier",
                    value: function (a, b) {
                        return b > 20 && b <= 40 ? 1 - (0.9 * (b - 20)) / 16 : b > 40 || 0 == b ? 0 : 1;
                    },
                },
                {
                    key: "getAlphaColor",
                    value: function (a) {
                        var b = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : -1;
                        return b < 20 ? 1 : 1 - (b - 20) / 40;
                    },
                },
                {
                    key: "clearPath",
                    value: function () {
                        (this.isCanvasInvalidated = !0), _get(b.prototype.__proto__ || Object.getPrototypeOf(b.prototype), "clearPath", this).call(this);
                    },
                },
                {
                    key: "render1",
                    value: function (a) {
                        if ((this.erase(), !(this.drawPoints.length <= 0))) {
                            if (
                                ((this.ctx.fillStyle = "rgba(" + this.cursorColor + ", " + parseFloat(1).toFixed(2) + ")"),
                                (this.ctx.lineWidth = 6),
                                (this.ctx.lineJoin = "round"),
                                (this.ctx.lineCap = "round"),
                                (this.ctx.strokeStyle = "rgba(" + this.cursorColor + ", " + parseFloat(1).toFixed(2) + ")"),
                                (this.ctx.fillStyle = "rgba(" + this.cursorColor + ", " + parseFloat(1).toFixed(2) + ")"),
                                this.drawPoints.length < 3)
                            ) {
                                var b = this.drawPoints[0];
                                return this.ctx.beginPath(), this.ctx.arc(b.x, b.y, this.ctx.lineWidth / 2, 0, 2 * Math.PI, !0), this.ctx.fill(), void this.ctx.closePath();
                            }
                            this.ctx.beginPath(), this.ctx.moveTo(this.drawPoints[0].x, this.drawPoints[0].y);
                            for (var c = 1; c < this.drawPoints.length - 2; c++) {
                                var d = (this.drawPoints[c].x + this.drawPoints[c + 1].x) / 2,
                                    e = (this.drawPoints[c].y + this.drawPoints[c + 1].y) / 2;
                                this.ctx.quadraticCurveTo(this.drawPoints[c].x, this.drawPoints[c].y, d, e);
                            }
                            this.ctx.quadraticCurveTo(this.drawPoints[c].x, this.drawPoints[c].y, this.drawPoints[c + 1].x, this.drawPoints[c + 1].y), this.ctx.stroke();
                        }
                    },
                },
            ]),
            b
        );
    })(Drawing),
    ImageManager = (function () {
        function a(b) {
            _classCallCheck(this, a),
                (this.player = b),
                (this.imagePathsArray = []),
                (this.images = []),
                (this.images[NO_INDEX] = new Image()),
                (this.imageNode = void 0),
                (this.waitingForDownloadImageIndexQueue = []),
                (this.imageInQueue = {}),
                (this.imagePreloadBufferRange = []),
                (this.switchImageTime = []),
                (this.matrixChangeTime = []),
                (this.maxScaleForImages = {}),
                (this.updateImageQueueTimeout = void 0),
                (this.currentImageHeight = 0),
                (this.currentImageWidth = 0),
                (this.currentImageIndex = -1),
                (this.nextImgIndex = -1),
                (this.changeNextImageAt = -1),
                (this.imagesLoaded = 0),
                (this.imageQuality = 20),
                (this.scale = 1),
                (this.translationX = 0),
                (this.translationY = 0),
                (this.lastSwitchImageTime = -1),
                (this.currentSlideModeIndex = -1),
                (this.canUseWebp = canUseWebP()),
                (this.lastImageQueueUpdateCheckTime = new Date().getTime()),
                (this.imageErrors = {}),
                (this.downloadImageWidth = 768);
        }
        return (
            _createClass(a, [
                {
                    key: "findCurrentVisibleImageIndex",
                    value: function (a) {
                        var b = !1;
                        for (var c in this.switchImageTime) {
                            var d = this.switchImageTime[c];
                            if ((d.index == a && (b = !0), b && this.imagePathsArray[d.index].indexOf("white.jpg") < 0)) return parseInt(c);
                        }
                        return 0;
                    },
                },
                {
                    key: "getCurrentSlideModeIndex",
                    value: function () {
                        return this.currentSlideModeIndex == -1 && (this.currentSlideModeIndex = this.findCurrentVisibleImageIndex(this.get_current_index())), this.currentSlideModeIndex;
                    },
                },
                {
                    key: "get_prev_index",
                    value: function () {
                        this.currentSlideModeIndex = this.getCurrentSlideModeIndex();
                        for (
                            var a = this.switchImageTime[this.currentSlideModeIndex].index;
                            this.currentSlideModeIndex > 0 &&
                            (this.currentSlideModeIndex--, !(a != this.switchImageTime[this.currentSlideModeIndex].index && this.imagePathsArray[this.switchImageTime[this.currentSlideModeIndex].index].indexOf("white.jpg") < 0));

                        );
                        return this.switchImageTime[this.currentSlideModeIndex].index;
                    },
                },
                {
                    key: "get_next_index",
                    value: function () {
                        this.currentSlideModeIndex = this.getCurrentSlideModeIndex();
                        for (
                            var a = this.switchImageTime[this.currentSlideModeIndex].index;
                            this.currentSlideModeIndex < this.switchImageTime.length - 1 &&
                            (this.currentSlideModeIndex++, !(a != this.switchImageTime[this.currentSlideModeIndex].index && this.imagePathsArray[this.switchImageTime[this.currentSlideModeIndex].index].indexOf("white.jpg") < 0));

                        );
                        return this.switchImageTime[this.currentSlideModeIndex].index;
                    },
                },
                {
                    key: "get_current_index",
                    value: function () {
                        return this.currentImageIndex == NO_INDEX ? 0 : this.currentImageIndex;
                    },
                },
                {
                    key: "getTimeForPositiveIndexAfter",
                    value: function (a) {
                        for (var b in this.switchImageTime) {
                            var c = this.switchImageTime[b];
                            if (c.time >= a && c.index != NO_INDEX) return c.time;
                        }
                        return a;
                    },
                },
                {
                    key: "setThumbnail",
                    value: function (a) {
                        var b = this,
                            c = new Image();
                        (c.src = this.getQualityImageUrlForUrl(this.player.getImageUrl(a))),
                            (c.onload = function (a) {
                                console.log("thumb downloaded"), b.imageNode || b.addOrReplaceImageNode(c);
                            });
                    },
                },
                {
                    key: "onSwitchImageEvent",
                    value: function (a, b) {
                        var c = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                        return (
                            console.log("switch image event:" + this.currentImageIndex + "index:" + a + "time:" + b + "withoutFade:" + c),
                            this.currentImageIndex != a
                                ? ((this.nextImgIndex = a),
                                  b - this.lastSwitchImageTime <= 0.5 && (c = !0),
                                  (this.changeNextImageAt = b + 0.2),
                                  this.images[a] && (c && ((this.changeNextImageAt = b), this.switchImage(a, b)), this.imageNode && (this.imageNode.style.opacity = c ? 1 : 0)),
                                  !!this.images[a] || (this.imageNode && (this.imageNode.style.opacity = 0.3), this.updateImageQueue(b), this.player.setImageLoading(), !1))
                                : ((this.imageNode.style.opacity = 1), !1)
                        );
                    },
                },
                {
                    key: "getSwitchImages",
                    value: function () {
                        for (var a = this.switchImageTime, b = [], c = void 0, d = void 0, e = 0; e < a.length; e++) (c = a[e]), (d = c.index), b.indexOf(d) === -1 && d != NO_INDEX && b.push(d);
                        return b;
                    },
                },
                {
                    key: "render",
                    value: function (a) {
                        this.nextImgIndex != this.currentImageIndex && this.changeNextImageAt - a < 0 && (this.switchImage(this.nextImgIndex, a), this.imageNode && (this.imageNode.style.opacity = 1), this.invalidate());
                    },
                },
                {
                    key: "invalidate",
                    value: function () {
                        this.player.isAndroidApp() && AndroidApp.invalidate && AndroidApp.invalidate();
                    },
                },
                {
                    key: "setImagePathArray",
                    value: function (a) {
                        (this.imagePathsArray = a), 0 == this.player.time && this.imagePathsArray.length > 0 && (this.waitingForDownloadImageIndexQueue.push(0), this.downloadFromQueue());
                    },
                },
                {
                    key: "setMatrixChangeTime",
                    value: function (a) {
                        this.matrixChangeTime = a;
                    },
                },
                {
                    key: "setMaxScaleForImages",
                    value: function (a) {
                        this.maxScaleForImages = a;
                    },
                },
                {
                    key: "setSwitchImageTime",
                    value: function (a) {
                        (this.switchImageTime = a), this.updateImageBuffer(), this.updateImageQueue(this.player.time);
                    },
                },
                {
                    key: "seekTo",
                    value: function (a) {
                        var b = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                            c = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
                        (b = b || 0 != a), (this.nextImgIndex = this.currentImageIndex), c ? this.changeMatrix(a, !1) : this.resetMatrix();
                        var d = this.onSwitchImageEvent(this.getImageAt(a), a, b) && c;
                        d || this.resizeImageNode(), console.log("Next Image:" + this.nextImgIndex);
                    },
                },
                {
                    key: "changeMatrix",
                    value: function (a) {
                        var b = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
                            c = this.matrixChangeTime[
                                this.matrixChangeTime.binarySearch(a, function (a, b) {
                                    return a.time - b;
                                })
                            ];
                        this.onMatrixChange(c.matrix[0], c.matrix[1], c.matrix[2], b);
                    },
                },
                {
                    key: "getImageAt",
                    value: function (a) {
                        return this.switchImageTime[this.getIndexOfSwitchImageForTime(a)].index;
                    },
                },
                {
                    key: "getImageForIndex",
                    value: function (a) {
                        return this.images[a];
                    },
                },
                {
                    key: "getImageUrlForIndex",
                    value: function (a) {
                        return this.imagePathsArray[a];
                    },
                },
                {
                    key: "getImageUrlAt",
                    value: function (a) {
                        var b = this.getImageAt(a);
                        return this.imagePathsArray[b];
                    },
                },
                {
                    key: "getIndexOfSwitchImageForTime",
                    value: function (a) {
                        var b = this.switchImageTime.binarySearch(a, function (a, b) {
                            return a.time - b;
                        });
                        return b;
                    },
                },
                {
                    key: "resetMatrix",
                    value: function () {
                        (this.translationX = 0), (this.translationY = 0), (this.scale = 1);
                    },
                },
                {
                    key: "onMatrixChange",
                    value: function (a, b, c) {
                        var d = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3];
                        console.log("scale:" + c + " " + a + " " + b), (this.translationX = a), (this.translationY = b), (this.scale = c), d && this.nextImgIndex == this.currentImageIndex && this.resizeImageNode();
                    },
                },
                {
                    key: "getSwitchImageTimeForLastImage",
                    value: function (a) {
                        return this.switchImageTime[this.getIndexOfSwitchImageForTime(a)].time;
                    },
                },
                {
                    key: "updateImageBuffer",
                    value: function () {
                        this.imagePreloadBufferRange = [];
                        for (var a = 0, b = -1, c = 0; c < this.switchImageTime.length; c++)
                            if (this.images[this.switchImageTime[c].index] || b == -1) this.images[this.switchImageTime[c].index] && b == -1 && (b = 0 == c ? 0 : this.switchImageTime[c].time);
                            else {
                                var d = this.switchImageTime[c].time;
                                c == this.switchImageTime.length - 1 && (d = this.player.duration), (this.imagePreloadBufferRange[a] = { start: b, end: d }), a++, (b = -1);
                            }
                        b != -1 && (this.imagePreloadBufferRange[a] = { start: b, end: this.player.duration }), this.player.onBufferChange();
                    },
                },
                {
                    key: "downloadMoreImageRequired",
                    value: function (a) {
                        for (var b = 0; b < this.imagePreloadBufferRange.length; b++)
                            if (a >= this.imagePreloadBufferRange[b].start && a < this.imagePreloadBufferRange[b].end) {
                                var c = a + this.player.minPlayBackBufferTime > this.player.duration ? this.player.duration : a + this.player.minPlayBackBufferTime;
                                return c > this.imagePreloadBufferRange[b].end;
                            }
                        return !0;
                    },
                },
                {
                    key: "updateImageQueue",
                    value: function () {
                        var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                            b = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0;
                        if (this.imagePathsArray.length > 0) {
                            var c = {},
                                d = 0,
                                e = this.switchImageTime.length;
                            void 0 == b && (b = a + this.player.minPlayBackBufferTime > this.player.duration ? this.player.duration : a + this.player.minPlayBackBufferTime),
                                this.player.fullDownload || ((d = this.getIndexOfSwitchImageForTime(a)), (e = Math.min(e, this.getIndexOfSwitchImageForTime(b) + 1)));
                            var f = [];
                            for (this.waitingForDownloadImageIndexQueue = []; d < e; d++)
                                (this.player.fullDownload || b > this.switchImageTime[d].time) &&
                                    this.updateImageRequired(this.switchImageTime[d].index) &&
                                    (a > this.switchImageTime[d].time
                                        ? d + 1 < this.switchImageTime.length && a < this.switchImageTime[d + 1].time
                                            ? ((c[this.switchImageTime[d].index] = 1), this.waitingForDownloadImageIndexQueue.push(this.switchImageTime[d].index))
                                            : f.push(this.switchImageTime[d].index)
                                        : c[this.switchImageTime[d].index] || ((c[this.switchImageTime[d].index] = 1), this.waitingForDownloadImageIndexQueue.push(this.switchImageTime[d].index)));
                            if (this.player.fullDownload) for (d = 0; d < f.length; d++) c[f[d]] || this.images[f[d]] || this.imageInQueue[f[d]] || ((c[f[d]] = 1), this.waitingForDownloadImageIndexQueue.push(f[d]));
                            this.waitingForDownloadImageIndexQueue.reverse(), console.log(this.waitingForDownloadImageIndexQueue), this.downloadFromQueue();
                        }
                    },
                },
                {
                    key: "checkImageForUpdate",
                    value: function (a, b) {
                        var c = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : -1;
                        return (a = parseInt(a)), (b = parseInt(b)), !!(this.getWidthForImage(c) > a + 240 || this.getImageQuality() > b + 20);
                    },
                },
                {
                    key: "updateImageRequired",
                    value: function (a) {
                        if (a == NO_INDEX) return !1;
                        var b = this.images[a];
                        if (b) {
                            var c = b.getAttribute("w"),
                                d = b.getAttribute("q");
                            return !!this.checkImageForUpdate(c, d, a) && (b.setAttribute("update", "true"), !0);
                        }
                        var e = this.imageInQueue[a];
                        return !e || (!!this.checkImageForUpdate(e.w, e.q, a) && ((e.update = !0), !0));
                    },
                },
                {
                    key: "onWindowResize",
                    value: function () {
                        var a = this;
                        this.resizeImageNode(),
                            this.updateImageQueueTimeout && clearTimeout(this.updateImageQueueTimeout),
                            (this.updateImageQueueTimeout = setTimeout(function () {
                                a.updateImageQueue(a.player.time);
                            }, 1500)),
                            (this.downloadImageWidth = this.getDownloadImageWidth());
                    },
                },
                {
                    key: "timeUpdate",
                    value: function (a) {
                        Date.now() - this.lastImageQueueUpdateCheckTime > 2e3 && this.downloadMoreImageRequired(a) && ((this.lastImageQueueUpdateCheckTime = Date.now()), this.updateImageQueue(a));
                    },
                },
                {
                    key: "resizeImageNode",
                    value: function () {
                        if (this.imageNode) {
                            var a = void 0,
                                b = void 0;
                            this.currentImageWidth / this.currentImageHeight <= this.player.width / this.player.height
                                ? ((b = Math.round((this.currentImageWidth / this.currentImageHeight) * this.player.height)), (a = this.player.height), (this.imageNode.width = b * this.scale), (this.imageNode.height = a * this.scale))
                                : ((a = Math.round((this.currentImageHeight / this.currentImageWidth) * this.player.width)), (b = this.player.width), (this.imageNode.height = a * this.scale), (this.imageNode.width = b * this.scale)),
                                (this.imageNode.style.left = Math.floor(this.player.width / 2 - b / 2) + this.player.width * this.translationX),
                                (this.imageNode.style.top = Math.floor(this.player.height / 2 - a / 2) + this.player.height * this.translationY);
                        }
                    },
                },
                {
                    key: "fixTrans",
                    value: function () {
                        var a = void 0,
                            b = void 0;
                        this.imageNode.width < this.player.width ? ((a = 0), (b = this.player.width - this.imageNode.width)) : ((a = this.player.width - this.imageNode.width), (b = 0));
                    },
                },
                {
                    key: "getDownloadImageWidthUtil",
                    value: function (a) {
                        var b = [240, 480, 768, 992, 1080, 1920, 3086, 4096];
                        return getFromArray(b, a);
                    },
                },
                {
                    key: "getDownloadImageWidth",
                    value: function () {
                        return this.getDownloadImageWidthUtil(this.player.width);
                    },
                },
                {
                    key: "getImageQuality",
                    value: function () {
                        var a = [25, 50, 100];
                        return getFromArray(a, this.imageQuality);
                    },
                },
                {
                    key: "getQualityImageUrlForUrl",
                    value: function (a) {
                        var b = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : -1;
                        if (!a) return "";
                        var c = a,
                            d = this.getWidthForImage(b);
                        (d = this.getDownloadImageWidthUtil(d)), (c = addParameter(c, "w", d));
                        var e = this.getImageQuality();
                        return (
                            100 != e
                                ? (c = this.canUseWebp ? addMultipleParameter(c, { fm: "webp", q: e }) : addMultipleParameter(c, { fm: "jpeg", q: e }))
                                : this.canUseWebp && 100 == e
                                ? (c = addParameter(c, "fm", "webp"))
                                : 100 == e && (c = addParameter(c, "fm", "jpeg")),
                            c
                        );
                    },
                },
                {
                    key: "getWidthForImage",
                    value: function (a) {
                        return a >= 0 && this.maxScaleForImages[a] && this.maxScaleForImages[a] > 1 ? this.downloadImageWidth * this.maxScaleForImages[a] : this.downloadImageWidth;
                    },
                },
                {
                    key: "downloadFromQueue",
                    value: function () {
                        var a = this,
                            b = function () {
                                var b = a.waitingForDownloadImageIndexQueue.pop(),
                                    c = Object.keys(a.imageInQueue).length;
                                if (c >= 4) return "break";
                                if ((a.images[b] && !a.images[b].getAttribute("update")) || (a.imageInQueue[b] && !a.imageInQueue[b].update)) return "continue";
                                var d = a.getQualityImageUrlForUrl(a.imagePathsArray[b], b),
                                    e = new Image();
                                if (d.indexOf("white.jpg") >= 0)
                                    e.setAttribute("w", 4096),
                                        e.setAttribute("q", 100),
                                        e.removeAttribute("update"),
                                        e.setAttribute("no", b),
                                        (e.src = ""),
                                        setTimeout(function () {
                                            var c = parseInt(b);
                                            (a.images[c] = e), a.imagesLoaded++, a.afterImageLoad(c);
                                        }, 1);
                                else {
                                    e.src = d;
                                    var f = a.getWidthForImage(b);
                                    e.setAttribute("w", f),
                                        e.setAttribute("q", a.imageQuality + ""),
                                        e.removeAttribute("update"),
                                        e.setAttribute("no", b),
                                        (a.imageInQueue[b] = { w: f, q: a.imageQuality, image: e }),
                                        (e.onload = function (b) {
                                            var c = parseInt(b.target.getAttribute("no"));
                                            (a.images[c] = b.target), a.imagesLoaded++, a.afterImageLoad(c);
                                        }),
                                        (e.onerror = function (b) {
                                            var c = parseInt(b.target.getAttribute("no"));
                                            return (
                                                delete a.imageInQueue[c],
                                                a.images[c]
                                                    ? void a.images[c].removeAttribute("update")
                                                    : (a.imageErrors[c] &&
                                                          a.imagePathsArray[c] &&
                                                          1 == a.imageErrors[c] &&
                                                          ((a.imagePathsArray[c] = a.player.getBackUpImageUrl(a.imagePathsArray[c].split("/").slice(-1)[0])),
                                                          a.waitingForDownloadImageIndexQueue.push(c),
                                                          setTimeout(function () {
                                                              return a.downloadFromQueue();
                                                          }, 250)),
                                                      a.imageErrors[c] && a.imageErrors[c] > 5 && a.nextImgIndex == c
                                                          ? void a.player.setError("IMAGE_ERROR", { ERROR_IMAGE_URL: b.target.src })
                                                          : ((a.imageErrors[c] = (a.imageErrors[c] ? a.imageErrors[c] : 0) + 1),
                                                            void (
                                                                a.nextImgIndex == c &&
                                                                (a.waitingForDownloadImageIndexQueue.push(c),
                                                                setTimeout(function () {
                                                                    return a.downloadFromQueue();
                                                                }, 250))
                                                            )))
                                            );
                                        });
                                }
                                return c >= 2 ? "break" : void 0;
                            };
                        a: for (; this.waitingForDownloadImageIndexQueue.length > 0; ) {
                            var c = b();
                            switch (c) {
                                case "break":
                                    break a;
                                case "continue":
                                    continue;
                            }
                        }
                    },
                },
                {
                    key: "afterImageLoad",
                    value: function (a) {
                        delete this.imageInQueue[a],
                            console.log("afterImageLoad:" + a + ":Q" + this.currentImageIndex),
                            a == this.currentImageIndex && this.updateImageNode(a),
                            this.player.imageLoading && this.images[this.nextImgIndex] && this.player.unsetImageLoading(),
                            this.waitingForDownloadImageIndexQueue.length > 0 && this.downloadFromQueue(),
                            this.updateImageBuffer();
                    },
                },
                {
                    key: "addOrReplaceImageNode",
                    value: function (a) {
                        this.imageNode && this.player.canvasDiv.removeChild(this.imageNode),
                            (this.imageNode = a),
                            (this.currentImageHeight = this.imageNode.height),
                            (this.currentImageWidth = this.imageNode.width),
                            (this.imageNode.style.position = "absolute"),
                            this.resizeImageNode(),
                            (this.imageNode.style.zIndex = 0),
                            this.player.canvasDiv.appendChild(this.imageNode),
                            (this.player.canvasDiv.style.opacity = 1);
                    },
                },
                {
                    key: "updateImageNode",
                    value: function (a) {
                        console.log("updateImageNode:" + a + ":C"), (this.currentImageIndex = a), this.addOrReplaceImageNode(this.images[a]), this.invalidate();
                    },
                },
                {
                    key: "switchImage",
                    value: function (a, b) {
                        if ((console.log("switch image:" + a + ":P"), !this.images[a])) return this.updateImageQueue(b), this.player.setImageLoading(), !1;
                        var c = this.currentImageIndex;
                        return (this.lastSwitchImageTime = b), this.updateImageNode(a), this.player.onChangeImageComplete(c, this.currentImageIndex), !0;
                    },
                },
                {
                    key: "preloadImages",
                    value: function () {
                        this.updateImageQueue(0);
                    },
                },
            ]),
            a
        );
    })(),
    PlayerStorage = new LocalStorage(),
    Player = (function () {
        function a(b) {
            var c = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
                d = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0,
                e = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
                f = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
                g = arguments.length > 5 && void 0 !== arguments[5] && arguments[5],
                h = !(arguments.length > 6 && void 0 !== arguments[6]) || arguments[6],
                i = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : 0,
                j = this,
                k = arguments.length > 8 && void 0 !== arguments[8] && arguments[8],
                l = !(arguments.length > 9 && void 0 !== arguments[9]) || arguments[9];
            _classCallCheck(this, a),
                (this.uuid = b),
                (this.playerId = a.generateUUID()),
                (this.browserId = a.generateUUID()),
                (this.state = NOT_STARTED),
                (this.audio = void 0),
                (this.meta = void 0),
                (this.events = void 0),
                (this.time = 0),
                (this.duration = 0),
                (this.width = 1024),
                (this.height = 768),
                (this.use_imgix = h),
                (this.player_version = i),
                (this.fullDownload = !1),
                (this.container = $("#container")),
                (this.canvas = document.getElementById("surface")),
                (this.canvasDiv = document.getElementById("container")),
                (this.ctx = this.canvas.getContext("2d")),
                (this.videoDiv = document.getElementById("video_div")),
                (this.controller = new Controller(this)),
                (this.imageManager = new ImageManager(this)),
                (this.canvasDrawing = new PointerDrawing(this)),
                (this.scrollManager = new ScrollManager(this)),
                (this.changeNextImageAt = void 0),
                (this.index = 0),
                (this.lastRun = 0),
                (this.audioLoading = !0),
                (this.imageLoading = !1),
                (this.version = d),
                (this.firstTimePlayed = !1),
                (this.clickedByUser = !1),
                (this.totalRunTime = 0),
                (this.lastEndRunTime = 0),
                (this.loadingDivVisible = !1),
                (this.lastPlayTime = 0),
                (this.lastSecond = 0),
                (this.defaultMinPlayBackTime = 30),
                (this.minPlayBackBufferTime = this.defaultMinPlayBackTime),
                (this.autoPlay = c),
                (this.playbackRate = 1),
                (this.audioTypeMono = !0),
                (this.switchAudioTypeFailed = !1),
                (this.audioStateCheckTimeout = void 0),
                (this.lastSecondWatchEventSend = 0),
                (this.watch_array = []),
                (this.total_unique_sum = 0),
                (this.prefix_time_before_current_audio_video = 0),
                (this.avSwitchTimes = []),
                (this.currentavIndex = 0),
                (this.audioCanPlay = !1),
                (this.debug = !1),
                e && this.toggleDebug(),
                (this.useNameAsUrl = !1),
                (this.fpsTimer = new Timer()),
                (this.currentRequestAnimationFrameId = void 0),
                (this.initializedTime = new Date().getTime()),
                (this.playerMode = PLAYER_MODE.PLAYER),
                f && (this.playerMode = PLAYER_MODE.SLIDE),
                (this.preventSleep = new PreventSleep()),
                (this.changingAudioState = !1),
                (this.switchAudioState = AUDIO_PLAY_STATE),
                (this.userAgent = new UserAgent()),
                (this.lastAudioFixTry = 0),
                (this.optimize = g),
                (this.avElement = void 0),
                (this.lastTimeAudioTimeChecked = -1),
                (this.isAudioTimeUpdateFunctionWorking = !1),
                (this.audioTimeUpdateFixerTimeout = void 0),
                (this.isLocal = !1),
                (this.seek_intro_video = k),
                (this.can_play_video = l && (!this.userAgent.IS_IOS || this.userAgent.IOS_VERSION >= 10)),
                $(window).resize(function () {
                    return j.resizeWindow();
                }),
                $("body").resize(function () {
                    return j.resizeWindow();
                });
            var m = getHiddenProp();
            if (m) {
                var n = m.replace(/[H|h]idden/, "") + "visibilitychange";
                document.addEventListener(n, function () {
                    console.log("visChange!!!!"), j.onbeforeunload();
                });
            } else {
                (window.onbeforeunload = function (a) {
                    j.onbeforeunload();
                }),
                    window.addEventListener("pagehide", function () {
                        j.onbeforeunload();
                    });
            }
            this.isAndroidApp() && AndroidApp.onLoaded && AndroidApp.onLoaded(),
                setInterval(function () {
                    j.sendWatchEvent();
                }, 400);
        }
        return (
            _createClass(
                a,
                [
                    {
                        key: "setLocal",
                        value: function (a) {
                            this.isLocal = a;
                        },
                    },
                    {
                        key: "canPlayVideo",
                        value: function () {
                            return this.can_play_video;
                        },
                    },
                    {
                        key: "shouldSeekIntro",
                        value: function () {
                            return this.seek_intro_video;
                        },
                    },
                    {
                        key: "updateDefaultUrl",
                        value: function () {
                            var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : DEFAULT_BASE_URL,
                                b = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : IMAGE_URL_BASE,
                                c = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                            (DEFAULT_BASE_URL = a), (AUDIO_URL_BASE = DEFAULT_BASE_URL), (IMAGE_BACKUP_URL_BASE = DEFAULT_BASE_URL), (IMAGE_URL_BASE = b), (HTTP_DEFAULT_BASE_URL = a), (HTTP_IMAGE_URL_BASE = b), (this.useNameAsUrl = c);
                        },
                    },
                    {
                        key: "getBaseUrl",
                        value: function () {
                            var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : DEFAULT_BASE_URL;
                            return a + this.uuid + SLASH;
                        },
                    },
                    {
                        key: "getMetaFileUrl",
                        value: function () {
                            return LOCAL ? DEFAULT_BASE_URL + META_FILE_NAME : this.getBaseUrl() + META_FILE_NAME;
                        },
                    },
                    {
                        key: "getEventFileUrl",
                        value: function () {
                            return LOCAL ? DEFAULT_BASE_URL + this.meta.event.file : this.getBaseUrl() + this.meta.event.file;
                        },
                    },
                    {
                        key: "isFileOrHttp",
                        value: function (a) {
                            return !(a.indexOf("file://") === -1 && a.indexOf("http://") === -1 && a.indexOf("https://") === -1 && !this.useNameAsUrl);
                        },
                    },
                    {
                        key: "get_video_width",
                        value: function () {
                            var a = [144, 240, 360, 480, 720];
                            return getFromArray(a, this.width);
                        },
                    },
                    {
                        key: "setHttpInUrlIfRequired",
                        value: function (a) {
                            return a.indexOf("http://") >= 0 && (a = addParameter(a, "http", "true")), a;
                        },
                    },
                    {
                        key: "get_hls_url",
                        value: function (a) {
                            return HLS_AUDIO_URL_BASE + this.uuid + "/" + a;
                        },
                    },
                    {
                        key: "has_audio_hls_url",
                        value: function () {
                            var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                                b = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0;
                            return !(!this.userAgent.browser.IS_IOS && !this.userAgent.browser.IS_SAFARI) && (b || (b = this.meta), !!b && void 0 != b.audio_clips.mapping[a].hls_path);
                        },
                    },
                    {
                        key: "getAudioFileUrl",
                        value: function () {
                            var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                                b = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
                                c = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0;
                            if ((c || (c = this.meta), !c)) return this.setError("META ASKED");
                            if (this.has_audio_hls_url(a, c)) return this.get_hls_url(c.audio_clips.mapping[a].hls_path);
                            if (c.audio_clips.mapping[a].redirected_url) return c.audio_clips.mapping[a].redirected_url;
                            if (this.isFileOrHttp(c.audio_clips.mapping[a].name)) return c.audio_clips.mapping[a].name;
                            var d = "";
                            c.audio_clips.base_path && "" != c.audio_clips.base_path && (d = c.audio_clips.base_path + "/");
                            var e = this.getBaseUrl(AUDIO_URL_BASE) + d + c.audio_clips.mapping[a].name;
                            return (e = this.setHttpInUrlIfRequired(e)), b && (e = addParameter(e, "mp3", "true")), e;
                        },
                    },
                    {
                        key: "getVideoFileUrl",
                        value: function () {
                            var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                                b = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0,
                                c = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0;
                            if ((b || (b = this.get_video_width()), c || (c = this.meta), !c)) return this.setError("META ASKED");
                            if (c.video_clips.mapping[a].redirected_url) return c.video_clips.mapping[a].redirected_url;
                            if (this.isFileOrHttp(c.video_clips.mapping[a].name)) return c.video_clips.mapping[a].name;
                            var d = "";
                            c.video_clips.base_path && "" != c.video_clips.base_path && (d = c.video_clips.base_path + "/");
                            var e = this.getBaseUrl(AUDIO_URL_BASE) + d + c.video_clips.mapping[a].name;
                            return (e = this.setHttpInUrlIfRequired(e)), (e = addParameter(e, "w", b));
                        },
                    },
                    {
                        key: "getThumbName",
                        value: function (a) {
                            return a.split(".")[0] + ".jpeg";
                        },
                    },
                    {
                        key: "getVideoThumbnailUrl",
                        value: function () {
                            var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 480;
                            if (this.isFileOrHttp(this.meta.video_clips.mapping[a].name)) return "";
                            var b = "";
                            this.meta.video_clips.base_path && "" != this.meta.video_clips.base_path && (b = this.meta.video_clips.base_path);
                            var c = this.getBaseUrl(AUDIO_URL_BASE) + b + "/thumbnails/" + this.getThumbName(this.meta.video_clips.mapping[a].name);
                            return (c = this.setHttpInUrlIfRequired(c));
                        },
                    },
                    {
                        key: "getStereoAudioFileUrl",
                        value: function () {
                            var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                            return this.getAudioFileUrl(a, !1);
                        },
                    },
                    {
                        key: "toggleDebug",
                        value: function () {
                            (this.debug = ~this.debug), this.debug && ($(".fps").toggle(), $(".player-wrapper").css("opacity", "1"));
                        },
                    },
                    {
                        key: "onbeforeunload",
                        value: function () {
                            this.canSaveLocalStorage() && this.saveToLocalStorage(), this.state !== ENDED && (this.lastEndRunTime = parseInt(this.totalRunTime));
                        },
                    },
                    {
                        key: "canSaveLocalStorage",
                        value: function () {
                            return !(this.state == ENDED || (this.duration > 0 && this.duration - this.time < 5));
                        },
                    },
                    {
                        key: "saveToLocalStorage",
                        value: function () {
                            PlayerStorage && PlayerStorage.setItem(this.uuid, JSON.stringify(this.getFullStatus()));
                        },
                    },
                    {
                        key: "clearLocalStorage",
                        value: function () {
                            PlayerStorage && PlayerStorage.clearItem(this.uuid);
                        },
                    },
                    {
                        key: "changeState",
                        value: function (a) {
                            var b = this.state;
                            console.log("change state:" + a + " from:" + b),
                                (this.state = a),
                                this.state == PLAYING && b != PLAYING
                                    ? (this.isAndroidApp() || this.preventSleep.enable(), this.controller.setPlay())
                                    : this.state != PLAYING &&
                                      (this.controller.changePlayerControllerVisibility(!0), this.isAndroidApp() || this.preventSleep.disable(), this.state == ENDED ? this.controller.setEnd() : b == PLAYING && this.controller.setPause()),
                                this.canSaveLocalStorage() ? this.saveToLocalStorage() : this.clearLocalStorage(),
                                b != a && (this.isAndroidApp() && AndroidApp.changeState && AndroidApp.changeState(a), this.sendEvent(EVENTS.STATE_CHANGE));
                        },
                    },
                    {
                        key: "isAndroidApp",
                        value: function () {
                            try {
                                if (AndroidApp) return !0;
                            } catch (a) {
                                return !1;
                            }
                        },
                    },
                    {
                        key: "isIosApp",
                        value: function () {
                            try {
                                if (webkit.messageHandlers) return !0;
                            } catch (a) {
                                return !1;
                            }
                        },
                    },
                    {
                        key: "getAppVersion",
                        value: function () {
                            try {
                                if (AndroidApp && AndroidApp.getAppVersion) return AndroidApp.getAppVersion();
                            } catch (a) {
                                return 0;
                            }
                            return 0;
                        },
                    },
                    {
                        key: "setMetaCallback",
                        value: function (a) {
                            (a = this.migrateOldMeta(a, a.version, 6)), this.userAgent.browser.IS_IOS || this.userAgent.browser.IS_SAFARI || (!this.isLocal && this.isAndroidApp()) ? this.checkForRedirectedUrl(a) : this.after_meta_done(a);
                        },
                    },
                    {
                        key: "checkForRedirectedUrl",
                        value: function (a) {
                            var b = this,
                                c = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                                d = a.video_clips.mapping,
                                e = [],
                                f = function (c) {
                                    var d = b.getVideoFileUrl(c, void 0, a);
                                    e.push(
                                        b
                                            .get_redirected_url(d)
                                            .then(function (b) {
                                                a.video_clips.mapping[c].redirected_url = b.target.response;
                                            })
                                            ["catch"](function (a) {
                                                throw a;
                                            })
                                    );
                                };
                            for (var g in d) f(g);
                            var h = a.audio_clips.mapping,
                                i = function (c) {
                                    var d = b.getAudioFileUrl(c, !0, a);
                                    b.has_audio_hls_url(c, a) ||
                                        e.push(
                                            b
                                                .get_redirected_url(d)
                                                .then(function (b) {
                                                    a.audio_clips.mapping[c].redirected_url = b.target.response;
                                                })
                                                ["catch"](function (a) {
                                                    throw a;
                                                })
                                        );
                                };
                            for (var g in h) i(g);
                            e.length > 0
                                ? Promise.all(e)
                                      .then(function () {
                                          b.after_meta_done(a);
                                      })
                                      ["catch"](function (d) {
                                          return console.log(d), c < 3 ? void b.checkForRedirectedUrl(a, c + 1) : b.setError("REDIRECT_ERROR", { error: d });
                                      })
                                : this.after_meta_done(a);
                        },
                    },
                    {
                        key: "after_meta_done",
                        value: function (a) {
                            (this.meta = a), (this.duration = a.duration), (this.watch_array = new Array(Math.ceil(this.duration)));
                            for (var b = 0; b < this.watch_array.length; b++) this.watch_array[b] = 0;
                            this.onMetaLoaded();
                        },
                    },
                    {
                        key: "get_redirected_url",
                        value: function (a) {
                            return new Promise(function (b, c) {
                                var d = new XMLHttpRequest();
                                (a = addParameter(a, "v", "1")), d.open("GET", addParameter(a, "no_redirect", "true")), (d.onload = b), (d.onerror = c), d.send(null);
                            });
                        },
                    },
                    {
                        key: "get_file_dict",
                        value: function (a) {
                            return { name: a };
                        },
                    },
                    {
                        key: "typed_mapping",
                        value: function (a, b) {
                            return { mapping: a, base_path: b };
                        },
                    },
                    {
                        key: "migrateOldMeta",
                        value: function (a) {
                            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 6;
                            if (a.version >= 6) return a;
                            var b = {};
                            for (var c in a.images) b[c] = this.get_file_dict(a.images[c]);
                            var d = { 0: this.get_file_dict(a.audio.file) },
                                e = a.audio_hls;
                            return (
                                (a = {
                                    image_clips: this.typed_mapping(b, "images"),
                                    audio_clips: this.typed_mapping(d, ""),
                                    video_clips: this.typed_mapping({}, "video"),
                                    duration: a.duration,
                                    event: a.event,
                                    uuid: a.uuid,
                                    thumbnail: { file: this.get_file_dict(a.thumbnail), base_path: "images" },
                                    version: a.version,
                                }),
                                e && (a.audio_clips.mapping[0].hls_path = e),
                                a
                            );
                        },
                    },
                    {
                        key: "setEventsCallBack",
                        value: function (a) {
                            (this.events = a), this.onEventsLoaded();
                        },
                    },
                    {
                        key: "setError",
                        value: function (a) {
                            var b = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                            this.state != ERROR && (console.log("error occurred:" + a + JSON.stringify(b)), this.pause(), this.changeState(ERROR), (b.TYPE = a), this.sendEvent(EVENTS.ERROR, b), $(".player_error").fadeIn(1));
                        },
                    },
                    {
                        key: "loadMeta",
                        value: function () {
                            var a = this,
                                b = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                            return b > 4
                                ? void this.setError("META_ERROR")
                                : void $.getJSON(this.getMetaFileUrl(), function (b) {
                                      return a.setMetaCallback(b);
                                  }).fail(function () {
                                      setTimeout(function () {
                                          return a.loadMeta(b + 1);
                                      }, 250);
                                  });
                        },
                    },
                    {
                        key: "loadEvents",
                        value: function () {
                            var a = this,
                                b = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                            return b > 4
                                ? void this.setError("EVENTS_ERROR")
                                : void $.getJSON(this.getEventFileUrl(), function (b) {
                                      return a.setEventsCallBack(b);
                                  }).fail(function () {
                                      setTimeout(function () {
                                          return a.loadEvents(b + 1);
                                      }, 250);
                                  });
                        },
                    },
                    {
                        key: "loadAudio",
                        value: function (a) {
                            var b = this,
                                c = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "audio";
                            this.canPlayVideo() && this.hasIntroVideo() ? (this.audio = document.createElement("video")) : (this.audio = document.createElement("audio")),
                                this.audio.setAttribute("webkit-playsinline", ""),
                                this.audio.setAttribute("id", "video"),
                                this.audio.setAttribute("playsinline", ""),
                                this.videoDiv.appendChild(this.audio),
                                (this.audio.controls = !1),
                                (this.avElement = $("#video")),
                                (this.audio.preload = "auto"),
                                (this.audio.volume = this.controller.currentVolume),
                                this.audio.addEventListener("canplaythrough", function () {
                                    console.log("canplaythrough"), b.onAudioCanPlay();
                                }),
                                this.audio.addEventListener("loadedmetadata", function () {
                                    console.log("loadedmetadata"), b.resizeVideo();
                                }),
                                (this.audio.oncanplay = function () {
                                    console.log("canplay"), b.resizeVideo(), b.onAudioCanPlay();
                                }),
                                (this.audio.onpause = function () {
                                    return b.onAudioPause();
                                }),
                                (this.audio.onplay = function () {
                                    return b.onAudioPlay();
                                }),
                                (this.audio.onprogress = function () {
                                    return b.onProgressAudio();
                                }),
                                (this.audio.ontimeupdate = function () {
                                    return b.onAudioTimeUpdate();
                                }),
                                (this.audio.onended = function () {
                                    return b.onEnd();
                                }),
                                (this.audio.onplaying = function () {
                                    b.unSetAudioLoading(), console.log("onplaying");
                                }),
                                (this.audio.onwaiting = function () {
                                    b.setAudioLoading(), console.log("on wait");
                                }),
                                this.audio.addEventListener(
                                    "error",
                                    function (a) {
                                        b.audioLoading && b.audio.error && b.onAudioError(b.audio.error.code);
                                    },
                                    !0
                                ),
                                this.userAgent.browser.IS_MOBILE || this.setAudioSourceAndLoad(a, c),
                                this.resizeVideo();
                        },
                    },
                    {
                        key: "hideVideo",
                        value: function () {
                            this.avElement.finish(), (this.videoDiv.style.zIndex = 0), (this.videoDiv.style.display = "none");
                        },
                    },
                    {
                        key: "showVideo",
                        value: function () {
                            this.avElement.finish(),
                                (this.videoDiv.style.display = "block"),
                                (this.videoDiv.style.zIndex = 1),
                                (this.audio.style.width = "auto"),
                                (this.audio.style.display = "block"),
                                this.resizeVideo(),
                                this.canPlayVideo() && (this.audio.poster = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
                        },
                    },
                    {
                        key: "setAudioSourceAndLoad",
                        value: function (a) {
                            var b = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "audio";
                            (this.audio.src = a),
                                "video" == b ? this.showVideo() : this.hideVideo(),
                                this.audio.load(),
                                (this.audio.playbackRate = this.playbackRate),
                                console.log("source loaded"),
                                setTimeout(function () {
                                    $(".player_initial_loading").is(":visible") && $(".slow_net_text").show();
                                }, 12e3);
                        },
                    },
                    {
                        key: "canPlayMp4Format",
                        value: function () {
                            return !this.isAndroidApp() && this.audio && this.audio.canPlayType && this.audio.canPlayType("video/mp4").replace(/no/, "") && !this.switchAudioTypeFailed;
                        },
                    },
                    {
                        key: "isVideoPlaying",
                        value: function () {
                            return !(this.avSwitchTimes.length <= 0) && "video" == this.avSwitchTimes[this.currentavIndex].type;
                        },
                    },
                    {
                        key: "updateMonoSourceAndLoad",
                        value: function () {
                            this.audioTypeMono &&
                                !LOCAL &&
                                this.canPlayMp4Format() &&
                                !this.isVideoPlaying() &&
                                ((this.audioTypeMono = !1), this.updateAudioSourceAndLoadInternal(this.getStereoAudioFileUrl(this.get_current_index())), PlayerStorage.setItemWithExpiry(PLAY_MP4, !0, 36e5), console.log("source updated"));
                        },
                    },
                    {
                        key: "updateAudioSourceAndLoadInternal",
                        value: function (a) {
                            (this.audio.src = a),
                                this.changeAudioTime(this.time - this.prefix_time_before_current_audio_video),
                                this.audio.load(),
                                this.imageLoading || this.state != PLAYING ? this.audio.pause() : this.audio.play(),
                                (this.audio.playbackRate = this.playbackRate);
                        },
                    },
                    {
                        key: "changeAudioTime",
                        value: function (a) {
                            try {
                                this.audio.currentTime = a;
                            } catch (b) {}
                        },
                    },
                    {
                        key: "get_current_index",
                        value: function () {
                            return this.avSwitchTimes.length <= 0 ? 0 : this.avSwitchTimes[this.currentavIndex].i;
                        },
                    },
                    {
                        key: "onAudioError",
                        value: function (a) {
                            this.audioTypeMono
                                ? this.setError("AUDIO_ERROR", { AUDIO_ERROR_CODE: a })
                                : ((this.switchAudioTypeFailed = !0), (this.audioTypeMono = !1), PlayerStorage.clearItem(PLAY_MP4), this.updateAudioSourceAndLoadInternal(this.getAudioFileUrl(this.get_current_index())));
                        },
                    },
                    {
                        key: "onAudioPlay",
                        value: function () {
                            console.log("onAudioPlay" + this.state),
                                this.state != ENDED &&
                                    (this.audioStateCheckTimeout && clearTimeout(this.audioStateCheckTimeout),
                                    this.changingAudioState
                                        ? ((this.changingAudioState = !1), this.switchAudioState == AUDIO_PAUSE_STATE && (console.log("switching pause"), this.audioPause()))
                                        : this.state == PAUSED && (console.log("play by external"), this.play()),
                                    this.resizeVideo());
                        },
                    },
                    {
                        key: "onAudioPause",
                        value: function () {
                            console.log("onAudioPause"),
                                this.audioStateCheckTimeout && clearTimeout(this.audioStateCheckTimeout),
                                this.changingAudioState
                                    ? ((this.changingAudioState = !1), this.switchAudioState == AUDIO_PLAY_STATE && this.state == PLAYING && (console.log("switching play"), this.audioPlay()))
                                    : this.state != PLAYING || this.imageLoading || (Math.abs(this.audio.currentTime - this.audio.duration) > 2 && (console.log("pause by external"), this.pause()));
                        },
                    },
                    {
                        key: "audioStateCheck",
                        value: function () {
                            console.log("audioStateCheck"),
                                this.changingAudioState &&
                                    ((this.changingAudioState = !1), this.switchAudioState == AUDIO_PLAY_STATE ? (this.audioPlay(), this.audioTimeUpdateFixer()) : this.switchAudioState == AUDIO_PAUSE_STATE && this.audioPause());
                        },
                    },
                    {
                        key: "audioPlay",
                        value: function () {
                            var a = this,
                                b = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                            if (this.audio.error && this.audio.error.code) return void this.onAudioError(this.audio.error.code);
                            if (
                                (b || !this.imageLoading) &&
                                ((this.switchAudioState = AUDIO_PLAY_STATE),
                                this.audio.paused &&
                                    (console.log("playing"),
                                    !this.changingAudioState &&
                                        ((this.changingAudioState = !0),
                                        console.log("changing state play"),
                                        (this.audioStateCheckTimeout = setTimeout(function () {
                                            a.audioStateCheck();
                                        }, 1e3)),
                                        (1 != this.audio.duration || this.isAndroidApp()) && isFinite(this.audio.duration))))
                            ) {
                                var c = 0 == this.audio.volume,
                                    d = this.audio.play();
                                try {
                                    d instanceof Promise &&
                                        d["catch"](function (b) {
                                            if ("NotAllowedError" == b.name) {
                                                if (c) return a.pause(), void a.controller.addPlayButton();
                                                setTimeout(function () {
                                                    if (0 != a.audio.volume) {
                                                        var b = a.audio.volume;
                                                        a.updateVolume(0),
                                                            (a.changingAudioState = !1),
                                                            clearTimeout(a.audioStateCheckTimeout),
                                                            (a.audioStateCheckTimeout = null),
                                                            a.audioPlay(!0),
                                                            setTimeout(function () {
                                                                a.updateVolume(b);
                                                            }, 1e3);
                                                    }
                                                }, 10);
                                            }
                                            console.error(b);
                                        });
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                        },
                    },
                    {
                        key: "audioPause",
                        value: function () {
                            var a = this;
                            (this.switchAudioState = AUDIO_PAUSE_STATE),
                                this.audio.paused ||
                                    (console.log("pausing"),
                                    this.changingAudioState ||
                                        (console.log("changing state pause"),
                                        (this.changingAudioState = !0),
                                        this.audio.pause(),
                                        (this.audioStateCheckTimeout = setTimeout(function () {
                                            a.audioStateCheck();
                                        }, 1e3))));
                        },
                    },
                    {
                        key: "onAudioCanPlay",
                        value: function () {
                            this.changingAudioState &&
                                (this.switchAudioState == AUDIO_PLAY_STATE ? ((this.changingAudioState = !1), this.audioPlay()) : this.switchAudioState == AUDIO_PAUSE_STATE && ((this.changingAudioState = !1), this.audioPause())),
                                this.unSetAudioLoading();
                        },
                    },
                    {
                        key: "onProgressAudio",
                        value: function () {
                            console.log("onProgressAudio");
                            var a = this._getAudioBuffer();
                            if (a.length > 0)
                                for (var b = a.length; b--; ) {
                                    var c = a.end(b),
                                        d = a.start(b);
                                    this.time >= d &&
                                        this.time < c &&
                                        (!this.audioCanPlay && c - this.time > this.defaultMinPlayBackTime && this.onAudioCanPlay(),
                                        (this.minPlayBackBufferTime = Math.max(this.defaultMinPlayBackTime, c - this.time)),
                                        (this.imageManager.imageQuality = Math.min(100, 5 * parseInt(parseInt(2 * this.minPlayBackBufferTime + 5) / 5))));
                                }
                            this.onBufferChange();
                        },
                    },
                    {
                        key: "canPlay",
                        value: function () {
                            return this.meta && this.events;
                        },
                    },
                    {
                        key: "audioTimeUpdateFixer",
                        value: function () {
                            var a = this;
                            this.isAudioTimeUpdateFunctionWorking ||
                                (this.audio && this.lastTimeAudioTimeChecked >= 0
                                    ? this.audio.currentTime - this.lastTimeAudioTimeChecked >= 0.5 &&
                                      ((this.lastTimeAudioTimeChecked = this.audio.currentTime), this.onProgressAudio(), this.onAudioTimeUpdate(!0), console.log("audioTimeUpdateFixerFixing"))
                                    : this.audio && (this.lastTimeAudioTimeChecked = this.audio.currentTime),
                                this.audioTimeUpdateFixerTimeout && clearTimeout(this.audioTimeUpdateFixerTimeout),
                                (this.audioTimeUpdateFixerTimeout = setTimeout(function () {
                                    return a.audioTimeUpdateFixer();
                                }, 600)));
                        },
                    },
                    {
                        key: "onAudioTimeUpdate",
                        value: function () {
                            var a = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                            a || (this.isAudioTimeUpdateFunctionWorking = !0),
                                this.audioLoading && (this.unSetAudioLoading(), this.drawFrames()),
                                (this.state == PLAYING && !this.imageLoading && this.canPlay()) ||
                                    (console.log("state fix:" + this.state + "imageloading:" + this.imageLoading), this.audioPause(), (!this.imageLoading && this.canPlay()) || this.setLoading()),
                                this.imageManager.timeUpdate(this.time),
                                this.scrollManager.timeUpdate(this.time);
                        },
                    },
                    {
                        key: "getWidth",
                        value: function () {
                            return this.width;
                        },
                    },
                    {
                        key: "getHeight",
                        value: function () {
                            return this.height;
                        },
                    },
                    {
                        key: "setWidth",
                        value: function (a) {
                            this.width = a;
                        },
                    },
                    {
                        key: "setHeight",
                        value: function (a) {
                            this.height = a;
                        },
                    },
                    {
                        key: "resizeWindow",
                        value: function () {
                            console.log("resize window called"),
                                (this.width = this.container.width()),
                                (this.height = this.container.height()),
                                window.innerWidth / window.innerHeight > 16 / 9
                                    ? ((this.height = window.innerHeight), (this.width = Math.round((16 * this.height) / 9)))
                                    : ((this.width = window.innerWidth), (this.height = Math.round((9 * this.width) / 16))),
                                this.container.width(this.width),
                                this.container.height(this.height),
                                (this.canvasDiv.style.opacity = 1),
                                (this.canvas.height = 4 * this.height),
                                (this.canvas.width = this.width),
                                this.resizeVideo(),
                                this.resizeContainer(),
                                this.imageManager.onWindowResize(),
                                this.controller.onWindowResize(),
                                this.canvasDrawing.onWindowResize();
                        },
                    },
                    {
                        key: "resizeContainer",
                        value: function () {
                            (this.canvasDiv.style.left = Math.floor(window.innerWidth / 2 - this.width / 2)), (this.canvasDiv.style.top = Math.floor(window.innerHeight / 2 - this.height / 2));
                        },
                    },
                    {
                        key: "resizeVideo",
                        value: function () {
                            if (this.audio && this.audio.videoHeight && this.audio.videoWidth && this.audio.videoWidth > 0) {
                                var a = this.audio.videoWidth,
                                    b = this.audio.videoHeight,
                                    c = 0,
                                    d = 0;
                                a / b <= this.width / this.height ? ((c = Math.round((a / b) * this.height)), (d = this.height)) : ((d = Math.round((b / a) * this.width)), (c = this.width)),
                                    (this.audio.style.width = c),
                                    (this.audio.style.height = d),
                                    (this.videoDiv.style.width = c),
                                    (this.videoDiv.style.height = d),
                                    (this.videoDiv.style.left = Math.floor(this.width / 2 - c / 2)),
                                    (this.videoDiv.style.top = Math.floor(this.height / 2 - d / 2));
                            } else (this.videoDiv.style.height = this.height), (this.videoDiv.style.width = this.width), this.audio && ((this.audio.style.width = this.width), (this.audio.style.height = this.height));
                            this.audio && (this.audio.width = "100%"), this.isAndroidApp() && this.audio && (this.audio.setAttribute("controls", ""), (this.audio.controls = !1));
                        },
                    },
                    {
                        key: "isStarted",
                        value: function () {
                            return this.state != NOT_STARTED;
                        },
                    },
                    {
                        key: "updateVolume",
                        value: function (a) {
                            this.audio && (this.audio.volume = a);
                        },
                    },
                    {
                        key: "init",
                        value: function () {
                            var a = this;
                            this._setBrowserId(),
                                (this.canvas.style.zIndex = 1),
                                (this.canvas.style.top = 0),
                                (this.canvas.style.left = 0),
                                $(window).load(function () {
                                    return a.resizeWindow();
                                }),
                                this.loadMeta(),
                                window.addEventListener
                                    ? addEventListener(
                                          "message",
                                          function (b) {
                                              return a.listener(b);
                                          },
                                          !1
                                      )
                                    : attachEvent("onmessage", function (b) {
                                          return a.listener(b);
                                      }),
                                this.sendEvent(EVENTS.INITIALIZED),
                                this.sendEvent(EVENTS.USER_AGENT, this.userAgent.browser),
                                this.preventSleep.setPauseListener(function () {
                                    a.pause();
                                }),
                                this.controller.init();
                        },
                    },
                    {
                        key: "_setBrowserId",
                        value: function () {
                            if (PlayerStorage) {
                                var a = PlayerStorage.getItem(EVENTS.BROWSER_ID);
                                a ? (this.browserId = a) : PlayerStorage.setItem(EVENTS.BROWSER_ID, this.browserId);
                            }
                        },
                    },
                    {
                        key: "_setStateFromLocalStorage",
                        value: function () {
                            if (PlayerStorage) {
                                var a = PlayerStorage.getItem(this.uuid);
                                if (a)
                                    try {
                                        if (((a = JSON.parse(a)), !a)) return;
                                        if (a.state != ENDED && a.CURRENT_TIME && parseInt(a.CURRENT_TIME) < this.duration - 5) {
                                            var b = parseInt(a.CURRENT_TIME);
                                            if (b) {
                                                var c = b - 5 < 0 ? 0 : b - 5;
                                                this.controller.setSeekTime(c), (this.time = c);
                                            }
                                        }
                                    } catch (d) {
                                        console.log("json parse error");
                                    }
                                else this.saveToLocalStorage();
                            }
                        },
                    },
                    {
                        key: "listener",
                        value: function (a) {
                            if (a && a.data)
                                switch (a.data) {
                                    case "play":
                                        this.play();
                                        break;
                                    case "pause":
                                        this.pause();
                                        break;
                                    case "beforeunload":
                                        this.onbeforeunload();
                                }
                        },
                    },
                    {
                        key: "getImageUrl",
                        value: function (a) {
                            if (!a) return "";
                            if ((console.log("image_base" + IMAGE_URL_BASE), !IMAGE_URL_BASE || this.useNameAsUrl)) return console.log("image_url" + a), a;
                            var b = this.getBaseUrl(IMAGE_URL_BASE) + "images/" + a;
                            return (b = this.setHttpInUrlIfRequired(b));
                        },
                    },
                    {
                        key: "getBackUpImageUrl",
                        value: function (a) {
                            var b = this.getBaseUrl(IMAGE_BACKUP_URL_BASE) + "images_player/" + a;
                            return (b = this.setHttpInUrlIfRequired(b));
                        },
                    },
                    {
                        key: "getImagePathArray",
                        value: function () {
                            var a = [],
                                b = (Object.keys(this.meta.image_clips.mapping).length, 0);
                            for (var c in this.meta.image_clips.mapping) this.meta.image_clips.mapping.hasOwnProperty(c) && (b = Math.max(parseInt(c)));
                            console.log("Max image:" + b);
                            for (var d = 0; d <= b; d++) this.meta.image_clips.mapping[d] ? (a[d] = this.getImageUrl(this.meta.image_clips.mapping[d].name)) : (a[d] = this.getImageUrl(d + ".jpeg"));
                            return a;
                        },
                    },
                    {
                        key: "get_thumbnail",
                        value: function (a) {
                            return this.meta.thumbnail && this.meta.thumbnail.file.name ? this.meta.thumbnail.file.name : this.meta.image_clips.mapping[a > 2 ? 2 : a - 1].name;
                        },
                    },
                    {
                        key: "hasIntroVideo",
                        value: function () {
                            return 0 != Object.keys(this.meta.video_clips.mapping).length;
                        },
                    },
                    {
                        key: "onMetaLoaded",
                        value: function () {
                            console.log("meta loaded"), this._setStateFromLocalStorage(), this.sendEvent(EVENTS.META_LOADED), this.setDrawingVersion();
                            var a = Object.keys(this.meta.image_clips.mapping).length;
                            this.loadEvents(),
                                this.hasIntroVideo() && this.canPlayVideo() && !this.shouldSeekIntro() ? this.loadAudio(this.getVideoFileUrl(0), "video") : this.loadAudio(this.getAudioFileUrl(0)),
                                this.imageManager.setThumbnail(this.get_thumbnail(a)),
                                this.controller.timeUpdate(this.time, this.duration),
                                this.imageManager.setImagePathArray(this.getImagePathArray()),
                                this.autoPlay && this.isAndroidApp() && AndroidApp.play ? AndroidApp.play() : this.canAutoPlay() && this.play();
                        },
                    },
                    {
                        key: "setDrawingVersion",
                        value: function () {
                            switch ((!this.version && this.meta.version && (this.version = this.meta.version), this.version)) {
                                case 1:
                                    this.canvasDrawing = new PointerDrawing(this);
                                    break;
                                case 2:
                                case 3:
                                    this.canvasDrawing = new MultiDrawing(this, this.optimize);
                                    break;
                                case 4:
                                    this.canvasDrawing = new MultiDrawing(this, this.optimize);
                                    break;
                                default:
                                    this.canvasDrawing = new MultiDrawing(this, this.optimize);
                            }
                        },
                    },
                    {
                        key: "fixPoints",
                        value: function (a) {
                            var b = this;
                            if ("undefined" != typeof Worker) {
                                var c = new Worker("./js/PointFixWorker.js");
                                c.addEventListener("message", function (a) {
                                    if (a.data && a.data.length > 0) {
                                        for (var d = 0; d < a.data.length; d++) b.events[d] = a.data[d];
                                        c.terminate();
                                    }
                                }),
                                    c.postMessage(this.events);
                            } else this.fixPointsLocal(a);
                        },
                    },
                    {
                        key: "fixPointsLocal",
                        value: function (a) {
                            var b = this,
                                c = fixPoints(a, this.events);
                            c + 1 < this.events.length &&
                                setTimeout(function () {
                                    return b.fixPointsLocal(c + 1, b.events);
                                }, 0);
                        },
                    },
                    {
                        key: "getAvPreFixIndex",
                        value: function (a) {
                            return this.avSwitchTimes.binarySearch(a, function (a, b) {
                                return parseFloat(a.time) - b;
                            });
                        },
                    },
                    {
                        key: "getAvFixTime",
                        value: function (a) {
                            return this.avSwitchTimes[a].time;
                        },
                    },
                    {
                        key: "onEventsLoaded",
                        value: function () {
                            console.log("events loaded");
                            var a = [],
                                b = [],
                                c = [],
                                d = [],
                                e = [],
                                f = { 0: 1 },
                                g = 0,
                                h = [],
                                i = [];
                            (i[g] = []), b.push({ time: 0, color: "#1380D0" }), c.push({ time: 0, brush: 0 }), d.push({ time: 0, matrix: [0, 0, 1], i: 0 }), this.fixPoints(0);
                            for (var j = 0; j < this.events.length; j++) {
                                var k = this.events[j].a;
                                switch (((this.events[j].globalIndex = j), k)) {
                                    case "start":
                                    case "move":
                                    case "end":
                                        i[g].push(this.events[j]);
                                        break;
                                    case "color_change":
                                        b.push({ time: parseFloat(this.events[j].t), color: this.events[j].c }), i[g].push(this.events[j]);
                                        break;
                                    case "clear_draw":
                                        this.canvasDrawing.clearPath(), this.canvasDrawing.erase();
                                        break;
                                    case "switch_image":
                                        (g = this.events[j].i), f[g] || (f[g] = 1), a.push({ time: parseFloat(this.events[j].t), index: g }), i[g] || (i[g] = []);
                                        break;
                                    case "brush_change":
                                        c.push({ time: parseFloat(this.events[j].t), brush: this.events[j].b }), i[g].push(this.events[j]);
                                        break;
                                    case "switch_video":
                                        h.push({ time: parseFloat(this.events[j].t), i: this.events[j].i, st: this.events[j].st, type: "video" }), a.push({ time: parseFloat(this.events[j].t), index: NO_INDEX });
                                        break;
                                    case "switch_audio":
                                        h.push({ time: parseFloat(this.events[j].t), i: this.events[j].i, st: this.events[j].st, type: "audio" });
                                        break;
                                    case "matrix":
                                        (f[g] = Math.max(f[g], this.events[j].s)), this.events[j].s < 3.1 && d.push({ time: parseFloat(this.events[j].t), matrix: [this.events[j].x, this.events[j].y, this.events[j].s], i: g });
                                        break;
                                    case "drag":
                                        e.push({ time: parseFloat(this.events[j].t), dx: this.events[j].dx, dy: this.events[j].dy });
                                        break;
                                    case "undo":
                                        i[g].push(this.events[j]);
                                }
                            }
                            if (
                                (0 == h.length && h.push({ time: 0, i: 0, st: 0, type: "audio" }),
                                (this.avSwitchTimes = h),
                                this.imageManager.setSwitchImageTime(a),
                                this.imageManager.setMatrixChangeTime(d),
                                this.canvasDrawing.setColorSwitchTime(b),
                                this.imageManager.setMaxScaleForImages(f),
                                this.scrollManager.setScrollEvents(e, a),
                                this.canvasDrawing.setCursorColor("#1380D0"),
                                this.canvasDrawing.setSlideDrawEvents(i),
                                this.canvasDrawing.setMovementPoints && this.canvasDrawing.setMovementPoints(this.events),
                                this.canvasDrawing.setBrushSwitchTime && this.canvasDrawing.setBrushSwitchTime(c),
                                this.userAgent.browser.IS_MOBILE || this.controller.setBreakPoints(a),
                                this.state != PAUSED && (this.play(), this.unSetLoading()),
                                this.sendEvent(EVENTS.EVENTS_LOADED),
                                this.isVideoPlaying() && (!this.canPlayVideo() || this.shouldSeekIntro()))
                            ) {
                                var l = this.get_next_audio_index();
                                l > 0 ? this.seekTo(this.avSwitchTimes[l].time) : this.seekTo(this.duration);
                            }
                        },
                    },
                    {
                        key: "get_next_audio_index",
                        value: function () {
                            for (var a = this.currentavIndex + 1; a < this.avSwitchTimes.length; ) {
                                if ("audio" == this.avSwitchTimes[a].type) return a;
                                a++;
                            }
                            return this.hasIntroVideo() ? 1 : 0;
                        },
                    },
                    {
                        key: "onBufferChange",
                        value: function () {
                            this.controller.bufferLength();
                        },
                    },
                    {
                        key: "_getImageBuffer",
                        value: function () {
                            return this.imageManager.imagePreloadBufferRange;
                        },
                    },
                    {
                        key: "_getAudioBuffer",
                        value: function () {
                            return this.audio ? this.audio.buffered : [];
                        },
                    },
                    {
                        key: "setPlayBackSpeed",
                        value: function (a) {
                            (this.playbackRate = a), this.sendEvent(EVENTS.PLAYBACK_RATE_CHANGE, { PLAYBACK_RATE: this.playbackRate }), this.audio && (this.audio.playbackRate = a);
                        },
                    },
                    {
                        key: "getBufferLength",
                        value: function () {
                            var a = [],
                                b = 0,
                                c = this._getAudioBuffer();
                            if (c.length > 0)
                                for (var d = c.length; d--; )
                                    for (var e = this.prefix_time_before_current_audio_video + c.end(d), f = this.prefix_time_before_current_audio_video + c.start(d), g = -1, h = -1, i = this._getImageBuffer(), j = i.length; j--; )
                                        ((i[j].start <= f && i[j].end > f) || (f <= i[j].start && e > i[j].start)) && ((g = Math.max(i[j].start, f)), (h = Math.min(i[j].end, e)), (a[b++] = { start: g, end: h }));
                            return a;
                        },
                    },
                    {
                        key: "generateFrames",
                        value: function (a) {
                            for (
                                this.currentColor = 0,
                                    this.canvasDrawing.colorSwitchTime &&
                                        (this.currentColor = this.canvasDrawing.colorSwitchTime[
                                            this.canvasDrawing.colorSwitchTime.binarySearch(a, function (a, b) {
                                                return a.time - b;
                                            })
                                        ].color);
                                this.index < this.events.length - 1 && this.events[this.index].t <= a;

                            ) {
                                var b = this.events[this.index],
                                    c = b.a;
                                switch (c) {
                                    case "start":
                                    case "move":
                                    case "end":
                                        var d = b.p.x,
                                            e = b.p.y;
                                        this.canvasDrawing.findxy(c, parseFloat(d), parseFloat(e), parseFloat(b.t), this.index, this.currentColor);
                                        break;
                                    case "color_change":
                                        this.canvasDrawing.setCursorColor(b.c), (this.currentColor = b.c), console.log("color_change: ", b.c);
                                        break;
                                    case "clear_draw":
                                        this.canvasDrawing.clearPath(), this.canvasDrawing.erase();
                                        break;
                                    case "switch_image":
                                        console.log("switch_image:" + b.i + " :" + this.imageManager.currentImageIndex),
                                            this.canvasDrawing.clearPath(),
                                            this.canvasDrawing.erase(),
                                            this.imageManager.onSwitchImageEvent(parseInt(b.i), parseFloat(b.t));
                                        break;
                                    case "brush_change":
                                        console.log("brush_change:" + b.b), this.canvasDrawing.setBrush && this.canvasDrawing.setBrush(b.b);
                                        break;
                                    case "switch_video":
                                        this.canvasDrawing.clearPath(), this.canvasDrawing.erase(), this.imageManager.onSwitchImageEvent(parseInt(101), parseFloat(b.t));
                                        break;
                                    case "matrix":
                                        var f = b.x,
                                            g = b.y,
                                            h = b.s;
                                        this.canvasDrawing.clearPath(), this.canvasDrawing.erase(), this.imageManager.onMatrixChange(f, g, h);
                                        break;
                                    case "undo":
                                        this.canvasDrawing.undo(b.t);
                                }
                                this.index++;
                            }
                        },
                    },
                    {
                        key: "checkForSupport",
                        value: function (a) {
                            var b = this.avSwitchTimes[a];
                            if (!this.canPlayVideo() && "video" == b.type) {
                                var c = this.duration;
                                return this.avSwitchTimes.length > a + 1 && this.avSwitchTimes[a + 1] && (c = this.avSwitchTimes[a + 1].time), this.resetSeek(), this.seekTo(c), !1;
                            }
                            return !0;
                        },
                    },
                    {
                        key: "switchAv",
                        value: function (a) {
                            if (0 == this.avSwitchTimes.length) return this.hasIntroVideo() && this.canPlayVideo() ? this.play_video({ time: 0, i: 0, st: 0, type: "video" }) : this.play_audio({ time: 0, i: 0, st: 0, type: "audio" }), !0;
                            if (a > this.avSwitchTimes.length || !this.checkForSupport(a)) return !1;
                            var b = this.avSwitchTimes[a];
                            return clearTimeout(this.audioStateCheckTimeout), (this.changingAudioState = !1), (this.switchAudioState = AUDIO_PLAY_STATE), "video" == b.type ? this.play_video(b) : this.play_audio(b), !0;
                        },
                    },
                    {
                        key: "play_video",
                        value: function (a) {
                            (this.prefix_time_before_current_audio_video = a.time), this.setAudioSourceAndLoad(this.getVideoFileUrl(a.i), a.type), this.changeAudioTime(a.st), this.play();
                        },
                    },
                    {
                        key: "play_audio",
                        value: function (a) {
                            (this.prefix_time_before_current_audio_video = a.time), this.setAudioSourceAndLoad(this.getAudioFileUrl(a.i), a.type), this.changeAudioTime(a.st), this.play();
                        },
                    },
                    {
                        key: "onEnd",
                        value: function () {
                            if ((console.log("onEndWithoutCheck"), this.currentavIndex < this.avSwitchTimes.length - 1)) {
                                var a = this.avSwitchTimes[this.currentavIndex + 1];
                                return void this.seekTo(a.time);
                            }
                            if ((console.log("onEnd"), this.state != ENDED)) {
                                if (this.userAgent.browser.IS_IOS && this.audio.currentTime < 1 && !this.audio.ended) return;
                                this.sendEvent(EVENTS.END),
                                    this.changeState(ENDED),
                                    (this.lastEndRunTime = parseInt(this.totalRunTime)),
                                    this.controller.timeUpdate(this.duration, this.duration),
                                    (this.lastRun = 0),
                                    (this.switchAudioState = AUDIO_PAUSE_STATE),
                                    (this.changingAudioState = !1),
                                    this.audioPause();
                            }
                        },
                    },
                    {
                        key: "checkForFadeOut",
                        value: function () {
                            var a = this;
                            this.audio &&
                                this.audio.duration > 0 &&
                                this.audio.duration + this.prefix_time_before_current_audio_video - this.audio.currentTime < 0.4 &&
                                this.audio.duration + this.prefix_time_before_current_audio_video - this.audio.currentTime > 0 &&
                                !this.avElement.is(":animated") &&
                                (this.avElement.fadeOut(400, function () {}),
                                this.avElement.animate({ volume: 0 }, 400, function () {
                                    a.audio.volume = a.controller.currentVolume;
                                }));
                        },
                    },
                    {
                        key: "drawFrames",
                        value: function () {
                            var a = this,
                                b = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                            if (!b || !this.currentRequestAnimationFrameId) {
                                if (((this.currentRequestAnimationFrameId = void 0), this.state != PLAYING || !this.canPlay() || this.imageLoading)) return this.canPlay() || (this.audioPause(), this.setLoading()), void (this.lastRun = 0);
                                if (this.time >= this.duration) return void this.onEnd();
                                if ((this.audio.paused && !this.audio.ended && this.audioPlay(), 0 == this.lastRun || this.audioLoading))
                                    return (
                                        (this.lastRun = new Date().getTime()),
                                        (this.lastPlayTime = this.prefix_time_before_current_audio_video + this.audio.currentTime),
                                        (this.lastSecond = parseInt(this.lastPlayTime) - 1),
                                        void (this.currentRequestAnimationFrameId = requestAnimationFrame(function () {
                                            return a.drawFrames(!1);
                                        }))
                                    );
                                var c = this.audio.playbackRate ? this.audio.playbackRate : 1,
                                    d = new Date().getTime(),
                                    e = ((d - this.lastRun) / 1e3) * c;
                                this.lastRun = d;
                                var f = this.prefix_time_before_current_audio_video + this.audio.currentTime,
                                    g = f - this.time;
                                if (((this.totalRunTime += g < 0 ? 0 : g), f - this.time > 5)) return void this.seekTo(this.prefix_time_before_current_audio_video + this.audio.currentTime);
                                if (
                                    (this.debug && this.time != f && this.fpsTimer.tick(),
                                    (this.time = f),
                                    0 != g &&
                                        (this.generateFrames(this.time),
                                        this.version > 1
                                            ? (requestAnimationFrame(function () {
                                                  return a.imageManager.render(a.time);
                                              }),
                                              requestAnimationFrame(function () {
                                                  return a.canvasDrawing.render(a.time);
                                              }))
                                            : (this.imageManager.render(this.time), this.canvasDrawing.render(this.time))),
                                    this.lastPlayTime >= this.time)
                                ) {
                                    if (((this.lastPlayTime += e), this.lastPlayTime - this.time > c)) {
                                        if (
                                            (console.log("audio paused"),
                                            console.log("time:" + this.audio.currentTime + "duration:" + this.audio.duration + "last:" + this.lastPlayTime),
                                            this.isAndroidApp() &&
                                                0 != this.audio.duration &&
                                                1 != this.audio.duration &&
                                                0 == this.audio.currentTime &&
                                                (this.lastPlayTime - this.prefix_time_before_current_audio_video - this.audio.duration >= 0 ||
                                                    Math.abs(this.lastPlayTime - this.prefix_time_before_current_audio_video - this.audio.duration) < 2))
                                        )
                                            return (this.time = this.lastPlayTime), void this.onEnd();
                                        this.setAudioLoading(), this.audioTimeUpdateFixer();
                                    }
                                } else this.lastPlayTime = this.time;
                                var h = parseInt(this.time);
                                if (h != this.lastSecond) {
                                    void 0 != this.watch_array && h > 0 && h <= this.watch_array.length && (0 == this.watch_array[h - 1] && (this.total_unique_sum += 1), (this.watch_array[h - 1] += 1)), this.onProgressAudio();
                                    parseInt(this.totalRunTime);
                                    this.state !== ENDED && (this.lastEndRunTime = parseInt(this.totalRunTime)), this.debug && $(".fps").html(this.fpsTimer.fps()), this.controller.timeUpdate(this.time, this.duration);
                                }
                                (this.lastSecond = h),
                                    this.checkForFadeOut(),
                                    (this.currentRequestAnimationFrameId = requestAnimationFrame(function () {
                                        return a.drawFrames(!1);
                                    }));
                            }
                        },
                    },
                    {
                        key: "getCurrentAudioBuffer",
                        value: function () {
                            if (this.audio)
                                for (var a = this._getAudioBuffer(), b = a.length, c = 0; b--; ) {
                                    if (this.prefix_time_before_current_audio_video + a.start(c) <= this.time && this.prefix_time_before_current_audio_video + a.end(c) > this.time)
                                        return [this.prefix_time_before_current_audio_video + a.start(c), this.prefix_time_before_current_audio_video + a.end(c)];
                                    c++;
                                }
                            return [0, 0];
                        },
                    },
                    {
                        key: "fixIfAudioTimeUpdateNotWorking",
                        value: function () {
                            this.onAudioTimeUpdate();
                        },
                    },
                    {
                        key: "setAudioLoading",
                        value: function () {
                            var a = this;
                            if ((console.log("time:" + this.audio.currentTime + "duration:" + this.audio.duration + "ended:" + this.audio.ended), !this.audioLoading)) {
                                if (((this.audioLoading = !0), console.log("setting audio loading"), !this.audio.paused && this.userAgent.browser.IS_ANDROID && "Chrome" == this.userAgent.browser.BROWSER_NAME)) {
                                    var b = this.getCurrentAudioBuffer();
                                    b[1] > this.time + 25 &&
                                        new Date().getTime() - this.lastAudioFixTry > 2500 &&
                                        ((this.lastAudioFixTry = new Date().getTime()), console.error("audio loading when buffer is greater than 25s, trying to fix"), (this.audio.currentTime = this.audio.currentTime));
                                }
                                this.imageLoading || this.state != PLAYING || this.audioPlay(),
                                    setTimeout(function () {
                                        return a.setLoading();
                                    }, 150);
                            }
                        },
                    },
                    {
                        key: "unSetAudioLoading",
                        value: function () {
                            var a = this;
                            (this.audioCanPlay = !0),
                                this.audioLoading &&
                                    (console.log("unsetloading"),
                                    (this.audioLoading = !1),
                                    this.state == PLAYING && this.play(),
                                    setTimeout(function () {
                                        return a.unSetLoading();
                                    }, 50));
                        },
                    },
                    {
                        key: "setImageLoading",
                        value: function () {
                            console.log("set image loading"), (this.imageLoading = !0), this.audioPause(), this.setLoading();
                        },
                    },
                    {
                        key: "unsetImageLoading",
                        value: function () {
                            console.log("unset image loading"), this.imageLoading && (console.log("unsetImageLoading"), (this.imageLoading = !1), this.state == PLAYING && this.play(), this.unSetLoading());
                        },
                    },
                    {
                        key: "setLoadingSlide",
                        value: function () {
                            (this.loadingDivVisible = !0), $(".player_initial_loading").show(), $(".progress").addClass("progress-loading");
                        },
                    },
                    {
                        key: "isSlideMode",
                        value: function () {
                            return this.playerMode === PLAYER_MODE.SLIDE;
                        },
                    },
                    {
                        key: "setLoading",
                        value: function () {
                            this.playerMode === PLAYER_MODE.SLIDE && this.setLoadingSlide(),
                                this.loadingDivVisible ||
                                    (this.userAgent.browser.IS_MOBILE && !this.clickedByUser) ||
                                    !this.isLoading() ||
                                    this.state == PAUSED ||
                                    this.state == ENDED ||
                                    (this.sendEvent(EVENTS.LOADING),
                                    this.firstTimePlayed
                                        ? ($(".player_initial_loading").hide(), this.controller.changePlayerControllerVisibility(!0), $(".progress").addClass("progress-loading"))
                                        : ($(".player_initial_loading").show(), $(".progress").addClass("progress-loading")),
                                    (this.loadingDivVisible = !0));
                        },
                    },
                    {
                        key: "unSetLoading",
                        value: function () {
                            var a = this;
                            this.playerMode === PLAYER_MODE.SLIDE && this.unSetLoadingSlide(),
                                this.loadingDivVisible &&
                                    (this.state == PAUSED || (!this.isLoading() && this.firstTimePlayed)) &&
                                    ($(".player_initial_loading").hide(),
                                    $(".progress").removeClass("progress-loading"),
                                    setTimeout(function () {
                                        a.controller.changePlayerControllerVisibility(!1);
                                    }, 4e3),
                                    (this.loadingDivVisible = !1),
                                    this.sendEvent(EVENTS.LOADED));
                        },
                    },
                    {
                        key: "unSetLoadingSlide",
                        value: function () {
                            this.loadingDivVisible && ($(".player_initial_loading").hide(), $(".progress").removeClass("progress-loading"), (this.loadingDivVisible = !1), this.seekTo(this.time + 0.2));
                        },
                    },
                    {
                        key: "isLoading",
                        value: function () {
                            return this.audioLoading || this.imageLoading || !this.audioCanPlay || (!this.canPlay() && this.autoPlay);
                        },
                    },
                    {
                        key: "resetSeek",
                        value: function () {
                            return this.controller.resetSeek();
                        },
                    },
                    {
                        key: "checkSeek",
                        value: function () {
                            var a = this.controller.getAndRemoveSeekTime();
                            return !!a && (this.changeState(PLAYING), this.seekTo(a), !0);
                        },
                    },
                    {
                        key: "onChangeImageComplete",
                        value: function (a, b) {
                            a < 0
                                ? ((this.firstTimePlayed = !0),
                                  this.unSetLoading(),
                                  this.sendEvent(EVENTS.PLAY),
                                  this.sendEvent(EVENTS.LOADING_TIME, { VIDEO_LOADING_TIME: parseInt((new Date().getTime() - this.initializedTime) / 1e3) }),
                                  $(".slow_net_text").hide())
                                : this.canvasDrawing.clearPath();
                        },
                    },
                    {
                        key: "canAutoPlay",
                        value: function () {
                            var a = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                            return this.state != PAUSED && (a || (this.autoPlay && (this.has_audio_play_permission() || this.clickedByUser)));
                        },
                    },
                    {
                        key: "get_first_index",
                        value: function () {
                            return !this.hasIntroVideo() || (this.canPlayVideo() && !this.shouldSeekIntro()) ? this.currentavIndex : this.get_next_audio_index();
                        },
                    },
                    {
                        key: "has_audio_play_permission",
                        value: function () {
                            return !this.userAgent.browser.IS_MOBILE;
                        },
                    },
                    {
                        key: "play",
                        value: function () {
                            var a = this,
                                b = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                            if ((console.log("play called"), this.state != ERROR && this.meta && (this.state != ENDED || b))) {
                                this.autoPlay = this.autoPlay || b;
                                var c = this.state;
                                return (
                                    !b || this.has_audio_play_permission() || this.clickedByUser || ((this.initializedTime = new Date().getTime()), this.changeState(PLAYING), this.switchAv(this.get_first_index()), this.audioPlay(!0)),
                                    !(this.state == NOT_STARTED && !this.canAutoPlay(b)) &&
                                        ((this.clickedByUser = this.clickedByUser || b),
                                        c == PAUSED && this.sendEvent(EVENTS.PLAY),
                                        setTimeout(function () {
                                            return a.audioTimeUpdateFixer();
                                        }, 4e3),
                                        this.changeState(PLAYING),
                                        this.setLoading(),
                                        !!this.checkSeek() ||
                                            (c == NOT_STARTED || c == ENDED
                                                ? ((this.audioLoading = !0), this.seekTo(0), !0)
                                                : (this.imageLoading && this.audioCanPlay && !this.audio.paused && this.audioPause(),
                                                  (c != PLAYING && c != PAUSED) || this.imageLoading || !this.canPlay() || this.drawFrames(),
                                                  this.canPlay() || (this.audioPause(), this.setLoading()),
                                                  !0)))
                                );
                            }
                        },
                    },
                    {
                        key: "pause",
                        value: function () {
                            this.playerMode !== PLAYER_MODE.SLIDE &&
                                (console.log("paused called"), this.state != PAUSED && (this.changeState(PAUSED), this.unSetLoading(), this.sendEvent(EVENTS.PAUSE)), this.audio && !this.audio.paused && this.audioPause());
                        },
                    },
                    {
                        key: "playOrPause",
                        value: function () {
                            var a = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                            this.playerMode !== PLAYER_MODE.SLIDE && (this.state == PLAYING ? this.pause() : this.play(a));
                        },
                    },
                    {
                        key: "toSlideMode",
                        value: function () {
                            if (!this.canPlay() || this.playerMode == PLAYER_MODE.SLIDE) return !1;
                            this.hideVideo(), this.pause(), (this.playerMode = PLAYER_MODE.SLIDE);
                            var a = this.imageManager.switchImageTime[this.imageManager.getCurrentSlideModeIndex()].time;
                            this.seekTo(a);
                            var b = this.imageManager.switchImageTime;
                            return $("#total-slides").html(b.length), this.sendEvent(EVENTS.SLIDE_MODE_ENTER), this.controller.setSlideMode(), this.canvasDrawing.erase(), !0;
                        },
                    },
                    {
                        key: "toPlayerMode",
                        value: function () {
                            return (
                                this.playerMode != PLAYER_MODE.PLAYER &&
                                ((this.playerMode = PLAYER_MODE.PLAYER), (this.imageManager.currentSlideModeIndex = -1), this.seekTo(this.time), this.sendEvent(EVENTS.SLIDE_MODE_EXIT), void this.controller.setPlayerMode())
                            );
                        },
                    },
                    {
                        key: "getFirstTimeForImage",
                        value: function (a) {
                            for (var b = void 0, c = this.imageManager.switchImageTime, d = 0; d < c.length; d++) if (((b = c[d]), b.index === a)) return b.time;
                        },
                    },
                    {
                        key: "toNextSlide",
                        value: function () {
                            if (this.playerMode !== PLAYER_MODE.PLAYER && this.canPlay) {
                                var a = this.getFirstTimeForImage(this.imageManager.get_next_index());
                                this.seekTo(a), this.sendEvent(EVENTS.SLIDE_MODE_CHANGED);
                            }
                        },
                    },
                    {
                        key: "toPreviousSlide",
                        value: function () {
                            if (this.playerMode !== PLAYER_MODE.PLAYER && this.canPlay) {
                                var a = this.getFirstTimeForImage(this.imageManager.get_prev_index());
                                this.seekTo(a), this.sendEvent(EVENTS.SLIDE_MODE_CHANGED);
                            }
                        },
                    },
                    {
                        key: "getThumbnailAt",
                        value: function (a, b) {
                            var c = "",
                                d = this.imageManager.getImageAt(a);
                            if (d == NO_INDEX) {
                                var e = this.getAvPreFixIndex(a),
                                    f = this.avSwitchTimes[e];
                                "video" == f.type && (c = this.getVideoThumbnailUrl(f.index));
                            } else c = this.imageManager.imagePathsArray[this.imageManager.switchImageTime[this.imageManager.findCurrentVisibleImageIndex(d)].index];
                            var g = "jpg";
                            return this.imageManager.canUseWebp && (g = "webp"), (c = addParameter(c, "w", this.imageManager.getDownloadImageWidthUtil(b))), (c = addParameter(c, "q", 10)), (c = addParameter(c, "fm", g));
                        },
                    },
                    {
                        key: "toSlide",
                        value: function (a) {
                            if (this.playerMode !== PLAYER_MODE.PLAYER) {
                                var b = this.getFirstTimeForImage(parseInt(a) - 1);
                                this.seekTo(b);
                            }
                        },
                    },
                    {
                        key: "seekToSlide",
                        value: function (a) {
                            if (!isNaN(a) && (console.log("seek slide:" + a), this.canPlay())) {
                                if ((a < 0 && (a = 0), a >= this.duration)) return (this.time = this.duration), void this.onEnd();
                                var b = this.currentavIndex;
                                if ("video" == this.avSwitchTimes[b].type) {
                                    for (; this.avSwitchTimes[b] && "audio" != this.avSwitchTimes[b].type; ) b++;
                                    (a = this.avSwitchTimes[b].time), (this.currentavIndex = b), (a = this.imageManager.getTimeForPositiveIndexAfter(a)), (this.time = a);
                                } else this.time = a;
                                this.imageManager.seekTo(a, !0, !1), (this.index = 0);
                                var c = this.imageManager.getSwitchImageTimeForLastImage(a);
                                this.index = this.events.binarySearch(c, function (a, b) {
                                    return parseFloat(a.t) - b;
                                });
                                var d = this.imageManager.getCurrentSlideModeIndex();
                                $("#current-slide").val(parseInt(d) + 1), this.canvasDrawing.clearPath();
                                var e = this.duration;
                                if (this.imageManager.switchImageTime.length > d + 1)
                                    for (var f = this.imageManager.switchImageTime[d + 1].index, g = 0; g < this.imageManager.switchImageTime.length; g++)
                                        f == this.imageManager.switchImageTime[g].index && e != NO_INDEX && (e = this.imageManager.switchImageTime[g].time);
                                console.log(e + "nextTime"), this.imageManager.updateImageQueue(c, e + 1), this.canvasDrawing.erase();
                            }
                        },
                    },
                    {
                        key: "sendWatchEvent",
                        value: function () {
                            if (this.playerMode != PLAYER_MODE.SLIDE && this.state != PAUSED && this.state != ENDED) {
                                var a = parseInt(this.time);
                                a - this.lastSecondWatchEventSend >= 1 && ((this.lastSecondWatchEventSend = a), this.sendEvent(EVENTS.WATCHED));
                            }
                        },
                    },
                    {
                        key: "seekTo",
                        value: function (a) {
                            var b = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                            if (this.playerMode === PLAYER_MODE.SLIDE) return this.seekToSlide(a);
                            if (!isNaN(a) && isFinite(a)) {
                                if ((console.log("seek:" + a), this.state == NOT_STARTED || !this.canPlay() || !this.audioCanPlay)) return void (this.meta && (this.controller.setSeekTime(a), console.log("seek time set:" + a)));
                                if ((a < 0 && (a = 0), a >= this.duration)) return (this.time = this.duration), (this.lastSecondWatchEventSend = this.duration), this.changeAudioTime(this.duration), void this.onEnd();
                                this.state == ENDED && this.changeState(PLAYING);
                                var c = this.getAvPreFixIndex(a);
                                if (this.currentavIndex != c) {
                                    if (!this.switchAv(c)) return;
                                    (this.currentavIndex = c), (this.lastTimeAudioTimeChecked = -1);
                                }
                                Math.abs(this.prefix_time_before_current_audio_video + this.audio.currentTime - a) > 0.5
                                    ? (this.changeAudioTime(a - this.prefix_time_before_current_audio_video), (this.lastTimeAudioTimeChecked = -1))
                                    : (a = this.prefix_time_before_current_audio_video + this.audio.currentTime),
                                    a != this.prefix_time_before_current_audio_video && 0 == this.audio.currentTime && (this.controller.setSeekTime(a), (this.audioLoading = !0)),
                                    (this.time = a),
                                    (this.lastSecondWatchEventSend = a),
                                    b && this.sendEvent(EVENTS.SEEK),
                                    (this.lastRun = 0),
                                    (this.imageLoading = !1),
                                    this.controller.seekTo(a),
                                    this.imageManager.seekTo(a),
                                    this.canvasDrawing.seekTo(a),
                                    (this.index = this.events.binarySearch(a, function (a, b) {
                                        return parseFloat(a.t) - b;
                                    })),
                                    this.state != PLAYING || this.imageLoading ? this.audioPause() : this.audioPlay(),
                                    this.setLoading(),
                                    this.state == PLAYING && this.drawFrames(),
                                    this.onBufferChange();
                            }
                        },
                    },
                    {
                        key: "getFullStatus",
                        value: function () {
                            var a = 0;
                            this.duration > 0 && (a = Math.round((100 * this.total_unique_sum) / this.duration));
                            var b = {
                                UUID: this.uuid,
                                STATE: this.state,
                                CURRENT_TIME: parseInt(this.time),
                                CURRENT_IMAGE: this.imageManager.currentImageIndex,
                                TOTAL_RUN_TIME: parseInt(this.totalRunTime),
                                TOTAL_WATCH_TIME_END: parseInt(this.totalRunTime - this.lastEndRunTime),
                                VOLUME: parseInt(100 * this.controller.currentVolume),
                                PLAYER_ID: this.playerId,
                                IS_MOBILE_DEVICE: this.userAgent.browser.IS_MOBILE ? 1 : 0,
                                BROWSER_ID: this.browserId,
                                PLAY_BACK_RATE: this.playbackRate,
                                PLAYER_VERSION: this.player_version,
                                PERCENT_WATCHED: a,
                            };
                            return (!this.isAndroidApp() || this.getAppVersion() >= 34) && (b.WATCH_DURATION_ARRAY = this.watch_array), b;
                        },
                    },
                    {
                        key: "sendEvent",
                        value: function (a, b) {
                            var c = this.isAndroidApp(),
                                d = this.isIosApp(),
                                e = parent && parent != window;
                            if (c || d || e) {
                                var f = this.getFullStatus();
                                b &&
                                    Object.keys(b).forEach(function (a) {
                                        f[a] = b[a];
                                    });
                                try {
                                    c
                                        ? AndroidApp.postMessage(a, JSON.stringify(f))
                                        : e
                                        ? parent.postMessage({ event: a, status: f, uuid: this.uuid }, "*")
                                        : d
                                        ? webkit.messageHandlers.player.postMessage(JSON.stringify({ event: a, data: f }))
                                        : parent.postMessage({ event: a, status: f, uuid: this.uuid }, "*");
                                } catch (g) {}
                            }
                        },
                    },
                ],
                [
                    {
                        key: "generateUUID",
                        value: function () {
                            var a = new Date().getTime();
                            return (
                                window.performance && "function" == typeof window.performance.now && (a += performance.now()),
                                "xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx".replace(/[xy]/g, function (b) {
                                    var c = (a + 16 * Math.random()) % 16 | 0;
                                    return (a = Math.floor(a / 16)), ("x" == b ? c : (3 & c) | 8).toString(16);
                                })
                            );
                        },
                    },
                ]
            ),
            a
        );
    })(),
    Controller = (function () {
        function a(b) {
            _classCallCheck(this, a),
                (this.player = b),
                (this.x = 0),
                (this.y = 0),
                (this.updProgWidth = 0),
                (this.storedVolume = 1),
                (this.currentVolume = 1),
                (this.$volhover = !1),
                (this.volumeElement = $(".volume")),
                (this.volumeIconElement = $(".volume-icon")),
                (this.volumeBarElement = $(".volume-bar")),
                (this.volumeHolderElement = $(".volume-holder")),
                (this.playerElement = $(".player-wrapper")),
                (this.progressElement = $(".progress")),
                (this.progressBarWrapperElement = $(".progress-bar-wrapper")),
                (this.playerControlVisible = !0),
                (this.lastBodyTouchEventTime = new Date().getTime()),
                (this.progWidth = 0),
                (this.currentSeekTime = 0),
                (this.timeType = !1),
                (this.seekingTimer = void 0),
                (this.volumeSeekingTimer = void 0),
                (this.previewElement = $(".preview")),
                (this.currentPreviewImage = void 0),
                (this.svgPath = new SvgPath()),
                (this.svgDiv = $(".player-bezel")),
                (this.fullscreen = this._fullscreen()),
                (this.cTime = $(".ctime")),
                (this.tTime = $(".ttime")),
                (this.progressBar = $(".progress-bar")),
                (this.seek = $("#seek")),
                (this.forceHideControls = !1),
                (this.neverShowSlideBtn = !1),
                (this.shouldHideSlideMode = !1);
        }
        return (
            _createClass(
                a,
                [
                    {
                        key: "hideSlideMode",
                        value: function () {
                            this.shouldHideSlideMode = !0;
                        },
                    },
                    {
                        key: "setForceHideControls",
                        value: function (a) {
                            if (this.player.meta && this.player.events)
                                if (a) {
                                    this.changePlayerControllerVisibilityInternal(!a), (this.forceHideControls = a);
                                    try {
                                        (document.documentElement.style.overflow = "hidden"), (document.body.scroll = "no");
                                    } catch (b) {}
                                } else {
                                    (this.forceHideControls = a), this.changePlayerControllerVisibilityInternal(!a);
                                    try {
                                        document.documentElement.style.overflow = "auto";
                                    } catch (b) {}
                                }
                        },
                    },
                    {
                        key: "init",
                        value: function () {
                            if ((this.setJqueryEventBinding(), this.player.userAgent.browser.IS_MOBILE)) {
                                (this.currentVolume = 1), (this.storedVolume = 1);
                                var a = $(".settings").width();
                                isFlex() || ($(".player-wrapper").css("padding-left", a / 4), $(".player-wrapper").css("padding-right", a / 4), $(".slider-on-parent").width("8%"), $(".slider-on").width("50%"));
                            } else if (PlayerStorage) {
                                var b = PlayerStorage.getItem("volume"),
                                    c = PlayerStorage.getItem("speed");
                                c &&
                                    !isNaN(parseFloat(c)) &&
                                    (this.player.setPlayBackSpeed(parseFloat(c)),
                                    document.querySelector(".player-menuitem[role=menuitemradio][aria-checked=true]").removeAttribute("aria-checked"),
                                    document.querySelector(".player-menuitem-label[data='" + c + "']").parentNode.setAttribute("aria-checked", "true")),
                                    b && !isNaN(parseFloat(b)) && ((this.currentVolume = parseFloat(b)), (this.storedVolume = this.currentVolume));
                            }
                            this.onVolumeUpdate(this.currentVolume, !1), this.player.userAgent.ua.iOS && this.volumeElement.hide(), this.checkForSlideMode();
                        },
                    },
                    {
                        key: "checkForSpeedModeinAndroidApp",
                        value: function () {
                            this.player.isAndroidApp() && (this.player.width < 480 ? $(".settings").hide() : $(".settings").show());
                        },
                    },
                    {
                        key: "checkForSlideMode",
                        value: function () {
                            this.player.width <= 480 || this.shouldHideSlideMode ? this.hideSlideModeButton() : this.showSlideModeButton();
                        },
                    },
                    {
                        key: "getAndRemoveSeekTime",
                        value: function () {
                            var a = this.currentSeekTime;
                            return (this.currentSeekTime = void 0), a;
                        },
                    },
                    {
                        key: "setSeekTime",
                        value: function (a) {
                            (this.currentSeekTime = a), this.timeUpdate(a, this.player.duration);
                        },
                    },
                    {
                        key: "onWindowResize",
                        value: function () {
                            (this.progWidth = this.progressBarWrapperElement.width()),
                                this.player.duration && (this.changePlayerControllerVisibility(!0), (this.updProgWidth = (this.player.time / this.player.duration) * 100), this.updateProgressUi(this.updProgWidth)),
                                this.checkForSlideMode();
                        },
                    },
                    {
                        key: "onVolumeUpdate",
                        value: function (a) {
                            this.volanim(), $("#vol-seek").val(100 * a), this.volumeBarElement.css({ height: 100 * this.currentVolume + "%" }), (this.currentVolume = a), PlayerStorage && PlayerStorage.setItem("volume", a);
                        },
                    },
                    {
                        key: "volanim",
                        value: function () {
                            var a = parseInt(10 * this.currentVolume) + 1;
                            1 == this.$volhover ? this.volumeIconElement.removeClass().addClass("volume-icon volume-icon-hover v-change-" + a) : this.volumeIconElement.removeClass().addClass("volume-icon v-change-" + a);
                        },
                    },
                    {
                        key: "updateVolumeBy",
                        value: function () {
                            var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                                b = this.currentVolume;
                            return 0 != a && ((this.currentVolume += a), this.currentVolume > 1 && (this.currentVolume = 1), this.currentVolume < 0 && (this.currentVolume = 0), this.onVolumeChange()), this.currentVolume != b;
                        },
                    },
                    {
                        key: "onVolumeChange",
                        value: function () {
                            var a = this;
                            this.volumeSeekingTimer && clearTimeout(this.volumeSeekingTimer),
                                this.player.updateVolume(this.currentVolume),
                                (this.volumeSeekingTimer = setTimeout(function () {
                                    a.player.sendEvent(EVENTS.VOLUME_CHANGE);
                                }, 250)),
                                this.onVolumeUpdate(this.currentVolume);
                        },
                    },
                    {
                        key: "onVolumeHover",
                        value: function (a) {
                            this.$volhover = a;
                        },
                    },
                    {
                        key: "onVolumeIconDown",
                        value: function () {
                            0 != this.currentVolume
                                ? ((this.storedVolume = this.currentVolume), (this.currentVolume = 0), this.volumeHolderElement.stop(!0, !1).fadeOut(200))
                                : (this.player.userAgent.browser.IS_MOBILE || this.volumeHolderElement.stop(!0, !1).fadeIn(200), (this.currentVolume = this.storedVolume), 0 == this.currentVolume && (this.currentVolume = 0.3)),
                                this.onVolumeChange();
                        },
                    },
                    { key: "onBodyMouseUpEvent", value: function () {} },
                    {
                        key: "resetSeek",
                        value: function () {
                            clearTimeout(this.seekingTimer), this.getAndRemoveSeekTime();
                        },
                    },
                    {
                        key: "seekPlayer",
                        value: function (a) {
                            var b = this,
                                c = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 250;
                            a < 0 && (a = 0),
                                a > this.player.duration && (a = this.player.duration),
                                this.seekingTimer && (clearTimeout(this.seekingTimer), (this.seekingTimer = void 0)),
                                this.timeUpdate(a, this.player.duration),
                                (this.seekingTimer = setTimeout(function () {
                                    (b.seekingTimer = void 0), b.player.seekTo(a, !0);
                                }, c));
                        },
                    },
                    {
                        key: "setBreakPoints",
                        value: function (a) {
                            $("[class^=break-points]").remove();
                            for (var b = a.length, c = 0, d = 1; d < b - 1; d++)
                                if (!(a[d].time - c <= 2)) {
                                    c = a[d].time;
                                    var e = (a[d].time / this.player.duration) * 100;
                                    e > 0 &&
                                        $('<div class="break-points"></div>')
                                            .css({ left: e - 0.3 + "%" })
                                            .appendTo(this.progressElement);
                                }
                        },
                    },
                    {
                        key: "onSeek",
                        value: function (a) {
                            var b = this.seek.val();
                            return this.player.duration
                                ? void (isNaN(b) || (b < 0 ? this.seekPlayer(0) : b > 100 ? this.seekPlayer(this.player.duration) : this.seekPlayer((b * this.player.duration) / 100), this.updateProgressUi(b, !1)))
                                : void (0 != b && this.seek.val(0));
                        },
                    },
                    {
                        key: "onVolumeSeek",
                        value: function (a) {
                            var b = $("#vol-seek").val() / 100;
                            Math.abs(this.currentVolume - b) > 0.001 && ((this.currentVolume = b), (this.storedVolume = this.currentVolume), this.onVolumeChange());
                        },
                    },
                    {
                        key: "onBodyMouseMoveEvent",
                        value: function (a) {
                            var b = this;
                            (this.lastBodyTouchEventTime = new Date().getTime()),
                                !this.playerControlVisible &&
                                    this.player.isStarted() &&
                                    setTimeout(function () {
                                        return b.changePlayerControllerVisibility(!0);
                                    }, 100),
                                this.player.userAgent.browser.IS_MOBILE || (0 == this.$volhover ? this.volumeHolderElement.stop(!0, !1).fadeOut(100) : this.volumeHolderElement.fadeIn(100));
                        },
                    },
                    {
                        key: "seekTo",
                        value: function (a) {
                            (this.lastBodyTouchEventTime = new Date().getTime()), this.timeUpdate(a, this.player.duration);
                        },
                    },
                    {
                        key: "timeUpdate",
                        value: function (a, b) {
                            var c = 4e3;
                            this.player.userAgent.browser.IS_MOBILE && (c = 2e3), this.playerControlVisible && Date.now() - this.lastBodyTouchEventTime > c && this.changePlayerControllerVisibility(!1);
                            var d = b;
                            b = Math.round(b);
                            var e = a;
                            if ((a > b && (a = b), b && !this.seekingTimer)) {
                                this.timeType && (a = b - a);
                                var f = 0,
                                    g = Math.floor(a / 60),
                                    h = parseInt(b / 60),
                                    i = Math.round(b - 60 * h);
                                a && ((f = Math.round(a) - 60 * g), f > 59 && ((f = Math.round(a) - 60 * g), 60 == f && ((g = Math.round(a / 60)), (f = 0)))),
                                    (this.updProgWidth = (e / d) * 100),
                                    f < 10 && (f = "0" + f),
                                    i < 10 && (i = "0" + i),
                                    this.updateProgressUi(this.updProgWidth),
                                    this.timeType ? this.cTime.html("-" + g + ":" + f) : this.cTime.html(" " + g + ":" + f),
                                    this.tTime.html(h + ":" + i);
                            }
                        },
                    },
                    {
                        key: "updateProgressUi",
                        value: function (a) {
                            var b = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                            this.progressBar.width(a + "%"), b && this.seek.val(a);
                        },
                    },
                    {
                        key: "onProgressMouseDown",
                        value: function (a) {
                            (!this.player.userAgent.browser.IS_MOBILE && a.target && a.target.className.indexOf("time") >= 0) ||
                                ((this.x = a.pageX - this.progressElement.offset().left), this.x && this.player.duration && this.seekPlayer((this.x / this.progWidth) * this.player.duration));
                        },
                    },
                    {
                        key: "onKeyDown",
                        value: function (a) {
                            var b = null;
                            switch ((window.event ? (b = window.event.ctrlKey) : a && document.getElementById ? (b = Event.META_MASK || Event.CTRL_MASK) : a && document.layers && (b = a.metaKey || a.ctrlKey), a.keyCode)) {
                                case 32:
                                    this.player.playOrPause(!0), a.preventDefault();
                                    break;
                                case 37:
                                    if (this.player.playerMode === PLAYER_MODE.SLIDE) return void this.player.toPreviousSlide();
                                    b ? this.seekPlayer(this.player.time - 10, 1) : this.seekPlayer(this.player.time - 5, 1), this.player.state != ENDED && this.animateCenterSvg("backward"), a.preventDefault();
                                    break;
                                case 39:
                                    if (this.player.playerMode === PLAYER_MODE.SLIDE) return void this.player.toNextSlide();
                                    b ? this.seekPlayer(this.player.time + 10, 1) : this.seekPlayer(this.player.time + 5, 1), this.player.state != ENDED && this.animateCenterSvg("forward"), a.preventDefault();
                                    break;
                                case 38:
                                    if (this.player.playerMode === PLAYER_MODE.SLIDE) return;
                                    this.updateVolumeBy(0.05) && this.animateCenterSvg("volumeup"), a.preventDefault();
                                    break;
                                case 40:
                                    if (this.player.playerMode === PLAYER_MODE.SLIDE) return;
                                    this.updateVolumeBy(-0.05) && this.animateCenterSvg("volumedown"), a.preventDefault();
                                    break;
                                case 70:
                                    this.fullScreenChange();
                                    break;
                                case 83:
                                case 115:
                                    this.changePlayerMode();
                                    break;
                                case 68:
                                    this.player.toggleDebug();
                            }
                        },
                    },
                    {
                        key: "changePlayerControllerVisibilityInternal",
                        value: function (a) {
                            this.forceHideControls ||
                                (this.player.isAndroidApp() && AndroidApp.controlsVisibilityChange && AndroidApp.controlsVisibilityChange(a),
                                a
                                    ? ((this.playerControlVisible = a), this.playerElement.stop(!0, !1).animate({ opacity: "1" }, 0.5))
                                    : ((this.playerControlVisible = a), $("#setting-menu").hide(), this.playerElement.stop(!0, !1).animate({ opacity: "0" }, 0.5)));
                        },
                    },
                    {
                        key: "changePlayerControllerVisibility",
                        value: function (a) {
                            a
                                ? (!this.player.meta && this.player.userAgent.browser.IS_MOBILE) || this.player.state == ERROR || this.changePlayerControllerVisibilityInternal(a)
                                : this.player.isLoading() || this.player.state != PLAYING || this.changePlayerControllerVisibilityInternal(a);
                        },
                    },
                    {
                        key: "fullScreenChange",
                        value: function () {
                            var a = this;
                            this.fullscreen.supportsFullScreen && !this.player.userAgent.browser.IS_IOS
                                ? this.fullscreen.isFullScreen()
                                    ? (this.player.sendEvent(EVENTS.EXIT_FULLSCREEN), this.fullscreen.cancelFullScreen(), this.player.userAgent.browser.IS_ANDROID && !this.player.isAndroidApp() && unlockOrientation())
                                    : (this.player.sendEvent(EVENTS.ENTER_FULLSCRREN), this.fullscreen.requestFullScreen(), this.player.userAgent.browser.IS_ANDROID && !this.player.isAndroidApp() && requestLandscape())
                                : this.player.sendEvent(EVENTS.FULLSCREEN_REQUEST),
                                setTimeout(function () {
                                    return a.player.resizeWindow();
                                }, 200);
                        },
                    },
                    {
                        key: "changePlayerMode",
                        value: function () {
                            this.player.playerMode === PLAYER_MODE.PLAYER ? $(".player .slider-off").click() : $(".player .slider-on").click();
                        },
                    },
                    {
                        key: "bufferLength",
                        value: function () {
                            var a = this.player.getBufferLength();
                            if (($("[class^=buffered]").remove(), a.length > 0))
                                for (var b = a.length; b--; ) {
                                    var c = a[b].end;
                                    c = c > this.player.duration ? this.player.duration : c;
                                    var d = a[b].start;
                                    if (this.player.time >= d && this.player.time < c) {
                                        var e = (d / this.player.duration) * 100,
                                            f = ((c - d) / this.player.duration) * 100;
                                        $('<div class="buffered"></div>')
                                            .css({ left: e + "%", width: f + "%" })
                                            .appendTo(this.progressElement);
                                    }
                                }
                        },
                    },
                    {
                        key: "showPreview",
                        value: function (b) {
                            if (this.player.canPlay()) {
                                this.changePlayerControllerVisibility(!0);
                                var c = this.player.duration,
                                    d = b.pageX - this.progressElement.offset().left - 8,
                                    e = (d / (this.progWidth - 16)) * this.player.duration,
                                    f = $("#preview-img"),
                                    g = this.previewElement.height(),
                                    h = this.previewElement.width();
                                this.previewElement.offset({ top: this.progressBarWrapperElement.offset().top - g - window.innerHeight / 140 - 25, left: b.pageX - h / 2 });
                                var i = this.player.getThumbnailAt(e, h);
                                (e = e < 0 ? 0 : e), (e = e > c ? c : e);
                                var j = a.getMinuteSecondFromTime(e);
                                if (($(".preview-ctime").html(j[0] + ":" + j[1]), this.currentPreviewImage != i)) {
                                    this.currentPreviewImage = i;
                                    var k = setTimeout(function () {
                                        f.fadeOut(0);
                                    }, 100);
                                    f.attr("src", i).load(function () {
                                        clearTimeout(k), f.fadeIn(0);
                                    });
                                }
                            }
                        },
                    },
                    {
                        key: "playOrPause",
                        value: function () {
                            var a = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                            this.player.playOrPause(a);
                        },
                    },
                    {
                        key: "setPlay",
                        value: function () {
                            $(".play-pause").addClass("pause").removeClass("play");
                            var a = $(".play-btn");
                            a.css("background-color", "#4a4a4a"), a.is(":visible") && this.removePlayButton(), isFlex() ? this.animateCenterSvg("play") : $(".player-bezel-icon").hide();
                        },
                    },
                    {
                        key: "addPlayButton",
                        value: function () {
                            $(".play-btn").show(), $(".play-btn-div").css("background", "rgba(0, 0, 0, 0.5)");
                        },
                    },
                    {
                        key: "removePlayButton",
                        value: function () {
                            $(".play-btn").hide(), $(".play-btn-div").css("background", "none");
                        },
                    },
                    {
                        key: "setPause",
                        value: function () {
                            $(".play-pause").addClass("play").removeClass("pause"), this.forceHideControls || !isFlex() ? ($(".play-btn").css("background-color", "transparent"), this.addPlayButton()) : this.animateCenterSvg("pause");
                        },
                    },
                    {
                        key: "setEnd",
                        value: function () {
                            this.addPlayButton(), $(".play-pause").addClass("play").removeClass("pause");
                        },
                    },
                    {
                        key: "animateCenterSvg",
                        value: function () {
                            var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "None";
                            $(".player-bezel-icon > svg > path").attr("d", this.svgPath.state[a]),
                                this.lastCssTimeout && (clearTimeout(this.lastCssTimeout), (this.lastCssTimeout = void 0)),
                                (this.lastCssTimeout = this.svgDiv.animateCss("zoomIn", a));
                        },
                    },
                    {
                        key: "hideFullScreenButton",
                        value: function () {
                            $(".fullscreen").hide();
                        },
                    },
                    {
                        key: "showFullScreenButton",
                        value: function () {
                            $(".fullscreen").show();
                        },
                    },
                    {
                        key: "hideSlideModeButton",
                        value: function () {
                            var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0;
                            void 0 != a && (this.neverShowSlideBtn = a), $(".player .slider-off").hide();
                        },
                    },
                    {
                        key: "showSlideModeButton",
                        value: function () {
                            this.neverShowSlideBtn || $(".player .slider-off").show();
                        },
                    },
                    {
                        key: "_fullscreen",
                        value: function () {
                            var a = {
                                    supportsFullScreen: !1,
                                    isFullScreen: function () {
                                        return !1;
                                    },
                                    requestFullScreen: function () {},
                                    cancelFullScreen: function () {},
                                    fullScreenEventName: "",
                                    element: null,
                                    prefix: "",
                                },
                                b = "webkit moz o ms khtml".split(" ");
                            if ("undefined" != typeof document.cancelFullScreen) a.supportsFullScreen = !0;
                            else
                                for (var c = 0, d = b.length; c < d; c++) {
                                    if (((a.prefix = b[c]), "undefined" != typeof document[a.prefix + "CancelFullScreen"])) {
                                        a.supportsFullScreen = !0;
                                        break;
                                    }
                                    if ("undefined" != typeof document.msExitFullscreen && document.msFullscreenEnabled) {
                                        (a.prefix = "ms"), (a.supportsFullScreen = !0);
                                        break;
                                    }
                                }
                            return (
                                a.supportsFullScreen &&
                                    ((a.fullScreenEventName = "ms" == a.prefix ? "MSFullscreenChange" : a.prefix + "fullscreenchange"),
                                    (a.isFullScreen = function (a) {
                                        switch (("undefined" == typeof a && (a = document.body), this.prefix)) {
                                            case "":
                                                return document.fullscreenElement == a;
                                            case "moz":
                                                return document.mozFullScreenElement == a;
                                            default:
                                                return document[this.prefix + "FullscreenElement"] == a;
                                        }
                                    }),
                                    (a.requestFullScreen = function (a) {
                                        "undefined" == typeof a && (a = document.body);
                                        try {
                                            if (AndroidApp && AndroidApp.requestFullScreen) return AndroidApp.requestFullScreen();
                                        } catch (b) {}
                                        return "" === this.prefix ? a.requestFullScreen() : a[this.prefix + ("ms" == this.prefix ? "RequestFullscreen" : "RequestFullScreen")]();
                                    }),
                                    (a.cancelFullScreen = function () {
                                        try {
                                            if (AndroidApp && AndroidApp.cancelFullScreen) return AndroidApp.cancelFullScreen();
                                        } catch (a) {}
                                        return "" === this.prefix ? document.cancelFullScreen() : document[this.prefix + ("ms" == this.prefix ? "ExitFullscreen" : "CancelFullScreen")]();
                                    }),
                                    (a.element = function () {
                                        return "" === this.prefix ? document.fullscreenElement : document[this.prefix + "FullscreenElement"];
                                    })),
                                a
                            );
                        },
                    },
                    {
                        key: "setSlideMode",
                        value: function () {
                            this.removePlayButton(),
                                $("#setting-menu").hide(),
                                $("#player-controller").toggle(),
                                $("#slide").toggle(),
                                $("#notify").html("Slide mode"),
                                $("#notify").addClass("elementToFadeInAndOut"),
                                setTimeout(function () {
                                    $("#notify").removeClass("elementToFadeInAndOut");
                                }, 1001);
                        },
                    },
                    {
                        key: "setPlayerMode",
                        value: function () {
                            $("#player-controller").toggle(),
                                $("#slide").toggle(),
                                $("#notify").html("Video mode"),
                                $("#notify").addClass("elementToFadeInAndOut"),
                                setTimeout(function () {
                                    $("#notify").removeClass("elementToFadeInAndOut");
                                }, 1001);
                        },
                    },
                    {
                        key: "hidePreview",
                        value: function () {
                            this.hidePreviewOnHover = !0;
                        },
                    },
                    {
                        key: "setJqueryEventBinding",
                        value: function () {
                            var a = this;
                            this.volumeElement.hover(
                                function () {
                                    return a.onVolumeHover(!0);
                                },
                                function () {
                                    return a.onVolumeHover(!1);
                                }
                            ),
                                this.player.userAgent.browser.IS_MOBILE
                                    ? this.volumeIconElement.bind("click", function () {
                                          a.onVolumeIconDown();
                                      })
                                    : this.volumeIconElement.bind("mousedown", function () {
                                          a.onVolumeIconDown();
                                      }),
                                $("body").keydown(function (b) {
                                    return a.onKeyDown(b);
                                }),
                                $(".fullscreen").click(function () {
                                    return a.fullScreenChange();
                                });
                            var b = $("body, html");
                            if (
                                (b.hover(
                                    function () {
                                        return setTimeout(function () {
                                            a.changePlayerControllerVisibility(!0);
                                        }, 100);
                                    },
                                    function () {
                                        return a.changePlayerControllerVisibility(!1);
                                    }
                                ),
                                b.bind("mouseup touchend", function () {
                                    return a.onBodyMouseUpEvent();
                                }),
                                b.on("mousemove touchmove", function (b) {
                                    return a.onBodyMouseMoveEvent(b);
                                }),
                                this.player.userAgent.browser.IS_IOS &&
                                    this.progressElement.on("mousedown touchstart", function (b) {
                                        return a.onProgressMouseDown(b);
                                    }),
                                $(".play-pause").click(function () {
                                    a.playOrPause(!0);
                                }),
                                $("#container").click(function (b) {
                                    if (a.player.isAndroidApp()) {
                                        if (a.playerControlVisible || a.forceHideControls)
                                            try {
                                                b.pageX > a.player.width / 3 && b.pageX < (2 * a.player.width) / 3 && a.playOrPause(!0);
                                            } catch (b) {}
                                    } else (a.player.userAgent.browser.IS_MOBILE && a.player.state == PLAYING) || a.playOrPause(!0);
                                }),
                                $(".player_error").click(function () {
                                    location.reload();
                                }),
                                $(".settings").click(function () {
                                    $("#setting-menu").toggle();
                                }),
                                $(".player-panel-header").click(function () {
                                    $("#setting-menu").toggle();
                                }),
                                $(".slide .back").click(function () {
                                    a.player.toPreviousSlide();
                                }),
                                $(".slide .forward").click(function () {
                                    a.player.toNextSlide();
                                }),
                                $(".slide .slider-on").click(function () {
                                    a.player.toPlayerMode();
                                }),
                                $("#current-slide").keydown(function (b) {
                                    13 === b.keyCode && (b.preventDefault(), b.stopPropagation(), a.player.toSlide($(b.target).val()));
                                }),
                                $(".player .slider-off").click(function () {
                                    a.player.toSlideMode();
                                }),
                                $(".player-menuitem").click(function (b) {
                                    var c = b.target.getAttribute("data"),
                                        d = parseFloat(c);
                                    $("#setting-menu").toggle(),
                                        d &&
                                            (document.querySelector(".player-menuitem[role=menuitemradio][aria-checked=true]").removeAttribute("aria-checked"),
                                            b.target.parentElement.setAttribute("aria-checked", "true"),
                                            a.player.setPlayBackSpeed(d),
                                            PlayerStorage && PlayerStorage.setItem("speed", c));
                                }),
                                $("#seek").on("input change", function (b) {
                                    a.onSeek(b);
                                }),
                                $("#vol-seek").on("input change", function (b) {
                                    a.onVolumeSeek(b);
                                }),
                                this.playerElement.hover(
                                    function (b) {
                                        a.progressElement.addClass("hover");
                                    },
                                    function (b) {
                                        a.progressElement.removeClass("hover");
                                    }
                                ),
                                !this.player.userAgent.browser.IS_MOBILE)
                            ) {
                                var c = $(".time");
                                c.click(function (b) {
                                    (a.timeType = ~a.timeType), a.timeUpdate(a.player.time, a.player.duration), b.stopPropagation();
                                }),
                                    this.progressBarWrapperElement.on("mousemove touchmove", function (b) {
                                        a.player.duration && (a.hidePreviewOnHover || a.showPreview(b));
                                    }),
                                    this.progressElement.hover(
                                        function () {
                                            a.player.state != ERROR && a.player.canPlay() && (a.hidePreviewOnHover || a.previewElement.show());
                                        },
                                        function () {
                                            a.hidePreviewOnHover || a.previewElement.hide();
                                        }
                                    ),
                                    c.hover(
                                        function (a) {
                                            a.stopPropagation();
                                        },
                                        function (a) {
                                            a.stopPropagation();
                                        }
                                    );
                            }
                            $("body").on("doubletap", function (b) {
                                b.pageX &&
                                    (b.pageX < a.player.width / 3
                                        ? a.player.isSlideMode()
                                            ? a.player.toPreviousSlide()
                                            : (a.player.state != PLAYING && a.player.state != PAUSED) || (a.seekPlayer(a.player.time - 5, 1), a.player.state != ENDED && a.animateCenterSvg("backward"))
                                        : b.pageX > (2 * a.player.width) / 3 &&
                                          (a.player.isSlideMode()
                                              ? a.player.toNextSlide()
                                              : (a.player.state != PLAYING && a.player.state != PAUSED) || (a.seekPlayer(a.player.time + 5, 1), a.player.state != ENDED && a.animateCenterSvg("forward"))));
                            });
                        },
                    },
                ],
                [
                    {
                        key: "isFloat",
                        value: function (a) {
                            return Number(a) === a && a % 1 !== 0;
                        },
                    },
                    {
                        key: "getMinuteSecondFromTime",
                        value: function (a) {
                            a = Math.round(a);
                            var b = Math.floor(a / 60),
                                c = Math.round(a) - 60 * b;
                            return c < 10 && (c = "0" + c), [b, c];
                        },
                    },
                ]
            ),
            a
        );
    })();
