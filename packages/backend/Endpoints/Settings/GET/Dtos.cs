namespace Cafree.Api.Endpoints.Settings.GET
{
    public class GetSettingsResponseDto
    {
        public decimal BaseExpressDeliveryCost { get; set; }

        public decimal FreeExpressDeliveryThreshold { get; set; }
        public int LowStockThreshold { get; set; }
    }
}
