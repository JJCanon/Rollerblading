package com.rollerblading.content.entrepreneurship;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class EntrepreneurshipDtos {

    public record CreateRequest(
            @NotBlank String name,
            @NotBlank String description,
            @NotNull Entrepreneurship.Category category,
            @Valid Entrepreneurship.Contact contact,
            List<String> images) {
    }

    public record UpdateRequest(
            @NotBlank String name,
            @NotBlank String description,
            @NotNull Entrepreneurship.Category category,
            @Valid Entrepreneurship.Contact contact,
            List<String> images) {
    }

    public record StateChangeRequest(
            @NotNull Entrepreneurship.State state) {
    }
}