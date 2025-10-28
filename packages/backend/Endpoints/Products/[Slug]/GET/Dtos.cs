using System.Text.Json.Serialization;

namespace Cafree.Api.Endpoints.Products._Slug.GET
{
    public class GetProductBySlugResponseDto
    {
        public class CollectionProductDto
        {
            public Guid CollectionId { get; set; }

            public Guid ProductId { get; set; }

            public string? Name { get; set; }
        }

        public class ProductCategoryDto
        {
            public class CategoryDto
            {
                public Guid Id { get; set; }

                public Guid? ParentId { get; set; }

                public required string Name { get; set; }

                public required string Slug { get; set; }

                public string? Description { get; set; }
            }

            [JsonIgnore]
            public Guid ProductId { get; set; }

            public Guid CategoryId { get; set; }

            public required virtual CategoryDto Category { get; set; }
        }

        public class ProductDetailDto
        {
            public Guid Id { get; set; }

            [JsonIgnore]
            public Guid ProductId { get; set; }

            public required string Name { get; set; }

            public required string Value { get; set; }
        }

        public class ProductImageDto
        {
            public Guid Id { get; set; }

            [JsonIgnore]
            public Guid ProductId { get; set; }

            public required string Src { get; set; }

            public required string Alt { get; set; }

            public int Position { get; set; }
        }

        public class ProductReviewDto
        {
            public Guid Id { get; set; }

            [JsonIgnore]
            public Guid ProductId { get; set; }

            public string? Title { get; set; }

            public required string Description { get; set; }

            public short Rating { get; set; }
        }

        public class ProductVariantDto
        {
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
        }

        public Guid Id { get; set; }

        public required string Name { get; set; }

        public string? Description { get; set; }

        public required string Slug { get; set; }

        public int Allowance { get; set; }

        public List<string>? Tags { get; set; }

        public DateTime ReleaseDate { get; set; }

        public virtual ICollection<CollectionProductDto> CollectionProducts { get; set; } = new List<CollectionProductDto>();

        public virtual ICollection<ProductCategoryDto> ProductCategories { get; set; } = new List<ProductCategoryDto>();

        public virtual ICollection<ProductDetailDto> ProductDetails { get; set; } = new List<ProductDetailDto>();

        public virtual ICollection<ProductImageDto> ProductImages { get; set; } = new List<ProductImageDto>();

        public virtual ICollection<ProductReviewDto> ProductReviews { get; set; } = new List<ProductReviewDto>();

        public virtual ICollection<ProductVariantDto> ProductVariants { get; set; } = new List<ProductVariantDto>();
    }
}
