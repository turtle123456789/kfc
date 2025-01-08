import {
  updateData,
  getItem,
  addDataWithID,
  signUpWithEmailAndPassword,
  ChangePassword,
  updateProfileUser,
} from "@/feature/firebase/firebaseAuth";

const nameDB = "users";

export default async function handle(req, res) {
  const { method } = req;

  if (method === "POST") {
    let payload = null;
    const { account, password } = req.body;
    try {
      const { result, error } = await signUpWithEmailAndPassword(
        account,
        password
      );
      if (!error) {
        await addDataWithID(nameDB, result.user.uid, { ...req.body });
        payload = result;
      } else {
        payload = result;
      }
      res.status(200).json({ login: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  if (method === "PUT") {
    try {
      const { newPassword, uid } = req.body;
      await ChangePassword(uid, newPassword);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  if (method === "GET") {
    const { name, id } = req.body;
    try {
      const data = await getItem(name, id);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}
