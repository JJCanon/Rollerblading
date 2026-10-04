package com.rollerblading.content.entrepreneurship;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content/entrepreneurship")
public class EntrepreneurshipController {

    private final EntrepreneurshipService service;

    public EntrepreneurshipController(EntrepreneurshipService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Entrepreneurship>> list() {
        return ResponseEntity.ok(service.listPublicOrAll());
    }

    @GetMapping("/mine")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Entrepreneurship>> mine() {
        return ResponseEntity.ok(service.listMine());
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLLER')")
    public ResponseEntity<Entrepreneurship> create(@Valid @RequestBody EntrepreneurshipDtos.CreateRequest req) {
        return ResponseEntity.status(201).body(service.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Entrepreneurship> update(@PathVariable String id,
            @Valid @RequestBody EntrepreneurshipDtos.UpdateRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @PatchMapping("/{id}/state")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Entrepreneurship> changeState(@PathVariable String id,
            @Valid @RequestBody EntrepreneurshipDtos.StateChangeRequest req) {
        return ResponseEntity.ok(service.changeState(id, req.state()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}