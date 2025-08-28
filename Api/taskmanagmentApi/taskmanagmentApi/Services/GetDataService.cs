using taskmanagmentApi.Data;
using Microsoft.EntityFrameworkCore;
using taskmanagmentApi.Interface;


namespace taskmanagmentApi.Services
{
    public class GetDataService : IGetDataService
    {
        private readonly AppDbContext _context;

        public GetDataService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<T>> GetAllAsync<T>() where T : class
        {
            return await _context.Set<T>().ToListAsync();
        }
    }
}
 
