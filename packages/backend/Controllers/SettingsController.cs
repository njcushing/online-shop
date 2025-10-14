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
        public async Task<ActionResult<SettingsDto>> GetSettings()
        {
            var settings = await _context.Settings.SingleAsync();

            return Ok(SettingsMapper.ToDto(settings));
        }
    }
}
