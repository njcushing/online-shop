using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class Promotion
{
    public Guid Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public Guid PromotionTypeId { get; set; }

    public decimal DiscountValue { get; set; }

    public decimal ThresholdValue { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool Active { get; set; }

    public int? UsageLimit { get; set; }

    public int TimesUsed { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<CartPromotion> CartPromotions { get; set; } = new List<CartPromotion>();

    public virtual PromotionType PromotionType { get; set; } = null!;
}
