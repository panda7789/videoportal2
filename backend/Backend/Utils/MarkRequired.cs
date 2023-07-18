using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Data;

namespace Backend.Utils
{
    public class MarkAsRequiredIfNonNullable : ISchemaFilter
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
