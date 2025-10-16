using System;
using System.Collections.Generic;
using Cafree.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Cafree.Api.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AddressType> AddressTypes { get; set; }

    public virtual DbSet<Cart> Carts { get; set; }

    public virtual DbSet<CartItem> CartItems { get; set; }

    public virtual DbSet<CartPromotion> CartPromotions { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Collection> Collections { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderAddress> OrderAddresses { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<OrderStatusType> OrderStatusTypes { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductCategory> ProductCategories { get; set; }

    public virtual DbSet<ProductCollection> ProductCollections { get; set; }

    public virtual DbSet<ProductReview> ProductReviews { get; set; }

    public virtual DbSet<ProductVariant> ProductVariants { get; set; }

    public virtual DbSet<Promotion> Promotions { get; set; }

    public virtual DbSet<PromotionType> PromotionTypes { get; set; }

    public virtual DbSet<SchemaMigration> SchemaMigrations { get; set; }

    public virtual DbSet<Setting> Settings { get; set; }

    public virtual DbSet<Subscription> Subscriptions { get; set; }

    public virtual DbSet<SubscriptionAddress> SubscriptionAddresses { get; set; }

    public virtual DbSet<SubscriptionFrequency> SubscriptionFrequencies { get; set; }

    public virtual DbSet<SubscriptionStatusType> SubscriptionStatusTypes { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserAddress> UserAddresses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("uuid-ossp");

        modelBuilder.Entity<AddressType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("address_types_pkey");

            entity.ToTable("address_types");

            entity.HasIndex(e => e.Name, "address_types_name_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("carts_pkey");

            entity.ToTable("carts");

            entity.HasIndex(e => e.Token, "carts_token_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Token)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("token");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("cart_items_pkey");

            entity.ToTable("cart_items");

            entity.HasIndex(e => e.CartId, "idx_cart_items_cart_id");

            entity.HasIndex(e => e.ProductVariantId, "idx_cart_items_product_variant_id");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.CartId).HasColumnName("cart_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.ProductVariantId).HasColumnName("product_variant_id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.Cart).WithMany(p => p.CartItems)
                .HasForeignKey(d => d.CartId)
                .HasConstraintName("cart_items_cart_id_fkey");

            entity.HasOne(d => d.ProductVariant).WithMany(p => p.CartItems)
                .HasForeignKey(d => d.ProductVariantId)
                .HasConstraintName("cart_items_product_variant_id_fkey");
        });

        modelBuilder.Entity<CartPromotion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("cart_promotions_pkey");

            entity.ToTable("cart_promotions");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.CartId).HasColumnName("cart_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.DiscountValue)
                .HasPrecision(10, 2)
                .HasColumnName("discount_value");
            entity.Property(e => e.PromotionId).HasColumnName("promotion_id");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.Cart).WithMany(p => p.CartPromotions)
                .HasForeignKey(d => d.CartId)
                .HasConstraintName("cart_promotions_cart_id_fkey");

            entity.HasOne(d => d.Promotion).WithMany(p => p.CartPromotions)
                .HasForeignKey(d => d.PromotionId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("cart_promotions_promotion_id_fkey");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("categories_pkey");

            entity.ToTable("categories");

            entity.HasIndex(e => new { e.ParentId, e.Name }, "categories_parent_id_name_key").IsUnique();

            entity.HasIndex(e => e.Slug, "categories_slug_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.ParentId).HasColumnName("parent_id");
            entity.Property(e => e.Slug).HasColumnName("slug");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("categories_parent_id_fkey");
        });

        modelBuilder.Entity<Collection>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("collections_pkey");

            entity.ToTable("collections");

            entity.HasIndex(e => e.Name, "collections_name_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("orders_pkey");

            entity.ToTable("orders");

            entity.HasIndex(e => e.OrderNo, "orders_order_no_key").IsUnique();

            entity.HasIndex(e => e.TrackingNo, "orders_tracking_no_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.DeliveredDate).HasColumnName("delivered_date");
            entity.Property(e => e.ExpectedDate).HasColumnName("expected_date");
            entity.Property(e => e.OrderNo).HasColumnName("order_no");
            entity.Property(e => e.OrderStatusTypeId).HasColumnName("order_status_type_id");
            entity.Property(e => e.SubscriptionId).HasColumnName("subscription_id");
            entity.Property(e => e.Total)
                .HasPrecision(10, 2)
                .HasColumnName("total");
            entity.Property(e => e.TrackingNo).HasColumnName("tracking_no");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.OrderStatusType).WithMany(p => p.Orders)
                .HasForeignKey(d => d.OrderStatusTypeId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("orders_order_status_type_id_fkey");

            entity.HasOne(d => d.Subscription).WithMany(p => p.Orders)
                .HasForeignKey(d => d.SubscriptionId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("orders_subscription_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("orders_user_id_fkey");
        });

        modelBuilder.Entity<OrderAddress>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("order_addresses_pkey");

            entity.ToTable("order_addresses");

            entity.HasIndex(e => new { e.OrderId, e.AddressTypeId }, "order_addresses_order_id_address_type_id_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.AddressTypeId).HasColumnName("address_type_id");
            entity.Property(e => e.County).HasColumnName("county");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Line1).HasColumnName("line1");
            entity.Property(e => e.Line2).HasColumnName("line2");
            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.Postcode).HasColumnName("postcode");
            entity.Property(e => e.TownCity).HasColumnName("town_city");

            entity.HasOne(d => d.AddressType).WithMany(p => p.OrderAddresses)
                .HasForeignKey(d => d.AddressTypeId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("order_addresses_address_type_id_fkey");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderAddresses)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("order_addresses_order_id_fkey");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("order_items_pkey");

            entity.ToTable("order_items");

            entity.HasIndex(e => e.OrderId, "idx_order_items_order_id");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.ProductVariantId).HasColumnName("product_variant_id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.SubscriptionDiscount)
                .HasPrecision(10, 2)
                .HasColumnName("subscription_discount");
            entity.Property(e => e.SubscriptionFrequencyId).HasColumnName("subscription_frequency_id");
            entity.Property(e => e.UnitPriceBase)
                .HasPrecision(10, 2)
                .HasColumnName("unit_price_base");
            entity.Property(e => e.UnitPricePaid)
                .HasPrecision(10, 2)
                .HasColumnName("unit_price_paid");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("order_items_order_id_fkey");

            entity.HasOne(d => d.ProductVariant).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.ProductVariantId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("order_items_product_variant_id_fkey");

            entity.HasOne(d => d.SubscriptionFrequency).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.SubscriptionFrequencyId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("order_items_subscription_frequency_id_fkey");
        });

        modelBuilder.Entity<OrderStatusType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("order_status_types_pkey");

            entity.ToTable("order_status_types");

            entity.HasIndex(e => e.Name, "order_status_types_name_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Label).HasColumnName("label");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("products_pkey");

            entity.ToTable("products");

            entity.HasIndex(e => e.Slug, "products_slug_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.Allowance)
                .HasDefaultValue(0)
                .HasColumnName("allowance");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.ReleaseDate)
                .HasDefaultValueSql("now()")
                .HasColumnName("release_date");
            entity.Property(e => e.Slug).HasColumnName("slug");
            entity.Property(e => e.Tags)
                .HasDefaultValueSql("'{}'::text[]")
                .HasColumnName("tags");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<ProductCategory>(entity =>
        {
            entity.HasKey(e => new { e.ProductId, e.CategoryId }).HasName("product_categories_pkey");

            entity.ToTable("product_categories");

            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.Category).WithMany(p => p.ProductCategories)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("product_categories_category_id_fkey");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductCategories)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("product_categories_product_id_fkey");
        });

        modelBuilder.Entity<ProductCollection>(entity =>
        {
            entity.HasKey(e => new { e.CollectionId, e.ProductId }).HasName("product_collections_pkey");

            entity.ToTable("product_collections");

            entity.Property(e => e.CollectionId).HasColumnName("collection_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.Collection).WithMany(p => p.ProductCollections)
                .HasForeignKey(d => d.CollectionId)
                .HasConstraintName("product_collections_collection_id_fkey");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductCollections)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("product_collections_product_id_fkey");
        });

        modelBuilder.Entity<ProductReview>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("product_reviews_pkey");

            entity.ToTable("product_reviews");

            entity.HasIndex(e => e.ProductId, "idx_product_reviews_product_id");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductReviews)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("product_reviews_product_id_fkey");
        });

        modelBuilder.Entity<ProductVariant>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("product_variants_pkey");

            entity.ToTable("product_variants");

            entity.HasIndex(e => e.Sku, "product_variants_sku_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.AllowanceOverride).HasColumnName("allowance_override");
            entity.Property(e => e.CanSubscribe)
                .HasDefaultValue(false)
                .HasColumnName("can_subscribe");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.PriceBase)
                .HasPrecision(10, 2)
                .HasColumnName("price_base");
            entity.Property(e => e.PriceCurrent)
                .HasPrecision(10, 2)
                .HasColumnName("price_current");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.ReleaseDate)
                .HasDefaultValueSql("now()")
                .HasColumnName("release_date");
            entity.Property(e => e.Sku).HasColumnName("sku");
            entity.Property(e => e.Stock)
                .HasDefaultValue(0)
                .HasColumnName("stock");
            entity.Property(e => e.SubscriptionDiscountPercentage)
                .HasDefaultValue(0)
                .HasColumnName("subscription_discount_percentage");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductVariants)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("product_variants_product_id_fkey");
        });

        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("promotions_pkey");

            entity.ToTable("promotions");

            entity.HasIndex(e => e.Code, "promotions_code_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.Active).HasColumnName("active");
            entity.Property(e => e.Code).HasColumnName("code");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.DiscountValue)
                .HasPrecision(10, 4)
                .HasColumnName("discount_value");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.PromotionTypeId).HasColumnName("promotion_type_id");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.ThresholdValue)
                .HasPrecision(10, 2)
                .HasColumnName("threshold_value");
            entity.Property(e => e.TimesUsed)
                .HasDefaultValue(0)
                .HasColumnName("times_used");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.UsageLimit).HasColumnName("usage_limit");

            entity.HasOne(d => d.PromotionType).WithMany(p => p.Promotions)
                .HasForeignKey(d => d.PromotionTypeId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("promotions_promotion_type_id_fkey");
        });

        modelBuilder.Entity<PromotionType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("promotion_types_pkey");

            entity.ToTable("promotion_types");

            entity.HasIndex(e => e.Name, "promotion_types_name_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<SchemaMigration>(entity =>
        {
            entity.HasKey(e => e.Version).HasName("schema_migrations_pkey");

            entity.ToTable("schema_migrations");

            entity.Property(e => e.Version)
                .HasColumnType("character varying")
                .HasColumnName("version");
        });

        modelBuilder.Entity<Setting>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("settings_pkey");

            entity.ToTable("settings");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.BaseExpressDeliveryCost)
                .HasPrecision(10, 2)
                .HasColumnName("base_express_delivery_cost");
            entity.Property(e => e.FreeExpressDeliveryThreshold)
                .HasPrecision(10, 2)
                .HasColumnName("free_express_delivery_threshold");
            entity.Property(e => e.LowStockThreshold).HasColumnName("low_stock_threshold");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("subscriptions_pkey");

            entity.ToTable("subscriptions");

            entity.HasIndex(e => new { e.UserId, e.ProductVariantId }, "subscriptions_user_id_product_variant_id_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.CancelledAt).HasColumnName("cancelled_at");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.NextExpectedDeliveryDate).HasColumnName("next_expected_delivery_date");
            entity.Property(e => e.ProductVariantId).HasColumnName("product_variant_id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.SubscriptionFrequencyId).HasColumnName("subscription_frequency_id");
            entity.Property(e => e.SubscriptionStatusTypeId).HasColumnName("subscription_status_type_id");
            entity.Property(e => e.UnitPriceAtSubscription)
                .HasPrecision(10, 2)
                .HasColumnName("unit_price_at_subscription");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.ProductVariant).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.ProductVariantId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("subscriptions_product_variant_id_fkey");

            entity.HasOne(d => d.SubscriptionFrequency).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.SubscriptionFrequencyId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("subscriptions_subscription_frequency_id_fkey");

            entity.HasOne(d => d.SubscriptionStatusType).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.SubscriptionStatusTypeId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("subscriptions_subscription_status_type_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("subscriptions_user_id_fkey");
        });

        modelBuilder.Entity<SubscriptionAddress>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("subscription_addresses_pkey");

            entity.ToTable("subscription_addresses");

            entity.HasIndex(e => new { e.SubscriptionId, e.AddressTypeId }, "subscription_addresses_subscription_id_address_type_id_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.AddressTypeId).HasColumnName("address_type_id");
            entity.Property(e => e.County).HasColumnName("county");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Line1).HasColumnName("line1");
            entity.Property(e => e.Line2).HasColumnName("line2");
            entity.Property(e => e.Postcode).HasColumnName("postcode");
            entity.Property(e => e.SubscriptionId).HasColumnName("subscription_id");
            entity.Property(e => e.TownCity).HasColumnName("town_city");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.AddressType).WithMany(p => p.SubscriptionAddresses)
                .HasForeignKey(d => d.AddressTypeId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("subscription_addresses_address_type_id_fkey");

            entity.HasOne(d => d.Subscription).WithMany(p => p.SubscriptionAddresses)
                .HasForeignKey(d => d.SubscriptionId)
                .HasConstraintName("subscription_addresses_subscription_id_fkey");
        });

        modelBuilder.Entity<SubscriptionFrequency>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("subscription_frequencies_pkey");

            entity.ToTable("subscription_frequencies");

            entity.HasIndex(e => e.Code, "subscription_frequencies_code_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.Code).HasColumnName("code");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Label).HasColumnName("label");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<SubscriptionStatusType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("subscription_status_types_pkey");

            entity.ToTable("subscription_status_types");

            entity.HasIndex(e => e.Name, "subscription_status_types_name_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Label).HasColumnName("label");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "users_email_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.Admin)
                .HasDefaultValue(false)
                .HasColumnName("admin");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.DeletedAt).HasColumnName("deleted_at");
            entity.Property(e => e.Disabled)
                .HasDefaultValue(false)
                .HasColumnName("disabled");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.EmailVerified)
                .HasDefaultValue(false)
                .HasColumnName("email_verified");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(60)
                .HasColumnName("password_hash");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<UserAddress>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("user_addresses_pkey");

            entity.ToTable("user_addresses");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("uuid_generate_v4()")
                .HasColumnName("id");
            entity.Property(e => e.AddressTypeId).HasColumnName("address_type_id");
            entity.Property(e => e.County).HasColumnName("county");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Line1).HasColumnName("line1");
            entity.Property(e => e.Line2).HasColumnName("line2");
            entity.Property(e => e.Postcode).HasColumnName("postcode");
            entity.Property(e => e.TownCity).HasColumnName("town_city");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.AddressType).WithMany(p => p.UserAddresses)
                .HasForeignKey(d => d.AddressTypeId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("user_addresses_address_type_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.UserAddresses)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("user_addresses_user_id_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
