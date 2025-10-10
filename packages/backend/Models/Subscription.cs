using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class Subscription
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid ProductVariantId { get; set; }

    public Guid SubscriptionStatusTypeId { get; set; }

    public Guid SubscriptionFrequencyId { get; set; }

    public decimal UnitPriceAtSubscription { get; set; }

    public int Quantity { get; set; }

    public DateTime NextExpectedDeliveryDate { get; set; }

    public DateTime? CancelledAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ProductVariant ProductVariant { get; set; } = null!;

    public virtual ICollection<SubscriptionAddress> SubscriptionAddresses { get; set; } = new List<SubscriptionAddress>();

    public virtual SubscriptionFrequency SubscriptionFrequency { get; set; } = null!;

    public virtual SubscriptionStatusType SubscriptionStatusType { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
