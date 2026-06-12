using PlantillaBackend.Model.Dtos;

namespace PlantillaBackend.Repositories;

public interface ISilegRepository
{
    Task<UsuarioDto?> GetUsuarioByEmailAsync(string email);
    Task<IEnumerable<string>> GetRolesForUserAsync(int userId);
}
