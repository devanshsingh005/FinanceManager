import React, { useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
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
    } catch (error) {
      console.error('Error submitting form:', error);
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
          <p>Monthly Savings: ${results.monthlySavings}</p>
          <p>Loan-to-Income Ratio: {results.loanToIncomeRatio}</p>
          <div className="chart-container">
            <div>
              <h3>INCOME DISTRIBUTION</h3>
              {renderPieChart()}
            </div>
            <div>
              <h3>EXPENSE BREAKDOWN</h3>
              {renderBarChart()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialForm;