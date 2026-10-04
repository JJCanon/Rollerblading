package com.rollerblading.content.instagram;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "instagram_posts")
public class InstagramPost {

    @Id
    private String id;

    @Indexed(unique = true)
    private String instagramPostId;

    private String mediaURL;
    private MediaType mdiatype;
    private String caption;
    private String permalink;
    private Instant publishedAt;

    @Field("syncronizedAt")
    private Instant synchronizedAt;

    public enum MediaType {
        IMAGE, VIDEO, CAROUSEL
    }
}