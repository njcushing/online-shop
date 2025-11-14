using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;

namespace Cafree.Api.Endpoints.Products.Search.GET
{
    [ApiController]
    [Route("api/products/search")]
    public class GetProductsBySearchController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        [HttpGet]
        [ProducesResponseType(typeof(List<GetProductsBySearchResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProductBySlugReviews([FromQuery] GetProductsBySearchRequestDto query)
        {
            var products = await _context.Products
                .AsNoTracking()
                .Where(p =>
                    EF.Functions.ToTsVector("english", p.SearchText ?? "")
                        .Matches(EF.Functions.PlainToTsQuery(query.String))
                    ||
                    EF.Functions.ILike(p.Name, $"%{query.String}%")
                )
                .Select(p => new GetProductsBySearchResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Slug = p.Slug,
                    Allowance = p.Allowance,
                    Tags = p.Tags,
                    ReleaseDate = p.ReleaseDate,
                    Details = p.ProductDetails.Select(pi => new GetProductsBySearchResponseDto.Detail
                    {
                        Id = pi.Id,
                        Name = pi.Name,
                        Value = pi.Value,
                    }).ToList(),
                    Images = p.ProductImages.Select(pi => new GetProductsBySearchResponseDto.Image
                    {
                        Id = pi.Id,
                        Src = pi.Src,
                        Alt = pi.Alt,
                        Position = pi.Position,
                    }).ToList(),
                    Rating = new GetProductsBySearchResponseDto.ProductRating
                    {
                        Average = p.ProductRating!.Average,
                        Total = p.ProductRating.Total,
                        Quantities = new GetProductsBySearchResponseDto.ProductRating.RatingQuantities
                        {
                            Rating5 = p.ProductRating.Rating5,
                            Rating4 = p.ProductRating.Rating4,
                            Rating3 = p.ProductRating.Rating3,
                            Rating2 = p.ProductRating.Rating2,
                            Rating1 = p.ProductRating.Rating1,
                        }
                    },
                    Variants = p.ProductVariants.Select(pv => new GetProductsBySearchResponseDto.Variant
                    {
                        Id = pv.Id,
                        Name = pv.Name,
                        Sku = pv.Sku,
                        CanSubscribe = pv.CanSubscribe,
                        PriceCurrent = pv.PriceCurrent,
                        PriceBase = pv.PriceBase,
                        SubscriptionDiscountPercentage = pv.SubscriptionDiscountPercentage,
                        Stock = pv.Stock,
                        AllowanceOverride = pv.AllowanceOverride,
                        Active = pv.Active,
                        ReleaseDate = pv.ReleaseDate,
                        Attributes = pv.ProductVariantAttributes.Select(pva => new GetProductsBySearchResponseDto.Variant.Attribute
                        {
                            Type = new GetProductsBySearchResponseDto.Variant.Attribute.AttributeType
                            {
                                Id = pva.ProductAttribute.Id,
                                Name = pva.ProductAttribute.Name,
                                Title = pva.ProductAttribute.Title,
                            },
                            Value = new GetProductsBySearchResponseDto.Variant.Attribute.AttributeValue
                            {
                                Code = pva.ProductAttributeValue.Code,
                                Name = pva.ProductAttributeValue.Name,
                                Position = pva.ProductAttributeValue.Position,
                            },
                        }).ToList(),
                        Images = pv.ProductVariantImages.Select(pvi => new GetProductsBySearchResponseDto.Variant.Image
                        {
                            Id = pvi.Id,
                            Src = pvi.Src,
                            Alt = pvi.Alt,
                            Position = pvi.Position,
                        }).ToList(),
                    }).ToList(),
                    Score = EF.Functions.ToTsVector("english", p.SearchText ?? "")
                        .Rank(EF.Functions.PlainToTsQuery(query.String))
                })
                .OrderByDescending(p => p.Score)
                .ThenBy(p => p.Name)
                .Take(10)
                .ToListAsync();

            if (products.Count == 0) return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Products not found",
                detail: $"No products could be located using the search string '{query.String}'."
            );

            return Ok(products);
        }
    }
}
