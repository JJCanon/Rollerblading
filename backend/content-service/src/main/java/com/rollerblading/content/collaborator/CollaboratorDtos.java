package com.rollerblading.content.collaborator;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CollaboratorDtos {
    public record UpsertRequest(
            @NotBlank String name,
            String logoURL,
            String websiteURL,
            @NotNull Collaborator.Type type,
            Collaborator.SocialMedia socialMedia,
            boolean active,
            int order) {
    }
}