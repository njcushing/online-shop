using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;

namespace Cafree.Api.Endpoints.Products._Slug.GET
{
    [ApiController]
    [Route("api/products/{slug}")]
    public class GetProductBySlugController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GetProductBySlugController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [ProducesResponseType(typeof(GetProductBySlugResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProductBySlug(string slug)
        {
            var product = await _context.Products
                .Include(p => p.ProductVariants)
                .Include(p => p.ProductImages)
                .Include(p => p.ProductCategories)
                    .ThenInclude(pc => pc.Category)
                .Include(p => p.ProductReviews)
                .Include(p => p.ProductDetails)
                .FirstOrDefaultAsync(p => p.Active && p.Slug == slug);


            if (product == null) return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Product not found",
                detail: $"No product with the specified slug '{slug}' could be located."
            );

            return Ok(GetProductBySlugResponseMapper.ToDto(product));
        }
    }
}
