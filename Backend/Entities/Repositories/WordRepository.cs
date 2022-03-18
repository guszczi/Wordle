using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Entities.Models;

namespace Backend.Entities.Repositories
{
    public class WordRepository : IWordRepository
    {
        private readonly List<Word> _words;

        public WordRepository()
        {
            _words = LoadWords();
        }
        
        private static List<Word> LoadWords()
        {
            string[] lines = System.IO.File.ReadAllLines("./Data/words.txt");

            return lines.Select(line => new Word(line)).ToList();
        }

        public int GetLength()
        {
            return _words.Count;
        }

        public Word GetWord(int id)
        {
            return _words[id];
        }
    }
}