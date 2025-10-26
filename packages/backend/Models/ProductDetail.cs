using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class ProductDetail
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }

    public string Name { get; set; } = null!;

    public string Value { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Product Product { get; set; } = null!;
}
