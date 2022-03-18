using System.Collections.Generic;
using System.Linq;
using System.Text;
using Backend.Entities.Models;
using Backend.Entities.Repositories;
using Backend.Entities.Requests;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WordController : ControllerBase
    {
        private readonly IWordRepository repository;

        public WordController(IWordRepository repository)
        {
            this.repository = repository;
        }

        [HttpGet("{id}")]
        public string GetWord(int id)
        {
            return repository.GetWord(id).Value;
        }

        [HttpGet("length")]
        public int GetLength()
        {
            return repository.GetLength();
        }

        [HttpPost]
        public string MakeGuess(GuessRequest request)
        {
            StringBuilder sb = new StringBuilder();
            string correctWord = GetWord(request.Id);
            for (var i = 0; i < 5; i++)
            {
                if (request.Value[i] == correctWord[i]) sb.Append('g');
                else if (correctWord.Contains(request.Value[i])) sb.Append('c');
                else sb.Append('w');
            }

            return sb.ToString();
        }
    }
}