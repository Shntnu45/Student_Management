using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Student_Management.Models;
using StudentManagementAPI.Services;

namespace StudentManagementAPI.Controllers
{
    [Route("api/students")]
    [ApiController]
    [Authorize]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _service;

        public StudentController(IStudentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetStudents()
        {
            return Ok(await _service.GetAllStudents());
        }

        [HttpPost]
        public async Task<IActionResult> AddStudent(Student student)
        {
            await _service.AddStudent(student);
            return Ok("Student Added");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, Student student)
        {
            student.Id = id;
            await _service.UpdateStudent(student);
            return Ok("Student Updated");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            await _service.DeleteStudent(id);
            return Ok("Student Deleted");
        }
    }
}