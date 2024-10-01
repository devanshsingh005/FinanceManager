package com.example.h2database.model;

import java.util.List;
import java.util.Map;

public class UserDetails {
    private double income;
    private Map<String, Double> expenses;
    private List<Double> loans;
    private List<Double> emis;
    private double savingsGoal;

    // Getters and setters
    public double getIncome() {
        return income;
    }

    public void setIncome(double income) {
        this.income = income;
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

    public List<Double> getEmis() {
        return emis;
    }

    public void setEmis(List<Double> emis) {
        this.emis = emis;
    }

    public double getSavingsGoal() {
        return savingsGoal;
    }

    public void setSavingsGoal(double savingsGoal) {
        this.savingsGoal = savingsGoal;
    }

    @Override
    public String toString() {
        return "UserDetails{" +
                "income=" + income +
                ", expenses=" + expenses +
                ", loans=" + loans +
                ", emis=" + emis +
                ", savingsGoal=" + savingsGoal +
                '}';
    }
}