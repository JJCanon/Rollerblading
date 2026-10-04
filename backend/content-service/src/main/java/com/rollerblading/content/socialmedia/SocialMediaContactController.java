package com.rollerblading.content.socialmedia;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content/social-media")
public class SocialMediaContactController {

    private final SocialMediaContactService service;

    public SocialMediaContactController(SocialMediaContactService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SocialMediaContact>> list() {
        return ResponseEntity.ok(service.listForCurrentUser());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SocialMediaContact> create(@Valid @RequestBody SocialMediaContactDtos.UpsertRequest req) {
        return ResponseEntity.status(201).body(service.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SocialMediaContact> update(@PathVariable String id,
            @Valid @RequestBody SocialMediaContactDtos.UpsertRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}