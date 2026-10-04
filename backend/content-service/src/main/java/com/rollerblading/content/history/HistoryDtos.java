package com.rollerblading.content.history;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class HistoryDtos {

    public record UpdateHistoryRequest(
            @NotBlank String title,
            @NotBlank String contentMarkdown,
            List<String> images) {
    }
}