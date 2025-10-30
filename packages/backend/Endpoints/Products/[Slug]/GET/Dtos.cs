using System.Text.Json.Serialization;

namespace Cafree.Api.Endpoints.Products._Slug.GET
{
    public class GetProductBySlugResponseDto
    {
        public class Collection
        {
            public class Product
            {
                public Guid Id { get; set; }

                public string? Name { get; set; }

                public required string Slug { get; set; }

                public virtual ICollection<Image> Images { get; set; } = new List<Image>();
            }

            public Guid Id { get; set; }

            public required string Name { get; set; }

            public string? Description { get; set; }

            public required string Slug { get; set; }

            public virtual ICollection<Product> Products { get; set; } = new List<Product>();
        }

        public class Category
        {
            [JsonIgnore]
            public Guid ProductId { get; set; }

            [JsonIgnore]
            public Guid CategoryId { get; set; }

            public Guid Id { get; set; }

            public Guid? ParentId { get; set; }

            public required string Name { get; set; }

            public required string Slug { get; set; }

            public string? Description { get; set; }
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

            public int Position { get; set; }
        }

        public class Review
        {
            public Guid Id { get; set; }

            [JsonIgnore]
            public Guid ProductId { get; set; }

            public string? Title { get; set; }

            public required string Description { get; set; }

            public short Rating { get; set; }
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
                }

                [JsonIgnore]
                public Guid ProductVariantId { get; set; }

                [JsonIgnore]
                public Guid ProductAttributeId { get; set; }

                public required virtual AttributeType Type { get; set; }

                public required virtual AttributeValue Value { get; set; }
            }

            public class Detail
            {
                public Guid Id { get; set; }

                [JsonIgnore]
                public Guid ProductVariantId { get; set; }

                public required string Name { get; set; }

                public required string Value { get; set; }
            }

            public Guid Id { get; set; }

            [JsonIgnore]
            public Guid ProductId { get; set; }

            public required string Name { get; set; }

            public required string Sku { get; set; }

            public bool? CanSubscribe { get; set; }

            public decimal PriceCurrent { get; set; }

            public decimal PriceBase { get; set; }

            public decimal? SubscriptionDiscountPercentage { get; set; }

            public int Stock { get; set; }

            public int? AllowanceOverride { get; set; }

            public bool Active { get; set; }

            public DateTime ReleaseDate { get; set; }

            public virtual ICollection<Attribute> Attributes { get; set; } = new List<Attribute>();

            public virtual ICollection<Detail> Details { get; set; } = new List<Detail>();
        }

        public Guid Id { get; set; }

        public required string Name { get; set; }

        public string? Description { get; set; }

        public required string Slug { get; set; }

        public int Allowance { get; set; }

        public List<string>? Tags { get; set; }

        public DateTime ReleaseDate { get; set; }

        public virtual ICollection<Collection> Collections { get; set; } = new List<Collection>();

        public virtual ICollection<Category> Categories { get; set; } = new List<Category>();

        public virtual ICollection<Detail> Details { get; set; } = new List<Detail>();

        public virtual ICollection<Image> Images { get; set; } = new List<Image>();

        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

        public virtual ICollection<Variant> Variants { get; set; } = new List<Variant>();
    }
}
