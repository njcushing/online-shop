using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class ProductVariantAttribute
{
    public Guid ProductId { get; set; }

    public Guid ProductVariantId { get; set; }

    public Guid ProductAttributeId { get; set; }

    public Guid ProductAttributeValueId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual ProductAttribute ProductAttribute { get; set; } = null!;

    public virtual ProductAttributeOrder ProductAttributeOrder { get; set; } = null!;

    public virtual ProductAttributeValue ProductAttributeValue { get; set; } = null!;

    public virtual ProductVariant ProductVariant { get; set; } = null!;
}
