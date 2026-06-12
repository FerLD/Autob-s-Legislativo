using PlantillaBackend.Http;
using Microsoft.AspNetCore.Diagnostics;
using System.Net;

namespace PlantillaBackend.MiddleWares;

public static class ExceptionMiddleware
{
    public static void ConfigureExceptionHandler(this IApplicationBuilder app)
    {
        app.UseExceptionHandler((appError) =>
        {
            appError.Run(async context =>
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";
                var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                if (contextFeature != null)
                {
                    var response = new Respuesta<IEnumerable<string>>();
                    response.Errors.Add(contextFeature.Error.Message);

                    await context.Response.WriteAsJsonAsync(response);
                }
            });
        });
    }
}
