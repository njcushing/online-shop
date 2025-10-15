using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;
using Cafree.Api.Dtos;
using Cafree.Api.Mappers;

namespace Cafree.Api.Controllers
{
    [ApiController]
    [Route("/api/settings")]
    public class SettingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SettingsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [ProducesResponseType(typeof(SettingsDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SettingsDto>> GetSettings()
        {
            var settings = await _context.Settings.SingleAsync();

            if (settings == null) return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Settings not found",
                detail: "No application settings could be located."
            );

            return Ok(SettingsMapper.ToDto(settings));
        }
    }
}
