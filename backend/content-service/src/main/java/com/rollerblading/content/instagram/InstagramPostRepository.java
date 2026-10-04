package com.rollerblading.content.instagram;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface InstagramPostRepository extends MongoRepository<InstagramPost, String> {

    List<InstagramPost> findAll(Sort sort);

    Optional<InstagramPost> findByInstagramPostId(String instagramPostId);
}