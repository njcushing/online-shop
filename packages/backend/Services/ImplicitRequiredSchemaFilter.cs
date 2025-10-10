using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.OpenApi.Models;

namespace Cafree.Api.Services
{
    public class ImplicitRequiredSchemaFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema model, SchemaFilterContext context)
        {
            var additionalRequiredProps = model.Properties
            .Where(x => !x.Value.Nullable && !model.Required.Contains(x.Key))
            .Select(x => x.Key);
            foreach (var propKey in additionalRequiredProps)
            {
                model.Required.Add(propKey);
            }
        }
    }
}
