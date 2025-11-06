using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class CategoryProduct
{
    public Guid CategoryId { get; set; }

    public Guid ProductId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
