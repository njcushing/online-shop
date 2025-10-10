using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class CartPromotion
{
    public Guid Id { get; set; }

    public Guid CartId { get; set; }

    public Guid PromotionId { get; set; }

    public decimal DiscountValue { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Cart Cart { get; set; } = null!;

    public virtual Promotion Promotion { get; set; } = null!;
}
