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
                    Subcategories = c.InverseParent.Select(ip => new GetCategoryBySlugResponseDto.Subcategory
                    {
                        Name = ip.Name,
                        Slug = ip.Slug,
                        Description = ip.Description,
                    }).ToList(),
                    Filters = c.CategoryProductAttributeFilters.Select(cpaf => new GetCategoryBySlugResponseDto.Filter
                    {
                        Code = cpaf.ProductAttribute.Code,
                        Name = cpaf.ProductAttribute.Name,
                        Title = cpaf.ProductAttribute.Title,
                        Type = cpaf.ProductAttribute.ProductAttributeValueType.Name,
                        Values = _context.ProductVariantAttributes
                            .Where(pva =>
                                pva.ProductVariant.Active &&
                                pva.ProductAttributeId == cpaf.ProductAttributeId &&
                                c.CategoryProducts.Any(cp => cp.ProductId == pva.ProductId)
                            )
                            .GroupBy(pva => new
                            {
                                pva.ProductAttributeValue.Id,
                                pva.ProductAttributeValue.Code,
                                pva.ProductAttributeValue.Name,
                                pva.ProductAttributeValue.Position,
                                pva.ProductAttributeValue.ValueText,
                                pva.ProductAttributeValue.ValueNumeric,
                                pva.ProductAttributeValue.ValueBoolean,
                                pva.ProductAttributeValue.ValueColor,
                                pva.ProductAttributeValue.ValueDate,
                                pva.ProductAttributeValue.ValueSelect
                            })
                            .Select(g => new GetCategoryBySlugResponseDto.Filter.AttributeValue
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
                                    "",
                                Count = g.Select(pva => pva.ProductId)
                                    .Distinct()
                                    .Count()
                            })
                            .OrderBy(v => v.Position)
                            .ToList()
                    })
                    .ToList(),
                    ProductCount = c.CategoryProducts.Where(cp => cp.Product.Active).Count(),
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
