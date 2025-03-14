
import { ApiResponse, ClientData } from "@/types/clientData";

const API_URL = "https://crackemby.mb6.top/4670/registration/pure_num.php";

export async function fetchClientData(): Promise<ClientData> {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const apiResponse: ApiResponse = await response.json();
    
    // 将数组数据转换为 {version: count} 格式的对象
    const clientData: ClientData = {};
    apiResponse.data.list.forEach(item => {
      clientData[item.ver] = parseInt(item.group_count, 10);
    });
    
    return clientData;
  } catch (error) {
    console.error("Error fetching client data:", error);
    throw error;
  }
}
