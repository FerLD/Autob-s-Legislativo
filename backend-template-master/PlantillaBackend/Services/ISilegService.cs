using PlantillaBackend.Model.Dtos;

namespace PlantillaBackend.Services;

public interface ISilegService
{
    Task<UsuarioDto?> GetUsuarioByEmailAsync(string email);
    Task<AuthenticateResponse?> AuthenticateAsync(AuthenticateRequest request);
    Task<IEnumerable<string>> GetRolesForUserAsync(int userId);
}
