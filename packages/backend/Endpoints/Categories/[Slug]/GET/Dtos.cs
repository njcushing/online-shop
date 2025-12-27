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

        public class Filter
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

                public required int Count { get; set; }
            }

            [JsonIgnore]
            public Guid Id { get; set; }

            public required string Code { get; set; }

            public required string Name { get; set; }

            public required string Title { get; set; }

            public required string Type { get; set; }

            public required virtual ICollection<AttributeValue> Values { get; set; } = new List<AttributeValue>();
        }

        [JsonIgnore]
        public Guid Id { get; set; }

        [JsonIgnore]
        public Guid? ParentId { get; set; }

        public required string Name { get; set; }

        public required string Slug { get; set; }

        public string? Description { get; set; }

        public virtual ICollection<Subcategory> Subcategories { get; set; } = new List<Subcategory>();

        public virtual ICollection<Filter> Filters { get; set; } = new List<Filter>();

        public required int ProductCount { get; set; }
    }
}
