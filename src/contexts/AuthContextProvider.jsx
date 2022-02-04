import { useState, useEffect, createContext} from 'react'

import { 
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    signInWithEmailAndPassword,
    sendEmailVerification
} from "firebase/auth";
import { auth } from '../services/firebase';
import standardUserImg from '../assets/images/User.svg'
export const AuthContext = createContext({});

export function AuthContextProvider(props){

    const [user, setUser] = useState()
    
    function handleUser(user){
        if(user){
            const { email, displayName, photoURL, uid, emailVerified} = user

        if(!displayName || !photoURL){
            throw new Error('Missing information from Google Account');
        }

        setUser({
            id: uid,
            email: email,
            name: displayName,
            avatar: String(photoURL),
            verified: emailVerified
        })
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => handleUser(user))

        return ()=>{unsubscribe()}
    }, [])

    async function signInNormally(email, password){
        await signInWithEmailAndPassword(auth, email, password)
        handleUser(auth.currentUser)
    }

    async function signInWithGoogle () {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider)
        handleUser(result.user)
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            // The signed-in user info.
    }

    async function register(name, email, password) {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(auth.currentUser, {
            displayName: name, photoURL: standardUserImg
        })
        await sendEmailVerification(auth.currentUser)
        handleUser(auth.currentUser)
    }

    async function handleSignOut(){
        const response = await signOut(auth)
        setUser()
    }
    return(
        <AuthContext.Provider value={{user, signInWithGoogle, handleSignOut, register, signInNormally}} >
            {props.children}
        </AuthContext.Provider>
    )
}