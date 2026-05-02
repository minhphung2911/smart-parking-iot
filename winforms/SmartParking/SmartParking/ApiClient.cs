using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SmartParking
{
    public class ApiClient
    {
        private readonly HttpClient _httpClient;
        private const string API_BASE_URL = "http://localhost:3000/api";

        public ApiClient()
        {
            _httpClient = new HttpClient();
            _httpClient.Timeout = TimeSpan.FromSeconds(10);
        }

        // ==================== PARKING API ====================

        public async Task<string> ParkingEntryAsync(string plateNumber, string vehicleType, string slotId)
        {
            string json = $"{{\"plateNumber\":\"{plateNumber}\",\"vehicleType\":\"{vehicleType}\",\"slotId\":\"{slotId}\"}}";
            return await PostAsync("/parking/entry", json);
        }

        public async Task<string> ParkingExitAsync(string plateNumber)
        {
            string json = $"{{\"plateNumber\":\"{plateNumber}\"}}";
            return await PostAsync("/parking/exit", json);
        }

        // ==================== SLOTS API ====================

        public async Task<string> GetSlotsAsync()
        {
            return await GetAsync("/slots");
        }

        // ==================== IOT API ====================

        public async Task<string> SendSensorUpdateAsync(int[] slotStatuses)
        {
            string arr = string.Join(",", slotStatuses);
            string json = $"{{\"slotStatuses\":[{arr}]}}";
            return await PostAsync("/iot/sensor-update", json);
        }

        public async Task<string> SendEntryDetectedAsync()
        {
            string json = $"{{\"timestamp\":\"{DateTime.UtcNow:O}\"}}";
            return await PostAsync("/iot/entry-detected", json);
        }

        public async Task<string> SendExitDetectedAsync()
        {
            string json = $"{{\"timestamp\":\"{DateTime.UtcNow:O}\"}}";
            return await PostAsync("/iot/exit-detected", json);
        }

        public async Task<string> SendGateCommandAsync(string command)
        {
            string json = $"{{\"command\":\"{command}\"}}";
            return await PostAsync("/iot/gate-command", json);
        }

        public async Task<string> GetLcdStatusAsync()
        {
            return await GetAsync("/iot/lcd-status");
        }

        // ==================== HELPER METHODS ====================

        private async Task<string> GetAsync(string endpoint)
        {
            try
            {
                var response = await _httpClient.GetAsync(API_BASE_URL + endpoint);
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                return $"{{\"error\":\"{ex.Message}\"}}";
            }
        }

        private async Task<string> PostAsync(string endpoint, string json)
        {
            try
            {
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(API_BASE_URL + endpoint, content);
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                return $"{{\"error\":\"{ex.Message}\"}}";
            }
        }
    }
}
