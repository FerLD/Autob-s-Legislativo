using PlantillaBackend.Http;
using PlantillaBackend.Model.Dtos;
using PlantillaBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PlantillaBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ISilegService _silegService;

    public AuthController(ISilegService silegService)
    {
        _silegService = silegService;
    }

    /// <summary>
    /// Login endpoint - No authorization required
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<Respuesta<AuthenticateResponse>>> Login([FromBody] AuthenticateRequest request)
    {
        var response = new Respuesta<AuthenticateResponse>();

        if (string.IsNullOrWhiteSpace(request.UserName) || string.IsNullOrWhiteSpace(request.Password))
        {
            response.Errors.Add("El usuario y contraseña son requeridos.");
            return BadRequest(response);
        }

        var result = await _silegService.AuthenticateAsync(request);

        if (result == null)
        {
            response.Errors.Add("Credenciales inválidas.");
            return Unauthorized(response);
        }

        response.Datos = result;
        response.Mensaje = "Login exitoso.";
        return Ok(response);
    }

    /// <summary>
    /// Get current user info - Requires authorization
    /// </summary>
    [HttpGet("me")]
    public async Task<ActionResult<Respuesta<UsuarioDto>>> GetCurrentUser()
    {
        var response = new Respuesta<UsuarioDto>();

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Sid);
        var emailClaim = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email);

        if (emailClaim == null)
        {
            response.Errors.Add("Usuario no autenticado.");
            return Unauthorized(response);
        }

        var usuario = await _silegService.GetUsuarioByEmailAsync(emailClaim.Value);

        if (usuario == null)
        {
            response.Errors.Add("Usuario no encontrado.");
            return NotFound(response);
        }

        response.Datos = usuario;
        return Ok(response);
    }
}
