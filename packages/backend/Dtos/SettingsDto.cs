namespace Cafree.Api.Dtos
{
    public class SettingsDto
    {
        public decimal BaseExpressDeliveryCost { get; set; }

        public decimal FreeExpressDeliveryThreshold { get; set; }
        public int LowStockThreshold { get; set; }
    }
}
