(() => {
  const root = document.getElementsByTagName('body')[0];
  
  const s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', chrome.extension.getURL('index.js'));

  root.appendChild(s);
})();
