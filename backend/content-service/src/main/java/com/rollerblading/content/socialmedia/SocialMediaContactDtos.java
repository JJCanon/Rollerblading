package com.rollerblading.content.socialmedia;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SocialMediaContactDtos {
    public record UpsertRequest(
            @NotNull SocialMediaContact.Platform platform,
            @NotBlank String value,
            boolean visible,
            int order) {
    }
}