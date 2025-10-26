using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class ProductVariantAttribute
{
    public Guid ProductVariantId { get; set; }

    public Guid ProductAttributeId { get; set; }

    public string ProductAttributeValueCode { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ProductAttribute ProductAttribute { get; set; } = null!;

    public virtual ProductAttributeValue ProductAttributeValue { get; set; } = null!;

    public virtual ProductVariant ProductVariant { get; set; } = null!;
}
