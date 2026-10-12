// UpdatePrompt.jsx — banner that appears when a new version has been deployed.
//
// How it works: the installed app keeps a stored copy of itself (so it can
// start offline). After a deploy, the phone downloads the new version in the
// background ("waiting"), and this banner asks you to switch to it.

import { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdatePrompt() {
  // True while switching to the new version, so the button can show "Updating…"
  const [updating, setUpdating] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh], // true when a new version is ready
    updateServiceWorker, // activates the new version
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

  async function handleRefresh() {
    setUpdating(true);

    // When the new version takes over, reload the page so it actually runs
    navigator.serviceWorker?.addEventListener('controllerchange', () => {
      window.location.reload();
    });

    try {
      // Tell the waiting new version to take over
      await updateServiceWorker(true);
    } finally {
      // Safety net: some phones (especially installed iPhone apps) never fire
      // the "took over" event, so reload ourselves after a short moment
      setTimeout(() => window.location.reload(), 1500);
    }
  }

  // Nothing to show until a new version is ready
  if (!needRefresh) return null;

  return (
    <div className="update-banner" role="status">
      <span>New version available</span>
      <button onClick={handleRefresh} disabled={updating}>
        {updating ? 'Updating…' : 'Refresh'}
      </button>
      <button className="back" onClick={() => setNeedRefresh(false)}>
        Later
      </button>
    </div>
  );
}
