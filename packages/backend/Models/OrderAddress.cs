using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class OrderAddress
{
    public Guid Id { get; set; }

    public Guid OrderId { get; set; }

    public Guid AddressTypeId { get; set; }

    public string Line1 { get; set; } = null!;

    public string? Line2 { get; set; }

    public string TownCity { get; set; } = null!;

    public string? County { get; set; }

    public string Postcode { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual AddressType AddressType { get; set; } = null!;

    public virtual Order Order { get; set; } = null!;
}
