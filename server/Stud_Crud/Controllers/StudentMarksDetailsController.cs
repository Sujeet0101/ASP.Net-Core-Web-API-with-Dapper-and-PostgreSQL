using Microsoft.AspNetCore.Mvc;

using System.Data;

using Dapper;
using Npgsql;
using Stud_Crud.Models;

namespace Stud_Crud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentMarksDetailsController : ControllerBase
    {
        private readonly string? _connectionString;

        public StudentMarksDetailsController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Connection");
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStudentMarksDetails()
        {
            try
            {
                using (IDbConnection dbConnection = new NpgsqlConnection(_connectionString))
                {
                    string query = "SELECT * FROM StudentMarksDetails";
                    var studentMarksDetails = await dbConnection.QueryAsync<StudentMarksDetails>(query);
                    return Ok(studentMarksDetails);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddStudentMarksDetails(StudentMarksDetails studentMarksDetails)
        {
            try
            {
                using (IDbConnection dbConnection = new NpgsqlConnection(_connectionString))
                {
                    string query = @"INSERT INTO StudentMarksDetails (StudId, SubId, Marks) 
                                     VALUES (@StudId, @SubId, @Marks)";
                    await dbConnection.ExecuteAsync(query, studentMarksDetails);
                    return Ok("Student marks details added successfully");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");

            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudentMarksDetails(int id, StudentMarksDetails studentMarksDetails)
        {
            try
            {
                using (IDbConnection dbConnection = new NpgsqlConnection(_connectionString))
                {
                    string query = @"UPDATE StudentMarksDetails 
                                     SET StudId = @StudId, SubId = @SubId, Marks = @Marks
                                     WHERE Id = @Id";
                    studentMarksDetails.Id = id; // Ensure the ID matches the route parameter
                    await dbConnection.ExecuteAsync(query, studentMarksDetails);
                    return Ok("Student marks details updated successfully");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudentMarksDetails(int id)
        {
            try
            {
                using (IDbConnection dbConnection = new NpgsqlConnection(_connectionString))
                {
                    string query = "DELETE FROM StudentMarksDetails WHERE Id = @Id";
                    await dbConnection.ExecuteAsync(query, new { Id = id });
                    return Ok("Student marks details deleted successfully");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
