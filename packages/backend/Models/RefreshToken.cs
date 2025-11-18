using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class RefreshToken
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public string Token { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime? RevokedAt { get; set; }

    public string? ReplacedBy { get; set; }

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual User? User { get; set; }
}
