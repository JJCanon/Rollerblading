package com.rollerblading.content.entrepreneurship;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EntrepreneurshipRepository extends MongoRepository<Entrepreneurship, String> {
    List<Entrepreneurship> findByState(Entrepreneurship.State state);

    List<Entrepreneurship> findByMemberUserId(String memberUserId);
}