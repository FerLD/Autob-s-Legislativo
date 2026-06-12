namespace PlantillaBackend.Http;

public class Respuesta<T>
{
    public T Datos { get; set; } = default!;
    public string Mensaje { get; set; } = string.Empty;
    public List<string> Errors { get; set; } = [];
}
