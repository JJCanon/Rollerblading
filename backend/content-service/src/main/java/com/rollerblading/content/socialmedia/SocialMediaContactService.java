package com.rollerblading.content.socialmedia;

import com.rollerblading.content.common.CurrentUser;
import com.rollerblading.content.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class SocialMediaContactService {

    private final SocialMediaContactRepository repository;

    public SocialMediaContactService(SocialMediaContactRepository repository) {
        this.repository = repository;
    }

    public List<SocialMediaContact> listForCurrentUser() {
        return CurrentUser.isAdmin()
                ? repository.findAllByOrderByOrderAsc()
                : repository.findByVisibleTrueOrderByOrderAsc();
    }

    public SocialMediaContact create(SocialMediaContactDtos.UpsertRequest req) {
        SocialMediaContact contact = new SocialMediaContact(
                null, req.platform(), req.value(), req.visible(), req.order(), Instant.now());
        return repository.save(contact);
    }

    public SocialMediaContact update(String id, SocialMediaContactDtos.UpsertRequest req) {
        SocialMediaContact contact = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Social media contact not found: " + id));
        contact.setPlatform(req.platform());
        contact.setValue(req.value());
        contact.setVisible(req.visible());
        contact.setOrder(req.order());
        contact.setUpdateAt(Instant.now());
        return repository.save(contact);
    }

    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Social media contact not found: " + id);
        }
        repository.deleteById(id);
    }
}