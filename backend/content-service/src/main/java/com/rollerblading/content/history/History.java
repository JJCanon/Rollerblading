package com.rollerblading.content.history;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "history")
public class History {
    @Id
    private String id = "history"; // singleton document
    private String title;
    private String contentMarkdown;
    private List<String> images;
    private String updatedBy;
    private Instant updatedAt;
}