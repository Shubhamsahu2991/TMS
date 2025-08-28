
namespace taskmanagmentApi.Interface
{
    public interface IGetDataService
    {
        Task<List<T>> GetAllAsync<T>() where T : class;
    }
}
