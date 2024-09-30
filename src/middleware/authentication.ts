import { FirebaseApp, FirebaseError, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
export enum Roles {
  OWNER = "OWNER",
  CREW = "CREW",
  NONE = "NONE",
}

export enum FirebaseAuthErrorMessages {
  "auth/email-already-in-use" = "The email address is already in use by another account.",
  "auth/invalid-email" = "The email address is badly formatted.",
  "auth/operation-not-allowed" = "Password sign-in is disabled for this project.",
  "auth/weak-password" = "The password is invalid or the user does not have a password.",
  "auth/wrong-password" = "The password is invalid or the user does not have a password.",
  "auth/user-not-found" = "There is no user record corresponding to this identifier. The user may have been deleted.",
  "auth/user-disabled" = "The user account has been disabled by an administrator.",
  "auth/expired-action-code" = "The action code has expired. " +
    "This can happen if the code is malformed, expired, or has already been used.",
  "auth/invalid-action-code" = "The action code is invalid. This can happen if the code is malformed, " +
    "expired, or has already been used.",
  "auth/code-expired" = "The SMS code has expired. " +
    "This can happen if the code is malformed, expired, or has already been used.",
  "auth/invalid-verification-code" = "The SMS verification code used to create the phone auth credential is invalid. ",
  "auth/internal-error" = "Something went wrong.",
}

const useAuthentication = (() => {
  let firebaseApp: FirebaseApp | null = null;
  const firebaseConfig: any = {
    apiKey: "AIzaSyD0X43iGLmC-URm3VvfPoVlh9iRi3m3g4g",
    authDomain: "bandithemepark.firebaseapp.com",
    projectId: "bandithemepark",
    storageBucket: "bandithemepark.appspot.com",
    messagingSenderId: "637828631721",
    appId: "1:637828631721:web:31ae5b16356cf0a0746db8",
    measurementId: "G-2WCGKMHFJM",
  };

  const init = () => {
    firebaseApp = initializeApp(firebaseConfig);
    let auth = getAuth();
    setPersistence(auth, browserLocalPersistence);

    console.log("Firebase app initialized");
  };

  const getFirebaseApp = () => {
    if (firebaseApp === null) {
      throw new Error("Firebase app is not initialized");
    }
    return firebaseApp;
  };

  const restoreAuth = (): Promise<boolean> => {
    let auth = getAuth();

    return new Promise((resolve, _reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  };
  const getEnumValue = (enumType: any, key: string) => {
    return enumType[key];
  };

  const resolveErrorMessage = (error: FirebaseError): string => {
    if (error !== undefined) {
      console.error(error);

      return getEnumValue(FirebaseAuthErrorMessages, error.code);
    }
    return "";
  };

  const userHasRole = async (roles: Roles[]) => {
    let auth = getAuth();

    let user = auth.currentUser;

    if (!user) {
      return false;
    }

    let claims = await user!!.getIdTokenResult().then((userTokenId) => {
      return userTokenId.claims;
    });

    if (!claims.role) return false;
    return roles.includes(claims.role!!.toString() as Roles);
  };

  const getUserRole = async () => {
    let auth = getAuth();

    let user = auth.currentUser;

    if (!user) {
      return Roles.NONE;
    }

    let claims = await user!!.getIdTokenResult().then((userTokenId) => {
      return userTokenId.claims;
    });

    return claims.role as Roles;
  };

  const getUser = (): User | null => {
    let auth = getAuth();

    return auth.currentUser;
  };

  const getAuthenticationToken = async () => {
    return await getUser()?.getIdToken();
  };

  const loginUsernamePassword = (
    email: string,
    password: string
  ): Promise<UserCredential | FirebaseError> => {
    let auth = getAuth();

    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, email, password)
        .then((user: UserCredential) => {
          console.log(user);

          resolve(user);
        })
        .catch((error: FirebaseError) => {
          console.log(error);

          reject({ error });
        });
    });
  };

  const logout = () => {
    return new Promise((resolve, reject) => {
      let auth = getAuth();

      signOut(auth)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          reject(false);
        });
    });
  };

  return {
    init,
    getFirebaseApp,
    restoreAuth,
    resolveErrorMessage,
    userHasRole,
    getUserRole,
    getUser,
    getAuthenticationToken,
    loginUsernamePassword,
    logout,
  };
})();

export default useAuthentication;
