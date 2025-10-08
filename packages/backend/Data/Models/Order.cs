using System;
using System.Collections.Generic;

namespace Cafree.Api.Data.Models;

public partial class Order
{
    public Guid Id { get; set; }

    public string OrderNo { get; set; } = null!;

    public Guid? UserId { get; set; }

    public Guid OrderStatusTypeId { get; set; }

    public decimal Total { get; set; }

    public DateTime? ExpectedDate { get; set; }

    public DateTime? DeliveredDate { get; set; }

    public string? TrackingNo { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Guid? SubscriptionId { get; set; }

    public virtual ICollection<OrderAddress> OrderAddresses { get; set; } = new List<OrderAddress>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual OrderStatusType OrderStatusType { get; set; } = null!;

    public virtual Subscription? Subscription { get; set; }

    public virtual User? User { get; set; }
}
