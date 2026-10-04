package com.rollerblading.content.collaborator;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content/collaborators")
public class CollaboratorController {

    private final CollaboratorService service;

    public CollaboratorController(CollaboratorService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Collaborator>> list() {
        return ResponseEntity.ok(service.listForCurrentUser());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Collaborator> create(@Valid @RequestBody CollaboratorDtos.UpsertRequest req) {
        return ResponseEntity.status(201).body(service.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Collaborator> update(@PathVariable String id,
            @Valid @RequestBody CollaboratorDtos.UpsertRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}