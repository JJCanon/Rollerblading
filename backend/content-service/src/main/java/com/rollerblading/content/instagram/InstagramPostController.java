package com.rollerblading.content.instagram;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/content/instagram-posts")
public class InstagramPostController {

    private final InstagramSyncService service;

    public InstagramPostController(InstagramSyncService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<InstagramPost>> list() {
        return ResponseEntity.ok(service.listAll());
    }

    // there is no manual creation/edition: just synchronization
    @PostMapping("/sync")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> triggerSync() {
        int count = service.sync();
        return ResponseEntity.ok(Map.of("synced", count));
    }
}