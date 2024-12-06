using course_work_backend.AppDBContext;
using course_work_backend.Model;
using System.Security.Cryptography;

namespace course_work_backend.Services
{
    public interface IUserService
    {
        public UserModel RegisterUser(UserModel userModel);
        public UserModel GetUserByID (int userID);
        public UserModel AuthenticateUser(string login, string password);
    }

    public class UserService : IUserService
    {
        private readonly ApplicationDBContext _dBContext;
        public UserService(ApplicationDBContext dbContext)
        {
            _dBContext = dbContext;
        }
        private string HashPassword(string password)
        {
            byte[] salt;
            byte[] buffer2;
            if (password == null)
            {
                throw new ArgumentNullException("password");
            }
            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, 0x10, 0x3e8))
            {
                salt = bytes.Salt;
                buffer2 = bytes.GetBytes(0x20);
            }
            byte[] dst = new byte[0x31];
            Buffer.BlockCopy(salt, 0, dst, 1, 0x10);
            Buffer.BlockCopy(buffer2, 0, dst, 0x11, 0x20);
            return Convert.ToBase64String(dst);
        }
        private bool VerifyHashedPassword(string hashedPassword, string password)
        {
            byte[] buffer4;
            if (hashedPassword == null)
            {
                return false;
            }
            if (password == null)
            {
                throw new ArgumentNullException("password");
            }
            byte[] src = Convert.FromBase64String(hashedPassword);
            if ((src.Length != 0x31) || (src[0] != 0))
            {
                return false;
            }
            byte[] dst = new byte[0x10];
            Buffer.BlockCopy(src, 1, dst, 0, 0x10);
            byte[] buffer3 = new byte[0x20];
            Buffer.BlockCopy(src, 0x11, buffer3, 0, 0x20);
            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, dst, 0x3e8))
            {
                buffer4 = bytes.GetBytes(0x20);
            }
            return ByteArraysEqual(buffer3, buffer4);
        }
        private bool ByteArraysEqual(byte[] b1, byte[] b2)
        {
            if (b1 == b2) return true;
            if (b1 == null || b2 == null) return false;
            if (b1.Length != b2.Length) return false;
            for (int i = 0; i < b1.Length; i++)
            {
                if (b1[i] != b2[i]) return false;
            }
            return true;
        }
        public UserModel RegisterUser(UserModel userModel)
        {
            userModel.HashPassword = HashPassword(userModel.HashPassword);

            if (string.IsNullOrEmpty(userModel.Login))
            {
                throw new Exception("Login can't be empty.");
            }

            if (string.IsNullOrEmpty(userModel.HashPassword))
            {
                throw new Exception("Password can't be empty.");
            }

            if (string.IsNullOrEmpty(userModel.Email))
            {
                throw new Exception("Email can't be empty.");
            }

            var isNewUser = _dBContext.Users.FirstOrDefault(u => u.Login == userModel.Login) == null;
            var isUniqueEmail = _dBContext.Users.FirstOrDefault(u => u.Email == userModel.Email) == null;

            if (!isNewUser)
            {
                throw new Exception("Such a login has already been registred.");
            }

            if (!isUniqueEmail)
            {
                throw new Exception("Such an email has already been registered.");
            }

            _dBContext.Users.Add(userModel);
            _dBContext.SaveChanges();
            return userModel;
        }
        public UserModel AuthenticateUser(string login, string password)
        {
            var user = _dBContext.Users.FirstOrDefault((user) => user.Login == login);
            if (user == null)
            {
                throw new Exception($"{login} is not found in DB.");
            }
            else if(!VerifyHashedPassword(user.HashPassword, password))
            {
                throw new Exception($"Wrong password!");
            }
            else
            {
                return user;
            }
        }
        public UserModel GetUserByID(int userID)
        {
            return  _dBContext
                   .Users
                   .FirstOrDefault((user) => user.Id == userID);
        }
    }
}