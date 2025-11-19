using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;

namespace Cafree.Api.Endpoints.Categories._Slug.GET
{
    [ApiController]
    [Route("api/categories/{slug}")]
    public class GetCategoryBySlugController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        [HttpGet]
        [ProducesResponseType(typeof(GetCategoryBySlugResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCategoryBySlug(string slug)
        {
            var category = await _context.Categories
                .Where(c => c.Slug == slug)
                .AsNoTracking()
                .AsSplitQuery()
                .Select(c => new GetCategoryBySlugResponseDto
                {
                    Name = c.Name,
                    Slug = c.Slug,
                    Description = c.Description,
                    Subcategories = c.InverseParent.Select(ip => new GetCategoryBySlugResponseDto.Subcategory
                    {
                        Name = ip.Name,
                        Slug = ip.Slug,
                        Description = ip.Description,
                    }).ToList(),
                    ProductCount = c.CategoryProducts.Count(),
                })
                .FirstOrDefaultAsync();

            if (category == null) return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Category not found",
                detail: $"No category with the specified slug '{slug}' could be located."
            );

            return Ok(category);
        }
    }
}
