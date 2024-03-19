
using Microsoft.AspNetCore.Mvc;

using System.Data;

using Dapper;
using Npgsql;
using Stud_Crud.Models;


namespace Stud_Crud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {

        //to read the connection string from app settings file we need to make use of dependency injection

        private readonly string? _connectionString;

        public StudentController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Connection");
        }

        [HttpGet]
        public async Task<IActionResult> GetStudents()
        {
            using (IDbConnection dbConnection = new NpgsqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Student";
                var students = await dbConnection.QueryAsync<Student>(query);
                return Ok(students);
            }
        }

    }
}
