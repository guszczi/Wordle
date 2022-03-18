using System.Collections.Generic;
using Backend.Entities.Models;

namespace Backend.Entities.Repositories
{
    public interface IWordRepository
    {
        public int GetLength();
        public Word GetWord(int id);
    }
}