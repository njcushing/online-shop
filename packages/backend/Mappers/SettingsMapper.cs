using Cafree.Api.Models;
using Cafree.Api.Dtos;

namespace Cafree.Api.Mappers
{
    public static class SettingsMapper
    {
        public static SettingsDto ToDto(Setting settings)
        {
            return new SettingsDto
            {
                BaseExpressDeliveryCost = settings.BaseExpressDeliveryCost,
                FreeExpressDeliveryThreshold = settings.FreeExpressDeliveryThreshold,
            };
        }
    }
}
