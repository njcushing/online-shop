namespace Cafree.Api.Endpoints.Categories.GET
{
    public class GetCategoriesResponseDto
    {
        public Guid Id { get; set; }
        public Guid? ParentId { get; set; }
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string? Description { get; set; }
    }
}
