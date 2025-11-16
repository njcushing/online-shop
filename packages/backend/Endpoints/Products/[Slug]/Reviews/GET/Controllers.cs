using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;

namespace Cafree.Api.Endpoints.Products._Slug.Reviews.GET
{
    [ApiController]
    [Route("api/products/{slug}/reviews")]
    public class GetReviewsByProductSlugController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        [HttpGet]
        [ProducesResponseType(typeof(GetReviewsByProductSlugResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProductBySlugReviews(string slug, [FromQuery] GetReviewsByProductSlugRequestDto query)
        {
            query.PageSize ??= 10;

            var product = await _context.Products
                .AnyAsync(p => p.Active && p.Slug == slug);

            if (!product) return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Product not found",
                detail: $"No product with the specified slug '{slug}' could be located."
            );

            var reviewQuery = _context.ProductReviews
                .Where(pr => pr.Product.Slug == slug)
                .AsNoTracking();

            var totalCount = await reviewQuery.CountAsync();

            reviewQuery = query.Filter switch
            {
                "rating_5" => reviewQuery.Where(pr => pr.Rating == 5),
                "rating_4" => reviewQuery.Where(pr => pr.Rating == 4),
                "rating_3" => reviewQuery.Where(pr => pr.Rating == 3),
                "rating_2" => reviewQuery.Where(pr => pr.Rating == 2),
                "rating_1" => reviewQuery.Where(pr => pr.Rating == 1),
                _ => reviewQuery,
            };

            var filteredCount = await reviewQuery.CountAsync();

            reviewQuery = query.Sort switch
            {
                "rating_desc" => reviewQuery.OrderByDescending(pr => pr.Rating),
                "rating_asc" => reviewQuery.OrderBy(pr => pr.Rating),
                "created_asc" => reviewQuery.OrderBy(pr => pr.CreatedAt),
                "created_desc" or _ => reviewQuery.OrderByDescending(pr => pr.CreatedAt),
            };

            int pageSize = query.PageSize ?? 10;

            var reviews = await reviewQuery
                .Skip((query.Page - 1) * pageSize)
                .Take(pageSize)
                .Select(pr => new GetReviewsByProductSlugResponseDto.Review
                {
                    Title = pr.Title,
                    Description = pr.Description,
                    Rating = pr.Rating,
                    CreatedAt = pr.CreatedAt,
                    UpdatedAt = pr.UpdatedAt,
                    Variant = pr.ProductVariant == null
                        ? null
                        : new GetReviewsByProductSlugResponseDto.Review.ProductVariant
                        {
                            Name = pr.ProductVariant.Name,
                            Sku = pr.ProductVariant.Sku,
                            Attributes = pr.ProductVariant.ProductVariantAttributes.Select(pva => new GetReviewsByProductSlugResponseDto.Review.ProductVariant.Attribute
                            {
                                Type = new GetReviewsByProductSlugResponseDto.Review.ProductVariant.Attribute.AttributeType
                                {
                                    Id = pva.ProductAttribute.Id,
                                    Name = pva.ProductAttribute.Name,
                                    Title = pva.ProductAttribute.Title,
                                },
                                Value = new GetReviewsByProductSlugResponseDto.Review.ProductVariant.Attribute.AttributeValue
                                {
                                    Code = pva.ProductAttributeValue.Code,
                                    Name = pva.ProductAttributeValue.Name,
                                    Position = pva.ProductAttributeValue.Position,
                                },
                            }).ToList(),
                        }
                })
                .ToListAsync();

            if (reviews.Count == 0) return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Reviews not found",
                detail: $"No reviews for the product with the specified slug '{slug}' could be located."
            );

            var response = new GetReviewsByProductSlugResponseDto
            {
                Total = totalCount,
                FilteredCount = filteredCount,
                Reviews = reviews,
            };

            return Ok(response);
        }
    }
}
