package com.example.hr.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "quiz_responses")
public class QuizResponse {
    @Id
    private String id;
    private String quizId;
    private List<Answer> answers;
    private LocalDateTime submittedAt;
    private String respondentEmail;
    private String respondentName;
    private String respondentIp;
    private int completingTime; // Completion time in seconds
    private double score; // Quiz score

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuizId() {
        return quizId;
    }

    public void setQuizId(String quizId) {
        this.quizId = quizId;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getRespondentEmail() {
        return respondentEmail;
    }

    public void setRespondentEmail(String respondentEmail) {
        this.respondentEmail = respondentEmail;
    }

    public String getRespondentName() {
        return respondentName;
    }

    public void setRespondentName(String respondentName) {
        this.respondentName = respondentName;
    }

    public String getRespondentIp() {
        return respondentIp;
    }

    public void setRespondentIp(String respondentIp) {
        this.respondentIp = respondentIp;
    }

    public int getCompletingTime() {
        return completingTime;
    }

    public void setCompletingTime(int completingTime) {
        this.completingTime = completingTime;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Answer {
        private String questionId;
        private Object value; // Can be String or List<String>

        public String getQuestionId() {
            return questionId;
        }

        public void setQuestionId(String questionId) {
            this.questionId = questionId;
        }

        public Object getValue() {
            return value;
        }

        public void setValue(Object value) {
            this.value = value;
        }
    }
}
