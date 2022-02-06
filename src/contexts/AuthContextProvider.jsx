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
        try {
            const response = await signInWithEmailAndPassword(auth, email, password)
            console.log(response)
            const dbRef = ref(db)
            const roomRef = await get(child(dbRef, `users/${auth.currentUser.uid}`))
            if(!roomRef.exists()) {
                alert("User doesn't exist")
                return { complete: false, error: ''}
            }
            handleUser(auth.currentUser, roomRef.val().victory)
            return { complete: true, error: ''}
        
        } catch (error) {
            const errorRegex1 = /Firebase: Error \(auth\//;
            const errorRegex2 = /\)\./;
            const message = error.message
                .replace(errorRegex1, '')
                .replace(errorRegex2, '')
                .replace(/-/, ' ')
            return { complete: false, error: message.toUpperCase()}
        }
    

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
        try{
            await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(auth.currentUser, {
                displayName: name, photoURL: standardUserImg
            })
            await sendEmailVerification(auth.currentUser)
            handleUser(auth.currentUser)
            await set(ref(db, `/users/${auth.currentUser.uid}`), {
                victory: 0, name: auth.currentUser.displayName, avatar: String(auth.currentUser.photoURL)
            })
            return { complete: true, error: ''}
        } catch (error) {
            const errorRegex1 = /Firebase: Error \(auth\//;
            const errorRegex2 = /\)\./;
            const message = error.message
                .replace(errorRegex1, '')
                .replace(errorRegex2, '')
                .replace(/-/, ' ')
            return { complete: false, error: message.toUpperCase()}
        }
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