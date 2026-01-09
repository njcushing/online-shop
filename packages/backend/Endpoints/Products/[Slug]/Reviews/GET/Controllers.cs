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

        private const int MaxPageSize = 72;
        private const int MaxSortStringLength = 2000;
        private const int MaxFilterStringLength = 2000;

        private static readonly HashSet<string> AllowedSorts = new()
        {
            "rating_desc", "rating_asc", "created_asc", "created_desc"
        };

        private static readonly HashSet<string> AllowedFilters = new()
        {
            "rating_5", "rating_4", "rating_3", "rating_2", "rating_1"
        };

        [HttpGet]
        [ProducesResponseType(typeof(GetReviewsByProductSlugResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProductBySlugReviews(string slug, [FromQuery] GetReviewsByProductSlugRequestDto query)
        {
            var product = await _context.Products
                .AnyAsync(p => p.Active && p.Slug == slug);

            if (!product) return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Product not found",
                detail: $"No product with the specified slug '{slug}' could be located."
            );

            if (query.Sort?.Length > MaxSortStringLength) query.Sort = query.Sort[..MaxSortStringLength];
            if (query.Filter?.Length > MaxFilterStringLength) query.Filter = query.Filter[..MaxFilterStringLength];
            int page = query.Page < 1 ? 1 : query.Page;
            int pageSize = Math.Clamp(query.PageSize ?? 12, 1, MaxPageSize);

            var reviewQuery = _context.ProductReviews
                .Where(pr => pr.Product.Slug == slug)
                .AsNoTracking();

            var totalCount = await reviewQuery.CountAsync();

            if (!AllowedFilters.Contains(query.Filter ?? "")) query.Filter = "";
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

            if (!AllowedSorts.Contains(query.Sort ?? "")) query.Sort = "created_desc";
            reviewQuery = query.Sort switch
            {
                "rating_desc" => reviewQuery.OrderByDescending(pr => pr.Rating),
                "rating_asc" => reviewQuery.OrderBy(pr => pr.Rating),
                "created_asc" => reviewQuery.OrderBy(pr => pr.CreatedAt),
                "created_desc" or _ => reviewQuery.OrderByDescending(pr => pr.CreatedAt),
            };

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
                                    Code = pva.ProductAttribute.Code,
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
