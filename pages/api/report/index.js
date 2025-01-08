import { getData } from "@/feature/firebase/firebaseAuth";

export default async function handle(req, res) {
    const { method } = req;
    const name = "previous-order";  // Tên collection bạn muốn truy vấn
  
    if (method === "GET") {
      try {
        // Lấy dữ liệu từ collection "previous-order"
        const data = await getData(name);
  
        // Lấy ngày hiện tại (chỉ lấy năm, tháng, ngày)
        const today = new Date();
        const currentDate = today.toISOString().split("T")[0]; // "yyyy-mm-dd"
  
        // Lọc các đơn hàng có ngày `date` là ngày hôm nay
        const filteredData = data.filter(order => {
          return order.items.some(item => {
            // Lấy ngày của item (chỉ phần ngày, không cần thời gian)
            const itemDate = new Date(item.date).toISOString().split("T")[0]; 
            return itemDate === currentDate;  // So sánh với ngày hôm nay
          });
        });
  
        // Trả về dữ liệu đã lọc
        res.status(200).json(filteredData);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  }