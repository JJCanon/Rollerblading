package com.rollerblading.content.collaborator;

import com.rollerblading.content.common.CurrentUser;
import com.rollerblading.content.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class CollaboratorService {

    private final CollaboratorRepository repository;

    public CollaboratorService(CollaboratorRepository repository) {
        this.repository = repository;
    }

    public List<Collaborator> listForCurrentUser() {
        return CurrentUser.isAdmin()
                ? repository.findAllByOrderByOrderAsc()
                : repository.findByActiveTrueOrderByOrderAsc();
    }

    public Collaborator create(CollaboratorDtos.UpsertRequest req) {
        Instant now = Instant.now();
        Collaborator c = new Collaborator(
                null, req.name(), req.logoURL(), req.websiteURL(), req.type(), req.socialMedia(), req.active(),
                req.order(), now, now);
        return repository.save(c);
    }

    public Collaborator update(String id, CollaboratorDtos.UpsertRequest req) {
        Collaborator c = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Collaborator not found: " + id));
        c.setName(req.name());
        c.setLogoURL(req.logoURL());
        c.setWebsiteURL(req.websiteURL());
        c.setType(req.type());
        c.setSocialMedia(req.socialMedia());
        c.setActive(req.active());
        c.setOrder(req.order());
        c.setUpdateAt(Instant.now());
        return repository.save(c);
    }

    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Collaborator not found: " + id);
        }
        repository.deleteById(id);
    }
}