using Cafree.Api.Models;
using Cafree.Api.Dtos;

namespace Cafree.Api.Mappers
{
    public static class CategoryMapper
    {
        public static CategoryDto ToDto(Category category)
        {
            return new CategoryDto
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
