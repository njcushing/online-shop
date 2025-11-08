using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;

namespace Cafree.Api.Endpoints.Categories._Slug.GET
{
    [ApiController]
    [Route("api/categories/{slug}")]
    public class GetCategoryBySlugController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        [HttpGet]
        [ProducesResponseType(typeof(GetCategoryBySlugResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCategoryBySlug(string slug)
        {
            var category = await _context.Categories
                .Where(c => c.Slug == slug)
                .AsNoTracking()
                .AsSplitQuery()
                .Select(c => new GetCategoryBySlugResponseDto
                {
                    Name = c.Name,
                    Slug = c.Slug,
                    Description = c.Description,
                    Products = c.CategoryProducts.Select(cp => new GetCategoryBySlugResponseDto.Product
                    {
                        Id = cp.Product.Id,
                        Name = cp.Product.Name,
                        Slug = cp.Product.Slug,
                        Allowance = cp.Product.Allowance,
                        Tags = cp.Product.Tags,
                        ReleaseDate = cp.Product.ReleaseDate,
                        Rating = new GetCategoryBySlugResponseDto.Product.ProductRating
                        {
                            Average = cp.Product.ProductRating!.Average,
                            Total = cp.Product.ProductRating.Total,
                            Quantities = new GetCategoryBySlugResponseDto.Product.ProductRating.RatingQuantities
                            {
                                Rating5 = cp.Product.ProductRating.Rating5,
                                Rating4 = cp.Product.ProductRating.Rating4,
                                Rating3 = cp.Product.ProductRating.Rating3,
                                Rating2 = cp.Product.ProductRating.Rating2,
                                Rating1 = cp.Product.ProductRating.Rating1,
                            }
                        },
                        Attributes = cp.Product.ProductAttributeOrders.Select(pao => new GetCategoryBySlugResponseDto.Product.AttributeOrder
                        {
                            Position = pao.Position,
                            Name = pao.ProductAttribute.Name,
                            Title = pao.ProductAttribute.Title,
                        }).ToList(),
                        Images = cp.Product.ProductImages.Select(pi => new GetCategoryBySlugResponseDto.Product.Image
                        {
                            Id = pi.Id,
                            Src = pi.Src,
                            Alt = pi.Alt,
                            Position = pi.Position,
                        }).ToList(),
                        Variants = cp.Product.ProductVariants.Select(pv => new GetCategoryBySlugResponseDto.Product.Variant
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
                            Attributes = pv.ProductVariantAttributes.Select(pva => new GetCategoryBySlugResponseDto.Product.Variant.Attribute
                            {
                                Type = new GetCategoryBySlugResponseDto.Product.Variant.Attribute.AttributeType
                                {
                                    Id = pva.ProductAttribute.Id,
                                    Name = pva.ProductAttribute.Name,
                                    Title = pva.ProductAttribute.Title,
                                },
                                Value = new GetCategoryBySlugResponseDto.Product.Variant.Attribute.AttributeValue
                                {
                                    Code = pva.ProductAttributeValue.Code,
                                    Name = pva.ProductAttributeValue.Name,
                                    Position = pva.ProductAttributeValue.Position,
                                },
                            }).ToList(),
                            Images = pv.ProductVariantImages.Select(pvi => new GetCategoryBySlugResponseDto.Product.Variant.Image
                            {
                                Id = pvi.Id,
                                Src = pvi.Src,
                                Alt = pvi.Alt,
                                Position = pvi.Position,
                            }).ToList(),
                        }).ToList(),
                    }).ToList(),
                    Subcategories = c.InverseParent.Select(ip => new GetCategoryBySlugResponseDto.Subcategory
                    {
                        Name = ip.Name,
                        Slug = ip.Slug,
                        Description = ip.Description,
                    }).ToList(),
                })
                .FirstOrDefaultAsync();

            if (category == null) return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Category not found",
                detail: $"No category with the specified slug '{slug}' could be located."
            );

            return Ok(category);
        }
    }
}
