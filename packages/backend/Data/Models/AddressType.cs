using System;
using System.Collections.Generic;

namespace Cafree.Api.Data.Models;

public partial class AddressType
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<OrderAddress> OrderAddresses { get; set; } = new List<OrderAddress>();

    public virtual ICollection<SubscriptionAddress> SubscriptionAddresses { get; set; } = new List<SubscriptionAddress>();

    public virtual ICollection<UserAddress> UserAddresses { get; set; } = new List<UserAddress>();
}
