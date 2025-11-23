using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class ProductAttributeValue
{
    public Guid Id { get; set; }

    public Guid ProductAttributeId { get; set; }

    public int Position { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? ValueText { get; set; }

    public decimal? ValueNumeric { get; set; }

    public bool? ValueBoolean { get; set; }

    public string? ValueColor { get; set; }

    public DateTime? ValueDate { get; set; }

    public string? ValueSelect { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ProductAttribute ProductAttribute { get; set; } = null!;

    public virtual ICollection<ProductVariantAttribute> ProductVariantAttributes { get; set; } = new List<ProductVariantAttribute>();
}
