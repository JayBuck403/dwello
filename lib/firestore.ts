// lib/firestore.ts
import { db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const saveUserToFirestore = async (user: {
    uid: string;
    name: string | null;
    email: string | null;
    photoURL: string | null;
    provider: string;
}) => {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        provider: user.provider,
        createdAt: serverTimestamp(),
    }, { merge: true });
};
