
import { storage } from '../services/firebase'
import { uploadBytes, getDownloadURL, ref } from '@firebase/storage';

export async function upload(uid, file){
    const storageRef = ref(storage, `users/${uid}/profile.jpg`)
    await uploadBytes(storageRef, file)
}

export async function download(uid){
    const storageRef = ref(storage, `users/${uid}/profile.jpg`)
    const imgUrl = await getDownloadURL(storageRef)
    return imgUrl
}
