using Cafree.Api.Models;

namespace Cafree.Api.Endpoints.Categories.GET
{
    public static class GetCategoriesResponseMapper
    {
        public static GetCategoriesResponseDto ToDto(Models.Category category)
        {
            return new GetCategoriesResponseDto
            {
                Id = category.Id,
                ParentId = category.ParentId,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
            };
        }
    }
}
