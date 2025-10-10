using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class User
{
    public Guid Id { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public bool Admin { get; set; }

    public bool EmailVerified { get; set; }

    public bool Disabled { get; set; }

    public DateTime? DeletedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();

    public virtual ICollection<UserAddress> UserAddresses { get; set; } = new List<UserAddress>();
}
