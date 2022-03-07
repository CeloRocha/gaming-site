import { useState, useEffect, createContext} from 'react'
import { db, auth} from '../services/firebase'
import { ref, set, update, get, child} from "firebase/database";
import { 
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    signInWithEmailAndPassword,
    sendEmailVerification
} from "firebase/auth";
import standardUserImg from '../assets/images/User.svg'
import { upload, download } from '../helper/firebaseStorageFunctions';
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

    async function getVictory(){
        if(auth.currentUser.uid !== undefined){
            const dbRef = ref(db)
            const roomRef = await get(child(dbRef, `users/${auth.currentUser.uid}`))
            handleUser(auth.currentUser, roomRef.val()?.victory)
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => handleUser(user))

        return ()=>{unsubscribe()}
    }, [])

    useEffect(()=>{
        getVictory()
    }, [user?.id])

    async function signInNormally(email, password){
        try {
            await signInWithEmailAndPassword(auth, email, password)
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
        const userRef = await get(child(dbRef, `users/${auth.currentUser.uid}`))
        if(!userRef.exists()) {
            await set(ref(db, `/users/${auth.currentUser.uid}`), {
                victory: 0, name: auth.currentUser.displayName, avatar: String(auth.currentUser.photoURL)
            })
            handleUser(result.user)
            return
        }
        handleUser(result.user, userRef.val().victory)
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
        if(!user){ return false}
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
    
    async function uploadImg(file){
        await upload(auth.currentUser.uid, file)
        const imgUrl = await download(auth.currentUser.uid)
        await set(ref(db, `/users/${auth.currentUser.uid}/avatar`), String(imgUrl))
        await updateProfile(auth.currentUser, {
            photoURL: imgUrl
        })
        setUser(prevUser =>{
            return {...prevUser, avatar: imgUrl}
        })
    }

    async function addVictory(room){
        const newVictory = user.victory + 1
        await set(ref(db, `/users/${auth.currentUser.uid}`), {
            victory: newVictory, name: auth.currentUser.displayName, avatar: String(auth.currentUser.photoURL)
        })
        setUser(prevUser => ({...prevUser, victory: newVictory
        }))
        const updates = {}
        updates['/victory'] = newVictory
        await update(ref(db, `/rooms/${room}/players/${user.id}`), updates)
    }

    return(
        <AuthContext.Provider value={{user, signInWithGoogle, handleSignOut, register, signInNormally, handleAuthorization, uploadImg, addVictory}} >
            {props.children}
        </AuthContext.Provider>
    )
}