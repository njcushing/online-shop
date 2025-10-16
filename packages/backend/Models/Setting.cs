using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class Setting
{
    public Guid Id { get; set; }

    public decimal BaseExpressDeliveryCost { get; set; }

    public decimal FreeExpressDeliveryThreshold { get; set; }

    public int LowStockThreshold { get; set; }

    public DateTime UpdatedAt { get; set; }
}
