var theme = "light";
const linkHelper = {
  rel_to_abs: function (e, t) {
    if (
      /^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(e)
    )
      return e;
    var r = new URL(t),
      a = r.href.match(/^(.+)\/?(?:#.+)?$/)[0] + "/";
    if ("//" == e.substring(0, 2)) return r.protocol + e;
    if ("/" == e.charAt(0)) return r.protocol + "//" + r.host + e;
    if ("./" == e.substring(0, 2)) e = "." + e;
    else {
      if (/^\s*$/.test(e)) return "";
      e = "../" + e;
    }
    e = a + e;
    for (; /\/\.\.\//.test((e = e.replace(/[^\/]+\/+\.\.\//g, ""))); );
    return (e = e
      .replace(/\.$/, "")
      .replace(/\/\./g, "")
      .replace(/"/g, "%22")
      .replace(/'/g, "%27")
      .replace(/</g, "%3C")
      .replace(/>/g, "%3E"));
  },
  replace_all_rel_by_abs: function (e, t) {
    var r = this.rel_to_abs,
      a = "[^-a-z0-9:._]",
      n = "(?:;|(?!\\d))",
      s = {
        " ": "(?:\\s|&nbsp;?|&#0*32(?:;|(?!\\d))|&#x0*20(?:;|(?!\\d)))",
        "(": "(?:\\(|&#0*40(?:;|(?!\\d))|&#x0*28(?:;|(?!\\d)))",
        ")": "(?:\\)|&#0*41(?:;|(?!\\d))|&#x0*29(?:;|(?!\\d)))",
        ".": "(?:\\.|&#0*46(?:;|(?!\\d))|&#x0*2e(?:;|(?!\\d)))",
      },
      i = {},
      c = s[" "] + "*",
      o = "(?:[^>\"']*(?:\"[^\"]*\"|'[^']*'))*?[^>]*";
    function ae(e) {
      var t = e.toLowerCase();
      if (s[e]) return s[e];
      for (var r = e.toUpperCase(), a = "", c = 0; c < e.length; c++) {
        var o = t.charAt(c);
        if (i[o]) a += i[o];
        else {
          var d = r.charAt(c),
            l = [o];
          l.push("&#0*" + o.charCodeAt(0) + n),
            l.push("&#x0*" + o.charCodeAt(0).toString(16) + n),
            o != d &&
              /* Note: RE ignorecase flag has already been activated */
              (l.push("&#0*" + d.charCodeAt(0) + n),
              l.push("&#x0*" + d.charCodeAt(0).toString(16) + n)),
            (l = "(?:" + l.join("|") + ")"),
            (a += i[o] = l);
        }
      }
      return (s[e] = a);
    }
    function by(e, a, n, s) {
      return a + r(n, t) + s;
    }
    var d = new RegExp(ae("/"), "g"),
      l = new RegExp(ae("."), "g");
    function by2(e, a, n, s) {
      return (n = n.replace(d, "/").replace(l, ".")), a + r(n, t) + s;
    }
    function cr(t, r, n, s, i) {
      "string" == typeof t && (t = new RegExp(t, "gi")),
        (r = a + r),
        (n = "string" == typeof n ? n : "\\s*=\\s*"),
        (s = "string" == typeof s ? s : ""),
        (i = "string" == typeof i ? "?)(" + i : ")(");
      var c = new RegExp("(" + r + n + '")([^"' + s + "]+" + i + ")", "gi"),
        o = new RegExp("(" + r + n + "')([^'" + s + "]+" + i + ")", "gi"),
        d = new RegExp(
          "(" + r + n + ")([^\"'][^\\s>" + s + "]*" + i + ")",
          "gi"
        );
      e = e.replace(t, function (e) {
        return e.replace(c, by).replace(o, by).replace(d, by);
      });
    }
    function cri(t, r, n, s, i, c) {
      "string" == typeof t && (t = new RegExp(t, "gi")),
        (r = a + r),
        (s = "string" == typeof s ? s : "gi");
      var o = new RegExp("(" + r + '\\s*=\\s*")([^"]*)', "gi"),
        d = new RegExp("(" + r + "\\s*=\\s*')([^']+)", "gi"),
        l = new RegExp("(" + n + ')([^"]+)(")', s),
        p = new RegExp("(" + n + ")([^']+)(')", s);
      if ("string" == typeof i) {
        c = "string" == typeof c ? c : "";
        var u = new RegExp(
            "(" + n + ")([^\"'][^" + i + "]*" + (c ? "?)(" + c + ")" : ")()"),
            s
          ),
          handleAttr = function (e, t, r) {
            return t + r.replace(l, by2).replace(p, by2).replace(u, by2);
          };
      } else
        handleAttr = function (e, t, r) {
          return t + r.replace(l, by2).replace(p, by2);
        };
      e = e.replace(t, function (e) {
        return e.replace(o, handleAttr).replace(d, handleAttr);
      });
    }
    /* <meta http-equiv=refresh content=" ; url= " > */ /*< style=" url(...) " > */
    return (
      cri(
        "<meta" +
          o +
          a +
          'http-equiv\\s*=\\s*(?:"' +
          ae("refresh") +
          '"' +
          o +
          ">|'" +
          ae("refresh") +
          "'" +
          o +
          ">|" +
          ae("refresh") +
          "(?:" +
          ae(" ") +
          o +
          ">|>))",
        "content",
        ae("url") + c + ae("=") + c,
        "i"
      ),
      cr("<" + o + a + "href\\s*=" + o + ">", "href") /* Linked elements */,
      cr("<" + o + a + "src\\s*=" + o + ">", "src") /* Embedded elements */,
      cr(
        "<object" + o + a + "data\\s*=" + o + ">",
        "data"
      ) /* <object data= > */,
      cr(
        "<applet" + o + a + "codebase\\s*=" + o + ">",
        "codebase"
      ) /* <applet codebase= > */,
      /* <param name=movie value= >*/
      cr(
        "<param" +
          o +
          a +
          'name\\s*=\\s*(?:"' +
          ae("movie") +
          '"' +
          o +
          ">|'" +
          ae("movie") +
          "'" +
          o +
          ">|" +
          ae("movie") +
          "(?:" +
          ae(" ") +
          o +
          ">|>))",
        "value"
      ),
      cr(
        /<style[^>]*>(?:[^"']*(?:"[^"]*"|'[^']*'))*?[^'"]*(?:<\/style|$)/gi,
        "url",
        "\\s*\\(\\s*",
        "",
        "\\s*\\)"
      ) /* <style> */,
      cri(
        "<" + o + a + "style\\s*=" + o + ">",
        "style",
        ae("url") + c + ae("(") + c,
        0,
        c + ae(")"),
        ae(")")
      ),
      e
    );
  },
  Exists: function (e) {
    var t = new XMLHttpRequest();
    return t.open("HEAD", e, !1), t.send(), 404 != t.status;
  },
};
class Markkit extends HTMLElement {
  constructor(e = {}) {
    super();
    var t = e.theme ?? theme;
    this.setTheme(t);
  }
  connectedCallback() {
    var e = this,
      t = e.getAttribute("src"),
      r = (e.getAttribute("theme"), e.innerText);
    t
      ? this.#fetchContent(t, (r) => {
          !1 === r.status && (r.data = r.data),
            this.Render(r.data, (r) => {
              e.innerHTML = `<div class="markdown-body">${linkHelper.replace_all_rel_by_abs(
                r,
                t
              )}</div>`;
            });
        })
      : this.Render(r, (t) => {
          e.innerHTML = `<div class="markdown-body">${t}</div>`;
        });
  }
  setTheme(e) {
    this.#require(
      {
        light:
          "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.0.0/github-markdown-light.min.css",
        dark: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.0.0/github-markdown-dark.min.css",
        auto: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.0.0/github-markdown.min.css",
      }[e]
    );
  }
  #fetchContent(e, t) {
    var r = linkHelper.Exists(e);
    r
      ? fetch(e)
          .then((e) => e.text())
          .then((e) => {
            t({ data: e, status: !0 });
          })
          .catch((r) => {
            t({
              status: !1,
              data:
                "# ERROR \n ### The file at `" +
                e +
                "` does not exist. ```" +
                r +
                "```",
            });
          })
      : (console.log(r),
        t({
          status: !1,
          data:
            "# ERROR \n ### Failed to fetch file at `" +
            e +
            "` <img src='https://ouch-cdn2.icons8.com/ODdjcV9ODsl_rJEnpzI91xQcC5_FBOXIfbe4y9xwbJ0/rs:fit:256:256/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNTEx/L2FlNDRkODcwLTI5/MzQtNDA1ZC04NTg0/LTczYzcwMTcyMWU2/Zi5zdmc.png'>",
        }));
  }
  Render(e, t) {
    function returnData(e) {
      "function" == typeof t && t(e);
    }
    "undefined" != typeof marked
      ? returnData(marked.parse(e))
      : this.#require(
          "https://cdn.jsdelivr.net/npm/marked/marked.min.js",
          () => {
            returnData(marked.parse(e));
          }
        );
  }
  #require(e, t) {
    if (e.endsWith(".css")) {
      var r = document.createElement("style");
      this.#fetchContent(e, (e) => {
        (r.innerHTML = e.data),
          r.classList.add("md-frame-css"),
          document.body.appendChild(r);
      });
    } else if (e.endsWith(".js")) {
      var a = document.createElement("script");
      (a.type = "text/javascript"), (a.src = e), document.body.appendChild(a);
      var n = a;
      n.onreadystatechange
        ? (n.onreadystatechange = function () {
            ("complete" != n.readyState && "loaded" != n.readyState) ||
              ((n.onreadystatechange = !1), t());
          })
        : (n.onload = function () {
            t();
          });
    }
  }
}
customElements.define("mark-down", Markkit);
