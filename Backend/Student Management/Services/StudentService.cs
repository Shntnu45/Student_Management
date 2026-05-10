using Student_Management.Models;
using Student_Management.Repository;


namespace StudentManagementAPI.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _repository;

        public StudentService(IStudentRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Student>> GetAllStudents()
        {
            return await _repository.GetAll();
        }

        public async Task<Student> GetStudent(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task AddStudent(Student student)
        {
            await _repository.Add(student);
        }

        public async Task UpdateStudent(Student student)
        {
            await _repository.Update(student);
        }

        public async Task DeleteStudent(int id)
        {
            var student = await _repository.GetById(id);

            if (student != null)
            {
                await _repository.Delete(student);
            }
        }
    }
}