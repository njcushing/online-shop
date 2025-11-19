using System.Text.Json.Serialization;

namespace Cafree.Api.Endpoints.Categories._Slug.GET
{
    public class GetCategoryBySlugResponseDto
    {
        public class Subcategory
        {
            [JsonIgnore]
            public Guid Id { get; set; }

            public string Name { get; set; } = null!;

            public string Slug { get; set; } = null!;

            public string? Description { get; set; }
        }

        [JsonIgnore]
        public Guid Id { get; set; }

        [JsonIgnore]
        public Guid? ParentId { get; set; }

        public required string Name { get; set; }

        public required string Slug { get; set; }

        public string? Description { get; set; }

        public virtual ICollection<Subcategory> Subcategories { get; set; } = new List<Subcategory>();

        public required int ProductCount { get; set; }
    }
}
