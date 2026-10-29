import { JSDOM } from 'jsdom';
import { createServer } from 'vite';

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="header-root"></div><main id="main-content"><div id="app"></div></main><div id="footer-root"></div></body></html>', {
  url: 'http://localhost:5173/customers',
  runScripts: 'dangerously'
});
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.CustomEvent = dom.window.CustomEvent;
global.localStorage = dom.window.localStorage;
global.history = dom.window.history;
global.IntersectionObserver = class { observe(){} unobserve(){} disconnect(){} };
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
await vite.ssrLoadModule('/src/main.js');
const { navigateTo } = await vite.ssrLoadModule('/src/router.js');

console.log('1. Initial URL:', window.location.pathname);
navigateTo('/customers');
console.log('2. Navigated to /customers, has customer section?:', !!document.querySelector('#customer-stories-section'));

const logo = document.querySelector('#brand-logo');
console.log('3. Logo element:', logo ? 'Found' : 'Not found');
console.log('4. Logo href:', logo ? logo.getAttribute('href') : null);

logo.click();
console.log('5. After logo click, URL:', window.location.pathname);
console.log('6. Has Hero (#home)?:', !!document.querySelector('#home'));
console.log('7. Has HomeContent (#home-content-root)?:', !!document.querySelector('#home-content-root'));

await vite.close();
