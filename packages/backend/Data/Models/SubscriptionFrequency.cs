using System;
using System.Collections.Generic;

namespace Cafree.Api.Data.Models;

public partial class SubscriptionFrequency
{
    public Guid Id { get; set; }

    public string Code { get; set; } = null!;

    public string Label { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
