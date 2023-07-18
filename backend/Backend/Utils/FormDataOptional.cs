using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace Backend.Utils
{
    public class SwaggerOptionalFormDataFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation.RequestBody?.Content.ContainsKey("multipart/form-data") ?? false)
            {
                foreach (var content in operation.RequestBody.Content)
                {
                    var requiredProps = content.Value.Schema.Required;
                    var props = content.Value.Schema.Properties;
                    foreach (var prop in props)
                    {
                        var paramterDescription = context.ApiDescription.ParameterDescriptions.FirstOrDefault(paramDesc => paramDesc.Name == prop.Key);
                        if (!requiredProps.Contains(prop.Key) && paramterDescription != null && paramterDescription.Type.IsReferenceOrNullableType())
                        {
                            prop.Value.Nullable = true;
                        }
                    }
                }
            }
        }
    }
}
