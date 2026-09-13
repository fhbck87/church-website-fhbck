// This file is intentionally kept Node-safe because some hosting providers
// execute the package entry directly. The browser app is bundled from
// src/client-index.js via config-overrides.js.

if (typeof document !== 'undefined') {
  console.warn(
    'The browser entry is loaded via src/client-index.js. This Node-safe stub should not render the app.'
  );
}

module.exports = {};
