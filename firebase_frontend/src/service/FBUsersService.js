import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    updatePassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";

import { firebaseConfig } from "./config";
import { get_objects, get_objects_by_field } from "./FirebaseService";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const is_admin = async() => {
    const admins = await (await get_objects('admins')).objects

    let result = false

    admins.forEach(el => {
        if (el.user_id === auth.currentUser.uid) {
            result = true
        }
    })

    return result
}


const get_telegram_chat_id = async(user_uid) => {
    let telegram_chat_id = '-1'
    try {
        const telegram_chats = await get_objects_by_field('user_uid', user_uid, 'telegram_chats')
        if (telegram_chats.length > 0) {
            telegram_chat_id = telegram_chats[0].chat_id
        }
    } catch (e) {
        console.log(`Error while getting telegram chat id ${e}`)
    } finally {
        return telegram_chat_id
    }
}

const signInWithGoogle = async() => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                role: 'common',
            });
        }

        return {
            error: false,
            message: "Успешно",
        };
    } catch (err) {
        console.error(`Login error with google  ${err.message}`);

        return {
            error: true,
            message: `Ошибка входа по учетной записи google. Пожалуйста, попробуйте позже.`,
        };
    }
};

const logInWithEmailAndPassword = async(email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);

        return {
            error: false,
            message: "Успешно",
        };
    } catch (err) {
        console.error(`Login error  ${err.message}`);

        return {
            error: true,
            message: `Ошибка входа. Проверьте корректность данных.`,
        };
    }
};

const registerWithEmailAndPassword = async(name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            role: 'common',
            email,
        });

        return {
            error: false,
            message: "Успешно",
        };
    } catch (err) {
        alert(err.message);
        console.log(err);
        console.error(`Login error  ${err.message}`);

        return {
            error: true,
            message: `Ошибка регистрации. Пожалуйста, попробуйте позже.`,
        };
    }
};

const editUser = async(displayName) => {
    console.log(auth.currentUser.uid)
    return await updateProfile(auth.currentUser, {
        displayName: displayName
    }).then(() => {
        return {
            error: false,
            message: "Успешно",
        };
    }).catch((error) => {
        alert(error.message);
        console.log(error);
        console.error(`Edit user error  ${error.message}`);

        return {
            error: true,
            message: `Ошибка изменения данных пользователя.`,
        };
    });
};

const editUserPass = async(password) => {
    return await updatePassword(auth.currentUser, password).then(() => {
        return {
            error: false,
            message: "Успешно",
        };
    }).catch((error) => {
        alert(error.message);
        console.log(error);
        console.error(`Edit user pass error  ${error.message}`);

        return {
            error: true,
            message: `Ошибка изменения пароля.`,
        };
    });
}

const sendPasswordReset = async(email) => {
    try {
        const message = "Ссылка на пароль была отправлена по почте!";
        await sendPasswordResetEmail(auth, email);
        alert(message);

        return {
            error: false,
            message: message,
        };
    } catch (err) {
        console.error(`Login error  ${err.message}`);

        return {
            error: true,
            message: `Ошибка смены пароля. Пожалуйста, попробуйте позже.`,
        };
    }
};

const logout = () => {
    signOut(auth);
};

export {
    auth,
    db,
    is_admin,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    editUser,
    get_telegram_chat_id,
    editUserPass
};