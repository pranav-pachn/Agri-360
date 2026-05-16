const routes = ['/', '/dashboard', '/upload', '/diagnosis', '/trust-score'];
(async () => {
  for (const r of routes) {
    try {
      const res = await fetch('http://127.0.0.1:5173' + r);
      const text = await res.text();
      const hasRoot = text.includes('id="root"');
      console.log(r + ' -> ' + res.status + ' | root:' + hasRoot);
    } catch (e) {
      console.log(r + ' -> ERROR | ' + e.message);
    }
  }
})();
