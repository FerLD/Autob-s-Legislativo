namespace PlantillaBackend.Model.Sileg;

public partial class User
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string EncryptedPassword { get; set; } = null!;

    public string? ResetPasswordToken { get; set; }

    public DateTime? ResetPasswordSentAt { get; set; }

    public DateTime? RememberCreatedAt { get; set; }

    public int? SignInCount { get; set; }

    public DateTime? CurrentSignInAt { get; set; }

    public DateTime? LastSignInAt { get; set; }

    public string? CurrentSignInIp { get; set; }

    public string? LastSignInIp { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? Nombre { get; set; }

    public string? Apellidos { get; set; }

    public string? Cargo { get; set; }

    public int? DepartamentoId { get; set; }

    public int? MedioId { get; set; }
}
