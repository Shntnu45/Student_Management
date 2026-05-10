using Student_Management.Models;

namespace StudentManagementAPI.Services
{
    public interface IStudentService
    {
        Task<List<Student>> GetAllStudents();
        Task<Student> GetStudent(int id);
        Task AddStudent(Student student);
        Task UpdateStudent(Student student);
        Task DeleteStudent(int id);
    }
}