import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getBookingStatistics } from "../../services/bookingApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getBookingStatistics();

        const labels = response.data.map((item) => item.roomName);
        const data = response.data.map((item) => item.bookingCount);

        setChartData({
          labels,
          datasets: [
            {
              label: "Số lượt đặt phòng",
              data,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Lỗi lấy dữ liệu thống kê:", error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">📊 Bảng điều khiển thống kê</h1>

      {chartData ? (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">
            Lượt đặt theo từng phòng
          </h2>
          <Bar data={chartData} />
        </div>
      ) : (
        <p>Đang tải dữ liệu biểu đồ...</p>
      )}
    </div>
  );
}
