package com.rollerblading.content.socialmedia;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SocialMediaContactRepository extends MongoRepository<SocialMediaContact, String> {

    List<SocialMediaContact> findByVisibleTrueOrderByOrderAsc();

    List<SocialMediaContact> findAllByOrderByOrderAsc();
}