// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information.

using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.ComponentModel;

namespace Backend.Utils
{
    internal class DescriptionSchemaFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            if (context.ParameterInfo != null)
            {
                var descriptionAttributes = context.ParameterInfo.GetCustomAttributes(typeof(DescriptionAttribute), false);

                if (descriptionAttributes.Length > 0)
                {
                    var descriptionAttribute = (DescriptionAttribute)descriptionAttributes[0];
                    schema.Description = descriptionAttribute.Description;
                }
            }

            if (context.MemberInfo != null)
            {
                var descriptionAttributes = context.MemberInfo.GetCustomAttributes(typeof(DescriptionAttribute), false);

                if (descriptionAttributes.Length > 0)
                {
                    var descriptionAttribute = (DescriptionAttribute)descriptionAttributes[0];
                    schema.Description = descriptionAttribute.Description;
                }
            }

            if (context.Type != null)
            {
                var descriptionAttributes = context.Type.GetCustomAttributes(typeof(DescriptionAttribute), false);

                if (descriptionAttributes.Length > 0)
                {
                    var descriptionAttribute = (DescriptionAttribute)descriptionAttributes[0];
                    schema.Description = descriptionAttribute.Description;
                }

            }
        }
    }
}
