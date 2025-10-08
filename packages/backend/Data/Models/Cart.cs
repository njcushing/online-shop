using System;
using System.Collections.Generic;

namespace Cafree.Api.Data.Models;

public partial class Cart
{
    public Guid Id { get; set; }

    public Guid Token { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual ICollection<CartPromotion> CartPromotions { get; set; } = new List<CartPromotion>();
}
