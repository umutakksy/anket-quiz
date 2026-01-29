package com.example.hr.controller;

import com.example.hr.model.Quiz;
import com.example.hr.model.QuizResponse;
import com.example.hr.repository.QuizRepository;
import com.example.hr.repository.QuizResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizRepository quizRepository;
    private final QuizResponseRepository quizResponseRepository;

    public QuizController(QuizRepository quizRepository, QuizResponseRepository quizResponseRepository) {
        this.quizRepository = quizRepository;
        this.quizResponseRepository = quizResponseRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getQuizzes(@RequestParam(required = false) String department) {
        List<Quiz> quizzes;
        if (department != null && !department.isEmpty()) {
            quizzes = quizRepository.findAll().stream()
                    .filter(q -> q.getCreatorDepartment() == null || q.getCreatorDepartment().equals(department))
                    .toList();
        } else {
            quizzes = quizRepository.findAll();
        }
        Map<String, Object> response = new HashMap<>();
        response.put("quizzes", quizzes);
        response.put("total", quizzes.size());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {
        quiz.setStatus("DRAFT");
        quiz.setCreatedAt(LocalDateTime.now());
        quiz.setUpdatedAt(LocalDateTime.now());
        if (quiz.getQuestions() == null) {
            quiz.setQuestions(new ArrayList<>());
        }
        return ResponseEntity.ok(quizRepository.save(quiz));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable String id) {
        return quizRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable String id, @RequestBody Quiz quizDetails) {
        return quizRepository.findById(id).map(quiz -> {
            quiz.setTitle(quizDetails.getTitle());
            quiz.setDescription(quizDetails.getDescription());
            quiz.setAnonymous(quizDetails.isAnonymous());
            if (quizDetails.getTimeLimit() != null) {
                quiz.setTimeLimit(quizDetails.getTimeLimit());
            } else {
                quiz.setTimeLimit(null);
            }

            if (quizDetails.getSlug() != null && !quizDetails.getSlug().trim().isEmpty()) {
                // Check if slug is used by another quiz
                Optional<Quiz> existing = quizRepository.findBySlug(quizDetails.getSlug());
                if (existing.isPresent() && !existing.get().getId().equals(id)) {
                    // Slug taken
                } else {
                    quiz.setSlug(quizDetails.getSlug().toLowerCase().replaceAll("[^a-z0-9-]", "-"));
                }
            }
            quiz.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(quizRepository.save(quiz));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable String id) {
        quizRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/questions")
    public ResponseEntity<Quiz.QuizQuestion> addQuestion(@PathVariable String id,
            @RequestBody Quiz.QuizQuestion question) {
        return quizRepository.findById(id).map(quiz -> {
            question.setId(UUID.randomUUID().toString());
            quiz.getQuestions().add(question);
            quiz.setUpdatedAt(LocalDateTime.now());
            quizRepository.save(quiz);
            return ResponseEntity.ok(question);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/questions/{questionId}")
    public ResponseEntity<Quiz.QuizQuestion> updateQuestion(@PathVariable String id,
            @PathVariable String questionId, @RequestBody Quiz.QuizQuestion questionDetails) {
        return quizRepository.findById(id).map(quiz -> {
            for (Quiz.QuizQuestion q : quiz.getQuestions()) {
                if (q.getId().equals(questionId)) {
                    q.setText(questionDetails.getText());
                    q.setType(questionDetails.getType());
                    q.setRequired(questionDetails.isRequired());
                    q.setOptions(questionDetails.getOptions());
                    q.setCorrectOption(questionDetails.getCorrectOption());
                    q.setCorrectOptions(questionDetails.getCorrectOptions());
                    q.setOrder(questionDetails.getOrder());
                    break;
                }
            }
            quiz.setUpdatedAt(LocalDateTime.now());
            quizRepository.save(quiz);
            return ResponseEntity.ok(questionDetails);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable String id, @PathVariable String questionId) {
        quizRepository.findById(id).ifPresent(quiz -> {
            quiz.getQuestions().removeIf(q -> q.getId().equals(questionId));
            quiz.setUpdatedAt(LocalDateTime.now());
            quizRepository.save(quiz);
        });
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/questions/reorder")
    public ResponseEntity<Quiz> reorderQuestions(@PathVariable String id,
            @RequestBody Map<String, List<String>> payload) {
        List<String> questionIds = payload.get("questionIds");
        return quizRepository.findById(id).map(quiz -> {
            List<Quiz.QuizQuestion> questions = quiz.getQuestions();
            List<Quiz.QuizQuestion> reordered = new ArrayList<>();

            for (String qId : questionIds) {
                questions.stream()
                        .filter(q -> q.getId().equals(qId))
                        .findFirst()
                        .ifPresent(reordered::add);
            }

            // Update orders
            for (int i = 0; i < reordered.size(); i++) {
                reordered.get(i).setOrder(i + 1);
            }

            quiz.setQuestions(reordered);
            quiz.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(quizRepository.save(quiz));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<Map<String, Object>> publishQuiz(@PathVariable String id) {
        return quizRepository.findById(id).map(quiz -> {
            quiz.setStatus("PUBLISHED");
            quiz.setPublishedAt(LocalDateTime.now());

            // Only generate slug if not already set
            if (quiz.getSlug() == null || quiz.getSlug().isEmpty()) {
                quiz.setSlug(UUID.randomUUID().toString().substring(0, 8));
            }
            quizRepository.save(quiz);

            Map<String, Object> response = new HashMap<>();
            response.put("quiz", quiz);
            // In a real app this would use the actual base domain
            response.put("publicUrl", "/quiz/" + quiz.getSlug());
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<Quiz> closeQuiz(@PathVariable String id) {
        return quizRepository.findById(id).map(quiz -> {
            quiz.setStatus("CLOSED");
            quiz.setUpdatedAt(LocalDateTime.now());
            return ResponseEntity.ok(quizRepository.save(quiz));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/{slug}")
    public ResponseEntity<Quiz> getPublicQuiz(@PathVariable String slug) {
        return quizRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/public/{slug}/responses")
    public ResponseEntity<QuizResponse> submitResponse(@PathVariable String slug,
            @RequestBody QuizResponse response) {
        return quizRepository.findBySlug(slug).map(quiz -> {
            response.setQuizId(quiz.getId());
            response.setSubmittedAt(LocalDateTime.now());

            // Calculate score on backend for security
            double score = 0;
            int totalCorrectableQuestions = 0;

            for (Quiz.QuizQuestion q : quiz.getQuestions()) {
                if ("SINGLE_CHOICE".equals(q.getType()) || "MULTIPLE_CHOICE".equals(q.getType())) {
                    totalCorrectableQuestions++;

                    // Find user's answer for this question
                    Optional<QuizResponse.Answer> userAns = response.getAnswers().stream()
                            .filter(a -> a.getQuestionId().equals(q.getId()))
                            .findFirst();

                    if (userAns.isPresent()) {
                        Object val = userAns.get().getValue();
                        if ("SINGLE_CHOICE".equals(q.getType())) {
                            if (q.getCorrectOption() != null && q.getCorrectOption().equals(val)) {
                                score++;
                            }
                        } else if ("MULTIPLE_CHOICE".equals(q.getType()) && val instanceof List) {
                            List<String> userOptions = (List<String>) val;
                            List<String> correctOptions = q.getCorrectOptions();
                            if (correctOptions != null &&
                                    userOptions.size() == correctOptions.size() &&
                                    userOptions.containsAll(correctOptions)) {
                                score++;
                            }
                        }
                    }
                }
            }

            double finalScore = totalCorrectableQuestions > 0 ? (score / totalCorrectableQuestions) * 100 : 0;
            response.setScore(finalScore);

            return ResponseEntity.ok(quizResponseRepository.save(response));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/responses")
    public ResponseEntity<Map<String, Object>> getResponses(@PathVariable String id) {
        List<QuizResponse> responses = quizResponseRepository.findByQuizId(id);
        Map<String, Object> response = new HashMap<>();
        response.put("responses", responses);
        response.put("total", responses.size());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Object>> getStats(@PathVariable String id) {
        return quizRepository.findById(id).map(quiz -> {
            List<QuizResponse> responses = quizResponseRepository.findByQuizId(id);

            Map<String, Object> stats = new HashMap<>();
            stats.put("quizId", id);
            stats.put("totalResponses", responses.size());

            List<Map<String, Object>> questionStats = new ArrayList<>();
            for (Quiz.QuizQuestion q : quiz.getQuestions()) {
                if (!"TEXT".equals(q.getType())) {
                    Map<String, Object> qStat = new HashMap<>();
                    qStat.put("questionId", q.getId());
                    qStat.put("questionText", q.getText());

                    Map<String, Integer> distribution = new HashMap<>();
                    if (q.getOptions() != null) {
                        for (String opt : q.getOptions())
                            distribution.put(opt, 0);
                    }

                    for (QuizResponse r : responses) {
                        for (QuizResponse.Answer a : r.getAnswers()) {
                            if (a.getQuestionId().equals(q.getId())) {
                                if (a.getValue() instanceof String) {
                                    String val = (String) a.getValue();
                                    distribution.put(val, distribution.getOrDefault(val, 0) + 1);
                                } else if (a.getValue() instanceof List) {
                                    List<String> vals = (List<String>) a.getValue();
                                    for (String v : vals) {
                                        distribution.put(v, distribution.getOrDefault(v, 0) + 1);
                                    }
                                }
                            }
                        }
                    }
                    qStat.put("answerDistribution", distribution);
                    questionStats.add(qStat);
                }
            }
            stats.put("questionStats", questionStats);
            return ResponseEntity.ok(stats);
        }).orElse(ResponseEntity.notFound().build());
    }
}
