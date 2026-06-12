using PlantillaBackend.DataContext;
using PlantillaBackend.Model.Dtos;
using Microsoft.EntityFrameworkCore;

namespace PlantillaBackend.Repositories.Impl;

public class SilegRepositoryImpl : ISilegRepository
{
    private readonly SilegContext _context;

    public SilegRepositoryImpl(SilegContext context)
    {
        _context = context;
    }

    public async Task<UsuarioDto?> GetUsuarioByEmailAsync(string email)
    {
        var user = await _context.Users
            .Where(u => u.Email == email)
            .FirstOrDefaultAsync();

        if (user == null)
            return null;

        var roles = await GetRoleIdsForUserAsync(user.Id);

        return new UsuarioDto
        {
            IdUsuario = user.Id,
            Email = user.Email,
            Nombre = user.Nombre,
            Apellidos = user.Apellidos,
            EncryptedPassword = user.EncryptedPassword,
            Roles = roles.ToList()
        };
    }

    public async Task<IEnumerable<string>> GetRolesForUserAsync(int userId)
    {
        var roleIds = await _context.RolesUsers
            .Where(ru => ru.UserId == userId)
            .Select(ru => ru.RoleId)
            .ToListAsync();

        var roles = await _context.Roles
            .Where(r => roleIds.Contains(r.Id))
            .Select(r => r.Nombre ?? "")
            .ToListAsync();

        return roles;
    }

    private async Task<IEnumerable<int>> GetRoleIdsForUserAsync(int userId)
    {
        return await _context.RolesUsers
            .Where(ru => ru.UserId == userId && ru.RoleId.HasValue)
            .Select(ru => ru.RoleId!.Value)
            .ToListAsync();
    }
}
