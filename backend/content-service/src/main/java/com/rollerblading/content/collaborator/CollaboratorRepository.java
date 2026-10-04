package com.rollerblading.content.collaborator;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CollaboratorRepository extends MongoRepository<Collaborator, String> {

    List<Collaborator> findByActiveTrueOrderByOrderAsc();

    List<Collaborator> findAllByOrderByOrderAsc();
}