import { getData } from "@/feature/firebase/firebaseAuth";

export default async function handle(req, res) {
  const { method } = req;
  if (method === "GET") {
    try {
      const data = await getData("slider");
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
