using System.Text.Json.Serialization;

namespace PlantillaBackend.Model.Dtos;

public class UsuarioDto
{
    public int IdUsuario { get; set; }
    public string Email { get; set; } = null!;
    public string? Nombre { get; set; }
    public string? Apellidos { get; set; }
    [JsonIgnore]
    public string EncryptedPassword { get; set; } = null!;
    public List<int> Roles { get; set; } = [];
}
