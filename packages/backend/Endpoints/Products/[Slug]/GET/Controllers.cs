using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;

namespace Cafree.Api.Endpoints.Products._Slug.GET
{
    [ApiController]
    [Route("api/products/{slug}")]
    public class GetProductBySlugController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        [HttpGet]
        [ProducesResponseType(typeof(GetProductBySlugResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProductBySlug(string slug)
        {
            var product = await _context.Products
                .Include(p => p.CollectionProducts)
                    .ThenInclude(cp => cp.Collection)
                        .ThenInclude(c => c.CollectionProducts)
                            .ThenInclude(cp => cp.Product)
                .Include(p => p.ProductVariants.Where(pv => pv.Active))
                    .ThenInclude(pv => pv.ProductVariantAttributes)
                        .ThenInclude(pva => pva.ProductAttribute)
                .Include(p => p.ProductVariants.Where(pv => pv.Active))
                    .ThenInclude(pv => pv.ProductVariantAttributes)
                        .ThenInclude(pva => pva.ProductAttributeValue)
                .Include(p => p.ProductVariants.Where(pv => pv.Active))
                    .ThenInclude(pv => pv.ProductVariantDetails)
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

            var rating = new GetProductBySlugResponseDto.ProductRating
            {
                Average = product.ProductReviews.Average(r => r.Rating),
                Total = product.ProductReviews.Count,
                Quantities = new GetProductBySlugResponseDto.ProductRating.RatingQuantities
                {
                    Five = product.ProductReviews.Count(r => r.Rating == 5),
                    Four = product.ProductReviews.Count(r => r.Rating == 4),
                    Three = product.ProductReviews.Count(r => r.Rating == 3),
                    Two = product.ProductReviews.Count(r => r.Rating == 2),
                    One = product.ProductReviews.Count(r => r.Rating == 1),
                }
            };

            return Ok(GetProductBySlugResponseMapper.ToDto(product, rating));
        }
    }
}
