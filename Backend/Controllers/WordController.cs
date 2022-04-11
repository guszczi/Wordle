using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
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

        protected bool ValidateWord(string value)
        {
            return value.Length == 5 && Regex.IsMatch(value, @"^[a-zA-Z]+$");
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
        public IActionResult MakeGuess(GuessRequest request)
        {
            if (!ValidateWord(request.Value))
            {
                return BadRequest("Wrong input!");
            }
            StringBuilder sb = new StringBuilder();
            string correctWord = GetWord(request.Id);
            for (var i = 0; i < 5; i++)
            {
                String value = request.Value.ToLower();
                if (value[i] == correctWord[i]) sb.Append('g');
                else if (correctWord.Contains(value[i])) sb.Append('c');
                else sb.Append('w');
            }

            return Ok(sb.ToString());
        }
    }
}