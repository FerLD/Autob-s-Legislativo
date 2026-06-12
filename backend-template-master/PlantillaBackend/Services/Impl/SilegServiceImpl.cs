using PlantillaBackend.Model.Dtos;
using PlantillaBackend.Repositories;

namespace PlantillaBackend.Services.Impl;

public class SilegServiceImpl : ISilegService
{
    private readonly ISilegRepository _repository;
    private readonly JwtService _jwtService;

    public SilegServiceImpl(ISilegRepository repository, JwtService jwtService)
    {
        _repository = repository;
        _jwtService = jwtService;
    }

    public async Task<UsuarioDto?> GetUsuarioByEmailAsync(string email)
    {
        return await _repository.GetUsuarioByEmailAsync(email);
    }

    public async Task<AuthenticateResponse?> AuthenticateAsync(AuthenticateRequest request)
    {
        var usuario = await _repository.GetUsuarioByEmailAsync(request.UserName);
        
        if (usuario == null)
            return null;

        // Verify password using BCrypt
        bool isValid = BCrypt.Net.BCrypt.Verify(request.Password, usuario.EncryptedPassword);
        
        if (!isValid)
            return null;

        // Get roles
        var roles = await GetRolesForUserAsync(usuario.IdUsuario);

        // Generate token
        var token = _jwtService.GenerateToken(
            usuario.IdUsuario.ToString(), 
            usuario.Email,
            roles
        );

        return new AuthenticateResponse
        {
            Token = token,
            Usuario = usuario
        };
    }

    public async Task<IEnumerable<string>> GetRolesForUserAsync(int userId)
    {
        return await _repository.GetRolesForUserAsync(userId);
    }
}
