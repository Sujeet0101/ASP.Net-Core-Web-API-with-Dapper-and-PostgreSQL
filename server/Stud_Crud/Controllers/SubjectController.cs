
using Microsoft.AspNetCore.Mvc;
using System.Data;
using Dapper;
using Npgsql;
using Stud_Crud.Models;

namespace Stud_Crud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
       
        private readonly string? _connectionString;

        public SubjectController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Connection");
        }

        [HttpGet]
        public async Task<IActionResult> GetSubjects()
        {
            using (IDbConnection dbConnection = new NpgsqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Subject";
                var subjects = await dbConnection.QueryAsync<Subject>(query);
                return Ok(subjects);
            }
        }
    }
}
