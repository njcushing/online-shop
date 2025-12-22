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
                .Where(p => p.Active && p.Slug == slug)
                .AsNoTracking()
                .AsSplitQuery()
                .Select(p => new GetProductBySlugResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Slug = p.Slug,
                    Allowance = p.Allowance,
                    Tags = p.Tags,
                    ReleaseDate = p.ReleaseDate,
                    Attributes = p.ProductAttributeOrders.Select(pao => new GetProductBySlugResponseDto.AttributeOrder
                    {
                        Position = pao.Position,
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
                            .Select(g => new GetProductBySlugResponseDto.AttributeOrder.AttributeValue
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
                    Categories = p.CategoryProducts.Select(cp => new GetProductBySlugResponseDto.Category
                    {
                        Id = cp.Category.Id,
                        ParentId = cp.Category.ParentId,
                        Name = cp.Category.Name,
                        Slug = cp.Category.Slug,
                        Description = cp.Category.Description,
                    }).ToList(),
                    Collections = p.CollectionProducts.Select(cp => new GetProductBySlugResponseDto.Collection
                    {
                        Id = cp.Collection.Id,
                        Name = cp.Collection.Name,
                        Title = cp.Collection.Title,
                        Description = cp.Collection.Description,
                        Slug = cp.Collection.Slug,
                        Products = cp.Collection.CollectionProducts.Select(ccp => new GetProductBySlugResponseDto.Collection.Product
                        {
                            Id = ccp.Product.Id,
                            Name = ccp.Name ?? ccp.Product.Name,
                            Slug = ccp.Product.Slug,
                            Position = ccp.Position,
                            Images = ccp.Product.ProductImages.Select(pi => new GetProductBySlugResponseDto.Image
                            {
                                Id = pi.Id,
                                Src = pi.Src,
                                Alt = pi.Alt,
                                Position = pi.Position,
                            })
                            .OrderBy(pi => pi.Position)
                            .ToList(),
                        })
                        .OrderBy(ccp => ccp.Position)
                        .ToList(),
                    }).ToList(),
                    Details = p.ProductDetails.Select(pi => new GetProductBySlugResponseDto.Detail
                    {
                        Id = pi.Id,
                        Name = pi.Name,
                        Value = pi.Value,
                    }).ToList(),
                    Images = p.ProductImages.Select(pi => new GetProductBySlugResponseDto.Image
                    {
                        Id = pi.Id,
                        Src = pi.Src,
                        Alt = pi.Alt,
                        Position = pi.Position,
                    })
                    .OrderBy(pi => pi.Position)
                    .ToList(),
                    Rating = new GetProductBySlugResponseDto.ProductRating
                    {
                        Average = p.ProductRating!.Average,
                        Total = p.ProductRating.Total,
                        Quantities = new GetProductBySlugResponseDto.ProductRating.RatingQuantities
                        {
                            Rating5 = p.ProductRating.Rating5,
                            Rating4 = p.ProductRating.Rating4,
                            Rating3 = p.ProductRating.Rating3,
                            Rating2 = p.ProductRating.Rating2,
                            Rating1 = p.ProductRating.Rating1,
                        }
                    },
                    Variants = p.ProductVariants.Where(pv => pv.Active).Select(pv => new GetProductBySlugResponseDto.Variant
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
                        Attributes = pv.ProductVariantAttributes.Select(pva => new GetProductBySlugResponseDto.Variant.Attribute
                        {
                            Type = new GetProductBySlugResponseDto.Variant.Attribute.AttributeType
                            {
                                Id = pva.ProductAttribute.Id,
                                Name = pva.ProductAttribute.Name,
                                Title = pva.ProductAttribute.Title,
                            },
                            Value = new GetProductBySlugResponseDto.Variant.Attribute.AttributeValue
                            {
                                Code = pva.ProductAttributeValue.Code,
                                Name = pva.ProductAttributeValue.Name,
                                Position = pva.ProductAttributeValue.Position,
                            },
                        }).ToList(),
                        Images = pv.ProductVariantImages.Select(pvi => new GetProductBySlugResponseDto.Variant.Image
                        {
                            Id = pvi.Id,
                            Src = pvi.Src,
                            Alt = pvi.Alt,
                            Position = pvi.Position,
                        })
                        .OrderBy(pvi => pvi.Position)
                        .ToList(),
                    }).ToList(),
                })
                .FirstOrDefaultAsync();

            if (product == null) return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Product not found",
                detail: $"No product with the specified slug '{slug}' could be located."
            );

            return Ok(product);
        }
    }
}
