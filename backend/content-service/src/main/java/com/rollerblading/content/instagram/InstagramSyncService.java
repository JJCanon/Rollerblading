package com.rollerblading.content.instagram;

import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class InstagramSyncService {

    private final InstagramPostRepository repository;
    private final InstagramGraphClient graphClient;

    public InstagramSyncService(InstagramPostRepository repository, InstagramGraphClient graphClient) {
        this.repository = repository;
        this.graphClient = graphClient;
    }

    public List<InstagramPost> listAll() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "publishedAt"));
    }

    /** periodic Job (no real time), as architecture */
    @Scheduled(fixedDelayString = "${instagram.sync-interval-ms}")
    public void syncJob() {
        sync();
    }

    /** manual shot, just admin, through endpoint */
    public int sync() {
        List<InstagramPost> latest = graphClient.fetchLatestPosts();
        int upserts = 0;
        for (InstagramPost fetched : latest) {
            InstagramPost existing = repository.findByInstagramPostId(fetched.getInstagramPostId())
                    .orElse(null);
            if (existing == null) {
                fetched.setSynchronizedAt(Instant.now());
                repository.save(fetched);
            } else {
                existing.setCaption(fetched.getCaption());
                existing.setMediaURL(fetched.getMediaURL());
                existing.setPermalink(fetched.getPermalink());
                existing.setSynchronizedAt(Instant.now());
                repository.save(existing);
            }
            upserts++;
        }
        return upserts;
    }
}