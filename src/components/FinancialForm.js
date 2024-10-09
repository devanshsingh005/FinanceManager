import React, { useState } from 'react';
import axios from 'axios';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import '../styles/FinancialForm.css';
import '../styles/FinancialResults.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const FinancialForm = () => {
  const [formData, setFormData] = useState({
    income: '',
    expenses: {
      rent: '',
      utilities: '',
      groceries: '',
      transportation: '',
      other: '',
    },
    loans: [],
    emis: [],
    savingsGoal: '',
  });

  const [results, setResults] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [projectedExpenses, setProjectedExpenses] = useState(null);
  const [healthScore, setHealthScore] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('expenses.')) {
      const expenseKey = name.split('.')[1];
      setFormData(prevState => ({
        ...prevState,
        expenses: {
          ...prevState.expenses,
          [expenseKey]: value,
        },
      }));
    } else if (name === 'loans' || name === 'emis') {
      setFormData(prevState => ({
        ...prevState,
        [name]: value.split(',').map(item => item.trim()),
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    try {
      const dataToSubmit = {
        ...formData,
        income: parseFloat(formData.income) || 0,
        savingsGoal: parseFloat(formData.savingsGoal) || 0,
        expenses: Object.fromEntries(
          Object.entries(formData.expenses).map(([key, value]) => [key, parseFloat(value) || 0])
        ),
        loans: formData.loans.map(loan => parseFloat(loan) || 0),
        emis: formData.emis.map(emi => parseFloat(emi) || 0),
      };
      const response = await axios.post('http://localhost:8080/calculate', dataToSubmit);
      console.log('Response received:', response.data);
      setResults(response.data);
      generateAnalysis(response.data);
      generateProjectedExpenses(response.data);
      const score = calculateHealthScore(response.data);
      setHealthScore(score);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const generateProjectedExpenses = (results) => {
    const currentExpenses = Object.values(formData.expenses).reduce((sum, expense) => sum + parseFloat(expense || 0), 0);
    const projectedSavings = results.monthlySavings * 0.1; // Assume 10% of savings can be used to reduce expenses
    
    const projectedExpensesData = Object.fromEntries(
      Object.entries(formData.expenses).map(([category, amount]) => {
        const currentAmount = parseFloat(amount || 0);
        if (category === 'rent') {
          // Keep rent fixed
          return [category, currentAmount];
        } else {
          // Calculate reduction for other expenses
          const adjustableExpenses = currentExpenses - parseFloat(formData.expenses.rent || 0);
          const reduction = (currentAmount / adjustableExpenses) * projectedSavings;
          return [category, Math.max(0, currentAmount - reduction)];
        }
      })
    );

    setProjectedExpenses(projectedExpensesData);
  };

  const generateAnalysis = (results) => {
    const totalIncome = parseFloat(formData.income);
    const totalExpenses = results.totalExpenses;
    const monthlySavings = results.monthlySavings;
    const savingsGoal = parseFloat(formData.savingsGoal);

    let analysisText = [];

    // Savings analysis
    const savingsRate = (monthlySavings / totalIncome) * 100;

    analysisText.push(`Your current savings rate is ${savingsRate.toFixed(2)}% of your income.`);
    
    if (savingsRate > 0) {
      analysisText.push("It's great that you're able to save! Consider setting a specific savings goal if you haven't already.");
    } else {
      analysisText.push("You're currently not saving any money. Try to identify areas where you can reduce expenses to start building your savings.");
    }

    // Expense breakdown analysis
    const expensePercentages = Object.entries(formData.expenses).map(([category, amount]) => ({
      category,
      percentage: (parseFloat(amount) / totalIncome) * 100
    }));

    const highExpenseCategories = expensePercentages.filter(exp => exp.percentage > 30);
    if (highExpenseCategories.length > 0) {
      analysisText.push(`You're spending a high percentage on ${highExpenseCategories.map(exp => exp.category).join(', ')}. Consider ways to reduce these expenses.`);
    }

    // Debt analysis
    const totalDebt = [...formData.loans, ...formData.emis].reduce((sum, debt) => sum + parseFloat(debt), 0);
    const debtToIncomeRatio = (totalDebt / totalIncome) * 100;
    if (debtToIncomeRatio > 36) {
      analysisText.push("Your debt-to-income ratio is high. Focus on paying off high-interest debts and avoid taking on new loans.");
    }

    // Savings goal analysis
    if (savingsGoal > 0) {
      if (monthlySavings < savingsGoal) {
        const deficit = savingsGoal - monthlySavings;
        analysisText.push(`You're currently $${deficit.toFixed(2)} short of your monthly savings goal. Consider increasing your income or further reducing expenses.`);
      } else {
        analysisText.push("Congratulations! You're meeting or exceeding your savings goal.");
      }
    } else {
      analysisText.push("Consider setting a specific savings goal to help guide your financial planning.");
    }

    // General recommendations
    analysisText.push("Consider creating an emergency fund if you haven't already.");
    analysisText.push("Look into investment options to grow your wealth over time.");
    analysisText.push("Review your subscriptions and recurring expenses to identify potential savings.");

    // Add projected expenses analysis
    analysisText.push("Based on your current spending patterns, here's a projection for next month:");
    analysisText.push("- We've kept your rent expense fixed as it's typically a constant monthly payment.");
    analysisText.push("- For other expenses, we've projected potential reductions if you allocate 10% of your savings to expense reduction.");
    analysisText.push("- Focus on reducing non-essential expenses in categories other than rent to increase your savings rate.");

    setAnalysis(analysisText);
  };

  const calculateHealthScore = (results) => {
    const totalIncome = parseFloat(formData.income);
    const totalExpenses = results.totalExpenses;
    const monthlySavings = results.monthlySavings;
    const savingsGoal = parseFloat(formData.savingsGoal);
    const totalDebt = [...formData.loans, ...formData.emis].reduce((sum, debt) => sum + parseFloat(debt), 0);

    let score = 0;

    // Savings rate (0-35 points)
    const savingsRate = (monthlySavings / totalIncome) * 100;
    score += Math.min(35, savingsRate * 1.5);

    // Debt-to-income ratio (0-25 points)
    const debtToIncomeRatio = (totalDebt / totalIncome) * 100;
    if (debtToIncomeRatio <= 15) {
      score += 25;
    } else if (debtToIncomeRatio <= 30) {
      score += 20;
    } else if (debtToIncomeRatio <= 36) {
      score += 15;
    } else if (debtToIncomeRatio <= 43) {
      score += 10;
    } else {
      score += 5;
    }

    // Expense-to-income ratio (0-20 points)
    const expenseToIncomeRatio = (totalExpenses / totalIncome) * 100;
    if (expenseToIncomeRatio <= 50) {
      score += 20;
    } else if (expenseToIncomeRatio <= 60) {
      score += 15;
    } else if (expenseToIncomeRatio <= 70) {
      score += 10;
    } else if (expenseToIncomeRatio <= 80) {
      score += 5;
    }

    // Progress towards savings goal (0-15 points)
    if (savingsGoal > 0) {
      const progressToGoal = (monthlySavings / savingsGoal) * 100;
      score += Math.min(15, progressToGoal / 10);
    }

    // Emergency fund (0-5 points)
    const emergencyFund = monthlySavings * 6; // Assuming 6 months of savings as emergency fund
    const emergencyFundRatio = emergencyFund / totalExpenses;
    score += Math.min(5, emergencyFundRatio * 5);

    return Math.round(score);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 75) return '#8BC34A';
    if (score >= 60) return '#FFC107';
    if (score >= 45) return '#FF9800';
    return '#F44336';
  };

  const getScoreRecommendations = (score) => {
    if (score >= 90) {
      return "Excellent financial health! You're doing a great job managing your finances. Consider optimizing your investments and planning for long-term financial goals.";
    } else if (score >= 75) {
      return "Very good financial health. Keep up the good work and focus on increasing your savings rate and paying down any remaining debt.";
    } else if (score >= 60) {
      return "Good financial health. There's room for improvement. Focus on reducing expenses, increasing savings, and paying down high-interest debt.";
    } else if (score >= 45) {
      return "Fair financial health. Prioritize creating a budget, reducing unnecessary expenses, and building an emergency fund.";
    } else {
      return "Your financial health needs significant improvement. Create a strict budget, focus on paying down debt, and find ways to increase your income or reduce expenses dramatically.";
    }
  };

  const renderPieChart = () => {
    if (!results) return null;

    const data = {
      labels: ['Expenses', 'Savings'],
      datasets: [
        {
          data: [results.totalExpenses, results.monthlySavings],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB'],
        },
      ],
    };

    return <Pie data={data} />;
  };

  const renderBarChart = () => {
    if (!results) return null;

    const data = {
      labels: Object.keys(formData.expenses),
      datasets: [
        {
          label: 'Expense Breakdown',
          data: Object.values(formData.expenses).map(value => parseFloat(value) || 0),
          backgroundColor: 'rgba(75,192,192,0.6)',
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  const renderProjectedExpensesChart = () => {
    if (!projectedExpenses) return null;

    const currentData = Object.values(formData.expenses).map(value => parseFloat(value) || 0);
    const projectedData = Object.values(projectedExpenses);

    const data = {
      labels: Object.keys(formData.expenses),
      datasets: [
        {
          label: 'Current Expenses',
          data: currentData,
          backgroundColor: 'rgba(75,192,192,0.6)',
        },
        {
          label: 'Projected Expenses',
          data: projectedData,
          backgroundColor: 'rgba(255,99,132,0.6)',
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  const renderHealthScoreChart = () => {
    if (healthScore === null) return null;

    const data = {
      labels: ['Score', 'Remaining'],
      datasets: [
        {
          data: [healthScore, 100 - healthScore],
          backgroundColor: [getScoreColor(healthScore), '#E0E0E0'],
          borderWidth: 0,
        },
      ],
    };

    const options = {
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: false,
        },
        legend: {
          display: false,
        },
      },
    };

    return (
      <div style={{ position: 'relative', height: '200px', width: '200px' }}>
        <Doughnut data={data} options={options} />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <h3 style={{ margin: 0, color: getScoreColor(healthScore) }}>{healthScore}</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>Health Score</p>
        </div>
      </div>
    );
  };

  return (
    <div className="financial-form-container">
      <form onSubmit={handleSubmit} className="financial-form">
        <h2>FINANCIAL INFORMATION</h2>
        <div className="financial-form-group">
          <div>
            <label>Income:</label>
            <input type="number" name="income" value={formData.income} onChange={handleInputChange} />
          </div>
          <div>
            <label>Savings Goal:</label>
            <input type="number" name="savingsGoal" value={formData.savingsGoal} onChange={handleInputChange} />
          </div>
        </div>
        <h3>EXPENSES:</h3>
        <div className="financial-form-group">
          {Object.keys(formData.expenses).map((expense) => (
            <div key={expense}>
              <label>{expense.charAt(0).toUpperCase() + expense.slice(1)}:</label>
              <input
                type="number"
                name={`expenses.${expense}`}
                value={formData.expenses[expense]}
                onChange={handleInputChange}
              />
            </div>
          ))}
        </div>
        <div className="financial-form-group">
          <div>
            <label>Loans (comma-separated):</label>
            <input
              type="text"
              name="loans"
              value={formData.loans.join(', ')}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>EMIs (comma-separated):</label>
            <input
              type="text"
              name="emis"
              value={formData.emis.join(', ')}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button type="submit" className="financial-form-submit">CALCULATE</button>
      </form>

      {results && (
        <div className="financial-results">
          <h2>RESULTS</h2>
          <div className="results-overview">
            <div>
              <p>Monthly Savings: ${results.monthlySavings}</p>
              <p>Loan-to-Income Ratio: {results.loanToIncomeRatio}</p>
            </div>
            <div className="health-score-container">
              <h3>FINANCIAL HEALTH SCORE</h3>
              {renderHealthScoreChart()}
              <p>{getScoreRecommendations(healthScore)}</p>
            </div>
          </div>
          <div className="chart-container">
            <div>
              <h3>INCOME DISTRIBUTION</h3>
              {renderPieChart()}
            </div>
            <div>
              <h3>CURRENT EXPENSE BREAKDOWN</h3>
              {renderBarChart()}
            </div>
            <div>
              <h3>PROJECTED VS CURRENT EXPENSES</h3>
              {renderProjectedExpensesChart()}
            </div>
          </div>

          {analysis && (
            <div className="financial-analysis">
              <h3>FINANCIAL ANALYSIS & RECOMMENDATIONS</h3>
              <ul>
                {analysis.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialForm;