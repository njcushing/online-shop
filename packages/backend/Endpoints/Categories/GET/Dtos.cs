namespace Cafree.Api.Endpoints.Categories.GET
{
    public class GetCategoriesResponseDto
    {
        public Guid Id { get; set; }

        public Guid? ParentId { get; set; }

        public required string Name { get; set; }

        public required string Slug { get; set; }

        public string? Description { get; set; }
    }
}
