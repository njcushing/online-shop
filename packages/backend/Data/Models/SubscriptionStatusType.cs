using System;
using System.Collections.Generic;

namespace Cafree.Api.Data.Models;

public partial class SubscriptionStatusType
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Label { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
