using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class ProductVariantImage
{
    public Guid Id { get; set; }

    public Guid ProductVariantId { get; set; }

    public string Src { get; set; } = null!;

    public string Alt { get; set; } = null!;

    public int Position { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ProductVariant ProductVariant { get; set; } = null!;
}
