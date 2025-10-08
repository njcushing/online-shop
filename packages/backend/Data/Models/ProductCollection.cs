using System;
using System.Collections.Generic;

namespace Cafree.Api.Data.Models;

public partial class ProductCollection
{
    public Guid CollectionId { get; set; }

    public Guid ProductId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Collection Collection { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
