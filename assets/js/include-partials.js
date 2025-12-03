/* Simple partial include loader
   Usage: add <div data-include="assets/includes/header.html"></div>
   The script will fetch and replace the element with the HTML content.
*/
(function () {
  function includePartial(el) {
    var path = el.getAttribute('data-include');
    if (!path) return Promise.resolve();
    return fetch(path)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + path + ' (' + res.status + ')');
        return res.text();
      })
      .then(function (html) {
        el.innerHTML = html;
        // Move scripts inside the loaded HTML into the document so they execute
        var scripts = el.querySelectorAll('script');
        scripts.forEach(function (s) {
          var newScript = document.createElement('script');
          if (s.src) newScript.src = s.src;
          if (s.type) newScript.type = s.type;
          newScript.text = s.textContent;
          s.parentNode.replaceChild(newScript, s);
        });
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var els = document.querySelectorAll('[data-include]');
    var promises = [];
    els.forEach(function (el) {
      promises.push(includePartial(el));
    });
    Promise.all(promises).then(function () {
      // Reinitialize any JS that depends on header/footer if necessary
      // For example, Bootstrap's navbar requires no extra init.
    });
  });
})();

