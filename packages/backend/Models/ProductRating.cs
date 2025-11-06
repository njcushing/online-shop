using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class ProductRating
{
    public Guid ProductId { get; set; }

    public decimal Average { get; set; }

    public int Total { get; set; }

    public int Rating5 { get; set; }

    public int Rating4 { get; set; }

    public int Rating3 { get; set; }

    public int Rating2 { get; set; }

    public int Rating1 { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Product Product { get; set; } = null!;
}
