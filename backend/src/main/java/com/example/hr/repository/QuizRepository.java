package com.example.hr.repository;

import com.example.hr.model.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    Optional<Quiz> findBySlug(String slug);
}
