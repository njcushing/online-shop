using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class Collection
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string Slug { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<CollectionProduct> CollectionProducts { get; set; } = new List<CollectionProduct>();
}
