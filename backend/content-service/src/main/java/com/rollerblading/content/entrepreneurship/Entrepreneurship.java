package com.rollerblading.content.entrepreneurship;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "entrepreneurship")
public class Entrepreneurship {
    @Id
    private String id;
    private String name;
    private String description;
    private Category category;

    @Indexed
    private String memberUserId;

    private Contact contact;
    private List<String> images;

    @Indexed
    private State state;

    private Instant createdAt;

    @Field("updateAt")
    private Instant updateAt;

    public enum Category {
        PRODUCT, SERVICE
    }

    public enum State {
        APPROVED, PENDING, REJECTED
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Contact {
        private String cellphone;
        private String whatsapp;
        private String instagram;
    }
}