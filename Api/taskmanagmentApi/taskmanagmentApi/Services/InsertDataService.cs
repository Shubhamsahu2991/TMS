using taskmanagmentApi.Data;
using taskmanagmentApi.Interfaces;

namespace taskmanagmentApi.Services
{
    public class InsertDataService : IinsertDataService
    {
        private readonly AppDbContext _context;

        public InsertDataService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<T> InsertAsync<T>(T entity) where T : class
        {
            _context.Set<T>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

    }
}
