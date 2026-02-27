import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import myData from "./data.json";

export const uploadData = async () => {
  try {
    for (let item of myData) {
      const docRef = doc(collection(db, "collection"));
      await setDoc(docRef, item);
    }
    alert("Uploaded!");
  } catch (err) {
    console.log(err);
  }
};
