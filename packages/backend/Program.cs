using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;

var AllowSpecificOrigins = "";

var builder = WebApplication.CreateBuilder(args);

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
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors(AllowSpecificOrigins);

app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();
