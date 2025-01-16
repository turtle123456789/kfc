import {
  createUserWithEmailAndPassword as createUserWithEmailAndPasswordFirebase,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase,
  signOut as signOutFirebase,
  signInWithPopup,
  GoogleAuthProvider,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { query, where, orderBy } from "firebase/firestore";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const googleAuth = new GoogleAuthProvider();
const currentAuth = auth.currentUser;

export async function ChangePassword(uid, newPassword) {
  const docRef = doc(db, "users", uid);
  try {
    await updatePassword(currentAuth, newPassword);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        ["password"]: newPassword,
      });
    }
  } catch (e) {}
}

export async function ChangePasswordV2(uid, newPassword, oldPassword) {
  const auth = getAuth();
  const user = auth.currentUser;
  const docRef = doc(db, "users", uid);

  try {
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        password: newPassword, 
      });
    }
    
    console.log("Mật khẩu đã được thay đổi thành công!");
  } catch (e) {
    console.error("Đã xảy ra lỗi khi thay đổi mật khẩu:", e);
  }
}
export async function updateProfileUser(name) {
  await updateProfile(currentAuth, { displayName: name });
}

export async function signUpWithEmailAndPassword(email, password) {
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPasswordFirebase(
      auth,
      email,
      password
    );
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function signInWithEmailAndPassword(email, password) {
  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPasswordFirebase(auth, email, password);
  } catch (e) {
    error = e;
  }
  return { result, error };
}

export async function signOut() {
  let result = null;
  let error = null;
  try {
    result = await signOutFirebase(auth);
    localStorage.clear();  
  } catch (e) {
    error = e;
  }
  localStorage.removeItem("id");
  return { result, error };
}
export async function signInGoogle() {
  let result = null,
    error = null;
  try {
    const res = await signInWithPopup(auth, googleAuth);
    result = res.user;
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export const UpLoadFile = async (img) => {
  let urlDownload,
    upload = null;
  try{
    if (img) {
      const name = img.name;
      const storageRef = ref(storage, `image/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, img);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          upload = progress;
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error(error);
        },
        async () => {
          try{
            urlDownload = await getDownloadURL(uploadTask.snapshot.ref);
          }catch{
            console.error(error);
          }
         
        }
      );
    } else {
      console.error("File not found");
    }
  
    while (!urlDownload) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }catch{

  }
  

  return { urlDownload, upload };
};
export const getData = async (name) => {
  try{
    let newData;
  await getDocs(collection(db, name)).then((querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    newData = data;
  });
  return newData;
  }catch{
    console.error("Error");
  }
  
};

export const addData = async (name, data) => {
  try {
    await addDoc(collection(db, name), data);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
export const addDataWithID = async (name, id, data) => {
  try {
    await setDoc(doc(db, name, id), data);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const deleData = async (name, id) => {
  try {
    const docRef = doc(db, name, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.log(error);
  }
};
export const updateData = async (name, id, newData) => {
  try {
    const docRef = doc(db, name, id);
    await updateDoc(docRef, newData);
  } catch (error) {
    console.log(error);
  }
};
export const getItem = async (name, id) => {
  try {
    const docRef = doc(db, name, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.log("hehe", error);
  }
};
export const deleteElementArray = async (name, uid, id, nameArray) => {
  const docRef = doc(db, name, uid);
  const docSnap = await getDoc(docRef);
  try{
    if (docSnap.exists()) {
      const data = docSnap.data();
      const newArray = data[nameArray].filter((obj) => obj.id !== id);
  
      await updateDoc(docRef, {
        [nameArray]: newArray,
      });
    }
  }catch
  {
    console.log("Error deleting element from array");
  }
 
};

export const addToFirebaseArray = async (collectionName, documentId, data) => {
  const documentRef = doc(db, collectionName, documentId);

  try {
    await updateDoc(documentRef, {
      items: arrayUnion(data),
    });
    console.log("Element added to the array successfully");
  } catch (error) {
    console.error("Error adding element to the array:", error);
  }
};
export async function checkAccountExists(email) { 
  const userRef = doc(db, "users", email);

  let result = null, error = null;
  
  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      result = userDoc.data();  
    } else {
      result = null;  
    }
  } catch (e) {
    error = e;  
  }

  return { result, error };
}
export async function checkAccountAndPassword(email, password) {
  const userRef = doc(db, "users", email);

  let result = null, error = null;

  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        result = userCredential.user;
      } catch (authError) {
        error = authError; 
      }
    } else {
      result = null;
    }
  } catch (e) {
    error = e;  
  }

  return { result, error };
}
export const getFilteredOrders = async (name, startDate, endDate) => {
  try {
    
    const dataRef = collection(db, name); 
    
    
    const querySnapshot = await getDocs(dataRef);
    
    
    const filteredData = querySnapshot.docs.map((doc) => {
      const order = doc.data();  

      
      const filteredItems = order.items.filter((item) => {
        const itemDate = new Date(item.date); 
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });

      
      if (filteredItems.length > 0) {
        return {
          ...order,         
          items: filteredItems, 
        };
      }
      return null;
    }).filter(order => order !== null); 

    return filteredData; 
  } catch (error) {
    console.error("Lỗi khi lấy và lọc dữ liệu:", error);
    throw error;
  }
};
export const getFilteredOrdersById = async (collectionName, startDate, endDate, userId) => {
  try {

    const dataRef = collection(db, collectionName);

    const querySnapshot = await getDocs(dataRef);

    const filteredOrders = querySnapshot.docs
      .filter((doc) => doc.id === userId)
      .map((doc) => {
        const order = doc.data();

        const filteredItems = order.items.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });

        if (filteredItems.length > 0) {
          return {
            ...order,
            items: filteredItems, 
          };
        }

        return null; 
      })
      .filter((order) => order !== null);

    return filteredOrders;
  } catch (error) {
    console.error("Lỗi khi lấy và lọc dữ liệu đơn hàng theo ID:", error);
    throw error;
  }
};


