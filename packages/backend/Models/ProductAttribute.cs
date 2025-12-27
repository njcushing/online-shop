using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class ProductAttribute
{
    public Guid Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Title { get; set; } = null!;

    public Guid ProductAttributeValueTypeId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<CategoryProductAttributeFilter> CategoryProductAttributeFilters { get; set; } = new List<CategoryProductAttributeFilter>();

    public virtual ICollection<ProductAttributeOrder> ProductAttributeOrders { get; set; } = new List<ProductAttributeOrder>();

    public virtual ProductAttributeValueType ProductAttributeValueType { get; set; } = null!;

    public virtual ICollection<ProductAttributeValue> ProductAttributeValues { get; set; } = new List<ProductAttributeValue>();

    public virtual ICollection<ProductVariantAttribute> ProductVariantAttributes { get; set; } = new List<ProductVariantAttribute>();
}
