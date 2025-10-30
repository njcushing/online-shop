using Cafree.Api.Models;

namespace Cafree.Api.Endpoints.Products._Slug.GET
{
    public static class GetProductBySlugResponseMapper
    {
        private static GetProductBySlugResponseDto.CollectionProductDto ToCollectionProductDto(CollectionProduct collectionProduct)
        {
            return new GetProductBySlugResponseDto.CollectionProductDto
            {
                CollectionId = collectionProduct.CollectionId,
                Name = collectionProduct.Name,
            };
        }

        private static GetProductBySlugResponseDto.ProductCategoryDto.CategoryDto ToCategoryDto(Category category)
        {
            return new GetProductBySlugResponseDto.ProductCategoryDto.CategoryDto
            {
                Id = category.Id,
                ParentId = category.ParentId,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
            };
        }

        private static GetProductBySlugResponseDto.ProductCategoryDto ToProductCategoryDto(ProductCategory productCategory)
        {
            return new GetProductBySlugResponseDto.ProductCategoryDto
            {
                CategoryId = productCategory.CategoryId,
                Category = ToCategoryDto(productCategory.Category),
            };
        }

        private static GetProductBySlugResponseDto.ProductDetailDto ToProductDetailDto(ProductDetail productDetail)
        {
            return new GetProductBySlugResponseDto.ProductDetailDto
            {
                Id = productDetail.Id,
                Name = productDetail.Name,
                Value = productDetail.Value,
            };
        }

        private static GetProductBySlugResponseDto.ProductImageDto ToProductImageDto(ProductImage productImage)
        {
            return new GetProductBySlugResponseDto.ProductImageDto
            {
                Id = productImage.Id,
                Src = productImage.Src,
                Alt = productImage.Alt,
                Position = productImage.Position,
            };
        }

        private static GetProductBySlugResponseDto.ProductReviewDto ToProductReviewDto(ProductReview productReview)
        {
            return new GetProductBySlugResponseDto.ProductReviewDto
            {
                Id = productReview.Id,
                Title = productReview.Title,
                Description = productReview.Description,
                Rating = productReview.Rating,
            };
        }

        private static GetProductBySlugResponseDto.ProductVariantDto.ProductVariantAttributeDto.ProductAttributeDto ToProductAttributeDto(ProductAttribute productAttribute)
        {
            return new GetProductBySlugResponseDto.ProductVariantDto.ProductVariantAttributeDto.ProductAttributeDto
            {
                Id = productAttribute.Id,
                Name = productAttribute.Name,
                Title = productAttribute.Title,
            };
        }

        private static GetProductBySlugResponseDto.ProductVariantDto.ProductVariantAttributeDto.ProductAttributeValueDto ToProductAttributeValueDto(ProductAttributeValue productAttributeValue)
        {
            return new GetProductBySlugResponseDto.ProductVariantDto.ProductVariantAttributeDto.ProductAttributeValueDto
            {
                Code = productAttributeValue.Code,
                Name = productAttributeValue.Name,
            };
        }

        private static GetProductBySlugResponseDto.ProductVariantDto.ProductVariantAttributeDto ToProductVariantAttributeDto(ProductVariantAttribute productVariantAttribute)
        {
            return new GetProductBySlugResponseDto.ProductVariantDto.ProductVariantAttributeDto
            {
                ProductAttribute = ToProductAttributeDto(productVariantAttribute.ProductAttribute),
                ProductAttributeValue = ToProductAttributeValueDto(productVariantAttribute.ProductAttributeValue),
            };
        }

        private static GetProductBySlugResponseDto.ProductVariantDto.ProductVariantDetailDto ToProductVariantDetailDto(ProductVariantDetail productVariantDetail)
        {
            return new GetProductBySlugResponseDto.ProductVariantDto.ProductVariantDetailDto
            {
                Id = productVariantDetail.Id,
                ProductVariantId = productVariantDetail.ProductVariantId,
                Name = productVariantDetail.Name,
                Value = productVariantDetail.Value,
            };
        }

        private static GetProductBySlugResponseDto.ProductVariantDto ToProductVariantDto(ProductVariant productVariant)
        {
            return new GetProductBySlugResponseDto.ProductVariantDto
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
                ProductVariantAttributes = productVariant.ProductVariantAttributes.Select(ToProductVariantAttributeDto).ToList(),
                ProductVariantDetails = productVariant.ProductVariantDetails.Select(ToProductVariantDetailDto).ToList(),
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
                CollectionProducts = product.CollectionProducts.Select(ToCollectionProductDto).ToList(),
                ProductCategories = product.ProductCategories.Select(ToProductCategoryDto).ToList(),
                ProductDetails = product.ProductDetails.Select(ToProductDetailDto).ToList(),
                ProductImages = product.ProductImages.Select(ToProductImageDto).ToList(),
                ProductReviews = product.ProductReviews.Select(ToProductReviewDto).ToList(),
                ProductVariants = product.ProductVariants.Select(ToProductVariantDto).ToList(),
            };
        }
    }
}
