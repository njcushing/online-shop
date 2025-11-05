using System;
using System.Collections.Generic;

namespace Cafree.Api.Models;

public partial class ProductVariant
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }

    public string Name { get; set; } = null!;

    public string Sku { get; set; } = null!;

    public bool? CanSubscribe { get; set; }

    public decimal PriceCurrent { get; set; }

    public decimal PriceBase { get; set; }

    public decimal? SubscriptionDiscountPercentage { get; set; }

    public int Stock { get; set; }

    public int? AllowanceOverride { get; set; }

    public bool Active { get; set; }

    public DateTime ReleaseDate { get; set; }

    public string? AttributeHash { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual Product Product { get; set; } = null!;

    public virtual ICollection<ProductReview> ProductReviews { get; set; } = new List<ProductReview>();

    public virtual ICollection<ProductVariantAttribute> ProductVariantAttributes { get; set; } = new List<ProductVariantAttribute>();

    public virtual ICollection<ProductVariantDetail> ProductVariantDetails { get; set; } = new List<ProductVariantDetail>();

    public virtual ICollection<ProductVariantImage> ProductVariantImages { get; set; } = new List<ProductVariantImage>();

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
