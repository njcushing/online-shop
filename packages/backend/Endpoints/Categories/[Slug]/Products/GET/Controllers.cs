using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;
using Cafree.Api.Models;
using System.Globalization;

namespace Cafree.Api.Endpoints.Categories._Slug.Products.GET
{
    [ApiController]
    [Route("api/categories/{slug}/products")]
    public class GetCategoryBySlugProductsController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;

        private const int MaxPageSize = 72;
        private const int MaxFilterStringLength = 2000;
        private const int MaxFilterValueCount = 50;

        private static readonly HashSet<string> AllowedSorts = new()
        {
            "best_sellers", "price_asc", "price_desc", "rating_desc", "created_desc"
        };

        public static Dictionary<string, string> ParseFilters(string? filterString)
        {
            var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            if (string.IsNullOrWhiteSpace(filterString)) return result;

            if (filterString.Length > MaxFilterStringLength) filterString = filterString[..MaxFilterStringLength];

            var filters = filterString.Split('~', StringSplitOptions.RemoveEmptyEntries);

            foreach (var filter in filters)
            {
                var parts = filter.Split('=', 2);
                if (parts.Length == 2) result[parts[0]] = parts[1];
            }

            return result;
        }

        private IQueryable<CategoryProduct> ApplyFilters(
            IQueryable<CategoryProduct> query,
            Dictionary<string, string> filters,
            Dictionary<string, ProductAttribute> categoryProductAttributeFilters
        )
        {
            foreach (var (name, value) in filters)
            {
                if (name.Equals("rating", StringComparison.OrdinalIgnoreCase))
                {
                    if (decimal.TryParse(value, NumberStyles.Number, CultureInfo.InvariantCulture, out var rating))
                    {
                        rating = Math.Clamp(rating, 1m, 5m);
                        query = query.Where(cp =>
                            cp.Product.ProductRating != null &&
                            cp.Product.ProductRating.Average >= rating
                        );
                    }
                    continue;
                }

                if (name.Equals("price", StringComparison.OrdinalIgnoreCase)) continue;

                if (!categoryProductAttributeFilters.TryGetValue(name, out var pa)) continue;

                switch (pa.ProductAttributeValueType.Name)
                {
                    case "text":
                        {
                            var values = value.Split('|', StringSplitOptions.RemoveEmptyEntries)
                                .Take(MaxFilterValueCount)
                                .ToList();
                            query = query.Where(cp =>
                                cp.Product.ProductVariants.Any(pv =>
                                    pv.Active &&
                                    pv.ProductVariantAttributes.Any(pva =>
                                        pva.ProductAttribute.Name == name &&
                                        pva.ProductAttribute.ProductAttributeValueType.Name == "text" &&
                                        values.Contains(pva.ProductAttributeValue.Code)
                                    )
                                )
                            );
                            break;
                        }
                    case "numeric":
                        {
                            if (!value.Contains("..")) break;

                            var parts = value.Split("..", 2);
                            if (parts.Length != 2) break;

                            bool lowerOk = decimal.TryParse(parts[0], NumberStyles.Number, CultureInfo.InvariantCulture, out var lower);
                            bool upperOk = decimal.TryParse(parts[1], NumberStyles.Number, CultureInfo.InvariantCulture, out var upper);

                            if (!lowerOk || !upperOk) break;

                            if (lower > upper) (lower, upper) = (upper, lower);

                            query = query.Where(cp =>
                                cp.Product.ProductVariants.Any(pv =>
                                    pv.Active &&
                                    pv.ProductVariantAttributes.Any(pva =>
                                        pva.ProductAttribute.Name == name &&
                                        pva.ProductAttribute.ProductAttributeValueType.Name == "numeric" &&
                                        pva.ProductAttributeValue.ValueNumeric >= lower &&
                                        pva.ProductAttributeValue.ValueNumeric <= upper
                                    )
                                )
                            );
                            break;
                        }
                    case "boolean":
                        {
                            query = query.Where(cp =>
                                cp.Product.ProductVariants.Any(pv =>
                                    pv.Active &&
                                    pv.ProductVariantAttributes.Any(pva =>
                                        pva.ProductAttribute.Name == name &&
                                        pva.ProductAttribute.ProductAttributeValueType.Name == "boolean" &&
                                        (
                                            value == "true" && pva.ProductAttributeValue.ValueBoolean == true ||
                                            value == "false" && !pva.ProductAttributeValue.ValueBoolean == false
                                        )
                                    )
                                )
                            );
                            break;
                        }
                    case "color":
                        {
                            var values = value.Split('|', StringSplitOptions.RemoveEmptyEntries).Take(MaxFilterValueCount).ToList();
                            query = query.Where(cp =>
                                cp.Product.ProductVariants.Any(pv =>
                                    pv.Active &&
                                    pv.ProductVariantAttributes.Any(pva =>
                                        pva.ProductAttribute.Name == name &&
                                        pva.ProductAttribute.ProductAttributeValueType.Name == "color" &&
                                        values.Contains(pva.ProductAttributeValue.Code)
                                    )
                                )
                            );
                            break;
                        }
                    case "date":
                        {
                            DateTimeOffset lower;
                            DateTimeOffset upper;

                            if (value.Contains(".."))
                            {
                                var parts = value.Split("..", 2);
                                if (parts.Length != 2) continue;

                                bool lowerOk = DateTimeOffset.TryParse(
                                    parts[0],
                                    CultureInfo.InvariantCulture,
                                    DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                                    out lower
                                );

                                bool upperOk = DateTimeOffset.TryParse(
                                    parts[1],
                                    CultureInfo.InvariantCulture,
                                    DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                                    out upper
                                );

                                if (!lowerOk || !upperOk) continue;

                                if (lower > upper)
                                    (lower, upper) = (upper, lower);

                                query = query.Where(cp =>
                                    cp.Product.ProductVariants.Any(pv =>
                                        pv.Active &&
                                        pv.ProductVariantAttributes.Any(pva =>
                                            pva.ProductAttribute.Name == name &&
                                            pva.ProductAttribute.ProductAttributeValueType.Name == "date" &&
                                            pva.ProductAttributeValue.ValueDate >= lower &&
                                            pva.ProductAttributeValue.ValueDate <= upper
                                        )
                                    )
                                );
                                break;
                            }

                            if (DateTimeOffset.TryParse(
                                value,
                                CultureInfo.InvariantCulture,
                                DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                                out lower
                            ))
                            {
                                query = query.Where(cp =>
                                    cp.Product.ProductVariants.Any(pv =>
                                        pv.Active &&
                                        pv.ProductVariantAttributes.Any(pva =>
                                            pva.ProductAttribute.Name == name &&
                                            pva.ProductAttribute.ProductAttributeValueType.Name == "date" &&
                                            pva.ProductAttributeValue.ValueDate >= lower
                                        )
                                    )
                                );
                            }
                            break;
                        }
                    case "select":
                        {
                            query = query.Where(cp =>
                                cp.Product.ProductVariants.Any(pv =>
                                    pv.Active &&
                                    pv.ProductVariantAttributes.Any(pva =>
                                        pva.ProductAttribute.Name == name &&
                                        pva.ProductAttribute.ProductAttributeValueType.Name == "select" &&
                                        value == pva.ProductAttributeValue.Code
                                    )
                                )
                            );
                            break;
                        }
                }
            }

            return query;
        }

        private IQueryable<CategoryProduct> ApplyPriceFilter(
            IQueryable<CategoryProduct> query,
            Dictionary<string, string> filters
        )
        {
            if (!filters.TryGetValue("price", out var value)) return query;
            if (!value.Contains("..")) return query;

            var parts = value.Split("..", 2);
            if (parts.Length != 2) return query;

            bool lowerOk = decimal.TryParse(parts[0], NumberStyles.Number, CultureInfo.InvariantCulture, out var lower);
            bool upperOk = decimal.TryParse(parts[1], NumberStyles.Number, CultureInfo.InvariantCulture, out var upper);

            if (!lowerOk || !upperOk) return query;

            if (lower > upper) (lower, upper) = (upper, lower);

            query = query.Where(cp =>
                cp.Product.ProductVariants.Any(pv =>
                    pv.Active &&
                    pv.PriceCurrent >= lower && pv.PriceCurrent <= upper
                )
            );

            return query;
        }

        private static IQueryable<CategoryProduct> ApplySorting(
            IQueryable<CategoryProduct> query,
            string? sort
        )
        {
            if (!AllowedSorts.Contains(sort ?? "")) sort = "best_sellers";

            return sort switch
            {
                "best_sellers" => query.OrderByDescending(cp => cp.Product.ProductVariants.Sum(v => v.TimesSold - v.TimesReturned)),
                "price_asc" => query.OrderBy(cp => cp.Product.ProductVariants.Min(v => v.PriceCurrent)),
                "price_desc" => query.OrderByDescending(cp => cp.Product.ProductVariants.Max(v => v.PriceCurrent)),
                "rating_desc" => query.OrderByDescending(cp => cp.Product.ProductRating != null ? cp.Product.ProductRating.Average : 0.0m),
                "created_desc" => query.OrderByDescending(cp => cp.Product.ReleaseDate),
                _ => query,
            };
        }

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

            int page = query.Page < 1 ? 1 : query.Page;
            int pageSize = Math.Clamp(query.PageSize ?? 12, 1, MaxPageSize);

            var productQuery = _context.CategoryProducts
                .Where(cp => cp.Product.Active && cp.CategoryId == category.Id)
                .AsNoTracking();

            var parsedFilters = ParseFilters(query.Filter);
            var categoryProductAttributeFilters = await _context.CategoryProductAttributeFilters
                .Where(cpaf => cpaf.CategoryId == category.Id)
                .Include(cpaf => cpaf.ProductAttribute)
                .Include(cpaf => cpaf.ProductAttribute.ProductAttributeValueType)
                .ToDictionaryAsync(cpaf => cpaf.ProductAttribute.Name, cpaf => cpaf.ProductAttribute, StringComparer.OrdinalIgnoreCase);

            productQuery = ApplyFilters(productQuery, parsedFilters, categoryProductAttributeFilters);
            productQuery = ApplySorting(productQuery, query.Sort);

            var priceQuery = productQuery
                .Where(cp => cp.CategoryId == category.Id)
                .SelectMany(cp => cp.Product.ProductVariants)
                .Select(v => v.PriceCurrent);

            var priceMin = priceQuery.Count() > 0 ? await priceQuery.MinAsync() : 0.0m;
            var priceMax = priceQuery.Count() > 0 ? await priceQuery.MaxAsync() : 0.0m;

            productQuery = ApplyPriceFilter(productQuery, parsedFilters);

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
                                pav.ProductVariantAttributes.Any(
                                    pva => pva.ProductVariant.Active && pva.ProductId == cp.Product.Id
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
                    })
                    .OrderBy(pao => pao.Position)
                    .ToList(),
                    Images = cp.Product.ProductImages.Select(pi => new GetCategoryBySlugProductsResponseDto.Product.Image
                    {
                        Id = pi.Id,
                        Src = pi.Src,
                        Alt = pi.Alt,
                        Position = pi.Position,
                    })
                    .OrderBy(pi => pi.Position)
                    .ToList(),
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
                        })
                        .OrderBy(pvi => pvi.Position)
                        .ToList(),
                    }).ToList(),
                })
                .ToListAsync();

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
