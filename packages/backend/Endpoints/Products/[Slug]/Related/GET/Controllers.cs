using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;

namespace Cafree.Api.Endpoints.Products._Slug.Related.GET
{
    [ApiController]
    [Route("api/products/{slug}/related")]
    public class GetRelatedProductsBySlugController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        [HttpGet]
        [ProducesResponseType(typeof(List<GetRelatedProductsBySlugResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProductBySlugReviews(string slug)
        {
            var product = await _context.Products
                .Include(p => p.CategoryProducts)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Slug == slug && p.Active);

            if (product == null) return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Product not found",
                detail: $"No product with the specified slug '{slug}' could be located."
            );

            var categoryIds = product.CategoryProducts.Select(c => c.CategoryId).ToList();
            var productTags = product.Tags ?? [];

            var relatedProducts = await _context.Products
                .Where(p => p.Active && p.Slug != slug)
                .Select(p => new GetRelatedProductsBySlugResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Slug = p.Slug,
                    Allowance = p.Allowance,
                    Tags = p.Tags,
                    ReleaseDate = p.ReleaseDate,
                    Attributes = p.ProductAttributeOrders.Select(pao => new GetRelatedProductsBySlugResponseDto.AttributeOrder
                    {
                        Position = pao.Position,
                        Code = pao.ProductAttribute.Code,
                        Name = pao.ProductAttribute.Name,
                        Title = pao.ProductAttribute.Title,
                        Type = pao.ProductAttribute.ProductAttributeValueType.Name,
                        Values = pao.ProductAttribute.ProductAttributeValues
                            .Where(pav =>
                                pav.ProductVariantAttributes.Any(
                                    pva => pva.ProductVariant.Active && pva.ProductId == p.Id
                                )
                            )
                            .GroupBy(pav => new
                            {
                                pav.Id,
                                pav.Code,
                                pav.Name,
                                pav.Position,
                                pav.ValueText,
                                pav.ValueNumeric,
                                pav.ValueBoolean,
                                pav.ValueColor,
                                pav.ValueDate,
                                pav.ValueSelect
                            })
                            .Select(g => new GetRelatedProductsBySlugResponseDto.AttributeOrder.AttributeValue
                            {
                                Position = g.Key.Position,
                                Code = g.Key.Code,
                                Name = g.Key.Name,
                                Value =
                                    (g.Key.ValueText != null ? g.Key.ValueText : null) ??
                                    (g.Key.ValueNumeric != null ? g.Key.ValueNumeric.ToString() : null) ??
                                    (g.Key.ValueBoolean != null ? g.Key.ValueBoolean.ToString() : null) ??
                                    (g.Key.ValueColor != null ? g.Key.ValueColor : null) ??
                                    (g.Key.ValueDate != null ? g.Key.ValueDate.ToString() : null) ??
                                    (g.Key.ValueSelect != null ? g.Key.ValueSelect : null) ??
                                    ""
                            })
                            .OrderBy(v => v.Position)
                            .ToList()
                    })
                    .OrderBy(pao => pao.Position)
                    .ToList(),
                    Details = p.ProductDetails.Select(pi => new GetRelatedProductsBySlugResponseDto.Detail
                    {
                        Id = pi.Id,
                        Name = pi.Name,
                        Value = pi.Value,
                    }).ToList(),
                    Images = p.ProductImages.Select(pi => new GetRelatedProductsBySlugResponseDto.Image
                    {
                        Id = pi.Id,
                        Src = pi.Src,
                        Alt = pi.Alt,
                        Position = pi.Position,
                    })
                    .OrderBy(pi => pi.Position)
                    .ToList(),
                    Rating = new GetRelatedProductsBySlugResponseDto.ProductRating
                    {
                        Average = p.ProductRating!.Average,
                        Total = p.ProductRating.Total,
                        Quantities = new GetRelatedProductsBySlugResponseDto.ProductRating.RatingQuantities
                        {
                            Rating5 = p.ProductRating.Rating5,
                            Rating4 = p.ProductRating.Rating4,
                            Rating3 = p.ProductRating.Rating3,
                            Rating2 = p.ProductRating.Rating2,
                            Rating1 = p.ProductRating.Rating1,
                        }
                    },
                    Variants = p.ProductVariants.Where(pv => pv.Active).Select(pv => new GetRelatedProductsBySlugResponseDto.Variant
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
                        Attributes = pv.ProductVariantAttributes.Select(pva => new GetRelatedProductsBySlugResponseDto.Variant.Attribute
                        {
                            Type = new GetRelatedProductsBySlugResponseDto.Variant.Attribute.AttributeType
                            {
                                Id = pva.ProductAttribute.Id,
                                Code = pva.ProductAttribute.Code,
                                Name = pva.ProductAttribute.Name,
                                Title = pva.ProductAttribute.Title,
                            },
                            Value = new GetRelatedProductsBySlugResponseDto.Variant.Attribute.AttributeValue
                            {
                                Code = pva.ProductAttributeValue.Code,
                                Name = pva.ProductAttributeValue.Name,
                                Position = pva.ProductAttributeValue.Position,
                            },
                        }).ToList(),
                        Images = pv.ProductVariantImages.Select(pvi => new GetRelatedProductsBySlugResponseDto.Variant.Image
                        {
                            Id = pvi.Id,
                            Src = pvi.Src,
                            Alt = pvi.Alt,
                            Position = pvi.Position,
                        })
                        .OrderBy(pvi => pvi.Position)
                        .ToList(),
                    }).ToList(),
                    Score =
                        5 * p.CategoryProducts.Count(c => categoryIds.Contains(c.CategoryId)) +
                        3 * (p.Tags != null ? p.Tags.Count(tag => productTags.Contains(tag)) : 0) +
                        EF.Functions.ToTsVector("english", p.SearchText ?? "")
                            .Rank(EF.Functions.PlainToTsQuery(product.Name))
                })
                .OrderByDescending(p => p.Score)
                .ThenBy(p => p.Name)
                .Take(10)
                .AsNoTracking()
                .ToListAsync();

            return Ok(relatedProducts);
        }
    }
}
