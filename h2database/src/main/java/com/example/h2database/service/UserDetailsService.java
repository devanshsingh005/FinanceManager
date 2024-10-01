package com.example.h2database.service;

import com.example.h2database.model.UserDetails;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserDetailsService {

    public Map<String, Object> calculateFinancials(UserDetails userDetails) {
        Map<String, Object> results = new HashMap<>();

        double totalExpenses = userDetails.getExpenses().values().stream().mapToDouble(Double::doubleValue).sum();
        double totalLoans = userDetails.getLoans().stream().mapToDouble(Double::doubleValue).sum();
        double totalEMIs = userDetails.getEmis().stream().mapToDouble(Double::doubleValue).sum();
        
        double monthlySavings = userDetails.getIncome() - totalExpenses - totalEMIs;
        double loanToIncomeRatio = totalLoans / userDetails.getIncome();

        results.put("monthlySavings", monthlySavings);
        results.put("totalExpenses", totalExpenses);
        results.put("loanToIncomeRatio", loanToIncomeRatio);

        return results;
    }
}