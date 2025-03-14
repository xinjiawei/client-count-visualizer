
import { ClientData } from "@/types/clientData";

const API_URL = "https://crackemby.mb6.top/4670/registration/pure_num.php";

export async function fetchClientData(): Promise<ClientData> {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching client data:", error);
    throw error;
  }
}
