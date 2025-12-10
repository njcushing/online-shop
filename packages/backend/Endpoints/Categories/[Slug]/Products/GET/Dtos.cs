using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace Cafree.Api.Endpoints.Categories._Slug.Products.GET
{
    public class GetCategoryBySlugProductsRequestDto
    {
        [FromQuery(Name = "filter")]
        public string? Filter { get; set; }

        [FromQuery(Name = "sort")]
        public string? Sort { get; set; }

        [FromQuery(Name = "page")]
        public required int Page { get; set; }

        [FromQuery(Name = "pageSize")]
        public int? PageSize { get; set; }
    }

    public class GetCategoryBySlugProductsResponseDto
    {
        public class Product
        {
            public class ProductRating
            {
                public class RatingQuantities
                {
                    [JsonPropertyName("5")] public int Rating5 { get; set; }

                    [JsonPropertyName("4")] public int Rating4 { get; set; }

                    [JsonPropertyName("3")] public int Rating3 { get; set; }

                    [JsonPropertyName("2")] public int Rating2 { get; set; }

                    [JsonPropertyName("1")] public int Rating1 { get; set; }
                }

                [JsonIgnore]
                public Guid ProductId { get; set; }

                public decimal Average { get; set; }

                public int Total { get; set; }

                public RatingQuantities Quantities { get; set; } = new();
            }

            public class AttributeOrder
            {
                public class AttributeValue
                {
                    [JsonIgnore]
                    public Guid Id { get; set; }

                    [JsonIgnore]
                    public Guid ProductAttributeId { get; set; }

                    public int Position { get; set; }

                    public required string Code { get; set; }

                    public required string Name { get; set; }

                    public required string Value { get; set; }
                }

                [JsonIgnore]
                public Guid ProductId { get; set; }

                [JsonIgnore]
                public Guid ProductAttributeId { get; set; }

                public required int Position { get; set; }

                public required string Name { get; set; }

                public required string Title { get; set; }

                public required string Type { get; set; }

                public required virtual ICollection<AttributeValue> Values { get; set; } = new List<AttributeValue>();
            }

            public class Detail
            {
                public Guid Id { get; set; }

                [JsonIgnore]
                public Guid ProductId { get; set; }

                public required string Name { get; set; }

                public required string Value { get; set; }
            }

            public class Image
            {
                public Guid Id { get; set; }

                [JsonIgnore]
                public Guid ProductId { get; set; }

                public required string Src { get; set; }

                public required string Alt { get; set; }

                public required int Position { get; set; }
            }

            public class Variant
            {
                public class Attribute
                {
                    public class AttributeType
                    {
                        public Guid Id { get; set; }

                        public required string Name { get; set; }

                        public required string Title { get; set; }
                    }

                    public class AttributeValue
                    {
                        [JsonIgnore]
                        public Guid ProductAttributeId { get; set; }

                        public required string Code { get; set; }

                        public required string Name { get; set; }

                        public required int Position { get; set; }
                    }

                    [JsonIgnore]
                    public Guid ProductVariantId { get; set; }

                    [JsonIgnore]
                    public Guid ProductAttributeId { get; set; }

                    public required virtual AttributeType Type { get; set; }

                    public required virtual AttributeValue Value { get; set; }
                }

                public class Image
                {
                    public Guid Id { get; set; }

                    [JsonIgnore]
                    public Guid ProductId { get; set; }

                    public required string Src { get; set; }

                    public required string Alt { get; set; }

                    public required int Position { get; set; }
                }

                public Guid Id { get; set; }

                [JsonIgnore]
                public Guid ProductId { get; set; }

                public required string Name { get; set; }

                public required string Sku { get; set; }

                public bool? CanSubscribe { get; set; }

                public required decimal PriceCurrent { get; set; }

                public required decimal PriceBase { get; set; }

                public decimal? SubscriptionDiscountPercentage { get; set; }

                public required int Stock { get; set; }

                public int? AllowanceOverride { get; set; }

                public bool Active { get; set; }

                public DateTime ReleaseDate { get; set; }

                public virtual ICollection<Attribute> Attributes { get; set; } = new List<Attribute>();

                public virtual ICollection<Image> Images { get; set; } = new List<Image>();
            }

            public Guid Id { get; set; }

            public required string Name { get; set; }

            public required string Slug { get; set; }

            public required int Allowance { get; set; }

            public List<string>? Tags { get; set; }

            public DateTime ReleaseDate { get; set; }

            public required ProductRating Rating { get; set; }

            public required virtual ICollection<AttributeOrder> Attributes { get; set; } = new List<AttributeOrder>();

            public required virtual ICollection<Image> Images { get; set; } = new List<Image>();

            public required virtual ICollection<Variant> Variants { get; set; } = new List<Variant>();
        }

        public class ProductPrice
        {
            public required decimal Min { get; set; }

            public required decimal Max { get; set; }
        }

        public required ICollection<Product> Products { get; set; } = new List<Product>();

        public required ProductPrice Price { get; set; }
    }
}
