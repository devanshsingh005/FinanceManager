package com.example.h2database.model;

import java.util.Map;
import java.util.List;

public class FinancialData{
    private double monthlyIncome;
    private Map<String, Double> expenses;
    private List<Double> loans;
    private List<String> futureGoals;
    private double savingsGoal;

    // Getters and setters
    public double getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public Map<String, Double> getExpenses() {
        return expenses;
    }

    public void setExpenses(Map<String, Double> expenses) {
        this.expenses = expenses;
    }

    public List<Double> getLoans() {
        return loans;
    }

    public void setLoans(List<Double> loans) {
        this.loans = loans;
    }

    public List<String> getFutureGoals() {
        return futureGoals;
    }

    public void setFutureGoals(List<String> futureGoals) {
        this.futureGoals = futureGoals;
    }

    public double getSavingsGoal() {
        return savingsGoal;
    }

    public void setSavingsGoal(double savingsGoal) {
        this.savingsGoal = savingsGoal;
    }
// End of Selection

    // Getters, setters, and constructor
}