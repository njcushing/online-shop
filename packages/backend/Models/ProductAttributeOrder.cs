using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class ProductAttributeOrder
{
    public Guid ProductId { get; set; }

    public Guid ProductAttributeId { get; set; }

    public int Position { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual ProductAttribute ProductAttribute { get; set; } = null!;

    public virtual ICollection<ProductVariantAttribute> ProductVariantAttributes { get; set; } = new List<ProductVariantAttribute>();
}
