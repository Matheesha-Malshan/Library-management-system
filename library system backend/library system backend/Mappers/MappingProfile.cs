using AutoMapper;
using library_system_backend.Dto;
using library_system_backend.Models;

namespace library_system_backend.Mappers;

public class MappingProfile: Profile
{
    public MappingProfile()
    {
        CreateMap<BookCreateDto, Book>().ReverseMap();
        CreateMap<BookDto, Book>().ReverseMap();
        CreateMap<BookUpdateDto, Book>().ReverseMap();
    }
}