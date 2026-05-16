import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const name = localStorage.getItem('username');
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
        fetchExpenses(userId);
    }, []);

    const [expenses, setExpenses] = useState([]);
    const [todayTotal, setTodayTotal] = useState(0);
    const [yesterdayTotal, setYesterdayTotal] = useState(0);
    const [lastsevenTotal, setLastSevenTotal] = useState(0);
    const [lastmonthTotal, setLastMonthTotal] = useState(0);
    const [yeartotal, setYearTotal] = useState(0);
    const [endTotal, setEndTotal] = useState(0);

    const fetchExpenses = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/manage_expense/${userId}`);
            const data = await response.json();
            setExpenses(data);
            calculateTotals(data);
        }
        catch (error) {
            console.error("error fetching expenses", error)
        }
    };

    const calculateTotals = async (data) => {
        try {
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            const week = new Date();
            week.setDate(today.getDate() - 7);
            const month = new Date();
            month.setDate(today.getDate() - 30);
            const year = today.getFullYear();

            console.log("today", today);
            console.log("yesterday", yesterday);
            console.log("week", week);
            console.log("month", month);
            console.log("year", year);

            let todaySum = 0, yesterdaysum = 0, weeksum = 0, monthsum = 0, yearsum = 0, grandSum = 0;
            data.forEach(item => {
                const expenseDate = new Date(item.ExpenseDate);
                const amount = parseFloat(item.ExpenseCost) || 0;

                if (expenseDate.toDateString() === today.toDateString()) { todaySum += amount; }
                if (expenseDate.toDateString() === yesterday.toDateString()) { yesterdaysum += amount; }
                if (expenseDate >= week) { weeksum += amount; }
                if (expenseDate >= month) { monthsum += amount; }
                if (expenseDate.getFullYear() === year) { yearsum += amount; }
                grandSum += amount;
            });
            setTodayTotal(todaySum);
            setYesterdayTotal(yesterdaysum);
            setLastSevenTotal(weeksum);
            setLastMonthTotal(monthsum);
            setYearTotal(yearsum);
            setEndTotal(grandSum);
        }
        catch (error) {
            console.error('Error, Something went wrong', error);
        }
    }

    // {
    //     labels:['Milk','ice-cream']
    // datasets:[
    // data:[60,200,300]
    // background:['red','blue']
    // ]
    // }
    const pieData = {
        labels: expenses.map(exp => exp.ExpenseItem),
        datasets: [{
            label: 'Expense Cost',
            data: expenses.map(exp => parseFloat(exp.ExpenseCost)),
            backgroundColor: ['red', 'blue', '#00ff00', 'rgba(80, 10, 45, 0.5)','yellow'],
            borderWidth: 2,
        },
        ],
    }

    return (
        <div className='container mt-5'>
            <div className='text-center'>
                <h2>Welcome user {name}!</h2>
                <p>Here's your expense overview</p>
            </div>

            <div className='row g-4'>

                <div className='col-md-4'>
                    <div className='card bg-primary text-white text-center mb-3' style={{ height: '150px' }}>
                        <div className='card-body'>
                            <h5 className='card-title'><i className='fas fa-calendar-day me-2'></i>Today's expense</h5>
                            <p className='card-text fs-4'>(Rs.){todayTotal}</p>
                        </div>
                    </div>
                </div>

                <div className='col-md-4'>
                    <div className='card bg-warning text-white text-center mb-3' style={{ height: '150px' }}>
                        <div className='card-body'>
                            <h5 className='card-title'><i className='fas fa-calendar-day me-2'></i>Yesterday's expense</h5>
                            <p className='card-text fs-4'>(Rs.){yesterdayTotal}</p>
                        </div>
                    </div>
                </div>

                <div className='col-md-4'>
                    <div className='card bg-success text-white text-center mb-3' style={{ height: '150px' }}>
                        <div className='card-body'>
                            <h5 className='card-title'><i className='fas fa-calendar-day me-2'></i>Last 7 day's expense</h5>
                            <p className='card-text fs-4'>(Rs.){lastsevenTotal}</p>
                        </div>
                    </div>
                </div>

                <div className='col-md-4'>
                    <div className='card bg-primary text-white text-center mb-3' style={{ height: '150px' }}>
                        <div className='card-body'>
                            <h5 className='card-title'><i className='fas fa-calendar-day me-2'></i>Current month's expense</h5>
                            <p className='card-text fs-4'>(Rs.){lastmonthTotal}</p>
                        </div>
                    </div>
                </div>

                <div className='col-md-4'>
                    <div className='card bg-secondary text-white text-center mb-3' style={{ height: '150px' }}>
                        <div className='card-body'>
                            <h5 className='card-title'><i className='fas fa-calendar-day me-2'></i>Current Year's expense</h5>
                            <p className='card-text fs-4'>(Rs.){yeartotal}</p>
                        </div>
                    </div>
                </div>

                <div className='col-md-4'>
                    <div className='card bg-danger text-white text-center mb-3' style={{ height: '150px' }}>
                        <div className='card-body'>
                            <h5 className='card-title'><i className='fas fa-calendar-day me-2'></i>Overall expense</h5>
                            <p className='card-text fs-4'>(Rs.){endTotal}</p>
                        </div>
                    </div>
                </div>


            </div>

            <div className="my-5" style={{width:'400px', height:'400px',margin:'auto'}}>
                <h4 className='text-center'>Expense Distribution</h4>
                <p className='text-center'>you can select/unselect on any label below to get more detailed overview.</p>
                <Pie data={pieData}/>
            </div>

        </div>
    )
}
export default Dashboard;