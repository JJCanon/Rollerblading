package com.rollerblading.content.socialmedia;

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
@Document(collection = "social_media_contact")
public class SocialMediaContact {
    @Id
    private String id;
    private Platform platform;
    private String value;
    private boolean visible;
    private int order;

    @Field("updateAt")
    private Instant updateAt;

    public enum Platform {
        INSTAGRAM, FACEBOOK, TIKTOK, WHATSAPP, EMAIL, OTHER
    }
}