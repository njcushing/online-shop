using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafree.Api.Data;

namespace Cafree.Api.Endpoints.Settings.GET
{
    [ApiController]
    [Route("api/settings")]
    public class GetSettingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GetSettingsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [ProducesResponseType(typeof(GetSettingsResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetSettingsResponseDto>> GetSettings()
        {
            var settings = await _context.Settings.SingleAsync();

            if (settings == null) return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Settings not found",
                detail: "No application settings could be located."
            );

            return Ok(GetSettingsResponseMapper.ToDto(settings));
        }
    }
}
