(function () {
  var endpoint = "https://nepar-contact.ig29007.workers.dev/analytics/pageview";
  var path = window.location.pathname;
  if (path === "/admin") return;

  function getVisitorId() {
    try {
      var key = "nepar-analytics-visitor-id";
      var id = localStorage.getItem(key);
      if (!id) {
        id = window.crypto && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()) + "-" + String(Math.random());
        localStorage.setItem(key, id);
      }
      return id;
    } catch (e) {
      return "";
    }
  }

  function getDeviceType() {
    var ua = navigator.userAgent || "";
    var width = window.innerWidth || (window.screen && window.screen.width) || 0;
    if (/ipad|tablet|kindle|playbook/i.test(ua) || (width >= 768 && width <= 1024 && /mobile/i.test(ua))) {
      return "tablet";
    }
    if (/mobi|android|iphone|ipod|blackberry|iemobile/i.test(ua) || width < 768) {
      return "mobile";
    }
    return "desktop";
  }

  var payload = JSON.stringify({
    path: path,
    title: document.title || path,
    referrer: document.referrer || "",
    language: navigator.language || "",
    screen: (window.screen && window.screen.width ? window.screen.width : 0) +
      "x" +
      (window.screen && window.screen.height ? window.screen.height : 0),
    ownerDevice: localStorage.getItem("nepar-analytics-owner-device") === "1",
    visitorId: getVisitorId(),
    device: getDeviceType(),
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
