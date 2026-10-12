// App.jsx — decides which screen to show:
//   1. still checking who's signed in -> "Loading…"
//   2. nobody signed in               -> SignIn screen
//   3. a list is open                 -> ListScreen (one list's items)
//   4. otherwise                      -> ListsScreen (overview)
// All data now lives in Firestore (see data.js), so App no longer holds lists.

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import SignIn from './SignIn';
import ListsScreen from './ListsScreen';
import ListScreen from './ListScreen';

export default function App() {
  // The signed-in Google user.
  // undefined = Firebase is still checking, null = signed out, object = signed in
  const [user, setUser] = useState(undefined);

  // The open list as { id, name }. null = show the overview.
  const [openList, setOpenList] = useState(null);

  // Listen for sign-in / sign-out. Firebase remembers the login between visits,
  // so after the first sign-in this fires with the user straight away.
  // onAuthStateChanged returns an "unsubscribe" function, which useEffect
  // calls when App disappears.
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) return <p className="empty">Loading…</p>;

  if (!user) return <SignIn />;

  if (openList) {
    return <ListScreen list={openList} onBack={() => setOpenList(null)} />;
  }

  return <ListsScreen user={user} onOpenList={setOpenList} />;
}
