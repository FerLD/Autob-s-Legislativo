namespace PlantillaBackend.Model.Dtos;

public class AuthenticateResponse
{
    public string Token { get; set; } = null!;
    public UsuarioDto Usuario { get; set; } = null!;
}
