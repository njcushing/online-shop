using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;

namespace Cafree.Api.Endpoints.Categories.GET
{
    [ApiController]
    [Route("api/categories")]
    public class GetCategoriesController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        [HttpGet]
        [ProducesResponseType(typeof(List<GetCategoriesResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();

            if (categories == null) return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Categories not found",
                detail: "No category records could be located."
            );

            return Ok(categories.Select(GetCategoriesResponseMapper.ToDto));
        }
    }
}
