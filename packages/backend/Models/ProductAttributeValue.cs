using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class ProductAttributeValue
{
    public Guid ProductAttributeId { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int Position { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ProductAttribute ProductAttribute { get; set; } = null!;

    public virtual ICollection<ProductVariantAttribute> ProductVariantAttributes { get; set; } = new List<ProductVariantAttribute>();
}
