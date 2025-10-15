using Microsoft.EntityFrameworkCore;
using Cafree.Api.Services;
using Cafree.Api.Data;

var AllowSpecificOrigins = "";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SchemaFilter<ImplicitRequiredSchemaFilter>();
    c.SupportNonNullableReferenceTypes();
    c.UseAllOfToExtendReferenceSchemas();
    c.UseAllOfForInheritance();
});
builder.Services.AddProblemDetails();
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowSpecificOrigins, builder =>
    {
        builder.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors(AllowSpecificOrigins);

app.UseExceptionHandler();
app.UseStatusCodePages();

app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();
