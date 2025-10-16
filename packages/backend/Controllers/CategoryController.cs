using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;
using Cafree.Api.Dtos;
using Cafree.Api.Mappers;

namespace Cafree.Api.Controllers
{
    [ApiController]
    [Route("/api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();

            if (categories == null) return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Categories not found",
                detail: "No category records could be located."
            );

            return Ok(categories.Select(CategoryMapper.ToDto));
        }
    }
}
