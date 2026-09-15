/**
 * Plain Disclosure · demo logic (sample A/B/C + custom heuristic)
 */
(function () {
  "use strict";

  var samples = {
    a: {
      text: "We collect your name, university email, and course selections to personalise your dashboard and send service notices. Data is stored on university systems and retained while you are enrolled. We do not sell personal data. Dashboard personalisation is optional. You may request corrections through the help desk.",
      out: {
        what: "name + email + course selections",
        why: "dashboard personalisation + service notices",
        where: "uni systems while you're enrolled; not sold",
        no: "personalisation optional; corrections via help desk",
        gap: false,
        marks: ["personalise", "retained", "optional"]
      }
    },
    b: {
      text: "We may collect information to improve services and communicate with users as needed. Data is handled according to university policy.",
      out: {
        what: "\"information\" ... too vague",
        why: "improve / communicate ... fuzzy",
        where: "\"university policy\" ... fuzzy",
        no: "missing ... blurb never says",
        gap: true,
        marks: ["may collect", "as needed", "university policy"]
      }
    },
    c: {
      text: "We collect your name and email for account setup and store it on university systems while you are enrolled.",
      out: {
        what: "name + email",
        why: "account setup",
        where: "uni systems while you're enrolled",
        no: "missing ... blurb never says",
        gap: true,
        marks: ["account setup", "while you are enrolled"]
      }
    }
  };

  var sampleEl = document.getElementById("sample");
  var sourceEl = document.getElementById("source");
  var sourceView = document.getElementById("sourceView");
  var confusedBtn = document.getElementById("confused");
  var runBtn = document.getElementById("run");
  if (!sampleEl || !sourceEl || !runBtn) return;

  var confusedOn = false;

  function fillSource(key) {
    sourceEl.value = samples[key].text;
    render(samples[key].out, samples[key].text);
  }

  function render(out, text) {
    var what = document.querySelector('[data-slot="what"]');
    var why = document.querySelector('[data-slot="why"]');
    var where = document.querySelector('[data-slot="where"]');
    var noEl = document.querySelector('[data-slot="no"]');
    if (!what || !why || !where || !noEl) return;
    what.textContent = out.what;
    why.textContent = out.why;
    where.textContent = out.where;
    noEl.textContent = out.no;
    noEl.parentElement.classList.toggle("gap", !!out.gap || /missing/i.test(out.no));

    if (confusedOn && out.marks && sourceView) {
      var html = text;
      out.marks.forEach(function (m) {
        html = html.replace(m, "<mark class=\"pd-confused\">" + m + "</mark>");
      });
      sourceView.innerHTML = html;
      sourceView.classList.add("on");
    } else if (sourceView) {
      sourceView.classList.remove("on");
      sourceView.textContent = "";
    }
  }

  function runCustom() {
    var t = sourceEl.value.trim();
    var mapped = null;
    Object.keys(samples).forEach(function (k) {
      if (samples[k].text === t) mapped = samples[k];
    });
    if (mapped) {
      render(mapped.out, mapped.text);
      return;
    }
    var low = t.toLowerCase();
    var out = {
      what: /name|email|data|information/.test(low)
        ? "some data is mentioned ... check the wording"
        : "missing ... blurb never says",
      why: /for |to /.test(low)
        ? "a purpose is hinted ... may still be fuzzy"
        : "missing ... blurb never says",
      where: /store|stored|system|share|third/.test(low)
        ? "storage/sharing hinted ... check detail"
        : "missing ... blurb never says",
      no: /optional|opt out|delete|correct|refus/.test(low)
        ? "some choice language appears"
        : "missing ... blurb never says",
      gap: true,
      marks: []
    };
    out.gap = /missing/.test(out.no);
    render(out, t);
  }

  sampleEl.addEventListener("change", function () {
    fillSource(sampleEl.value);
  });
  runBtn.addEventListener("click", runCustom);
  if (confusedBtn) {
    confusedBtn.addEventListener("click", function () {
      confusedOn = !confusedOn;
      confusedBtn.setAttribute("aria-pressed", confusedOn ? "true" : "false");
      runCustom();
    });
  }

  fillSource("a");
})();
