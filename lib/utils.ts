export function getUserData(userFile: any){
    const uid = userFile.uid;
    const email = userFile.email;
    const displayName = userFile.displayName;
    const photoURL = userFile.photoURL;
    return ({uid, email, displayName, photoURL});
}
