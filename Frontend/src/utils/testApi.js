// Simple API test to debug connection issues
const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test with fetch instead of axios
    const response = await fetch('http://localhost:9001/api/products');
    console.log('Fetch response status:', response.status);
    
    const data = await response.json();
    console.log('Fetch response data:', data);
    
    return data;
  } catch (error) {
    console.error('API test failed:', error);
    return null;
  }
};

export default testApiConnection;
