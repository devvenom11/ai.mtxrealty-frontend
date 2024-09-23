import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0"); // Get day and add leading zero if necessary
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-based index) and add leading zero if necessary
  const year = date.getFullYear(); // Get full year

  return `${day}.${month}.${year}`;
};

export async function apiCall(method, path, body = null, headers = {}) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(path, options);

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || "Something went wrong!" };
  }
}

export const setDocument = async (collName, docId, data) => {
  try {
    await setDoc(doc(db, collName, docId), {
      data,
    });
  } catch (error) {
    console.log("error++++", error);
  }
};

export const getDocument = async (collName, docId) => {
  try {
    const docRef = doc(db, collName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log("errror++++", error);
  }
};

export const updateDocument = async(collName,docId,data)=>{
  try {
    const docRef = doc(db, collName, docId);

// Set the "capital" field of the city 'DC'
await updateDoc(docRef, {
  data
});
  } catch (error) {
    console.log("error++++",error)
  }
}
