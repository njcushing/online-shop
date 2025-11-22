using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class CategoryProductAttributeFilter
{
    public Guid CategoryId { get; set; }

    public Guid ProductAttributeId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual ProductAttribute ProductAttribute { get; set; } = null!;
}
