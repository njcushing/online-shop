using System;
using System.Collections.Generic;

namespace Cafree.Api.Data.Models;

public partial class SubscriptionAddress
{
    public Guid Id { get; set; }

    public Guid SubscriptionId { get; set; }

    public Guid AddressTypeId { get; set; }

    public string Line1 { get; set; } = null!;

    public string? Line2 { get; set; }

    public string TownCity { get; set; } = null!;

    public string? County { get; set; }

    public string Postcode { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual AddressType AddressType { get; set; } = null!;

    public virtual Subscription Subscription { get; set; } = null!;
}
