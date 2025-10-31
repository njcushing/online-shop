using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class ProductReview
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }

    public Guid? ProductVariantId { get; set; }

    public string? Title { get; set; }

    public string Description { get; set; } = null!;

    public short Rating { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual ProductVariant? ProductVariant { get; set; }
}
