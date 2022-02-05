import { useState, useEffect, createContext} from 'react'
import { db } from '../services/firebase'
import { ref, set, get, child} from "firebase/database";
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
    
    function handleUser(user, victory = 0){
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
            verified: emailVerified,
            victory: victory
        })
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => handleUser(user))

        return ()=>{unsubscribe()}
    }, [])

    async function signInNormally(email, password){
        await signInWithEmailAndPassword(auth, email, password)
        const dbRef = ref(db)
        const roomRef = await get(child(dbRef, `users/${auth.currentUser.uid}`))
        if(!roomRef.exists()) {
            alert("User doesn't exist")
            return
        }
        handleUser(auth.currentUser, roomRef.val().victory)
    }

    async function signInWithGoogle () {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider)
        const dbRef = ref(db)
        const roomRef = await get(child(dbRef, `users/${auth.currentUser.uid}`))
        if(!roomRef.exists()) {
            await set(ref(db, `/users/${auth.currentUser.uid}`), {
                victory: 0, name: auth.currentUser.displayName, avatar: String(auth.currentUser.photoURL)
            })
            handleUser(result.user)
            return
        }
        handleUser(result.user, roomRef.val().victory)
    }

    async function register(name, email, password) {
        await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(auth.currentUser, {
            displayName: name, photoURL: standardUserImg
        })
        await sendEmailVerification(auth.currentUser)
        handleUser(auth.currentUser)
        await set(ref(db, `/users/${auth.currentUser.uid}`), {
            victory: 0, name: auth.currentUser.displayName, avatar: String(auth.currentUser.photoURL)
        })
    }

    async function handleSignOut(){
        await signOut(auth)
        setUser()
    }

    async function handleAuthorization(){
        if(user.verified){
            return true
        }
        await auth.currentUser.reload()
        if(auth.currentUser.emailVerified){
            handleUser(auth.currentUser)
            return true
        }else{
            return false
        }
    }
     
    return(
        <AuthContext.Provider value={{user, signInWithGoogle, handleSignOut, register, signInNormally, handleAuthorization}} >
            {props.children}
        </AuthContext.Provider>
    )
}