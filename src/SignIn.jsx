// SignIn.jsx — shown when nobody is signed in.
// One button that opens Google's sign-in popup.
// Who is ALLOWED in is decided by the Firestore security rules (your two
// emails), not here: anyone can sign in, but only you two can read/write data.

import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

export default function SignIn() {
  // Error message to show if sign-in fails (e.g. popup blocked)
  const [error, setError] = useState('');

  async function handleSignIn() {
    setError('');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      // No need to do anything else: App.jsx notices the new user and
      // switches screens automatically.
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="signin">
      <h1>D&D Groceries</h1>
      <button onClick={handleSignIn}>Confirm being my PARTNER</button>
      {error && <p className="error">{error}</p>}
    </main>
  );
}
