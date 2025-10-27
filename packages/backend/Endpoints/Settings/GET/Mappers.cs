using Cafree.Api.Models;

namespace Cafree.Api.Endpoints.Settings.GET
{
    public static class GetSettingsResponseMapper
    {
        public static GetSettingsResponseDto ToDto(Setting settings)
        {
            return new GetSettingsResponseDto
            {
                BaseExpressDeliveryCost = settings.BaseExpressDeliveryCost,
                FreeExpressDeliveryThreshold = settings.FreeExpressDeliveryThreshold,
                LowStockThreshold = settings.LowStockThreshold,
            };
        }
    }
}
