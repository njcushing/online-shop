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
                Images = collectionProduct.Product.ProductImages.Select(ToImage).ToList(),
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
                Products = collection.CollectionProducts.Select(ToProduct).ToList(),
            };
        }

        private static GetProductBySlugResponseDto.Category ToCategory(Category category)
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

        private static GetProductBySlugResponseDto.Image ToImage(ProductImage productImage)
        {
            return new GetProductBySlugResponseDto.Image
            {
                Id = productImage.Id,
                Src = productImage.Src,
                Alt = productImage.Alt,
                Position = productImage.Position,
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
                Categories = product.ProductCategories.Select(pc => ToCategory(pc.Category)).ToList(),
                Details = product.ProductDetails.Select(ToDetail).ToList(),
                Images = product.ProductImages.Select(ToImage).ToList(),
                Reviews = product.ProductReviews.Select(ToReview).ToList(),
                Variants = product.ProductVariants.Select(ToVariant).ToList(),
            };
        }
    }
}
