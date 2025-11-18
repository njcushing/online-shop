using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class Cart
{
    public Guid Id { get; set; }

    public Guid RefreshTokenId { get; set; }

    public Guid? UserId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual ICollection<CartPromotion> CartPromotions { get; set; } = new List<CartPromotion>();

    public virtual RefreshToken RefreshToken { get; set; } = null!;

    public virtual User? User { get; set; }
}
