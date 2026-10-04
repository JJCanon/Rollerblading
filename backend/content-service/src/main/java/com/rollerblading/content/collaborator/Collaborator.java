package com.rollerblading.content.collaborator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "colaborators")
public class Collaborator {
    @Id
    private String id;
    private String name;
    private String logoURL;
    private String websiteURL;

    @Field("Type")
    private Type type;

    private SocialMedia socialMedia;
    private boolean active;
    private int order;

    @Field("createAt")
    private Instant createAt;

    @Field("updateAt")
    private Instant updateAt;

    public enum Type {
        SPONSOR, PARTNER, INSTITUTION, OTHER
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SocialMedia {
        private String instagram;
        private String facebook;
        private String tiktok;
        private String whatsapp;
        private String email;
    }
}
