using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class ProductAttribute
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string Title { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<ProductAttributeOrder> ProductAttributeOrders { get; set; } = new List<ProductAttributeOrder>();

    public virtual ICollection<ProductAttributeValue> ProductAttributeValues { get; set; } = new List<ProductAttributeValue>();

    public virtual ICollection<ProductVariantAttribute> ProductVariantAttributes { get; set; } = new List<ProductVariantAttribute>();
}
