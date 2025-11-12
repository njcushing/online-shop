using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace Cafree.Api.Endpoints.Products._Slug.Reviews.GET
{
    public class GetReviewsByProductSlugRequestDto
    {
        [FromQuery(Name = "page")]
        public required int Page { get; set; }

        [FromQuery(Name = "pageSize")]
        public int? PageSize { get; set; }

        [FromQuery(Name = "sort")]
        public string? Sort { get; set; }

        [FromQuery(Name = "filter")]
        public string? Filter { get; set; }
    }

    public class GetReviewsByProductSlugResponseDto
    {
        public class Review
        {
            public class ProductVariant
            {
                [JsonIgnore]
                public Guid Id { get; set; }

                [JsonIgnore]
                public Guid ProductId { get; set; }

                public required string Name { get; set; }

                public required string Sku { get; set; }
            }

            [JsonIgnore]
            public Guid Id { get; set; }

            [JsonIgnore]
            public Guid ProductId { get; set; }

            [JsonIgnore]
            public Guid? ProductVariantId { get; set; }

            public string? Title { get; set; }

            public required string Description { get; set; }

            public short Rating { get; set; }

            public DateTime CreatedAt { get; set; }

            public DateTime? UpdatedAt { get; set; }

            public virtual ProductVariant? Variant { get; set; }
        }

        public required int Total { get; set; }

        public required int FilteredCount { get; set; }

        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
