namespace taskmanagmentApi.Interfaces
{
    public interface IinsertDataService
    {
        Task<T> InsertAsync<T>(T entity) where T : class;
    }
   
}
