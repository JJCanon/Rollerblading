package com.rollerblading.content.history;

import com.rollerblading.content.common.CurrentUser;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class HistoryService {

    private final HistoryRepository repository;

    public HistoryService(HistoryRepository repository) {
        this.repository = repository;
    }

    public History get() {
        return repository.findById("history")
                .orElseGet(() -> new History("history", "", "", List.of(), null, null));
    }

    public History update(HistoryDtos.UpdateHistoryRequest request) {
        History history = get();
        history.setTitle(request.title());
        history.setContentMarkdown(request.contentMarkdown());
        history.setImages(request.images());
        history.setUpdatedBy(CurrentUser.userId());
        history.setUpdatedAt(Instant.now());
        return repository.save(history);
    }
}