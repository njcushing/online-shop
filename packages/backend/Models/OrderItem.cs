using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class OrderItem
{
    public Guid Id { get; set; }

    public Guid OrderId { get; set; }

    public Guid ProductVariantId { get; set; }

    public decimal UnitPriceBase { get; set; }

    public decimal UnitPricePaid { get; set; }

    public int Quantity { get; set; }

    public Guid? SubscriptionFrequencyId { get; set; }

    public decimal? SubscriptionDiscount { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual ProductVariant ProductVariant { get; set; } = null!;

    public virtual SubscriptionFrequency? SubscriptionFrequency { get; set; }
}
