(function () {
  var endpoint = "https://nepar-contact.ig29007.workers.dev/analytics/pageview";
  var path = window.location.pathname;
  if (path === "/admin") return;

  var payload = JSON.stringify({
    path: path,
    title: document.title || path,
    referrer: document.referrer || "",
    language: navigator.language || "",
    screen: (window.screen && window.screen.width ? window.screen.width : 0) +
      "x" +
      (window.screen && window.screen.height ? window.screen.height : 0),
    ownerDevice: localStorage.getItem("nepar-analytics-owner-device") === "1",
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([payload], { type: "text/plain;charset=UTF-8" }));
    return;
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(function () {});
})();
