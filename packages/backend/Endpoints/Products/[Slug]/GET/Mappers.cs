using Cafree.Api.Models;

namespace Cafree.Api.Endpoints.Products._Slug.GET
{
    public static class GetProductBySlugResponseMapper
    {
        private static GetProductBySlugResponseDto.Collection.Product ToProduct(CollectionProduct collectionProduct)
        {
            return new GetProductBySlugResponseDto.Collection.Product
            {
                Id = collectionProduct.Product.Id,
                Name = collectionProduct.Name ?? collectionProduct.Product.Name,
                Slug = collectionProduct.Product.Slug,
                Position = collectionProduct.Position,
                Images = collectionProduct.Product.ProductImages.Select(ToProductImage).ToList(),
            };
        }

        private static GetProductBySlugResponseDto.Collection ToCollection(Collection collection)
        {
            return new GetProductBySlugResponseDto.Collection
            {
                Id = collection.Id,
                Name = collection.Name,
                Description = collection.Description,
                Slug = collection.Slug,
                Products = collection.CollectionProducts.OrderBy(cp => cp.Position).Select(ToProduct).ToList(),
            };
        }

        private static GetProductBySlugResponseDto.AttributeOrder ToAttributeOrder(ProductAttributeOrder productAttributeOrder)
        {
            return new GetProductBySlugResponseDto.AttributeOrder
            {
                Position = productAttributeOrder.Position,
                Name = productAttributeOrder.ProductAttribute.Name,
                Title = productAttributeOrder.ProductAttribute.Title,
            };
        }

        private static GetProductBySlugResponseDto.Category ToCategory(Models.Category category)
        {
            return new GetProductBySlugResponseDto.Category
            {
                Id = category.Id,
                ParentId = category.ParentId,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
            };
        }

        private static GetProductBySlugResponseDto.Detail ToDetail(ProductDetail productDetail)
        {
            return new GetProductBySlugResponseDto.Detail
            {
                Id = productDetail.Id,
                Name = productDetail.Name,
                Value = productDetail.Value,
            };
        }

        private static GetProductBySlugResponseDto.Image ToProductImage(ProductImage productImage)
        {
            return new GetProductBySlugResponseDto.Image
            {
                Id = productImage.Id,
                Src = productImage.Src,
                Alt = productImage.Alt,
                Position = productImage.Position,
            };
        }

        private static GetProductBySlugResponseDto.ProductRating ToProductRating(ProductRating productRating)
        {
            return new GetProductBySlugResponseDto.ProductRating
            {
                Average = productRating.Average,
                Total = productRating.Total,
                Quantities = new GetProductBySlugResponseDto.ProductRating.RatingQuantities
                {
                    Rating5 = productRating.Rating5,
                    Rating4 = productRating.Rating4,
                    Rating3 = productRating.Rating3,
                    Rating2 = productRating.Rating2,
                    Rating1 = productRating.Rating1,
                }
            };
        }

        private static GetProductBySlugResponseDto.Review ToReview(ProductReview productReview)
        {
            return new GetProductBySlugResponseDto.Review
            {
                Id = productReview.Id,
                VariantId = productReview.ProductVariantId,
                Title = productReview.Title,
                Description = productReview.Description,
                Rating = productReview.Rating,
                CreatedAt = productReview.CreatedAt,
            };
        }

        private static GetProductBySlugResponseDto.Variant.Attribute.AttributeType ToType(ProductAttribute productAttribute)
        {
            return new GetProductBySlugResponseDto.Variant.Attribute.AttributeType
            {
                Id = productAttribute.Id,
                Name = productAttribute.Name,
                Title = productAttribute.Title,
            };
        }

        private static GetProductBySlugResponseDto.Variant.Attribute.AttributeValue ToValue(ProductAttributeValue productAttributeValue)
        {
            return new GetProductBySlugResponseDto.Variant.Attribute.AttributeValue
            {
                Code = productAttributeValue.Code,
                Name = productAttributeValue.Name,
                Position = productAttributeValue.Position,
            };
        }

        private static GetProductBySlugResponseDto.Variant.Attribute ToAttribute(ProductVariantAttribute productVariantAttribute)
        {
            return new GetProductBySlugResponseDto.Variant.Attribute
            {
                Type = ToType(productVariantAttribute.ProductAttribute),
                Value = ToValue(productVariantAttribute.ProductAttributeValue),
            };
        }

        private static GetProductBySlugResponseDto.Variant.Detail ToDetail(ProductVariantDetail productVariantDetail)
        {
            return new GetProductBySlugResponseDto.Variant.Detail
            {
                Id = productVariantDetail.Id,
                Name = productVariantDetail.Name,
                Value = productVariantDetail.Value,
            };
        }

        private static GetProductBySlugResponseDto.Variant.Image ToProductVariantImage(ProductVariantImage productVariantImage)
        {
            return new GetProductBySlugResponseDto.Variant.Image
            {
                Id = productVariantImage.Id,
                Src = productVariantImage.Src,
                Alt = productVariantImage.Alt,
                Position = productVariantImage.Position,
            };
        }

        private static GetProductBySlugResponseDto.Variant ToVariant(ProductVariant productVariant)
        {
            return new GetProductBySlugResponseDto.Variant
            {
                Id = productVariant.Id,
                Name = productVariant.Name,
                Sku = productVariant.Sku,
                CanSubscribe = productVariant.CanSubscribe,
                PriceCurrent = productVariant.PriceCurrent,
                PriceBase = productVariant.PriceBase,
                SubscriptionDiscountPercentage = productVariant.SubscriptionDiscountPercentage,
                Stock = productVariant.Stock,
                AllowanceOverride = productVariant.AllowanceOverride,
                Active = productVariant.Active,
                ReleaseDate = productVariant.ReleaseDate,
                Attributes = productVariant.ProductVariantAttributes.Select(ToAttribute).ToList(),
                Details = productVariant.ProductVariantDetails.Select(ToDetail).ToList(),
                Images = productVariant.ProductVariantImages.Select(ToProductVariantImage).ToList(),
            };
        }

        public static GetProductBySlugResponseDto ToDto(Product product)
        {
            return new GetProductBySlugResponseDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Slug = product.Slug,
                Allowance = product.Allowance,
                Tags = product.Tags,
                ReleaseDate = product.ReleaseDate,
                Collections = product.CollectionProducts.Select(cp => ToCollection(cp.Collection)).ToList(),
                Attributes = product.ProductAttributeOrders.OrderBy(pao => pao.Position).Select(ToAttributeOrder).ToList(),
                Categories = product.CategoryProducts.Select(pc => ToCategory(pc.Category)).ToList(),
                Details = product.ProductDetails.Select(ToDetail).ToList(),
                Images = product.ProductImages.Select(ToProductImage).ToList(),
                Rating = ToProductRating(product.ProductRating!),
                Reviews = product.ProductReviews.Select(ToReview).ToList(),
                Variants = product.ProductVariants.Select(ToVariant).ToList(),
            };
        }
    }
}
