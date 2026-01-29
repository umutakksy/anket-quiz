package com.example.hr.repository;

import com.example.hr.model.QuizResponse;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface QuizResponseRepository extends MongoRepository<QuizResponse, String> {
    List<QuizResponse> findByQuizId(String quizId);
}
