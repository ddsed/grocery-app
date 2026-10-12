// UpdatePrompt.jsx — banner that appears when a new version has been deployed.
//
// How it works: the installed app keeps a stored copy of itself (so it can
// start offline). After a deploy, the phone downloads the new version in the
// background, and this banner asks you to switch to it.

import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh], // true when a new version is ready
    updateServiceWorker, // switches to the new version and reloads
  } = useRegisterSW({
    // Check for a new version every time the app comes back to the screen
    // (phones often resume the app instead of starting it fresh)
    onRegisteredSW(swUrl, registration) {
      if (!registration) return;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') registration.update();
      });
    },
  });

  // Nothing to show until a new version is ready
  if (!needRefresh) return null;

  return (
    <div className="update-banner" role="status">
      <span>New version available</span>
      <button onClick={() => updateServiceWorker(true)}>Refresh</button>
      <button className="back" onClick={() => setNeedRefresh(false)}>
        Later
      </button>
    </div>
  );
}
