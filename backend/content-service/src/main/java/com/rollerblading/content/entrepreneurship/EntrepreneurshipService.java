package com.rollerblading.content.entrepreneurship;

import com.rollerblading.content.common.CurrentUser;
import com.rollerblading.content.common.exception.ForbiddenActionException;
import com.rollerblading.content.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class EntrepreneurshipService {

    private final EntrepreneurshipRepository repository;

    public EntrepreneurshipService(EntrepreneurshipRepository repository) {
        this.repository = repository;
    }

    /** Invited and Roller just see APPROVED; Admin see all. */
    public List<Entrepreneurship> listPublicOrAll() {
        return CurrentUser.isAdmin()
                ? repository.findAll()
                : repository.findByState(Entrepreneurship.State.APPROVED);
    }

    /** Own entries from authenticated roller, wherever state. */
    public List<Entrepreneurship> listMine() {
        String userId = CurrentUser.userId();
        if (userId == null) {
            throw new ForbiddenActionException("Authentication required");
        }
        return repository.findByMemberUserId(userId);
    }

    public Entrepreneurship create(EntrepreneurshipDtos.CreateRequest req) {
        String userId = CurrentUser.userId();
        if (userId == null) {
            throw new ForbiddenActionException("Authentication required");
        }
        Instant now = Instant.now();
        Entrepreneurship e = new Entrepreneurship(
                null, req.name(), req.description(), req.category(), userId,
                req.contact(), req.images(), Entrepreneurship.State.PENDING, now, now);
        return repository.save(e);
    }

    /**
     * the owner just can edit; re-edit restart the check.
     */
    public Entrepreneurship update(String id, EntrepreneurshipDtos.UpdateRequest req) {
        Entrepreneurship e = findOrThrow(id);
        boolean owner = e.getMemberUserId().equals(CurrentUser.userId());

        if (!owner && !CurrentUser.isAdmin()) {
            throw new ForbiddenActionException("You cannot edit this entry");
        }

        e.setName(req.name());
        e.setDescription(req.description());
        e.setCategory(req.category());
        e.setContact(req.contact());
        e.setImages(req.images());
        e.setUpdateAt(Instant.now());
        if (owner && !CurrentUser.isAdmin()) {
            e.setState(Entrepreneurship.State.PENDING);
        }
        return repository.save(e);
    }

    /** Just admin Allows/Rejects. */
    public Entrepreneurship changeState(String id, Entrepreneurship.State newState) {
        Entrepreneurship e = findOrThrow(id);
        e.setState(newState);
        e.setUpdateAt(Instant.now());
        return repository.save(e);
    }

    public void delete(String id) {
        Entrepreneurship e = findOrThrow(id);
        boolean owner = e.getMemberUserId().equals(CurrentUser.userId());

        if (!owner && !CurrentUser.isAdmin()) {
            throw new ForbiddenActionException("You cannot delete this entry");
        }
        repository.deleteById(id);
    }

    private Entrepreneurship findOrThrow(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrepreneurship entry not found: " + id));
    }
}