import axios from 'axios';

export async function isMainland(systemName: string): Promise<boolean> {
  try {
    const response = await axios.get(`https://red-frog.org/api/public/v1/calculator/red/?origin=Jita&destination=${systemName}`, {
      headers: {
        'accept': 'application/json'
      }
    });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    if (error?.response?.data?.error !== 'No contiguous High Sec route found. For Low Sec, Null Sec and High Sec islands please refer to Black Frog Logistics.') {
      console.error(error);
    }
    return false;
  }
}
