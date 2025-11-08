using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;

namespace Cafree.Api.Endpoints.Categories._Name.GET
{
    [ApiController]
    [Route("api/categories/{name}")]
    public class GetCategoryByNameController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        [HttpGet]
        [ProducesResponseType(typeof(GetCategoryByNameResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCategoryByName(string name)
        {
            var category = await _context.Categories
                .Where(c => c.Name == name)
                .AsNoTracking()
                .AsSplitQuery()
                .Select(c => new GetCategoryByNameResponseDto
                {
                    Name = c.Name,
                    Slug = c.Slug,
                    Description = c.Description,
                    Products = c.CategoryProducts.Select(cp => new GetCategoryByNameResponseDto.Product
                    {
                        Id = cp.Product.Id,
                        Name = cp.Product.Name,
                        Slug = cp.Product.Slug,
                        Allowance = cp.Product.Allowance,
                        Tags = cp.Product.Tags,
                        ReleaseDate = cp.Product.ReleaseDate,
                        Rating = new GetCategoryByNameResponseDto.Product.ProductRating
                        {
                            Average = cp.Product.ProductRating!.Average,
                            Total = cp.Product.ProductRating.Total,
                            Quantities = new GetCategoryByNameResponseDto.Product.ProductRating.RatingQuantities
                            {
                                Rating5 = cp.Product.ProductRating.Rating5,
                                Rating4 = cp.Product.ProductRating.Rating4,
                                Rating3 = cp.Product.ProductRating.Rating3,
                                Rating2 = cp.Product.ProductRating.Rating2,
                                Rating1 = cp.Product.ProductRating.Rating1,
                            }
                        },
                        Attributes = cp.Product.ProductAttributeOrders.Select(pao => new GetCategoryByNameResponseDto.Product.AttributeOrder
                        {
                            Position = pao.Position,
                            Name = pao.ProductAttribute.Name,
                            Title = pao.ProductAttribute.Title,
                        }).ToList(),
                        Images = cp.Product.ProductImages.Select(pi => new GetCategoryByNameResponseDto.Product.Image
                        {
                            Id = pi.Id,
                            Src = pi.Src,
                            Alt = pi.Alt,
                            Position = pi.Position,
                        }).ToList(),
                        Variants = cp.Product.ProductVariants.Select(pv => new GetCategoryByNameResponseDto.Product.Variant
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
                            Attributes = pv.ProductVariantAttributes.Select(pva => new GetCategoryByNameResponseDto.Product.Variant.Attribute
                            {
                                Type = new GetCategoryByNameResponseDto.Product.Variant.Attribute.AttributeType
                                {
                                    Id = pva.ProductAttribute.Id,
                                    Name = pva.ProductAttribute.Name,
                                    Title = pva.ProductAttribute.Title,
                                },
                                Value = new GetCategoryByNameResponseDto.Product.Variant.Attribute.AttributeValue
                                {
                                    Code = pva.ProductAttributeValue.Code,
                                    Name = pva.ProductAttributeValue.Name,
                                    Position = pva.ProductAttributeValue.Position,
                                },
                            }).ToList(),
                            Images = pv.ProductVariantImages.Select(pvi => new GetCategoryByNameResponseDto.Product.Variant.Image
                            {
                                Id = pvi.Id,
                                Src = pvi.Src,
                                Alt = pvi.Alt,
                                Position = pvi.Position,
                            }).ToList(),
                        }).ToList(),
                    }).ToList(),
                    Subcategories = c.InverseParent.Select(ip => new GetCategoryByNameResponseDto.Subcategory
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
                detail: $"No category with the specified name '{name}' could be located."
            );

            return Ok(category);
        }
    }
}
