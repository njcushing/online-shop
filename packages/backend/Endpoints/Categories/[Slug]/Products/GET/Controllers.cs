using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;

namespace Cafree.Api.Endpoints.Categories._Slug.Products.GET
{
    [ApiController]
    [Route("api/categories/{slug}/products")]
    public class GetCategoryBySlugProductsController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        [HttpGet]
        [ProducesResponseType(typeof(GetCategoryBySlugProductsResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCategoryBySlugProducts(string slug, [FromQuery] GetCategoryBySlugProductsRequestDto query)
        {
            var category = await _context.Categories
                .Where(c => c.Slug == slug)
                .AsNoTracking()
                .AsSplitQuery()
                .FirstOrDefaultAsync();

            if (category == null) return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Category not found",
                detail: $"No category with the specified slug '{slug}' could be located."
            );

            var productQuery = _context.CategoryProducts
                .Where(cp => cp.CategoryId == category.Id)
                .AsNoTracking();

            int pageSize = query.PageSize ?? 10;

            var products = await productQuery
                .Skip((query.Page - 1) * pageSize)
                .Take(pageSize)
                .Select(cp => new GetCategoryBySlugProductsResponseDto.Product
                {
                    Id = cp.Product.Id,
                    Name = cp.Product.Name,
                    Slug = cp.Product.Slug,
                    Allowance = cp.Product.Allowance,
                    Tags = cp.Product.Tags,
                    ReleaseDate = cp.Product.ReleaseDate,
                    Rating = new GetCategoryBySlugProductsResponseDto.Product.ProductRating
                    {
                        Average = cp.Product.ProductRating!.Average,
                        Total = cp.Product.ProductRating.Total,
                        Quantities = new GetCategoryBySlugProductsResponseDto.Product.ProductRating.RatingQuantities
                        {
                            Rating5 = cp.Product.ProductRating.Rating5,
                            Rating4 = cp.Product.ProductRating.Rating4,
                            Rating3 = cp.Product.ProductRating.Rating3,
                            Rating2 = cp.Product.ProductRating.Rating2,
                            Rating1 = cp.Product.ProductRating.Rating1,
                        }
                    },
                    Attributes = cp.Product.ProductAttributeOrders.Select(pao => new GetCategoryBySlugProductsResponseDto.Product.AttributeOrder
                    {
                        Position = pao.Position,
                        Name = pao.ProductAttribute.Name,
                        Title = pao.ProductAttribute.Title,
                        Type = pao.ProductAttribute.ProductAttributeValueType.Name,
                        Values = pao.ProductAttribute.ProductAttributeValues
                            .Where(pav =>
                                pav.ProductVariantAttributes.Any(pva => pva.ProductId == cp.Product.Id)
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
                            .Select(g => new GetCategoryBySlugProductsResponseDto.Product.AttributeOrder.AttributeValue
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
                    }).ToList(),
                    Images = cp.Product.ProductImages.Select(pi => new GetCategoryBySlugProductsResponseDto.Product.Image
                    {
                        Id = pi.Id,
                        Src = pi.Src,
                        Alt = pi.Alt,
                        Position = pi.Position,
                    }).ToList(),
                    Variants = cp.Product.ProductVariants.Select(pv => new GetCategoryBySlugProductsResponseDto.Product.Variant
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
                        Attributes = pv.ProductVariantAttributes.Select(pva => new GetCategoryBySlugProductsResponseDto.Product.Variant.Attribute
                        {
                            Type = new GetCategoryBySlugProductsResponseDto.Product.Variant.Attribute.AttributeType
                            {
                                Id = pva.ProductAttribute.Id,
                                Name = pva.ProductAttribute.Name,
                                Title = pva.ProductAttribute.Title,
                            },
                            Value = new GetCategoryBySlugProductsResponseDto.Product.Variant.Attribute.AttributeValue
                            {
                                Code = pva.ProductAttributeValue.Code,
                                Name = pva.ProductAttributeValue.Name,
                                Position = pva.ProductAttributeValue.Position,
                            },
                        }).ToList(),
                        Images = pv.ProductVariantImages.Select(pvi => new GetCategoryBySlugProductsResponseDto.Product.Variant.Image
                        {
                            Id = pvi.Id,
                            Src = pvi.Src,
                            Alt = pvi.Alt,
                            Position = pvi.Position,
                        }).ToList(),
                    }).ToList(),
                })
                .ToListAsync();

            var priceQuery = _context.CategoryProducts
                .Where(cp => cp.CategoryId == category.Id)
                .SelectMany(cp => cp.Product.ProductVariants)
                .Select(v => v.PriceCurrent);

            var priceMin = priceQuery.Count() > 0 ? await priceQuery.MinAsync() : 0.0m;
            var priceMax = priceQuery.Count() > 0 ? await priceQuery.MaxAsync() : 0.0m;

            var response = new GetCategoryBySlugProductsResponseDto
            {
                Products = products,
                Price = new GetCategoryBySlugProductsResponseDto.ProductPrice
                {
                    Min = priceMin,
                    Max = priceMax,
                }
            };

            return Ok(response);
        }
    }
}
